import SkillAssessment from '../models/SkillAssessment.js';
import SkillSubmission from '../models/SkillSubmission.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

export const skillService = {
  // List all skill benchmark assessments
  listAssessments: async (category = null) => {
    const filter = category ? { category } : {};
    return SkillAssessment.find(filter)
      .select('-questions.correctIndex -questions.explanation')
      .sort({ totalTaken: -1 });
  },

  // Get single assessment questions (scrubbed of answers for candidate)
  getAssessmentForTaking: async (id) => {
    const assessment = await SkillAssessment.findById(id).lean();
    if (!assessment) {
      const error = new Error('Skill assessment not found');
      error.statusCode = 404;
      throw error;
    }

    const safeQuestions = assessment.questions.map((q) => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      difficulty: q.difficulty,
    }));

    return {
      ...assessment,
      questions: safeQuestions,
    };
  },

  // Submit assessment answers, auto-grade, record score, and award verified badge
  submitAssessment: async (studentId, assessmentId, userAnswers) => {
    const assessment = await SkillAssessment.findById(assessmentId);
    if (!assessment) {
      const error = new Error('Skill assessment not found');
      error.statusCode = 404;
      throw error;
    }

    let correctCount = 0;
    const totalQuestions = assessment.questions.length;

    // userAnswers: array of { questionId, selectedIndex }
    const answerMap = new Map();
    for (const ans of userAnswers || []) {
      answerMap.set(String(ans.questionId), Number(ans.selectedIndex));
    }

    const breakdown = assessment.questions.map((q) => {
      const userChoice = answerMap.get(String(q._id));
      const isCorrect = userChoice === q.correctIndex;
      if (isCorrect) correctCount += 1;
      return {
        questionId: q._id,
        isCorrect,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      };
    });

    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= assessment.passingScore;

    const submission = await SkillSubmission.create({
      student: studentId,
      assessment: assessmentId,
      skillName: assessment.title,
      score,
      passed,
      totalQuestions,
      correctAnswers: correctCount,
    });

    // Update aggregate test metrics
    await SkillAssessment.findByIdAndUpdate(assessmentId, {
      $inc: { totalTaken: 1 },
    });

    // If passed, elevate student reputation score, add skill, and dispatch notification
    if (passed) {
      const student = await User.findById(studentId);
      if (student) {
        // Boost reputation score
        const newReputation = Math.min(100, (student.reputationScore ?? 0) + 5);

        // Check if skill exists, else push
        const existingSkillIndex = student.skills.findIndex(
          (s) => s.name.toLowerCase() === assessment.title.toLowerCase()
        );

        if (existingSkillIndex >= 0) {
          student.skills[existingSkillIndex].level = score >= 90 ? 'expert' : 'advanced';
        } else {
          student.skills.push({
            name: assessment.title,
            level: score >= 90 ? 'expert' : 'advanced',
            endorsedCount: 1,
          });
        }

        student.reputationScore = newReputation;
        await student.save();

        // Create in-app celebration notification
        await Notification.create({
          user: studentId,
          title: 'Skill Verified!',
          desc: `${assessment.title} assessment passed with score ${score}%. Verified badge awarded.`,
          type: 'verification',
          link: '/profile',
        });
      }
    }

    return {
      submission,
      passed,
      score,
      correctAnswers: correctCount,
      totalQuestions,
      breakdown,
    };
  },

  // Get user's verified submissions
  getMySubmissions: async (studentId) => {
    return SkillSubmission.find({ student: studentId })
      .populate('assessment', 'title category badgeName')
      .sort({ completedAt: -1 });
  },
};

import { skillService } from '../services/skillService.js';

export const skillController = {
  // List all benchmark assessments
  list: async (req, res, next) => {
    try {
      const { category } = req.query;
      const assessments = await skillService.listAssessments(category);
      res.json({ success: true, data: assessments });
    } catch (error) {
      next(error);
    }
  },

  // Get test questions for taking
  getForTaking: async (req, res, next) => {
    try {
      const assessment = await skillService.getAssessmentForTaking(req.params.id);
      res.json({ success: true, data: assessment });
    } catch (error) {
      next(error);
    }
  },

  // Submit test answers and grade
  submit: async (req, res, next) => {
    try {
      const studentId = req.user.id;
      const { id } = req.params;
      const { answers } = req.body;

      const result = await skillService.submitAssessment(studentId, id, answers);

      res.status(201).json({
        success: true,
        message: result.passed
          ? 'Congratulations! You passed the assessment.'
          : 'Assessment complete. Score did not reach passing threshold.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get current student's test history & certificates
  mySubmissions: async (req, res, next) => {
    try {
      const studentId = req.user.id;
      const submissions = await skillService.getMySubmissions(studentId);
      res.json({ success: true, data: submissions });
    } catch (error) {
      next(error);
    }
  },
};

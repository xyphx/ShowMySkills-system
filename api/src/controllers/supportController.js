import SupportTicket from '../models/SupportTicket.js';

const defaultFaqs = [
  {
    q: 'How does skill verification work on ShowMySkills?',
    a: 'Skill verification is performed through target technical competency assessments, GitHub repository code inspections, and practical coding challenges on the Launchpad. Once verified, official competency verification and scores appear on your profile and applications.',
    category: 'Verification',
  },
  {
    q: 'Are paid plans required to apply for internships?',
    a: 'No! The Free Student Plan is completely free forever. You can search verified internships, apply to up to 10 openings each month, build your portfolio, and communicate with employers without any fees.',
    category: 'Billing & Plans',
  },
  {
    q: 'How do partner companies view my application?',
    a: 'When you apply to an internship, recruiters see your verified competency score, public projects, college department, and resume summary directly inside their ATS pipeline. They can review, shortlist, and message you directly.',
    category: 'Applications',
  },
  {
    q: 'How can I track my submitted applications?',
    a: 'You can track your application status under the Internships section (Saved / Applied tab) and view real-time recruiter updates in your Notifications bell and Chats tab.',
    category: 'Applications',
  },
  {
    q: 'How do I link my college Training & Placement Cell (TPO)?',
    a: 'Enter your university name during profile setup. If your institution is accredited on ShowMySkills, your verified test scores and placement achievements will automatically synchronize with your college placement dashboard.',
    category: 'University Relations',
  },
];

export const supportController = {
  // Submit support ticket or contact message
  submitTicket: async (req, res, next) => {
    try {
      const { name, email, category, subject, message } = req.body;

      if (!name || !email || !subject || !message) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, subject, and message are required fields',
        });
      }

      const ticket = await SupportTicket.create({
        name,
        email,
        category: category || 'General Inquiry',
        subject,
        message,
        status: 'open',
      });

      res.status(201).json({
        success: true,
        message: 'Your inquiry has been received. Our team will contact you within 24 hours.',
        data: ticket,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get FAQs list with search/category support
  getFaqs: async (req, res, next) => {
    try {
      const { search } = req.query;
      let faqs = defaultFaqs;

      if (search) {
        const query = search.toLowerCase();
        faqs = faqs.filter(
          (f) => f.q.toLowerCase().includes(query) || f.a.toLowerCase().includes(query)
        );
      }

      res.json({
        success: true,
        data: faqs,
      });
    } catch (error) {
      next(error);
    }
  },
};

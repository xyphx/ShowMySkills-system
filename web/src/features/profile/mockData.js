/**
 * studentProfileData — Mock data for the Student Profile View (STU-02).
 *
 * Contains all profile-related fields consumed by the profile page
 * and its child card components.
 */
export const studentProfileData = {
  /* ──── Identity ──── */
  name: "Rahul Kumar",
  verified: true,
  title: "UI/UX Designer",
  college: "ABC Engineering College",
  location: "Hyderabad, India",
  openToWorkMessage: "Open to internships and full-time opportunities",
  avatarUrl: null, // null → fallback to initials
  primarySkills: ["UI/UX Design", "UX Research", "Figma"],

  /* ──── Profile Completion ──── */
  completionPercentage: 85,

  /* ──── Reputation Score ──── */
  reputationScore: 85,
  reputationMax: 100,
  topPercentile: "Top 10% in UI/UX",
  metrics: [
    { label: "Project Quality", value: 95, color: "#14b8a6" },
    { label: "Endorsements", value: 45, color: "#14b8a6" },
    { label: "Consistency", value: 70, color: "#14b8a6" },
  ],

  /* ──── About ──── */
  aboutText:
    "I'm a passionate UI/UX designer focused on creating simple, accessible and user-friendly digital experiences. I enjoy understanding user problems, conducting research and transforming ideas into intuitive interfaces.",

  /* ──── Skills ──── */
  skillsList: [
    { name: "UI/UX Design", level: "expert" },
    { name: "UX Research", level: "advanced" },
    { name: "Wireframing", level: "advanced" },
    { name: "Prototyping", level: "expert" },
    { name: "Figma", level: "expert" },
    { name: "User Flows", level: "advanced" },
    { name: "Interaction Design", level: "expert" },
    { name: "Usability Testing", level: "intermediate" },
  ],

  /* ──── Projects ──── */
  projectsList: [
    {
      id: "p1",
      title: "E-Commerce Redesign",
      description:
        "A complete UX overhaul for a mid-size fashion e-commerce platform, improving checkout conversion by 32%.",
      tags: ["UI/UX", "E-Commerce", "Figma"],
      verified: true,
    },
    {
      id: "p2",
      title: "Health Tracker App",
      description:
        "Designed a mobile-first health & fitness tracker with gamification elements, achieving 4.6★ on the Play Store.",
      tags: ["Mobile", "Health", "Prototyping"],
      verified: true,
    },
    {
      id: "p3",
      title: "University Portal Redesign",
      description:
        "Led the student-facing portal redesign for ABC Engineering College, reducing support tickets by 40%.",
      tags: ["Web App", "Research", "Wireframing"],
      verified: false,
    },
  ],
};

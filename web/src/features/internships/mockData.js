/**
 * Mock internship data for the Internship Discovery Feed (INT-03).
 * Matches the Figma dashboard layout — no backend dependencies.
 */

export const mockInternships = [
  {
    id: "int-001",
    companyName: "WebShark Web Services",
    companyLogoText: "WEBSHARK",
    companyLogoSubText: "WEB SERVICES",
    roleTitle: "UI/UX Design Intern",
    location: "Bangalore",
    stipend: "15,000-20,000",
    duration: "6 Months",
    skills: ["React", "Node.js", "Socket.io", "MongoDB", "Java", "Spring Boot"],
    isVerified: true,
    jobType: "Full time",
    postedTime: "8 hours ago",
    description:
      "Key Responsibilities: Research and identify potential leads in target markets, target markets. Reach out to prospects markets.",
  },
  {
    id: "int-002",
    companyName: "TechNova Solutions",
    companyLogoText: "TECHNOVA",
    companyLogoSubText: "SOLUTIONS",
    roleTitle: "Frontend Developer Intern",
    location: "Remote",
    stipend: "20,000-25,000",
    duration: "3 Months",
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Git"],
    isVerified: true,
    jobType: "Full time",
    postedTime: "2 days ago",
    description:
      "Key Responsibilities: Build responsive UI components, collaborate with design team, write clean and maintainable code.",
  },
  {
    id: "int-003",
    companyName: "CloudPeak Analytics",
    companyLogoText: "CLOUDPEAK",
    companyLogoSubText: "ANALYTICS",
    roleTitle: "Data Science Intern",
    location: "Hyderabad",
    stipend: "18,000-22,000",
    duration: "4 Months",
    skills: ["Python", "Pandas", "TensorFlow", "SQL", "Tableau"],
    isVerified: false,
    jobType: "Part time",
    postedTime: "1 day ago",
    description:
      "Key Responsibilities: Analyze large datasets, build predictive models, create dashboards for business insights.",
  },
  {
    id: "int-004",
    companyName: "FinEdge Technologies",
    companyLogoText: "FINEDGE",
    companyLogoSubText: "TECHNOLOGIES",
    roleTitle: "Backend Engineering Intern",
    location: "Mumbai",
    stipend: "25,000-30,000",
    duration: "6 Months",
    skills: ["Node.js", "Express", "PostgreSQL", "Redis", "Docker", "AWS"],
    isVerified: true,
    jobType: "Full time",
    postedTime: "5 hours ago",
    description:
      "Key Responsibilities: Design RESTful APIs, optimize database queries, implement authentication and security best practices.",
  },
];

export const loginConfigs = {
  student: {
    roleTitle: "Student Log In",
    roleSubtitle: "Show your skills. Discover your opportunities.",
    illustration: "/images/student-login.png", // Replace with your laptop viewport image path
    fields: [
      {
        id: "fullName",
        label: "Full Name",
        type: "text",
        placeholder: "e.g. Tara Joshi",
        icon: "user", // Identifier for icon rendering
      },
      {
        id: "email",
        label: "Email Address",
        type: "email",
        placeholder: "you@university.edu",
        icon: "email",
      },
      {
        id: "password",
        label: "Password",
        type: "password",
        placeholder: "••••••••",
        icon: "lock",
      },
    ],
  },
  company: {
    roleTitle: "Company Log In",
    roleSubtitle: "Find the talent that brings your next big idea to life.",
    illustration: "/images/company-login.png", // Replace with your laptop viewport image path
    fields: [
      {
        id: "companyName",
        label: "Company Name",
        type: "text",
        placeholder: "e.g. XYZ Company",
        icon: "building",
      },
      {
        id: "email",
        label: "Office Email Address",
        type: "email",
        placeholder: "hello@xyzcompany.com",
        icon: "email",
      },
      {
        id: "password",
        label: "Password",
        type: "password",
        placeholder: "••••••••",
        icon: "lock",
      },
    ],
  },
  college: {
    roleTitle: "College Log In",
    roleSubtitle: "Improve placement outcomes with showmyskills.",
    illustration: "/images/college-login.png", // Replace with your laptop viewport image path
    fields: [
      {
        id: "collegeName",
        label: "College Name",
        type: "text",
        placeholder: "e.g. National Institute of Technology",
        icon: "building",
      },
      {
        id: "email",
        label: "College Email Address",
        type: "email",
        placeholder: "you@university.edu",
        icon: "email",
      },
      {
        id: "password",
        label: "Password",
        type: "password",
        placeholder: "••••••••",
        icon: "lock",
      },
    ],
  },
  admin: {
    roleTitle: "Admin Log In",
    roleSubtitle: "Manage and monitor platform outcomes with showmyskills.",
    illustration: "/images/admin-login.png",
    fields: [
      {
        id: "fullName",
        label: "Admin Name",
        type: "text",
        placeholder: "e.g. Jordan Hayes",
        icon: "user",
      },
      {
        id: "email",
        label: "Admin Email Address",
        type: "email",
        placeholder: "admin@showmyskills.com",
        icon: "email",
      },
      {
        id: "password",
        label: "Password",
        type: "password",
        placeholder: "••••••••",
        icon: "lock",
      },
    ],
  },
};
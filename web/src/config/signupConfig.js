
export const signupConfig = {
  student: {
    title: "Student Sign up",
    subtitle: "Create your account and start your skills with showmyskills",
    fields: [
      { name: "fullName", label: "Full Name", type: "text", placeholder: "e.g. Asma Naureen" },
      { name: "email", label: "Email Address", type: "email", placeholder: "you@university.edu" },
      { name: "phone", label: "Phone Number", type: "tel", placeholder: "+1 (555) 000-0000" },
      { name: "password", label: "Password", type: "password", placeholder: "••••••••" },
      { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "••••••••" },
    ],
  },
  company: {
    title: "Company Sign up",
    subtitle: "Select the candidates as per your requirements with showmyskills",
    fields: [
      { name: "companyName", label: "Company Name", type: "text", placeholder: "e.g. xphy company" },
      { name: "email", label: "Office Email Address", type: "email", placeholder: "you@company.com" },
      { name: "phone", label: "Phone Number", type: "tel", placeholder: "+1 (555) 000-0000" },
      { name: "website", label: "Website Link", type: "url", placeholder: "e.g. https://xphycompany.com" },
      { name: "password", label: "Password", type: "password", placeholder: "••••••••" },
      { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "••••••••" },
    ],
  },
  college: {
    title: "College Sign up",
    subtitle: "Improve placement outcomes with showmyskills",
    fields: [
      { name: "collegeName", label: "College Name", type: "text", placeholder: "e.g. CBIT College" },
      { name: "email", label: "College Email Address", type: "email", placeholder: "you@college.edu" },
      { name: "phone", label: "Phone Number", type: "tel", placeholder: "+1 (555) 000-0000" },
      { name: "website", label: "Website Link", type: "url", placeholder: "e.g. https://cbitcollege.com" },
      { name: "password", label: "Password", type: "password", placeholder: "••••••••" },
      { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "••••••••" },
    ],
  },
};
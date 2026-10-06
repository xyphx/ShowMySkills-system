import "../styles/globals.css";

export const metadata = {
  title: "ShowMySkills | Showcase Your Talent & Build Your Portfolio",
  description: "ShowMySkills empowers creators, coders, designers, and doers to showcase their skills, build portfolios, rank among the best, and get noticed by peers and professionals.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased text-gray-900 bg-gray-50 selection:bg-teal-100 selection:text-teal-900">
        {children}
      </body>
    </html>
  );
}

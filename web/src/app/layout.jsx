import "../styles/globals.css";

export const metadata = {
  title: "Next.js Web Application",
  description: "Fresh Next.js frontend application"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-950 text-slate-50">
        {children}
      </body>
    </html>
  );
}

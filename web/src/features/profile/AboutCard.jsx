"use client";

/**
 * AboutCard — Clean white card displaying the student's bio/about text.
 */
export default function AboutCard({ text }) {
  return (
    <section
      id="about-card"
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8"
    >
      <h3 className="text-lg font-bold text-gray-900 mb-3">About</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
    </section>
  );
}

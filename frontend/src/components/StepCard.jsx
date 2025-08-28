export default function StepCard({ n, title, desc }) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-xl border border-rose-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-rose-600 to-rose-700 text-white font-semibold text-lg shadow">
        {n}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-rose-700">{title}</h3>
      <p className="mt-2 text-sm text-rose-900/70 leading-relaxed">{desc}</p>
    </div>
  );
}

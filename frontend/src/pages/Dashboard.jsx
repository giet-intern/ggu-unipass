import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const cards = [
    {
      title: "Manage Mids",
      desc: "View, edit, and delete mids",
      to: "/dashboard/manage-mids",
    },
    {
      title: "Upload Dues Sheet",
      desc: "Upload Excel to update dues",
      to: "/dashboard/upload-dues",
    },
    {
      title: "Universal Hallticket",
      desc: "Download hallticket by PIN",
      to: "/dashboard/universal-hallticket",
    },
  ];
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="text-2xl font-bold text-rose-700 mb-6">Dashboard</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <button
            key={c.title}
            onClick={() => navigate(c.to)}
            className="card p-6 text-left hover:shadow-lg transition"
          >
            <div className="text-lg font-semibold text-rose-700">{c.title}</div>
            <div className="text-sm text-rose-900/70 mt-2">{c.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

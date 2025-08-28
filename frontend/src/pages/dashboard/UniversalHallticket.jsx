import { useState } from "react";
import { generateHallticketFaculty } from "../../api/facultyApi";
import { saveBlob } from "../../utils/helpers";
import toast from "react-hot-toast";

export default function UniversalHallticket() {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!pin.trim()) return toast.error("Enter PIN");
    setLoading(true);
    try {
      const res = await generateHallticketFaculty(pin.trim());
      saveBlob(res.data, `hallticket_${pin.trim()}.pdf`);
      toast.success("Downloaded");
    } catch {
      toast.error("Failed");
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-xl px-6 py-14 text-center">
      <h2 className="text-3xl font-bold text-rose-700 mb-2">
        Universal Hallticket
      </h2>
      <p className="text-gray-500 mb-4">
        Enter the <span className="text-rose-600 font-medium">PIN</span> to
        generate and download instantly.
      </p>

      <div className="flex items-center justify-center">
        <div className="flex w-full max-w-md overflow-hidden rounded-xl border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-rose-300 transition">
          <input
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN"
            className="flex-1 bg-white/90 px-4 py-3 text-gray-700 placeholder-gray-400 outline-none"
            onKeyDown={(e) => e.key === "Enter" && generate()}
          />
          <button
            onClick={generate}
            disabled={loading}
            className="bg-rose-600 text-white px-6 py-3 font-medium hover:bg-rose-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "..." : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
}

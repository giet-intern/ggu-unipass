import { useState } from "react";
import StudentCard from "../components/StudentCard";
import { searchStudent, generateHallticket } from "../api/studentApi";
import { addReceipt } from "../api/receiptApi";
import { saveBlob } from "../utils/helpers";
import toast from "react-hot-toast";
import { Search } from "lucide-react";

export default function StudentLookup() {
  const [pin, setPin] = useState("");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const doSearch = async (searchPin) => {
    const pinToSearch = searchPin || pin.trim();
    if (!pinToSearch) return toast.error("Enter PIN");
    setLoading(true);
    try {
      const { data } = await searchStudent(pinToSearch);
      if (!data || !data.pin) {
        toast.error("Student not found");
        setStudent(null);
      } else {
        setStudent(data);
      }
    } catch {
      toast.error("Error fetching student");
      setStudent(null);
    }
    setLoading(false);
  };

  const handleGenerate = async () => {
    setDownloading(true);
    try {
      const res = await generateHallticket(student.pin);
      saveBlob(res.data, `hallticket_${student.pin}.pdf`);
      toast.success("Hallticket downloaded");
      setStudent(null);
    } catch {
      toast.error("Unable to generate hallticket");
    }
    setDownloading(false);
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      return toast.error("Please upload a PDF file.");
    }

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("pin", student.pin);

    try {
      await addReceipt(fd);
      toast.success("Receipt uploaded successfully!");
      await doSearch(student.pin);
    } catch (err) {
      const message =
        err.response?.data?.message || "Upload failed. Please try again.";
      toast.error(message);
    } finally {
      setUploading(false);
      setStudent(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl items-center px-4 py-10">
      <div className="flex items-center justify-center gap-2 mb-2">
        <h1 className="text-3xl font-bold text-rose-700">Hallticket Portal</h1>
      </div>
      <div className="mb-4">
        <p className="text-gray-500 text-center">
          Enter the <span className="text-rose-600 font-medium">PIN</span> to
          generate and download hallticket.
        </p>
      </div>
      <div className="flex justify-center mb-6">
        <div className="flex w-full max-w-md shadow-sm rounded-xl overflow-hidden border border-gray-300 focus-within:border-rose-400 transition">
          <div className="flex items-center px-3 text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter your PIN"
            className="flex-1 bg-white px-3 py-3 text-sm text-gray-800 outline-none"
            onKeyDown={(e) => e.key === "Enter" && doSearch()}
          />
          <button
            onClick={() => doSearch()}
            disabled={loading}
            className="bg-rose-500 text-white px-5 text-sm font-medium hover:bg-rose-600 transition disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {student && (
        <div className="flex justify-center">
          <StudentCard
            student={student}
            onGenerate={handleGenerate}
            onUpload={handleUpload}
            uploading={uploading}
            downloading={downloading} // Pass down downloading state
          />
        </div>
      )}
    </div>
  );
}

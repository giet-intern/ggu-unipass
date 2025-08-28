import { useState } from "react";
import { uploadDuesSheet } from "../../api/facultyApi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Upload } from "lucide-react";

export default function UploadDues() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { username } = useAuth();

  const submit = async () => {
    if (!file) return toast.error("Select a file");
    setLoading(true);
    try {
      const { data } = await uploadDuesSheet(file, username);
      toast.success(`Updated: ${data.updated_count || data.updated || 0}`);
    } catch {
      toast.error("Upload failed");
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-lg px-6 py-14 text-center">
      <h2 className="text-3xl font-bold text-rose-700 mb-3">
        Upload Dues Sheet
      </h2>
      <p className="text-gray-500 mb-8">
        Upload the latest{" "}
        <span className="text-rose-600 font-medium">Excel sheet</span> to update
        student dues.
      </p>

      <div className="space-y-6">
        {/* Custom File Upload */}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-rose-300 rounded-xl p-8 cursor-pointer hover:bg-rose-50 transition">
          <Upload className="h-8 w-8 text-rose-600 mb-3" />
          <span className="text-gray-600">
            {file ? file.name : "Click to select .xls/.xlsx file"}
          </span>
          <input
            type="file"
            accept=".xls,.xlsx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
          />
        </label>

        {/* Upload Button */}
        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-rose-600 text-white font-medium py-3 rounded-xl hover:bg-rose-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Uploading..." : "Upload & Update"}
        </button>
      </div>
    </div>
  );
}

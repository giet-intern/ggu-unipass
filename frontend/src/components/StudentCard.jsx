import {
  IdCard,
  GraduationCap,
  BookOpen,
  FileDown,
  Upload,
  Wallet,
} from "lucide-react";

export default function StudentCard({
  student,
  onGenerate,
  onUpload,
  uploading,
  downloading, // Receive downloading prop
}) {
  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <GraduationCap className="w-5 h-5 text-rose-500" />
        {student.name}
      </h2>

      <div className="space-y-3 mb-6 text-gray-700">
        <div className="flex items-center gap-2">
          <IdCard className="w-4 h-4 text-gray-500" />
          <span className="text-sm">
            PIN: <span className="font-medium">{student.pin}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-gray-500" />
          <span className="text-sm">
            Branch: <span className="font-medium">{student.department}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-gray-500" />
          <span className="text-sm">
            Year: <span className="font-medium">{student.year}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-gray-500" />
          {student.due === 0 ? (
            <span className="px-2 py-1 text-xs font-medium rounded-lg bg-green-100 text-green-700">
              ✅ No Dues
            </span>
          ) : (
            <span className="px-2 py-1 text-xs font-medium rounded-lg bg-red-100 text-red-700">
              ₹{student.due} Pending
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {student.due === 0 ? (
          <button
            onClick={onGenerate}
            disabled={downloading} // Disable button while downloading
            className="flex items-center justify-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-rose-600 transition disabled:opacity-50"
          >
            <FileDown className="w-4 h-4" />
            {downloading ? "Generating..." : "Download Hallticket"}
          </button>
        ) : (
          <label className="flex items-center justify-center gap-2 cursor-pointer bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 transition">
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading..." : "Upload Fee Receipt"}
            <input
              type="file"
              hidden
              onChange={onUpload}
              disabled={uploading}
            />
          </label>
        )}
      </div>
    </div>
  );
}

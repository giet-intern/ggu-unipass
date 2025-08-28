import { useEffect, useReducer, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  createExam,
  deleteExam,
  getExams,
  updateExam,
} from "../../api/examApi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  Calendar,
  Clock,
  Edit,
  PlusCircle,
  Save,
  Trash2,
  X,
} from "lucide-react";

// ========================================================================
// Constants & Helpers
// ========================================================================

const DEPTS = ["AIML", "CS", "DS", "ECE"];
const MID_OPTIONS = [1, 2];
const YEAR_OPTIONS = [1, 2, 3, 4];

const toDate = (v) => (v ? new Date(v) : null);
const fmtTime = (d) =>
  d
    ? d.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "";
const fmtDate = (d) =>
  d
    ? d.toLocaleDateString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

const dpClass =
  "w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400";

// ========================================================================
// Child Components
// ========================================================================

const MidItemCard = ({ item, onEdit, onDelete }) => {
  const startTime = toDate(item.time?.start);
  const endTime = toDate(item.time?.end);

  return (
    <div className="rounded-xl bg-white p-6 border border-gray-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="text-lg font-semibold text-gray-800">
            MID-{item.mid} · Year {item.year} · {item.dept}
          </div>
          <div className="mt-1 text-sm text-gray-600">
            Time: {fmtTime(startTime)} – {fmtTime(endTime)}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100"
          >
            <Edit className="w-4 h-4" /> Edit
          </button>
          <button
            onClick={() => onDelete(item._id)}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      {Array.isArray(item.subjects) && item.subjects.length > 0 && (
        <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-rose-50 text-rose-700">
              <tr>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Subject</th>
              </tr>
            </thead>
            <tbody>
              {item.subjects.map((s, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-3 py-2 text-gray-700">
                    {fmtDate(toDate(s.date)) || "-"}
                  </td>
                  <td className="px-3 py-2 text-gray-700">
                    {s.subject || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// --- Form Reducer & Component ---
const initialFormState = {
  mid: "",
  year: "",
  dept: "",
  time: { start: null, end: null }, // Simplified time
  subjects: [{ date: null, subject: "" }],
};

function formReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.payload };
    case "SET_TIME": {
      // Simplified time logic
      const { key, value } = action.payload;
      return { ...state, time: { ...state.time, [key]: value } };
    }
    case "SET_SUBJECT": {
      const { index, field, value } = action.payload;
      const subjects = [...state.subjects];
      subjects[index] = { ...subjects[index], [field]: value };
      return { ...state, subjects };
    }
    case "ADD_SUBJECT":
      return {
        ...state,
        subjects: [...state.subjects, { date: null, subject: "" }],
      };
    case "REMOVE_SUBJECT": {
      let subjects = state.subjects.filter(
        (_, i) => i !== action.payload.index
      );
      if (subjects.length === 0) subjects = [{ date: null, subject: "" }];
      return { ...state, subjects };
    }
    case "RESET":
      return action.payload || initialFormState;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const ExamForm = ({ editingItem, onSave, onCancel }) => {
  const { data } = useAuth();
  const username = data.username;

  const getInitialState = (item) => {
    if (!item) return initialFormState;
    return {
      mid: item.mid ?? "",
      year: item.year ?? "",
      dept: item.dept ?? "",
      time: {
        // Simplified time
        start: toDate(item.time?.start),
        end: toDate(item.time?.end),
      },
      subjects:
        item.subjects?.length > 0
          ? item.subjects.map((s) => ({
              date: toDate(s.date),
              subject: s.subject || "",
            }))
          : [{ date: null, subject: "" }],
    };
  };

  const [form, dispatch] = useReducer(
    formReducer,
    getInitialState(editingItem)
  );

  const handleSave = () => {
    // 1. Validation
    const errors = [];
    if (!form.mid) errors.push("Select Mid.");
    if (!form.year) errors.push("Select Year.");
    if (!form.dept) errors.push("Select Department.");
    const { start, end } = form.time;
    if (!start || !end) errors.push("Fill both Start and End times.");
    if (start >= end) errors.push("End time must be after Start time.");
    if (form.subjects.some((s) => !s.subject.trim() || !s.date))
      errors.push("Every subject needs a date and name.");

    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    // 2. Serialization (prepare data for API)
    const payload = {
      ...form,
      faculty_username: username,
      time: {
        // Simplified time
        start: form.time.start?.toISOString() ?? null,
        end: form.time.end?.toISOString() ?? null,
      },
      subjects: form.subjects.map((s) => ({
        subject: s.subject.trim(),
        date: s.date?.toISOString() ?? null,
      })),
    };

    onSave(payload, editingItem?._id);
  };

  const isNew = !editingItem;
  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-md mb-6">
      <h3 className="text-lg font-semibold text-rose-700 mb-4 flex items-center gap-2">
        {isNew ? (
          <PlusCircle className="w-5 h-5" />
        ) : (
          <Edit className="w-5 h-5" />
        )}
        {isNew ? "Add Mid Schedule" : "Edit Mid Schedule"}
      </h3>

      {/* Main Details */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <select
          value={form.mid}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "mid",
              payload: e.target.value,
            })
          }
          className={dpClass.replace("w-full", "")}
        >
          <option value="">Select Mid</option>
          {MID_OPTIONS.map((m) => (
            <option key={m} value={m}>
              Mid {m}
            </option>
          ))}
        </select>
        <select
          value={form.year}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "year",
              payload: e.target.value,
            })
          }
          className={dpClass.replace("w-full", "")}
        >
          <option value="">Select Year</option>
          {YEAR_OPTIONS.map((y) => (
            <option key={y} value={y}>
              Year {y}
            </option>
          ))}
        </select>
        <select
          value={form.dept}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "dept",
              payload: e.target.value,
            })
          }
          className={dpClass.replace("w-full", "")}
        >
          <option value="">Select Department</option>
          {DEPTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Simplified Times */}
      <div className="mb-6">
        <div className="font-semibold text-rose-700 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" /> Exam Time (12-hour)
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            ["Start Time", "start"],
            ["End Time", "end"],
          ].map(([label, key]) => (
            <div key={key}>
              <label className="block text-xs text-gray-600 mb-1">
                {label}
              </label>
              <DatePicker
                selected={form.time[key]}
                onChange={(date) =>
                  dispatch({ type: "SET_TIME", payload: { key, value: date } })
                }
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                dateFormat="h:mm aa"
                placeholderText="Select time"
                className={dpClass}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Subjects */}
      <div className="mb-6">
        <div className="font-semibold text-rose-700 mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Subjects
        </div>
        <div className="space-y-3">
          {form.subjects.map((s, idx) => (
            <div key={idx} className="grid sm:grid-cols-[1fr_2fr_auto] gap-3">
              <DatePicker
                selected={s.date}
                onChange={(d) =>
                  dispatch({
                    type: "SET_SUBJECT",
                    payload: { index: idx, field: "date", value: d },
                  })
                }
                dateFormat="PPP"
                placeholderText="Select date"
                className={dpClass}
              />
              <input
                value={s.subject}
                onChange={(e) =>
                  dispatch({
                    type: "SET_SUBJECT",
                    payload: {
                      index: idx,
                      field: "subject",
                      value: e.target.value,
                    },
                  })
                }
                placeholder="Subject name"
                className={dpClass}
              />
              <button
                type="button"
                onClick={() =>
                  dispatch({ type: "REMOVE_SUBJECT", payload: { index: idx } })
                }
                className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                title="Remove"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => dispatch({ type: "ADD_SUBJECT" })}
          className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100"
        >
          <PlusCircle className="w-4 h-4" /> Add Subject
        </button>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700"
        >
          <Save className="w-4 h-4" /> {isNew ? "Create" : "Save"}
        </button>
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          <X className="w-4 h-4" /> Cancel
        </button>
      </div>
    </div>
  );
};

// ========================================================================
// Main Page Component
// ========================================================================

export default function ManageMids() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState({ mode: "list", item: null }); // 'list', 'add', 'edit'

  const loadExams = async () => {
    try {
      const { data } = await getExams();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load mids");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadExams();
  }, []);

  const handleSave = async (payload, editingId) => {
    try {
      if (editingId) {
        await updateExam(editingId, payload);
        toast.success("Mid updated");
      } else {
        await createExam(payload);
        toast.success("Mid created");
      }
      setView({ mode: "list", item: null });
      await loadExams();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Save failed";
      toast.error(msg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this mid schedule?"))
      return;
    try {
      await deleteExam(id);
      toast.success("Deleted");
      setItems((prev) => prev.filter((x) => x._id !== id));
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Delete failed";
      toast.error(msg);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-rose-700">Manage Mids</h2>
        {view.mode === "list" && (
          <button
            onClick={() => setView({ mode: "add", item: null })}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700"
          >
            <PlusCircle className="w-5 h-5" /> Add New Mid
          </button>
        )}
      </div>

      {view.mode !== "list" && (
        <ExamForm
          key={view.item?._id || "new"}
          editingItem={view.item}
          onSave={handleSave}
          onCancel={() => setView({ mode: "list", item: null })}
        />
      )}

      {view.mode === "list" &&
        (loading ? (
          <div className="text-rose-700">Loading…</div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <MidItemCard
                key={item._id}
                item={item}
                onEdit={(it) => setView({ mode: "edit", item: it })}
                onDelete={handleDelete}
              />
            ))}
            {!items.length && (
              <div className="text-gray-600">No mid schedules found.</div>
            )}
          </div>
        ))}
    </div>
  );
}

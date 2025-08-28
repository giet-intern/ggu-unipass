import { useNavigate } from "react-router-dom";
import StepCard from "../components/StepCard";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-rose-700 tracking-tight">
          Hallticket Portal
        </h1>
        <p className="text-sm text-rose-900/70 mt-2">
          Designed & Developed for students by <br />
          <span className="font-semibold">Dept. of CSE (AIML & CS), GGU</span>
        </p>
        <p className="text-base text-rose-900/70 mt-5 max-w-2xl mx-auto">
          Follow these simple steps to get your hallticket without hassle.
        </p>
      </div>

      {/* Steps Section */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <StepCard
          n="1"
          title="Enter PIN"
          desc="Enter your PIN number and search"
        />
        <StepCard
          n="2"
          title="Generate Hallticket"
          desc="If you have cleared dues, generate your hallticket"
        />
        <StepCard
          n="3"
          title="Upload Receipt (if due)"
          desc="If dues exist, upload your payment receipt to update your status"
        />
        <StepCard
          n="4"
          title="Contact Admin"
          desc="Reach out to the Admin team if you face any issues"
        />
      </div>

      {/* Extra Info */}
      <div className="mt-12 text-center space-y-4">
        <p className="text-sm text-rose-800 font-medium bg-rose-100 px-4 py-2 rounded-lg inline-block shadow-sm">
          📌 Note: You should get the hallticket signed by the department before{" "}
          <span className="font-semibold">1st Sep 2025</span>
        </p>

        <p className="text-sm text-rose-700">
          🔗 You can download your payment receipt as PDF from{" "}
          <a
            href="https://giet.campx.in/ggu/payments/public/login"
            target="_blank"
            rel="noopener noreferrer"
            className="text-rose-600 font-semibold underline hover:text-rose-800"
          >
            CampX Portal
          </a>
        </p>
      </div>

      {/* CTA Button */}
      <div className="mt-14 flex justify-center">
        <button
          onClick={() => navigate("/download")}
          className="px-8 py-3 rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 text-white font-medium text-base shadow-md hover:shadow-lg transform hover:scale-105 transition"
        >
          Start Now →
        </button>
      </div>
    </div>
  );
}

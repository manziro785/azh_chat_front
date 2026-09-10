import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import AuthForm from "../components/auth/AuthForm";

const TABS = [
  { id: "login", label: "Sign in" },
  { id: "register", label: "Sign up" },
];

export const AuthPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <button
        onClick={() => navigate("/")}
        aria-label="Back"
        className="absolute top-4 left-4 grid h-9 w-9 cursor-pointer place-items-center rounded-[10px] border border-line-btn bg-raised text-ink-2 transition-colors hover:bg-hover-btn hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      <div className="w-full max-w-[420px]">
        <div className="mb-7 flex items-center gap-[9px]">
          <div className="h-[22px] w-[22px] rounded-[7px] bg-[linear-gradient(140deg,#5b83ff,#3ad0b0)]" />
          <span className="text-[15px] font-bold tracking-[-0.2px]">
            AzhChat
          </span>
        </div>

        <div className="rounded-[18px] border border-line-strong bg-surface p-6 shadow-[0_24px_60px_rgba(0,0,0,.55)] sm:p-7">
          <h1 className="text-[22px] font-bold tracking-[-0.4px]">
            {tab === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-[12.5px] text-muted text-pretty">
            {tab === "login"
              ? "Sign in to get back to your channels."
              : "One account, all your channels. No email confirmation needed."}
          </p>

          <div className="mt-5 mb-6 grid grid-cols-2 gap-1 rounded-[11px] border border-line bg-field p-1">
            {TABS.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                aria-pressed={tab === item.id}
                className={`h-[34px] cursor-pointer rounded-lg text-[12.5px] font-semibold transition-colors ${
                  tab === item.id
                    ? "bg-accent text-white"
                    : "bg-transparent text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <AuthForm tab={tab} />
        </div>
      </div>
    </div>
  );
};

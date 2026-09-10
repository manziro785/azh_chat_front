import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../components/ui/avatar";

// The landing is the only screen with an EN/RU switch — it is the only page
// a logged-out visitor reads. The dictionary stays local on purpose: the app
// itself is English-only, so pulling in an i18n library would be overkill.
const DICT = {
  en: {
    login: "Log in",
    h1: "Group chats that stay readable.",
    sub: "Create a channel, share a six-character code, and talk. Messages and members arrive live — nothing to configure, nothing to install.",
    cta: "Create a channel",
    cta2: "Join with a code",
    features: [
      {
        title: "Channels, not inboxes",
        body: "Each conversation has a name, a description and its own member list.",
      },
      {
        title: "Live by default",
        body: "Messages and new members appear the moment they happen. The page never reloads.",
      },
      {
        title: "Yours reads as yours",
        body: "Your messages sit on the right, everyone else on the left, split by day.",
      },
    ],
    mockChannels: "CHANNELS",
    mockMembers: "members",
    mockPlaceholder: "Message #design-team",
    messages: [
      {
        mine: false,
        nick: "Manziro",
        text: "Pushed the new feed layout — day dividers are in",
      },
      { mine: true, nick: "You", text: "Looking now" },
      { mine: true, nick: "You", text: "Mine on the right reads perfectly" },
    ],
  },
  ru: {
    login: "Войти",
    h1: "Групповые чаты, которые удобно читать.",
    sub: "Создайте канал, отправьте код из шести символов и общайтесь. Сообщения и участники приходят сразу — ничего настраивать и устанавливать не нужно.",
    cta: "Создать канал",
    cta2: "Вступить по коду",
    features: [
      {
        title: "Каналы, а не входящие",
        body: "У каждого разговора есть название, описание и свой список участников.",
      },
      {
        title: "Живое по умолчанию",
        body: "Сообщения и новые участники появляются сразу. Страница не перезагружается.",
      },
      {
        title: "Свои сообщения видно сразу",
        body: "Ваши — справа, остальные — слева, разделены по дням.",
      },
    ],
    mockChannels: "КАНАЛЫ",
    mockMembers: "участника",
    mockPlaceholder: "Сообщение в #design-team",
    messages: [
      {
        mine: false,
        nick: "Manziro",
        text: "Залил новую ленту — разделители по дням на месте",
      },
      { mine: true, nick: "You", text: "Смотрю" },
      { mine: true, nick: "You", text: "Свои справа читаются идеально" },
    ],
  },
};

const MOCK_CHANNELS = [
  { name: "design-team", active: true, unread: 0 },
  { name: "SCA22B", active: false, unread: 3 },
  { name: "general", active: false, unread: 12 },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [lang, setLang] = useState("en");
  const t = DICT[lang];
  const goToAuth = () => navigate("/auth");

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <header className="mx-auto flex w-full max-w-[1200px] items-center gap-4 px-5 py-5 sm:px-11">
        <span className="text-base font-bold tracking-[-0.3px]">AzhChat</span>
        <div className="ml-auto flex items-center gap-3.5">
          <div className="flex gap-0.5">
            {["en", "ru"].map((code) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={`h-7 cursor-pointer rounded-[7px] px-2.5 text-xs font-semibold transition-colors ${
                  lang === code ? "text-ink" : "text-faint hover:text-ink-2"
                }`}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            onClick={goToAuth}
            className="h-9 cursor-pointer rounded-[10px] border border-line-btn bg-transparent px-[15px] text-[13.5px] font-semibold text-ink-2 transition-colors hover:bg-[#161c26] hover:text-ink"
          >
            {t.login}
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col justify-center px-5 pt-8 pb-14 sm:px-11">
        <div className="max-w-[620px]">
          <h1 className="text-[34px] leading-[1.06] font-bold tracking-[-1px] text-pretty sm:text-[52px] sm:tracking-[-1.6px]">
            {t.h1}
          </h1>
          <p className="mt-[18px] max-w-[520px] text-[17px] text-ink-3 text-pretty">
            {t.sub}
          </p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <button
              onClick={goToAuth}
              className="h-[46px] cursor-pointer rounded-xl bg-accent px-[22px] text-[14.5px] font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              {t.cta}
            </button>
            <button
              onClick={goToAuth}
              className="h-[46px] cursor-pointer rounded-xl border border-line-btn bg-transparent px-5 text-[14.5px] font-semibold text-ink transition-colors hover:bg-[#161c26]"
            >
              {t.cta2}
            </button>
          </div>
        </div>

        {/* Static product shot — the landing had no picture of the app before. */}
        <div className="mt-13 overflow-hidden rounded-2xl border border-[#1d232e] bg-panel-head">
          <div className="flex min-h-[300px]">
            <div className="hidden w-[186px] flex-none flex-col gap-1.5 border-r border-line-soft bg-panel p-3 sm:flex">
              <div className="px-1 pb-1.5 text-[9px] font-bold tracking-[.1em] text-placeholder">
                {t.mockChannels}
              </div>
              {MOCK_CHANNELS.map((c) => (
                <div
                  key={c.name}
                  className={`flex items-center gap-[9px] rounded-[9px] px-2 py-[7px] ${
                    c.active ? "bg-row-active" : ""
                  }`}
                >
                  <Avatar name={c.name} size={22} radius="7px" />
                  <span
                    className={`min-w-0 flex-1 truncate text-xs font-semibold ${
                      c.active ? "text-ink" : "text-[#a2abb8]"
                    }`}
                  >
                    {c.name}
                  </span>
                  {c.unread > 0 && (
                    <span className="grid h-[15px] min-w-[16px] flex-none place-items-center rounded-lg bg-accent px-1 text-[9.5px] font-bold text-white">
                      {c.unread}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex h-10 flex-none items-center gap-2 border-b border-line-soft px-4">
                <span className="font-mono text-[13px] text-faint">#</span>
                <span className="text-[12.5px] font-semibold">design-team</span>
                <span className="ml-auto text-[10.5px] text-faint">
                  4 {t.mockMembers}
                </span>
              </div>
              <div className="flex min-h-0 flex-1 flex-col justify-end gap-2.5 p-4">
                {t.messages.map((m, i) => {
                  const grouped = i > 0 && t.messages[i - 1].mine === m.mine;
                  return (
                    <div
                      key={m.text}
                      className={`flex items-end gap-2 ${
                        m.mine ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <Avatar
                        name={m.mine ? "M" : m.nick}
                        size={24}
                        className={grouped ? "invisible" : ""}
                      />
                      <div
                        className={`max-w-[70%] border px-[11px] py-2 text-xs text-pretty ${
                          m.mine
                            ? "rounded-[13px] rounded-br-[4px] border-mine-line bg-mine text-mine-ink"
                            : "rounded-[13px] rounded-bl-[4px] border-line-bubble bg-elevated text-[#e3e8ef]"
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="px-4 pb-4">
                <div className="flex h-[34px] items-center rounded-[11px] border border-line-field bg-field px-3 text-[11.5px] text-placeholder">
                  {t.mockPlaceholder}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-11 flex flex-wrap gap-11">
          {t.features.map((f) => (
            <div
              key={f.title}
              className="max-w-[320px] min-w-[240px] flex-[1_1_260px]"
            >
              <div className="text-[15px] font-semibold tracking-[-0.2px]">
                {f.title}
              </div>
              <div className="mt-1.5 text-[13.5px] text-muted text-pretty">
                {f.body}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-line-soft">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-4 px-5 py-[22px] text-[12.5px] text-faint sm:px-11">
          <span>AzhChat</span>
          <span className="ml-auto">Tilekmat Azhygulov</span>
        </div>
      </footer>
    </div>
  );
}

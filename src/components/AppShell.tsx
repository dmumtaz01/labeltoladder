import { Link, useLocation } from "@tanstack/react-router";
import { Home, Briefcase, IdCard, Layers, User, Sparkles } from "lucide-react";
import { type ReactNode } from "react";
import { ChatBubble } from "./ChatBubble";

type Props = {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  hideBottomNav?: boolean;
  hideChatBubble?: boolean;
};

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/journey", label: "Journey", icon: Layers },
  { to: "/passport", label: "Passport", icon: IdCard },
  { to: "/profile", label: "Me", icon: User },
] as const;

export function AppShell({ children, title, showBack, hideBottomNav, hideChatBubble }: Props) {
  const { pathname } = useLocation();
  return (
    <div className="app-frame flex flex-col bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border/60 bg-background/85 px-4 py-3 backdrop-blur">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-hero text-primary-foreground shadow-soft">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-serif text-base font-medium tracking-tight">
              {title ?? "Label·to·Ladder"}
            </span>
            {!title && (
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Earn from real skills
              </span>
            )}
          </div>
        </Link>
        <Link
          to="/auth"
          className="rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-soft transition-smooth hover:opacity-90"
        >
          Sign in
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-24">{children}</main>

      {/* Bottom nav */}
      {!hideBottomNav && (
        <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-[420px] -translate-x-1/2 border-t border-border/60 bg-background/95 backdrop-blur md:rounded-b-[2.5rem]">
          <ul className="grid grid-cols-5 px-2 py-2">
            {NAV.map((item) => {
              const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`group flex flex-col items-center gap-1 rounded-xl py-1.5 transition-smooth ${
                      active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-xl transition-spring ${
                        active ? "bg-primary/10 scale-110" : "bg-transparent"
                      }`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={active ? 2.5 : 2} />
                    </span>
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {/* Floating help chatbot */}
      {!hideChatBubble && <ChatBubble />}

      {showBack && null}
    </div>
  );
}

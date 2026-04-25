import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="group flex items-center gap-2">
          <LogoMark />
          <span className="font-serif text-lg font-semibold tracking-tight">
            Label<span className="text-secondary">·</span>to<span className="text-secondary">·</span>Ladder
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link
            to="/how-it-works"
            className="text-muted-foreground transition-smooth hover:text-foreground"
            activeProps={{ className: "text-foreground font-medium" }}
          >
            How it works
          </Link>
          <Link
            to="/passport"
            className="text-muted-foreground transition-smooth hover:text-foreground"
            activeProps={{ className: "text-foreground font-medium" }}
          >
            Passport
          </Link>
          <span className="h-4 w-px bg-border" aria-hidden="true" />
          <Link
            to="/employer"
            className="text-muted-foreground transition-smooth hover:text-foreground"
            activeProps={{ className: "text-foreground font-medium" }}
          >
            Employer
          </Link>
          <Link
            to="/admin"
            className="text-muted-foreground transition-smooth hover:text-foreground"
            activeProps={{ className: "text-foreground font-medium" }}
          >
            Admin
          </Link>
          <Link
            to="/onboarding"
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground shadow transition-smooth hover:bg-primary/90"
          >
            Start free
          </Link>
        </nav>
        <Link
          to="/onboarding"
          className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground shadow md:hidden"
        >
          Start
        </Link>
      </div>
    </header>
  );
}

function LogoMark() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="6" fill="var(--color-primary)" />
      <path
        d="M9 22 L9 10 M9 22 L23 22 M9 17 L19 17 M9 12 L21 12"
        stroke="var(--color-accent)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <LogoMark />
            <span className="font-serif text-lg font-semibold tracking-tight">
              Label·to·Ladder
            </span>
          </div>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            The operating system for ethical entry-level AI work. Proof-of-skill screening,
            ethical matching, and verified career mobility for the next billion workers.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Product</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/how-it-works" className="hover:text-foreground">
                How it works
              </Link>
            </li>
            <li>
              <Link to="/onboarding" className="hover:text-foreground">
                Take the assessment
              </Link>
            </li>
            <li>
              <Link to="/passport" className="hover:text-foreground">
                Skills Passport
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">For partners</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>AI labs &amp; data vendors</li>
            <li>Workforce programs</li>
            <li>Governments &amp; NGOs</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container mx-auto flex flex-col gap-2 px-4 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Label-to-Ladder. Built for dignity.</span>
          <span>Pre-MVP — pilot program in development.</span>
        </div>
      </div>
    </footer>
  );
}

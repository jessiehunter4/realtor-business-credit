import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import logoAsset from "@/assets/logo.png.asset.json";
import { useAuthRole } from "@/hooks/useAuthRole";
import { supabase } from "@/integrations/supabase/client";

const navLinks = [
  { to: "/guide", label: "Guide" },
  { to: "/sample-plan", label: "Sample Plan" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
];

const secondaryLinks = [
  { to: "/one-on-one", label: "1:1 Session" },
  { to: "/business-credit-cards-for-realtors", label: "Business Credit Cards" },
];

const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const { session, role } = useAuthRole();
  const isAdmin = role === "admin";
  const authedHome = isAdmin ? "/admin" : "/dashboard";
  const authedLabel = isAdmin ? "Admin" : "Dashboard";
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center shrink-0" aria-label="RE Pro Business Credit home">
          <img
            src={logoAsset.url}
            alt="RE Pro Business Credit"
            className="h-12 md:h-16 w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 rounded-full text-sm font-medium text-secondary/80 hover:text-secondary hover:bg-secondary/5 transition-colors",
                  isActive && "text-secondary bg-secondary/5"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {session ? (
            <>
              <Link
                to={authedHome}
                className="inline-flex items-center justify-center rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-secondary hover:bg-secondary/5 transition-colors"
              >
                {authedLabel}
              </Link>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-card hover:bg-primary/90 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="hidden inline-flex items-center justify-center rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-secondary hover:bg-secondary/5 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/one-on-one"
                data-analytics-id="cta-start-here-header"
                className="hidden inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-card hover:bg-primary/90 transition-colors"
              >
                Start Here
              </Link>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className="md:hidden inline-flex items-center justify-center rounded-full border border-border bg-white p-2 text-secondary"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[18rem] flex flex-col gap-6">
            <Link to="/" onClick={() => setOpen(false)} className="flex items-center pt-2">
              <img src={logoAsset.url} alt="RE Pro Business Credit" className="h-12 w-auto" />
            </Link>
            <nav className="flex flex-col gap-1">
              {navLinks.map((l) => (
                <SheetClose asChild key={l.to}>
                  <Link
                    to={l.to}
                    className="px-3 py-3 rounded-xl text-base font-medium text-secondary hover:bg-secondary/5"
                  >
                    {l.label}
                  </Link>
                </SheetClose>
              ))}
              {secondaryLinks.map((l) => (
                <SheetClose asChild key={l.to}>
                  <Link
                    to={l.to}
                    className="px-3 py-3 rounded-xl text-base font-medium text-secondary hover:bg-secondary/5"
                  >
                    {l.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-2">
              {session ? (
                <>
                  <SheetClose asChild>
                    <Link
                      to={authedHome}
                      className="inline-flex items-center justify-center rounded-full border border-border bg-white px-4 py-3 text-sm font-semibold text-secondary"
                    >
                      {authedLabel}
                    </Link>
                  </SheetClose>
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <SheetClose asChild>
                    <Link
                      to="/mock-login"
                      className="hidden inline-flex items-center justify-center rounded-full border border-border bg-white px-4 py-3 text-sm font-semibold text-secondary"
                    >
                      Log in
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      to="/one-on-one"
                      className="hidden inline-flex items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
                    >
                      Start Here
                    </Link>
                  </SheetClose>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default SiteHeader;
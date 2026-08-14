import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { LayoutDashboard, LogOut, Menu, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import logoAsset from "@/assets/rbc-logo-transparent.png.asset.json";
import { useAuthRole } from "@/hooks/useAuthRole";
import { signOutAndClear } from "@/lib/signOut";
import { homeForRole, type AppRole } from "@/lib/roles";

type NavItem = { to: string; label: string; roles?: AppRole[] };

// `roles` omitted = visible to everyone. Role-scoped items are filtered out
// entirely, so a visitor can never render an admin link.
const navLinks: NavItem[] = [
  { to: "/guide", label: "Guide" },
  { to: "/sample-plan", label: "Sample Plan" },
  { to: "/business-credit-cards-for-realtors", label: "Business Credit Cards" },
  { to: "/pricing", label: "Pricing" },
];

const secondaryLinks: NavItem[] = [];


function visibleFor(items: NavItem[], role: AppRole | null) {
  return items.filter((i) => !i.roles || (role !== null && i.roles.includes(role)));
}

const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const { session, role } = useAuthRole();
  const isAdmin = role === "admin";
  const authedHome = homeForRole(role);
  const authedLabel = isAdmin ? "Admin" : "Dashboard";
  const primaryNav = visibleFor(navLinks, role);
  const mobileSecondaryNav = visibleFor(secondaryLinks, role);
  const handleSignOut = async () => {
    await signOutAndClear({ redirectTo: "/" });
  };

  const email = session?.user?.email ?? "";
  const initials =
    (email.trim()[0] ?? "U").toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="container mx-auto px-4 h-20 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <Link to="/" className="flex items-center shrink-0 justify-self-start" aria-label="RE Pro Business Credit home">
          <img
            src={logoAsset.url}
            alt="RE Pro Business Credit"
            className="h-12 md:h-16 w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center justify-center gap-1">
          {primaryNav.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 rounded-full text-sm font-medium text-secondary/80 hover:text-primary hover:bg-primary/10 transition-colors",
                  isActive && "text-primary bg-primary/10"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2 justify-self-end">
          {session ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Account menu"
                    className="inline-flex items-center justify-center rounded-full border border-border bg-white p-1 text-secondary transition-colors hover:bg-secondary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-secondary/10 text-secondary text-sm font-semibold">
                        {initials || <User className="h-4 w-4" aria-hidden="true" />}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover">
                  {email && (
                    <>
                      <DropdownMenuLabel className="truncate font-normal text-xs text-muted-foreground">
                        {email}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to={authedHome} className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" aria-hidden="true" />
                      {authedLabel}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-secondary hover:bg-secondary/5 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/guide"
                data-analytics-id="cta-start-here-header"
                className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-card hover:bg-primary/90 transition-colors"
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
              {primaryNav.map((l) => (
                <SheetClose asChild key={l.to}>
                  <Link
                    to={l.to}
                    className="px-3 py-3 rounded-xl text-base font-medium text-secondary hover:bg-secondary/5"
                  >
                    {l.label}
                  </Link>
                </SheetClose>
              ))}
              {mobileSecondaryNav.map((l) => (
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
                      to="/login"
                      className="inline-flex items-center justify-center rounded-full border border-border bg-white px-4 py-3 text-sm font-semibold text-secondary"
                    >
                      Log in
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      to="/guide"
                      className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
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
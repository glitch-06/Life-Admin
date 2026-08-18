import { useState } from "react";
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { Menu, Moon, Plus, Sun } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNavigation } from "@/components/MobileNavigation";
import { AddSomethingModal } from "@/components/AddSomethingModal";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { primaryNav, secondaryNav } from "@/components/nav-config";
import { AddModalContext } from "@/lib/add-modal";
import { AppStoreProvider } from "@/lib/store";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <AppStoreProvider>
      <TooltipProvider delayDuration={200}>
        <AddModalContext.Provider value={{ open: () => setAddOpen(true) }}>
          <div className="flex min-h-screen bg-background">
            <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((prev) => !prev)} />

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/90 px-4 backdrop-blur sm:px-6">
                <div className="flex items-center gap-2">
                  <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                        <Menu />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-72 p-0">
                      <SheetTitle className="sr-only">Navigation</SheetTitle>
                      <div className="flex h-16 items-center px-4">
                        <Logo />
                      </div>
                      <nav className="space-y-1 px-3" aria-label="Mobile">
                        {[...primaryNav, ...secondaryNav].map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            activeOptions={{ exact: item.to === "/app" }}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/85 hover:bg-accent"
                            activeProps={{ className: "bg-accent text-accent-foreground" }}
                          >
                            <item.icon className="size-4" aria-hidden="true" />
                            {item.label}
                          </Link>
                        ))}
                      </nav>
                    </SheetContent>
                  </Sheet>
                  <Link to="/app" className="lg:hidden">
                    <Logo />
                    <span className="sr-only">Life Admin overview</span>
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                  >
                    {theme === "dark" ? <Sun /> : <Moon />}
                  </Button>
                  <Button onClick={() => setAddOpen(true)} className="hidden sm:inline-flex">
                    <Plus aria-hidden="true" />
                    Add something
                  </Button>
                </div>
              </div>

              <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-6 sm:px-6 lg:pb-12">
                <Outlet />
              </main>
            </div>

            <MobileNavigation />
            <AddSomethingModal open={addOpen} onOpenChange={setAddOpen} />
          </div>
        </AddModalContext.Provider>
      </TooltipProvider>
    </AppStoreProvider>
  );
}

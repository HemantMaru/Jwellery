import { memo, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useFavorites } from "../../../context/FavoritesContext";
import { useTheme } from "../../../context/ThemeContext";
import { authService } from "../../../services/auth.service";

const SearchIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const HeartIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const MenuIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const SunIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
      d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364-1.414-1.414M7.05 7.05 5.636 5.636m12.728 0-1.414 1.414M7.05 16.95l-1.414 1.414M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const MoonIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
      d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
    />
  </svg>
);

const navItems = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const navLinkClass = ({ isActive }) =>
  `relative text-sm font-medium uppercase tracking-[0.18em] transition-all duration-300 py-1 ${
    isActive
      ? "text-[var(--color-accent)] after:absolute after:-bottom-1 after:left-1/2 after:h-[1px] after:w-1/2 after:-translate-x-1/2 after:bg-[var(--color-accent)]"
      : "text-[var(--color-muted)] hover:text-[#C9A14A] hover:-translate-y-[1px]"
  }`;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleDark } = useTheme();
  const { favoriteCount } = useFavorites();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isAuthenticated = authService.isAuthenticated();

  const [searchInput, setSearchInput] = useState("");

  const triggerSearch = (e) => {
    if (e) e.preventDefault();
    const normalized = searchInput.replace(/\s+/g, " ").trimStart();
    const trimmed = normalized.trim();
    if (trimmed) {
      navigate(`/products?search=${encodeURIComponent(trimmed)}`);
      setSearchInput("");
      setIsSearchOpen(false);
    }
  };

  const closePanels = () => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  };

  // Navigation helper logic removed in favor of form submission

  const handleLogout = () => {
    authService.logout();
    closePanels();
    navigate("/login", { replace: true });
  };

  const iconButtonClass = useMemo(
    () =>
      "relative flex h-10 w-10 items-center justify-center text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]",
    [],
  );

  return (
    <nav className="glass-panel fixed top-0 z-50 w-full border-b border-[var(--color-border)] font-['Poppins']">
      <div className="section-shell">
        <div className="flex h-20 items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className={`${iconButtonClass} md:hidden`}
            title="Toggle menu"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          <button
            type="button"
            onClick={() => {
              navigate("/");
              closePanels();
            }}
            className="font-['Playfair_Display'] text-2xl font-bold tracking-[0.14em] text-[var(--color-text)]"
            aria-label="Go to homepage"
          >
            AURUM
          </button>

          <div className="hidden items-center space-x-8 md:flex">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
            >
              Admin
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <form
              onSubmit={triggerSearch}
              className="relative hidden h-11 w-64 items-center border border-[var(--color-border)] bg-[var(--color-surface)] lg:flex focus-within:border-[var(--color-accent)] focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-accent)_18%,transparent)] transition-all duration-300"
            >
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">
                <SearchIcon />
              </span>
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search pieces..."
                className="h-full w-full bg-transparent pl-10 pr-10 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-muted)]"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
                  title="Clear search"
                >
                  <CloseIcon />
                </button>
              )}
            </form>

            <button
              type="button"
              onClick={() => setIsSearchOpen((open) => !open)}
              className={`${iconButtonClass} lg:hidden`}
              title="Search products"
              aria-label="Open search"
            >
              <SearchIcon />
            </button>

            <button
              type="button"
              onClick={() => navigate("/favorites")}
              className={iconButtonClass}
              title="Favorites"
            >
              <HeartIcon />
              {favoriteCount > 0 && (
                <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-accent)] px-1 text-[11px] text-white">
                  {favoriteCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={toggleDark}
              className={iconButtonClass}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>

            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)] sm:inline-flex"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 lg:hidden">
          <form
            onSubmit={triggerSearch}
            className="relative mx-auto flex h-12 max-w-xl items-center border border-[var(--color-border)] bg-[var(--color-surface)] focus-within:border-[var(--color-accent)] focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-accent)_18%,transparent)] transition-all duration-300"
          >
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">
              <SearchIcon />
            </span>
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              autoFocus
              placeholder="Search products..."
              className="h-full w-full bg-transparent pl-10 pr-10 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-muted)]"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
                title="Clear search"
              >
                <CloseIcon />
              </button>
            )}
          </form>
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="absolute left-0 top-20 w-full border-b border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-4 shadow-[var(--shadow-soft)] md:hidden">
          <div className="mx-auto flex max-w-xl flex-col">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closePanels}
                className={({ isActive }) =>
                  `group relative flex items-center border-b border-[var(--color-border)] py-4 text-sm uppercase tracking-[0.18em] transition-all duration-300 ${
                    isActive
                      ? "font-semibold text-[var(--color-accent)] pl-2"
                      : "font-medium text-[var(--color-muted)] hover:text-[#C9A14A] hover:pl-2"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={() => {
                navigate("/favorites");
                closePanels();
              }}
              className="group relative flex items-center border-b border-[var(--color-border)] py-4 text-left text-sm font-medium uppercase tracking-[0.18em] text-[var(--color-muted)] transition-all duration-300 hover:text-[#C9A14A] hover:pl-2"
            >
              Favorites
            </button>
            <button
              type="button"
              onClick={() => {
                navigate("/admin");
                closePanels();
              }}
              className="group relative flex items-center border-b border-[var(--color-border)] py-4 text-left text-sm font-medium uppercase tracking-[0.18em] text-[var(--color-muted)] transition-all duration-300 hover:text-[#C9A14A] hover:pl-2"
            >
              Admin
            </button>
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="py-4 text-left text-sm font-medium uppercase tracking-[0.18em] text-[var(--color-danger)] transition-all duration-300 hover:pl-2"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default memo(Navbar);

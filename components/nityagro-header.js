"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import useCartStore from "@/store/cartStore";
import useWishlistStore from "@/store/wishlistStore";
import { useAuthModal } from "@/app/account/useAuthModal";
import AuthModals from "@/app/account/AuthModals";
import { apiGetRequest } from "@/apihelper/apiHelper";
import toast from "react-hot-toast";
import SearchBar from "@/components/SearchBar";

/* ── Icons ── */
const SearchIcon = ({ className = "" }) => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const WishlistIcon = ({ className = "" }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CartIcon = ({ className = "" }) => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const UserIcon = ({ className = "" }) => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.3"
    className={className}
  >
    <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const GridIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <rect x="3" y="3" width="7" height="7" rx="2.5" />
    <rect x="13" y="3" width="7" height="7" rx="2.5" />
    <rect x="13" y="13" width="7" height="7" rx="2.5" />
    <rect x="3" y="13" width="7" height="7" rx="2.5" />
  </svg>
);

const ChevronDownIcon = ({ className = "" }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    className={className}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const MenuIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ── Nav links ── */
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Our Philosophy", href: "/philosophy" },
  {
    label: "Our Methods",
    hasDropdown: true,
    childLinks: [
      { label: "Wood Pressed", slug: "wood-pressed" },
      { label: "Cold Pressed", slug: "cold-pressed" },
      { label: "Stone Pressed", slug: "stone-pressed" },
    ],
  },
];

/* ── Badge ── */
const Badge = ({ count }) => (
  <span
    className="absolute -top-1 -right-1 min-w-4 h-4 px-1
               bg-[#C1272D] text-white text-[9px] font-bold rounded-full
               flex items-center justify-center leading-none ring-2 ring-white"
  >
    {count}
  </span>
);

/* ── Round icon-button used for search / wishlist / cart ── */
const IconButton = ({
  children,
  onClick,
  href,
  ariaLabel,
  badgeCount,
  className = "",
}) => {
  const base =
    "relative w-10 h-10 rounded-full flex items-center justify-center text-[#3E4A44] " +
    "hover:bg-[#EAF3EC] hover:text-[#1E2DD8] transition-colors duration-200";
  if (href) {
    return (
      <Link
        href={href}
        aria-label={ariaLabel}
        className={`${base} ${className}`}
      >
        {children}
        {typeof badgeCount === "number" && badgeCount > 0 && (
          <Badge count={badgeCount} />
        )}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`${base} ${className}`}
    >
      {children}
      {typeof badgeCount === "number" && badgeCount > 0 && (
        <Badge count={badgeCount} />
      )}
    </button>
  );
};

export default function Header() {
  const [methodsOpen, setMethodsOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMethodsOpen, setMobileMethodsOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [promoMessages, setPromoMessages] = useState([
    "12% OFF above · Code: NEW12",
  ]);
  const [promoIndex, setPromoIndex] = useState(0);
  const [authUser, setAuthUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const auth = useAuthModal();
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const setCartUser = useCartStore((state) => state.setCartUser);
  const setCartItems = useCartStore((state) => state.setCartItems);
  const clearAllCartState = useCartStore((state) => state.clearAllCartState);
  const wishlistItems = useWishlistStore((state) => state.items);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const setWishlistUser = useWishlistStore((state) => state.setWishlistUser);
  const setWishlistItems = useWishlistStore((state) => state.setWishlistItems);
  const clearAllWishlistState = useWishlistStore(
    (state) => state.clearAllWishlistState,
  );
  const cartCount = cartItems.reduce(
    (sum, item) => sum + Number(item.qty || 1),
    0,
  );
  const wishlistCount = wishlistItems.length;
  const isLoggedIn = Boolean(authUser?.userId);
  const accountHref = "/profile";

  const categoryRef = useRef(null);
  const methodsRef = useRef(null);

  const clearAuthState = () => {
    setAuthUser(null);
    clearAllCartState();
    clearAllWishlistState();
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("admin_token");
    window.localStorage.removeItem("admin_auth");
    window.localStorage.removeItem("auth_user");
    window.localStorage.removeItem("userId");
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Local cleanup below is the source of truth for the browser state.
    }

    clearAuthState();
    setMobileMenuOpen(false);
    toast.success("Logged out successfully");
    window.location.href = "/";
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryOpen(false);
      }
      if (methodsRef.current && !methodsRef.current.contains(e.target)) {
        setMethodsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Subtle elevation once the page scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await apiGetRequest("/categories");
      const rows = Array.isArray(response?.data) ? response.data : [];
      const active = rows.filter((item) => item.categoryStatus !== false);
      setCategories(active);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const loadAuthUser = async () => {
      try {
        const cachedUser = window.localStorage.getItem("auth_user");
        if (cachedUser) {
          setAuthUser(JSON.parse(cachedUser));
        }
      } catch {
        window.localStorage.removeItem("auth_user");
      }

      try {
        const token = window.localStorage.getItem("token");
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const payload = await response.json();

        if (!response.ok || !payload?.success || !payload?.data?.userId) {
          clearAuthState();
          return;
        }

        const nextUser = payload.data;
        setAuthUser(nextUser);
        setCartUser(nextUser.userId);
        setWishlistUser(nextUser.userId);
        window.localStorage.setItem("auth_user", JSON.stringify(nextUser));
        window.localStorage.setItem("userId", nextUser.userId);

        const authHeaders = {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
        const [cartResponse, wishlistResponse] = await Promise.all([
          fetch("/api/account/cart", {
            headers: authHeaders,
            credentials: "include",
          })
            .then((res) => res.json())
            .catch(() => null),
          fetch("/api/account/wishlist", {
            headers: authHeaders,
            credentials: "include",
          })
            .then((res) => res.json())
            .catch(() => null),
        ]);

        if (cartResponse?.success) {
          setCartItems(cartResponse.data || []);
        }
        if (wishlistResponse?.success) {
          setWishlistItems(wishlistResponse.data || []);
        }
      } catch {
        setAuthUser(null);
      } finally {
        setAuthReady(true);
      }
    };

    loadAuthUser();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("login") === "1") {
      auth.openLogin();
    }
    if (params.get("google_login") === "1") {
      toast.success("Google login successful. Welcome!");
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("google_login");
      window.history.replaceState({}, "", cleanUrl.toString());
    }
    if (params.get("google_error") === "1") {
      toast.error("Google login failed. Please try again.");
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("google_error");
      window.history.replaceState({}, "", cleanUrl.toString());
    }
    if (params.get("google_inactive") === "1") {
      toast.error("Your account is inactive. Please contact support.");
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("google_inactive");
      window.history.replaceState({}, "", cleanUrl.toString());
    }
  }, []);

  useEffect(() => {
    const fetchPopupPromo = async () => {
      try {
        const response = await apiGetRequest("/popup-ads");
        const rows = Array.isArray(response?.data?.popupAds)
          ? response.data.popupAds
          : [];
        const activeRows = rows.filter((item) => item.isActive !== false);
        const messages = (activeRows.length ? activeRows : rows)
          .map((item) => item.popupDescription || item.title || "")
          .map((item) => String(item).trim())
          .filter(Boolean);

        if (messages.length > 0) {
          setPromoMessages(messages);
          setPromoIndex(0);
        }
      } catch {
        // keep fallback promo text
      }
    };
    fetchPopupPromo();
  }, []);

  useEffect(() => {
    if (promoMessages.length <= 1) return;

    const timer = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % promoMessages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [promoMessages]);

  const promoText = promoMessages[promoIndex] || "12% OFF above · Code: NEW12";

  return (
    <header
      className="sticky top-0 z-50 w-full left-0 right-0"
      style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box" }}
    >
      {/* ── Promo bar ── */}
      <div
        className="w-full bg-gradient-to-r from-[#1E2DD8] to-[#e35757] h-9 overflow-hidden"
        style={{ width: "100%", boxSizing: "border-box" }}
      >
        <div className="flex md:hidden items-center justify-center h-full px-4 text-[12px] text-white font-medium gap-1.5 tracking-wide">
          <span className="text-[13px]">🌿</span>
          <span>{promoText}</span>
        </div>
        <div className="hidden md:flex items-center justify-between h-full px-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-[12.5px] text-white/95 font-medium tracking-wide"
            >
              <span className="text-[14px]">🌿</span>
              <span>{promoText}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main navbar ── */}
      <nav
        className={`w-full bg-[#FFFFFF] border-b border-[#ECECEC] transition-shadow duration-200 ${
          scrolled
            ? "border-transparent shadow-[0_4px_16px_-8px_rgba(0,70,44,0.18)]"
            : "border-[#EDF1EE]"
        }`}
        style={{ width: "100%", boxSizing: "border-box" }}
      >
        <div className="w-full max-w-360 mx-auto h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 lg:gap-8">
          {/* ── Left: Logo lockup ── */}
          <Link
            href="/"
            className="flex items-center gap-2.5 sm:gap-3 shrink-0 group"
          >
            <span
              className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12
                         rounded-xl bg-white ring-1 ring-[#EAEFEC] shadow-sm overflow-hidden shrink-0
                         group-hover:ring-[#266A3F]/40 transition-colors duration-200"
            >
              <Image
                src="/dxnlogo-removebg-preview.png"
                alt="DXN Nepal"
                fill
                className="object-contain p-1"
              />
            </span>
            <span className="hidden xs:flex flex-col leading-none">
              <span className="text-[17px] sm:text-[19px] font-extrabold tracking-tight text-[#1E2DD8]">
                DXN <span className="text-[#E53935]">Nepal</span>
              </span>
              <span className="hidden sm:block text-[10px] font-medium tracking-[0.18em] text-[#7C8B83] uppercase mt-0.5">
                Wellness &amp; Ganoderma
              </span>
            </span>
          </Link>

          {/* ── Center: Categories + Nav links (desktop) ── */}
          <div className="hidden lg:flex flex-1 items-center gap-2 min-w-0">
            {/* Browse Categories */}
            <div className="relative shrink-0" ref={categoryRef}>
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className={`h-10 pl-3 pr-3.5 flex items-center gap-2 rounded-full text-[13.5px] font-semibold transition-colors duration-200
                  ${
                    categoryOpen
                      ? "bg-[#1E2DD8] text-white"
                      : "bg-[#1E2DD8] text-[#00462C] hover:bg-[#1523B8]"
                  }`}
              >
                <GridIcon className="w-3.5 h-3.5 text-[#FFFFFF]" />
                <span className="whitespace-nowrap text-[#FFFFFF]">
                  Categories
                </span>
                <ChevronDownIcon
                  className={`transition-transform duration-200 text-[#FFFFFF] ${
                    categoryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`absolute top-full left-0 mt-2 w-56 bg-white border border-[#EAEFEC] rounded-xl shadow-xl overflow-hidden z-50
                 transform origin-top transition-all duration-200 ease-out
                 ${
                   categoryOpen
                     ? "opacity-100 scale-100 pointer-events-auto"
                     : "opacity-0 scale-95 pointer-events-none"
                 }`}
              >
                {categories.length === 0 && (
                  <div className="px-5 py-3 text-[13px] text-[#9AA6A0]">
                    No categories yet
                  </div>
                )}
                {categories.map((item) => (
                  <Link
                    key={item.categoryId || item.categoryName}
                    href={`/products?category=${encodeURIComponent(
                      item.categoryName,
                    )}`}
                    onClick={() => setCategoryOpen(false)}
                    className="block px-5 py-2.5 text-[13.5px] text-[#1E2DD8] hover:bg-[#b0dcbf] hover:text-[#00462C] transition-colors"
                  >
                    {item.categoryName}
                  </Link>
                ))}
              </div>
            </div>

            <span className="w-px h-6 bg-[#EAEFEC] mx-1.5 shrink-0" />

            {searchOpen ? (
              <div className="flex-1 max-w-140">
                <SearchBar onClose={() => setSearchOpen(false)} />
              </div>
            ) : (
              <div className="flex items-center gap-1 flex-wrap">
                {NAV_LINKS.map((link) => (
                  <div
                    key={link.label}
                    className="relative flex items-center"
                    ref={link.hasDropdown ? methodsRef : undefined}
                  >
                    {link.hasDropdown ? (
                      <>
                        <button
                          onClick={() => setMethodsOpen(!methodsOpen)}
                          className="flex items-center gap-1 h-10 px-3.5 rounded-full text-[14px] font-semibold text-[#2D3748] hover:bg-[#f5f8f8] hover:text-[#1E2DD8] transition-colors duration-200"
                        >
                          {link.label}
                          <ChevronDownIcon
                            className={`transition-transform duration-200 ${
                              methodsOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        <div
                          className={`absolute top-full left-0 mt-2 w-40 bg-white border border-[#EAEFEC] rounded-xl shadow-xl overflow-hidden z-50
                         origin-top transform-gpu transition-all duration-200 ease-out
                         ${
                           methodsOpen
                             ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto"
                             : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
                         }`}
                        >
                          {link.childLinks.map((child) => (
                            <Link
                              key={child.label}
                              href={`/methods/${child.slug}`}
                              onClick={() => setMethodsOpen(false)}
                              className="block px-5 py-2.5 text-[13px] text-[#1E2DD8] hover:bg-[#b0dcbf] hover:text-[#1E2DD8] transition border-b border-[#F1F4F2] last:border-b-0"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : (
                      <a
                        href={link.href}
                        className="h-10 flex items-center px-3.5 rounded-full text-[14px] font-semibold text-[#2D3748] hover:bg-[#F5F8F6] hover:text-[#1E2DD8] transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Icons ── */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              className="hidden lg:flex"
              aria-label="Search"
              onClick={() => {
                setMethodsOpen(false);
                setCategoryOpen(false);
                setSearchOpen(true);
              }}
            >
              <IconButton
                ariaLabel="Search"
                onClick={() => setSearchOpen(true)}
              >
                <SearchIcon className="w-5 h-5 text-[#2D3748]" />
              </IconButton>
            </button>
            <Link href="/products" className="lg:hidden" aria-label="Search">
              <IconButton ariaLabel="Search">
                <SearchIcon />
              </IconButton>
            </Link>

            {!authReady ? (
              <span
                className="hidden lg:block h-9 w-24 rounded-full bg-[#F1F4F2] animate-pulse"
                aria-hidden="true"
              />
            ) : isLoggedIn ? (
              <>
                <IconButton
                  href="/wishlist"
                  ariaLabel="Wishlist"
                  badgeCount={wishlistCount}
                  className="hidden sm:flex"
                >
                  <WishlistIcon />
                </IconButton>

                <IconButton
                  href="/cart"
                  ariaLabel="Cart"
                  badgeCount={cartCount}
                >
                  <CartIcon />
                </IconButton>

                <Link
                  href={accountHref}
                  className="hidden lg:flex items-center gap-2 h-10 pl-1.5 pr-4 ml-1 rounded-full bg-[#F5F8F6] hover:bg-[#EAF3EC] transition-colors duration-200"
                  title={authUser?.name || "My Account"}
                >
                  <span className="w-7 h-7 rounded-full bg-[#00462C] text-white text-[12px] font-bold flex items-center justify-center shrink-0">
                    {(authUser?.name || "A").trim().charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-24 truncate text-[13.5px] font-semibold text-[#2D332F]">
                    {authUser?.name || "Account"}
                  </span>
                </Link>
              </>
            ) : (
              <button
                className="hidden lg:flex items-center gap-2 h-10 pl-4 pr-4.5 ml-1 rounded-full bg-[#1E2DD8] text-white text-[13.5px] font-semibold hover:bg-[#1523B8] transition-colors duration-200 shadow-sm"
                onClick={auth.openLogin}
              >
                <UserIcon />
                Log in
              </button>
            )}

            {/* Hamburger — mobile/tablet only */}
            <button
              className="lg:hidden ml-0.5"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <IconButton ariaLabel="Open menu">
                <MenuIcon />
              </IconButton>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer overlay ── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <div
        className={`
          fixed top-0 left-0 h-full w-75 max-w-[85vw] bg-white z-50
          shadow-2xl flex flex-col transition-transform duration-300 ease-in-out lg:hidden
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-20 border-b border-[#EDF1EE] bg-[#F9FBFA]">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5"
          >
            <span className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white ring-1 ring-[#EAEFEC] shadow-sm overflow-hidden shrink-0">
              <Image
                src="/dxnlogo.jpg"
                alt="DXN Nepal"
                fill
                className="object-contain p-1"
              />
            </span>
            <span className="text-[16px] font-extrabold tracking-tight text-[#00462C]">
              DXN <span className="text-[#C1272D]">Nepal</span>
            </span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-[#1a1a1a] hover:text-[#1E2DD8] transition-colors"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Drawer body */}
        <div className="flex-1 overflow-y-auto py-4">
          {/* Browse Categories (mobile) */}
          <div className="px-5 mb-1">
            <button
              onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}
              className="w-full flex items-center justify-between py-3 text-[15px] font-semibold text-[#1a1a1a]"
            >
              <span className="flex items-center gap-2">
                <GridIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#266A3F]" />
                Browse Categories
              </span>
              <span
                className={`transition-transform duration-200 ${
                  mobileCategoryOpen ? "rotate-180" : ""
                }`}
              >
                <ChevronDownIcon />
              </span>
            </button>
            {mobileCategoryOpen && (
              <div className="pl-7 pb-2 flex flex-col gap-0.5">
                {categories.map((item) => (
                  <Link
                    key={item.categoryId || item.categoryName}
                    href={`/products?category=${encodeURIComponent(
                      item.categoryName,
                    )}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-[14px] text-[#00462C] hover:font-medium transition"
                  >
                    {item.categoryName}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="mx-5 h-px bg-[#E6ECF0] my-1" />

          {/* Nav links (mobile) */}
          {NAV_LINKS.map((link) => (
            <div key={link.label} className="px-5 ">
              {link.hasDropdown ? (
                <>
                  <button
                    onClick={() => setMobileMethodsOpen(!mobileMethodsOpen)}
                    className="w-full flex items-center justify-between py-3 text-[15px] font-medium text-[#1a1a1a]"
                  >
                    {link.label}
                    <span
                      className={`transition-transform duration-200 ${
                        mobileMethodsOpen ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDownIcon />
                    </span>
                  </button>
                  <div
                    className={`pl-4 flex flex-col gap-0.5 overflow-hidden
                    transition-[max-height,opacity] duration-300 ease-in-out
                    ${
                      mobileMethodsOpen
                        ? "max-h-60 opacity-100 pb-2"
                        : "max-h-0 opacity-0 pb-0 pointer-events-none"
                    }`}
                  >
                    {link.childLinks.map((child) => (
                      <Link
                        key={child.label}
                        href={`/methods/${child.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2.5 text-[14px] text-[#00462C] hover:font-medium transition"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <a
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 text-[15px] font-medium text-[#1a1a1a] hover:text-[#1E2DD8] transition-colors"
                >
                  {link.label}
                </a>
              )}
            </div>
          ))}

          <div className="mx-5 h-px bg-[#E6ECF0] my-1" />

          <div className="px-5">
            {!authReady ? (
              <div className="space-y-2 py-3">
                <div className="h-4 w-28 rounded bg-gray-100" />
                <div className="h-4 w-24 rounded bg-gray-100" />
              </div>
            ) : isLoggedIn ? (
              <div className="space-y-1">
                <Link
                  href={accountHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center gap-3 py-3 text-[15px] font-medium text-[#266A3F] hover:text-[#1E2DD8] transition-colors"
                >
                  <UserIcon className="text-[#266A3F]" />
                  {authUser?.name || "My Account"}
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center gap-3 py-3 text-[15px] font-medium text-[#266A3F] hover:text-[#1E2DD8] transition-colors"
                >
                  <WishlistIcon />
                  Wishlist ({wishlistCount})
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center gap-3 py-3 text-[15px] font-medium text-[#266A3F] hover:text-[#1E2DD8] transition-colors"
                >
                  <CartIcon />
                  Cart ({cartCount})
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 py-3 text-[15px] font-medium text-red-500 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  auth.openLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 py-3 text-[15px] font-medium text-[#266A3F] hover:text-[#1E2DD8] transition-colors"
              >
                <UserIcon className="text-[#266A3F]" />
                Log in
              </button>
            )}
          </div>
        </div>

        {/* Drawer footer */}
        <div className="px-5 py-4 border-t border-[#E6ECF0] bg-gradient-to-r from-[#1E2DD8] to-[#266A3F]">
          <p className="text-[12px] text-white font-medium text-center tracking-wide">
            🌿 12% OFF above · Code: <span className="font-bold">NEW12</span>
          </p>
        </div>
      </div>

      <AuthModals auth={auth} />
    </header>
  );
}

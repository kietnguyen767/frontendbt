"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { apiFetch } from "@/lib/api"; // bạn đã có sẵn hàm này

export default function Navbar() {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotiPopover, setShowNotiPopover] = useState(false);
  const [showProfilePopover, setShowProfilePopover] = useState(false);
  const notiRef = useRef(null);
  const profileRef = useRef(null);

  const [notifications, setNotifications] = useState([]);

  // 🔹 Kiểm tra token và lấy thông tin user
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (token) {
      setIsAuth(true);
      // try to use cached userInfo first for instant UI update
      const cached = localStorage.getItem("userInfo");
      if (cached) {
        try {
          setUser(JSON.parse(cached).user || JSON.parse(cached));
        } catch {}
      }
      fetchUser();
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    const handleClickOutside = (e) => {
      if (
        notiRef.current &&
        !notiRef.current.contains(e.target) &&
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setShowNotiPopover(false);
        setShowProfilePopover(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("click", handleClickOutside);
    // listen for login/logout events from other pages to update navbar immediately
    const onLogin = () => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsAuth(true);
        const cached = localStorage.getItem("userInfo");
        if (cached) {
          try {
            setUser(JSON.parse(cached).user || JSON.parse(cached));
          } catch {}
        }
        fetchUser();
      }
    };
    const onLogout = () => {
      setIsAuth(false);
      setUser(null);
    };
    window.addEventListener("login", onLogin);
    window.addEventListener("logout", onLogout);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("login", onLogin);
      window.removeEventListener("logout", onLogout);
    };
  }, []);

  // 🔹 Lấy thông tin user (API thật)
  const fetchUser = async () => {
    try {
      const data = await apiFetch("/auth/me");
      setUser(data.user);
    } catch {
      setIsAuth(false);
      localStorage.removeItem("token");
    }
  };

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    setUser(null);
    try {
      window.dispatchEvent(new Event('logout'));
    } catch {}
    window.location.href = "/";
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-xl shadow-lg"
            : "bg-white/60 backdrop-blur-md shadow"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* 🌈 Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition"></div>
                <div className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl font-bold text-2xl shadow-lg group-hover:scale-105 transition">
                  🛍️
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent group-hover:from-orange-500 group-hover:to-red-500 transition-all">
                MyShop
              </span>
            </Link>

            {/* 🌐 Menu desktop */}
            <div className="hidden md:flex items-center gap-3 relative">
              <NavLink href="/" label="🏠 Trang chủ" />

              {isAuth && <NavLink href="/create" label="➕ Thêm sản phẩm" />}

              {/* 🔔 Thông báo */}
              <div ref={notiRef} className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowNotiPopover(!showNotiPopover);
                    setShowProfilePopover(false);
                  }}
                  className="relative px-4 py-2.5 text-gray-700 hover:text-orange-600 rounded-xl hover:bg-orange-50 transition-all hover:scale-105"
                >
                  🔔
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {showNotiPopover && (
                  <div className="absolute right-0 mt-3 w-80 bg-white shadow-xl rounded-2xl p-3 border border-gray-100 animate-fadeIn">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
                      🔔 Thông báo
                    </h3>
                    {notifications.length > 0 ? (
                      <ul className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
                        {notifications.map((n, i) => (
                          <li
                            key={i}
                            className="py-2 px-2 text-sm text-gray-700 hover:bg-orange-50 rounded-lg cursor-pointer"
                          >
                            {n}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-3">
                        Không có thông báo nào.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* 👤 Hồ sơ */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfilePopover(!showProfilePopover);
                    setShowNotiPopover(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-orange-600 rounded-xl hover:bg-orange-50 transition-all hover:scale-105"
                >
                  👤
                </button>

                {showProfilePopover && (
                  <div className="absolute right-0 mt-3 w-72 bg-white shadow-xl rounded-2xl p-4 border border-gray-100 animate-fadeIn">
                    {isAuth && user ? (
                      <>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold">
                            {user.email.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p
                              className="font-semibold text-gray-800 truncate max-w-[200px]"
                              title={user.email}
                            >
                              {user.email}
                            </p>
                            <p className="text-sm text-gray-500">Đang hoạt động ✅</p>
                          </div>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:scale-105 transition-all"
                        >
                          🚪 Đăng xuất
                        </button>
                      </>
                    ) : (
                      <div className="text-center">
                        <p className="text-gray-600 mb-3">Bạn chưa đăng nhập</p>
                        <Link
                          href="/login"
                          className="inline-block px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:scale-105 transition-all"
                        >
                          🔐 Đăng nhập
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 📱 Mobile toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-orange-50 transition"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* 🌐 Menu mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-lg animate-fadeIn">
            <div className="px-4 py-4 space-y-2">
              <NavLink
                href="/"
                label="🏠 Trang chủ"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              {isAuth && (
                <NavLink
                  href="/create"
                  label="➕ Thêm sản phẩm"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              )}
              {!isAuth ? (
                <>
                  <NavLink
                    href="/login"
                    label="🔐 Đăng nhập"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-5 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl text-center hover:shadow-lg transition"
                  >
                    ✨ Đăng ký
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-5 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl text-center hover:shadow-lg transition"
                >
                  🚪 Đăng xuất
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div className="h-20"></div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>
    </>
  );
}

// 🔸 Component con cho link
function NavLink({ href, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="px-5 py-2.5 text-gray-700 hover:text-orange-600 font-medium rounded-xl hover:bg-orange-50 transition-all hover:scale-105"
    >
      {label}
    </Link>
  );
}

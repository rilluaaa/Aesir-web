import React, { useEffect, useState } from "react";
import { contentData } from "../constants";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const logoPath = `${import.meta.env.BASE_URL}assets/images/neuro-business-futures-logo.png`;

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const sectionIds = [
      "top",
      ...contentData.header.nav.map((item) => item.id),
    ];
    const sectionElements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const updateActiveSection = () => {
      const referencePoint = window.scrollY + window.innerHeight * 0.36;
      const current = sectionElements.reduce((active, section) => {
        return section.offsetTop <= referencePoint ? section : active;
      }, sectionElements[0]);

      if (current?.id) {
        setActiveSection(current.id);
      }
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/82 px-3 py-3 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 shadow-[0_20px_80px_rgba(0,0,0,0.32)]">
        <button
          onClick={() => scrollToSection("top")}
          className="group flex min-w-0 items-center rounded-full bg-white px-3 py-1.5 text-left shadow-[0_0_24px_rgba(255,255,255,0.08)] transition hover:bg-cyan-50"
        >
          <img
            src={logoPath}
            alt={contentData.header.logo}
            className="h-9 w-[185px] object-contain sm:w-[220px]"
          />
        </button>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full border border-white/15 bg-white/[0.04] p-2 text-white transition hover:border-cyan-200 hover:text-cyan-200 lg:hidden"
          aria-label="Toggle navigation"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-black/35 p-1 lg:flex">
          {contentData.header.nav.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={`group relative cursor-pointer rounded-full px-3.5 py-2.5 text-[10px] font-black uppercase tracking-[0.18em] transition duration-300 ${
                  isActive
                    ? "bg-white text-black shadow-[0_0_28px_rgba(255,255,255,0.22)]"
                    : "text-gray-500 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="relative z-10 inline-flex items-center gap-2">
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition ${
                      isActive
                        ? "bg-cyan-400"
                        : "bg-white/20 group-hover:bg-cyan-200"
                    }`}
                  />
                  {item.label}
                </span>
                <span
                  className={`absolute inset-x-3 -bottom-1 h-px origin-center bg-cyan-200 transition-transform duration-300 ${
                    isActive
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </nav>

        <button
          onClick={() => scrollToSection("programs")}
          className="hidden rounded-full border border-cyan-200/30 bg-cyan-200/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100 transition hover:bg-cyan-200 hover:text-black xl:inline-flex"
        >
          View Work
        </button>

        <a
          href="#/founders"
          className="hidden rounded-full bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-black transition hover:bg-cyan-200 xl:inline-flex"
        >
          Led By
        </a>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="absolute left-3 right-3 top-full mt-2 overflow-hidden rounded-3xl border border-white/10 bg-[#090909]/95 shadow-2xl shadow-black/50 backdrop-blur-xl lg:hidden">
            <nav className="flex flex-col gap-2 p-3">
              {contentData.header.nav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  aria-current={activeSection === item.id ? "page" : undefined}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 text-left text-xs font-black uppercase tracking-[0.18em] transition ${
                    activeSection === item.id
                      ? "bg-white text-black"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`h-2 w-2 rounded-full ${activeSection === item.id ? "bg-cyan-400" : "bg-white/20"}`}
                  />
                </button>
              ))}
              <button
                onClick={() => scrollToSection("programs")}
                className="rounded-2xl bg-cyan-200 px-4 py-3 text-left text-xs font-black uppercase tracking-[0.18em] text-black"
              >
                View Work
              </button>
              <a
                href="#/founders"
                onClick={() => setIsOpen(false)}
                className="rounded-2xl bg-white px-4 py-3 text-left text-xs font-black uppercase tracking-[0.18em] text-black"
              >
                Led By
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

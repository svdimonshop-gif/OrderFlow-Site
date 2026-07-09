"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Boxes,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Download,
  Languages,
  Menu,
  Moon,
  PackageCheck,
  QrCode,
  ScanLine,
  Search,
  Send,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sun,
  X,
  Zap
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { copy, faqCategories, faqItems, languages, type Lang } from "@/data/content";
import { heroStages, screenById, screens } from "@/data/screens";
import type { ScreenId } from "@/data/screens";
import { asset, cx, formatBytes, formatDate, releaseFallback, releasePage, repo, telegramUrl } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

type PageKind = "home" | "faq" | "privacy";

type ReleaseInfo = {
  version: string;
  size: string;
  date: string;
  href: string;
  ready: boolean;
};

const iconMap = [ClipboardCheck, ScanLine, PackageCheck, ShieldCheck];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = () => setReduced(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export function OrderFlowSite({ initialPage }: { initialPage: PageKind }) {
  const [lang, setLang] = useState<Lang>("ru");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const [activeScreen, setActiveScreen] = useState(2);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [release, setRelease] = useState<ReleaseInfo>({
    version: "v2.7.2",
    size: "",
    date: copy.ru.hero.releaseFallback,
    href: releaseFallback,
    ready: false
  });
  const [faqSearch, setFaqSearch] = useState("");
  const [faqCategory, setFaqCategory] = useState("all");
  const [openFaq, setOpenFaq] = useState<string | null>("faq-1");
  const [feedbackType, setFeedbackType] = useState(0);
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const reducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const heroPhoneRef = useRef<HTMLDivElement>(null);
  const theaterRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<HTMLDivElement>(null);
  const stageTouch = useRef<{ x: number; y: number } | null>(null);
  const t = copy[lang];

  const activeStageData = heroStages[activeStage];
  const activeHeroScreen = screenById[activeStageData.screen];
  const activeTheaterScreen = screens[activeScreen];

  useEffect(() => {
    const savedLang = window.localStorage.getItem("orderflow-lang") as Lang | null;
    const savedTheme = window.localStorage.getItem("orderflow-theme") as "light" | "dark" | null;
    if (savedLang === "ru" || savedLang === "ua") setLang(savedLang);
    if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    window.localStorage.setItem("orderflow-lang", lang);
  }, [lang]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("orderflow-theme", theme);
  }, [theme]);

  useEffect(() => {
    const controller = new AbortController();
    async function loadRelease() {
      try {
        const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
          headers: { Accept: "application/vnd.github+json" },
          signal: controller.signal
        });
        if (!response.ok) throw new Error(`Release API ${response.status}`);
        const data = await response.json();
        const apk = data.assets?.find((assetItem: { name: string }) => assetItem.name === "OrderFlow.apk")
          || data.assets?.find((assetItem: { name: string }) => assetItem.name?.toLowerCase().endsWith(".apk"));
        const tag = data.tag_name || "v2.7.2";
        const dateSource = apk?.updated_at || data.published_at;
        setRelease({
          version: tag,
          size: apk?.size ? formatBytes(apk.size, lang) : "",
          date: `${t.hero.updated} ${formatDate(dateSource, lang)}`,
          href: apk?.browser_download_url || releaseFallback,
          ready: Boolean(apk?.browser_download_url)
        });
      } catch {
        setRelease({
          version: "v2.7.2",
          size: "",
          date: t.hero.releaseFallback,
          href: releaseFallback,
          ready: false
        });
      }
    }
    loadRelease();
    return () => controller.abort();
  }, [lang, t.hero.releaseFallback, t.hero.updated]);

  useGSAP(
    () => {
      if (reducedMotion) return;
      gsap.fromTo(
        ".reveal",
        { y: 18, opacity: 0, clipPath: "inset(0 0 24% 0)" },
        {
          y: 0,
          opacity: 1,
          clipPath: "inset(0 0 0% 0)",
          duration: 0.7,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: undefined
        }
      );
    },
    { scope: rootRef, dependencies: [reducedMotion] }
  );

  useEffect(() => {
    if (reducedMotion || !heroPhoneRef.current) return;
    gsap.fromTo(
      heroPhoneRef.current,
      { opacity: 0.55, x: activeStage % 2 === 0 ? 18 : -18, filter: "blur(8px)" },
      { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.38, ease: "power3.out" }
    );
  }, [activeStage, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !theaterRef.current) return;
    gsap.fromTo(
      theaterRef.current.querySelector(".theater-copy"),
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.32, ease: "power2.out" }
    );
  }, [activeScreen, reducedMotion]);

  useEffect(() => {
    const rail = routeRef.current;
    const item = rail?.querySelector<HTMLElement>(`[data-stage-index="${activeStage}"]`);
    if (!rail || !item) return;
    const target = item.offsetLeft - (rail.clientWidth - item.clientWidth) / 2;
    rail.scrollTo({ left: Math.max(0, target), behavior: reducedMotion ? "auto" : "smooth" });
  }, [activeStage, reducedMotion]);

  const faqFiltered = useMemo(() => {
    const needle = faqSearch.trim().toLowerCase();
    return faqItems.filter((item) => {
      const categoryOk = faqCategory === "all" || item.category === faqCategory;
      const text = `${item.question[lang]} ${item.answer[lang]}`.toLowerCase();
      return categoryOk && (!needle || text.includes(needle));
    });
  }, [faqCategory, faqSearch, lang]);

  const navItems = [
    ["#features", t.nav.features],
    ["#screens", t.nav.screens],
    ["#workflow", t.nav.workflow],
    ["#security", t.nav.security],
    ["#feedback", t.nav.feedback]
  ] as const;

  const sectionHref = (href: string) => (initialPage === "home" ? href : asset(`/${href}`));

  function nextStage(direction: 1 | -1) {
    setActiveStage((current) => (current + direction + heroStages.length) % heroStages.length);
  }

  function nextScreen(direction: 1 | -1) {
    setActiveScreen((current) => (current + direction + screens.length) % screens.length);
  }

  function openTelegram() {
    const text = [
      "OrderFlow feedback",
      `Тип: ${t.feedback.types[feedbackType]}`,
      `Оценка: ${rating}/5`,
      `Версия: ${release.version}`,
      `Сообщение: ${message || "—"}`
    ].join("\n");
    window.open(`${telegramUrl}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  function renderHeader() {
    return (
      <>
        <header className="site-header">
          <Link className="brand" href="/">
            <img src={asset("/assets/logo.png")} width={42} height={42} alt="OrderFlow" />
            <span>OrderFlow</span>
          </Link>
          <nav className="desktop-nav" aria-label="Основная навигация">
            {navItems.map(([href, label]) => (
              <a key={href} href={sectionHref(href)}>
                {label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <LanguageToggle lang={lang} setLang={setLang} />
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <a className="btn btn-primary header-download" href={release.href}>
              <Download size={18} />
              {t.nav.download}
            </a>
            <button className="menu-button" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
              <Menu size={28} />
            </button>
          </div>
        </header>

        <div className={cx("mobile-sheet", menuOpen && "is-open")} aria-hidden={!menuOpen}>
          <div className="mobile-sheet-panel">
            <div className="mobile-sheet-head">
              <Link className="brand" href="/" onClick={() => setMenuOpen(false)}>
                <img src={asset("/assets/logo.png")} width={44} height={44} alt="OrderFlow" />
                <span>OrderFlow</span>
              </Link>
              <button className="menu-button" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
                <X size={30} />
              </button>
            </div>
            <nav className="mobile-nav" aria-label="Мобильная навигация">
              {navItems.map(([href, label]) => (
                <a key={href} href={sectionHref(href)} onClick={() => setMenuOpen(false)}>
                  {label}
                </a>
              ))}
              <Link href="/faq/" onClick={() => setMenuOpen(false)}>
                {t.nav.faq}
              </Link>
            </nav>
            <div className="mobile-controls">
              <LanguageToggle lang={lang} setLang={setLang} />
              <ThemeToggle theme={theme} setTheme={setTheme} />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (initialPage === "faq") {
    return (
      <div ref={rootRef} className="site-shell">
        {renderHeader()}
        <main className="page-shell faq-page">
          <Link className="back-link" href="/">
            <ChevronLeft size={18} /> {t.backHome}
          </Link>
          <SectionHeading eyebrow="OrderFlow FAQ" title={lang === "ru" ? "Найдите ответ без поисков в чатах." : "Знайдіть відповідь без пошуків у чатах."} />
          <FaqBlock
            lang={lang}
            faqFiltered={faqFiltered}
            faqSearch={faqSearch}
            setFaqSearch={setFaqSearch}
            faqCategory={faqCategory}
            setFaqCategory={setFaqCategory}
            openFaq={openFaq}
            setOpenFaq={setOpenFaq}
            full
          />
        </main>
      </div>
    );
  }

  if (initialPage === "privacy") {
    return (
      <div ref={rootRef} className="site-shell">
        {renderHeader()}
        <main className="page-shell">
          <Link className="back-link" href="/">
            <ChevronLeft size={18} /> {t.backHome}
          </Link>
          <SectionHeading
            eyebrow={lang === "ru" ? "Конфиденциальность" : "Конфіденційність"}
            title={lang === "ru" ? "Данные остаются в рабочем контуре." : "Дані залишаються в робочому контурі."}
          />
          <div className="privacy-grid">
            {[
              ["Локальное хранение", "OrderFlow сохраняет рабочие данные на устройстве для offline-first сценариев и восстановления процесса."],
              ["Корпоративная синхронизация", "Данные синхронизируются с корпоративным сервером OrderFlow. Сторонние облачные сервисы не используются."],
              ["Камера", "Камера используется только для сканирования штрихкодов и QR-кодов внутри рабочих операций."],
              ["Уведомления", "Уведомления нужны для информирования сотрудника о новых заказах и рабочих событиях."],
              ["Авторизация", "Вход выполняется через рабочие идентификаторы, без публичных аккаунтов и рекламных трекеров."],
              ["Обновления политики", "Политика обновляется вместе с изменениями приложения и публикуется на этой странице."]
            ].map(([title, text]) => (
              <article className="panel privacy-card" key={title}>
                <ShieldCheck size={24} />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="site-shell">
      {renderHeader()}
      <main>
        <section className="hero container">
          <div className="hero-copy reveal">
            <div className="badge badge-soft">
              <span className="dot" />
              {t.hero.eyebrow}
            </div>
            <h1>{t.hero.title}</h1>
            <p>{t.hero.subtitle}</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={release.href}>
                <Download size={20} /> {t.hero.primary} {release.version}
              </a>
              <a className="btn btn-secondary" href="#workflow">
                {t.hero.secondary} <ArrowRight size={20} />
              </a>
            </div>
            <div className="release-card">
              <span className={cx("release-led", release.ready && "is-ready")} />
              <div>
                <strong>{release.version}</strong>
                <span>{[release.size, release.date].filter(Boolean).join(" · ")}</span>
              </div>
            </div>
          </div>

          <div
            className="hero-visual reveal"
            onTouchStart={(event) => {
              const touch = event.touches[0];
              stageTouch.current = { x: touch.clientX, y: touch.clientY };
            }}
            onTouchEnd={(event) => {
              if (!stageTouch.current) return;
              const touch = event.changedTouches[0];
              const dx = touch.clientX - stageTouch.current.x;
              const dy = touch.clientY - stageTouch.current.y;
              if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy)) nextStage(dx < 0 ? 1 : -1);
              stageTouch.current = null;
            }}
          >
            <RouteIllustration />
            <div ref={heroPhoneRef} className="hero-phone-wrap">
              <PhoneFrame screenId={activeHeroScreen.id} lang={lang} priority />
              <div className="floating-status sync">
                <span className="dot" />
                {activeStage === 0 ? t.hero.synced : activeStageData.status[lang]}
              </div>
              <div className="floating-status offline">
                <span className="dot danger" />
                {t.hero.offline}
              </div>
              <div className="floating-status picked">{t.hero.picked}</div>
            </div>
            <div className="stage-strip" ref={routeRef}>
              {heroStages.map((stage, index) => (
                <button
                  key={stage.id}
                  data-stage-index={index}
                  className={cx("stage-pill", activeStage === index && "is-active")}
                  onClick={() => setActiveStage(index)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {stage.label[lang]}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="section container">
          <SectionHeading eyebrow={t.sections.featuresEyebrow} title={t.sections.featuresTitle} />
          <div className="stats-panel reveal">
            {t.stats.map(([value, label], index) => (
              <div className="stat-cell" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
                <i />
              </div>
            ))}
          </div>
          <div className="feature-grid">
            {t.featureCards.map(([title, text], index) => {
              const Icon = iconMap[index] || Check;
              return (
                <article className="panel feature-card reveal" key={title}>
                  <Icon size={28} />
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="screens" className="section container">
          <SectionHeading eyebrow={t.sections.theaterEyebrow} title={t.sections.theaterTitle} text={t.sections.theaterText} />
          <div className="theater panel reveal" ref={theaterRef}>
            <div className="theater-stage">
              <button className="screen-button" onClick={() => setLightbox(activeScreen)} aria-label="Open screen">
                <PhoneFrame screenId={activeTheaterScreen.id} lang={lang} />
              </button>
            </div>
            <div className="theater-copy">
              <span className="counter">{String(activeScreen + 1).padStart(2, "0")} / {screens.length}</span>
              <h3>{activeTheaterScreen.title[lang]}</h3>
              <p>{activeTheaterScreen.description[lang]}</p>
              <div className="theater-controls">
                <button className="icon-btn" onClick={() => nextScreen(-1)} aria-label="Previous screen">
                  <ChevronLeft />
                </button>
                <button className="icon-btn" onClick={() => nextScreen(1)} aria-label="Next screen">
                  <ChevronRight />
                </button>
              </div>
            </div>
            <div className="screen-list" aria-label="Screens">
              {screens.map((screen, index) => (
                <button key={screen.id} className={cx(activeScreen === index && "is-active")} onClick={() => setActiveScreen(index)}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {screen.shortTitle[lang]}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="section container">
          <SectionHeading eyebrow={t.sections.workflowEyebrow} title={t.sections.workflowTitle} />
          <div className="workflow-grid">
            {t.workflow.map(([title, text], index) => (
              <article className="panel workflow-card reveal" key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section container install-section">
          <SectionHeading eyebrow={t.sections.installEyebrow} title={t.sections.installTitle} />
          <div className="install-panel panel reveal">
            <div className="install-steps">
              {t.install.map(([title, text], index) => (
                <article key={title}>
                  <span>{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
            <a className="btn btn-primary" href={release.href}>
              <Download size={20} /> {t.hero.primary} {release.version}
            </a>
          </div>
        </section>

        <section className="section container">
          <SectionHeading eyebrow={t.sections.faqEyebrow} title={t.sections.faqTitle} />
          <FaqBlock
            lang={lang}
            faqFiltered={faqItems.slice(0, 6)}
            faqSearch=""
            setFaqSearch={() => undefined}
            faqCategory="all"
            setFaqCategory={() => undefined}
            openFaq={openFaq}
            setOpenFaq={setOpenFaq}
          />
          <div className="center-row">
            <Link className="btn btn-secondary" href="/faq/">
              {t.faqButton} <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        <section id="feedback" className="section container">
          <div className="feedback panel reveal">
            <div>
              <span className="eyebrow">{t.sections.feedbackEyebrow}</span>
              <h2>{t.sections.feedbackTitle}</h2>
              <p>{t.feedback.intro}</p>
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                openTelegram();
              }}
            >
              <label>{t.feedback.type}</label>
              <div className="segmented">
                {t.feedback.types.map((type, index) => (
                  <button type="button" className={cx(feedbackType === index && "is-active")} key={type} onClick={() => setFeedbackType(index)}>
                    {type}
                  </button>
                ))}
              </div>
              <label>{t.feedback.rating}</label>
              <div className="rating">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button type="button" key={value} className={cx(rating >= value && "is-active")} onClick={() => setRating(value)}>
                    ★
                  </button>
                ))}
              </div>
              <label>{t.feedback.version}</label>
              <input value={release.version} readOnly />
              <label>{t.feedback.message}</label>
              <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder={t.feedback.placeholder} />
              <button className="btn btn-primary" type="submit">
                <Send size={19} /> {t.feedback.submit}
              </button>
            </form>
          </div>
        </section>

        <section id="security" className="section container">
          <SectionHeading eyebrow={t.sections.securityEyebrow} title={t.sections.securityTitle} />
          <div className="security-panel panel reveal">
            {t.security.map(([title, text], index) => {
              const Icon = [Camera, Bell, Boxes, ShieldCheck][index];
              return (
                <article key={title}>
                  <Icon size={24} />
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                  <span>OK</span>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section container">
          <div className="final-cta reveal">
            <div>
              <h2>{t.sections.finalTitle}</h2>
              <p>{t.sections.finalText}</p>
            </div>
            <div className="final-actions">
              <a className="btn btn-dark" href={release.href}>
                <Download size={20} /> {t.hero.primary}
              </a>
              <a className="btn btn-light" href={telegramUrl} target="_blank" rel="noreferrer">
                <Send size={20} /> Telegram
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer lang={lang} />
      {lightbox !== null && (
        <div className="lightbox" role="dialog" aria-modal="true">
          <button className="icon-btn close" onClick={() => setLightbox(null)} aria-label="Close">
            <X />
          </button>
          <button className="icon-btn left" onClick={() => setLightbox((value) => ((value ?? 0) - 1 + screens.length) % screens.length)} aria-label="Previous">
            <ChevronLeft />
          </button>
          <img
            src={asset(`/assets/screenshots/${screens[lightbox].file}`)}
            width={screens[lightbox].width}
            height={screens[lightbox].height}
            alt={screens[lightbox].alt[lang]}
          />
          <button className="icon-btn right" onClick={() => setLightbox((value) => ((value ?? 0) + 1) % screens.length)} aria-label="Next">
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}

function LanguageToggle({ lang, setLang }: { lang: Lang; setLang: (lang: Lang) => void }) {
  return (
    <div className="toggle-group" aria-label="Language">
      <Languages size={16} />
      {languages.map((language) => (
        <button key={language.code} className={cx(lang === language.code && "is-active")} onClick={() => setLang(language.code)} type="button">
          {language.label}
        </button>
      ))}
    </div>
  );
}

function ThemeToggle({ theme, setTheme }: { theme: "light" | "dark"; setTheme: (theme: "light" | "dark") => void }) {
  return (
    <button className="theme-toggle" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="section-heading reveal">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

function PhoneFrame({ screenId, lang, priority = false }: { screenId: ScreenId; lang: Lang; priority?: boolean }) {
  const screen = screenById[screenId];
  return (
    <div className="phone-frame">
      <img
        src={asset(`/assets/screenshots/${screen.file}`)}
        width={screen.width}
        height={screen.height}
        alt={screen.alt[lang]}
        loading={priority ? "eager" : "lazy"}
      />
    </div>
  );
}

function RouteIllustration() {
  return (
    <svg className="route-illustration" viewBox="0 0 560 420" aria-hidden="true">
      <path className="route-path" d="M40 314 C120 180 216 350 284 190 S438 88 520 198" />
      <circle cx="78" cy="286" r="8" />
      <circle cx="292" cy="188" r="8" />
      <circle cx="505" cy="201" r="8" />
      <g className="runner">
        <path d="M244 84c28-18 65-4 72 30l10 48 38 22-22 28-42-24-13-42-18 38 30 54-31 12-34-54-28 42-29-14 42-76c-14-4-26-12-35-24z" />
        <circle cx="266" cy="66" r="26" />
        <path d="M314 76l76 28-18 88-78-22z" />
        <path d="M331 100h33M326 124h45M321 148h30" />
      </g>
    </svg>
  );
}

function FaqBlock({
  lang,
  faqFiltered,
  faqSearch,
  setFaqSearch,
  faqCategory,
  setFaqCategory,
  openFaq,
  setOpenFaq,
  full = false
}: {
  lang: Lang;
  faqFiltered: typeof faqItems;
  faqSearch: string;
  setFaqSearch: (value: string) => void;
  faqCategory: string;
  setFaqCategory: (value: string) => void;
  openFaq: string | null;
  setOpenFaq: (value: string | null) => void;
  full?: boolean;
}) {
  const t = copy[lang];
  return (
    <div className="faq-block reveal">
      {full && (
        <>
          <label className="search-box">
            <Search size={22} />
            <input value={faqSearch} onChange={(event) => setFaqSearch(event.target.value)} placeholder={t.search} />
          </label>
          <div className="category-rail">
            {faqCategories.map(([id, label]) => (
              <button key={id} className={cx(faqCategory === id && "is-active")} onClick={() => setFaqCategory(id)}>
                {label[lang]}
              </button>
            ))}
          </div>
          <p className="faq-found">{t.found}: {faqFiltered.length}</p>
        </>
      )}
      <div className="accordion">
        {faqFiltered.map((item) => (
          <article key={item.id} className={cx("accordion-item", openFaq === item.id && "is-open")}>
            <button onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)}>
              <span>{item.question[lang]}</span>
              <Zap size={18} />
            </button>
            <div className="accordion-body">
              <p>{item.answer[lang]}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Footer({ lang }: { lang: Lang }) {
  const t = copy[lang].footer;
  return (
    <footer className="container site-footer">
      <div className="footer-brand">
        <img src={asset("/assets/logo.png")} width={44} height={44} alt="OrderFlow" />
        <div>
          <strong>OrderFlow</strong>
          <span>{t.made}</span>
        </div>
      </div>
      <nav>
        <Link href="/faq/">{t.help}</Link>
        <Link href="/privacy/">{t.privacy}</Link>
        <a href={releasePage}>{t.releases}</a>
        <a href={telegramUrl}>{t.telegram}</a>
      </nav>
      <p>{t.copyright}</p>
    </footer>
  );
}

const repo = "svdimonshop-gif/OrderFlow-Site";
const releaseFallback = `https://github.com/${repo}/releases/latest/download/OrderFlow.apk`;
const screens = Array.isArray(window.ORDERFLOW_SCREENS) ? window.ORDERFLOW_SCREENS : [];

function screenAsset(screen) {
  return `assets/screenshots/${screen.file}`;
}

function renderScreenManifest() {
  const rail = document.querySelector("[data-screen-manifest]");
  if (!rail || !screens.length) return;

  rail.innerHTML = screens.map((screen, index) => `
    <button class="screen-card screen-reveal" type="button"
      data-screen-id="${escapeHtml(screen.id)}"
      data-image="${escapeHtml(screenAsset(screen))}"
      data-caption="${escapeHtml(screen.title)}"
      data-description="${escapeHtml(screen.description)}">
      <span>${String(index + 1).padStart(2, "0")} / ${escapeHtml(screen.shortTitle)}</span>
      <div class="phone">
        <img loading="${index < 2 ? "eager" : "lazy"}"
          src="${escapeHtml(screenAsset(screen))}"
          alt="${escapeHtml(screen.alt)}"
          width="${screen.width}"
          height="${screen.height}">
      </div>
    </button>`).join("");

  document.querySelectorAll("[data-carousel-total]").forEach((item) => {
    item.textContent = `/ ${String(screens.length).padStart(2, "0")}`;
  });

  document.querySelectorAll("[data-counter='18']").forEach((item) => {
    item.textContent = String(screens.length);
    item.dataset.counter = String(screens.length);
  });
}

async function initIconSprite() {
  const uses = [...document.querySelectorAll("svg use[href*='icons.svg#']")];
  if (!uses.length) return;
  try {
    const response = await fetch("assets/icons.svg");
    if (!response.ok) return;
    const markup = await response.text();
    const host = document.createElement("div");
    host.className = "svg-sprite-host";
    host.setAttribute("aria-hidden", "true");
    host.innerHTML = markup;
    document.body.prepend(host);
    uses.forEach((use) => {
      const href = use.getAttribute("href");
      const fragment = href?.split("#")[1];
      if (!fragment) return;
      use.setAttribute("href", `#${fragment}`);
      use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", `#${fragment}`);
    });
  } catch {
    // Text and CSS fallbacks keep controls usable when an embedded browser blocks SVG fetches.
  }
}

const faqEntries = [
  { category: "Встановлення", question: "Як встановити OrderFlow на Android?", answer: "Завантажте APK з кнопки на сайті, відкрийте файл і підтвердьте встановлення. Якщо Android заблокує процес, дозвольте встановлення застосунків для браузера або файлового менеджера, з якого відкриваєте APK. Після інсталяції цей дозвіл можна знову вимкнути." },
  { category: "Встановлення", question: "Як оновити застосунок до нової версії?", answer: "Завантажте новий APK і встановіть його поверх поточної версії. Не видаляйте OrderFlow перед оновленням, якщо адміністратор не попросив про це: так збережуться локальні налаштування. Перед оновленням бажано дочекатися завершення синхронізації." },
  { category: "Встановлення", question: "Які дозволи потрібні OrderFlow?", answer: "Камера потрібна для сканування штрихкодів і QR-конфігурації. Сповіщення — для нових замовлень і стану синхронізації. Локальне сховище використовується для offline-first бази та кешу. Дозволи можна перевірити в системних налаштуваннях Android." },
  { category: "Вхід", question: "Як виконати перший вхід?", answer: "Після налаштування з’єднання введіть табельний номер або скористайтеся доступним способом авторизації. Перевірте ім’я співробітника, оберіть магазин і підтвердьте вхід. Якщо використовується PIN, створіть або введіть його на відповідному екрані." },
  { category: "Вхід", question: "Як змінити користувача або магазин?", answer: "Відкрийте «Налаштування» → картку профілю. Кнопка «Змінити користувача» завершує поточну сесію, а «Змінити магазин» відкриває список доступних магазинів. Кнопка «До списку замовлень» повертає до робочого екрана." },
  { category: "Вхід", question: "Що показує профіль співробітника?", answer: "Табельний номер, ПІБ, код і назву поточного магазину, а також телефон, якщо він надійшов із корпоративної системи." },
  { category: "Замовлення", question: "Як знайти та відкрити замовлення?", answer: "На вкладці «Замовлення» перемикайте групи статусів або гортайте їх горизонтально. Натисніть картку, щоб побачити деталі. Потягніть список вниз для оновлення. Нове замовлення можна взяти в роботу, своє активне — продовжити." },
  { category: "Замовлення", question: "Які дані є в деталях замовлення?", answer: "Статус, канал, номер і код, магазин, збиральник, кількість позицій і товарів, вартість, час створення, тип доставки, контакти, коментарі та повний список позицій. Окремо доступні QR, зв’язок із клієнтом і робочі дії." },
  { category: "Замовлення", question: "Як скопіювати номер замовлення?", answer: "Натисніть іконку копіювання у верхній панелі екрана деталей або збирання. OrderFlow покаже підтвердження, що номер скопійовано." },
  { category: "Замовлення", question: "Як скопіювати ім’я, телефон, назву товару або артикул?", answer: "Затисніть потрібне значення довгим натисканням. У картках замовлень можна копіювати ім’я та телефон клієнта; у картці товару — назву й артикул. Після копіювання з’явиться коротке повідомлення." },
  { category: "Замовлення", question: "Що означає, що замовлення вже збирає інший співробітник?", answer: "OrderFlow бачить, за ким закріплено замовлення, і попереджає про конфлікт. Не починайте паралельну збірку без узгодження. Якщо замовлення ваше, застосунок дозволить продовжити його з поточного прогресу." },
  { category: "Збирання", question: "Як почати або продовжити збирання?", answer: "Відкрийте замовлення й натисніть «Почати збірку» або «Продовжити збірку». Новий заказ закріпиться за поточним співробітником. На екрані збирання видно прогрес, таймер, позиції та вкладки «Основне» і «Уточнити»." },
  { category: "Збирання", question: "Як сканувати товар?", answer: "Скористайтеся камерою, апаратним сканером ТСД або полем ручного штрихкоду. Після успішного скану позиція оновиться, а за ввімкненого налаштування пролунає короткий сигнал. Повторний скан збільшує фактичну кількість, якщо це дозволено." },
  { category: "Збирання", question: "Для чого звичайний і проблемний режими сканера?", answer: "Звичайний режим оптимальний для більшості штрихкодів. Проблемний режим підвищує чутливість для дрібних, пошкоджених або низькоконтрастних кодів. Перемикайте його лише коли стандартне сканування не спрацьовує." },
  { category: "Збирання", question: "Як змінити кількість товару?", answer: "Відкрийте дії позиції та оберіть «Змінити кількість». Введіть фактичне значення й підтвердьте. Якщо факт менший або більший за план, OrderFlow покаже окреме попередження перед збереженням." },
  { category: "Збирання", question: "Як працювати з ваговим товаром?", answer: "Проскануйте ваговий штрихкод — OrderFlow спробує визначити вагу автоматично. Якщо це неможливо, введіть вагу вручну. Перевірте одиницю виміру та повідомлення про допустиме відхилення." },
  { category: "Збирання", question: "Як додати товар, якого немає в замовленні?", answer: "На екрані збирання скористайтеся кнопкою додаткового сканування. Відскануйте штрихкод, перевірте знайдений товар і підтвердьте додавання. Додана позиція окремо з’явиться у фінальній перевірці." },
  { category: "Збирання", question: "Що роблять вкладки «Основне» та «Уточнити»?", answer: "«Основне» містить звичайні позиції для збирання. До «Уточнити» потрапляють товари, що потребують додаткової уваги: розбіжність, заміна, відмова або інша незавершена дія. Позицію можна повернути до основного списку після вирішення." },
  { category: "Збирання", question: "Як відкрити фото та деталі товару?", answer: "Натисніть картку або зображення товару. Детальний екран показує план, факт, залишок, ціну, артикул та інші доступні дані. Натискання на фото відкриває збільшений перегляд." },
  { category: "Клієнт", question: "Як зв’язатися з клієнтом?", answer: "На екрані деталей або збирання натисніть іконку телефону. Доступні звичайний дзвінок, Telegram, Viber, WhatsApp і SMS. Конкретний месенджер відкриється, якщо він встановлений і номер підтримується." },
  { category: "Клієнт", question: "Коли потрібно вмикати «Узгоджено з клієнтом»?", answer: "Підтверджуйте цей перемикач лише після реального погодження заміни або відмови. OrderFlow може додатково попередити, якщо ви намагаєтеся продовжити без погодження." },
  { category: "Заміни", question: "Як зробити заміну товару?", answer: "Відкрийте дії позиції → «Заміна товару». Оберіть причину, позначте погодження з клієнтом, відскануйте або введіть штрихкод заміни, перевірте кількість і підтвердьте. Для серверної перевірки заміни потрібне з’єднання." },
  { category: "Заміни", question: "Що робити, якщо заміна не підтверджується?", answer: "Перевірте мережу, правильність штрихкоду та повторіть скан. Якщо відповідь сервера неоднозначна, OrderFlow додатково перевіряє стан, щоб не створити дубль. Не натискайте підтвердження багато разів поспіль." },
  { category: "Заміни", question: "Як зафіксувати відмову від товару?", answer: "Оберіть «Відмова від товару», підтвердьте погодження з клієнтом, виберіть причину зі списку та натисніть «Підтвердити відмову». Без причини або необхідного погодження дія не завершиться." },
  { category: "Пакування", question: "Як додати пакети та контейнери?", answer: "На екрані пакування проскануйте штрихкод пакування або змініть кількість кнопками «−» і «+». Прозорі пакети та інші категорії можуть мати різний спосіб додавання. Після перевірки натисніть «Готово»." },
  { category: "Пакування", question: "Що перевіряє екран оформлення?", answer: "Порівнює план і факт, окремо показує недобір, перебір та додані товари. Також відображає деталі замовлення, спосіб оплати й доставки, загальну вагу та вибране пакування." },
  { category: "Пакування", question: "Як завершити замовлення і показати QR?", answer: "Після фінальної перевірки натисніть завершення. За наявності OrderFlow покаже штрихкод агрегатора для кур’єра та QR замовлення для каси. Код можна відкрити на весь екран, перевернути картку й оновити QR." },
  { category: "Історія", question: "Як користуватися історією та фільтрами?", answer: "Відкрийте вкладку «Історія». Кнопка фільтрів дозволяє вибрати період — сьогодні, вчора, тиждень або місяць — джерело замовлення і статус. Потягніть список вниз для оновлення." },
  { category: "Історія", question: "Чи можна змінити вже завершене замовлення?", answer: "Власне архівне замовлення можна відкрити в історії та повернути в збірку кнопкою редагування. Після підтвердження воно відкриється в спеціальному режимі, де можна виправити позиції та повторно пройти завершення. Чуже архівне замовлення редагувати не можна." },
  { category: "Налаштування", question: "Як змінити тему та мову?", answer: "Відкрийте «Налаштування». Для теми доступні системний, світлий і темний режими. Мови інтерфейсу: українська, російська та англійська. Зміни застосовуються через відповідні діалоги." },
  { category: "Налаштування", question: "Які параметри сповіщень доступні?", answer: "Загальне ввімкнення, мітка на значку, спливаючі повідомлення, показ на екрані блокування, звук, вібрація, вибір системного звуку та інтервал повторення. Якщо Android блокує канал, OrderFlow запропонує відкрити системні налаштування." },
  { category: "Налаштування", question: "Як налаштувати або перевірити з’єднання?", answer: "У «Налаштування з’єднання» оберіть основний, резервний або локальний профіль, введіть надану адресу чи відскануйте QR-конфігурацію. Натисніть «Перевірити з’єднання», а після успіху збережіть параметри. Не змінюйте службові поля без інструкції адміністратора." },
  { category: "Налаштування", question: "Що можна зробити в розділі «Дані та пам’ять»?", answer: "Переглянути загальний і вільний простір, розмір локальної бази та кешу зображень; очистити тимчасовий кеш; увімкнути автоочистку; повторно завантажити локальні замовлення. Остання дія блокується, поки є невідправлені зміни." },
  { category: "Мережа", question: "Чи працює OrderFlow без інтернету?", answer: "Основні дані зберігаються локально, тому частина процесу продовжує працювати при слабкій або відсутній мережі. Дії, що потребують серверної перевірки — наприклад, деякі заміни — можуть чекати на зв’язок. Стежте за індикатором мережі та синхронізації." },
  { category: "Мережа", question: "Що робити, якщо список замовлень не оновлюється?", answer: "Перевірте індикатор мережі, потягніть список вниз, перевірте з’єднання в налаштуваннях. Якщо локальні дані застаріли, у «Дані та пам’ять» доступне повторне завантаження замовлень — але лише після відправлення всіх накопичених дій." },
  { category: "Мережа", question: "Що робити після помилки сканування або синхронізації?", answer: "Не повторюйте дію серією швидких натискань. Перевірте повідомлення, мережу та правильність коду; оновіть екран і повторіть один раз. Для складної проблеми відкрийте форму зворотного зв’язку, вкажіть версію, номер замовлення та точний крок." },
];

const categoryOrder = ["Усі", "Встановлення", "Вхід", "Замовлення", "Збирання", "Клієнт", "Заміни", "Пакування", "Історія", "Налаштування", "Мережа"];

let activeCategory = "Усі";

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}

function normalize(value) {
  return value.toLocaleLowerCase("uk-UA").replace(/[’ʼ]/g, "'");
}

function initFaq() {
  const list = document.querySelector("[data-faq-list]");
  const chips = document.querySelector("[data-faq-categories]");
  const search = document.querySelector("[data-faq-search]");
  const empty = document.querySelector("[data-faq-empty]");
  const summary = document.querySelector("[data-faq-summary]");
  if (!list) return;
  const limit = Number(list.dataset.faqLimit || 0);
  const placeholderExamples = [
    "Наприклад: копіювати артикул",
    "Наприклад: змінити кількість",
    "Наприклад: налаштувати сповіщення",
    "Наприклад: оновити застосунок",
    "Наприклад: відновити синхронізацію",
  ];
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let placeholderIndex = 0;
  let placeholderTimer;

  const stopPlaceholderRotation = () => window.clearInterval(placeholderTimer);
  const startPlaceholderRotation = () => {
    stopPlaceholderRotation();
    if (reducedMotion || document.activeElement === search || search.value) return;
    placeholderTimer = window.setInterval(() => {
      search.classList.add("is-changing-placeholder");
      window.setTimeout(() => {
        placeholderIndex = (placeholderIndex + 1) % placeholderExamples.length;
        search.placeholder = placeholderExamples[placeholderIndex];
        search.classList.remove("is-changing-placeholder");
      }, 170);
    }, 3200);
  };

  if (chips) {
    categoryOrder.forEach((category) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `category-chip${category === activeCategory ? " active" : ""}`;
      button.textContent = category;
      button.addEventListener("click", () => {
        activeCategory = category;
        chips.querySelectorAll("button").forEach((chip) => chip.classList.toggle("active", chip === button));
        button.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "nearest",
          inline: "center",
        });
        renderFaq();
      });
      chips.appendChild(button);
    });
  }

  function renderFaq() {
    const query = search ? normalize(search.value.trim()) : "";
    let filtered = faqEntries.filter((item) => {
      const categoryMatch = activeCategory === "Усі" || item.category === activeCategory;
      const contentMatch = !query || normalize(`${item.question} ${item.answer} ${item.category}`).includes(query);
      return categoryMatch && contentMatch;
    });
    if (limit) filtered = filtered.slice(0, limit);

    list.innerHTML = filtered.map((item, index) => `
      <article class="faq-item">
        <button class="faq-question" type="button" aria-expanded="false" aria-controls="faq-answer-${index}">
          <span>${escapeHtml(item.question)}</span><span aria-hidden="true">+</span>
        </button>
        <div class="faq-answer" id="faq-answer-${index}"><div><p>${escapeHtml(item.answer)}</p></div></div>
      </article>`).join("");

    list.querySelectorAll(".faq-question").forEach((button) => {
      button.addEventListener("click", () => {
        const expanded = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!expanded));
      });
    });

    if (summary) summary.textContent = `Знайдено: ${filtered.length} ${filtered.length === 1 ? "відповідь" : "відповідей"}`;
    if (empty) empty.hidden = filtered.length !== 0;
  }

  if (search) {
    search.addEventListener("focus", stopPlaceholderRotation);
    search.addEventListener("blur", startPlaceholderRotation);
    search.addEventListener("input", () => {
      stopPlaceholderRotation();
      renderFaq();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        event.preventDefault();
        search.focus();
      }
      if (event.key === "Escape" && document.activeElement === search) {
        search.value = "";
        search.blur();
        renderFaq();
      }
    });
    startPlaceholderRotation();
  }
  renderFaq();
}

async function initRelease() {
  const links = [...document.querySelectorAll("[data-download-link]")];
  const labels = [...document.querySelectorAll("[data-download-label]")];
  const version = document.querySelector("[data-release-version]");
  const meta = document.querySelector("[data-release-meta]");
  const fresh = document.querySelector("[data-release-fresh]");
  const versionInput = document.querySelector("[data-feedback-version]");
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
      headers: { Accept: "application/vnd.github+json" }
    });
    if (!response.ok) throw new Error("release unavailable");
    const release = await response.json();
    const apk = release.assets?.find((asset) => asset.name === "OrderFlow.apk")
      || release.assets?.find((asset) => asset.name.toLowerCase().endsWith(".apk"));
    const releaseVersion = release.tag_name || release.name || "Latest";
    if (version) version.textContent = `OrderFlow ${releaseVersion}`;
    labels.forEach((label) => { label.textContent = `Завантажити APK ${releaseVersion}`; });
    if (versionInput) versionInput.value = releaseVersion.replace(/^v/i, "");
    const publishedDateValue = apk?.updated_at || release.published_at;
    const publishedDate = publishedDateValue ? new Date(publishedDateValue) : null;
    const published = publishedDate ? new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long", year: "numeric" }).format(publishedDate) : "";
    const publishedStatus = publishedDate ? new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long", year: "numeric" }).format(publishedDate) : "";
    const size = apk ? `${(apk.size / 1024 / 1024).toFixed(1)} МБ` : "";
    if (meta) meta.textContent = [size, published].filter(Boolean).join(" · ") || "Останній GitHub Release";
    if (fresh && publishedDate) {
      fresh.textContent = `Оновлено ${publishedStatus}`;
      fresh.classList.remove("is-old");
    }
    links.forEach((link) => { link.href = apk?.browser_download_url || releaseFallback; });
  } catch {
    if (version) version.textContent = "OrderFlow";
    if (meta) meta.textContent = "Пряме завантаження APK";
    if (fresh) {
      fresh.textContent = "Дані Release тимчасово недоступні";
      fresh.classList.add("is-old");
    }
    links.forEach((link) => { link.href = releaseFallback; });
  }
}

function initNavigation() {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (!header || !toggle || !nav) return;
  let lastScrollY = window.scrollY;
  let scrollFrame = 0;
  const closeMenu = () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
  });
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => { if (window.innerWidth > 980) closeMenu(); });
  window.addEventListener("scroll", () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      const movingDown = currentScrollY > lastScrollY + 8;
      const movingUp = currentScrollY < lastScrollY - 8;
      const menuOpen = toggle.getAttribute("aria-expanded") === "true";
      header.classList.toggle("scrolled", currentScrollY > 24);
      if (!menuOpen && currentScrollY > 150 && movingDown) header.classList.add("is-hidden");
      if (movingUp || currentScrollY <= 150 || menuOpen) header.classList.remove("is-hidden");
      lastScrollY = currentScrollY;
      scrollFrame = 0;
    });
  }, { passive: true });
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
  items.forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${Math.min((index % 4) * 55, 165)}ms`);
    observer.observe(item);
  });
}

function initGallery() {
  const rail = document.querySelector("[data-gallery]");
  const cards = [...(rail?.querySelectorAll("[data-image]") || [])];
  const dialog = document.querySelector("[data-lightbox]");
  if (!cards.length || !dialog) return;
  const image = dialog.querySelector("[data-lightbox-image]");
  const caption = dialog.querySelector("[data-lightbox-caption]");
  const theater = document.querySelector("[data-interface-theater]");
  const theaterImage = theater?.querySelector("[data-theater-image]");
  const theaterTitle = theater?.querySelector("[data-theater-title]");
  const theaterCount = theater?.querySelector("[data-theater-count]");
  const theaterDescription = theater?.querySelector("[data-theater-description]");
  const theaterIndex = theater?.querySelector("[data-theater-index]");
  const theaterOpen = theater?.querySelector("[data-theater-open]");
  const theaterCaption = theater?.querySelector(".theater-caption");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const legacyDescriptions = [
    "Стан замовлень, швидкий доступ до профілю, сповіщень і налаштувань.",
    "Швидкий вхід за табельним номером і підтвердження робочого профілю.",
    "Дані співробітника, поточний магазин і керування робочою сесією.",
    "Тема, мова, сповіщення, підключення, пам’ять і поведінка застосунку.",
    "Звук, вібрація, повтори та сценарії сповіщень про нові замовлення.",
    "Основне, резервне й локальне підключення з перевіркою доступності.",
    "Завершені замовлення, статуси та повернення власного замовлення в роботу.",
    "Пошук історії за періодом, джерелом і станом замовлення.",
    "Контакти, коментарі, позиції та повний контекст активного замовлення.",
    "Таймер, прогрес, вкладки та послідовна робота з кожною позицією.",
    "Сканування, ручний код, заміна, відмова та зміна кількості товару.",
    "Вибір причини, перевірка нового товару та погодження заміни.",
    "Фіксація причини відмови й прозорий результат у замовленні.",
    "Пакети, контейнери та фінальна підготовка замовлення до видачі.",
  ];
  let current = -1;
  let touchStart = 0;

  const select = (index) => {
    const previous = current;
    const next = (index + cards.length) % cards.length;
    if (next === current) return;
    current = next;
    const direction = current >= previous ? "next" : "previous";
    const card = cards[current];
    cards.forEach((item, itemIndex) => item.classList.toggle("is-active", itemIndex === current));
    theaterIndex?.querySelectorAll("button").forEach((item, itemIndex) => {
      item.classList.toggle("is-active", itemIndex === current);
      item.setAttribute("aria-current", itemIndex === current ? "true" : "false");
    });
    if (theaterImage) {
      theaterImage.classList.remove("is-switching-next", "is-switching-previous", "is-screen-entering-next", "is-screen-entering-previous");
      theaterImage.classList.add(`is-switching-${direction}`);
      window.setTimeout(() => {
        theaterImage.src = card.dataset.image;
        theaterImage.alt = card.querySelector("img")?.alt || card.dataset.caption;
        theaterImage.classList.remove("is-switching-next", "is-switching-previous");
        theaterImage.classList.add(`is-screen-entering-${direction}`);
        window.setTimeout(() => theaterImage.classList.remove("is-screen-entering-next", "is-screen-entering-previous"), 420);
      }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 190);
    }
    if (theaterTitle) theaterTitle.textContent = card.dataset.caption;
    if (theaterCount) theaterCount.textContent = `${String(current + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
    if (theaterDescription) theaterDescription.textContent = card.dataset.description || "";
    if (theater && theaterCaption && !reducedMotion) {
      theater.classList.remove("is-refreshing");
      theaterCaption.classList.remove("is-refreshing");
      void theater.offsetWidth;
      theater.classList.add("is-refreshing");
      theaterCaption.classList.add("is-refreshing");
      window.setTimeout(() => {
        theater.classList.remove("is-refreshing");
        theaterCaption.classList.remove("is-refreshing");
      }, 380);
    }
  };

  const show = (index) => {
    select(index);
    image.src = cards[current].dataset.image;
    image.alt = cards[current].dataset.caption;
    caption.textContent = `${current + 1} / ${cards.length} — ${cards[current].dataset.caption}`;
  };
  const open = (index) => {
    show(index);
    dialog.showModal();
    document.body.classList.add("lightbox-open");
  };
  const close = () => {
    dialog.close();
    document.body.classList.remove("lightbox-open");
  };
  if (theaterIndex) {
    cards.forEach((card, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(card.dataset.caption)}</strong>`;
      button.addEventListener("click", () => {
        select(index);
        rail.scrollTo({
          left: cards[index].offsetLeft - (Number.parseFloat(getComputedStyle(rail).paddingLeft) || 0),
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        });
      });
      theaterIndex.appendChild(button);
    });
  }
  cards.forEach((card, index) => card.addEventListener("click", () => open(index)));
  theaterOpen?.addEventListener("click", () => open(current));
  rail._setActiveScreen = select;
  dialog.querySelector("[data-lightbox-close]").addEventListener("click", close);
  dialog.querySelector("[data-lightbox-prev]").addEventListener("click", () => show(current - 1));
  dialog.querySelector("[data-lightbox-next]").addEventListener("click", () => show(current + 1));
  dialog.addEventListener("click", (event) => { if (event.target === dialog) close(); });
  dialog.addEventListener("cancel", () => document.body.classList.remove("lightbox-open"));
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") show(current - 1);
    if (event.key === "ArrowRight") show(current + 1);
  });
  dialog.addEventListener("touchstart", (event) => { touchStart = event.changedTouches[0].clientX; }, { passive: true });
  dialog.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(distance) > 45) show(current + (distance < 0 ? 1 : -1));
  }, { passive: true });
  select(0);
}

function initCarousels() {
  document.querySelectorAll("[data-carousel]").forEach((rail) => {
    const name = rail.dataset.carousel;
    const controls = document.querySelector(`[data-carousel-controls="${name}"]`);
    const items = [...rail.children].filter((item) => item.matches(".screen-card, .journey-step"));
    if (!items.length || !controls) return;

    const currentLabel = controls.querySelector("[data-carousel-current]");
    const progress = controls.querySelector("[data-carousel-progress]");
    const previous = controls.querySelector("[data-carousel-prev]");
    const next = controls.querySelector("[data-carousel-next]");
    let current = 0;
    let pointerDown = false;
    let pointerStart = 0;
    let scrollStart = 0;
    let dragged = false;
    let frame = 0;

    const paddingLeft = () => Number.parseFloat(getComputedStyle(rail).paddingLeft) || 0;
    const itemStart = (item) => item.offsetLeft - paddingLeft();

    const update = () => {
      frame = 0;
      const position = rail.scrollLeft;
      current = items.reduce((best, item, index) =>
        Math.abs(itemStart(item) - position) < Math.abs(itemStart(items[best]) - position) ? index : best, 0);

      currentLabel.textContent = String(current + 1).padStart(2, "0");
      const ratio = Math.max(0, Math.min(1, (position + rail.clientWidth) / rail.scrollWidth));
      controls.style.setProperty("--carousel-progress", `${ratio * 100}%`);
      progress.style.width = `${Math.max(7, ratio * 100)}%`;
      previous.disabled = current === 0;
      next.disabled = current === items.length - 1;
      items.forEach((item, index) => item.classList.toggle("is-active", index === current));
      rail._setActiveScreen?.(current);
    };

    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const goTo = (index) => {
      const target = items[Math.max(0, Math.min(items.length - 1, index))];
      rail.dataset.direction = index >= current ? "next" : "previous";
      rail.scrollTo({
        left: itemStart(target),
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    };

    previous.addEventListener("click", () => goTo(current - 1));
    next.addEventListener("click", () => goTo(current + 1));
    rail.addEventListener("scroll", scheduleUpdate, { passive: true });
    rail.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(current - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(current + 1);
      }
      if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      }
      if (event.key === "End") {
        event.preventDefault();
        goTo(items.length - 1);
      }
    });

    rail.addEventListener("wheel", (event) => {
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      const atStart = rail.scrollLeft <= 1;
      const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 1;
      if ((delta < 0 && atStart) || (delta > 0 && atEnd)) return;
      event.preventDefault();
      rail.scrollLeft += delta;
    }, { passive: false });

    rail.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      pointerDown = true;
      dragged = false;
      pointerStart = event.clientX;
      scrollStart = rail.scrollLeft;
      rail.classList.add("is-dragging");
      rail.setPointerCapture(event.pointerId);
    });
    rail.addEventListener("pointermove", (event) => {
      if (!pointerDown) return;
      const distance = event.clientX - pointerStart;
      if (Math.abs(distance) > 5) dragged = true;
      rail.scrollLeft = scrollStart - distance;
    });
    const stopDrag = (event) => {
      if (!pointerDown) return;
      pointerDown = false;
      rail.classList.remove("is-dragging");
      if (rail.hasPointerCapture?.(event.pointerId)) rail.releasePointerCapture(event.pointerId);
      if (dragged) {
        update();
        goTo(current);
      }
    };
    rail.addEventListener("pointerup", stopDrag);
    rail.addEventListener("pointercancel", stopDrag);
    rail.addEventListener("click", (event) => {
      if (dragged) {
        event.preventDefault();
        event.stopPropagation();
        dragged = false;
      }
    }, true);

    if ("ResizeObserver" in window) new ResizeObserver(scheduleUpdate).observe(rail);
    update();
  });
}

function initOperationalEffects() {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stage = document.querySelector("[data-route-stage]");
  const signalStrip = document.querySelector(".signal-strip");
  const routeLight = stage?.querySelector(".route-light");
  const syncIndicator = document.querySelector("[data-sync-indicator]");
  const syncLabel = document.querySelector("[data-sync-label]");
  const barcodeZone = document.querySelector("[data-barcode-zone]");
  const screenCards = document.querySelectorAll(".screen-reveal");
  let syncTimer;

  if (signalStrip) {
    [...signalStrip.children].forEach((item, index) => {
      item.style.setProperty("--signal-index", String(index));
    });
    if (reducedMotion || !("IntersectionObserver" in window)) {
      signalStrip.classList.add("is-visible");
    } else {
      signalStrip.classList.add("is-pending");
      new IntersectionObserver(([entry], observer) => {
        if (!entry.isIntersecting) return;
        signalStrip.classList.add("is-visible");
        observer.disconnect();
      }, { threshold: 0.28 }).observe(signalStrip);
    }
  }

  const updateRoute = () => {
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const viewport = window.innerHeight;
    const progress = Math.max(0, Math.min(1, (viewport - rect.top) / (viewport + rect.height * 0.35)));
    stage.style.setProperty("--route-progress", progress.toFixed(3));
    if (routeLight) routeLight.style.strokeDashoffset = String(1 - progress);
  };
  updateRoute();
  window.addEventListener("scroll", updateRoute, { passive: true });
  window.addEventListener("resize", updateRoute);

  const setSync = (state, label) => {
    if (!syncIndicator || !syncLabel) return;
    syncIndicator.classList.remove("is-offline", "is-sending", "is-synced");
    syncIndicator.classList.add(`is-${state}`);
    syncLabel.textContent = label;
  };

  if (stage && "IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      stage.classList.toggle("is-in-view", entry.isIntersecting);
      clearInterval(syncTimer);
      if (!entry.isIntersecting || reducedMotion) {
        setSync("synced", "Синхронізовано");
        return;
      }
      const states = [["offline", "Офлайн"], ["sending", "Надсилання"], ["synced", "Синхронізовано"]];
      let index = 0;
      setSync(...states[index]);
      syncTimer = setInterval(() => {
        index = (index + 1) % states.length;
        setSync(...states[index]);
      }, 1450);
    }, { threshold: 0.35 }).observe(stage);
  } else {
    setSync("synced", "Синхронізовано");
  }

  if ("IntersectionObserver" in window) {
    if (barcodeZone) {
      new IntersectionObserver(([entry], observer) => {
        if (entry.isIntersecting) {
          barcodeZone.classList.add("barcode-pulse");
          observer.disconnect();
        }
      }, { threshold: 0.55 }).observe(barcodeZone);
    }

    const screenObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const siblings = [...entry.target.parentElement.children];
          const delay = reducedMotion ? 0 : Math.min(siblings.indexOf(entry.target) * 55, 330);
          setTimeout(() => entry.target.classList.add("is-revealed"), delay);
          screenObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
    screenCards.forEach((card) => screenObserver.observe(card));
  } else {
    screenCards.forEach((card) => card.classList.add("is-revealed"));
  }
}

function initFeedback() {
  const form = document.querySelector("[data-feedback-form]");
  const status = document.querySelector("[data-feedback-status]");
  if (!form) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const type = data.get("type");
    const rating = data.get("rating");
    const lines = [
      `OrderFlow — ${type}`,
      "",
      `Версія: ${data.get("version") || "не вказано"}`,
      rating ? `Оцінка: ${"★".repeat(Number(rating))}${"☆".repeat(5 - Number(rating))}` : "Оцінка: не вказана",
      data.get("author") ? `Автор / магазин: ${data.get("author")}` : null,
      "",
      "Повідомлення:",
      data.get("message"),
    ].filter((line) => line !== null);
    const message = lines.join("\n");
    const telegramUrl = `https://t.me/dl_studio_group?text=${encodeURIComponent(message)}`;
    status.textContent = "Відкриваємо Telegram з готовим повідомленням…";
    try {
      await navigator.clipboard.writeText(message);
      status.textContent = "Текст також скопійовано — на випадок, якщо Telegram не підставить його автоматично.";
    } catch {
      status.textContent = "У Telegram відкриється готова чернетка повідомлення.";
    }
    window.location.href = telegramUrl;
  });
}

function initHeroShowcase() {
  const showcase = document.querySelector("[data-hero-showcase]");
  const image = showcase?.querySelector("[data-hero-screen]");
  const label = showcase?.querySelector("[data-hero-screen-label]");
  const workflow = document.querySelector("[data-hero-workflow]");
  const buttons = [...(workflow?.querySelectorAll("[data-hero-step]") || [])];
  if (!showcase || !image || !buttons.length) return;

  const screenById = new Map(screens.map((screen) => [screen.id, screen]));
  buttons.forEach((button) => {
    const screen = screenById.get(button.dataset.heroScreenId);
    if (!screen) return;
    button.dataset.screen = screenAsset(screen);
    button.dataset.label = screen.title;
  });

  let active = 0;
  let timer;
  let touchStart = 0;
  let inView = true;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const select = (index, restart = true) => {
    const previous = active;
    active = (index + buttons.length) % buttons.length;
    const direction = active >= previous ? "next" : "previous";
    const button = buttons[active];
    buttons.forEach((item, itemIndex) => {
      item.classList.toggle("is-active", itemIndex === active);
      item.setAttribute("aria-selected", String(itemIndex === active));
    });
    const phone = showcase.querySelector(".hero-phone");
    phone?.classList.remove("is-switching-next", "is-switching-previous", "is-screen-entering-next", "is-screen-entering-previous");
    phone?.classList.add(`is-switching-${direction}`);
    window.setTimeout(() => {
      image.src = button.dataset.screen;
      image.alt = `${button.dataset.label} в OrderFlow`;
      if (label) label.textContent = button.dataset.label;
      phone?.classList.remove("is-switching-next", "is-switching-previous");
      phone?.classList.add(`is-screen-entering-${direction}`);
      window.setTimeout(() => phone?.classList.remove("is-screen-entering-next", "is-screen-entering-previous"), reducedMotion ? 0 : 420);
    }, reducedMotion ? 0 : 190);
    workflow.scrollTo({
      left: Math.max(0, button.offsetLeft - ((workflow.clientWidth - button.offsetWidth) / 2)),
      behavior: reducedMotion ? "auto" : "smooth",
    });
    if (restart) start();
  };

  const start = () => {
    window.clearInterval(timer);
    if (!reducedMotion && inView) timer = window.setInterval(() => select(active + 1, false), 4800);
  };

  buttons.forEach((button, index) => button.addEventListener("click", () => select(index)));
  workflow.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      select(active - 1);
      buttons[(active + buttons.length) % buttons.length].focus();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      select(active + 1);
      buttons[active].focus();
    }
  });
  workflow.addEventListener("touchstart", (event) => {
    touchStart = event.changedTouches[0].clientX;
  }, { passive: true });
  workflow.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(distance) > 42) select(active + (distance < 0 ? 1 : -1));
  }, { passive: true });
  showcase.addEventListener("mouseenter", () => window.clearInterval(timer));
  showcase.addEventListener("mouseleave", start);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else window.clearInterval(timer);
    }, { threshold: 0.2 }).observe(showcase);
  }
  select(0);
}

function initScrollTop() {
  const button = document.querySelector("[data-scroll-top]");
  if (!button) return;
  const update = () => button.classList.toggle("is-visible", window.scrollY > Math.max(520, window.innerHeight * 0.72));
  window.addEventListener("scroll", update, { passive: true });
  button.addEventListener("click", () => window.scrollTo({
    top: 0,
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
  }));
  update();
}

document.addEventListener("DOMContentLoaded", () => {
  initIconSprite();
  initNavigation();
  initRelease();
  initFaq();
  initReveal();
  renderScreenManifest();
  initGallery();
  initCarousels();
  initOperationalEffects();
  initFeedback();
  initHeroShowcase();
  initScrollTop();
  document.querySelectorAll("[data-year]").forEach((item) => { item.textContent = String(new Date().getFullYear()); });
});

export type ScreenId =
  | "login"
  | "store-selection"
  | "home"
  | "profile"
  | "settings"
  | "notifications"
  | "connection"
  | "history"
  | "history-filters"
  | "order-details"
  | "picking"
  | "product-actions"
  | "replacement"
  | "refusal"
  | "packing"
  | "order-review"
  | "courier-barcode"
  | "cashier-qr";

export type HeroStageId = "new" | "scan" | "replacement" | "packing" | "cart" | "barcode" | "qr";

export type AppScreen = {
  id: ScreenId;
  file: string;
  title: { ru: string; ua: string };
  shortTitle: { ru: string; ua: string };
  alt: { ru: string; ua: string };
  description: { ru: string; ua: string };
  width: number;
  height: number;
  hero?: HeroStageId;
};

export const screens: AppScreen[] = [
  {
    id: "login",
    file: "login.jpg",
    title: { ru: "Вход в систему", ua: "Вхід у систему" },
    shortTitle: { ru: "Вход", ua: "Вхід" },
    alt: { ru: "Вход в OrderFlow по табельному номеру", ua: "Вхід до OrderFlow за табельним номером" },
    description: {
      ru: "Быстрый вход по табельному номеру и подтверждение рабочего профиля.",
      ua: "Швидкий вхід за табельним номером і підтвердження робочого профілю."
    },
    width: 603,
    height: 1280
  },
  {
    id: "store-selection",
    file: "store-selection.jpg",
    title: { ru: "Выбор магазина", ua: "Вибір магазину" },
    shortTitle: { ru: "Магазин", ua: "Магазин" },
    alt: { ru: "Выбор доступного магазина в OrderFlow", ua: "Вибір доступного магазину в OrderFlow" },
    description: {
      ru: "Поиск, выбор и сохранение рабочей точки перед началом смены.",
      ua: "Пошук, вибір і збереження робочого магазину перед початком зміни."
    },
    width: 603,
    height: 1280
  },
  {
    id: "home",
    file: "home.jpg",
    title: { ru: "Главный экран", ua: "Головний екран" },
    shortTitle: { ru: "Главная", ua: "Головна" },
    alt: {
      ru: "Главный экран с новыми и приоритетными заказами",
      ua: "Головний екран з новими та пріоритетними замовленнями"
    },
    description: {
      ru: "Статус заказов, приоритетная очередь и быстрый доступ к рабочим разделам.",
      ua: "Стан замовлень, пріоритетна черга та швидкий доступ до робочих розділів."
    },
    width: 595,
    height: 1280,
    hero: "new"
  },
  {
    id: "profile",
    file: "profile.jpg",
    title: { ru: "Профиль сотрудника", ua: "Профіль співробітника" },
    shortTitle: { ru: "Профиль", ua: "Профіль" },
    alt: { ru: "Профиль сотрудника и текущий магазин", ua: "Профіль співробітника та поточний магазин" },
    description: {
      ru: "Данные сотрудника, текущий магазин и управление рабочей сессией.",
      ua: "Дані співробітника, поточний магазин і керування робочою сесією."
    },
    width: 601,
    height: 1280
  },
  {
    id: "settings",
    file: "settings.jpg",
    title: { ru: "Настройки приложения", ua: "Налаштування застосунку" },
    shortTitle: { ru: "Настройки", ua: "Налаштування" },
    alt: { ru: "Тема, язык, уведомления, подключение и память", ua: "Тема, мова, сповіщення, підключення та пам’ять" },
    description: {
      ru: "Тема, язык, уведомления, подключение, память и поведение приложения.",
      ua: "Тема, мова, сповіщення, підключення, пам’ять і поведінка застосунку."
    },
    width: 597,
    height: 1279
  },
  {
    id: "notifications",
    file: "notifications.jpg",
    title: { ru: "Уведомления", ua: "Налаштування сповіщень" },
    shortTitle: { ru: "Уведомления", ua: "Сповіщення" },
    alt: { ru: "Настройки уведомлений, звука и вибрации", ua: "Налаштування сповіщень, звуку та вібрації" },
    description: {
      ru: "Звук, вибрация, повторы и сценарии уведомлений о новых заказах.",
      ua: "Звук, вібрація, повтори та сценарії сповіщень про нові замовлення."
    },
    width: 603,
    height: 1280
  },
  {
    id: "connection",
    file: "connection.jpg",
    title: { ru: "Подключение", ua: "Налаштування з’єднання" },
    shortTitle: { ru: "Соединение", ua: "З’єднання" },
    alt: { ru: "Резервное и локальное подключение OrderFlow", ua: "Резервне та локальне підключення OrderFlow" },
    description: {
      ru: "Основное, резервное и локальное подключение с проверкой доступности.",
      ua: "Основне, резервне й локальне підключення з перевіркою доступності."
    },
    width: 604,
    height: 1280
  },
  {
    id: "history",
    file: "history.jpg",
    title: { ru: "История заказов", ua: "Історія замовлень" },
    shortTitle: { ru: "История", ua: "Історія" },
    alt: { ru: "Список завершённых заказов", ua: "Список завершених замовлень" },
    description: {
      ru: "Завершённые заказы, статусы и возврат своего заказа в работу.",
      ua: "Завершені замовлення, статуси та повернення власного замовлення в роботу."
    },
    width: 596,
    height: 1280
  },
  {
    id: "history-filters",
    file: "history-filters.jpg",
    title: { ru: "Фильтры истории", ua: "Фільтри історії" },
    shortTitle: { ru: "Фильтры", ua: "Фільтри" },
    alt: { ru: "Фильтры истории по периоду, источнику и статусу", ua: "Фільтри історії за періодом, джерелом і статусом" },
    description: {
      ru: "Поиск истории по периоду, источнику и состоянию заказа.",
      ua: "Пошук історії за періодом, джерелом і станом замовлення."
    },
    width: 597,
    height: 1280
  },
  {
    id: "order-details",
    file: "order-details.jpg",
    title: { ru: "Детали заказа", ua: "Деталі замовлення" },
    shortTitle: { ru: "Заказ", ua: "Замовлення" },
    alt: { ru: "Детали заказа и перечень товаров", ua: "Деталі замовлення та перелік товарів" },
    description: {
      ru: "Контакты, комментарии, позиции и полный контекст активного заказа.",
      ua: "Контакти, коментарі, позиції та повний контекст активного замовлення."
    },
    width: 600,
    height: 1280
  },
  {
    id: "picking",
    file: "picking.jpg",
    title: { ru: "Сборка", ua: "Процес збирання" },
    shortTitle: { ru: "Сборка", ua: "Збирання" },
    alt: { ru: "Прогресс сборки и карточки товаров", ua: "Прогрес збирання і картки товарів" },
    description: {
      ru: "Таймер, прогресс, вкладки и последовательная работа с каждой позицией.",
      ua: "Таймер, прогрес, вкладки та послідовна робота з кожною позицією."
    },
    width: 596,
    height: 1280,
    hero: "scan"
  },
  {
    id: "product-actions",
    file: "product-actions.jpg",
    title: { ru: "Действия с товаром", ua: "Дії з товаром" },
    shortTitle: { ru: "Действия", ua: "Дії з товаром" },
    alt: { ru: "Сканирование, замена, отказ и изменение количества", ua: "Сканування, заміна, відмова і зміна кількості" },
    description: {
      ru: "Сканирование, ручной код, замена, отказ и изменение количества товара.",
      ua: "Сканування, ручний код, заміна, відмова та зміна кількості товару."
    },
    width: 598,
    height: 1280
  },
  {
    id: "replacement",
    file: "replacement.jpg",
    title: { ru: "Замена товара", ua: "Заміна товару" },
    shortTitle: { ru: "Замена", ua: "Заміна" },
    alt: { ru: "Причина и сканирование товара замены", ua: "Причина та сканування товару заміни" },
    description: {
      ru: "Выбор причины, проверка нового товара и согласование замены.",
      ua: "Вибір причини, перевірка нового товару та погодження заміни."
    },
    width: 600,
    height: 1280,
    hero: "replacement"
  },
  {
    id: "refusal",
    file: "refusal.jpg",
    title: { ru: "Отказ от товара", ua: "Відмова від товару" },
    shortTitle: { ru: "Отказ", ua: "Відмова" },
    alt: { ru: "Согласование и причина отказа от товара", ua: "Погодження та причина відмови від товару" },
    description: {
      ru: "Фиксация причины отказа и прозрачный результат в заказе.",
      ua: "Фіксація причини відмови й прозорий результат у замовленні."
    },
    width: 597,
    height: 1280
  },
  {
    id: "packing",
    file: "packing.jpg",
    title: { ru: "Упаковка", ua: "Пакування" },
    shortTitle: { ru: "Упаковка", ua: "Пакування" },
    alt: { ru: "Выбор пакетов и контейнеров", ua: "Вибір пакетів і контейнерів" },
    description: {
      ru: "Пакеты, контейнеры и финальная подготовка заказа к выдаче.",
      ua: "Пакети, контейнери та фінальна підготовка замовлення до видачі."
    },
    width: 597,
    height: 1280,
    hero: "packing"
  },
  {
    id: "order-review",
    file: "order-review.jpg",
    title: { ru: "Проверка заказа", ua: "Перевірка замовлення" },
    shortTitle: { ru: "Проверка", ua: "Перевірка" },
    alt: { ru: "Финальная проверка собранных и заказанных позиций", ua: "Фінальна перевірка зібраних і замовлених позицій" },
    description: {
      ru: "Сравнение собранного количества, заказа и добавленных позиций перед завершением.",
      ua: "Порівняння зібраної кількості, замовлення та доданих позицій перед завершенням."
    },
    width: 603,
    height: 1280,
    hero: "cart"
  },
  {
    id: "courier-barcode",
    file: "courier-barcode.jpg",
    title: { ru: "Штрихкод для курьера", ua: "Штрихкод для кур’єра" },
    shortTitle: { ru: "Штрихкод", ua: "Штрихкод" },
    alt: { ru: "Штрихкод агрегатора для передачи заказа курьеру", ua: "Штрихкод агрегатора для передачі замовлення кур’єру" },
    description: {
      ru: "Штрихкод агрегатора для передачи заказа курьеру в полноэкранном режиме.",
      ua: "Штрихкод агрегатора для передачі замовлення кур’єру з повноекранним режимом."
    },
    width: 604,
    height: 1280,
    hero: "barcode"
  },
  {
    id: "cashier-qr",
    file: "cashier-qr.jpg",
    title: { ru: "QR для кассы", ua: "QR для каси" },
    shortTitle: { ru: "QR", ua: "QR" },
    alt: { ru: "QR-код заказа для кассы", ua: "QR-код замовлення для каси" },
    description: {
      ru: "QR-код заказа для кассы с обновлением и подтверждением завершения.",
      ua: "QR-код замовлення для каси з оновленням і підтвердженням завершення."
    },
    width: 599,
    height: 1280,
    hero: "qr"
  }
];

export const heroStages: Array<{
  id: HeroStageId;
  label: { ru: string; ua: string };
  status: { ru: string; ua: string };
  screen: ScreenId;
}> = [
  { id: "new", label: { ru: "Новые", ua: "Нові" }, status: { ru: "Новый заказ", ua: "Нове замовлення" }, screen: "home" },
  { id: "scan", label: { ru: "Скан", ua: "Скан" }, status: { ru: "Сканирование", ua: "Сканування" }, screen: "picking" },
  { id: "replacement", label: { ru: "Замена", ua: "Заміна" }, status: { ru: "Согласование", ua: "Погодження" }, screen: "replacement" },
  { id: "packing", label: { ru: "Упаковка", ua: "Пакування" }, status: { ru: "Контейнеры", ua: "Контейнери" }, screen: "packing" },
  { id: "cart", label: { ru: "Корзина", ua: "Кошик" }, status: { ru: "Проверка", ua: "Перевірка" }, screen: "order-review" },
  { id: "barcode", label: { ru: "ШК", ua: "ШК" }, status: { ru: "Курьер", ua: "Кур’єр" }, screen: "courier-barcode" },
  { id: "qr", label: { ru: "QR", ua: "QR" }, status: { ru: "Касса", ua: "Каса" }, screen: "cashier-qr" }
];

export const screenById = Object.fromEntries(screens.map((screen) => [screen.id, screen])) as Record<ScreenId, AppScreen>;

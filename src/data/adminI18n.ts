import { Language } from '../i18n/types';

export interface AdminContent {
  header: {
    superuserBadge: string;
    backToDashboard: string;
    tabs: {
      overview: string;
      hosts: string;
      properties: string;
      settings: string;
    };
  };
  dashboard: {
    platformScale: string;
    volumeTitle: string;
    growthMonth: string;
    activeHosts: string;
    activeHostsSub: string;
    totalGuides: string;
    totalGuidesSub: string;
    published: string;
    publishedSub: string;
    draftGuides: string;
    draftGuidesSub: string;
    systemHealth: string;
    edgePwaTitle: string;
    edgePwaSub: string;
    swUptime: string;
    qrResolution: string;
    activeSessions: string;
    purgeCacheBtn: string;
    cachePurgedToast: string;
    topHostsTitle: string;
    accountDirectory: string;
    viewAll: string;
    liveTelemetryTitle: string;
    liveGuideboard: string;
    propertiesCount: string;
    viewGuestGuide: string;
  };
  hosts: {
    title: string;
    subtitle: string;
    totalHostsTag: string;
    thHost: string;
    thEmail: string;
    thPlan: string;
    thProperties: string;
    thActions: string;
    inspectSaas: string;
    listings: string;
    impersonateToast: (name: string) => string;
  };
  properties: {
    title: string;
    subtitle: string;
    totalPropertiesTag: string;
    thProperty: string;
    thHost: string;
    thType: string;
    thStatus: string;
    thActions: string;
    manageBtn: string;
    openLiveGuest: string;
  };
  settings: {
    title: string;
    subtitle: string;
    brandNameLabel: string;
    emailLabel: string;
    whatsappLabel: string;
    maintenanceTitle: string;
    maintenanceDesc: string;
    enabled: string;
    disabled: string;
    saveSettingsBtn: string;
    savedSettingsToast: string;
    maintenanceEnabledToast: string;
    maintenanceDisabledToast: string;
  };
}

export const ADMIN_I18N: Record<Language, AdminContent> = {
  // 🇬🇪 GEORGIAN (ქართული)
  ka: {
    header: {
      superuserBadge: 'სუპერმომხმარებელი',
      backToDashboard: 'დაშბორდზე დაბრუნება',
      tabs: {
        overview: 'მიმოხილვა',
        hosts: 'მასპინძლები',
        properties: 'ობიექტები',
        settings: 'პარამეტრები'
      }
    },
    dashboard: {
      platformScale: 'პლატფორმის მასშტაბი',
      volumeTitle: 'გიდების ქსელის მოცულობა',
      growthMonth: '+24.6% ამ თვეში',
      activeHosts: 'აქტიური მასპინძლები',
      activeHostsSub: '100% აქტიური',
      totalGuides: 'სულ გიდები',
      totalGuidesSub: '3 ქალაქში',
      published: 'გამოქვეყნებული',
      publishedSub: 'სკანირდება ცოცხლად',
      draftGuides: 'მონახაზები',
      draftGuidesSub: 'შექმნის პროცესში',
      systemHealth: 'სისტემის მდგომარეობა',
      edgePwaTitle: 'Edge PWA და ოფლაინ სინქრონიზაცია',
      edgePwaSub: 'ნულოვანი დაყოვნება სტუმრებისთვის მსოფლიო ქეშირებით.',
      swUptime: 'Service Worker მუშაობის დრო',
      qrResolution: 'QR კოდის ამოცნობა',
      activeSessions: 'აქტიური სტუმრების სესიები',
      purgeCacheBtn: 'Edge ქეშის გასუფთავება',
      cachePurgedToast: 'Edge PWA ქეში წარმატებით გასუფთავდა ყველა რეგიონში.',
      topHostsTitle: 'ტოპ აქტიური მასპინძლები',
      accountDirectory: 'ანგარიშების რეესტრი',
      viewAll: 'ყველას ნახვა',
      liveTelemetryTitle: 'აქტიური ობიექტების მონიტორინგი',
      liveGuideboard: 'ცოცხალი მონიტორინგი',
      propertiesCount: 'ობიექტი',
      viewGuestGuide: 'სტუმრის გიდის ნახვა'
    },
    hosts: {
      title: 'რეგისტრირებული მასპინძლები',
      subtitle: 'მომხმარებელთა გამოწერების, მართული ობიექტებისა და სტატუსის აუდიტი.',
      totalHostsTag: 'სულ მასპინძელი',
      thHost: 'მასპინძელი',
      thEmail: 'ელფოსტა',
      thPlan: 'ტარიფი',
      thProperties: 'ობიექტები',
      thActions: 'მოქმედება',
      inspectSaas: 'SaaS ინსპექტირება',
      listings: 'ობიექტი',
      impersonateToast: (name: string) => `მასპინძლის რეჟიმში გადასვლა: ${name}`
    },
    properties: {
      title: 'ობიექტების ბაზა',
      subtitle: 'შეამოწმეთ გიდის ბმულები, კარის კოდები და სტატუსი.',
      totalPropertiesTag: 'ობიექტი',
      thProperty: 'ობიექტი',
      thHost: 'მასპინძელი',
      thType: 'ტიპი',
      thStatus: 'სტატუსი',
      thActions: 'მოქმედება',
      manageBtn: 'მართვა',
      openLiveGuest: 'სტუმრის ცოცხალი ხედის გახსნა'
    },
    settings: {
      title: 'პლატფორმის პარამეტრები',
      subtitle: 'მართეთ გლობალური პარამეტრები, მხარდაჭერის კონტაქტები და ტექნიკური მომსახურების რეჟიმი.',
      brandNameLabel: 'პლატფორმის ბრენდის სახელი',
      emailLabel: 'მხარდაჭერის ელფოსტა',
      whatsappLabel: 'მხარდაჭერის WhatsApp ნომერი',
      maintenanceTitle: 'გლობალური ტექნიკური რეჟიმი (Maintenance)',
      maintenanceDesc: 'დროებით აჩერებს ახალი ობიექტების შექმნას. არსებული გიდები აგრძელებს მუშაობას ოფლაინშიც.',
      enabled: 'ჩართულია',
      disabled: 'გამორთულია',
      saveSettingsBtn: 'პარამეტრების შენახვა',
      savedSettingsToast: 'პლატფორმის პარამეტრები წარმატებით შეინახა',
      maintenanceEnabledToast: 'ტექნიკური რეჟიმი ჩაირთო',
      maintenanceDisabledToast: 'ტექნიკური რეჟიმი გამოირთო'
    }
  },

  // 🇷🇺 RUSSIAN (Русский)
  ru: {
    header: {
      superuserBadge: 'Суперпользователь',
      backToDashboard: 'Назад к панели',
      tabs: {
        overview: 'Обзор',
        hosts: 'Хозяева',
        properties: 'Объекты',
        settings: 'Настройки'
      }
    },
    dashboard: {
      platformScale: 'Масштаб платформы',
      volumeTitle: 'Объём сети путеводителей',
      growthMonth: '+24.6% в этом месяце',
      activeHosts: 'Активные хозяева',
      activeHostsSub: '100% активно',
      totalGuides: 'Всего путеводителей',
      totalGuidesSub: 'В 3 городах',
      published: 'Опубликовано',
      publishedSub: 'Сканируется вживую',
      draftGuides: 'Черновики',
      draftGuidesSub: 'В мастере настройки',
      systemHealth: 'Состояние системы',
      edgePwaTitle: 'Edge PWA и офлайн-синхронизация',
      edgePwaSub: 'Мгновенный отклик для гостей с глобальным кэшированием.',
      swUptime: 'Аптайм Service Worker',
      qrResolution: 'Скорость считывания QR',
      activeSessions: 'Активные сессии гостей',
      purgeCacheBtn: 'Очистить Edge-кэш',
      cachePurgedToast: 'Edge PWA кэш service worker успешно сброшен во всех регионах.',
      topHostsTitle: 'Топ активных хозяев',
      accountDirectory: 'Реестр аккаунтов',
      viewAll: 'Смотреть все',
      liveTelemetryTitle: 'Телеметрия объектов',
      liveGuideboard: 'Мониторинг путеводителей',
      propertiesCount: 'объектов',
      viewGuestGuide: 'Открыть путеводитель гостя'
    },
    hosts: {
      title: 'Зарегистрированные хозяева',
      subtitle: 'Аудит подписок пользователей, привязанных объектов и статуса.',
      totalHostsTag: 'Всего хозяев',
      thHost: 'Хозяин',
      thEmail: 'Email',
      thPlan: 'Тариф',
      thProperties: 'Объекты',
      thActions: 'Действия',
      inspectSaas: 'Открыть SaaS',
      listings: 'объектов',
      impersonateToast: (name: string) => `Переход в аккаунт хозяина: ${name}`
    },
    properties: {
      title: 'База объектов',
      subtitle: 'Проверяйте ссылки на путеводители, коды замков и статус.',
      totalPropertiesTag: 'Объектов',
      thProperty: 'Объект',
      thHost: 'Хозяин',
      thType: 'Тип',
      thStatus: 'Статус',
      thActions: 'Действия',
      manageBtn: 'Управление',
      openLiveGuest: 'Открыть вид для гостя'
    },
    settings: {
      title: 'Параметры платформы',
      subtitle: 'Управление глобальными настройками платформы, поддержкой и режимом обслуживания.',
      brandNameLabel: 'Название бренда платформы',
      emailLabel: 'Email службы поддержки',
      whatsappLabel: 'WhatsApp номер поддержки',
      maintenanceTitle: 'Режим технического обслуживания',
      maintenanceDesc: 'Временно приостанавливает создание новых объектов. Существующие путеводители работают офлайн.',
      enabled: 'Включен',
      disabled: 'Выключен',
      saveSettingsBtn: 'Сохранить настройки',
      savedSettingsToast: 'Настройки платформы успешно сохранены',
      maintenanceEnabledToast: 'Режим обслуживания включен',
      maintenanceDisabledToast: 'Режим обслуживания выключен'
    }
  },

  // 🇬🇧 ENGLISH
  en: {
    header: {
      superuserBadge: 'Superuser',
      backToDashboard: 'Back to Dashboard',
      tabs: {
        overview: 'Overview',
        hosts: 'Hosts',
        properties: 'Properties',
        settings: 'Settings'
      }
    },
    dashboard: {
      platformScale: 'Platform Scale',
      volumeTitle: 'Guidebook Network Volume',
      growthMonth: '+24.6% this month',
      activeHosts: 'Active Hosts',
      activeHostsSub: '100% active',
      totalGuides: 'Total Guides',
      totalGuidesSub: 'Across 3 cities',
      published: 'Published',
      publishedSub: 'Live scanned',
      draftGuides: 'Draft Guides',
      draftGuidesSub: 'In setup wizard',
      systemHealth: 'System Health',
      edgePwaTitle: 'Edge PWA & Offline Sync',
      edgePwaSub: 'Zero latency guest experience cached worldwide.',
      swUptime: 'Service Worker Uptime',
      qrResolution: 'QR Code Resolution',
      activeSessions: 'Active Guest Sessions',
      purgeCacheBtn: 'Purge Edge Cache',
      cachePurgedToast: 'Edge PWA service worker cache purged across all regions.',
      topHostsTitle: 'Top Performing Hosts',
      accountDirectory: 'Account Directory',
      viewAll: 'View all',
      liveTelemetryTitle: 'Active Properties Telemetry',
      liveGuideboard: 'Live Guideboard',
      propertiesCount: 'properties',
      viewGuestGuide: 'View Guest Guide'
    },
    hosts: {
      title: 'Registered Host Accounts',
      subtitle: 'Audit user subscriptions, properties managed, and status.',
      totalHostsTag: 'Total Hosts',
      thHost: 'Host Name',
      thEmail: 'Email',
      thPlan: 'Plan',
      thProperties: 'Properties',
      thActions: 'Actions',
      inspectSaas: 'Inspect SaaS',
      listings: 'listings',
      impersonateToast: (name: string) => `Impersonating host: ${name}`
    },
    properties: {
      title: 'Properties Database',
      subtitle: 'Inspect live guidebook URLs, door codes, and status.',
      totalPropertiesTag: 'Properties',
      thProperty: 'Property',
      thHost: 'Host',
      thType: 'Type',
      thStatus: 'Status',
      thActions: 'Actions',
      manageBtn: 'Manage',
      openLiveGuest: 'Open live guest view'
    },
    settings: {
      title: 'Platform Parameters',
      subtitle: 'Control global platform settings, support credentials, and maintenance mode.',
      brandNameLabel: 'Platform Brand Name',
      emailLabel: 'Platform Support Email',
      whatsappLabel: 'Support WhatsApp Number',
      maintenanceTitle: 'Global Maintenance Mode',
      maintenanceDesc: 'Temporarily pause new property creation. Existing guest guides remain cached offline.',
      enabled: 'Enabled',
      disabled: 'Disabled',
      saveSettingsBtn: 'Save Settings',
      savedSettingsToast: 'Platform settings saved successfully',
      maintenanceEnabledToast: 'Maintenance mode enabled',
      maintenanceDisabledToast: 'Maintenance mode disabled'
    }
  }
};

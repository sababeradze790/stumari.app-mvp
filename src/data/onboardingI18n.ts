import { Language } from '../i18n/types';

export interface OnboardingContent {
  header: {
    title: string;
    subtitle: string;
    stepCounter: string;
    mobileForm: string;
    mobilePreview: string;
  };
  step1: {
    badge: string;
    question: string;
    desc: string;
    titleLabel: string;
    titlePlaceholder: string;
    subtitleLabel: string;
    subtitlePlaceholder: string;
    typeLabel: string;
    types: {
      apartment: string;
      guesthouse: string;
      hotel: string;
      villa: string;
    };
    cityCountryLabel: string;
    cityCountryPlaceholder: string;
    coverPhotoLabel: string;
  };
  step2: {
    badge: string;
    question: string;
    desc: string;
    checkInLabel: string;
    checkOutLabel: string;
    keypadCodeLabel: string;
    keypadCodePlaceholder: string;
    keypadTip: string;
    directionsLabel: string;
    directionsPlaceholder: string;
  };
  step3: {
    badge: string;
    question: string;
    desc: string;
    wifiNameLabel: string;
    wifiNamePlaceholder: string;
    wifiPassLabel: string;
    wifiPassPlaceholder: string;
    appliancesLabel: string;
    activeBadge: string;
  };
  step4: {
    badge: string;
    question: string;
    desc: string;
    quietHoursLabel: string;
    trashLabel: string;
    rulesListLabel: string;
  };
  step5: {
    badge: string;
    question: string;
    desc: string;
    hostTipPrefix: string;
  };
  step6: {
    badge: string;
    question: string;
    desc: string;
    hostNameLabel: string;
    whatsappLabel: string;
    whatsappPlaceholder: string;
    emergencyLabel: string;
    emergencyPlaceholder: string;
  };
  step7: {
    badge: string;
    question: string;
    desc: string;
    configured100: string;
    wifiLabel: string;
    keypadLabel: string;
  };
  buttons: {
    back: string;
    continue: string;
    finishAndLaunch: string;
  };
  mirror: {
    liveGuestView: string;
    realtimeMirror: string;
    tapCopy: string;
    doorCodeLabel: string;
  };
  presets: {
    badge: string;
    title: string;
    desc: string;
    tbilisiTitle: string;
    tbilisiSub: string;
    batumiTitle: string;
    batumiSub: string;
    kazbegiTitle: string;
    kazbegiSub: string;
    loadedToast: (name: string) => string;
  };
  readiness: {
    scoreLabel: string;
    checksLabel: string;
    doneLabel: string;
    pendingLabel: string;
    items: {
      titleAddress: string;
      coverPhoto: string;
      doorCode: string;
      wifi: string;
      rules: string;
      recs: string;
      contact: string;
    };
  };
}

export const ONBOARDING_I18N: Record<Language, OnboardingContent> = {
  // 🇬🇪 GEORGIAN (ქართული)
  ka: {
    header: {
      title: 'ახალი გიდის შექმნა (Onboarding)',
      subtitle: 'მოამზადეთ სრულყოფილი ციფრული გზამკვლევი თქვენი სტუმრებისთვის 5 წუთში.',
      stepCounter: 'ნაბიჯი',
      mobileForm: 'ფორმა',
      mobilePreview: '📱 გადახედვა'
    },
    step1: {
      badge: 'ნაბიჯი 1 · ძირითადი იდენტობა',
      question: 'რა ჰქვია თქვენს ობიექტს?',
      desc: 'მიუთითეთ საჯარო სათაური და მისამართი, რომელსაც სტუმრები იხილავენ.',
      titleLabel: 'ობიექტის სათაური / ბინის სახელი',
      titlePlaceholder: 'მაგ. მზიანი ლოფტი სოლოლაკში',
      subtitleLabel: 'ქვესათაური / მოკლე აღწერა',
      subtitlePlaceholder: 'მაგ. ისტორიული ეზოს ბინა ქალაქის პანორამული ხედით',
      typeLabel: 'ობიექტის ტიპი',
      types: {
        apartment: 'ბინა (აპარტამენტი)',
        guesthouse: 'საოჯახო სასტუმრო (Guesthouse)',
        hotel: 'ბუტიკ-სასტუმრო',
        villa: 'ვილა / შალე'
      },
      cityCountryLabel: 'ქალაქი და ქვეყანა',
      cityCountryPlaceholder: 'მაგ. თბილისი, საქართველო',
      coverPhotoLabel: 'გარეკანის ფოტოს URL'
    },
    step2: {
      badge: 'ნაბიჯი 2 · მოსვლა და კარის კოდი',
      question: 'შესვლის დრო და კარის წვდომა',
      desc: 'მიაწოდეთ დაღლილ სტუმრებს მკაფიო ინსტრუქცია, რათა არასდროს დარჩნენ გარეთ.',
      checkInLabel: 'შესვლის დრო (Check-in)',
      checkOutLabel: 'გასვლის დრო (Check-out)',
      keypadCodeLabel: 'კარის კოდური საკეტის პინ-კოდი',
      keypadCodePlaceholder: 'მაგ. 4820#',
      keypadTip: 'რჩევა: მიუთითეთ "#" ან "*", თუ ეს ფიზიკურ საკეტზეა საჭირო.',
      directionsLabel: 'მოსვლის ინსტრუქცია / ჭიშკრის კოდი',
      directionsPlaceholder: 'მაგ. შეაღეთ მოჩუქურთმებული ხის კარი, აუყევით ხვეულ კიბეს მე-2 სართულზე, ლურჯი კარი მარჯვნივ.'
    },
    step3: {
      badge: 'ნაბიჯი 3 · ძირითადი კომფორტი',
      question: '1-შეხებით Wi-Fi და ტექნიკა',
      desc: 'სტუმრებს შეუძლიათ Wi-Fi პაროლის 1 შეხებით კოპირება ან როუტერის QR-ის დასკანერება.',
      wifiNameLabel: 'Wi-Fi ქსელის სახელი (SSID)',
      wifiNamePlaceholder: 'მაგ. Stumari_Guest_5G',
      wifiPassLabel: 'Wi-Fi პაროლი',
      wifiPassPlaceholder: 'მაგ. WelcomeGuest2026',
      appliancesLabel: 'ძირითადი ტექნიკა (კონდიციონერი, ყავა, სარეცხი)',
      activeBadge: 'აქტიური'
    },
    step4: {
      badge: 'ნაბიჯი 4 · მშვიდი მასპინძლობა',
      question: 'სახლის წესები და სიჩუმის საათები',
      desc: 'დაადგინეთ მკაფიო მოლოდინები სიჩუმის, მოწევისა და ნაგვის გადაყრის შესახებ.',
      quietHoursLabel: 'სიჩუმის საათები',
      trashLabel: 'ნაგვისა და გადამუშავების ინსტრუქცია',
      rulesListLabel: 'სახლის წესების სია'
    },
    step5: {
      badge: 'ნაბიჯი 5 · ადგილობრივი საიდუმლოებები',
      question: 'რჩეული ლოკალური ადგილები სამეზობლოში',
      desc: 'გაუზიარეთ სტუმრებს ინსაიდერული რჩევები, რომლებსაც მიმოხილვებში აღფრთოვანებით აღნიშნავენ.',
      hostTipPrefix: 'მასპინძლის ინსაიდერული რჩევა:'
    },
    step6: {
      badge: 'ნაბიჯი 6 · პირდაპირი კომუნიკაცია',
      question: 'მასპინძლისა და გადაუდებელი კონტაქტი',
      desc: '1-შეხებით WhatsApp ჩათის ღილაკი და 112 გადაუდებელი დარეკვა.',
      hostNameLabel: 'მასპინძლის სრული სახელი',
      whatsappLabel: 'WhatsApp ნომერი (ქვეყნის კოდით)',
      whatsappPlaceholder: '+995 555 123 456',
      emergencyLabel: 'მეორადი გადაუდებელი კონტაქტი',
      emergencyPlaceholder: 'მაგ. +995 555 987 654 (შენობის მენეჯერი)'
    },
    step7: {
      badge: 'ნაბიჯი 7 · საბოლოო გადახედვა',
      question: 'თქვენი Stumari მზადაა გასაშვებად!',
      desc: 'გამოაქვეყნეთ ახლავე, რათა მიიღოთ QR სადგამები, დასაბეჭდი ფლაერები და პირდაპირი ბმული.',
      configured100: '100% კონფიგურირებულია',
      wifiLabel: 'Wi-Fi:',
      keypadLabel: 'კოდი:'
    },
    buttons: {
      back: 'უკან',
      continue: 'გაგრძელება',
      finishAndLaunch: 'გიდის გაშვება და გამოქვეყნება'
    },
    mirror: {
      liveGuestView: 'სტუმრის ცოცხალი ხედი',
      realtimeMirror: 'რეალურ დროში სინქრონიზაცია',
      tapCopy: '1-შეხებით კოპირება',
      doorCodeLabel: 'კარის კოდი:'
    },
    presets: {
      badge: 'მყისიერი შაბლონები',
      title: 'რეალისტური მონაცემების ჩატვირთვა',
      desc: 'დააჭირეთ ნებისმიერ შაბლონს ოსტატის მყისიერად გამოსაცდელად:',
      tbilisiTitle: 'თბილისის ლოფტი',
      tbilisiSub: 'ძველი ქალაქის ტერასა',
      batumiTitle: 'ბათუმის პენტჰაუსი',
      batumiSub: 'ზღვის ბულვარი',
      kazbegiTitle: 'ყაზბეგის შალე',
      kazbegiSub: 'ალპური თავშესაფარი',
      loadedToast: (name: string) => `ჩაიტვირთა შაბლონი: "${name}"!`
    },
    readiness: {
      scoreLabel: 'მზადყოფნის შეფასება',
      checksLabel: 'შემოწმება',
      doneLabel: '✓ მზადაა',
      pendingLabel: '○ შესავსებია',
      items: {
        titleAddress: 'სათაური და მისამართი',
        coverPhoto: 'გარეკანის ფოტო',
        doorCode: 'კარის კოდი',
        wifi: 'Wi-Fi მონაცემები',
        rules: 'სახლის წესები',
        recs: 'რჩეული რეკომენდაციები',
        contact: 'მასპინძლის WhatsApp'
      }
    }
  },

  // 🇷🇺 RUSSIAN (Русский)
  ru: {
    header: {
      title: 'Мастер создания путеводителя',
      subtitle: 'Подготовьте цифровой путеводитель для ваших гостей всего за 5 минут.',
      stepCounter: 'Шаг',
      mobileForm: 'Форма',
      mobilePreview: '📱 Превью'
    },
    step1: {
      badge: 'Шаг 1 · Основная информация',
      question: 'Как называется ваше жильё?',
      desc: 'Укажите публичное название и адрес, которые увидят гости.',
      titleLabel: 'Название жилья / апартаментов',
      titlePlaceholder: 'напр. Солнечный лофт в Сололаки',
      subtitleLabel: 'Краткое описание / подзаголовок',
      subtitlePlaceholder: 'напр. Историческая квартира с панорамным видом на город',
      typeLabel: 'Тип жилья',
      types: {
        apartment: 'Апартаменты (квартира)',
        guesthouse: 'Гостевой дом (Guesthouse)',
        hotel: 'Бутик-отель',
        villa: 'Вилла / Шале'
      },
      cityCountryLabel: 'Город и страна',
      cityCountryPlaceholder: 'напр. Тбилиси, Грузия',
      coverPhotoLabel: 'URL фото обложки'
    },
    step2: {
      badge: 'Шаг 2 · Прибытие и доступ',
      question: 'Время заезда и коды замков',
      desc: 'Дайте уставшим гостям понятные инструкции, чтобы они не ждали у закрытых дверей.',
      checkInLabel: 'Время заезда (Check-in)',
      checkOutLabel: 'Время выезда (Check-out)',
      keypadCodeLabel: 'Пин-код кодового замка / домофона',
      keypadCodePlaceholder: 'напр. 4820#',
      keypadTip: 'Совет: укажите "#" или "*", если это необходимо на клавиатуре замка.',
      directionsLabel: 'Инструкция по прибытию / код от ворот',
      directionsPlaceholder: 'напр. Толкните резную деревянную дверь во двор, поднимитесь на 2 этаж по винтовой лестнице, синяя дверь справа.'
    },
    step3: {
      badge: 'Шаг 3 · Удобства в доме',
      question: 'Wi-Fi в один клик и техника',
      desc: 'Гости копируют пароль от Wi-Fi одним касанием или сканируют QR-код роутера.',
      wifiNameLabel: 'Имя сети Wi-Fi (SSID)',
      wifiNamePlaceholder: 'напр. Stumari_Guest_5G',
      wifiPassLabel: 'Пароль от Wi-Fi',
      wifiPassPlaceholder: 'напр. WelcomeGuest2026',
      appliancesLabel: 'Основные приборы (кондиционер, кофемашина, стиралка)',
      activeBadge: 'Активно'
    },
    step4: {
      badge: 'Шаг 4 · Правила дома',
      question: 'Правила проживания и тихие часы',
      desc: 'Установите понятные границы по поводу тишины, курения и мусора.',
      quietHoursLabel: 'Тихие часы',
      trashLabel: 'Инструкция по выносу мусора',
      rulesListLabel: 'Список правил дома'
    },
    step5: {
      badge: 'Шаг 5 · Секреты района',
      question: 'Проверенные места от хозяина',
      desc: 'Поделитесь рекомендациями, о которых гости с восторгом напишут в отзывах.',
      hostTipPrefix: 'Совет от хозяина:'
    },
    step6: {
      badge: 'Шаг 6 · Прямая связь',
      question: 'Контакты хозяина и экстренные службы',
      desc: 'Кнопка WhatsApp в один клик и быстрый вызов 112.',
      hostNameLabel: 'Имя и фамилия хозяина',
      whatsappLabel: 'Номер WhatsApp (с кодом страны)',
      whatsappPlaceholder: '+995 555 123 456',
      emergencyLabel: 'Резервный экстренный контакт',
      emergencyPlaceholder: 'напр. +995 555 987 654 (Управляющий домом)'
    },
    step7: {
      badge: 'Шаг 7 · Финал',
      question: 'Ваш Stumari готов к публикации!',
      desc: 'Опубликуйте путеводитель прямо сейчас, чтобы получить QR-флаеры и прямую ссылку.',
      configured100: '100% Настроено',
      wifiLabel: 'Wi-Fi:',
      keypadLabel: 'Код замка:'
    },
    buttons: {
      back: 'Назад',
      continue: 'Продолжить',
      finishAndLaunch: 'Опубликовать путеводитель'
    },
    mirror: {
      liveGuestView: 'Экран гостя (Live)',
      realtimeMirror: 'Синхронизация в реальном времени',
      tapCopy: 'Копировать в 1 клик',
      doorCodeLabel: 'Код двери:'
    },
    presets: {
      badge: 'Быстрые шаблоны',
      title: 'Загрузить готовый пример',
      desc: 'Нажмите на любой шаблон для моментального заполнения:',
      tbilisiTitle: 'Тбилиси Лофт',
      tbilisiSub: 'Терраса в Старом городе',
      batumiTitle: 'Батуми Пентхаус',
      batumiSub: 'Приморский бульвар',
      kazbegiTitle: 'Казбеги Шале',
      kazbegiSub: 'Альпийский вид',
      loadedToast: (name: string) => `Загружен шаблон: "${name}"!`
    },
    readiness: {
      scoreLabel: 'Готовность путеводителя',
      checksLabel: 'проверок',
      doneLabel: '✓ Готово',
      pendingLabel: '○ Ожидает',
      items: {
        titleAddress: 'Название и адрес',
        coverPhoto: 'Фото обложки',
        doorCode: 'Код входной двери',
        wifi: 'Данные Wi-Fi',
        rules: 'Правила проживания',
        recs: 'Рекомендации по району',
        contact: 'WhatsApp хозяина'
      }
    }
  },

  // 🇬🇧 ENGLISH
  en: {
    header: {
      title: 'Guidebook Setup Wizard',
      subtitle: 'Prepare a flawless digital guidebook for your guests in just 5 minutes.',
      stepCounter: 'Step',
      mobileForm: 'Form',
      mobilePreview: '📱 Preview'
    },
    step1: {
      badge: 'Step 1 · Basic Property Identity',
      question: 'What is your property called?',
      desc: 'Enter the public title and address your guests will see.',
      titleLabel: 'Property Title / Listing Name',
      titlePlaceholder: 'e.g. Sunny Sololaki Balcony Loft',
      subtitleLabel: 'Subtitle / Catchphrase',
      subtitlePlaceholder: 'e.g. Historic courtyard apartment with panoramic city views',
      typeLabel: 'Property Type',
      types: {
        apartment: 'Apartment',
        guesthouse: 'Guesthouse',
        hotel: 'Boutique Hotel',
        villa: 'Villa / Chalet'
      },
      cityCountryLabel: 'City & Country',
      cityCountryPlaceholder: 'e.g. Tbilisi, Georgia',
      coverPhotoLabel: 'Cover Photo URL'
    },
    step2: {
      badge: 'Step 2 · Arrival & Keypad',
      question: 'Check-in times & door access',
      desc: 'Give exhausted guests clear access instructions so they never get stranded.',
      checkInLabel: 'Check-in Time',
      checkOutLabel: 'Check-out Time',
      keypadCodeLabel: 'Door Keypad Pin Code',
      keypadCodePlaceholder: 'e.g. 4820#',
      keypadTip: 'Tip: Include "#" or "*" if required to unlock the physical deadbolt.',
      directionsLabel: 'Arrival Directions / Gate Code',
      directionsPlaceholder: 'e.g. Push the carved courtyard door, go up the spiraled stairs to the 2nd floor, blue door on right.'
    },
    step3: {
      badge: 'Step 3 · Stay Essentials',
      question: '1-Tap Wi-Fi & Appliances',
      desc: 'Guests can copy the Wi-Fi password with 1 tap or scan the router QR.',
      wifiNameLabel: 'Wi-Fi Network Name (SSID)',
      wifiNamePlaceholder: 'e.g. Stumari_Guest_5G',
      wifiPassLabel: 'Wi-Fi Password',
      wifiPassPlaceholder: 'e.g. WelcomeGuest2026',
      appliancesLabel: 'Key Appliances (AC, Coffee, Washer)',
      activeBadge: 'Active'
    },
    step4: {
      badge: 'Step 4 · Peaceful Hospitality',
      question: 'House Rules & Quiet Hours',
      desc: 'Set clear expectations for quiet hours, smoking, and garbage disposal.',
      quietHoursLabel: 'Quiet Hours',
      trashLabel: 'Trash & Recycling Instructions',
      rulesListLabel: 'House Rules List'
    },
    step5: {
      badge: 'Step 5 · Local Secrets',
      question: 'Curated Neighborhood Spots',
      desc: 'Give your guests local insider recommendations they\'ll rave about in reviews.',
      hostTipPrefix: 'Host insider tip:'
    },
    step6: {
      badge: 'Step 6 · Direct Communication',
      question: 'Host & Emergency Contact',
      desc: '1-tap WhatsApp chat button for instant questions and 112 emergency dialing.',
      hostNameLabel: 'Host Full Name',
      whatsappLabel: 'WhatsApp Number (with country code)',
      whatsappPlaceholder: '+995 555 123 456',
      emergencyLabel: 'Emergency Secondary Contact',
      emergencyPlaceholder: 'e.g. +995 555 987 654 (Building Manager)'
    },
    step7: {
      badge: 'Step 7 · Final Review',
      question: 'Your Stumari is ready to go live!',
      desc: 'Publish now to generate your QR placards, download printable flyers, and share with your guests.',
      configured100: '100% Configured',
      wifiLabel: 'Wi-Fi:',
      keypadLabel: 'Keypad:'
    },
    buttons: {
      back: 'Back',
      continue: 'Continue',
      finishAndLaunch: 'Publish Guidebook'
    },
    mirror: {
      liveGuestView: 'Live Guest View',
      realtimeMirror: 'Real-time Mirror',
      tapCopy: '1-Tap Copy',
      doorCodeLabel: 'Door Code:'
    },
    presets: {
      badge: 'Instant Presets',
      title: 'Load Realistic Sample Data',
      desc: 'Click any preset to immediately test the complete wizard:',
      tbilisiTitle: 'Tbilisi Loft',
      tbilisiSub: 'Old Town Terrace',
      batumiTitle: 'Batumi Penthouse',
      batumiSub: 'Sea Boulevard',
      kazbegiTitle: 'Kazbegi Chalet',
      kazbegiSub: 'Alpine Retreat',
      loadedToast: (name: string) => `Loaded "${name}" preset!`
    },
    readiness: {
      scoreLabel: 'Readiness Score',
      checksLabel: 'checks',
      doneLabel: '✓ Done',
      pendingLabel: '○ Pending',
      items: {
        titleAddress: 'Title & Address',
        coverPhoto: 'Cover Photo',
        doorCode: 'Door Keypad Code',
        wifi: 'Wi-Fi Credentials',
        rules: 'House Rules',
        recs: 'Curated Recommendations',
        contact: 'Host WhatsApp Contact'
      }
    }
  }
};

import { Language } from '../i18n/types';

export interface PropertyHubContent {
  overview: {
    guidebookStatus: string;
    liveAndInstant: string;
    highSpeedWifi: string;
    frontKeypadCode: string;
    backupLockbox: string;
    notSet: string;
    quickShortcutsTitle: string;
    editGuidebook: string;
    editGuidebookSub: string;
    qrFlyerNfc: string;
    qrFlyerNfcSub: string;
    livePreview: string;
    livePreviewSub: string;
  };
  guide: {
    guideSectionsTitle: string;
    welcomeTitle: string;
    welcomeSub: string;
    headlineGreeting: string;
    welcomeNote: string;
    checkinTitle: string;
    checkinSub: string;
    checkinTime: string;
    doorCode: string;
    lockboxCode: string;
    entryDirections: string;
    parkingInstructions: string;
    wifiTitle: string;
    wifiSub: string;
    ssid: string;
    wifiPass: string;
    appliancesTitle: string;
    appliancesSub: string;
    rulesTitle: string;
    rulesSub: string;
    quietHours: string;
    trashSchedule: string;
    rulesList: string;
    recsTitle: string;
    recsSub: string;
    placeNamePlaceholder: string;
    distancePlaceholder: string;
    transportTitle: string;
    transportSub: string;
    taxiInfo: string;
    publicTransit: string;
    airportTransit: string;
    checkoutTitle: string;
    checkoutSub: string;
    checkoutTime: string;
    departureChecklist: string;
    contactTitle: string;
    contactSub: string;
    hostName: string;
    hostPhone: string;
    hostWhatsApp: string;
    emergencyTitle: string;
    emergencySub: string;
    emergencyServicesNum: string;
    emergencyContact: string;
    autoSaveNotice: string;
    saveChanges: string;
    savedToast: string;
  };
  preview: {
    simulatorTitle: string;
    simulatorSub: string;
    openGuideBtn: string;
  };
  qr: {
    connectGuestsTitle: string;
    connectGuestsSub: string;
    downloadQrBtn: string;
    generatingQr: string;
    nfcReadyTitle: string;
    nfcReadySub: string;
    nfcActive: string;
    guestUrlLabel: string;
    copied: string;
    copyLink: string;
  };
  settings: {
    settingsTitle: string;
    settingsSub: string;
    propName: string;
    propType: string;
    guestUrlSlug: string;
    addressLocation: string;
    coverImageUrl: string;
    airbnbBookingLink: string;
    publishStatus: string;
    publishedNotice: string;
    draftNotice: string;
    publishGuide: string;
    unpublishGuide: string;
    deleteProperty: string;
    deleteWarning: string;
    deleteBtn: string;
  };
}

export const PROPERTY_HUB_I18N: Record<Language, PropertyHubContent> = {
  // 🇬🇪 GEORGIAN (ქართული)
  ka: {
    overview: {
      guidebookStatus: 'გიდის სტატუსი',
      liveAndInstant: 'სტუმრის პირდაპირი ბმული აქტიური და მყისიერია.',
      highSpeedWifi: 'მაღალსიჩქარიანი Wi-Fi',
      frontKeypadCode: 'კარის კოდი (პინ-კოდი)',
      backupLockbox: 'სათადარიგო ლოქბოქსი:',
      notSet: 'არ არის მითითებული',
      quickShortcutsTitle: 'მართვის სწრაფი ბმულები',
      editGuidebook: 'გიდის შინაარსის რედაქტირება',
      editGuidebookSub: 'განაახლეთ Wi-Fi, კარის კოდები და სახლის წესები.',
      qrFlyerNfc: 'QR ფლაერი და NFC ბმული',
      qrFlyerNfcSub: 'ჩამოტვირთეთ დასაბეჭდი სადგამის ბარათები ობიექტისთვის.',
      livePreview: 'სმარტფონის ცოცხალი გადახედვა',
      livePreviewSub: 'გამოსცადეთ გიდი ზუსტად ისე, როგორც სტუმარი ხედავს.'
    },
    guide: {
      guideSectionsTitle: 'გიდის სექციები',
      welcomeTitle: 'მისასალმებელი სექცია',
      welcomeSub: 'პირველი შთაბეჭდილება და პერსონალიზებული მოკითხვა სტუმრის შემოსვლისას.',
      headlineGreeting: 'მისასალმებელი სათაური',
      welcomeNote: 'მისასალმებელი ტექსტი / შენიშვნა',
      checkinTitle: 'შესვლის (Check-in) დეტალები',
      checkinSub: 'მოსვლის დრო, ციფრული კოდები და მისამართის ინსტრუქცია.',
      checkinTime: 'შესვლის დრო (Check-in)',
      doorCode: 'შესასვლელი კარის კოდი',
      lockboxCode: 'სათადარიგო ლოქბოქსის კომბინაცია',
      entryDirections: 'ეტაპობრივი შესვლის ინსტრუქცია',
      parkingInstructions: 'პარკირების წესები / ინსტრუქცია',
      wifiTitle: 'Wi-Fi ქსელი და პაროლი',
      wifiSub: 'სტუმრებს შეუძლიათ ერთი შეხებით დააკოპირონ პაროლი ტელეფონში.',
      ssid: 'ქსელის სახელი (SSID)',
      wifiPass: 'Wi-Fi პაროლი',
      appliancesTitle: 'ტექნიკის გამოყენება (ინსტრუქციები)',
      appliancesSub: 'მკაფიო გზამკვლევი კონდიციონერის, გათბობის, სარეცხის მანქანისა და ყავის აპარატისთვის.',
      rulesTitle: 'სახლის წესები და სიჩუმის საათები',
      rulesSub: 'დაადგინეთ მკაფიო მოლოდინები თქვენი ქონებისა და მეზობლების დასაცავად.',
      quietHours: 'სიჩუმის საათები',
      trashSchedule: 'ნაგვის გადაყრის წესი და გრაფიკი',
      rulesList: 'სახლის წესების სია',
      recsTitle: 'რჩეული ლოკალური ადგილები',
      recsSub: 'თქვენი პირადი ფავორიტები კვების, ღვინისა და ღირსშესანიშნაობებისთვის.',
      placeNamePlaceholder: 'ადგილის სახელი',
      distancePlaceholder: 'მანძილი (მაგ. 3 წთ ფეხით)',
      transportTitle: 'ტრანსპორტი და აეროპორტის გზამკვლევი',
      transportSub: 'ტაქსის აპლიკაციები, მეტროს ბარათები და ტრანსფერი.',
      taxiInfo: 'ტაქსის / აპლიკაციების ინფორმაცია (Bolt, Yandex)',
      publicTransit: 'საზოგადოებრივი ტრანსპორტი / მეტრო',
      airportTransit: 'აეროპორტიდან ტრანსფერი',
      checkoutTitle: 'გასვლა (Check-out)',
      checkoutSub: 'გახადეთ გასვლა მარტივი და თავიდან აირიდეთ დაგვიანებები.',
      checkoutTime: 'გასვლის დრო (Check-out)',
      departureChecklist: 'გასვლის ჩეკლისტი',
      contactTitle: 'მასპინძლის საკონტაქტო არხები',
      contactSub: 'პირდაპირი ხაზები სტუმრის მშვიდი დასვენებისთვის.',
      hostName: 'მასპინძლის სახელი',
      hostPhone: 'მასპინძლის ტელეფონი',
      hostWhatsApp: 'WhatsApp ნომერი (საერთაშორისო ფორმატში)',
      emergencyTitle: 'გადაუდებელი დახმარება და მხარდაჭერა',
      emergencySub: 'კრიტიკული კონტაქტები უცხოელი სტუმრებისთვის გადაუდებელ სიტუაციებში.',
      emergencyServicesNum: 'სამაშველო სამსახურის ერთიანი ნომერი',
      emergencyContact: 'თანამასპინძლის ან კორპუსის გადაუდებელი კონტაქტი',
      autoSaveNotice: 'ცვლილებები ავტომატურად ინახება თქვენს მონაცემთა ბაზაში',
      saveChanges: 'ცვლილებების შენახვა',
      savedToast: 'ყველა ცვლილება წარმატებით შეინახა!'
    },
    preview: {
      simulatorTitle: 'სმარტფონის სიმულატორი სტუმრისთვის',
      simulatorSub: 'ზუსტად ამას ხედავს თქვენი სტუმარი stumari.app/g/-ის გახსნისას',
      openGuideBtn: 'სტუმრის გიდის გახსნა ↗'
    },
    qr: {
      connectGuestsTitle: 'დააკავშირეთ თქვენი სტუმრები',
      connectGuestsSub: 'განათავსეთ QR კოდი ტუმბოზე ან გამოიყენეთ NFC ჩიპი უკონტაქტო მყისიერი წვდომისთვის.',
      downloadQrBtn: 'მაღალი რეზოლუციის QR კოდის ჩამოტვირთვა (PNG)',
      generatingQr: 'QR კოდი გენერირდება...',
      nfcReadyTitle: 'NFC ჩიპი მზადაა',
      nfcReadySub: 'ჩაწერეთ ქვემოთ მოცემული ბმული ნებისმიერ NTAG213/215 ჩიპზე უფასო "NFC Tools" აპლიკაციით.',
      nfcActive: 'აქტიურია',
      guestUrlLabel: 'სტუმრის ბმული (Guest URL)',
      copied: 'დაკოპირდა',
      copyLink: 'ბმულის კოპირება'
    },
    settings: {
      settingsTitle: 'ობიექტის პარამეტრები',
      settingsSub: 'ძირითადი პარამეტრების, გარეკანის ფოტოსა და გამოქვეყნების სტატუსის მართვა.',
      propName: 'ობიექტის სახელი',
      propType: 'ობიექტის ტიპი',
      guestUrlSlug: 'სტუმრის ბმულის მისამართი (Slug)',
      addressLocation: 'მისამართი და ლოკაცია',
      coverImageUrl: 'გარეკანის სურათის URL',
      airbnbBookingLink: 'Airbnb ან Booking-ის ბმული',
      publishStatus: 'გამოქვეყნების სტატუსი',
      publishedNotice: 'გიდი საჯაროდ ხელმისაწვდომია სტუმრებისთვის.',
      draftNotice: 'გიდი დროებით გადაყვანილია მონახაზში და დამალულია.',
      publishGuide: 'გიდის გამოქვეყნება',
      unpublishGuide: 'გამოქვეყნების გაუქმება',
      deleteProperty: 'ობიექტის წაშლა',
      deleteWarning: 'სამუდამოდ წაშალეთ ეს ობიექტი და მისი სტუმრის გიდი.',
      deleteBtn: 'წაშლა'
    }
  },

  // 🇷🇺 RUSSIAN (Русский)
  ru: {
    overview: {
      guidebookStatus: 'Статус путеводителя',
      liveAndInstant: 'Прямая ссылка для гостя активна и мгновенно доступна.',
      highSpeedWifi: 'Скоростной Wi-Fi',
      frontKeypadCode: 'Код входной двери (домофон / замок)',
      backupLockbox: 'Резервный сейф для ключей:',
      notSet: 'Не задан',
      quickShortcutsTitle: 'Быстрые действия по управлению',
      editGuidebook: 'Редактировать контент путеводителя',
      editGuidebookSub: 'Обновите Wi-Fi, коды дверей и правила дома.',
      qrFlyerNfc: 'QR-флаер и NFC-ссылка',
      qrFlyerNfcSub: 'Скачайте готовые настольные карточки для печати.',
      livePreview: 'Интерактивный просмотр на смартфоне',
      livePreviewSub: 'Проверьте путеводитель точно так, как его видят гости.'
    },
    guide: {
      guideSectionsTitle: 'Разделы путеводителя',
      welcomeTitle: 'Приветственный раздел',
      welcomeSub: 'Первое впечатление и персональное приветствие при открытии гостем.',
      headlineGreeting: 'Главное приветствие',
      welcomeNote: 'Текст приветствия / Заметка',
      checkinTitle: 'Детали прибытия (Check-in)',
      checkinSub: 'Время заезда, электронные коды доступа и маршрут до входа.',
      checkinTime: 'Время заезда (Check-in)',
      doorCode: 'Код входной двери / кодового замка',
      lockboxCode: 'Код резервного сейфа для ключей (Lockbox)',
      entryDirections: 'Пошаговая инструкция входа',
      parkingInstructions: 'Инструкции по парковке',
      wifiTitle: 'Сеть Wi-Fi и пароль',
      wifiSub: 'Гости копируют пароль в один клик прямо на свой смартфон.',
      ssid: 'Имя сети (SSID)',
      wifiPass: 'Пароль от Wi-Fi',
      appliancesTitle: 'Бытовая техника и приборы',
      appliancesSub: 'Понятные инструкции к кондиционеру, стиральной машине, бойлеру и кофеварке.',
      rulesTitle: 'Правила проживания и тихие часы',
      rulesSub: 'Четкие правила для защиты вашего жилья и комфорта соседей.',
      quietHours: 'Тихие часы',
      trashSchedule: 'Вынос мусора и переработка',
      rulesList: 'Список правил дома',
      recsTitle: 'Рекомендации по району',
      recsSub: 'Ваши проверенные места: рестораны, кофейни, вино и достопримечательности.',
      placeNamePlaceholder: 'Название заведения',
      distancePlaceholder: 'Расстояние (напр. 3 мин пешком)',
      transportTitle: 'Транспорт и аэропорт',
      transportSub: 'Приложения такси, общественный транспорт и трансфер.',
      taxiInfo: 'Такси / Приложения для вызова (Bolt, Yandex)',
      publicTransit: 'Общественный транспорт / Метро',
      airportTransit: 'Трансфер из аэропорта',
      checkoutTitle: 'Выезд (Check-out)',
      checkoutSub: 'Сделайте выезд быстрым и предотвратите задержки горничных.',
      checkoutTime: 'Время выезда (Check-out)',
      departureChecklist: 'Список дел перед выездом',
      contactTitle: 'Контакты хозяина',
      contactSub: 'Прямые каналы связи для спокойствия гостей.',
      hostName: 'Имя хозяина',
      hostPhone: 'Телефон хозяина',
      hostWhatsApp: 'WhatsApp номер (в международном формате)',
      emergencyTitle: 'Экстренная помощь и службы',
      emergencySub: 'Важные контакты для иностранных гостей в экстренных ситуациях.',
      emergencyServicesNum: 'Единый номер экстренных служб',
      emergencyContact: 'Экстренный контакт совладельца или управляющего',
      autoSaveNotice: 'Изменения сохраняются автоматически в базе данных Stumari',
      saveChanges: 'Сохранить изменения',
      savedToast: 'Все изменения успешно сохранены!'
    },
    preview: {
      simulatorTitle: 'Симулятор смартфона гостя',
      simulatorSub: 'Именно так путеводитель выглядит на телефоне гостя по ссылке stumari.app/g/',
      openGuideBtn: 'Открыть путеводитель гостя ↗'
    },
    qr: {
      connectGuestsTitle: 'Подключите ваших гостей',
      connectGuestsSub: 'Разместите QR-код на прикроватной тумбочке или запрограммируйте метку NFC.',
      downloadQrBtn: 'Скачать QR-код высокого разрешения (PNG)',
      generatingQr: 'Генерация QR-кода...',
      nfcReadyTitle: 'NFC-метка готова к записи',
      nfcReadySub: 'Запишите ссылку ниже на любую метку NTAG213/215 через бесплатное приложение «NFC Tools».',
      nfcActive: 'Активно',
      guestUrlLabel: 'Прямая ссылка для гостя (Guest URL)',
      copied: 'Скопировано',
      copyLink: 'Скопировать ссылку'
    },
    settings: {
      settingsTitle: 'Настройки объекта',
      settingsSub: 'Управление основными параметрами, обложкой и статусом публикации.',
      propName: 'Название жилья',
      propType: 'Тип жилья',
      guestUrlSlug: 'Короткий адрес ссылки (Slug)',
      addressLocation: 'Адрес и локация',
      coverImageUrl: 'URL фото обложки',
      airbnbBookingLink: 'Ссылка на Airbnb или Booking',
      publishStatus: 'Статус публикации',
      publishedNotice: 'Путеводитель открыт и доступен гостям.',
      draftNotice: 'Путеводитель переведен в черновик и скрыт от гостей.',
      publishGuide: 'Опубликовать путеводитель',
      unpublishGuide: 'Снять с публикации',
      deleteProperty: 'Удалить объект',
      deleteWarning: 'Безвозвратно удалить этот объект и связанный с ним путеводитель.',
      deleteBtn: 'Удалить'
    }
  },

  // 🇬🇧 ENGLISH
  en: {
    overview: {
      guidebookStatus: 'Guidebook Status',
      liveAndInstant: 'Direct guest URL is live and instant.',
      highSpeedWifi: 'High-Speed Wi-Fi',
      frontKeypadCode: 'Front Keypad Code',
      backupLockbox: 'Backup Lockbox:',
      notSet: 'Not set',
      quickShortcutsTitle: 'Quick Management Shortcuts',
      editGuidebook: 'Edit Guidebook Content',
      editGuidebookSub: 'Update Wi-Fi, door codes, and house rules.',
      qrFlyerNfc: 'Get QR Flyer & NFC Link',
      qrFlyerNfcSub: 'Download printable stand cards for the unit.',
      livePreview: 'Live Smartphone Preview',
      livePreviewSub: 'Test exact interactions as a guest.'
    },
    guide: {
      guideSectionsTitle: 'GUIDE SECTIONS',
      welcomeTitle: 'Welcome Section',
      welcomeSub: 'First impression and personalized greeting when guests tap in.',
      headlineGreeting: 'Headline Greeting',
      welcomeNote: 'Welcome Tagline / Note',
      checkinTitle: 'Check-in Details',
      checkinSub: 'Arrival timing, digital keypad codes, and arrival directions.',
      checkinTime: 'Check-in Time',
      doorCode: 'Front Door Keypad Code',
      lockboxCode: 'Backup Lockbox Combination',
      entryDirections: 'Step-by-Step Entry Directions',
      parkingInstructions: 'Parking Instructions',
      wifiTitle: 'Wi-Fi Network & Password',
      wifiSub: 'Guests can tap a single button to copy this password straight to their phone.',
      ssid: 'Network Name (SSID)',
      wifiPass: 'Wi-Fi Password',
      appliancesTitle: 'How Things Work (Appliances)',
      appliancesSub: 'Clear guides for AC, heater, washing machine, and coffee maker.',
      rulesTitle: 'House Rules & Quiet Hours',
      rulesSub: 'Set expectations clearly to protect your property and neighbors.',
      quietHours: 'Quiet Hours',
      trashSchedule: 'Trash & Recycling Schedule',
      rulesList: 'House Rules List',
      recsTitle: 'Curated Local Spots',
      recsSub: 'Your personal favorites for dining, wine, and sightseeing.',
      placeNamePlaceholder: 'Place name',
      distancePlaceholder: 'Distance (e.g. 3 min walk)',
      transportTitle: 'Transport & Airport Guidance',
      transportSub: 'Taxi apps, metro cards, and airport transfers.',
      taxiInfo: 'Taxi / Ride-hailing Info',
      publicTransit: 'Public Transit / Metro',
      airportTransit: 'Airport Transit',
      checkoutTitle: 'Departure & Check-out',
      checkoutSub: 'Make check-out smooth and avoid delayed turnovers.',
      checkoutTime: 'Check-out Time',
      departureChecklist: 'Departure Checklist',
      contactTitle: 'Host Contact Channels',
      contactSub: 'Direct lines for guest peace of mind.',
      hostName: 'Host Name',
      hostPhone: 'Host Phone',
      hostWhatsApp: 'Host WhatsApp (International format)',
      emergencyTitle: 'Emergency & Building Support',
      emergencySub: 'Critical local contacts for foreign guests in urgent situations.',
      emergencyServicesNum: 'Universal Emergency Services Number',
      emergencyContact: 'Co-host or Building Emergency Contact',
      autoSaveNotice: 'Changes auto-save directly to your Stumari database',
      saveChanges: 'Save Changes',
      savedToast: 'All guide updates saved!'
    },
    preview: {
      simulatorTitle: 'Smartphone Guest Simulator',
      simulatorSub: 'This is exactly what your guest sees when opening stumari.app/g/',
      openGuideBtn: 'Open Guest Guide ↗'
    },
    qr: {
      connectGuestsTitle: 'Connect your guests',
      connectGuestsSub: 'Place the QR code on your nightstand or program an NFC tag for contactless instant access.',
      downloadQrBtn: 'Download High-Res QR Code (PNG)',
      generatingQr: 'Generating QR...',
      nfcReadyTitle: 'NFC Tag Ready',
      nfcReadySub: 'Write the URL below to any NTAG213/215 tag using the free "NFC Tools" mobile app.',
      nfcActive: 'Active',
      guestUrlLabel: 'Guest URL',
      copied: 'Copied',
      copyLink: 'Copy Link'
    },
    settings: {
      settingsTitle: 'Property Settings',
      settingsSub: 'Configure general parameters, cover images, and publish status.',
      propName: 'Property Name',
      propType: 'Property Type',
      guestUrlSlug: 'Guest URL Slug',
      addressLocation: 'Address & Location',
      coverImageUrl: 'Cover Image URL',
      airbnbBookingLink: 'Airbnb or Booking Link',
      publishStatus: 'Publish Status',
      publishedNotice: 'Property guide is publicly accessible to guests.',
      draftNotice: 'Property guide is set to draft and hidden from visitors.',
      publishGuide: 'Publish Guide',
      unpublishGuide: 'Unpublish Guide',
      deleteProperty: 'Delete Property',
      deleteWarning: 'Permanently remove this property and its guest guide.',
      deleteBtn: 'Delete'
    }
  }
};

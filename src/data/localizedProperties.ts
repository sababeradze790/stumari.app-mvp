import { Property } from '../types';
import { Language } from '../i18n/types';
import { INITIAL_PROPERTIES } from './mockData';

function applyStarterTranslations(property: Property, overrides: Partial<Property>): Property {
  const initialProp = INITIAL_PROPERTIES.find(
    p => p.id === property.id || p.slug === property.slug
  );
  if (!initialProp) {
    return property;
  }

  const result: Property = { ...property };
  const neverOverrideKeys = new Set<keyof Property>([
    'id',
    'slug',
    'status',
    'coverImage',
    'photos',
    'gemIds',
    'customGems',
    'doorKeypadCode',
    'lockboxCode',
    'wifiNetwork',
    'wifiPassword',
    'checkInMethod'
  ]);

  (Object.keys(overrides) as (keyof Property)[]).forEach((key) => {
    if (neverOverrideKeys.has(key)) return;
    const currentVal = property[key];
    const initialVal = initialProp[key];
    // Only apply static starter translation if the field has not been edited by the host
    if (JSON.stringify(currentVal) === JSON.stringify(initialVal)) {
      (result as any)[key] = overrides[key];
    }
  });

  return result;
}

export function getLocalizedProperty(property: Property, lang: Language): Property {
  if (!property || lang === 'en') {
    return property;
  }

  // Localized templates for Georgian
  if (lang === 'ka') {
    if (property.id === 'prop-1' || property.slug.includes('old-tbilisi')) {
      return applyStarterTranslations(property, {
        ...property,
        title: 'ძველი თბილისის აპარტამენტი',
        subtitle: 'მე-19 საუკუნის ისტორიული რეზიდენცია ძველი აივნით',
        tagline: 'გამარჯობა! კეთილი იყოს თქვენი მობრძანება ძველი თბილისის გულში, სოლოლაკში.',
        city: 'თბილისი',
        country: 'საქართველო',
        address: 'ლადო ასათიანის ქ. 14, ბინა 3',
        hostName: 'საბა ბერაძე',
        hostRole: 'მასპინძელი & სუპერჰოსტი',
        welcomeTitle: 'მოგესალმებით ძველ თბილისში!',
        welcomeGreeting: 'იგრძენით თავი როგორც საკუთარ სახლში. ყველაფერი, რაც გჭირდებათ დაუვიწყარი დასვენებისთვის სოლოლაკში, აქ არის თავმოყრილი.',
        checkInTime: '15:00',
        checkOutTime: '11:00',
        parkingInstructions: 'უფასო პარკინგი ხელმისაწვდომია ლადო ასათიანის ქუჩაზე. თუ გადატვირთულია, 50 მეტრში წმინდა გიორგის ეკლესიასთან არის ღია ეზო პარკინგისთვის.',
        arrivalDirections: 'შედით ხის ჭვირული ჭიშკრით (დღის განმავლობაში ღიაა). აუყევით თუჯის ხვეულ კიბეს მე-2 სართულზე. ბინა 3 არის ზურმუხტისფერი კარი სპილენძის სახელურით. აკრიფეთ 3829# ელექტრონულ საკეტზე.',
        appliances: [
          {
            id: 'app-1',
            title: 'Daikin ინვერტორული კონდიციონერი და გათბობა',
            icon: 'Thermometer',
            instructions: 'პულტი მოთავსებულია შემოსასვლელის თაღთან. დააჭირეთ POWER-ს. Mode ღილაკით გადართეთ გაგრილებას (ფიფქი) ან გათბობას (მზე) შორის. ოპტიმალური ტემპერატურაა 22°C.',
            troubleshooting: 'თუ ყვითლად ციმციმებს, დარწმუნდით რომ აივნის კარი ბოლომდეა მიხურული; ღია კარზე სისტემა ავტომატურად პაუზდება.'
          },
          {
            id: 'app-2',
            title: 'DeLonghi ესპრესოს ყავის აპარატი',
            icon: 'Coffee',
            instructions: 'ადგილობრივი მოხალული ყავის მარცვლები სამზარეულოს მინის ქილაშია. დააჭირეთ ჩართვის ღილაკს. დაელოდეთ 30 წამი მწვანე ნათურას. მოარგეთ ფილტრი და დააჭირეთ 1 ან 2 ჭიქის ღილაკს.',
            troubleshooting: 'თუ წითელი ნათურა ციმციმებს, უკანა წყლის ავზი დაცლილია. შეავსეთ Brita-ს ფილტრიანი წყლით.'
          },
          {
            id: 'app-3',
            title: 'Bosch სარეცხი მანქანა საშრობით',
            icon: 'Shirt',
            instructions: 'სარეცხი კაფსულები აბაზანის კალათშია. ჩადეთ 1 კაფსულა დოლურაში. გადაატრიალეთ ღილაკი "Mix 40°"-ზე და დააჭირეთ Start-ს. რეცხვა გრძელდება 2 სთ 15 წთ.',
            troubleshooting: 'კარი იღება სიგნალის დასრულებიდან 90 წამში.'
          },
          {
            id: 'app-4',
            title: 'Samsung The Frame 4K ტელევიზორი',
            icon: 'Tv',
            instructions: 'გამოიყენეთ მზის ელემენტიანი პულტი. Home ღილაკით ხელმისაწვდომია Netflix, HBO Max და Spotify უკვე გააქტიურებული სტუმრის პროფილით.',
            troubleshooting: 'საუნდბარი ავტომატურად უკავშირდება ტელევიზორს eARC-ით.'
          }
        ],
        trashSchedule: 'მწვანე მუნიციპალური ურნები მდებარეობს 30 მეტრში, გუდიაშვილის მოედნისკენ. მინისა და მუყაოს გადამუშავების ურნები კუთხეშია. გატანა ხდება ყოველდღე 21:00 საათის შემდეგ.',
        quietHours: '23:00-დან 08:00-მდე (სოლოლაკი ისტორიული საცხოვრებელი უბანია, გთხოვთ პატივი ვცეთ მეზობლებს).',
        houseRules: [
          'მოწევა ბინაში აკრძალულია (აივანზე საფერფლე ხელმისაწვდომია).',
          'გთხოვთ შემოსვლისას გაიხადოთ ფეხსაცმელი; რბილი ჩუსტები დაგხვდებათ შემოსასვლელის კალათში.',
          'დაუშვებელია დაურეგისტრირებელი სტუმრების ღამით დარჩენა და ხმაურიანი წვეულებები.',
          'აივნის ხის ისტორიული მოაჯირი 130 წლისაა — გთხოვთ ნუ გადაეყუდებით ზედმეტად.'
        ],
        recommendations: [
          {
            id: 'rec-1',
            name: 'ეზო (ორგანული ეზოს რესტორანი)',
            category: 'food',
            description: 'ნატურალური ქართული ტრადიციული კერძები მე-19 საუკუნის სიმყუდროვეში, სოლოლაკის შიდა ეზოში. უგემრიელესი იმერული ხაჭაპური.',
            hostTip: 'აუცილებლად გასინჯეთ შქმერული და კახური ქვევრის ქარვისფერი ღვინო.',
            address: 'გერონტი ქიქოძის ქ. 16, თბილისი',
            distance: '4 წუთი ფეხით (300მ)',
            mapsUrl: 'https://maps.google.com/?q=Ezo+Tbilisi'
          },
          {
            id: 'rec-2',
            name: 'Luka Polare & Coffee LAB სოლოლაკი',
            category: 'coffee',
            description: 'საუკეთესო სპეშალთი ყავა და ნატურალური ნაყინი უბანში. სასიამოვნო დილის მზე ღია სკამებზე.',
            hostTip: 'გასინჯეთ დამარილებული ფისტას ნაყინი ან ცივი ყავა ილით.',
            address: 'ლადო ასათიანის ქ. 5, თბილისი',
            distance: '2 წუთი ფეხით (150მ)',
            mapsUrl: 'https://maps.google.com/?q=Coffee+LAB+Sololaki'
          },
          {
            id: 'rec-3',
            name: 'Vino Underground (ნატურალური ღვინის ბარი)',
            category: 'nightlife',
            description: 'ქართველი მეღვინეების მიერ დაარსებული პირველი ბუნებრივი ღვინის მარანი. ქვევრის უნიკალური ნიმუშები.',
            hostTip: 'სთხოვეთ სომელიეს 3 ჭიქიანი დეგუსტაცია (ჩინური, რქაწითელი) და სულგუნის დაფა.',
            address: 'გალაქტიონ ტაბიძის ქ. 15, თბილისი',
            distance: '5 წუთი ფეხით (400მ)',
            mapsUrl: 'https://maps.google.com/?q=Vino+Underground+Tbilisi'
          },
          {
            id: 'rec-4',
            name: 'Europroduct Gourmet & Smart Express',
            category: 'groceries',
            description: 'კეთილმოწყობილი სუპერმარკეტი ახალი პურით, რძის ნაწარმით, ბორჯომით, ღვინითა და იმპორტული პროდუქტებით.',
            hostTip: 'ღიაა ყოველდღე 23:30-მდე. შესანიშნავი მინერალური წყლები.',
            address: 'ლეონიძის ქ. 22, თავისუფლების მოედანი',
            distance: '6 წუთი ფეხით (500მ)',
            mapsUrl: 'https://maps.google.com/?q=Europroduct+Leonidze+Tbilisi'
          }
        ],
        taxiInfo: 'გადმოწერეთ Bolt აპლიკაცია (ყველაზე გავრცელებული და საიმედოა თბილისში, ბარათით გადახდით). თავისუფლების მოედანზე ასევე მარტივად იპოვით ტაქსის.',
        transitInfo: 'თავისუფლების მოედნის მეტროსადგური 10 წუთის სავალზეა გუდიაშვილის სკვერის გავლით. შეგიძლიათ გადაიხადოთ ნებისმიერი უკონტაქტო საბანკო ბარათით.',
        airportTransit: 'თბილისის საერთაშორისო აეროპორტი (TBS) 25 წუთის სავალზეა ტაქსით (~35-40 ლარი Bolt-ით) ან შეგიძლიათ ისარგებლოთ #337 ავტობუსით პირდაპირ თავისუფლების მოედნამდე.',
        departureChecklist: [
          'გამორთეთ კონდიციონერი და განათება.',
          'გამოყენებული პირსახოცები ჩადეთ აბაზანის კალათში.',
          'სამზარეულოს ნაგვის პარკი ჩაიტანეთ ქუჩის მწვანე ურნაში.',
          'შეამოწმეთ უჯრები და როზეტები, რომ არ დაგრჩეთ დამტენი ან პასპორტი.',
          'მიხურეთ შემოსასვლელი კარი და დააჭირეთ საკეტის ჩამკეტ ღილაკს.'
        ]
      });
    }

    if (property.id === 'prop-2' || property.slug.includes('sunny-sololaki')) {
      return applyStarterTranslations(property, {
        ...property,
        title: 'მზიანი სოლოლაკი',
        subtitle: 'მყუდრო ნათელი ლოფტი ძველ თბილისში ღია აივნით',
        tagline: 'თბილი მზის სინათლე, ბოჰემური სიმყუდროვე და მწვანე ეზო სოლოლაკის გულში.',
        city: 'თბილისი',
        country: 'საქართველო',
        address: 'ლადო ასათიანის ქ. 8, ბინა 4',
        hostName: 'საბა ბერაძე',
        hostRole: 'მასპინძელი & სუპერჰოსტი',
        welcomeTitle: 'მოგესალმებით მზიან სოლოლაკში!',
        welcomeGreeting: 'დატკბით მყუდრო ოთახებით, ახლადმოხალული ყავითა და ძველი თბილისის ცოცხალი ატმოსფეროთი.',
        checkInTime: '15:00',
        checkOutTime: '11:00',
        doorKeypadCode: '4820#',
        parkingInstructions: 'უფასო პარკინგი ასათიანის ქუჩაზე ან შენობის უკან მდებარე ღია ეზოში.',
        arrivalDirections: 'შედით ხის ჭიშკრით, აუყევით რკინის კიბეს მე-2 სართულზე, ზურმუხტისფერი კარი მარცხნივ. აკრიფეთ 4820# კოდის საკეტზე.',
        wifiNetwork: 'SunnySololaki_5G',
        wifiPassword: 'SololakiSun2026!'
      });
    }

    if (property.id === 'prop-3' || property.slug.includes('batumi-sea-view')) {
      return applyStarterTranslations(property, {
        ...property,
        title: 'ბათუმის ზღვის ხედი',
        subtitle: 'პანორამული ხედი შავ ზღვაზე და მზის ჩასვლა',
        tagline: 'გაიღვიძეთ ტალღების ხმაზე. თქვენი თანამედროვე სანაპირო თავშესაფარი ბათუმში.',
        city: 'ბათუმი',
        country: 'საქართველო',
        address: 'რუსთაველის გამზირი 28, კოშკი B, ბინა 1804',
        welcomeTitle: 'მოგესალმებით ბათუმში!',
        welcomeGreeting: 'დატკბით ზღვის პანორამით და ბათუმის ბულვარის სიმყუდროვით.',
        checkInTime: '15:00',
        checkOutTime: '11:00',
        doorKeypadCode: '9182#',
        parkingInstructions: 'უფასო მიწისქვეშა პარკინგი კოშკ B-ში, ადგილი #42.',
        arrivalDirections: 'შედით მთავარი რეცეფციიდან, ლიფტით აბრძანდით მე-18 სართულზე, ბინა 1804 მარჯვენა ფრთაშია. აკრიფეთ 9182# საკეტზე.',
        taxiInfo: 'ბათუმში საუკეთესოდ მუშაობს Bolt აპლიკაცია.',
        transitInfo: 'ბათუმის ბულვარი და სანაპირო პირდაპირ კორპუსის წინ არის.',
        airportTransit: 'ბათუმის საერთაშორისო აეროპორტამდე 12 წუთია ტაქსით (~15-20 ლარი).'
      });
    }

    if (property.id === 'prop-4' || property.slug.includes('kazbegi-cabin') || property.slug.includes('mountain-house')) {
      return applyStarterTranslations(property, {
        ...property,
        title: 'ყაზბეგის კოტეჯი',
        subtitle: 'მყინვარწვერის ხედი და მყუდრო ალპური შალე',
        tagline: 'სუფთა მთის ჰაერი, ბუხრის სითბო და გერგეტის სამების პანორამა.',
        city: 'სტეფანწმინდა',
        country: 'საქართველო',
        address: 'გერგეტის ხეობის გზა 12',
        welcomeTitle: 'მოგესალმებით ყაზბეგის კოტეჯში!',
        welcomeGreeting: 'დაისვენეთ კავკასიონის მთების გარემოცვაში ბუხართან და საუნასთან ერთად.',
        checkInTime: '15:00',
        checkOutTime: '11:00',
        doorKeypadCode: '7721#',
        parkingInstructions: 'კერძო დახურული ეზო გერგეტის გზაზე (ეტევა 3 ჯიპი).',
        arrivalDirections: 'გადაუხვიეთ გერგეტის შესახვევში ხიდის შემდეგ. კედარის ჭიშკარი აღნიშნულია Stumari #12 ნიშნით. აკრიფეთ 7721#.',
        wifiNetwork: 'Kazbegi_Peak_WiFi',
        wifiPassword: 'MountKazbek2026!'
      });
    }

    if (property.id === 'prop-5' || property.slug.includes('vake-garden')) {
      return applyStarterTranslations(property, {
        ...property,
        title: 'ვაკის ბაღის სახლი',
        subtitle: 'დახვეწილი ურბანული რეზიდენცია მყუდრო ეზოთი და გამწვანებით',
        tagline: 'მყუდრო მწვანე ელეგანტურობა ვაკეში, პარკებთან, კაფეებთან და ღვინის ბარებთან ახლოს.',
        city: 'თბილისი',
        country: 'საქართველო',
        address: 'ირაკლი აბაშიძის ქ. 12, ბინა 6',
        welcomeTitle: 'მოგესალმებით ვაკის ბაღის სახლში!',
        welcomeGreeting: 'დაისვენეთ ჩვენს მწვანე ეზოიან სახლში თბილისის ყველაზე გამორჩეულ უბანში.',
        checkInTime: '15:00',
        checkOutTime: '11:00',
        doorKeypadCode: '5514#',
        parkingInstructions: 'გამოყოფილი მიწისქვეშა პარკინგის ადგილი #6 შენობის სარდაფში.',
        arrivalDirections: 'შედით შენობის ჰოლიდან აბაშიძის ქუჩაზე. ლიფტით მე-2 სართულზე, ბინა 6 მარჯვნივაა. აკრიფეთ 5514#.',
        wifiNetwork: 'VakeGarden_Ultra',
        wifiPassword: 'VakeGreen2026!'
      });
    }
  }

  // Localized templates for Russian
  if (lang === 'ru') {
    if (property.id === 'prop-1' || property.slug.includes('old-tbilisi')) {
      return applyStarterTranslations(property, {
        ...property,
        title: 'Апартаменты в Старом Тбилиси',
        subtitle: 'Историческая резиденция XIX века с резным балконом',
        tagline: 'Гамарджоба! Добро пожаловать в уютный богемный уголок на мощёных улочках Сололаки.',
        city: 'Тбилиси',
        country: 'Грузия',
        address: 'ул. Ладо Асатиани, 14, кв. 3',
        hostName: 'Саба Берадзе',
        hostRole: 'Хозяин & Суперхозяин',
        welcomeTitle: 'Добро пожаловать в Старый Тбилиси!',
        welcomeGreeting: 'Чувствуйте себя как дома! Всё необходимое для незабываемого отдыха в историческом центре Сололаки собрано здесь.',
        checkInTime: '15:00',
        checkOutTime: '11:00',
        parkingInstructions: 'Бесплатная парковка вдоль улицы Ладо Асатиани. Если занято, в 50 метрах выше справа у церкви Св. Георгия есть открытый дворик для парковки.',
        arrivalDirections: 'Толкните массивные резные деревянные ворота во двор (днём они не заперты). Поднимитесь по винтовой чугунной лестнице на 2-й этаж. Квартира 3 — бирюзовая дверь с медным молотком. Введите 3829# на электронном замке.',
        appliances: [
          {
            id: 'app-1',
            title: 'Инверторный кондиционер и обогрев Daikin',
            icon: 'Thermometer',
            instructions: 'Пульт закреплён на стене возле коридорной арки. Нажмите POWER. Кнопка Mode переключает между охлаждением (снежинка) и обогревом (солнце). Комфортная температура: 22°C.',
            troubleshooting: 'Если мигает оранжевым, проверьте, плотно ли закрыты балконные двери — система встаёт на паузу при открытых дверях.'
          },
          {
            id: 'app-2',
            title: 'Эспрессо-кофемашина DeLonghi',
            icon: 'Coffee',
            instructions: 'Свежеобжаренные кофейные зёрна в стеклянной банке на кухне. Нажмите кнопку включения. Подождите 30 секунд до зелёного индикатора. Вставьте рожок и нажмите кнопку на 1 или 2 чашки.',
            troubleshooting: 'Красный индикатор сигнализирует о нехватке воды в резервуаре. Налейте фильтрованную воду из кувшина Brita.'
          },
          {
            id: 'app-3',
            title: 'Стиральная машина с сушкой Bosch',
            icon: 'Shirt',
            instructions: 'Капсулы для стирки в корзине под раковиной в ванной. Положите 1 капсулу в барабан. Поверните ручку на "Mix 40°" и нажмите Start. Время цикла 2 ч 15 мин.',
            troubleshooting: 'Замок двери открывается автоматически через 90 секунд после окончания стирки.'
          },
          {
            id: 'app-4',
            title: 'Телевизор Samsung The Frame 4K & Саундбар',
            icon: 'Tv',
            instructions: 'Используйте пульт на солнечной батарее. Нажмите Home для доступа к Netflix, HBO Max и Spotify с готовым гостевым аккаунтом.',
            troubleshooting: 'Саундбар подключается автоматически через eARC.'
          }
        ],
        trashSchedule: 'Зелёные металлические контейнеры расположены в 30 метрах вниз по улице в сторону площади Гудиашвили. Вывоз мусора ежедневно после 21:00.',
        quietHours: 'С 23:00 до 08:00 (Сололаки — тихий исторический жилой район, просим уважать покой соседей).',
        houseRules: [
          'Курение внутри квартиры строго запрещено (на балконе есть пепельница).',
          'Пожалуйста, разувайтесь при входе; мягкие шерстяные тапочки лежат в плетёной корзине в прихожей.',
          'Запрещено проводить шумные вечеринки и приводить незарегистрированных гостей на ночь.',
          'Резным деревянным перилам балкона более 130 лет — пожалуйста, не перегибайтесь через край.'
        ],
        recommendations: [
          {
            id: 'rec-1',
            name: 'Ezo (Ресторан органической кухни во дворе)',
            category: 'food',
            description: 'Аутентичные блюда грузинской кухни из фермерских продуктов в уютном тенистом дворике Сололаки XIX века. Невероятный имеретинский хачапури.',
            hostTip: 'Закажите шкмерули (цыплёнок в чесночно-сливочном соусе) и домашнее оранжевое кахетинское вино.',
            address: 'ул. Геронти Кикодзе, 16, Тбилиси',
            distance: '4 мин пешком (300м)',
            mapsUrl: 'https://maps.google.com/?q=Ezo+Tbilisi'
          },
          {
            id: 'rec-2',
            name: 'Luka Polare & Coffee LAB Sololaki',
            category: 'coffee',
            description: 'Лучший спешелти флэт-уайт и крафтовое джелато в округе. Прекрасное утреннее солнце на террасе.',
            hostTip: 'Попробуйте мороженое с солёной фисташкой или колд-брю с кардамоном.',
            address: 'ул. Ладо Асатиани, 5, Тбилиси',
            distance: '2 мин пешком (150м)',
            mapsUrl: 'https://maps.google.com/?q=Coffee+LAB+Sololaki'
          },
          {
            id: 'rec-3',
            name: 'Vino Underground (Бар натуральных вин)',
            category: 'nightlife',
            description: 'Культовый винный погреб, открытый грузинскими виноделами-традиционалистами. Натуральные квеври-вина.',
            hostTip: 'Попросите дегустационный сет из 3 квеври вин (Чинури, Ркацители) и сырную тарелку сулугуни.',
            address: 'ул. Галактиона Табидзе, 15, Тбилиси',
            distance: '5 мин пешком (400м)',
            mapsUrl: 'https://maps.google.com/?q=Vino+Underground+Tbilisi'
          },
          {
            id: 'rec-4',
            name: 'Europroduct Gourmet & Smart Express',
            category: 'groceries',
            description: 'Отличный продуктовый супермаркет со свежим хлебом, сырами, вином, минеральной водой Боржоми и деликатесами.',
            hostTip: 'Открыт ежедневно до 23:30. Всегда свежая вода Боржоми и Набеглави.',
            address: 'ул. Леонидзе, 22, Площадь Свободы',
            distance: '6 мин пешком (500м)',
            mapsUrl: 'https://maps.google.com/?q=Europroduct+Leonidze+Tbilisi'
          }
        ],
        taxiInfo: 'Используйте приложение Bolt (самое популярное и надёжное в Тбилиси, работает оплата картой). На Площади Свободы также всегда много такси.',
        transitInfo: 'Станция метро "Площадь Свободы" в 10 минутах ходьбы через сквер Гудиашвили. Турникеты принимают любые бесконтактные банковские карты.',
        airportTransit: 'Международный аэропорт Тбилиси (TBS) находится в 25 минутах на такси (~35-40 лари через Bolt) или на автобусе #337 прямо до Площади Свободы.',
        departureChecklist: [
          'Выключите кондиционеры и свет во всех комнатах.',
          'Сложите использованные полотенца в корзину в ванной.',
          'Вынесите кухонный пакет с мусором в уличный контейнер.',
          'Проверьте ящики и розетки на предмет забытых зарядок и документов.',
          'Захлопните входную дверь и нажмите кнопку блокировки на замке.'
        ]
      });
    }

    if (property.id === 'prop-2' || property.slug.includes('sunny-sololaki')) {
      return applyStarterTranslations(property, {
        ...property,
        title: 'Солнечный Сололаки',
        subtitle: 'Уютный светлый лофт в Старом Тбилиси с открытым балконом',
        tagline: 'Тёплый солнечный свет, богемный уют и зелёный дворик в самом сердце Сололаки.',
        city: 'Тбилиси',
        country: 'Грузия',
        address: 'ул. Ладо Асатиани, 8, кв. 4',
        hostName: 'Саба Берадзе',
        hostRole: 'Хозяин & Суперхозяин',
        welcomeTitle: 'Добро пожаловать в Солнечный Сололаки!',
        welcomeGreeting: 'Насладитесь светлыми комнатами, свежесваренным кофе и колоритом Старого Тбилиси.',
        checkInTime: '15:00',
        checkOutTime: '11:00',
        doorKeypadCode: '4820#',
        parkingInstructions: 'Бесплатная парковка вдоль улицы Асатиани или во внутреннем дворике.',
        arrivalDirections: 'Пройдите через деревянные ворота во двор, поднимитесь по лестнице на 2 этаж, бирюзовая дверь слева. Код замка 4820#.',
        wifiNetwork: 'SunnySololaki_5G',
        wifiPassword: 'SololakiSun2026!'
      });
    }

    if (property.id === 'prop-3' || property.slug.includes('batumi-sea-view')) {
      return applyStarterTranslations(property, {
        ...property,
        title: 'Апартаменты с видом на море в Батуми',
        subtitle: 'Панорамные закаты над Чёрным морем и высотный балкон',
        tagline: 'Просыпайтесь под шум прибоя. Ваш стильный морской дом в Батуми.',
        city: 'Батуми',
        country: 'Грузия',
        address: 'проспект Руставели, 28, Башня B, кв. 1804',
        welcomeTitle: 'Добро пожаловать в Батуми!',
        welcomeGreeting: 'Насладитесь морским бризом и закатами на Батумском бульваре.',
        checkInTime: '15:00',
        checkOutTime: '11:00',
        doorKeypadCode: '9182#',
        parkingInstructions: 'Бесплатный подземный паркинг в башне B, парковочное место #42.',
        arrivalDirections: 'Зайдите через главный холл, поднимитесь на лифте на 18 этаж, квартира 1804 в правом крыле. Введите 9182# на замке.',
        wifiNetwork: 'BatumiSea_Fiber',
        wifiPassword: 'BlackSeaBreeze26!',
        taxiInfo: 'В Батуми быстрее и удобнее всего вызывать такси через Bolt.',
        transitInfo: 'Батумский бульвар и пляж расположены прямо перед зданием.',
        airportTransit: 'До аэропорта Батуми 12 минут на такси (~15-20 лари).'
      });
    }

    if (property.id === 'prop-4' || property.slug.includes('kazbegi-cabin') || property.slug.includes('mountain-house')) {
      return applyStarterTranslations(property, {
        ...property,
        title: 'Шале в Казбеги',
        subtitle: 'Вид на Казбек и уютный альпийский домик',
        tagline: 'Кристальный горный воздух, дровяной камин и панорама Троицкой церкви в Гергети.',
        city: 'Степанцминда',
        country: 'Грузия',
        address: 'дорога в ущелье Гергети, 12',
        welcomeTitle: 'Добро пожаловать в Шале Казбеги!',
        welcomeGreeting: 'Отдохните среди величественных вершин Кавказа у живого камина и в кедровой сауне.',
        checkInTime: '15:00',
        checkOutTime: '11:00',
        doorKeypadCode: '7721#',
        parkingInstructions: 'Частный огороженный двор на дороге Гергети (помещается 3 внедорожника).',
        arrivalDirections: 'Сверните в переулок Гергети за мостом. Кедровые ворота с табличкой Stumari #12. Код 7721#.',
        wifiNetwork: 'Kazbegi_Peak_WiFi',
        wifiPassword: 'MountKazbek2026!'
      });
    }

    if (property.id === 'prop-5' || property.slug.includes('vake-garden')) {
      return applyStarterTranslations(property, {
        ...property,
        title: 'Резиденция в Ваке с садом',
        subtitle: 'Изысканные городские апартаменты с приватным зеленым патио',
        tagline: 'Зеленая элегантность и тишина в Ваке, рядом с парками, уютными кофейнями и винными барами.',
        city: 'Тбилиси',
        country: 'Грузия',
        address: 'ул. Ираклия Абашидзе, 12, кв. 6',
        welcomeTitle: 'Добро пожаловать в Дом с садом в Ваке!',
        welcomeGreeting: 'Отдохните в нашем уютном зеленом доме в самом респектабельном районе Тбилиси.',
        checkInTime: '15:00',
        checkOutTime: '11:00',
        doorKeypadCode: '5514#',
        parkingInstructions: 'Закрепленное подземное парковочное место #6 в цоколе здания.',
        arrivalDirections: 'Вход через лобби с улицы Абашидзе. Лифт на 2-й этаж, квартира 6 справа. Код 5514#.',
        wifiNetwork: 'VakeGarden_Ultra',
        wifiPassword: 'VakeGreen2026!'
      });
    }
  }

  return property;
}

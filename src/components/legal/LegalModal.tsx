import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LegalModalProps {
  type: 'terms' | 'privacy' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  const { language } = useApp();
  if (!type) return null;

  const content = {
    ka: {
      termsTitle: 'მომსახურების პირობები',
      privacyTitle: 'კონფიდენციალურობის პოლიტიკა & მონაცემთა დაცვა',
      closeBtn: 'დახურვა',
      terms: [
        {
          title: '1. პირობების მიღება',
          desc: 'Stumari-ს პლატფორმაზე ანგარიშის შექმნით ან გიდის გამოყენებით, მასპინძლები და სტუმრები ეთანხმებიან ამ პირობებს. Stumari უზრუნველყოფს პროგრამულ ინსტრუმენტებს მოკლევადიანი გაქირავების მასპინძლებისთვის ციფრული გზამკვლევების შესაქმნელად.'
        },
        {
          title: '2. მასპინძლის პასუხისმგებლობა',
          desc: 'მასპინძელი სრულად აგებს პასუხს მის გიდში მითითებული კარების კოდების, Wi-Fi პაროლების, სახლის წესებისა და ლოკალური რეკომენდაციების სიზუსტეზე.'
        },
        {
          title: '3. ინტელექტუალური საკუთრება',
          desc: 'Stumari-ს სავაჭრო ნიშნები, ლოგო და ინტერფეისის დიზაინი წარმოადგენს Stumari-ს საკუთრებას. მასპინძლის მიერ ატვირთული ფოტოები და ტექსტები რჩება მათ საკუთრებაში.'
        },
        {
          title: '4. ხელმისაწვდომობის გარანტია',
          desc: 'Stumari უზრუნველყოფს გიდების 99.9% უწყვეტ ხელმისაწვდომობას გლობალური CDN და ოფლაინ PWA ქეშირების მეშვეობით.'
        }
      ],
      privacy: [
        {
          title: '1. სტუმრის თვალთვალის გარეშე',
          desc: 'Stumari-ს გიდით მოსარგებლე სტუმრებს არასდროს მოეთხოვებათ ანგარიშის შექმნა, ავტორიზაცია ან აპლიკაციის ინსტალაცია. ჩვენ არ ვყიდით სტუმრის მონაცემებს და არ ვადევნებთ თვალს ქსელში.'
        },
        {
          title: '2. საძიებო სისტემებისგან დაცვა',
          desc: 'ყველა დინამიური სტუმრის გიდი (/g/:property-slug) მკაცრად იცავს noindex, nofollow რობოტების მეტა-ტეგებს. კარების კოდები და Wi-Fi პაროლები არასდროს ინდექსირდება Google-ში ან სხვა საძიებო სისტემებში.'
        },
        {
          title: '3. მასპინძლის მონაცემები',
          desc: 'ჩვენ ვინახავთ მხოლოდ მასპინძლის მინიმალურ მონაცემებს (სახელი, ელ.ფოსტა, ობიექტის გიდის შინაარსი). ყველა კომუნიკაცია დაცულია HTTPS / TLS 1.3 შიფრაციით.'
        },
        {
          title: '4. მონაცემთა პორტაბელურობა',
          desc: 'მასპინძლებს შეუძლიათ ნებისმიერ დროს გაიტანონ საკუთარი გიდის მონაცემები ან წაშალონ ანგარიში.'
        }
      ]
    },
    ru: {
      termsTitle: 'Условия использования сервиса',
      privacyTitle: 'Политика конфиденциальности и защита данных',
      closeBtn: 'Закрыть',
      terms: [
        {
          title: '1. Принятие условий',
          desc: 'Создавая аккаунт или просматривая путеводитель Stumari («Платформа»), хозяева и гости соглашаются с настоящими условиями. Stumari предоставляет программные инструменты для создания цифровых гидов и печатных QR-флаеров.'
        },
        {
          title: '2. Ответственность хозяина',
          desc: 'Хозяева несут полную ответственность за точность кодов от дверей, паролей Wi-Fi, инструкций к технике и локальных рекомендаций, опубликованных в их путеводителях.'
        },
        {
          title: '3. Интеллектуальная собственность',
          desc: 'Все товарные знаки, логотипы и дизайн интерфейса являются собственностью Stumari. Контент, загруженный хозяевами, остаётся их интеллектуальной собственностью.'
        },
        {
          title: '4. Доступность сервиса',
          desc: 'Stumari стремится к показателю доступности 99.9% для путеводителей гостей через глобально распределённые CDN-серверы и кеширование PWA.'
        }
      ],
      privacy: [
        {
          title: '1. Нулевое отслеживание гостей',
          desc: 'Гости, открывающие путеводитель Stumari, никогда не обязаны создавать аккаунт, входить в систему или скачивать приложение. Мы не продаём данные гостей и не отслеживаем их действия.'
        },
        {
          title: '2. Защита от индексации поисковиками',
          desc: 'Все динамические путеводители гостей (/g/:property-slug) строго соблюдают метатеги noindex, nofollow. Чувствительные данные (коды кейбоксов и пароли Wi-Fi) никогда не индексируются Google или Яндексом.'
        },
        {
          title: '3. Данные учётной записи хозяина',
          desc: 'Мы храним минимальный объём данных хозяев (имя, электронная почта, контент гида). Все соединения защищены шифрованием HTTPS / TLS 1.3.'
        },
        {
          title: '4. Удаление и перенос данных',
          desc: 'Хозяева могут в любой момент экспортировать данные своих путеводителей и удалить свои учётные записи.'
        }
      ]
    },
    en: {
      termsTitle: 'Terms of Service',
      privacyTitle: 'Privacy Policy & Guest Data',
      closeBtn: 'Close',
      terms: [
        {
          title: '1. Acceptance of Terms',
          desc: 'By creating an account or accessing Stumari ("Platform"), hosts and guests agree to these terms. Stumari provides software tools for short-term rental hosts to generate digital guidebooks and printable QR flyers.'
        },
        {
          title: '2. Host Responsibility',
          desc: 'Hosts are solely responsible for the accuracy of check-in codes, Wi-Fi passwords, house manual instructions, and local recommendations published on their guidebooks.'
        },
        {
          title: '3. Intellectual Property',
          desc: 'All trademarks, logos, and interface designs remain the property of Stumari. Content uploaded by hosts remains their property.'
        },
        {
          title: '4. Service Availability',
          desc: 'Stumari aims for 99.9% uptime for guest guidebooks via globally distributed CDN edge servers and offline PWA service workers.'
        }
      ],
      privacy: [
        {
          title: '1. Zero Guest Tracking & Privacy',
          desc: 'Guests accessing a Stumari guidebook are never required to create an account, log in, or install an application. We do not sell guest data or track individual guests across the web.'
        },
        {
          title: '2. Search Engine Indexing Protection',
          desc: 'All dynamic guest guidebooks (/g/:property-slug) strictly enforce noindex, nofollow robot meta tags. Sensitive host information such as lockbox codes and Wi-Fi credentials are never indexed by search engines.'
        },
        {
          title: '3. Host Account Data',
          desc: 'We store minimal host information (name, email, property guide content). All communications are encrypted in transit via HTTPS / TLS 1.3.'
        },
        {
          title: '4. Data Portability',
          desc: 'Hosts can export their guidebooks and delete their accounts at any time.'
        }
      ]
    }
  }[language] || {
    termsTitle: 'Terms of Service',
    privacyTitle: 'Privacy Policy & Guest Data',
    closeBtn: 'Close',
    terms: [],
    privacy: []
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-auto animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            {type === 'terms' ? (
              <FileText className="w-5 h-5 text-amber-600" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            )}
            <h2 className="font-serif text-xl font-bold text-stone-900">
              {type === 'terms' ? content.termsTitle : content.privacyTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 text-xs text-stone-600 space-y-4 max-h-[60vh] overflow-y-auto pr-2 leading-relaxed">
          {type === 'terms' ? (
            <>
              {content.terms.map((item, idx) => (
                <p key={idx}>
                  <strong>{item.title}:</strong> {item.desc}
                </p>
              ))}
            </>
          ) : (
            <>
              {content.privacy.map((item, idx) => (
                <p key={idx}>
                  <strong>{item.title}:</strong> {item.desc}
                </p>
              ))}
            </>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold"
          >
            {content.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export const COMPANY_INTRO = `Сервис базируется в городе Воронеж и начало свою работу в 2015 году. В его составе — специалисты с опытом от 15 лет в маркетинге. Мы сталкивались с нехваткой нужных инструментов в одном месте и постепенно разрабатывали отдельные модули; в 2021 году ранние наработки выделили в отдельный сервис Титло.`;

export const COMPANY_TAGLINE =
  "Наша компания — это люди в ней. Мы рады, что вы с нами и отдаёте силы на проекты компании!";

export type TimelineItem = {
  date: string;
  title: string;
  description: string;
  href: string;
};

export const COMPANY_TIMELINE: TimelineItem[] = [
  {
    date: "11 марта 2015",
    title: "2015 год — год основания компании",
    description: "История компании началась в 2015 году.",
    href: "/news/detail/god-osnovaniya-i-shtat-v-3-cheloveka/",
  },
  {
    date: "6 апреля 2016",
    title: "К команде присоединяется первый программист",
    description: "Через год после основания к нам присоединился первый программист.",
    href: "/news/detail/k-komande-prisoedinyaetsya-pervyy-programmist/",
  },
  {
    date: "1 января 2018",
    title: "Более 50 клиентов на SEO и 10+ проектов по контексту",
    description: "На начало 2018 года мы преодолели отметку в 50 клиентов.",
    href: "/news/detail/u-kompanii-bolee-50-klientov-na-seo-prodvizhenii-i-bolee-10-proektov-po-kontekstnoy-reklame/",
  },
  {
    date: "4 октября 2019",
    title: "Система учёта клиентов для внутренних нужд",
    description:
      "С ростом числа клиентов создали собственную систему учёта — готовые решения на рынке не устраивали.",
    href: "/news/detail/my-napisali-sistemu-ucheta-klientov-dlya-vnutrennikh-nuzhd/",
  },
  {
    date: "4 января 2020",
    title: "Более 70 клиентов, часть — с момента основания",
    description: "К 2020 году — более 70 компаний, многие с нами со дня основания.",
    href: "/news/detail/bolee-70-klientov-uzhe-sotrudnichayut-s-kompaniey-i-chast-iz-nikh-s-momenta-osnovaniya/",
  },
  {
    date: "22 июля 2021",
    title: "Средний срок сотрудничества превысил 3,5 года",
    description: "Средний срок сотрудничества с клиентами превысил 3,5 года, команда выросла вместе с числом проектов.",
    href: "/news/detail/sredniy-srok-sotrudnichestva-prevysil-3-5-goda-nas-uzhe-bolee-20-chelovek-v-komande/",
  },
  {
    date: "14 января 2022",
    title: "Собственная платформа для SEO — запуск помодульно",
    description: "Более 18 модулей доступны к работе, развитие продолжается.",
    href: "/news/detail/my-razrabatyvaem-sobstvennuyu-platformu-dlya-seo-spetsialistov-i-analitikov-i-zapuskaem-ee-pomodulno/",
  },
];

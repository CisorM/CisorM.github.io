// All copy for the site, in Spanish and English.
// Sources of truth: LinkedIn for dates and company names, the 2026 CV for the story.
// Rule from César: no specific technologies inside job descriptions (confidentiality);
// the general toolbox is fine.

export type Lang = 'es' | 'en';

export interface Strength {
  label: string;
  title: string;
  text: string;
}

export interface Job {
  role: string;
  company: string;
  dates: string;
  place: string;
  text: string;
}

// Images live in src/assets and are mapped by key in Portfolio.astro.
export type MediaKey = 'tripealo' | 'drpantalla' | 'drpantalla-sistema' | 'tridi' | 'ph26' | 'kungfu';
// A media item is an image, or a video in public/media with an image as its poster.
export type MediaItem = MediaKey | { video: string; poster: MediaKey };

export interface Project {
  name: string;
  tag: string;
  text: string;
  // One inner array per column. Several items in a column crossfade one after another.
  media: MediaItem[][];
  link?: { href: string; label: string };
  // Internal page where the project can be played; the image shows a play button on hover
  play?: { href: string; label: string };
}

export type ClientImage = 'casita-azul' | 'la-colmenita' | 'semillitas' | 'admiralty-tubes' | 'mobra' | 'chely-cleaning';

export interface ClientWork {
  name: string;
  tag: string;
  text: string;
  image: ClientImage;
  link?: string;
}

export interface Clients {
  label: string;
  title: string;
  intro: string;
  items: ClientWork[];
  privateTitle: string;
  privateCases: { tag: string; title: string; text: string; points: string[]; note: string }[];
}

export interface Copy {
  htmlLang: string;
  meta: { title: string; description: string };
  nav: { home: string; about: string; experience: string; projects: string; contact: string; otherLang: string; otherLangHref: string };
  // `greeting` is the small label above the headline. `title` is two lines on purpose:
  // each one is its own line on desktop and animates in on its own.
  hero: { greeting: string; title: [string, string]; subtitle: string; photoAlt: string };
  // CV download: PDFs live in public/ and are generated from cv/cv-es.html and cv/cv-en.html
  cv: { label: string; href: string; filename: string };
  about: {
    label: string;
    title: string;
    introTitle: string;
    intro: string;
    strengths: Strength[];
    toolboxTitle: string;
    toolboxText: string;
    contactTitle: string;
    contactText: string;
    contactCta: string;
  };
  experience: { label: string; title: string; jobs: Job[] };
  projects: { label: string; title: string; items: Project[] };
  clients: Clients;
  // Copy for the standalone arcade page (/arcade/ and /en/arcade/)
  arcade: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    intro: string;
    blocks: { title: string; items: string[] }[];
    controlsTitle: string;
    controls: { keys: string[]; action: string }[];
    play: string;
    back: string;
    exit: string;
    fullscreen: string;
    loading: string;
    touchNote: string;
  };
  education: { label: string; items: { school: string; degree: string; dates: string }[] };
  contact: { label: string; title: string; text: string };
  footer: string;
}

export const email = 'cmmh.developer@gmail.com';
export const social = {
  linkedin: 'https://www.linkedin.com/in/cesarmartinez-dev',
  github: 'https://github.com/CisorM',
};

// Logo and link per company in the experience list (same in both languages).
// Logos live in src/assets/logos. Companies without an entry show their initial.
export type CompanyLogo = 'tripealo' | 'drpantalla' | 'kiwi' | 'estela';
export const companies: Record<string, { logo?: CompanyLogo; link?: string }> = {
  Tripealo: { logo: 'tripealo', link: 'https://www.tripealo.app/' },
  'Doctor Pantalla': { logo: 'drpantalla' },
  'Kiwi Company': { logo: 'kiwi', link: 'https://www.linkedin.com/company/kiwicompany/' },
  'Estela Estudio Digital': { logo: 'estela', link: 'https://www.linkedin.com/company/estela-code/' },
};

export const toolbox = [
  'TypeScript',
  'React',
  'Next.js',
  'React Native',
  'Expo',
  'Node.js',
  'PostgreSQL',
  'Supabase',
  'Tailwind CSS',
  'Astro',
  'AWS',
  'Vercel',
  'Figma',
  'Claude Code',
];

export const copy: Record<Lang, Copy> = {
  es: {
    htmlLang: 'es',
    meta: {
      title: 'César Martínez · Full Stack Product Engineer',
      description:
        'Full Stack Product Engineer y cofundador de Tripealo. Construyo productos de punta a punta y resuelvo problemas reales junto a las personas que los usan.',
    },
    nav: {
      home: 'Inicio',
      about: 'Sobre mí',
      experience: 'Experiencia',
      projects: 'Proyectos',
      contact: 'Contacto',
      otherLang: 'EN',
      otherLangHref: '/en/',
    },
    cv: { label: 'Descargar CV', href: '/cv_es.pdf', filename: 'CV César Martínez.pdf' },
    hero: {
      greeting: '¡Hola, soy César!',
      title: ['Genero valor', 'resolviendo problemas reales'],
      subtitle:
        'Full Stack Product Engineer y cofundador de Tripealo. Me muevo entre el código, el negocio y las personas que usan lo que construyo.',
      photoAlt: 'César Martínez con la chaqueta de Tripealo y la credencial de CTO',
    },
    about: {
      label: 'Sobre mí',
      title: 'Lo que me hace diferente',
      introTitle: 'Un poco de mí',
      intro:
        'Soy de Barquisimeto, Venezuela. Me gusta entender bien un problema antes de escribir una línea de código, y que el resultado se note en el día a día de quien lo usa.',
      strengths: [
        {
          label: 'Ingeniería',
          title: 'Frontend y backend, sin cambiar de chip',
          text: 'En agencias y con clientes he llevado proyectos completos: desde la interfaz hasta la lógica y los datos que la sostienen.',
        },
        {
          label: 'Negocio',
          title: 'Lo que el código no enseña',
          text: 'En Doctor Pantalla, el negocio de mi familia, aprendí a responder por un negocio y a atender clientes. Disfruto hablar con la gente y resolver algo en concreto.',
        },
        {
          label: 'Producto',
          title: 'De una idea a algo vivo',
          text: 'Con Tripealo construí un producto desde cero y lo puse en manos de usuarios reales. Ahí se juntan lo técnico y lo que aprendí detrás del mostrador.',
        },
      ],
      toolboxTitle: 'Herramientas',
      toolboxText: 'Lo que uso a diario para construir.',
      contactTitle: '¿Hablamos?',
      contactText: 'Si tienes un problema interesante, me encantaría escucharlo.',
      contactCta: 'Escríbeme',
    },
    experience: {
      label: 'Experiencia',
      title: 'Dónde he aportado valor',
      jobs: [
        {
          role: 'Co-Founder & CTO',
          company: 'Tripealo',
          dates: 'may. 2026 – hoy',
          place: 'Barquisimeto',
          text: 'Lidero producto, arquitectura e infraestructura del marketplace de turismo local: web, app móvil, reservas, viajes a medida y pagos adaptados a Venezuela.',
        },
        {
          role: 'Propietario',
          company: 'Doctor Pantalla',
          dates: 'may. 2022 – hoy',
          place: 'Estado Lara',
          text: 'Digitalicé la operación de las dos sedes con un sistema propio de inventario, ventas, reparaciones y reportes. Con esas herramientas el equipo lleva el día a día y yo superviso con datos.',
        },
        {
          role: 'Desarrollador Full Stack',
          company: 'Kiwi Company',
          dates: 'ago. 2025 – oct. 2026',
          place: 'Remoto',
          text: 'Construí para un cliente del sector transporte una plataforma que integra su logística y sus finanzas, y propuse automatizar la carga de documentos con inteligencia artificial.',
        },
        {
          role: 'Desarrollador Frontend',
          company: 'Estela Estudio Digital',
          dates: 'nov. 2024 – may. 2025',
          place: 'Remoto (Chile)',
          text: 'Desarrollé sitios a medida para clientes de la agencia, con componentes reutilizables y mejoras de rendimiento de hasta un 40%.',
        },
        {
          role: 'Pasante Full Stack',
          company: 'Comercializadora e Importadora AB',
          dates: 'may. 2024 – jul. 2024',
          place: 'Barquisimeto',
          text: 'Creé el MVP de un sistema para Talento Humano, levantando los requerimientos directamente con el equipo.',
        },
      ],
    },
    projects: {
      label: 'Proyectos',
      title: 'Algunas cosas que he construido',
      items: [
        {
          name: 'Tripealo',
          tag: 'Startup · Cofundador',
          text: 'Marketplace de turismo local en Venezuela: como tener una agencia de viajes en tu bolsillo.',
          media: [['tripealo']],
          link: { href: 'https://tripealo.app', label: 'tripealo.app' },
        },
        {
          name: 'Doctor Pantalla',
          tag: 'Negocio familiar',
          text: 'Sistema interno y sitio web de una tienda de tecnología con dos sedes.',
          media: [['drpantalla-sistema', 'drpantalla']],
          link: { href: 'https://www.drpantalla.com', label: 'drpantalla.com' },
        },
        {
          name: 'Tridi',
          tag: 'Platanus Hack 26 · ft. Yummy',
          text: 'De un video humano a un robot humanoide simulado que aprende a moverse por imitación.',
          media: [['tridi'], ['ph26']],
          link: { href: 'https://tridi-alpha.vercel.app', label: 'tridi-alpha.vercel.app' },
        },
        {
          name: 'Kung Fu, No Hay Luz',
          tag: 'Platanus Hack 26 · Arcade',
          text: 'Beat ’em up venezolano para una cabina arcade real, con gráficos y sonido generados por código.',
          media: [['kungfu']],
          play: { href: '/arcade/', label: 'Jugar en el arcade' },
        },
      ],
    },
    clients: {
      label: 'Clientes',
      title: 'Trabajo freelance',
      intro: 'Sitios y sistemas que diseñé y desarrollé para negocios reales, de principio a fin.',
      items: [
        {
          name: 'Casita Azul',
          tag: 'Preescolar · Portland, EE. UU.',
          text: 'Sitio bilingüe con agenda de visitas, blog y Elena, una asistente virtual que responde a los padres.',
          image: 'casita-azul',
          link: 'https://www.casitaazulpdx.com/es',
        },
        {
          name: 'La Colmenita',
          tag: 'Guardería · Portland, EE. UU.',
          text: 'Sitio bilingüe con reserva de tours y los formularios de inscripción de los niños en línea.',
          image: 'la-colmenita',
          link: 'https://www.lacolmenitapdx.com/es',
        },
        {
          name: 'Semillitas',
          tag: 'Guardería · Portland, EE. UU.',
          text: 'Sitio bilingüe para una guardería de inmersión en español, con horarios, admisiones y galería.',
          image: 'semillitas',
          link: 'https://www.semillitaspdx.com/',
        },
        {
          name: 'Admiralty Tubes',
          tag: 'Proveedor industrial · EE. UU.',
          text: 'Sitio bilingüe para un proveedor industrial, con catálogo técnico y cotizaciones urgentes 24/7.',
          image: 'admiralty-tubes',
          link: 'https://www.admiraltytubes.com/',
        },
        {
          name: 'Chely Cleaning',
          tag: 'Servicios · Nashville, EE. UU.',
          text: 'Landing bilingüe enfocada en SEO para una empresa de limpieza residencial y comercial.',
          image: 'chely-cleaning',
        },
        {
          name: 'Mobra',
          tag: 'Servicios automotrices',
          text: 'Sitio para un servicio de detallado de autos, con servicios, testimonios y contacto.',
          image: 'mobra',
          link: 'https://mobra.vercel.app/',
        },
      ],
      privateTitle: 'Proyectos privados',
      privateCases: [
        {
          tag: 'Tech lead · Proyecto confidencial',
          title: 'Plataforma de comercio y pagos',
          text: 'Lidero un equipo de desarrollo de 3 personas y tomo funcionalidades de punta a punta, del backend a la interfaz, en una plataforma con tienda en línea y panel de administración.',
          points: [
            'Integraciones bancarias para procesar y conciliar pagos.',
            'Backoffice y e-commerce sobre una arquitectura en capas, con varios roles y permisos.',
            'Herramientas de soporte que permiten ver la cuenta tal como la ve el usuario, para resolver sus problemas sin pedirle su contraseña.',
          ],
          note: 'Por un acuerdo de confidencialidad no muestro el nombre de la empresa ni capturas.',
        },
        {
          tag: 'Kiwi Company · Proyecto privado',
        title: 'Plataforma de logística y finanzas',
        text: 'Para una empresa de transporte construí una sola plataforma donde conviven operaciones, flota, caja, chequeras, anticipos, órdenes de pago y contabilidad.',
        points: [
          'Pensada para servir a varias empresas desde una misma instalación.',
          'Lectura y escritura separadas, para que los reportes no frenaran la operación diaria.',
          'Carga de documentos con inteligencia artificial, sin transcribir comprobantes a mano.',
        ],
        note: 'Por confidencialidad no muestro capturas ni el nombre del cliente.',
        },
      ],
    },
    arcade: {
      metaTitle: 'Kung Fu, No Hay Luz · Arcade · César Martínez',
      metaDescription: 'Juega Kung Fu, No Hay Luz, el beat ’em up venezolano que César Martínez hizo para la máquina arcade de Platanus Hack 26.',
      title: 'kung fu, no hay luz',
      intro:
        'beat ’em up venezolano que hice para la máquina arcade de platanus hack 26 en caracas. todo, gráficos y sonido, está hecho con código.',
      blocks: [
        { title: 'Historia', items: ['se fue la luz en petare y la calle se llenó de malandros', 'elige al tuki, la sra. gladys o el pana y sobrevive a las oleadas'] },
        { title: 'Modo', items: ['1 o 2 jugadores en el mismo teclado'] },
      ],
      controlsTitle: 'Controles',
      controls: [
        { keys: ['Enter'], action: '1 jugador · pausa' },
        { keys: ['2'], action: '2 jugadores' },
        { keys: ['W', 'A', 'S', 'D'], action: 'mover (j1)' },
        { keys: ['C', 'V', 'B'], action: 'golpe · patada · ulti (j1)' },
        { keys: ['←', '↑', '↓', '→'], action: 'mover (j2)' },
        { keys: ['M', ',', '.'], action: 'golpe · patada · ulti (j2)' },
      ],
      play: 'Jugar',
      back: 'Volver al portfolio',
      exit: 'Salir',
      fullscreen: 'Pantalla completa',
      loading: 'Cargando…',
      touchNote: 'se juega con teclado: ábrelo desde un computador',
    },
    education: {
      label: 'Formación',
      items: [
        { school: 'Instituto Universitario Jesús Obrero (IUJO)', degree: 'TSU en Informática', dates: '2022 – 2025' },
        { school: 'AlegrIA IA Labs', degree: 'Seleccionado con Tripealo', dates: '2025' },
      ],
    },
    contact: {
      label: 'Contacto',
      title: 'Construyamos algo que valga la pena',
      text: 'Busco equipos donde pueda resolver problemas reales y donde se valore el impacto de lo que hacemos.',
    },
    footer: 'Hecho por César Martínez en Barquisimeto',
  },

  en: {
    htmlLang: 'en',
    meta: {
      title: 'César Martínez · Full Stack Product Engineer',
      description:
        'Full Stack Product Engineer and co-founder of Tripealo. I build products end to end and solve real problems alongside the people who use them.',
    },
    nav: {
      home: 'Home',
      about: 'About',
      experience: 'Experience',
      projects: 'Projects',
      contact: 'Contact',
      otherLang: 'ES',
      otherLangHref: '/',
    },
    cv: { label: 'Download resume', href: '/cv_en.pdf', filename: 'César Martínez Resume.pdf' },
    hero: {
      greeting: 'Hey, I’m César!',
      title: ['I create value', 'solving real problems'],
      subtitle:
        'Full Stack Product Engineer and co-founder of Tripealo. I move between code, business and the people who use what I build.',
      photoAlt: 'César Martínez wearing the Tripealo jacket and a CTO badge',
    },
    about: {
      label: 'About',
      title: 'What sets me apart',
      introTitle: 'A bit about me',
      intro:
        'I’m from Barquisimeto, Venezuela. I like to understand a problem well before writing a line of code, and to see the result in the daily life of the people who use it.',
      strengths: [
        {
          label: 'Engineering',
          title: 'Frontend and backend, same mindset',
          text: 'At agencies and with clients I have owned full projects: from the interface to the logic and data behind it.',
        },
        {
          label: 'Business',
          title: 'What code doesn’t teach you',
          text: 'At Doctor Pantalla, my family’s business, I learned to be accountable for a business and to serve customers. I enjoy talking to people and solving something concrete.',
        },
        {
          label: 'Product',
          title: 'From an idea to something alive',
          text: 'With Tripealo I built a product from scratch and put it in the hands of real users. That is where the technical side meets what I learned behind the counter.',
        },
      ],
      toolboxTitle: 'Toolbox',
      toolboxText: 'What I use every day to build.',
      contactTitle: 'Let’s talk',
      contactText: 'If you have an interesting problem, I would love to hear about it.',
      contactCta: 'Email me',
    },
    experience: {
      label: 'Experience',
      title: 'Where I have added value',
      jobs: [
        {
          role: 'Co-Founder & CTO',
          company: 'Tripealo',
          dates: 'May 2026 – present',
          place: 'Barquisimeto',
          text: 'I lead product, architecture and infrastructure for the local tourism marketplace: web, mobile app, bookings, custom trips and payments built for Venezuela.',
        },
        {
          role: 'Owner',
          company: 'Doctor Pantalla',
          dates: 'May 2022 – present',
          place: 'Lara, Venezuela',
          text: 'I digitized both locations with an in-house system for inventory, sales, repairs and reporting. With those tools the team runs the day to day and I oversee the business through data.',
        },
        {
          role: 'Full Stack Developer',
          company: 'Kiwi Company',
          dates: 'Aug 2025 – Oct 2026',
          place: 'Remote',
          text: 'Built a platform that brings together logistics and finance for a transport company, and proposed automating document intake with AI.',
        },
        {
          role: 'Frontend Developer',
          company: 'Estela Estudio Digital',
          dates: 'Nov 2024 – May 2025',
          place: 'Remote (Chile)',
          text: 'Built custom websites for the agency’s clients, with reusable components and performance improvements of up to 40%.',
        },
        {
          role: 'Full Stack Intern',
          company: 'Comercializadora e Importadora AB',
          dates: 'May 2024 – Jul 2024',
          place: 'Barquisimeto',
          text: 'Built the MVP of an HR system, gathering requirements directly with the team.',
        },
      ],
    },
    projects: {
      label: 'Projects',
      title: 'A few things I have built',
      items: [
        {
          name: 'Tripealo',
          tag: 'Startup · Co-founder',
          text: 'A local tourism marketplace in Venezuela: a travel agency in your pocket.',
          media: [['tripealo']],
          link: { href: 'https://tripealo.app', label: 'tripealo.app' },
        },
        {
          name: 'Doctor Pantalla',
          tag: 'Family business',
          text: 'Internal system and website for a two-location electronics store.',
          media: [['drpantalla-sistema', 'drpantalla']],
          link: { href: 'https://www.drpantalla.com', label: 'drpantalla.com' },
        },
        {
          name: 'Tridi',
          tag: 'Platanus Hack 26 · ft. Yummy',
          text: 'From human video to a simulated humanoid robot that learns to move by imitation.',
          media: [['tridi'], ['ph26']],
          link: { href: 'https://tridi-alpha.vercel.app', label: 'tridi-alpha.vercel.app' },
        },
        {
          name: 'Kung Fu, No Hay Luz',
          tag: 'Platanus Hack 26 · Arcade',
          text: 'A Venezuelan beat ’em up for a real arcade cabinet, with graphics and sound generated in code.',
          media: [['kungfu']],
          play: { href: '/en/arcade/', label: 'Play it in the arcade' },
        },
      ],
    },
    clients: {
      label: 'Clients',
      title: 'Freelance work',
      intro: 'Websites and systems I designed and built for real businesses, end to end.',
      items: [
        {
          name: 'Casita Azul',
          tag: 'Preschool · Portland, US',
          text: 'Bilingual site with tour scheduling, a blog and Elena, a virtual assistant that answers parents.',
          image: 'casita-azul',
          link: 'https://www.casitaazulpdx.com/',
        },
        {
          name: 'La Colmenita',
          tag: 'Childcare · Portland, US',
          text: 'Bilingual site with tour booking and the children’s enrollment forms online.',
          image: 'la-colmenita',
          link: 'https://www.lacolmenitapdx.com/',
        },
        {
          name: 'Semillitas',
          tag: 'Childcare · Portland, US',
          text: 'Bilingual site for a Spanish immersion childcare, with schedule, admissions and gallery.',
          image: 'semillitas',
          link: 'https://www.semillitaspdx.com/',
        },
        {
          name: 'Admiralty Tubes',
          tag: 'Industrial supplier · US',
          text: 'Bilingual site for an industrial supplier, with a technical catalog and 24/7 urgent quotes.',
          image: 'admiralty-tubes',
          link: 'https://www.admiraltytubes.com/',
        },
        {
          name: 'Chely Cleaning',
          tag: 'Services · Nashville, US',
          text: 'SEO-focused bilingual landing page for a residential and commercial cleaning company.',
          image: 'chely-cleaning',
        },
        {
          name: 'Mobra',
          tag: 'Car care',
          text: 'Website for a car detailing service, with services, testimonials and contact.',
          image: 'mobra',
          link: 'https://mobra.vercel.app/',
        },
      ],
      privateTitle: 'Private projects',
      privateCases: [
        {
          tag: 'Tech lead · Confidential project',
          title: 'Commerce and payments platform',
          text: 'I lead a 3-person development team and own features end to end, from backend to interface, on a platform with an online store and an admin panel.',
          points: [
            'Bank integrations to process and reconcile payments.',
            'Backoffice and e-commerce on a layered architecture, with multiple roles and permissions.',
            'Support tools to see an account exactly as the user sees it, to solve their issues without asking for their password.',
          ],
          note: 'Under a confidentiality agreement, no company name or screenshots.',
        },
        {
          tag: 'Kiwi Company · Private project',
        title: 'Logistics and finance platform',
        text: 'For a transport company I built a single platform for operations, fleet, cash, checkbooks, advances, payment orders and accounting.',
        points: [
          'Designed to serve several companies from a single installation.',
          'Reads and writes kept apart, so reporting would not slow down daily operations.',
          'AI document intake, with no manual transcription of receipts.',
        ],
        note: 'For confidentiality, no screenshots or client name.',
        },
      ],
    },
    arcade: {
      metaTitle: 'Kung Fu, No Hay Luz · Arcade · César Martínez',
      metaDescription: 'Play Kung Fu, No Hay Luz, the Venezuelan beat ’em up César Martínez built for the Platanus Hack 26 arcade machine.',
      title: 'kung fu, no hay luz',
      intro:
        'a venezuelan beat ’em up i built for the platanus hack 26 arcade machine in caracas. everything, graphics and sound, is made in code.',
      blocks: [
        { title: 'Story', items: ['the power went out in petare and the street filled with thugs', 'pick tuki, sra. gladys or el pana and survive the waves'] },
        { title: 'Mode', items: ['1 or 2 players on the same keyboard'] },
      ],
      controlsTitle: 'Controls',
      controls: [
        { keys: ['Enter'], action: '1 player · pause' },
        { keys: ['2'], action: '2 players' },
        { keys: ['W', 'A', 'S', 'D'], action: 'move (p1)' },
        { keys: ['C', 'V', 'B'], action: 'punch · kick · special (p1)' },
        { keys: ['←', '↑', '↓', '→'], action: 'move (p2)' },
        { keys: ['M', ',', '.'], action: 'punch · kick · special (p2)' },
      ],
      play: 'Play',
      back: 'Back to portfolio',
      exit: 'Exit',
      fullscreen: 'Fullscreen',
      loading: 'Loading…',
      touchNote: 'it is played with a keyboard: open it on a computer',
    },
    education: {
      label: 'Education',
      items: [
        { school: 'Instituto Universitario Jesús Obrero (IUJO)', degree: 'Associate degree in Computer Science', dates: '2022 – 2025' },
        { school: 'AlegrIA IA Labs', degree: 'Selected with Tripealo', dates: '2025' },
      ],
    },
    contact: {
      label: 'Contact',
      title: 'Let’s build something worth it',
      text: 'I am looking for teams where I can solve real problems and where the impact of our work is valued.',
    },
    footer: 'Made by César Martínez in Barquisimeto',
  },
};

import React, { useState, useMemo, useRef } from 'react';
import {
  Wrench,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Phone,
  MapPin,
  Clock,
  Star,
  Plus,
  Trash2,
  Ban,
  Check,
  X,
  UserCheck,
  Wallet,
  FileText,
  Users,
  Briefcase,
  Search,
  ChevronRight,
  MessageSquare,
  Camera,
  Sparkles,
  Award,
  ArrowRight,
  HelpCircle,
  LogIn,
  Menu
} from 'lucide-react';

// ============================================================================
// PRADINIAI DUOMENYS (MVP PROTOTIPAS)
// ============================================================================

const INITIAL_CATEGORIES = [
  'Smulkūs remonto darbai',
  'Santechnika',
  'Elektra',
  'Baldų surinkimas',
  'Namų tvarkymas',
  'Baldų valymas',
  'Buitinė technika'
];

const CATEGORY_DESCRIPTIONS = {
  'Smulkūs remonto darbai': 'Lentynų, paveikslų, karnizų tvirtinimas, durų vyrių reguliavimas, spynų keitimas ir kiti smulkūs buities darbai.',
  'Santechnika': 'Maišytuvų, kriauklių, sifonų, unitazo mechanizmų keitimas ar remontas, nuotėkių šalinimas, skalbyklių pajungimas.',
  'Elektra': 'Rozetių, jungiklių, šviestuvų ar LED juostų montavimas ir keitimas, saugiklių patikra bei smulkūs elektros gedimai.',
  'Baldų surinkimas': 'IKEA ir kitų gamintojų spintų, lovų, komodų, virtuvės ar biuro baldų surinkimas bei reguliavimas.',
  'Namų tvarkymas': 'Generalinis ar periodinis butų ir namų tvarkymas, paviršių valymas, tvarkos palaikymas po remonto.',
  'Baldų valymas': 'Sofų, čiužinių, fotelių ar kilimų giluminis valymas, dėmių ir kvapų šalinimas.',
  'Buitinė technika': 'Skalbyklių, indaplovių, orkaičių, kaitlenčių ar gartraukių pajungimas, patikra ir smulkus remontas.'
};

const CITIES = ['Vilnius', 'Kaunas', 'Klaipėda'];

const INITIAL_MASTERS = [
  {
    id: 'm-1',
    name: 'Tomas Kazlauskas',
    phone: '+370 612 34567',
    email: 'tomas.k@namupagalba.lt',
    invoiceDetails: {
      companyOrPersonName: 'Tomas Kazlauskas (IV pažyma nr. 849201)',
      codeOrVat: '305194827',
      address: 'Žirmūnų g. 48-12, Vilnius',
      invoiceEmail: 'tomas.k@namupagalba.lt'
    },
    city: 'Vilnius',
    categories: ['Baldų surinkimas', 'Smulkūs remonto darbai'],
    customCategory: '',
    bio: 'Daugiau nei 8 metus surenku IKEA ir kitų gamintojų baldus, kabinu lentynas, tvarkau duris ir atlieku smulkius remonto darbus Vilniuje. Dirbu švariai, punktualiai ir su savo įrankiais.',
    certified: true,
    verified: true,
    status: 'patvirtintas', // 'laukiantis_patvirtinimo' | 'patvirtintas' | 'uzblokuotas'
    balance: 18.0,
    rating: 4.9,
    avatarUrl: '',
    reviews: [
      {
        id: 'r-1',
        author: 'Aistė M.',
        rating: 5,
        comment: 'Labai greitai ir tvarkingai surinko didelę drabužių spintą bei pakabino veidrodį. Tikrai rekomenduoju.',
        date: '2026-11-12'
      },
      {
        id: 'r-2',
        author: 'Darius V.',
        rating: 5,
        comment: 'Atvyko sutartu laiku, sutvarkė durų spyną ir paliko švarią darbo vietą.',
        date: '2026-11-04'
      }
    ]
  },
  {
    id: 'm-2',
    name: 'Mantas Vasiliauskas',
    phone: '+370 688 99112',
    email: 'mantas.v@namupagalba.lt',
    city: 'Vilnius',
    categories: ['Santechnika', 'Buitinė technika'],
    customCategory: 'Vandens filtrų keitimas',
    bio: 'Santechnikas ir buitinės technikos meistras. Pakeičiu maišytuvus, sifonus, pajungiu skalbykles, indaploves, pašalinu smulkius pratekėjimus.',
    certified: true,
    verified: true,
    status: 'patvirtintas',
    balance: 24.0,
    rating: 4.8,
    avatarUrl: '',
    reviews: [
      {
        id: 'r-3',
        author: 'Rūta S.',
        rating: 5,
        comment: 'Per valandą pakeitė virtuvės maišytuvą ir pajungė indaplovę. Viskas veikia puikiai.',
        date: '2026-11-15'
      }
    ]
  },
  {
    id: 'm-3',
    name: 'Andrius Grigas',
    phone: '+370 655 44332',
    email: 'andrius.g@namupagalba.lt',
    city: 'Kaunas',
    categories: ['Elektra', 'Smulkūs remonto darbai'],
    customCategory: '',
    bio: 'Atlieku smulkius elektros ir remonto darbus Kaune: keičiu šviestuvus, rozetes, jungiklius, montuoju LED apšvietimą.',
    certified: true,
    verified: true,
    status: 'patvirtintas',
    balance: 9.0,
    rating: 4.7,
    avatarUrl: '',
    reviews: [
      {
        id: 'r-4',
        author: 'Lukas B.',
        rating: 5,
        comment: 'Saugiai ir greitai pakeitė tris rozetes bei pakabino šviestuvą svetainėje.',
        date: '2026-11-09'
      }
    ]
  },
  {
    id: 'm-4',
    name: 'Donatas Mockus',
    phone: '+370 611 77665',
    email: 'donatas.m@namupagalba.lt',
    city: 'Klaipėda',
    categories: ['Baldų surinkimas', 'Namų tvarkymas'],
    customCategory: '',
    bio: 'Patikimas meistras Klaipėdoje – baldų surinkimas, smulkūs ūkio darbai ir tvarkymas po remonto.',
    certified: false,
    verified: false,
    status: 'laukiantis_patvirtinimo',
    balance: 6.0,
    rating: 5.0,
    avatarUrl: '',
    reviews: [
      {
        id: 'r-5',
        author: 'Eglė K.',
        rating: 5,
        comment: 'Malonus bendravimas, kruopščiai surinko vaiko kambario baldus.',
        date: '2026-11-16'
      }
    ]
  }
];

const INITIAL_JOBS = [
  {
    id: 'j-101',
    title: 'Reikia pakeisti virtuvės maišytuvą ir pajungti sifoną',
    category: 'Santechnika',
    customCategoryText: '',
    city: 'Vilnius',
    district: 'Šeškinė',
    preferredTime: 'Šiandien po 17:00',
    description:
      'Senesnis maišytuvas pradėjo lašėti per snapą. Naują maišytuvą jau turiu, reikia atsakingai demontuoti senąjį, sumontuoti naują ir patikrinti, ar niekur neprateka.',
    clientName: 'Greta Jonaitienė',
    clientPhone: '+370 640 11223',
    photo1Name: 'maisyytuvas-virtuve.jpg',
    photo1Url: '',
    createdAt: 'Prieš 25 min.',
    status: 'laukiama_pasiulymu',
    selectedMasterId: null,
    offers: [
      {
        id: 'o-1',
        masterId: 'm-2',
        price: 38,
        eta: 'Šiandien, 18:00',
        note: 'Turiu visas reikiamas tarpines ir įrankius, galiu atvykti šįvakar.'
      }
    ]
  },
  {
    id: 'j-102',
    title: 'IKEA lovos ir dviejų spintelių surinkimas',
    category: 'Baldų surinkimas',
    customCategoryText: '',
    city: 'Vilnius',
    district: 'Pašilaičiai',
    preferredTime: 'Rytoj nuo 10:00',
    description:
      'Dėžės jau atneštos į kambarį. Reikia tvarkingai surinkti dvigulę lovą su patalynės dėže ir dvi naktines spinteles.',
    clientName: 'Paulius Petrauskas',
    clientPhone: '+370 671 55449',
    photo1Name: 'lova-detales.jpg',
    photo1Url: '',
    createdAt: 'Prieš 1 val.',
    status: 'laukiama_pasiulymu',
    selectedMasterId: null,
    offers: [
      {
        id: 'o-2',
        masterId: 'm-1',
        price: 55,
        eta: 'Rytoj, 10:30',
        note: 'Kasdien surenku IKEA baldus, užtruksiu apie 2–2.5 val.'
      }
    ]
  },
  {
    id: 'j-103',
    title: 'Šviestuvo pakabinimas ir dviejų rozetių keitimas',
    category: 'Elektra',
    customCategoryText: '',
    city: 'Kaunas',
    district: 'Centras',
    preferredTime: 'Šią savaitę darbo dienomis po 16:00',
    description:
      'Reikia pakabinti lubinį šviestuvą (lubos betoninės) ir pakeisti dvi susidėvėjusias rozetes kambaryje.',
    clientName: 'Monika Balčiūnaitė',
    clientPhone: '+370 623 90812',
    photo1Name: '',
    photo1Url: '',
    createdAt: 'Prieš 3 val.',
    status: 'pasirinktas_meistras',
    selectedMasterId: 'm-3',
    offers: [
      {
        id: 'o-3',
        masterId: 'm-3',
        price: 42,
        eta: 'Rytoj, 16:30',
        note: 'Turėsiu grąžtą betonui ir naujas rozetes.'
      }
    ]
  }
];

const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-1',
    masterId: 'm-2',
    masterName: 'Mantas Vasiliauskas',
    type: 'Balanso papildymas',
    amount: 15.0,
    invoiceRequested: true,
    date: '2026-11-20 14:22'
  },
  {
    id: 'tx-2',
    masterId: 'm-3',
    masterName: 'Andrius Grigas',
    type: 'Mokestis už patvirtintą užsakymą',
    amount: -3.0,
    invoiceRequested: false,
    date: '2026-11-20 11:05'
  },
  {
    id: 'tx-3',
    masterId: 'm-1',
    masterName: 'Tomas Kazlauskas',
    type: 'Balanso papildymas',
    amount: 15.0,
    invoiceRequested: true,
    date: '2026-11-19 17:40'
  }
];

const FAQ_ITEMS = [
  {
    q: 'Ar paslauga klientams tikrai kainuoja 0 €?',
    a: 'Taip, užklausos paskelbimas, meistrų pasiūlymų gavimas ir tinkamo meistro pasirinkimas klientams yra visiškai nemokami.'
  },
  {
    q: 'Kada atsiskleidžia kliento kontaktai?',
    a: 'Kliento vardas ir telefono numeris parodomi tik pasirinktam meistrui, kai klientas patvirtina jo pasiūlymą.'
  },
  {
    q: 'Kaip veikia „Tapti meistru“ registracija ir SMS patvirtinimas?',
    a: 'Užpildžius registracijos formą išsiunčiamas SMS patvirtinimo kodas. Patvirtinus kodą sukuriamas meistro profilis ir jis perduodamas administratoriui papildomam patvirtinimui.'
  }
];

const LEGAL_DOCS = {
  gdpr: {
    title: 'Privatumo politika ir BDAR (GDPR)',
    updated: 'Atnaujinta: 2026-11-01',
    sections: [
      {
        heading: '1. Duomenų valdytojas',
        body: 'Asmens duomenų valdytojas platformoje namupagalba.lt tvarko klientų, meistrų ir svetainės lankytojų pateiktus duomenis vadovaudamasis Europos Sąjungos Bendruoju duomenų apsaugos reglamentu (ES) 2016/679 (BDAR) ir Lietuvos Respublikos asmens duomenų teisinės apsaugos įstatymu.'
      },
      {
        heading: '2. Kokius duomenis renkame ir kodėl',
        body: 'Klientams: vardas, telefono numeris, miestas ir užsakymo aprašymas – naudojami tik tam, kad meistrai galėtų pateikti pasiūlymus, o pasirinktam meistrui būtų perduoti kontaktai darbui atlikti. Meistrams: vardas, pavardė, telefono numeris, el. paštas, miestas, paslaugų sritys ir sąskaitų faktūrų rekvizitai – naudojami paskyros administravimui, SMS patvirtinimui bei apskaitai.'
      },
      {
        heading: '3. Duomenų apsauga ir perdavimas',
        body: 'Kliento kontaktiniai duomenys (vardas ir telefono numeris) nėra viešai rodomi. Jie atveriami tik tam vienam meistrui, kurį pats klientas patvirtina savo užsakyme. Duomenys neperduodami tretiesiems asmenims rinkodaros tikslais.'
      },
      {
        heading: '4. Jūsų teisės pagal BDAR',
        body: 'Jūs turite teisę susipažinti su savo tvarkomais asmens duomenimis, reikalauti juos ištaisyti, ištrinti („teisė būti pamirštam“), apriboti jų tvarkymą arba pateikti skundą Valstybinei duomenų apsaugos inspekcijai (VDAI). Dėl duomenų ištrynimo kreipkitės per skiltį „Pagalba“.'
      }
    ]
  },
  terms: {
    title: 'Platformos naudojimosi taisyklės',
    updated: 'Atnaujinta: 2026-11-01',
    sections: [
      {
        heading: '1. Bendrosios nuostatos',
        body: 'namupagalba.lt yra informacinė tarpininkavimo platforma, sujungianti namų ūkio darbų užsakovus (klientus) ir nepriklausomus paslaugų teikėjus (meistrus) Vilniuje, Kaune ir Klaipėdoje.'
      },
      {
        heading: '2. Sąlygos klientams',
        body: 'Užklausų pateikimas, pasiūlymų peržiūra ir meistro pasirinkimas klientams yra visiškai nemokami. Klientas įsipareigoja pateikti teisingą informaciją apie darbą ir kontaktinį telefono numerį.'
      },
      {
        heading: '3. Sąlygos meistrams',
        body: 'Meistras atsako už savo teikiamų paslaugų kokybę, saugumą ir mokesčių (individualios veiklos, verslo liudijimo ar įmonės) apskaitą. Už kiekvieną kliento patvirtintą užsakymą iš meistro balanso nuskaitomas nustatytas platformos mokestis (pirmi du užsakymai – nemokami iš suteikto startinio kredito).'
      },
      {
        heading: '4. Atsakomybės ribojimas',
        body: 'Tiesioginę sutartį dėl darbų atlikimo, galutinės kainos ir garantijų sudaro klientas ir pasirinktas meistras. Platforma pasilieka teisę blokuoti taisykles pažeidžiančias paskyras.'
      }
    ]
  },
  cookies: {
    title: 'Slapukų (Cookies) politika',
    updated: 'Atnaujinta: 2026-11-01',
    sections: [
      {
        heading: '1. Kas yra slapukai?',
        body: 'Slapukai – tai nedideli tekstiniai failai, kuriuos jūsų naršyklė išsaugo įrenginyje, kad svetainė veiktų sklandžiai, prisimintų jūsų pasirinktą miestą, sesiją bei užtikrintų saugumą.'
      },
      {
        heading: '2. Naudojami slapukų tipai',
        body: 'Svetainėje naudojami būtinieji techniniai slapukai, reikalingi pagrindinėms funkcijoms (užklausos formos išsaugojimui, prisijungimo būsenai), bei analitiniai slapukai, padedantys gerinti svetainės veikimą.'
      },
      {
        heading: '3. Slapukų valdymas',
        body: 'Slapukus galite bet kada ištrinti arba užblokuoti savo interneto naršyklės nustatymuose.'
      }
    ]
  }
};

// ============================================================================
// PAGRINDINIS KOMPONENTAS
// ============================================================================

export default function App() {
  // --- PAGRINDINĖ NAVIGACIJA IR REŽIMAI ---
  // 'home' | 'client' | 'master' | 'admin'
  const [activeView, setActiveView] = useState('home');
  const [clientSubView, setClientSubView] = useState('form'); // 'form' | 'orders' | 'support'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLegalDoc, setActiveLegalDoc] = useState(null); // null | 'gdpr' | 'terms' | 'cookies'

  // --- DUOMENŲ BŪSENOS ---
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [masters, setMasters] = useState(INITIAL_MASTERS);
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  // --- PRANEŠIMŲ (TOAST) BŪSENA ---
  const [toast, setToast] = useState(null);

  // --- PRADINIO PUSLAPIO GREITOS PAIEŠKOS BŪSENA ---
  const [heroCity, setHeroCity] = useState('Vilnius');
  const [heroCategory, setHeroCategory] = useState('Smulkūs remonto darbai');

  // --- KLIENTO FORMINĖ BŪSENA ---
  const [jobForm, setJobForm] = useState({
    title: '',
    category: 'Smulkūs remonto darbai',
    customCategoryText: '',
    city: 'Vilnius',
    district: '',
    preferredTime: 'Kuo greičiau / Šiandien',
    description: '',
    clientName: '',
    clientPhone: '',
    photo1Name: '',
    photo1Url: ''
  });
  const [expandedCategoryDesc, setExpandedCategoryDesc] = useState(true);
  const [selectedCityFilter, setSelectedCityFilter] = useState('Visi');

  // --- KOMPAKTIŠKO MEISTRO PROFILIO MODALO BŪSENA (KLIENTUI) ---
  const [profileModalMasterId, setProfileModalMasterId] = useState(null);
  const [reviewModalJob, setReviewModalJob] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    author: '',
    rating: 5,
    comment: ''
  });

  // --- „TAPTI MEISTRU“ MODALAS IR SMS PATVIRTINIMO SRAUTAS ---
  const [becomeMasterOpen, setBecomeMasterOpen] = useState(false);
  const [smsStep, setSmsStep] = useState('form'); // 'form' | 'verify'
  const [generatedSmsCode, setGeneratedSmsCode] = useState('');
  const [enteredSmsCode, setEnteredSmsCode] = useState('');
  const [smsError, setSmsError] = useState('');
  const [masterRegForm, setMasterRegForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Vilnius',
    categories: ['Smulkūs remonto darbai'],
    customCategory: '',
    bio: '',
    certified: false
  });

  // --- MEISTRO KABINETO BŪSENOS ---
  const [currentMasterId, setCurrentMasterId] = useState('m-1');
  const [masterSubTab, setMasterSubTab] = useState('orders'); // 'orders' | 'profile' | 'balance' | 'invoices' | 'support'
  const [confirmDeleteMasterAccount, setConfirmDeleteMasterAccount] = useState(false);
  const [selectedMasterJobId, setSelectedMasterJobId] = useState(null);
  const [hiddenJobIdsByMaster, setHiddenJobIdsByMaster] = useState({});
  const [masterReviewsModalOpen, setMasterReviewsModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(15);
  const [requestInvoiceChecked, setRequestInvoiceChecked] = useState(true);
  const [offerDrafts, setOfferDrafts] = useState({});
  const [adminSupportForm, setAdminSupportForm] = useState({
    topic: 'Balansas / Sąskaita faktūra',
    message: ''
  });
  const [clientSupportForm, setClientSupportForm] = useState({
    senderName: '',
    senderContact: '',
    topic: 'Klausimas dėl užsakymo',
    message: ''
  });
  const [visitorSupportForm, setVisitorSupportForm] = useState({
    senderName: '',
    senderEmail: '',
    topic: 'Bendras klausimas',
    message: ''
  });
  const [supportMessages, setSupportMessages] = useState([
    {
      id: 'sup-1',
      senderRole: 'Meistras',
      senderId: 'm-1',
      senderName: 'Tomas Kazlauskas',
      senderContact: 'tomas.k@namupagalba.lt',
      topic: 'Balansas / Sąskaita faktūra',
      message: 'Sveiki, norėčiau pasitikslinti dėl sąskaitos faktūros už paskutinį balanso papildymą.',
      sentAt: '2026-11-20 15:10',
      adminReply: '',
      repliedAt: '',
      deliveryMethod: 'Į meistro paskyrą',
      isReadByAdmin: false
    },
    {
      id: 'sup-2',
      senderRole: 'Klientas',
      senderId: 'client-default',
      senderName: 'Greta Jonaitienė',
      senderContact: '+370 640 11223',
      topic: 'Klausimas dėl užsakymo',
      message: 'Sveiki, ar galiu pakeisti pageidaujamą meistro atvykimo laiką užsakyme?',
      sentAt: '2026-11-20 16:45',
      adminReply: '',
      repliedAt: '',
      deliveryMethod: 'Į kliento paskyrą',
      isReadByAdmin: false
    }
  ]);
  const [adminReplyDrafts, setAdminReplyDrafts] = useState({});

  // --- ADMINISTRATORIAUS BŪSENOS ---
  const [adminSubTab, setAdminSubTab] = useState('masters'); // 'masters' | 'balance' | 'jobs' | 'categories' | 'messages'
  const [adminMasterSearch, setAdminMasterSearch] = useState('');
  const [selectedAdminMasterId, setSelectedAdminMasterId] = useState(null);
  const [adminBalanceAdjustInput, setAdminBalanceAdjustInput] = useState('15');
  const [newCategoryName, setNewCategoryName] = useState('');

  // --- REFS IR PAGALBINĖS FUNKCIJOS ---
  const howItWorksRef = useRef(null);
  const catalogSectionRef = useRef(null);
  const faqSectionRef = useRef(null);
  const clientOrdersSectionRef = useRef(null);

  const notify = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev && prev.message === message ? null : prev));
    }, 3500);
  };

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const goToClientForm = (city, category) => {
    setJobForm((prev) => ({
      ...prev,
      city: city || prev.city,
      category: category || prev.category
    }));
    setClientSubView('form');
    setActiveView('client');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToClientOrders = () => {
    setClientSubView('orders');
    setActiveView('client');
    setSelectedCityFilter('Visi');
    setMobileMenuOpen(false);
    window.requestAnimationFrame(() => {
      if (clientOrdersSectionRef.current) {
        clientOrdersSectionRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  };

  const handleNavSectionClick = (section) => {
    setMobileMenuOpen(false);
    if (section === 'services' || section === 'how') {
      if (activeView !== 'home') {
        setActiveView('home');
        setTimeout(() => scrollToSection(howItWorksRef), 60);
      } else {
        scrollToSection(howItWorksRef);
      }
    } else if (section === 'catalog') {
      if (activeView !== 'home') {
        setActiveView('home');
        setTimeout(() => scrollToSection(catalogSectionRef), 60);
      } else {
        scrollToSection(catalogSectionRef);
      }
    } else if (section === 'faq') {
      if (activeView !== 'home') {
        setActiveView('home');
        setTimeout(() => scrollToSection(faqSectionRef), 60);
      } else {
        scrollToSection(faqSectionRef);
      }
    }
  };

  // ==========================================================================
  // IŠVESTINIAI DUOMENYS (MEMOIZED)
  // ==========================================================================

  const currentMaster = useMemo(
    () => masters.find((m) => m.id === currentMasterId) || masters[0] || null,
    [masters, currentMasterId]
  );

  const profileModalMaster = useMemo(
    () => masters.find((m) => m.id === profileModalMasterId) || null,
    [masters, profileModalMasterId]
  );

  const selectedAdminMaster = useMemo(
    () => masters.find((m) => m.id === selectedAdminMasterId) || null,
    [masters, selectedAdminMasterId]
  );

  const selectedMasterJob = useMemo(
    () => jobs.find((j) => j.id === selectedMasterJobId) || null,
    [jobs, selectedMasterJobId]
  );

  const pendingApprovalMasters = useMemo(
    () => masters.filter((m) => m.status === 'laukiantis_patvirtinimo'),
    [masters]
  );

  const unreadSupportCount = useMemo(
    () => supportMessages.filter((msg) => !msg.isReadByAdmin).length,
    [supportMessages]
  );

  const filteredMastersForAdmin = useMemo(() => {
    const q = adminMasterSearch.trim().toLowerCase();
    if (!q) return masters;
    return masters.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q) ||
        m.categories.some((c) => c.toLowerCase().includes(q)) ||
        (m.customCategory && m.customCategory.toLowerCase().includes(q))
    );
  }, [masters, adminMasterSearch]);

  const filteredClientJobs = useMemo(() => {
    if (selectedCityFilter === 'Visi') return jobs;
    return jobs.filter((j) => j.city === selectedCityFilter);
  }, [jobs, selectedCityFilter]);

  const newestThreeJobs = useMemo(() => jobs.slice(0, 3), [jobs]);

  const totalPlatformBalance = useMemo(
    () => masters.reduce((acc, m) => acc + Number(m.balance || 0), 0),
    [masters]
  );

  const totalEarnedRevenue = useMemo(
    () =>
      transactions.reduce((acc, tx) => {
        const amt = Number(tx.amount || 0);
        if (tx.type === 'Balanso papildymas' && amt > 0) {
          return acc + amt;
        }
        return acc;
      }, 0),
    [transactions]
  );

  // ==========================================================================
  // KLIENTO UŽKLAUSOS IR MEISTRO PASIRINKIMO FUNKCIJOS
  // ==========================================================================

  const handleJobPhoto1Change = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setJobForm((prev) => ({
      ...prev,
      photo1Name: file.name,
      photo1Url: url
    }));
  };

  const handleRemoveJobPhoto1 = () => {
    setJobForm((prev) => ({
      ...prev,
      photo1Name: '',
      photo1Url: ''
    }));
  };

  const handleCreateJob = (e) => {
    e.preventDefault();
    if (!jobForm.title.trim() || !jobForm.description.trim() || !jobForm.clientPhone.trim()) {
      notify('Užpildykite darbo pavadinimą, aprašymą ir telefono numerį.', 'error');
      return;
    }

    const newJob = {
      id: `j-${Date.now()}`,
      title: jobForm.title.trim(),
      category: jobForm.category,
      customCategoryText:
        jobForm.category === 'Kita' ? jobForm.customCategoryText.trim() : '',
      city: jobForm.city,
      district: jobForm.district.trim(),
      preferredTime: jobForm.preferredTime,
      description: jobForm.description.trim(),
      clientName: jobForm.clientName.trim() || 'Klientas',
      clientPhone: jobForm.clientPhone.trim(),
      photo1Name: jobForm.photo1Name || '',
      photo1Url: jobForm.photo1Url || '',
      createdAt: 'Ką tik',
      status: 'laukiama_pasiulymu',
      selectedMasterId: null,
      offers: []
    };

    setJobs((prev) => [newJob, ...prev]);
    setJobForm((prev) => ({
      ...prev,
      title: '',
      district: '',
      description: '',
      customCategoryText: '',
      photo1Name: '',
      photo1Url: ''
    }));
    setClientSubView('orders');
    notify('Užklausa paskelbta! Netrukus gausite meistrų pasiūlymus.');

    window.requestAnimationFrame(() => {
      if (clientOrdersSectionRef.current) {
        clientOrdersSectionRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  };

  const handleSelectMasterForJob = (jobId, offer) => {
    const master = masters.find((m) => m.id === offer.masterId);
    if (!master) return;

    const fee = 3.0;
    const currentBal = Number(master.balance || 0);
    const nextBal = Math.max(0, Number((currentBal - fee).toFixed(2)));

    setMasters((prev) =>
      prev.map((m) => (m.id === master.id ? { ...m, balance: nextBal } : m))
    );

    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              status: 'pasirinktas_meistras',
              selectedMasterId: master.id
            }
          : j
      )
    );

    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        masterId: master.id,
        masterName: master.name,
        type: 'Mokestis už pasirinkimą (-3 €)',
        amount: -fee,
        invoiceRequested: false,
        date: new Date().toISOString().slice(0, 16).replace('T', ' ')
      },
      ...prev
    ]);

    notify(`Pasirinkote meistrą ${master.name}. Jo kontaktai atverti.`);
  };

  const openMasterProfileModal = (masterId) => {
    setProfileModalMasterId(masterId);
  };

  const openOrderReviewModal = (job, masterId) => {
    setReviewModalJob({
      jobId: job.id,
      jobTitle: job.title,
      masterId
    });
    setReviewForm({
      author: job.clientName && job.clientName !== 'Klientas' ? job.clientName : '',
      rating: 5,
      comment: ''
    });
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    const targetMasterId = reviewModalJob ? reviewModalJob.masterId : null;
    if (!targetMasterId) return;
    if (!reviewForm.author.trim() || !reviewForm.comment.trim()) {
      notify('Įrašykite savo vardą ir atsiliepimo tekstą.', 'error');
      return;
    }

    const newReview = {
      id: `r-${Date.now()}`,
      author: reviewForm.author.trim(),
      rating: Number(reviewForm.rating),
      comment: reviewForm.comment.trim(),
      date: new Date().toISOString().slice(0, 10)
    };

    setMasters((prev) =>
      prev.map((m) => {
        if (m.id !== targetMasterId) return m;
        const updatedReviews = [newReview, ...(m.reviews || [])];
        const avg =
          updatedReviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) /
          updatedReviews.length;
        return {
          ...m,
          reviews: updatedReviews,
          rating: Number(avg.toFixed(1))
        };
      })
    );

    if (reviewModalJob && reviewModalJob.jobId) {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === reviewModalJob.jobId ? { ...j, reviewSubmitted: true } : j
        )
      );
    }

    setReviewModalJob(null);
    setReviewForm({ author: '', rating: 5, comment: '' });
    notify('Atsiliepimas sėkmingai pridėtas!');
  };

  // ==========================================================================
  // „TAPTI MEISTRU“ + SMS KODO PATVIRTINIMAS
  // ==========================================================================

  const openBecomeMasterModal = () => {
    setMasterRegForm({
      name: '',
      phone: '',
      email: '',
      invoiceDetails: {
        companyOrPersonName: '',
        codeOrVat: '',
        address: '',
        invoiceEmail: ''
      },
      city: 'Vilnius',
      categories: ['Smulkūs remonto darbai'],
      customCategory: '',
      bio: '',
      certified: false
    });
    setSmsStep('form');
    setGeneratedSmsCode('');
    setEnteredSmsCode('');
    setSmsError('');
    setBecomeMasterOpen(true);
    setMobileMenuOpen(false);
  };

  const toggleRegMasterCategory = (cat) => {
    setMasterRegForm((prev) => {
      const exists = prev.categories.includes(cat);
      const nextCats = exists
        ? prev.categories.filter((item) => item !== cat)
        : [...prev.categories, cat];
      return {
        ...prev,
        categories: nextCats.length > 0 ? nextCats : ['Smulkūs remonto darbai']
      };
    });
  };

  const handleRequestSmsCode = (e) => {
    e.preventDefault();
    if (!masterRegForm.name.trim() || !masterRegForm.phone.trim()) {
      setSmsError('Įveskite vardą, pavardę ir telefono numerį.');
      return;
    }
    const code = String(Math.floor(1000 + Math.random() * 9000));
    setGeneratedSmsCode(code);
    setEnteredSmsCode('');
    setSmsError('');
    setSmsStep('verify');
    notify(`SMS patvirtinimo kodas išsiųstas į ${masterRegForm.phone.trim()}`);
  };

  const completeMasterRegistration = () => {
    const newMasterId = `m-${Date.now()}`;
    const createdMaster = {
      id: newMasterId,
      name: masterRegForm.name.trim(),
      phone: masterRegForm.phone.trim(),
      email: masterRegForm.email.trim(),
      invoiceDetails: {
        companyOrPersonName: masterRegForm.name.trim(),
        codeOrVat: '',
        address: '',
        invoiceEmail: masterRegForm.email.trim()
      },
      city: masterRegForm.city,
      categories: masterRegForm.categories,
      customCategory: masterRegForm.customCategory.trim(),
      bio:
        masterRegForm.bio.trim() ||
        'Naujas meistras platformoje namupagalba.lt. Atlieku darbus kokybiškai ir atsakingai.',
      certified: Boolean(masterRegForm.certified),
      verified: false,
      status: 'laukiantis_patvirtinimo',
      balance: 6.0,
      rating: 5.0,
      avatarUrl: '',
      reviews: []
    };

    setMasters((prev) => [createdMaster, ...prev]);
    setCurrentMasterId(newMasterId);
    setMasterSubTab('profile');
    setBecomeMasterOpen(false);
    setActiveView('master');
    notify(
      'SMS kodas patvirtintas! Meistro anketa pateikta administratoriui galutiniam patvirtinimui.'
    );
  };

  const handleVerifySmsCode = (e) => {
    e.preventDefault();
    if (enteredSmsCode.trim() !== generatedSmsCode) {
      setSmsError('Neteisingas SMS kodas. Patikrinkite kodą arba paspauskite greito patvirtinimo mygtuką.');
      return;
    }
    completeMasterRegistration();
  };

  // ==========================================================================
  // MEISTRO KABINETO VEIKSMAI
  // ==========================================================================

  const handleMasterAvatarUpload = (e) => {
    if (!currentMaster) return;
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMasters((prev) =>
      prev.map((m) => (m.id === currentMaster.id ? { ...m, avatarUrl: url } : m))
    );
    notify('Profilio nuotrauka atnaujinta.');
  };

  const handleRemoveMasterAvatar = () => {
    if (!currentMaster) return;
    setMasters((prev) =>
      prev.map((m) => (m.id === currentMaster.id ? { ...m, avatarUrl: '' } : m))
    );
    notify('Profilio nuotrauka pašalinta.');
  };

  const toggleCurrentMasterCategory = (cat) => {
    if (!currentMaster) return;
    setMasters((prev) =>
      prev.map((m) => {
        if (m.id !== currentMaster.id) return m;
        const exists = m.categories.includes(cat);
        const nextCats = exists
          ? m.categories.filter((c) => c !== cat)
          : [...m.categories, cat];
        return {
          ...m,
          categories: nextCats.length > 0 ? nextCats : ['Smulkūs remonto darbai']
        };
      })
    );
  };

  const handleUpdateCurrentMasterField = (field, value) => {
    if (!currentMaster) return;
    setMasters((prev) =>
      prev.map((m) => (m.id === currentMaster.id ? { ...m, [field]: value } : m))
    );
  };

  const handleUpdateCurrentMasterInvoiceField = (field, value) => {
    if (!currentMaster) return;
    setMasters((prev) =>
      prev.map((m) =>
        m.id === currentMaster.id
          ? {
              ...m,
              invoiceDetails: {
                ...(m.invoiceDetails || {}),
                [field]: value
              }
            }
          : m
      )
    );
  };

  const handleSaveMasterProfile = (e) => {
    e.preventDefault();
    notify('Meistro profilio informacija išsaugota.');
  };

  const handleDeleteOwnMasterAccount = () => {
    if (!currentMaster) return;
    const targetId = currentMaster.id;
    const targetName = currentMaster.name;
    const remainingMasters = masters.filter((m) => m.id !== targetId);

    setMasters(remainingMasters);
    setJobs((prev) =>
      prev.map((j) => ({
        ...j,
        selectedMasterId: j.selectedMasterId === targetId ? null : j.selectedMasterId,
        status: j.selectedMasterId === targetId ? 'laukiama_pasiulymu' : j.status,
        offers: j.offers.filter((o) => o.masterId !== targetId)
      }))
    );
    setConfirmDeleteMasterAccount(false);
    setSelectedMasterJobId(null);

    if (remainingMasters.length > 0) {
      setCurrentMasterId(remainingMasters[0].id);
      notify(`Meistro paskyra „${targetName}“ ištrinta.`);
    } else {
      setCurrentMasterId('');
      setActiveView('home');
      notify(`Meistro paskyra „${targetName}“ ištrinta. Grįžote į pagrindinį puslapį.`);
    }
  };

  const handleHideJobForMaster = (e, jobId) => {
    e.stopPropagation();
    if (!currentMaster) return;
    setHiddenJobIdsByMaster((prev) => {
      const existing = prev[currentMaster.id] || [];
      if (existing.includes(jobId)) return prev;
      return {
        ...prev,
        [currentMaster.id]: [...existing, jobId]
      };
    });
    if (selectedMasterJobId === jobId) {
      setSelectedMasterJobId(null);
    }
    notify('Užsakymas paslėptas iš jūsų sąrašo.');
  };

  const handleRestoreHiddenJobsForMaster = () => {
    if (!currentMaster) return;
    setHiddenJobIdsByMaster((prev) => ({
      ...prev,
      [currentMaster.id]: []
    }));
    notify('Paslėpti užsakymai atkurti.');
  };

  const handleMasterTopUp = (e) => {
    e.preventDefault();
    if (!currentMaster) return;
    const amount = Number(topUpAmount);
    if (!amount || amount <= 0) {
      notify('Įveskite teigiamą sumą eurais.', 'error');
      return;
    }

    const nowStamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const targetEmail =
      (currentMaster.invoiceDetails && currentMaster.invoiceDetails.invoiceEmail) ||
      currentMaster.email ||
      'nežinomas paštas';
    const invoiceNumber = `NP-${new Date().getFullYear()}-${String(
      Math.floor(1000 + Math.random() * 9000)
    )}`;

    setMasters((prev) =>
      prev.map((m) =>
        m.id === currentMaster.id
          ? { ...m, balance: Number((m.balance + amount).toFixed(2)) }
          : m
      )
    );

    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        masterId: currentMaster.id,
        masterName: currentMaster.name,
        type: 'Balanso papildymas',
        amount,
        invoiceRequested: Boolean(requestInvoiceChecked),
        invoiceNumber: requestInvoiceChecked ? invoiceNumber : null,
        invoiceSentTo: requestInvoiceChecked ? targetEmail : null,
        invoiceDetailsSnapshot: requestInvoiceChecked
          ? {
              companyOrPersonName:
                (currentMaster.invoiceDetails &&
                  currentMaster.invoiceDetails.companyOrPersonName) ||
                currentMaster.name,
              codeOrVat:
                (currentMaster.invoiceDetails && currentMaster.invoiceDetails.codeOrVat) || '',
              address:
                (currentMaster.invoiceDetails && currentMaster.invoiceDetails.address) || '',
              invoiceEmail: targetEmail
            }
          : null,
        date: nowStamp
      },
      ...prev
    ]);

    if (requestInvoiceChecked) {
      notify(
        `Balansas papildytas +${amount.toFixed(2)} €. Sąskaita faktūra ${invoiceNumber} automatiškai išrašyta ir išsiųsta į ${targetEmail}!`
      );
    } else {
      notify(`Balansas papildytas +${amount.toFixed(2)} €.`);
    }
  };

  const handleSubmitMasterOffer = (e, jobId) => {
    e.preventDefault();
    if (!currentMaster) return;
    if (currentMaster.status === 'uzblokuotas') {
      notify('Jūsų paskyra užblokuota.', 'error');
      return;
    }

    const draft = offerDrafts[jobId] || { price: '40', eta: 'Šiandien', note: '' };
    const priceNum = Number(draft.price);
    if (!priceNum || priceNum <= 0) {
      notify('Nurodykite kainą eurais.', 'error');
      return;
    }

    const newOffer = {
      id: `o-${Date.now()}`,
      masterId: currentMaster.id,
      price: priceNum,
      eta: draft.eta.trim() || 'Šiandien',
      note: draft.note.trim() || 'Galiu atvykti ir sutvarkyti.'
    };

    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, offers: [...j.offers, newOffer] } : j))
    );

    setOfferDrafts((prev) => ({
      ...prev,
      [jobId]: { price: '40', eta: 'Šiandien', note: '' }
    }));

    notify('Pasiūlymas klientui išsiųstas!');
  };

  const handleSendMessageToAdmin = (e) => {
    e.preventDefault();
    if (!currentMaster) return;
    if (!adminSupportForm.message.trim()) {
      notify('Įrašykite žinutę administratoriui.', 'error');
      return;
    }

    const newMsg = {
      id: `sup-${Date.now()}`,
      senderRole: 'Meistras',
      senderId: currentMaster.id,
      senderName: currentMaster.name,
      senderContact: currentMaster.email || currentMaster.phone,
      topic: adminSupportForm.topic,
      message: adminSupportForm.message.trim(),
      sentAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      adminReply: '',
      repliedAt: '',
      deliveryMethod: 'Į meistro paskyrą',
      isReadByAdmin: false
    };

    setSupportMessages((prev) => [newMsg, ...prev]);
    setAdminSupportForm((prev) => ({ ...prev, message: '' }));
    notify('Žinutė sėkmingai išsiųsta administratoriui!');
  };

  const handleSendClientSupportMessage = (e) => {
    e.preventDefault();
    if (!clientSupportForm.message.trim()) {
      notify('Įrašykite žinutę administratoriui.', 'error');
      return;
    }

    const newMsg = {
      id: `sup-${Date.now()}`,
      senderRole: 'Klientas',
      senderId: 'client-default',
      senderName: clientSupportForm.senderName.trim() || jobForm.clientName.trim() || 'Klientas',
      senderContact: clientSupportForm.senderContact.trim() || jobForm.clientPhone.trim() || 'Kliento paskyra',
      topic: clientSupportForm.topic,
      message: clientSupportForm.message.trim(),
      sentAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      adminReply: '',
      repliedAt: '',
      deliveryMethod: 'Į kliento paskyrą',
      isReadByAdmin: false
    };

    setSupportMessages((prev) => [newMsg, ...prev]);
    setClientSupportForm((prev) => ({ ...prev, message: '' }));
    notify('Žinutė išsiųsta administratoriui! Atsakymą matysite čia.');
  };

  const handleSendVisitorSupportMessage = (e) => {
    e.preventDefault();
    if (!visitorSupportForm.senderEmail.trim() || !visitorSupportForm.message.trim()) {
      notify('Įveskite savo el. pašto adresą ir žinutę.', 'error');
      return;
    }

    const newMsg = {
      id: `sup-${Date.now()}`,
      senderRole: 'Lankytojas',
      senderId: `visitor-${Date.now()}`,
      senderName: visitorSupportForm.senderName.trim() || 'Svetainės lankytojas',
      senderContact: visitorSupportForm.senderEmail.trim(),
      topic: visitorSupportForm.topic,
      message: visitorSupportForm.message.trim(),
      sentAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      adminReply: '',
      repliedAt: '',
      deliveryMethod: `El. paštu (${visitorSupportForm.senderEmail.trim()})`,
      isReadByAdmin: false
    };

    setSupportMessages((prev) => [newMsg, ...prev]);
    setVisitorSupportForm({
      senderName: '',
      senderEmail: '',
      topic: 'Bendras klausimas',
      message: ''
    });
    notify(`Žinutė išsiųsta administratoriui! Atsakymas bus atsiųstas į ${newMsg.senderContact}.`);
  };

  const handleAdminReplyToSupport = (e, msgId) => {
    e.preventDefault();
    const replyText = (adminReplyDrafts[msgId] || '').trim();
    if (!replyText) {
      notify('Įrašykite atsakymo tekstą.', 'error');
      return;
    }

    const target = supportMessages.find((m) => m.id === msgId);
    const nowStr = new Date().toISOString().slice(0, 16).replace('T', ' ');

    setSupportMessages((prev) =>
      prev.map((m) =>
        m.id === msgId
          ? {
              ...m,
              adminReply: replyText,
              repliedAt: nowStr,
              isReadByAdmin: true
            }
          : m
      )
    );

    setAdminReplyDrafts((prev) => ({ ...prev, [msgId]: '' }));

    if (target && target.senderRole === 'Lankytojas') {
      notify(`Atsakymas lankytojui išsiųstas el. paštu į ${target.senderContact}!`);
    } else if (target) {
      notify(`Atsakymas išsiųstas į ${target.senderRole.toLowerCase()} paskyrą (${target.senderName})!`);
    } else {
      notify('Atsakymas išsiųstas!');
    }
  };

  const handleAdminDeleteSupportMessage = (msgId) => {
    setSupportMessages((prev) => prev.filter((m) => m.id !== msgId));
    notify('Žinutė pašalinta.');
  };

  // ==========================================================================
  // ADMINISTRATORIAUS VEIKSMAI: PATVIRTINIMAS, BLOKAVIMAS, ŠALINIMAS, BALANSAS, ATSILIEPIMAI
  // ==========================================================================

  const handleApproveMaster = (masterId) => {
    setMasters((prev) =>
      prev.map((m) =>
        m.id === masterId ? { ...m, status: 'patvirtintas', verified: true } : m
      )
    );
    notify('Meistras papildomai patvirtintas ir aktyvuotas!');
  };

  const handleToggleBlockMaster = (masterId) => {
    setMasters((prev) =>
      prev.map((m) => {
        if (m.id !== masterId) return m;
        const nextBlocked = m.status !== 'uzblokuotas';
        notify(nextBlocked ? `Meistras ${m.name} užblokuotas.` : `Meistras ${m.name} atblokuotas.`);
        return {
          ...m,
          status: nextBlocked ? 'uzblokuotas' : 'patvirtintas'
        };
      })
    );
  };

  const handleDeleteMaster = (masterId) => {
    const target = masters.find((m) => m.id === masterId);
    setMasters((prev) => prev.filter((m) => m.id !== masterId));
    setJobs((prev) =>
      prev.map((j) => ({
        ...j,
        selectedMasterId: j.selectedMasterId === masterId ? null : j.selectedMasterId,
        status: j.selectedMasterId === masterId ? 'laukiama_pasiulymu' : j.status,
        offers: j.offers.filter((o) => o.masterId !== masterId)
      }))
    );
    if (selectedAdminMasterId === masterId) {
      setSelectedAdminMasterId(null);
    }
    if (profileModalMasterId === masterId) {
      setProfileModalMasterId(null);
    }
    notify(`Meistras ${target ? target.name : ''} pašalintas iš sistemos.`);
  };

  const handleAdminAdjustBalance = (masterId, deltaAmount) => {
    const delta = Number(deltaAmount);
    if (Number.isNaN(delta) || delta === 0) {
      notify('Įveskite sumą (pvz. 15 arba -5).', 'error');
      return;
    }

    const master = masters.find((m) => m.id === masterId);
    if (!master) return;

    const updatedBalance = Math.max(0, Number((master.balance + delta).toFixed(2)));
    setMasters((prev) =>
      prev.map((m) => (m.id === masterId ? { ...m, balance: updatedBalance } : m))
    );

    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        masterId: master.id,
        masterName: master.name,
        type: delta > 0 ? 'Admin balanso papildymas' : 'Admin balanso nurašymas',
        amount: delta,
        invoiceRequested: false,
        date: new Date().toISOString().slice(0, 16).replace('T', ' ')
      },
      ...prev
    ]);

    notify(
      `Meistro ${master.name} balansas pakeistas (${delta > 0 ? '+' : ''}${delta.toFixed(
        2
      )} €) -> ${updatedBalance.toFixed(2)} €.`
    );
  };

  const handleAdminDeleteReview = (masterId, reviewId) => {
    setMasters((prev) =>
      prev.map((m) => {
        if (m.id !== masterId) return m;
        const remaining = (m.reviews || []).filter((r) => r.id !== reviewId);
        const nextRating =
          remaining.length > 0
            ? Number(
                (
                  remaining.reduce((sum, r) => sum + Number(r.rating || 5), 0) /
                  remaining.length
                ).toFixed(1)
              )
            : 5.0;
        return {
          ...m,
          reviews: remaining,
          rating: nextRating
        };
      })
    );
    notify('Atsiliepimas ištrintas.');
  };

  const handleAdminDeleteJob = (jobId) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    if (selectedMasterJobId === jobId) {
      setSelectedMasterJobId(null);
    }
    notify('Užklausa pašalinta.');
  };

  const handleAdminAddCategory = (e) => {
    e.preventDefault();
    const clean = newCategoryName.trim();
    if (!clean) return;
    if (categories.includes(clean)) {
      notify('Tokia kategorija jau egzistuoja.', 'error');
      return;
    }
    setCategories((prev) => [...prev, clean]);
    setNewCategoryName('');
    notify(`Pridėta nauja paslaugų kategorija: ${clean}`);
  };

  const handleAdminRemoveCategory = (cat) => {
    if (categories.length <= 1) {
      notify('Turi likti bent viena kategorija.', 'error');
      return;
    }
    setCategories((prev) => prev.filter((c) => c !== cat));
    notify(`Kategorija „${cat}“ pašalinta.`);
  };

  // ==========================================================================
  // VIRŠUTINĖ NAVIGACIJA (HEADER) – ŠVIESUS NAMUPAGALBA.LT DIZAINAS
  // ==========================================================================

  const renderHeader = () => (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 min-h-16 sm:h-20 py-2 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-3">
        {/* Logotipas */}
        <button
          type="button"
          onClick={() => {
            setActiveView('home');
            setMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 sm:gap-2.5 text-left shrink-0 cursor-pointer"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M3.2 11.4L12 4.2L20.8 11.4M5.5 13.5V19.6H18.5V13.5M16.2 8.2V5.3H18.8V10.3"
                stroke="#FFFFFF"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.6 8.6A2.9 2.9 0 0 0 12.1 12.1L8.1 16.1A1.65 1.65 0 1 0 10.4 18.4L14.4 14.4A2.9 2.9 0 0 0 17.9 10.9L16.3 12.5L14.7 10.9L16.3 9.3L15.6 8.6Z"
                fill="#FFFFFF"
              />
              <circle cx="9.25" cy="17.25" r="0.65" fill="#2563EB" />
            </svg>
          </div>
          <div className="leading-tight">
            <div className="text-base sm:text-xl font-black tracking-tight text-slate-900">
              Namupagalba<span className="text-blue-600">.lt</span>
            </div>
            <div className="text-[11px] font-medium text-slate-500 hidden sm:block">
              Greita pagalba jūsų namams
            </div>
          </div>
        </button>

        {/* Režimų perjungiklis (Kliento režimas / Meistro kabinetas / Admin) */}
        <div className="order-3 sm:order-2 w-full sm:w-auto flex items-center justify-between sm:justify-start bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => {
              setActiveView('client');
              setClientSubView('form');
              setMobileMenuOpen(false);
            }}
            className={`flex-1 sm:flex-initial px-2 sm:px-3.5 py-2 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition cursor-pointer text-center ${
              activeView === 'client'
                ? 'bg-white text-blue-600 shadow-2xs border border-blue-100'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kliento režimas
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveView('master');
              setMobileMenuOpen(false);
            }}
            className={`flex-1 sm:flex-initial px-2 sm:px-3.5 py-2 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition cursor-pointer text-center ${
              activeView === 'master'
                ? 'bg-white text-blue-600 shadow-2xs border border-blue-100'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Meistro kabinetas
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveView('admin');
              setMobileMenuOpen(false);
            }}
            className={`flex-1 sm:flex-initial px-2 sm:px-3.5 py-2 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer ${
              activeView === 'admin'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            <span>Admin</span>
            {pendingApprovalMasters.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950">
                {pendingApprovalMasters.length}
              </span>
            )}
          </button>
        </div>

        {/* Desktop nuorodos + Tapti meistru */}
        <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => handleNavSectionClick('services')}
            className="hover:text-slate-900 transition cursor-pointer"
          >
            Paslaugos
          </button>
          <button
            type="button"
            onClick={() => handleNavSectionClick('how')}
            className="hover:text-slate-900 transition cursor-pointer"
          >
            Kaip tai veikia?
          </button>
          <button
            type="button"
            onClick={() => handleNavSectionClick('catalog')}
            className="hover:text-slate-900 transition cursor-pointer"
          >
            Meistrų katalogas
          </button>
          <button
            type="button"
            onClick={() => handleNavSectionClick('faq')}
            className="hover:text-slate-900 transition cursor-pointer"
          >
            DUK
          </button>
          <button
            type="button"
            onClick={() => setActiveView('master')}
            className="hover:text-slate-900 font-bold text-slate-800 transition cursor-pointer"
          >
            Prisijungti
          </button>
        </nav>

        <div className="order-2 sm:order-3 flex items-center gap-2">
          <button
            type="button"
            onClick={openBecomeMasterModal}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-[11px] sm:text-xs shadow-xs transition cursor-pointer"
          >
            <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Tapti meistru</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="xl:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
            aria-label="Meniu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobilusis meniu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
            <button
              type="button"
              onClick={() => handleNavSectionClick('services')}
              className="text-left px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer"
            >
              Paslaugos
            </button>
            <button
              type="button"
              onClick={() => handleNavSectionClick('how')}
              className="text-left px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer"
            >
              Kaip tai veikia?
            </button>
            <button
              type="button"
              onClick={() => handleNavSectionClick('catalog')}
              className="text-left px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer"
            >
              Meistrų katalogas
            </button>
            <button
              type="button"
              onClick={() => handleNavSectionClick('faq')}
              className="text-left px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer"
            >
              DUK
            </button>
          </div>
          <button
            type="button"
            onClick={openBecomeMasterModal}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Briefcase className="w-4 h-4" />
            <span>Tapti meistru (SMS patvirtinimas)</span>
          </button>
        </div>
      )}
    </header>
  );

  // ==========================================================================
  // PRADINIS PUSLAPIS ('home') – KAIP ATRODO TIK UŽĖJUS Į NAMUPAGALBA.LT
  // ==========================================================================

  const renderHomeView = () => (
    <div className="space-y-16">
      {/* HERO SEKCIJA */}
      <section
        className="relative overflow-hidden border-b border-slate-200/70 pt-10 pb-14 sm:pt-14 sm:pb-20 px-4"
        style={{
          background:
            'radial-gradient(circle at 12% 35%, rgba(254, 240, 138, 0.35), transparent 42%), radial-gradient(circle at 85% 20%, rgba(219, 234, 254, 0.75), transparent 48%), linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)'
        }}
      >
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Viršutinė miestų ir kainos kapsulė */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-2xs text-xs font-semibold text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>
              Vilnius • Kaunas • Klaipėda — klientams nemokamai, o meistrams pirmi du užsakymai
              nemokamai
            </span>
          </div>

          {/* Didelė centrinė antraštė */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-950 leading-[1.08]">
            Patikimas meistras jūsų namų darbams per kelias minutes
          </h1>

          {/* Paaiškinimas */}
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Aprašykite, ką reikia sutvarkyti, gaukite iki 5 patikrintų meistrų kainų pasiūlymus ir
            išsirinkite tinkamiausią. Nemokamai ir be jokių įsipareigojimų.
          </p>

          {/* Greitos paieškos juosta */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              goToClientForm(heroCity, heroCategory);
            }}
            className="max-w-3xl mx-auto bg-white p-2 sm:p-2.5 rounded-2xl sm:rounded-full border border-slate-200/90 shadow-lg shadow-slate-200/50 grid grid-cols-1 sm:grid-cols-12 items-center gap-2 text-left"
          >
            <div className="sm:col-span-4 px-4 py-1.5 sm:border-r border-slate-200">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                1. PASIRINKITE MIESTĄ
              </label>
              <div className="flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <select
                  value={heroCity}
                  onChange={(e) => setHeroCity(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-4 px-4 py-1.5">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                2. KOKIA PAGALBA REIKALINGA?
              </label>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Wrench className="w-4 h-4 text-blue-600 shrink-0" />
                <select
                  value={heroCategory}
                  onChange={(e) => setHeroCategory(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="Kita">Kita</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-4">
              <button
                type="submit"
                className="w-full py-3 sm:py-3.5 px-5 rounded-xl sm:rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              >
                <span>Gauti meistrų pasiūlymus</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* 3 pranašumai po paieškos juosta */}
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 pt-1 text-xs font-semibold text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Klientams 100 % nemokama
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Tik patvirtinti meistrai
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-blue-600" />
              Kontaktai paslėpti iki pasirinkimo
            </span>
          </div>
        </div>
      </section>

      {/* 3 ŽINGSNIAI IR PASLAUGŲ SRITYS */}
      <section ref={howItWorksRef} className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              step: '1 žingsnis',
              title: 'Trumpai aprašykite darbą',
              desc: 'Nurodykite miestą, paslaugos sritį, patogų atvykimo laiką ir keliais sakiniais aprašykite, ką reikia sutvarkyti.'
            },
            {
              step: '2 žingsnis',
              title: 'Gaukite meistrų pasiūlymus',
              desc: 'Laisvi jūsų miesto meistrai pateikia orientacinę kainą ir nurodo, kada gali atvykti atlikti darbo.'
            },
            {
              step: '3 žingsnis',
              title: 'Pasirinkite tinkamiausią meistrą',
              desc: 'Palyginkite pasiūlymus bei atsiliepimus ir patvirtinkite geriausią meistrą – tik tada atveriami kontaktai.'
            }
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-2"
            >
              <span className="inline-block px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-extrabold">
                {item.step}
              </span>
              <h2 className="text-base font-extrabold text-slate-900">{item.title}</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Paslaugų sritys */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-black text-slate-900">Populiariausios paslaugų sritys</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Paspauskite ant srities, kad iškart pradėtumėte užklausą.
              </p>
            </div>
            <button
              type="button"
              onClick={() => goToClientForm()}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Pildyti užklausą</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => goToClientForm(heroCity, cat)}
                className="bg-white hover:border-blue-400 hover:bg-blue-50/30 border border-slate-200 rounded-2xl p-4 text-left transition shadow-2xs cursor-pointer"
              >
                <div className="font-extrabold text-sm text-slate-900">{cat}</div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {CATEGORY_DESCRIPTIONS[cat] || 'Greita ir patikima pagalba jūsų namams.'}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PASKUTINIAI EINAMI UŽSAKYMAI (TIK PERŽIŪRAI – NEPASPAUDŽIAMI) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-5">
        <div>
          <h2 className="text-xl font-black text-slate-900">Paskutiniai einami užsakymai</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Šiuo metu platformoje vykdomi ir naujausi klientų užsakymai.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 select-none">
          {newestThreeJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between gap-4 pointer-events-none"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-bold">
                    {job.category === 'Kita' && job.customCategoryText
                      ? `Kita: ${job.customCategoryText}`
                      : job.category}
                  </span>
                  <span className="text-slate-400">{job.createdAt}</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">{job.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{job.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">📍 {job.city}</span>
                <span className="font-bold text-slate-500">
                  {job.status === 'pasirinktas_meistras'
                    ? '✓ Meistras pasirinktas'
                    : `Pasiūlymai: ${job.offers.length}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MEISTRŲ KATALOGAS (TIK PERŽIŪRAI – NEPASPAUDŽIAMAS) */}
      <section ref={catalogSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 space-y-5">
        <div>
          <h2 className="text-xl font-black text-slate-900">Meistrų katalogas</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Platformoje dirbantys patikrinti meistrai ir jų klientų įvertinimai.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
          {masters
            .filter((m) => m.status !== 'uzblokuotas')
            .map((master) => (
              <div
                key={master.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between gap-4 pointer-events-none"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {master.avatarUrl ? (
                      <img
                        src={master.avatarUrl}
                        alt={master.name}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 font-black flex items-center justify-center text-sm shrink-0">
                        {master.name
                          .split(' ')
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join('')}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-sm text-slate-900 truncate">
                        {master.name}
                      </h3>
                      <p className="text-xs text-slate-500">📍 {master.city}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {master.categories.slice(0, 2).map((cat) => (
                      <span
                        key={cat}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold"
                      >
                        {cat}
                      </span>
                    ))}
                    {master.certified && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                        ✓ Sertifikuotas
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">{master.bio}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-extrabold text-amber-600">
                    ★ {master.rating.toFixed(1)} ({master.reviews.length} atsiliepimai)
                  </span>
                  {master.verified && (
                    <span className="font-bold text-emerald-700">Patvirtintas</span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* DUK */}
      <section ref={faqSectionRef} className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
        <h2 className="text-xl font-black text-slate-900">Dažniausiai užduodami klausimai</h2>
        <div className="space-y-3">
          {FAQ_ITEMS.map((faq) => (
            <div
              key={faq.q}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-1.5"
            >
              <h3 className="font-extrabold text-sm text-slate-900">{faq.q}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LANKYTOJŲ PAGALBA PAGRINDINIO PUSLAPIO APAČIOJE */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold">
              <HelpCircle className="w-3.5 h-3.5" />
              Pagalba ir kontaktai
            </span>
            <h2 className="text-xl font-black text-slate-900">Turite klausimų? Parašykite mums</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Jei neradote atsakymo arba reikia pagalbos naudojantis <strong>namupagalba.lt</strong>,
              palikite žinutę – administratorius atsakys tiesiai į jūsų el. paštą.
            </p>
          </div>

          <form onSubmit={handleSendVisitorSupportMessage} className="lg:col-span-7 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jūsų vardas</label>
                <input
                  type="text"
                  value={visitorSupportForm.senderName}
                  onChange={(e) =>
                    setVisitorSupportForm((prev) => ({ ...prev, senderName: e.target.value }))
                  }
                  placeholder="Pvz., Laura"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  El. paštas atsakymui *
                </label>
                <input
                  type="email"
                  required
                  value={visitorSupportForm.senderEmail}
                  onChange={(e) =>
                    setVisitorSupportForm((prev) => ({ ...prev, senderEmail: e.target.value }))
                  }
                  placeholder="jusu@pastas.lt"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tema</label>
              <select
                value={visitorSupportForm.topic}
                onChange={(e) =>
                  setVisitorSupportForm((prev) => ({ ...prev, topic: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900"
              >
                <option value="Bendras klausimas">Bendras klausimas</option>
                <option value="Pagalba pateikiant užklausą">Pagalba pateikiant užklausą</option>
                <option value="Meistrų registracija">Meistrų registracija</option>
                <option value="Bendradarbiavimas">Bendradarbiavimas</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Žinutė *</label>
              <textarea
                rows={3}
                required
                value={visitorSupportForm.message}
                onChange={(e) =>
                  setVisitorSupportForm((prev) => ({ ...prev, message: e.target.value }))
                }
                placeholder="Įrašykite savo klausimą..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <span className="text-[11px] text-slate-500">
                Atsakymas bus išsiųstas jūsų nurodytu el. pašto adresu.
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold cursor-pointer shrink-0"
              >
                Siųsti žinutę pagalbai
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* APATINĖ JUOSTA (FOOTER) SU BDAR, PRIVATUMO POLITIKA, TAISYKLĖMIS IR SLAPUKAIS */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5 space-y-2.5">
              <div className="text-lg font-black text-white">
                Namupagalba<span className="text-blue-400">.lt</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Greita ir patikima meistrų paieškos platforma jūsų namų darbams Vilniuje, Kaune ir
                Klaipėdoje. Klientams paslauga 100 % nemokama.
              </p>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 pt-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Asmens duomenys saugomi laikantis ES BDAR (GDPR) reikalavimų</span>
              </div>
            </div>

            <div className="md:col-span-3 space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                Navigacija
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>
                  <button
                    type="button"
                    onClick={() => goToClientForm()}
                    className="hover:text-white transition cursor-pointer"
                  >
                    Paskelbti užklausą (0 €)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={openBecomeMasterModal}
                    className="hover:text-white transition cursor-pointer"
                  >
                    Registruotis kaip meistrui
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection(faqSectionRef)}
                    className="hover:text-white transition cursor-pointer"
                  >
                    Dažniausiai užduodami klausimai
                  </button>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                Teisinė informacija ir BDAR
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveLegalDoc('gdpr')}
                    className="hover:text-white underline transition cursor-pointer text-left"
                  >
                    Privatumo politika ir BDAR (GDPR)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveLegalDoc('terms')}
                    className="hover:text-white underline transition cursor-pointer text-left"
                  >
                    Platformos naudojimosi taisyklės
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveLegalDoc('cookies')}
                    className="hover:text-white underline transition cursor-pointer text-left"
                  >
                    Slapukų (Cookies) politika
                  </button>
                </li>
              </ul>
              <p className="text-[11px] text-slate-500 pt-1">
                Kontaktai dėl duomenų apsaugos (BDAR): info@namupagalba.lt
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-slate-500">
            <span>© {new Date().getFullYear()} namupagalba.lt. Visos teisės saugomos.</span>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => setActiveLegalDoc('gdpr')}
                className="hover:text-slate-300 cursor-pointer"
              >
                BDAR / Privatumas
              </button>
              <button
                type="button"
                onClick={() => setActiveLegalDoc('terms')}
                className="hover:text-slate-300 cursor-pointer"
              >
                Taisyklės
              </button>
              <button
                type="button"
                onClick={() => setActiveLegalDoc('cookies')}
                className="hover:text-slate-300 cursor-pointer"
              >
                Slapukai
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );

  // ==========================================================================
  // KLIENTO PUSLAPIS ('client') – UŽKLAUSOS FORMA + MANO UŽSAKYMAI + PAGALBA
  // ==========================================================================

  const renderClientView = () => (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Viršutinis kliento perjungiklis */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
            Kliento paskyra
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            {clientSubView === 'form'
              ? 'Paskelbti užklausą meistrui'
              : clientSubView === 'support'
              ? 'Pagalba klientui – susirašinėjimas su admin'
              : 'Mano užsakymai ir meistrų pasiūlymai'}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setClientSubView('form')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              clientSubView === 'form'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Paskelbti užklausą
          </button>

          <button
            type="button"
            onClick={goToClientOrders}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              clientSubView === 'orders'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Mano užsakymai ir pasiūlymai ({jobs.length})
          </button>

          <button
            type="button"
            onClick={() => setClientSubView('support')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              clientSubView === 'support'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Pagalba
          </button>
        </div>
      </div>

      {/* KLIENTO SKILTIS: PAGALBA */}
      {clientSubView === 'support' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={handleSendClientSupportMessage}
            className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4 h-fit"
          >
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Pagalba klientui</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Parašykite administratoriui dėl užsakymo, meistro pasirinkimo ar kito klausimo.
                Atsakymą matysite čia pat paskyroje.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                  Jūsų vardas
                </label>
                <input
                  type="text"
                  value={clientSupportForm.senderName}
                  onChange={(e) =>
                    setClientSupportForm((prev) => ({ ...prev, senderName: e.target.value }))
                  }
                  placeholder="Pvz., Greta"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                  Telefonas arba el. paštas
                </label>
                <input
                  type="text"
                  value={clientSupportForm.senderContact}
                  onChange={(e) =>
                    setClientSupportForm((prev) => ({ ...prev, senderContact: e.target.value }))
                  }
                  placeholder="+370 6XX XXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                Tema
              </label>
              <select
                value={clientSupportForm.topic}
                onChange={(e) =>
                  setClientSupportForm((prev) => ({ ...prev, topic: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900"
              >
                <option value="Klausimas dėl užsakymo">Klausimas dėl užsakymo</option>
                <option value="Klausimas dėl meistro">Klausimas dėl meistro</option>
                <option value="Techninė pagalba">Techninė pagalba</option>
                <option value="Kitas klausimas">Kitas klausimas</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                Žinutė administratoriui *
              </label>
              <textarea
                rows={4}
                required
                value={clientSupportForm.message}
                onChange={(e) =>
                  setClientSupportForm((prev) => ({ ...prev, message: e.target.value }))
                }
                placeholder="Aprašykite savo klausimą..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold cursor-pointer"
            >
              Siųsti žinutę administratoriui
            </button>
          </form>

          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4 h-fit">
            <h2 className="text-base font-extrabold text-slate-900">
              Susirašinėjimas su administratoriumi
            </h2>

            {supportMessages.filter((msg) => msg.senderRole === 'Klientas').length === 0 ? (
              <p className="text-xs text-slate-500">Dar neišsiuntėte jokių žinučių.</p>
            ) : (
              <div className="space-y-3">
                {supportMessages
                  .filter((msg) => msg.senderRole === 'Klientas')
                  .map((msg) => (
                    <div
                      key={msg.id}
                      className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">{msg.topic}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                            msg.adminReply
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {msg.adminReply ? '✓ Admin atsakė' : 'Išsiųsta admin'}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{msg.message}</p>
                      <div className="text-[11px] text-slate-400">{msg.sentAt}</div>

                      {msg.adminReply && (
                        <div className="mt-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 space-y-1">
                          <div className="font-extrabold text-emerald-900">
                            Administratoriaus atsakymas ({msg.repliedAt}):
                          </div>
                          <p className="text-emerald-950 leading-relaxed">{msg.adminReply}</p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* UŽKLAUSOS FORMA */}
      {clientSubView === 'form' && (
        <form
          onSubmit={handleCreateJob}
          className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                Miestas *
              </label>
              <select
                value={jobForm.city}
                onChange={(e) => setJobForm((prev) => ({ ...prev, city: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900"
              >
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                Rajonas / mikrorajonas (nebūtina)
              </label>
              <input
                type="text"
                value={jobForm.district}
                onChange={(e) => setJobForm((prev) => ({ ...prev, district: e.target.value }))}
                placeholder="Pvz., Fabijoniškės, Žaliakalnis..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Paslaugos sritis *
              </label>
              <button
                type="button"
                onClick={() => setExpandedCategoryDesc((prev) => !prev)}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                {expandedCategoryDesc ? 'Slėpti aprašymą' : 'Rodyti srities aprašymą'}
              </button>
            </div>

            <select
              value={jobForm.category}
              onChange={(e) =>
                setJobForm((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="Kita">Kita</option>
            </select>

            {jobForm.category === 'Kita' && (
              <input
                type="text"
                value={jobForm.customCategoryText}
                onChange={(e) =>
                  setJobForm((prev) => ({ ...prev, customCategoryText: e.target.value }))
                }
                placeholder="Įrašykite kokios paslaugos reikia..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-blue-300 bg-blue-50/30 text-sm"
              />
            )}

            <div
              className={`overflow-hidden transition-all duration-300 ${
                expandedCategoryDesc ? 'max-h-32 opacity-100 pt-1' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="rounded-xl bg-slate-50 border border-slate-200/80 px-4 py-2.5 text-xs text-slate-600 leading-relaxed">
                {CATEGORY_DESCRIPTIONS[jobForm.category] ||
                  'Trumpai aprašykite darbą – meistrai pateiks pasiūlymus su kaina ir atvykimo laiku.'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                Trumpas darbo pavadinimas *
              </label>
              <input
                type="text"
                required
                value={jobForm.title}
                onChange={(e) => setJobForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Pvz., Pakeisti maišytuvą virtuvėje"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                Pageidaujamas atvykimo laikas
              </label>
              <select
                value={jobForm.preferredTime}
                onChange={(e) =>
                  setJobForm((prev) => ({ ...prev, preferredTime: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900"
              >
                <option value="Kuo greičiau / Šiandien">Kuo greičiau / Šiandien</option>
                <option value="Šiandien po 17:00">Šiandien po 17:00</option>
                <option value="Rytoj pirmoje dienos pusėje">Rytoj pirmoje dienos pusėje</option>
                <option value="Rytoj antroje dienos pusėje">Rytoj antroje dienos pusėje</option>
                <option value="Savaitgalį">Savaitgalį</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
              Ką reikia sutvarkyti? *
            </label>
            <textarea
              rows={4}
              required
              value={jobForm.description}
              onChange={(e) => setJobForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Aprašykite situaciją, ar turite detales / medžiagas, kokia apimtis..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
            />
          </div>

          {/* Nuotrauka 1 įkėlimas */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Nuotrauka 1 (nebūtina)
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer">
                <Camera className="w-4 h-4 text-blue-600" />
                <span>Įkelti nuotrauką 1</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleJobPhoto1Change}
                  className="hidden"
                />
              </label>

              {jobForm.photo1Name && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold">
                  <span>{jobForm.photo1Name}</span>
                  <button
                    type="button"
                    onClick={handleRemoveJobPhoto1}
                    className="text-blue-700 hover:text-red-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            {jobForm.photo1Url && (
              <img
                src={jobForm.photo1Url}
                alt="Užsakymo nuotrauka 1"
                className="w-36 h-24 object-cover rounded-xl border border-slate-200 mt-2"
              />
            )}
          </div>

          {/* Kliento vardas ir telefonas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                Jūsų vardas
              </label>
              <input
                type="text"
                value={jobForm.clientName}
                onChange={(e) => setJobForm((prev) => ({ ...prev, clientName: e.target.value }))}
                placeholder="Pvz., Tomas"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                Telefono numeris *
              </label>
              <input
                type="tel"
                required
                value={jobForm.clientPhone}
                onChange={(e) => setJobForm((prev) => ({ ...prev, clientPhone: e.target.value }))}
                placeholder="+370 6XX XXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <p className="text-xs text-slate-500">
              Tikslaus gatvės adreso skelbti nereikia – kontaktai atveriami tik pasirinktam meistrui.
            </p>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-sm transition cursor-pointer"
            >
              Paskelbti užklausą (0 €)
            </button>
          </div>
        </form>
      )}

      {/* MANO UŽSAKYMAI IR PASIŪLYMAI */}
      {clientSubView !== 'support' && (
        <div ref={clientOrdersSectionRef} className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-black text-slate-900">
              Užsakymai ir gauti pasiūlymai ({filteredClientJobs.length})
            </h2>

            <div className="flex items-center gap-1.5 flex-wrap">
              {['Visi', ...CITIES].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSelectedCityFilter(city)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedCityFilter === city
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredClientJobs.map((job) => {
              const selectedMaster = masters.find((m) => m.id === job.selectedMasterId);

              return (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-bold">
                        {job.category === 'Kita' && job.customCategoryText
                          ? `Kita: ${job.customCategoryText}`
                          : job.category}
                      </span>
                      <span className="font-semibold text-slate-700">
                        📍 {job.city}
                        {job.district ? `, ${job.district}` : ''}
                      </span>
                      <span className="text-slate-500">• {job.preferredTime}</span>
                    </div>
                    <span className="text-slate-400">{job.createdAt}</span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">{job.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  {job.photo1Url && (
                    <img
                      src={job.photo1Url}
                      alt={job.photo1Name || 'Užsakymo nuotrauka'}
                      className="w-40 h-28 object-cover rounded-xl border border-slate-200"
                    />
                  )}

                  {/* Pasirinktas meistras ir jo kontaktai */}
                  {job.status === 'pasirinktas_meistras' && selectedMaster && (
                    <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
                          ✓ Patvirtintas meistras
                        </span>
                        <p className="text-sm font-black text-slate-900">
                          {selectedMaster.name} •{' '}
                          <button
                            type="button"
                            onClick={() => openMasterProfileModal(selectedMaster.id)}
                            className="text-blue-700 underline cursor-pointer"
                          >
                            Peržiūrėti profilį
                          </button>
                        </p>
                        <p className="text-xs font-bold text-emerald-900">
                          Meistro telefonas: {selectedMaster.phone}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openOrderReviewModal(job, selectedMaster.id)}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold cursor-pointer"
                        >
                          {job.reviewSubmitted ? '✓ Palikti dar atsiliepimą' : 'Palikti atsiliepimą'}
                        </button>

                        <a
                          href={`tel:${selectedMaster.phone.replace(/\s+/g, '')}`}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold text-center"
                        >
                          Skambinti meistrui
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Gauti meistrų pasiūlymai */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-100">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      Gauti meistrų pasiūlymai ({job.offers.length})
                    </h4>

                    {job.offers.length === 0 ? (
                      <p className="text-xs text-slate-500">
                        Pasiūlymų dar nėra. Meistrai netrukus atsilieps.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {job.offers.map((offer) => {
                          const offerMaster = masters.find((m) => m.id === offer.masterId);
                          if (!offerMaster) return null;
                          const isChosen = job.selectedMasterId === offerMaster.id;

                          return (
                            <div
                              key={offer.id}
                              className={`rounded-2xl border p-4 space-y-2.5 ${
                                isChosen
                                  ? 'border-emerald-400 bg-emerald-50/40'
                                  : 'border-slate-200 bg-slate-50/50'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <button
                                    type="button"
                                    onClick={() => openMasterProfileModal(offerMaster.id)}
                                    className="font-extrabold text-sm text-slate-900 hover:text-blue-600 underline cursor-pointer"
                                  >
                                    {offerMaster.name}
                                  </button>
                                  <p className="text-[11px] text-slate-500">
                                    ★ {offerMaster.rating.toFixed(1)} ({offerMaster.reviews.length}{' '}
                                    atsiliepimai) • {offerMaster.city}
                                  </p>
                                </div>
                                <span className="px-2.5 py-1 rounded-xl bg-blue-600 text-white text-xs font-black">
                                  {offer.price} €
                                </span>
                              </div>

                              <p className="text-xs font-semibold text-slate-700">
                                Atvykimas: {offer.eta}
                              </p>
                              {offer.note && (
                                <p className="text-xs text-slate-600">{offer.note}</p>
                              )}

                              <div className="pt-1 flex items-center justify-between gap-2">
                                <button
                                  type="button"
                                  onClick={() => openMasterProfileModal(offerMaster.id)}
                                  className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                                >
                                  Profilis ir atsiliepimai
                                </button>

                                {job.status === 'laukiama_pasiulymu' ? (
                                  <button
                                    type="button"
                                    onClick={() => handleSelectMasterForJob(job.id, offer)}
                                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold cursor-pointer"
                                  >
                                    Pasirinkti meistrą
                                  </button>
                                ) : isChosen ? (
                                  <span className="text-xs font-extrabold text-emerald-700">
                                    ✓ Pasirinktas
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  // ==========================================================================
  // MEISTRO KABINETAS ('master') – UŽSAKYMAI, PROFILIS, BALANSAS, SĄSKAITOS
  // ==========================================================================

  const renderMasterView = () => {
    if (!currentMaster) return null;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Viršutinė meistro juosta */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
                Meistro kabinetas
              </span>
              {currentMaster.status === 'laukiantis_patvirtinimo' && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold">
                  Laukia administratoriaus patvirtinimo
                </span>
              )}
              {currentMaster.status === 'patvirtintas' && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                  ✓ Patvirtintas meistras
                </span>
              )}
              {currentMaster.status === 'uzblokuotas' && (
                <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-extrabold">
                  Užblokuotas
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {currentMaster.name} •{' '}
              <span className="text-emerald-600">
                Balansas: {Number(currentMaster.balance).toFixed(2)} €
              </span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={currentMaster.id}
              onChange={(e) => setCurrentMasterId(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-slate-50"
            >
              {masters.map((m) => (
                <option key={m.id} value={m.id}>
                  Meistras: {m.name} ({m.city})
                </option>
              ))}
            </select>

            {[
              { id: 'orders', label: `Užsakymai (${jobs.length})` },
              { id: 'profile', label: 'Profilis' },
              { id: 'balance', label: 'Balansas' },
              { id: 'invoices', label: 'Sąskaitos' },
              { id: 'support', label: 'Pagalba' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMasterSubTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  masterSubTab === tab.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* SKIRTUKAS: PROFILIS */}
        {masterSubTab === 'profile' && (
          <form
            onSubmit={handleSaveMasterProfile}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5"
          >
            <h2 className="text-base font-extrabold text-slate-900">Meistro profilio nustatymai</h2>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                {currentMaster.avatarUrl ? (
                  <img
                    src={currentMaster.avatarUrl}
                    alt={currentMaster.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-700 font-black flex items-center justify-center text-lg">
                    {currentMaster.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <label className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer">
                    Įkelti profilio nuotrauką
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMasterAvatarUpload}
                      className="hidden"
                    />
                  </label>
                  {currentMaster.avatarUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveMasterAvatar}
                      className="px-3 py-2 rounded-xl border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 cursor-pointer"
                    >
                      Pašalinti nuotrauką
                    </button>
                  )}
                </div>
              </div>

              {/* Šalia nuotraukos: atsiliepimų ir įvertinimų blokas */}
              <button
                type="button"
                onClick={() => setMasterReviewsModalOpen(true)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-left transition cursor-pointer shrink-0"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
                  ★ {Number(currentMaster.rating || 5).toFixed(1)}
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">
                    Atsiliepimai ir įvertinimai ({currentMaster.reviews.length})
                  </div>
                  <div className="text-[11px] font-bold text-amber-800">
                    Paspauskite peržiūrėti visus →
                  </div>
                </div>
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Paslaugų sritys
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const active = currentMaster.categories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCurrentMasterCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        active
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                Kita (laisvas laukas)
              </label>
              <input
                type="text"
                value={currentMaster.customCategory || ''}
                onChange={(e) =>
                  handleUpdateCurrentMasterField('customCategory', e.target.value)
                }
                placeholder="Pvz., Kondicionierių valymas, žaliuzių montavimas..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                Prisistatymas klientams
              </label>
              <textarea
                rows={3}
                value={currentMaster.bio}
                onChange={(e) => handleUpdateCurrentMasterField('bio', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <label className="inline-flex items-center gap-2.5 text-sm font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(currentMaster.certified)}
                onChange={(e) =>
                  handleUpdateCurrentMasterField('certified', e.target.checked)
                }
                className="w-4 h-4 rounded border-slate-300 text-blue-600"
              />
              <span>Turiu kvalifikaciją / sertifikuoto meistro žymą</span>
            </label>

            {/* Sąskaitos faktūros rekvizitai */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                  Sąskaitos faktūros rekvizitai
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pagal šiuos rekvizitus automatiškai suformuojama ir išsiunčiama sąskaita faktūra
                  pildant balansą.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                    Įmonės pavadinimas arba vardas, pavardė
                  </label>
                  <input
                    type="text"
                    value={
                      (currentMaster.invoiceDetails &&
                        currentMaster.invoiceDetails.companyOrPersonName) ||
                      ''
                    }
                    onChange={(e) =>
                      handleUpdateCurrentMasterInvoiceField(
                        'companyOrPersonName',
                        e.target.value
                      )
                    }
                    placeholder="Pvz., UAB / MB arba Vardas Pavardė (IV)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                    Įmonės / IV kodas (arba PVM kodas)
                  </label>
                  <input
                    type="text"
                    value={
                      (currentMaster.invoiceDetails && currentMaster.invoiceDetails.codeOrVat) ||
                      ''
                    }
                    onChange={(e) =>
                      handleUpdateCurrentMasterInvoiceField('codeOrVat', e.target.value)
                    }
                    placeholder="Pvz., 305123456 arba LT100012345619"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                    Buveinės / gyvenamasis adresas
                  </label>
                  <input
                    type="text"
                    value={
                      (currentMaster.invoiceDetails && currentMaster.invoiceDetails.address) || ''
                    }
                    onChange={(e) =>
                      handleUpdateCurrentMasterInvoiceField('address', e.target.value)
                    }
                    placeholder="Pvz., Konstitucijos pr. 12, Vilnius"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                    El. paštas sąskaitoms gauti
                  </label>
                  <input
                    type="email"
                    value={
                      (currentMaster.invoiceDetails &&
                        currentMaster.invoiceDetails.invoiceEmail) ||
                      currentMaster.email ||
                      ''
                    }
                    onChange={(e) =>
                      handleUpdateCurrentMasterInvoiceField('invoiceEmail', e.target.value)
                    }
                    placeholder="saskaitos@pavyzdys.lt"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold cursor-pointer"
              >
                Išsaugoti profilį
              </button>
            </div>

            {/* Paskyros ištrynimas pačiam meistrui */}
            <div className="mt-6 pt-5 border-t border-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-red-700">
                  Paskyros šalinimas
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Galite bet kada ištrinti savo meistro paskyrą ir pateiktus pasiūlymus.
                </p>
              </div>

              {!confirmDeleteMasterAccount ? (
                <button
                  type="button"
                  onClick={() => setConfirmDeleteMasterAccount(true)}
                  className="px-4 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-extrabold transition cursor-pointer shrink-0"
                >
                  Ištrinti paskyrą
                </button>
              ) : (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleDeleteOwnMasterAccount}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold transition cursor-pointer"
                  >
                    Patvirtinti ištrynimą
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteMasterAccount(false)}
                    className="px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
                  >
                    Atšaukti
                  </button>
                </div>
              )}
            </div>
          </form>
        )}

        {/* SKIRTUKAS: BALANSAS */}
        {masterSubTab === 'balance' && (
          <form
            onSubmit={handleMasterTopUp}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5 max-w-xl"
          >
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Meistro balansas</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Dabartinis balansas:{' '}
                <strong className="text-emerald-600">
                  {Number(currentMaster.balance).toFixed(2)} €
                </strong>
              </p>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                Papildymo suma (€)
              </label>
              <input
                type="number"
                min="1"
                step="1"
                required
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold"
              />
            </div>

            <label className="inline-flex items-center gap-2.5 text-sm font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={requestInvoiceChecked}
                onChange={(e) => setRequestInvoiceChecked(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600"
              />
              <span>
                Gauti sąsk. faktūrą (automatiškai išrašoma ir išsiunčiama į paštą:{' '}
                <span className="text-blue-700">
                  {(currentMaster.invoiceDetails &&
                    currentMaster.invoiceDetails.invoiceEmail) ||
                    currentMaster.email ||
                    'nenurodytas el. paštas'}
                </span>
                )
              </span>
            </label>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold cursor-pointer"
            >
              Papildyti balansą
            </button>
          </form>
        )}

        {/* SKIRTUKAS: SĄSKAITOS */}
        {masterSubTab === 'invoices' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h2 className="text-base font-extrabold text-slate-900">Operacijų ir sąskaitų istorija</h2>
            <div className="divide-y divide-slate-100">
              {transactions
                .filter((t) => t.masterId === currentMaster.id)
                .map((tx) => (
                  <div
                    key={tx.id}
                    className="py-3 flex items-center justify-between gap-4 text-xs sm:text-sm"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{tx.type}</span>
                      {tx.invoiceRequested && (
                        <span className="ml-2 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                          ✓ Sąsk. faktūra {tx.invoiceNumber ? `${tx.invoiceNumber} ` : ''}išsiųsta į{' '}
                          {tx.invoiceSentTo ||
                            (currentMaster.invoiceDetails &&
                              currentMaster.invoiceDetails.invoiceEmail) ||
                            currentMaster.email ||
                            'paštą'}
                        </span>
                      )}
                      <div className="text-xs text-slate-400">{tx.date}</div>
                    </div>
                    <span
                      className={`font-extrabold ${
                        Number(tx.amount) >= 0 ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {Number(tx.amount) >= 0 ? '+' : ''}
                      {Number(tx.amount).toFixed(2)} €
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* SKIRTUKAS: PAGALBA (SUSISIEKTI SU ADMIN) */}
        {masterSubTab === 'support' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form
              onSubmit={handleSendMessageToAdmin}
              className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4 h-fit"
            >
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Pagalba meistrui</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Turite klausimų dėl paskyros patvirtinimo, balanso, sąskaitų ar užsakymų?
                  Parašykite administratoriui – atsakymą matysite čia.
                </p>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                  Tema
                </label>
                <select
                  value={adminSupportForm.topic}
                  onChange={(e) =>
                    setAdminSupportForm((prev) => ({ ...prev, topic: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900"
                >
                  <option value="Balansas / Sąskaita faktūra">Balansas / Sąskaita faktūra</option>
                  <option value="Paskyros patvirtinimas / Sritys">
                    Paskyros patvirtinimas / Sritys
                  </option>
                  <option value="Užsakymai ir pasiūlymai">Užsakymai ir pasiūlymai</option>
                  <option value="Kitas klausimas">Kitas klausimas</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                  Žinutė administratoriui *
                </label>
                <textarea
                  rows={4}
                  required
                  value={adminSupportForm.message}
                  onChange={(e) =>
                    setAdminSupportForm((prev) => ({ ...prev, message: e.target.value }))
                  }
                  placeholder="Aprašykite savo klausimą arba situaciją..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold cursor-pointer"
              >
                Siųsti žinutę administratoriui
              </button>
            </form>

            <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4 h-fit">
              <h2 className="text-base font-extrabold text-slate-900">
                Susirašinėjimas su administratoriumi
              </h2>

              {supportMessages.filter(
                (msg) => msg.senderRole === 'Meistras' && msg.senderId === currentMaster.id
              ).length === 0 ? (
                <p className="text-xs text-slate-500">
                  Dar neišsiuntėte jokių žinučių administratoriui.
                </p>
              ) : (
                <div className="space-y-3">
                  {supportMessages
                    .filter(
                      (msg) => msg.senderRole === 'Meistras' && msg.senderId === currentMaster.id
                    )
                    .map((msg) => (
                      <div
                        key={msg.id}
                        className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-extrabold text-slate-900 text-sm">
                            {msg.topic}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                              msg.adminReply
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-50 text-blue-700'
                            }`}
                          >
                            {msg.adminReply ? '✓ Admin atsakė' : 'Išsiųsta admin'}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{msg.message}</p>
                        <div className="text-[11px] text-slate-400">{msg.sentAt}</div>

                        {msg.adminReply && (
                          <div className="mt-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 space-y-1">
                            <div className="font-extrabold text-emerald-900">
                              Administratoriaus atsakymas ({msg.repliedAt}):
                            </div>
                            <p className="text-emerald-950 leading-relaxed">{msg.adminReply}</p>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ATSKIRA SKILTIS: UŽSAKYMAI MEISTRUI */}
        {masterSubTab === 'orders' && (() => {
          const hiddenIds = hiddenJobIdsByMaster[currentMaster.id] || [];
          const visibleJobsForMaster = jobs.filter((j) => !hiddenIds.includes(j.id));

          return (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-black text-slate-900">
                  Užsakymai ({visibleJobsForMaster.length})
                </h2>
                <div className="flex items-center gap-3">
                  {hiddenIds.length > 0 && (
                    <button
                      type="button"
                      onClick={handleRestoreHiddenJobsForMaster}
                      className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Rodyti paslėptus ({hiddenIds.length})
                    </button>
                  )}
                  <span className="text-xs text-slate-500">
                    Paspauskite ant užsakymo, kad matytumėte pilną informaciją
                  </span>
                </div>
              </div>

              {visibleJobsForMaster.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-2">
                  <p className="text-sm font-bold text-slate-800">
                    Šiuo metu jūsų sąraše nėra rodomų užsakymų.
                  </p>
                  {hiddenIds.length > 0 && (
                    <button
                      type="button"
                      onClick={handleRestoreHiddenJobsForMaster}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold cursor-pointer"
                    >
                      Atkurti paslėptus užsakymus ({hiddenIds.length})
                    </button>
                  )}
                </div>
              ) : (
                visibleJobsForMaster.map((job) => {
                  const draft = offerDrafts[job.id] || {
                    price: '40',
                    eta: 'Šiandien',
                    note: ''
                  };
                  const alreadyOffered = job.offers.some((o) => o.masterId === currentMaster.id);
                  const isConfirmedForCurrentMaster =
                    job.status === 'pasirinktas_meistras' &&
                    job.selectedMasterId === currentMaster.id;
                  const isSelectedCard = selectedMasterJobId === job.id;

                  return (
                    <div
                      key={job.id}
                      onClick={() => setSelectedMasterJobId(job.id)}
                      className={`bg-white rounded-2xl border p-5 shadow-2xs space-y-4 transition cursor-pointer ${
                        isSelectedCard
                          ? 'border-blue-600 ring-2 ring-blue-100'
                          : isConfirmedForCurrentMaster
                          ? 'border-emerald-300 bg-emerald-50/20'
                          : 'border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-bold">
                            {job.category === 'Kita' && job.customCategoryText
                              ? `Kita: ${job.customCategoryText}`
                              : job.category}
                          </span>
                          <span className="font-semibold text-slate-700">📍 {job.city}</span>
                          <span className="text-slate-500">• {job.preferredTime}</span>
                          {isConfirmedForCurrentMaster && (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold">
                              ✓ Klientas patvirtino jus
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400">{job.createdAt}</span>
                          <button
                            type="button"
                            onClick={(e) => handleHideJobForMaster(e, job.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 text-slate-600 font-bold transition cursor-pointer"
                            title="Pašalinti neįdomų užsakymą iš savo sąrašo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Paslėpti</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-extrabold text-slate-900 text-base">{job.title}</h3>
                          <span className="text-xs font-bold text-blue-600 shrink-0">
                            Atidaryti užsakymą →
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{job.description}</p>
                      </div>

                      {isConfirmedForCurrentMaster && (
                        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div>
                            <span className="font-extrabold uppercase tracking-wider text-emerald-800 block">
                              Patvirtintas kliento kontaktas
                            </span>
                            <span className="font-bold text-slate-900 text-sm">
                              {job.clientName || 'Klientas'} •{' '}
                              <a
                                href={`tel:${job.clientPhone.replace(/\s+/g, '')}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-emerald-700 underline font-extrabold"
                              >
                                {job.clientPhone}
                              </a>
                            </span>
                          </div>
                          <a
                            href={`tel:${job.clientPhone.replace(/\s+/g, '')}`}
                            onClick={(e) => e.stopPropagation()}
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs text-center"
                          >
                            Skambinti klientui
                          </a>
                        </div>
                      )}

                      {job.status === 'laukiama_pasiulymu' ? (
                        alreadyOffered ? (
                          <div className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5">
                            ✓ Jūs jau pateikėte pasiūlymą šiam užsakymui.
                          </div>
                        ) : (
                          <form
                            onClick={(e) => e.stopPropagation()}
                            onSubmit={(e) => handleSubmitMasterOffer(e, job.id)}
                            className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-2 border-t border-slate-100"
                          >
                            <div className="sm:col-span-3">
                              <input
                                type="number"
                                min="1"
                                step="1"
                                required
                                value={draft.price}
                                onChange={(e) =>
                                  setOfferDrafts((prev) => ({
                                    ...prev,
                                    [job.id]: { ...draft, price: e.target.value }
                                  }))
                                }
                                placeholder="Kaina (€)"
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                              />
                            </div>
                            <div className="sm:col-span-4">
                              <input
                                type="text"
                                required
                                value={draft.eta}
                                onChange={(e) =>
                                  setOfferDrafts((prev) => ({
                                    ...prev,
                                    [job.id]: { ...draft, eta: e.target.value }
                                  }))
                                }
                                placeholder="Kada atvyksite?"
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                              />
                            </div>
                            <div className="sm:col-span-5 flex gap-2">
                              <input
                                type="text"
                                value={draft.note}
                                onChange={(e) =>
                                  setOfferDrafts((prev) => ({
                                    ...prev,
                                    [job.id]: { ...draft, note: e.target.value }
                                  }))
                                }
                                placeholder="Trumpas komentaras..."
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                              />
                              <button
                                type="submit"
                                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shrink-0 cursor-pointer"
                              >
                                Siųsti
                              </button>
                            </div>
                          </form>
                        )
                      ) : (
                        !isConfirmedForCurrentMaster && (
                          <div className="text-xs font-bold text-slate-500 bg-slate-50 rounded-xl px-3.5 py-2">
                            Šiam užsakymui jau pasirinktas kitas meistras.
                          </div>
                        )
                      )}
                    </div>
                  );
                })
              )}
            </div>
          );
        })()}
      </div>
    );
  };

  // ==========================================================================
  // ADMINISTRATORIAUS PUSLAPIS ('admin') – MEISTRAI, BALANSAS, UŽKLAUSOS, KATEGORIJOS
  // ==========================================================================

  const renderAdminView = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600">
            Administratoriaus valdymas
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            namupagalba.lt – Admin panelė
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {[
            {
              id: 'masters',
              label: `Meistrai (${masters.length})`,
              badge: pendingApprovalMasters.length
            },
            {
              id: 'messages',
              label: `Žinutės / Pagalba (${supportMessages.length})`,
              badge: unreadSupportCount
            },
            { id: 'balance', label: 'Balansas' },
            { id: 'jobs', label: `Skelbimai (${jobs.length})` },
            { id: 'categories', label: `Kategorijos (${categories.length})` }
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setAdminSubTab(t.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                adminSubTab === t.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{t.label}</span>
              {t.badge > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-400 text-slate-950">
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ADMIN SKIRTUKAS: ŽINUTĖS / PAGALBA */}
      {adminSubTab === 'messages' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:px-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Pagalbos žinutės nuo klientų, meistrų ir lankytojų ({supportMessages.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Klientams ir meistrams atsakymas keliauja tiesiai į jų paskyros skiltį „Pagalba“, o
                lankytojams iš pagrindinio puslapio – el. paštu.
              </p>
            </div>
          </div>

          {supportMessages.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
              Gautų žinučių nėra.
            </div>
          ) : (
            <div className="space-y-4">
              {supportMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-2xs space-y-3 ${
                    !msg.isReadByAdmin ? 'border-amber-300 bg-amber-50/15' : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-extrabold ${
                          msg.senderRole === 'Meistras'
                            ? 'bg-blue-100 text-blue-800'
                            : msg.senderRole === 'Klientas'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {msg.senderRole}
                      </span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {msg.senderName}
                      </span>
                      <span className="text-slate-500">({msg.senderContact})</span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold">
                        {msg.topic}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">{msg.sentAt}</span>
                      <button
                        type="button"
                        onClick={() => handleAdminDeleteSupportMessage(msg.id)}
                        className="text-red-600 hover:underline font-bold cursor-pointer"
                      >
                        Ištrinti
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-slate-800 leading-relaxed bg-slate-50 rounded-xl p-3.5 border border-slate-200/70">
                    {msg.message}
                  </p>

                  {msg.adminReply && (
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs space-y-1">
                      <div className="font-extrabold text-emerald-900">
                        ✓ Išsiųstas atsakymas ({msg.deliveryMethod}) • {msg.repliedAt}:
                      </div>
                      <p className="text-emerald-950 text-sm">{msg.adminReply}</p>
                    </div>
                  )}

                  <form
                    onSubmit={(e) => handleAdminReplyToSupport(e, msg.id)}
                    className="flex flex-col sm:flex-row gap-2 pt-1"
                  >
                    <input
                      type="text"
                      value={adminReplyDrafts[msg.id] || ''}
                      onChange={(e) =>
                        setAdminReplyDrafts((prev) => ({
                          ...prev,
                          [msg.id]: e.target.value
                        }))
                      }
                      placeholder={
                        msg.senderRole === 'Lankytojas'
                          ? `Rašyti atsakymą el. paštu (${msg.senderContact})...`
                          : `Rašyti atsakymą į ${msg.senderRole.toLowerCase()} paskyrą...`
                      }
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold cursor-pointer shrink-0"
                    >
                      {msg.senderRole === 'Lankytojas'
                        ? 'Atrašyti el. paštu'
                        : 'Atrašyti į paskyrą'}
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ADMIN SKIRTUKAS: BALANSAS IR STATISTIKA */}
      {adminSubTab === 'balance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Kiek iš viso turi meistrai balanse
              </span>
              <p className="text-2xl font-black text-blue-600 mt-1.5">
                {totalPlatformBalance.toFixed(2)} €
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Visų meistrų balansų suma kartu ({masters.length} meistrai)
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Kiek jau uždirbta
              </span>
              <p className="text-2xl font-black text-emerald-600 mt-1.5">
                {totalEarnedRevenue.toFixed(2)} €
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Tik meistrų papildymai (startiniai 6 € neskaičiuojami)
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Viso klientų apsilankė
              </span>
              <p className="text-2xl font-black text-slate-900 mt-1.5">
                {128 + jobs.length * 4}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Bendras klientų apsilankymų skaičius</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Užklausų per dieną
              </span>
              <p className="text-2xl font-black text-blue-600 mt-1.5">{jobs.length}</p>
              <p className="text-[11px] text-slate-500 mt-1">Paskelbtos užklausos šiandien</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Naujų klientų
              </span>
              <p className="text-2xl font-black text-slate-900 mt-1.5">
                {14 + Math.max(0, jobs.length - 3)}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Nauji klientai šiandien</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Naujų meistrų
              </span>
              <p className="text-2xl font-black text-amber-600 mt-1.5">{masters.length}</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Viso registruota ({pendingApprovalMasters.length} laukia)
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-extrabold text-slate-900">
                Paskutinės balanso operacijos
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="px-6 py-3.5 flex items-center justify-between gap-4 text-sm"
                >
                  <div>
                    <span className="font-bold text-slate-900">{tx.masterName}</span>
                    <span className="text-xs text-slate-500 ml-2">• {tx.type}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-400">{tx.date}</span>
                    <span
                      className={`font-extrabold ${
                        Number(tx.amount) >= 0 ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {Number(tx.amount) >= 0 ? '+' : ''}
                      {Number(tx.amount).toFixed(2)} €
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADMIN SKIRTUKAS: MEISTRAI */}
      {adminSubTab === 'masters' && (
        <div className="space-y-6">
          {pendingApprovalMasters.length > 0 && (
            <div className="bg-white rounded-2xl border border-amber-300 shadow-2xs overflow-hidden">
              <div className="px-6 py-4 bg-amber-50 border-b border-amber-200">
                <h2 className="text-base font-extrabold text-slate-900">
                  Nauji meistrai po SMS patvirtinimo, laukiantys patvirtinimo (
                  {pendingApprovalMasters.length})
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {pendingApprovalMasters.map((m) => (
                  <div
                    key={m.id}
                    className="p-5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAdminMasterId(m.id);
                          setAdminBalanceAdjustInput('15');
                        }}
                        className="font-extrabold text-slate-900 hover:text-blue-600 underline text-left cursor-pointer"
                      >
                        {m.name}
                      </button>
                      <p className="text-xs text-slate-600 mt-0.5">
                        📍 {m.city} • {m.phone} • Sritys: {m.categories.join(', ')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleApproveMaster(m.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold cursor-pointer"
                      >
                        ✓ Patvirtinti
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteMaster(m.id)}
                        className="px-3.5 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold cursor-pointer"
                      >
                        Šalinti
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-5 sm:px-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Visi meistrai ({filteredMastersForAdmin.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Paspauskite ant meistro, kad atidarytumėte profilį, valdytumėte balansą,
                  blokavimą, šalinimą ar atsiliepimus.
                </p>
              </div>
              <input
                type="text"
                value={adminMasterSearch}
                onChange={(e) => setAdminMasterSearch(e.target.value)}
                placeholder="Ieškoti meistro..."
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm w-full sm:w-64"
              />
            </div>

            <div className="divide-y divide-slate-100">
              {filteredMastersForAdmin.map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    setSelectedAdminMasterId(m.id);
                    setAdminBalanceAdjustInput('15');
                  }}
                  className="p-5 sm:px-6 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">{m.name}</span>
                      <span className="text-xs text-slate-500">• {m.city}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          m.status === 'patvirtintas'
                            ? 'bg-emerald-100 text-emerald-800'
                            : m.status === 'uzblokuotas'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {m.status === 'patvirtintas'
                          ? 'Patvirtintas'
                          : m.status === 'uzblokuotas'
                          ? 'Užblokuotas'
                          : 'Laukia patvirtinimo'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {m.phone} • Atsiliepimų: {m.reviews.length} (★ {m.rating.toFixed(1)})
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-black text-emerald-600">
                      {Number(m.balance).toFixed(2)} €
                    </span>
                    <span className="text-xs font-bold text-blue-600">Valdyti →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADMIN SKIRTUKAS: SKELBIMAI */}
      {adminSubTab === 'jobs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs divide-y divide-slate-100">
          {jobs.map((j) => (
            <div
              key={j.id}
              className="p-5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-bold">
                    {j.category === 'Kita' && j.customCategoryText
                      ? `Kita: ${j.customCategoryText}`
                      : j.category}
                  </span>
                  <span className="font-semibold text-slate-600">📍 {j.city}</span>
                  <span className="text-slate-400">• {j.createdAt}</span>
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 mt-1">{j.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Klientas: {j.clientName || 'Klientas'} ({j.clientPhone}) • Pasiūlymų:{' '}
                  {j.offers.length}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleAdminDeleteJob(j.id)}
                className="px-3.5 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold shrink-0 cursor-pointer"
              >
                Šalinti skelbimą
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ADMIN SKIRTUKAS: KATEGORIJOS */}
      {adminSubTab === 'categories' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5 max-w-2xl">
          <h2 className="text-base font-extrabold text-slate-900">Paslaugų kategorijų valdymas</h2>
          <form onSubmit={handleAdminAddCategory} className="flex gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Naujos kategorijos pavadinimas..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold cursor-pointer"
            >
              + Pridėti
            </button>
          </form>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold"
              >
                <span>{cat}</span>
                <button
                  type="button"
                  onClick={() => handleAdminRemoveCategory(cat)}
                  className="text-slate-400 hover:text-red-600 cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // ==========================================================================
  // MODALAI (BDAR/TEISINIAI DOKUMENTAI, UŽSAKYMAS, PROFILIAI, ADMIN, SMS)
  // ==========================================================================

  const renderModals = () => (
    <>
      {/* MODALAS: BDAR / PRIVATUMO POLITIKA / TAISYKLĖS / SLAPUKAI */}
      {activeLegalDoc && LEGAL_DOCS[activeLegalDoc] && (
        <div
          onClick={() => setActiveLegalDoc(null)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-2xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[88vh] overflow-y-auto p-6 sm:p-8 space-y-5"
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
                  Teisinis dokumentas • {LEGAL_DOCS[activeLegalDoc].updated}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  {LEGAL_DOCS[activeLegalDoc].title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveLegalDoc(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {LEGAL_DOCS[activeLegalDoc].sections.map((sec) => (
                <div key={sec.heading} className="space-y-1">
                  <h4 className="text-sm font-extrabold text-slate-900">{sec.heading}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{sec.body}</p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveLegalDoc(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold cursor-pointer"
              >
                Supratau, uždaryti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALAS: PILNAS UŽSAKYMAS MEISTRUI */}
      {selectedMasterJob && currentMaster && (
        <div
          onClick={() => setSelectedMasterJobId(null)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-2xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-bold">
                    {selectedMasterJob.category === 'Kita' && selectedMasterJob.customCategoryText
                      ? `Kita: ${selectedMasterJob.customCategoryText}`
                      : selectedMasterJob.category}
                  </span>
                  <span className="font-semibold text-slate-600">
                    📍 {selectedMasterJob.city}
                    {selectedMasterJob.district ? `, ${selectedMasterJob.district}` : ''}
                  </span>
                  <span className="text-slate-400">• {selectedMasterJob.createdAt}</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1.5">
                  {selectedMasterJob.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMasterJobId(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div>
                <span className="font-extrabold uppercase tracking-wider text-slate-400 block">
                  Pageidaujamas atvykimo laikas
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {selectedMasterJob.preferredTime}
                </span>
              </div>

              <div>
                <span className="font-extrabold uppercase tracking-wider text-slate-400 block">
                  Pilnas darbo aprašymas
                </span>
                <p className="text-sm text-slate-700 leading-relaxed mt-0.5">
                  {selectedMasterJob.description}
                </p>
              </div>
            </div>

            {selectedMasterJob.photo1Url && (
              <div className="space-y-1.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                  Pridėta nuotrauka
                </span>
                <img
                  src={selectedMasterJob.photo1Url}
                  alt={selectedMasterJob.photo1Name || 'Užsakymo nuotrauka'}
                  className="w-full max-h-56 object-cover rounded-2xl border border-slate-200"
                />
              </div>
            )}

            {selectedMasterJob.status === 'pasirinktas_meistras' &&
            selectedMasterJob.selectedMasterId === currentMaster.id ? (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 block">
                  ✓ Klientas patvirtino jus – galite skambinti tiesiogiai
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-xl p-3.5 border border-emerald-200/80">
                  <div className="space-y-0.5">
                    <p className="text-xs text-slate-500 font-semibold">Kliento vardas</p>
                    <p className="text-sm font-extrabold text-slate-900">
                      {selectedMasterJob.clientName || 'Klientas'}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-slate-500 font-semibold">Telefono numeris</p>
                    <a
                      href={`tel:${selectedMasterJob.clientPhone.replace(/\s+/g, '')}`}
                      className="text-sm font-black text-emerald-700 underline"
                    >
                      {selectedMasterJob.clientPhone}
                    </a>
                  </div>
                  <a
                    href={`tel:${selectedMasterJob.clientPhone.replace(/\s+/g, '')}`}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold text-center"
                  >
                    Paskambinti
                  </a>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-900 font-semibold">
                Kliento vardas ir telefono numeris atveriami iškart, kai klientas patvirtina jūsų
                pasiūlymą šiam užsakymui.
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODALAS: MEISTRO KABINETE VISI ATSILIEPIMAI IR ĮVERTINIMAI */}
      {masterReviewsModalOpen && currentMaster && (
        <div
          onClick={() => setMasterReviewsModalOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-2xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {currentMaster.name} – atsiliepimai ir įvertinimai
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bendras įvertinimas:{' '}
                  <strong className="text-amber-600">
                    ★ {Number(currentMaster.rating || 5).toFixed(1)}
                  </strong>{' '}
                  • Viso atsiliepimų: <strong>{currentMaster.reviews.length}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMasterReviewsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {currentMaster.reviews.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                Atsiliepimų dar nėra.
              </p>
            ) : (
              <div className="space-y-3">
                {currentMaster.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">{rev.author}</span>
                      <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800 font-extrabold">
                        ★ {rev.rating} / 5
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{rev.comment}</p>
                    <div className="text-[11px] text-slate-400">{rev.date}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODALAS: KOMPAKTIŠKAS MEISTRO PROFILIO LANGAS KLIENTUI ("max-w-md") */}
      {profileModalMaster && (
        <div
          onClick={() => setProfileModalMasterId(null)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-2xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 space-y-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                {profileModalMaster.avatarUrl ? (
                  <img
                    src={profileModalMaster.avatarUrl}
                    alt={profileModalMaster.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 font-black flex items-center justify-center text-base">
                    {profileModalMaster.name
                      .split(' ')
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                )}
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {profileModalMaster.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    📍 {profileModalMaster.city} • ★ {profileModalMaster.rating.toFixed(1)} (
                    {profileModalMaster.reviews.length})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setProfileModalMasterId(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {profileModalMaster.categories.map((cat) => (
                <span
                  key={cat}
                  className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  {cat}
                </span>
              ))}
              {profileModalMaster.certified && (
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold">
                  ✓ Sertifikuotas
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{profileModalMaster.bio}</p>

            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Atsiliepimai ({profileModalMaster.reviews.length})
              </h4>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {profileModalMaster.reviews.length === 0 ? (
                  <p className="text-xs text-slate-400">Atsiliepimų dar nėra.</p>
                ) : (
                  profileModalMaster.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-xl bg-slate-50 border border-slate-200/70 p-3 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span>{rev.author}</span>
                        <span className="text-amber-600">★ {rev.rating}</span>
                      </div>
                      <p className="text-slate-600">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALAS: ATSILIEPIMO PALIKIMAS ANT PATVIRTINTO UŽSAKYMO */}
      {reviewModalJob && (
        <div
          onClick={() => setReviewModalJob(null)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-2xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600">
                  Atsiliepimas apie užsakymą
                </span>
                <h3 className="font-extrabold text-base text-slate-900">
                  {reviewModalJob.jobTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReviewModalJob(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  required
                  value={reviewForm.author}
                  onChange={(e) =>
                    setReviewForm((prev) => ({ ...prev, author: e.target.value }))
                  }
                  placeholder="Jūsų vardas"
                  className="col-span-2 px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
                <select
                  value={reviewForm.rating}
                  onChange={(e) =>
                    setReviewForm((prev) => ({ ...prev, rating: Number(e.target.value) }))
                  }
                  className="px-2 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      ★ {n}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                rows={3}
                required
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm((prev) => ({ ...prev, comment: e.target.value }))
                }
                placeholder="Parašykite atsiliepimą apie meistro darbą..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold cursor-pointer"
              >
                Išsaugoti atsiliepimą
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODALAS: ADMINISTRATORIAUS MEISTRO VALDYMO LANGAS */}
      {selectedAdminMaster && (
        <div
          onClick={() => setSelectedAdminMasterId(null)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-2xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">{selectedAdminMaster.name}</h3>
                <p className="text-xs text-slate-500">
                  📍 {selectedAdminMaster.city} • {selectedAdminMaster.phone} •{' '}
                  {selectedAdminMaster.email || 'El. paštas nenurodytas'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAdminMasterId(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {selectedAdminMaster.status !== 'patvirtintas' && (
                <button
                  type="button"
                  onClick={() => handleApproveMaster(selectedAdminMaster.id)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold cursor-pointer"
                >
                  ✓ Patvirtinti meistrą
                </button>
              )}

              <button
                type="button"
                onClick={() => handleToggleBlockMaster(selectedAdminMaster.id)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold cursor-pointer"
              >
                {selectedAdminMaster.status === 'uzblokuotas'
                  ? 'Atblokuoti meistrą'
                  : 'Užblokuoti meistrą'}
              </button>

              <button
                type="button"
                onClick={() => handleDeleteMaster(selectedAdminMaster.id)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold cursor-pointer"
              >
                Pašalinti meistrą
              </button>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Meistro balansas
                </span>
                <span className="text-base font-black text-emerald-600">
                  {Number(selectedAdminMaster.balance).toFixed(2)} €
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="number"
                  step="1"
                  value={adminBalanceAdjustInput}
                  onChange={(e) => setAdminBalanceAdjustInput(e.target.value)}
                  className="w-28 px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleAdminAdjustBalance(
                      selectedAdminMaster.id,
                      Math.abs(Number(adminBalanceAdjustInput || 0))
                    )
                  }
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold cursor-pointer"
                >
                  + Pridėti prie balanso
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleAdminAdjustBalance(
                      selectedAdminMaster.id,
                      -Math.abs(Number(adminBalanceAdjustInput || 0))
                    )
                  }
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-extrabold cursor-pointer"
                >
                  - Nurašyti iš balanso
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Visi atsiliepimai ({selectedAdminMaster.reviews.length})
              </h4>

              {selectedAdminMaster.reviews.length === 0 ? (
                <p className="text-xs text-slate-400">Šis meistras neturi atsiliepimų.</p>
              ) : (
                <div className="space-y-2">
                  {selectedAdminMaster.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-xl border border-slate-200 p-3 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-slate-900">
                          {rev.author} • <span className="text-amber-600">★ {rev.rating}</span>{' '}
                          <span className="text-slate-400 font-normal">({rev.date})</span>
                        </div>
                        <p className="text-slate-600">{rev.comment}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleAdminDeleteReview(selectedAdminMaster.id, rev.id)
                        }
                        className="px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-bold shrink-0 cursor-pointer"
                      >
                        Trinti
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODALAS: TAPTI MEISTRU + SMS PATVIRTINIMO KODAS */}
      {becomeMasterOpen && (
        <div
          onClick={() => setBecomeMasterOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-2xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600">
                  Meistro registracija
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {smsStep === 'form'
                    ? 'Tapti meistru namupagalba.lt'
                    : 'SMS kodo patvirtinimas'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBecomeMasterOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {smsStep === 'form' ? (
              <form onSubmit={handleRequestSmsCode} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Vardas, pavardė *
                    </label>
                    <input
                      type="text"
                      required
                      value={masterRegForm.name}
                      onChange={(e) =>
                        setMasterRegForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Pvz., Jonas Jonaitis"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Telefono numeris *
                    </label>
                    <input
                      type="tel"
                      required
                      value={masterRegForm.phone}
                      onChange={(e) =>
                        setMasterRegForm((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      placeholder="+370 6XX XXXXX"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Miestas</label>
                    <select
                      value={masterRegForm.city}
                      onChange={(e) =>
                        setMasterRegForm((prev) => ({ ...prev, city: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold"
                    >
                      {CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      El. paštas
                    </label>
                    <input
                      type="email"
                      value={masterRegForm.email}
                      onChange={(e) =>
                        setMasterRegForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="meistras@pavyzdys.lt"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Paslaugų sritys
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((cat) => {
                      const active = masterRegForm.categories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleRegMasterCategory(cat)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-bold border cursor-pointer ${
                            active
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-slate-700 border-slate-300'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Prisistatymas
                  </label>
                  <textarea
                    rows={2}
                    value={masterRegForm.bio}
                    onChange={(e) =>
                      setMasterRegForm((prev) => ({ ...prev, bio: e.target.value }))
                    }
                    placeholder="Trumpai apie jūsų patirtį ir atliekamus darbus..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={masterRegForm.certified}
                    onChange={(e) =>
                      setMasterRegForm((prev) => ({ ...prev, certified: e.target.checked }))
                    }
                  />
                  <span>Turiu kvalifikaciją / sertifikuoto meistro žymą</span>
                </label>

                {smsError && <p className="text-xs font-bold text-red-600">{smsError}</p>}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm cursor-pointer"
                >
                  Gauti SMS patvirtinimo kodą
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifySmsCode} className="space-y-4">
                <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4 text-xs text-blue-900 space-y-1">
                  <p>
                    Išsiuntėme SMS kodą į numerį <strong>{masterRegForm.phone}</strong>.
                  </p>
                  <p>
                    Testavimo SMS kodas: <strong className="text-sm">{generatedSmsCode}</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Įveskite 4 skaitmenų SMS kodą
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    required
                    value={enteredSmsCode}
                    onChange={(e) => {
                      setEnteredSmsCode(e.target.value);
                      setSmsError('');
                    }}
                    placeholder="1234"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-center text-lg font-black tracking-widest"
                  />
                </div>

                {smsError && <p className="text-xs font-bold text-red-600">{smsError}</p>}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm cursor-pointer"
                >
                  Patvirtinti SMS kodą
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const nextCode = String(Math.floor(1000 + Math.random() * 9000));
                      setGeneratedSmsCode(nextCode);
                      setSmsError('');
                      notify(`Naujas SMS kodas išsiųstas į ${masterRegForm.phone}`);
                    }}
                    className="font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Siųsti kodą dar kartą
                  </button>

                  <button
                    type="button"
                    onClick={completeMasterRegistration}
                    className="font-bold text-slate-600 hover:text-slate-900 underline cursor-pointer"
                  >
                    Greitas patvirtinimas (testui)
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );

  // ==========================================================================
  // PAGRINDINIS GRĄŽINAMAS VAIZDAS
  // ==========================================================================

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 text-slate-900 flex flex-col pb-16 sm:pb-0">
      {renderHeader()}

      <main className="flex-1 w-full">
        {activeView === 'home' && renderHomeView()}
        {activeView === 'client' && renderClientView()}
        {activeView === 'master' && renderMasterView()}
        {activeView === 'admin' && renderAdminView()}
      </main>

      {renderModals()}

      {/* MOBILI APATINĖ GREITOS NAVIGACIJOS JUOSTA */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around gap-1">
        <button
          type="button"
          onClick={() => {
            setActiveView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 py-2 px-2 rounded-xl text-[11px] font-bold transition cursor-pointer ${
            activeView === 'home'
              ? 'bg-blue-50 text-blue-700'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Pradžia
        </button>
        <button
          type="button"
          onClick={() => goToClientForm()}
          className={`flex-1 py-2 px-2 rounded-xl text-[11px] font-bold transition cursor-pointer ${
            activeView === 'client' && clientSubView === 'form'
              ? 'bg-blue-50 text-blue-700'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Užklausa
        </button>
        <button
          type="button"
          onClick={goToClientOrders}
          className={`flex-1 py-2 px-2 rounded-xl text-[11px] font-bold transition cursor-pointer ${
            activeView === 'client' && clientSubView === 'orders'
              ? 'bg-blue-50 text-blue-700'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Užsakymai
        </button>
        <button
          type="button"
          onClick={() => setActiveView('master')}
          className={`flex-1 py-2 px-2 rounded-xl text-[11px] font-bold transition cursor-pointer ${
            activeView === 'master'
              ? 'bg-blue-50 text-blue-700'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Meistras
        </button>
      </div>

      {/* PRANEŠIMŲ JUOSTA (TOAST) */}
      {toast && (
        <div className="fixed bottom-20 sm:bottom-5 right-4 left-4 sm:left-auto z-50 max-w-sm sm:ml-auto">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border text-xs sm:text-sm font-bold flex items-center gap-2.5 ${
              toast.type === 'error'
                ? 'bg-red-950 text-white border-red-700'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                toast.type === 'error' ? 'bg-red-400' : 'bg-emerald-400'
              }`}
            />
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
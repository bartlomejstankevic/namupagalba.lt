import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Wrench,
  CheckCircle2,
  ShieldCheck,
  Lock,
  MapPin,
  Trash2,
  X,
  Briefcase,
  ChevronRight,
  Camera,
  ArrowRight,
  HelpCircle,
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
  'Smulkūs remonto darbai':
    'Lentynų, paveikslų, karnizų tvirtinimas, durų vyrių reguliavimas, spynų keitimas ir kiti smulkūs buities darbai.',
  Santechnika:
    'Maišytuvų, kriauklių, sifonų, unitazo mechanizmų keitimas ar remontas, nuotėkių šalinimas, skalbyklių pajungimas.',
  Elektra:
    'Rozetių, jungiklių, šviestuvų ar LED juostų montavimas ir keitimas, saugiklių patikra bei smulkūs elektros gedimai.',
  'Baldų surinkimas':
    'IKEA ir kitų gamintojų spintų, lovų, komodų, virtuvės ar biuro baldų surinkimas bei reguliavimas.',
  'Namų tvarkymas':
    'Generalinis ar periodinis butų ir namų tvarkymas, paviršių valymas, tvarkos palaikymas po remonto.',
  'Baldų valymas':
    'Sofų, čiužinių, fotelių ar kilimų giluminis valymas, dėmių ir kvapų šalinimas.',
  'Buitinė technika':
    'Skalbyklių, indaplovių, orkaičių, kaitlenčių ar gartraukių pajungimas, patikra ir smulkus remontas.'
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
    status: 'patvirtintas',
    balance: 18.0,
    rating: 4.9,
    avatarUrl: '',
    reviews: [
      {
        id: 'r-1',
        author: 'Aistė M.',
        rating: 5,
        comment:
          'Labai greitai ir tvarkingai surinko didelę drabužių spintą bei pakabino veidrodį. Tikrai rekomenduoju.',
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
    invoiceDetails: {
      companyOrPersonName: 'Mantas Vasiliauskas (IV)',
      codeOrVat: '304882190',
      address: 'Lazdynai, Vilnius',
      invoiceEmail: 'mantas.v@namupagalba.lt'
    },
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
    invoiceDetails: {
      companyOrPersonName: 'Andrius Grigas (IV)',
      codeOrVat: '306112233',
      address: 'Centras, Kaunas',
      invoiceEmail: 'andrius.g@namupagalba.lt'
    },
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
    invoiceDetails: {
      companyOrPersonName: 'Donatas Mockus (IV)',
      codeOrVat: '307445566',
      address: 'Klaipėda',
      invoiceEmail: 'donatas.m@namupagalba.lt'
    },
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
    createdAtMs: Date.now() - 25 * 60 * 1000,
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
    createdAtMs: Date.now() - 60 * 60 * 1000,
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
    createdAtMs: Date.now() - 3 * 60 * 60 * 1000,
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

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// Ištrintos meistrų paskyros: 30 d. galima atkurti, tiek pat laiko telefonas užblokuotas naujai registracijai
const DELETION_GRACE_DAYS = 30;
const DELETION_GRACE_MS = DELETION_GRACE_DAYS * 24 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const imageFileToDataUrl = (file, maxSize, onDone, onError) => {
  const reader = new FileReader();
  reader.onerror = () => onError && onError();
  reader.onload = () => {
    const img = new Image();
    img.onerror = () => onError && onError();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(img.width * scale));
      c.height = Math.max(1, Math.round(img.height * scale));
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      onDone(c.toDataURL('image/jpeg', 0.82));
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
};
const normPhone = (p) => {
  let d = String(p || '').replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  if (d.startsWith('8') && d.length === 9) d = '370' + d.slice(1);
  return d;
};

const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-1',
    masterId: 'm-2',
    masterName: 'Mantas Vasiliauskas',
    type: 'Balanso papildymas',
    amount: 15.0,
    invoiceRequested: true,
    invoiceNumber: 'NP-2026-1001',
    invoiceSentTo: 'mantas.v@namupagalba.lt',
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
    invoiceNumber: 'NP-2026-1002',
    invoiceSentTo: 'tomas.k@namupagalba.lt',
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
  },
  {
    q: 'Kaip veikia platforma meistrams?',
    a: 'Užsiregistruojate ir patvirtinate telefono numerį SMS kodu. Naršote klientų užklausas savo mieste ir srityje, pateikiate pasiūlymą su kaina ir atvykimo laiku, o kai klientas pasirenka jus – gaunate kliento kontaktus. Startinis kreditas leidžia atlikti pirmuosius 2 patvirtintus užsakymus nemokamai, vėliau balansą galite papildyti ir gauti sąskaitą faktūrą. Paslauga meistrams kainuoja 3 € už kiekvieną užsakymą, kai klientas pasirenka būtent jus. Registracija, profilis, užklausų naršymas ir pasiūlymų teikimas nemokami, mėnesinio mokesčio nėra.'
  }
];

const LEGAL_DOCS = {
  gdpr: {
    title: 'Privatumo politika ir BDAR (GDPR)',
    updated: 'Atnaujinta: 2026-11-24',
    sections: [
      {
        heading: '1. Duomenų valdytojas',
        body: 'Asmens duomenų valdytojas yra namupagalba.lt platformos operatorius (juridinio asmens ar individualios veiklos vykdytojo pavadinimas, kodas ir adresas bus nurodyti čia po veiklos registracijos). Duomenys tvarkomi vadovaujantis Europos Sąjungos Bendruoju duomenų apsaugos reglamentu (ES) 2016/679 (BDAR) ir Lietuvos Respublikos asmens duomenų teisinės apsaugos įstatymu. Kontaktai duomenų apsaugos klausimais: info@namupagalba.lt.'
      },
      {
        heading: '2. Kokius duomenis renkame',
        body: 'Klientai (be registracijos): vardas, telefono numeris, miestas, rajonas, darbo pavadinimas ir aprašymas, pageidaujamas laikas bei neprivaloma viena nuotrauka. Tikslaus namų adreso neprašome. Meistrai: vardas, pavardė, telefono numeris, el. paštas, miestas, paslaugų sritys, aprašymas, profilio nuotrauka, klientų atsiliepimai, sąskaitų faktūrų rekvizitai (pavadinimas, kodas, adresas, el. paštas) ir balanso operacijos. Techniniai duomenys: SMS patvirtinimo duomenys, IP adresas, naršyklės tipas ir slapukai (žr. Slapukų politiką).'
      },
      {
        heading: '3. Tikslai ir teisiniai pagrindai',
        body: 'Užklausų ir pasiūlymų tarpininkavimas bei kliento kontaktų atskleidimas pasirinktam meistrui – sutarties vykdymas (BDAR 6 str. 1 d. b p.). Telefono numerio patvirtinimas SMS kodu, apsauga nuo sukčiavimo ir piktnaudžiavimo, paskyrų blokavimas po ištrynimo – teisėtas interesas (6 str. 1 d. f p.). Balanso operacijos, sąskaitos faktūros ir apskaita – teisinė prievolė (6 str. 1 d. c p.). Funkciniai ir analitiniai slapukai – jūsų sutikimas (6 str. 1 d. a p.), kurį galite bet kada atšaukti.'
      },
      {
        heading: '4. Kam perduodame duomenis',
        body: 'Kliento vardas ir telefono numeris parodomi tik tam vienam meistrui, kurį klientas pasirenka. Meistrai iki pasirinkimo mato tik miestą, rajoną, užduoties aprašymą ir nuotrauką. Duomenis kaip duomenų tvarkytojai pagal sutartis gali gauti svetainės talpinimo, SMS siuntimo, mokėjimų ir apskaitos paslaugų teikėjai, taip pat valstybės institucijos, kai to reikalauja teisės aktai. Duomenų neparduodame ir netvarkome trečiųjų šalių rinkodaros tikslais. Jei duomenys būtų perduodami už ES / EEE ribų, taikysime BDAR numatytas apsaugos priemones (pvz., standartines sutarčių sąlygas).'
      },
      {
        heading: '5. Saugojimo terminai',
        body: 'Kliento užklausa galioja 7 dienas, vėliau duomenys saugomi tik tiek, kiek reikia ginčams ir skundams išnagrinėti (ne ilgiau kaip 12 mėnesių). Meistrų duomenys saugomi, kol paskyra aktyvi. Meistrui ar administratoriui ištrynus paskyrą, ji 30 dienų laikoma, kad klaidingą ištrynimą būtų galima atkurti; per tą laiką su tuo pačiu telefono numeriu registruotis negalima. Praėjus 30 dienų paskyra ir jos duomenys ištrinami automatiškai. Sąskaitų faktūrų ir apskaitos duomenys saugomi teisės aktų nustatytą laiką. SMS patvirtinimo kodai saugomi tik tiek, kiek reikia patvirtinimui.'
      },
      {
        heading: '6. Privatumas pagal numatymą',
        body: 'Renkame kuo mažiau duomenų: neprašome tikslaus namų adreso, o kliento telefono numeris neviešinamas. Prašome nuotraukose nerodyti žmonių veidų, dokumentų ar kitos asmeninės informacijos, nes užklausos nuotrauką mato meistrai.'
      },
      {
        heading: '7. Jūsų teisės',
        body: 'Turite teisę susipažinti su savo duomenimis, reikalauti juos ištaisyti ar ištrinti („teisė būti pamirštam“), apriboti jų tvarkymą, gauti jų kopiją perkeliamu formatu, nesutikti su tvarkymu teisėto intereso pagrindu ir bet kada atšaukti duotą sutikimą. Platforma nenaudoja vien automatizuotų sprendimų ar profiliavimo, darančio teisinį poveikį. Kreipkitės el. paštu info@namupagalba.lt arba per skiltį „Pagalba“, atsakysime per vieną mėnesį. Jei manote, kad jūsų teisės pažeistos, galite pateikti skundą Valstybinei duomenų apsaugos inspekcijai (www.vdai.lrv.lt).'
      },
      {
        heading: '8. Slapukai ir pakeitimai',
        body: 'Slapukų naudojimą ir jūsų pasirinkimus aprašo Slapukų politika; pasirinkimą galite keisti bet kada svetainės apačioje paspaudę „Slapukų nustatymai“. Šią politiką galime atnaujinti, o galiojančią versiją ir atnaujinimo datą visada rasite čia.'
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
    updated: 'Atnaujinta: 2026-11-24',
    sections: [
      {
        heading: '1. Kas yra slapukai?',
        body: 'Slapukai – tai nedideli tekstiniai failai, kuriuos jūsų naršyklė išsaugo įrenginyje, kad svetainė veiktų sklandžiai, prisimintų jūsų pasirinkimus ir užtikrintų saugumą.'
      },
      {
        heading: '2. Slapukų kategorijos',
        body: 'Būtinieji – reikalingi svetainės veikimui, saugumui ir jūsų slapukų pasirinkimui išsaugoti; jų išjungti negalima. Funkciniai – prisimena jūsų nustatymus (pvz., pasirinktą miestą) ir patogumo pasirinkimus; naudojami tik jums sutikus. Analitiniai – padeda suprasti, kaip naudojamasi svetaine, ir ją tobulinti, duomenys naudojami apibendrintai; naudojami tik jums sutikus. Rinkodaros slapukų nenaudojame; jei pradėsime, prašysime atskiro sutikimo.'
      },
      {
        heading: '3. Jūsų sutikimas ir jo valdymas',
        body: 'Pirmą kartą apsilankius parodome pranešimą, kuriame galite priimti visus slapukus, palikti tik būtinuosius arba pasirinkti kategorijas nustatymuose. Pasirinkimą išsaugome jūsų naršyklėje. Jį galite pakeisti ar atšaukti bet kada paspaudę „Slapukų nustatymai“ svetainės apačioje. Atsisakius neprivalomų slapukų, svetainė toliau veikia.'
      },
      {
        heading: '4. Naršyklės nustatymai',
        body: 'Slapukus taip pat galite ištrinti arba užblokuoti savo interneto naršyklės nustatymuose. Užblokavus būtinuosius slapukus, kai kurios svetainės funkcijos gali neveikti.'
      }
    ]
  }
};

// ============================================================================
// PAGRINDINIS KOMPONENTAS
// ============================================================================

export default function App() {
  // --- PAGRINDINĖ NAVIGACIJA IR REŽIMAI ---
  const [activeView, setActiveView] = useState('home'); // 'home' | 'client' | 'master' | 'admin'
  const [clientSubView, setClientSubView] = useState('form'); // 'form' | 'orders' | 'support'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLegalDoc, setActiveLegalDoc] = useState(null); // null | 'gdpr' | 'terms' | 'cookies'
  const [cookieConsent, setCookieConsent] = useState(() => {
    try {
      const raw = window.localStorage.getItem('np_cookie_consent_v1');
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  });
  const [cookieSettingsOpen, setCookieSettingsOpen] = useState(false);
  const saveCookieConsent = (choice) => {
    const value = {
      necessary: true,
      functional: Boolean(choice.functional),
      analytics: Boolean(choice.analytics),
      savedAt: new Date().toISOString()
    };
    setCookieConsent(value);
    setCookieSettingsOpen(false);
    try {
      window.localStorage.setItem('np_cookie_consent_v1', JSON.stringify(value));
    } catch (err) {
      /* naršyklė neleidžia saugoti – pasirinkimas galioja tik šiai sesijai */
    }
  };
  const [howItWorksModalOpen, setHowItWorksModalOpen] = useState(false);

  // --- PRISIJUNGIMO PER TELEFONĄ + SMS KODĄ BŪSENA (KLIENTAS IR MEISTRAS) ---
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginRole, setLoginRole] = useState('client'); // 'client' | 'master'
  const [loginPhoneInput, setLoginPhoneInput] = useState('');
  const [loginSmsSentCode, setLoginSmsSentCode] = useState('');
  const [loginSmsEnteredCode, setLoginSmsEnteredCode] = useState('');
  const [loginError, setLoginError] = useState('');

  const [isClientLoggedIn, setIsClientLoggedIn] = useState(false);
  const [clientSession, setClientSession] = useState({ name: '', phone: '' });
  const [isMasterLoggedIn, setIsMasterLoggedIn] = useState(false);

  // --- KLIENTO UŽKLAUSOS SMS PATVIRTINIMO MODALO BŪSENA ---
  const [clientJobSmsModalOpen, setClientJobSmsModalOpen] = useState(false);
  const [pendingClientJobData, setPendingClientJobData] = useState(null);
  const [clientJobSmsSentCode, setClientJobSmsSentCode] = useState('');
  const [clientJobSmsEnteredCode, setClientJobSmsEnteredCode] = useState('');
  const [clientJobSmsError, setClientJobSmsError] = useState('');

  // --- PRISIJUNGIMO BŪSENOS (KLIENTAS / MEISTRAS / ADMIN) ---
  const [loginModalRole, setLoginModalRole] = useState(null); // null | 'client' | 'master' | 'admin'
  const [isClientLoggedIn, setIsClientLoggedIn] = useState(false);
  const [clientSession, setClientSession] = useState({ name: '', phone: '' });
  const [clientLoginForm, setClientLoginForm] = useState({ name: '', phone: '' });
  const [clientLoginError, setClientLoginError] = useState('');

  const [isMasterLoggedIn, setIsMasterLoggedIn] = useState(false);
  const [masterLoginInput, setMasterLoginInput] = useState('+370 612 34567');
  const [masterLoginSmsCode, setMasterLoginSmsCode] = useState('');
  const [masterLoginSentCode, setMasterLoginSentCode] = useState('');
  const [masterLoginError, setMasterLoginError] = useState('');

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminLoginForm, setAdminLoginForm] = useState({ email: '', password: '' });
  const [adminLoginError, setAdminLoginError] = useState('');

  // --- DUOMENŲ BŪSENOS ---
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [masters, setMasters] = useState(INITIAL_MASTERS);
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  // Automatiškai pašaliname senesnius nei 7 dienų užsakymus
  useEffect(() => {
    const pruneExpiredJobs = () => {
      const cutoff = Date.now() - SEVEN_DAYS_MS;
      setJobs((prev) =>
        prev.filter((job) => {
          if (typeof job.createdAtMs === 'number') {
            return job.createdAtMs > cutoff;
          }
          return true;
        })
      );
    };

    pruneExpiredJobs();
    const intervalId = window.setInterval(pruneExpiredJobs, 60 * 1000);
    return () => window.clearInterval(intervalId);
  }, []);

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

  // --- MEISTRO PROFILIO IR ATSILIEPIMŲ MODALŲ BŪSENOS ---
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
      message:
        'Sveiki, norėčiau pasitikslinti dėl sąskaitos faktūros už paskutinį balanso papildymą.',
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
  const [adminSubTab, setAdminSubTab] = useState('masters');
  const [deletedMasters, setDeletedMasters] = useState([]); // { master, deletedAt, deletedBy, jobSnapshots }

  useEffect(() => {
    const purge = () =>
      setDeletedMasters((prev) => {
        const now = Date.now();
        const keep = prev.filter((e) => now - e.deletedAt < DELETION_GRACE_MS);
        return keep.length === prev.length ? prev : keep;
      });
    purge();
    const t = setInterval(purge, 60 * 1000);
    return () => clearInterval(t);
  }, []);
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
      category: category || prev.category,
      clientName: isClientLoggedIn && clientSession.name ? clientSession.name : prev.clientName,
      clientPhone: isClientLoggedIn && clientSession.phone ? clientSession.phone : prev.clientPhone
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

  // --- ROLE-BASED PRISIJUNGIMO VALDYMAS ---
  const openRoleLoginModal = (role) => {
    setMobileMenuOpen(false);
<<<<<<< HEAD
    if (section === 'how') {
      setHowItWorksModalOpen(true);
      return;
=======
    if (role === 'client') {
      if (isClientLoggedIn) {
        setClientSubView('form');
        setActiveView('client');
        return;
      }
      setClientLoginForm({
        name: clientSession.name || jobForm.clientName || '',
        phone: clientSession.phone || jobForm.clientPhone || ''
      });
      setClientLoginError('');
      setLoginModalRole('client');
      return;
    }

    if (role === 'master') {
      if (isMasterLoggedIn && currentMaster) {
        setActiveView('master');
        return;
      }
      setMasterLoginSentCode('');
      setMasterLoginSmsCode('');
      setMasterLoginError('');
      setLoginModalRole('master');
      return;
    }

    if (role === 'admin') {
      if (isAdminLoggedIn) {
        setActiveView('admin');
        return;
      }
      setAdminLoginForm({ email: '', password: '' });
      setAdminLoginError('');
      setLoginModalRole('admin');
    }
  };

  const handleClientLoginSubmit = (e) => {
    e.preventDefault();
    const cleanPhone = clientLoginForm.phone.trim();
    if (!cleanPhone) {
      setClientLoginError('Įveskite savo telefono numerį.');
      return;
    }
    const cleanName = clientLoginForm.name.trim() || 'Klientas';
    setClientSession({ name: cleanName, phone: cleanPhone });
    setIsClientLoggedIn(true);
    setJobForm((prev) => ({
      ...prev,
      clientName: cleanName,
      clientPhone: cleanPhone
    }));
    setClientLoginError('');
    setLoginModalRole(null);
    setClientSubView('form');
    setActiveView('client');
    notify(`Prisijungėte kaip klientas (${cleanName}).`);
  };

  const handleSendMasterLoginCode = () => {
    const cleanPhone = masterLoginInput.trim();
    if (!cleanPhone) {
      setMasterLoginError('Įveskite meistro telefono numerį.');
      return;
    }
    const matchedMaster = masters.find(
      (m) => m.phone.replace(/\s+/g, '') === cleanPhone.replace(/\s+/g, '')
    );
    if (!matchedMaster) {
      setMasterLoginError(
        'Meistras su tokiu telefono numeriu nerastas. Patikrinkite numerį arba spauskite „Tapti meistru“.'
      );
      return;
    }
    const code = String(Math.floor(1000 + Math.random() * 9000));
    setCurrentMasterId(matchedMaster.id);
    setMasterLoginSentCode(code);
    setMasterLoginSmsCode(code);
    setMasterLoginError('');
    notify(`SMS kodas išsiųstas meistrui ${matchedMaster.name} (${matchedMaster.phone}).`);
  };

  const handleMasterLoginSubmit = (e) => {
    e.preventDefault();
    const cleanPhone = masterLoginInput.trim();
    const matchedMaster =
      masters.find((m) => m.phone.replace(/\s+/g, '') === cleanPhone.replace(/\s+/g, '')) ||
      masters.find((m) => m.id === currentMasterId);

    if (!matchedMaster) {
      setMasterLoginError('Nerastas meistro profilis.');
      return;
    }

    if (matchedMaster.status === 'uzblokuotas') {
      setMasterLoginError('Ši meistro paskyra yra užblokuota. Kreipkitės į administratorių.');
      return;
    }

    if (!masterLoginSentCode) {
      setMasterLoginError('Pirmiausia paspauskite „Gauti SMS kodą“ arba naudokite greitą prisijungimą.');
      return;
    }

    if (masterLoginSmsCode.trim() !== masterLoginSentCode) {
      setMasterLoginError('Neteisingas SMS patvirtinimo kodas.');
      return;
    }

    setCurrentMasterId(matchedMaster.id);
    setIsMasterLoggedIn(true);
    setMasterLoginError('');
    setLoginModalRole(null);
    setActiveView('master');
    notify(`Sveiki sugrįžę, ${matchedMaster.name}!`);
  };

  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    const cleanEmail = adminLoginForm.email.trim().toLowerCase();
    const cleanPass = adminLoginForm.password.trim();
    if (!cleanEmail || !cleanPass) {
      setAdminLoginError('Įveskite administratoriaus el. paštą ir slaptažodį.');
      return;
    }
    const isValidAdmin =
      (cleanEmail === 'admin@namupagalba.lt' && cleanPass.length >= 4) ||
      (cleanEmail.includes('admin') && cleanPass.length >= 6);

    if (!isValidAdmin) {
      setAdminLoginError(
        'Neteisingi duomenys. Naudokite admin@namupagalba.lt ir slaptažodį (bent 6 simboliai).'
      );
      return;
    }

    setIsAdminLoggedIn(true);
    setAdminLoginError('');
    setLoginModalRole(null);
    setActiveView('admin');
    notify('Sėkmingai prisijungėte prie administratoriaus panelės.');
  };

  const handleLogoutRole = (role) => {
    if (role === 'client') {
      setIsClientLoggedIn(false);
      setClientSession({ name: '', phone: '' });
      if (activeView === 'client') setActiveView('home');
      notify('Atsijungėte nuo kliento paskyros.');
    } else if (role === 'master') {
      setIsMasterLoggedIn(false);
      if (activeView === 'master') setActiveView('home');
      notify('Atsijungėte nuo meistro kabineto.');
    } else if (role === 'admin') {
      setIsAdminLoggedIn(false);
      if (activeView === 'admin') setActiveView('home');
      notify('Atsijungėte nuo administratoriaus panelės.');
>>>>>>> 890a9086a604ab17944e25193392f52db7d4a9aa
    }
    const targetRef =
      section === 'services'
        ? howItWorksRef
        : section === 'catalog'
        ? catalogSectionRef
        : section === 'faq'
        ? faqSectionRef
        : howItWorksRef;

    if (activeView !== 'home') {
      setActiveView('home');
      window.requestAnimationFrame(() => {
        scrollToSection(targetRef);
      });
      return;
    }
    scrollToSection(targetRef);
  };

  // ==========================================================================
  // PRISIJUNGIMAS PER TELEFONO NUMERĮ + SMS KODĄ (KLIENTAS IR MEISTRAS)
  // ==========================================================================

  const currentMaster = useMemo(
    () => masters.find((m) => m.id === currentMasterId) || masters[0] || null,
    [masters, currentMasterId]
  );

  const openLoginModal = (role = 'client') => {
    const validRole = role === 'master' ? 'master' : 'client';
    setLoginRole(validRole);
    setLoginPhoneInput(
      validRole === 'master'
        ? currentMaster?.phone || '+370 612 34567'
        : clientSession.phone || jobForm.clientPhone || ''
    );
    setLoginSmsSentCode('');
    setLoginSmsEnteredCode('');
    setLoginError('');
    setLoginModalOpen(true);
    setMobileMenuOpen(false);
  };

  const handleSendLoginSmsCode = () => {
    const cleanPhone = loginPhoneInput.trim();
    if (!cleanPhone) {
      setLoginError('Įveskite telefono numerį.');
      return;
    }

    if (loginRole === 'master') {
      const foundMaster = masters.find(
        (m) => m.phone.replace(/\s+/g, '') === cleanPhone.replace(/\s+/g, '')
      );
      if (!foundMaster) {
        setLoginError(
          'Meistras su tokiu telefono numeriu nerastas. Patikrinkite numerį arba spauskite „Tapti meistru“.'
        );
        return;
      }
      setCurrentMasterId(foundMaster.id);
    }

    const code = String(Math.floor(1000 + Math.random() * 9000));
    setLoginSmsSentCode(code);
    setLoginSmsEnteredCode(code);
    setLoginError('');
    notify(`SMS patvirtinimo kodas išsiųstas į ${cleanPhone}.`);
  };

  const handleVerifyLoginSmsSubmit = (e) => {
    e.preventDefault();
    const cleanPhone = loginPhoneInput.trim();
    if (!cleanPhone) {
      setLoginError('Įveskite telefono numerį.');
      return;
    }

    if (!loginSmsSentCode) {
      setLoginError('Pirmiausia paspauskite „Gauti SMS kodą“.');
      return;
    }

    if (loginSmsEnteredCode.trim() !== loginSmsSentCode) {
      setLoginError('Neteisingas SMS kodas. Patikrinkite kodą ir bandykite dar kartą.');
      return;
    }

    if (loginRole === 'master') {
      const foundMaster =
        masters.find((m) => m.phone.replace(/\s+/g, '') === cleanPhone.replace(/\s+/g, '')) ||
        masters.find((m) => m.id === currentMasterId);

      if (!foundMaster) {
        setLoginError('Nerastas meistro profilis.');
        return;
      }
      if (foundMaster.status === 'uzblokuotas') {
        setLoginError('Ši meistro paskyra užblokuota.');
        return;
      }

      setCurrentMasterId(foundMaster.id);
      setIsMasterLoggedIn(true);
      setLoginModalOpen(false);
      setActiveView('master');
      notify(`Prisijungėte prie meistro kabineto (${foundMaster.name}).`);
      return;
    }

    const existingJob = jobs.find(
      (j) => j.clientPhone.replace(/\s+/g, '') === cleanPhone.replace(/\s+/g, '')
    );
    const derivedName =
      (existingJob && existingJob.clientName) || jobForm.clientName.trim() || 'Klientas';

    setClientSession({ name: derivedName, phone: cleanPhone });
    setIsClientLoggedIn(true);
    setJobForm((prev) => ({
      ...prev,
      clientName: derivedName,
      clientPhone: cleanPhone
    }));
    setLoginModalOpen(false);
    setClientSubView('orders');
    setActiveView('client');
    notify(`Prisijungėte kaip klientas (${cleanPhone}).`);
  };

  const handleLogoutRole = (role) => {
    if (role === 'client') {
      setIsClientLoggedIn(false);
      setClientSession({ name: '', phone: '' });
      if (activeView === 'client') setActiveView('home');
      notify('Atsijungėte nuo kliento paskyros.');
    } else if (role === 'master') {
      setIsMasterLoggedIn(false);
      if (activeView === 'master') setActiveView('home');
      notify('Atsijungėte nuo meistro kabineto.');
    }
  };

  // ==========================================================================
  // IŠVESTINIAI DUOMENYS (MEMOIZED)
  // ==========================================================================

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

  const ownClientJobs = useMemo(() => {
    const activePhone = (isClientLoggedIn ? clientSession.phone : jobForm.clientPhone || '')
      .replace(/\s+/g, '')
      .trim();
    if (!activePhone) return [];
    return jobs.filter((j) => j.clientPhone.replace(/\s+/g, '').trim() === activePhone);
  }, [jobs, isClientLoggedIn, clientSession.phone, jobForm.clientPhone]);

  const filteredClientJobs = useMemo(() => {
    if (selectedCityFilter === 'Visi') return ownClientJobs;
    return ownClientJobs.filter((j) => j.city === selectedCityFilter);
  }, [ownClientJobs, selectedCityFilter]);

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
  // KLIENTO UŽKLAUSOS + SMS PATVIRTINIMAS + MEISTRO PASIRINKIMAS
  // ==========================================================================

  const handleJobPhoto1Change = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      notify('Pasirinkite paveikslėlio failą (JPG, PNG ar pan.).', 'error');
      return;
    }
    imageFileToDataUrl(
      file,
      1280,
      (url) => setJobForm((prev) => ({ ...prev, photo1Name: file.name, photo1Url: url })),
      () => notify('Nepavyko nuskaityti nuotraukos.', 'error')
    );
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

    const draftJob = {
      title: jobForm.title.trim(),
      category: jobForm.category,
      customCategoryText:
        jobForm.category === 'Kita' ? jobForm.customCategoryText.trim() : '',
      city: jobForm.city,
      district: jobForm.district.trim(),
      preferredTime: jobForm.preferredTime,
      description: jobForm.description.trim(),
      clientName: jobForm.clientName.trim() || clientSession.name || 'Klientas',
      clientPhone: jobForm.clientPhone.trim(),
      photo1Name: jobForm.photo1Name || '',
      photo1Url: jobForm.photo1Url || ''
    };

    const code = String(Math.floor(1000 + Math.random() * 9000));
    setPendingClientJobData(draftJob);
    setClientJobSmsSentCode(code);
    setClientJobSmsEnteredCode(code);
    setClientJobSmsError('');
    setClientJobSmsModalOpen(true);
    notify(`SMS patvirtinimo kodas išsiųstas į ${draftJob.clientPhone}`);
  };

  const handleResendClientJobSms = () => {
    const nextCode = String(Math.floor(1000 + Math.random() * 9000));
    setClientJobSmsSentCode(nextCode);
    setClientJobSmsEnteredCode(nextCode);
    setClientJobSmsError('');
    if (pendingClientJobData && pendingClientJobData.clientPhone) {
      notify(`Naujas SMS kodas išsiųstas į ${pendingClientJobData.clientPhone}`);
    }
  };

  const handleVerifyClientJobSmsSubmit = (e) => {
    e.preventDefault();
    if (!pendingClientJobData) return;

    if (clientJobSmsEnteredCode.trim() !== clientJobSmsSentCode) {
      setClientJobSmsError('Neteisingas SMS patvirtinimo kodas.');
      return;
    }

    const createdJob = {
      ...pendingClientJobData,
      id: `j-${Date.now()}`,
      createdAtMs: Date.now(),
      createdAt: 'Ką tik',
      status: 'laukiama_pasiulymu',
      selectedMasterId: null,
      offers: []
    };

    setJobs((prev) => [createdJob, ...prev]);
    setClientSession({
      name: createdJob.clientName || 'Klientas',
      phone: createdJob.clientPhone
    });
    setIsClientLoggedIn(true);
    setClientJobSmsModalOpen(false);
    setPendingClientJobData(null);
    setClientJobSmsSentCode('');
    setClientJobSmsEnteredCode('');
    setClientJobSmsError('');

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
    setActiveView('client');
    notify(
      'SMS kodas patvirtintas! Užklausa paskelbta (galioja 7 d.), o jūs prijungtas prie kliento paskyros.'
    );

    window.requestAnimationFrame(() => {
      if (clientOrdersSectionRef.current) {
        clientOrdersSectionRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  };

  const handleClientDeleteJob = (jobId) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    if (selectedMasterJobId === jobId) {
      setSelectedMasterJobId(null);
    }
    notify('Užsakymas ištrintas.');
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
    const phoneBlock = getPhoneBlock(masterRegForm.phone);
    if (phoneBlock) {
      setSmsError(`Su šiuo telefono numeriu neseniai ištrinta paskyra. Registruotis galima bus po ${phoneBlock.daysLeft} d.`);
      return;
    }
    const code = String(Math.floor(1000 + Math.random() * 9000));
    setGeneratedSmsCode(code);
    setEnteredSmsCode(code);
    setSmsError('');
    setSmsStep('verify');
    notify(`SMS patvirtinimo kodas išsiųstas į ${masterRegForm.phone.trim()}`);
  };

  const completeMasterRegistration = () => {
    const phoneBlock = getPhoneBlock(masterRegForm.phone);
    if (phoneBlock) {
      setSmsError(`Su šiuo telefono numeriu neseniai ištrinta paskyra. Registruotis galima bus po ${phoneBlock.daysLeft} d.`);
      setSmsStep('form');
      return;
    }
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
    setIsMasterLoggedIn(true);
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
      setSmsError('Neteisingas SMS kodas.');
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
    e.target.value = '';
    if (!file) return;
    const masterId = currentMaster.id;
    imageFileToDataUrl(
      file,
      512,
      (url) => {
        setMasters((prev) => prev.map((m) => (m.id === masterId ? { ...m, avatarUrl: url } : m)));
        notify('Profilio nuotrauka atnaujinta.');
      },
      () => notify('Nepavyko nuskaityti nuotraukos.', 'error')
    );
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

  const getPhoneBlock = (phone) => {
    const key = normPhone(phone);
    if (!key) return null;
    const entry = deletedMasters.find(
      (e) => normPhone(e.master.phone) === key && Date.now() - e.deletedAt < DELETION_GRACE_MS
    );
    if (!entry) return null;
    return { daysLeft: Math.max(1, Math.ceil((entry.deletedAt + DELETION_GRACE_MS - Date.now()) / DAY_MS)) };
  };

  const softDeleteMaster = (masterId, deletedBy) => {
    const target = masters.find((m) => m.id === masterId);
    if (!target) return;
    const jobSnapshots = jobs
      .filter((j) => j.selectedMasterId === masterId || j.offers.some((o) => o.masterId === masterId))
      .map((j) => ({
        jobId: j.id,
        status: j.status,
        selectedMasterId: j.selectedMasterId,
        offers: j.offers.filter((o) => o.masterId === masterId)
      }));
    setDeletedMasters((prev) => [{ master: target, deletedAt: Date.now(), deletedBy, jobSnapshots }, ...prev]);
  };

  const handleRestoreMaster = (masterId) => {
    const entry = deletedMasters.find((e) => e.master.id === masterId);
    if (!entry) return;
    setMasters((prev) => (prev.some((m) => m.id === masterId) ? prev : [entry.master, ...prev]));
    setJobs((prev) =>
      prev.map((j) => {
        const snap = entry.jobSnapshots.find((x) => x.jobId === j.id);
        if (!snap) return j;
        const offers = [...j.offers, ...snap.offers.filter((o) => !j.offers.some((x) => x.masterId === o.masterId))];
        const canReselect = snap.selectedMasterId === masterId && !j.selectedMasterId && j.status === 'laukiama_pasiulymu';
        return {
          ...j,
          offers,
          selectedMasterId: canReselect ? masterId : j.selectedMasterId,
          status: canReselect ? snap.status : j.status
        };
      })
    );
    setDeletedMasters((prev) => prev.filter((e) => e.master.id !== masterId));
    notify(`Paskyra „${entry.master.name}“ atkurta.`);
  };

  const handleDeleteOwnMasterAccount = () => {
    if (!currentMaster) return;
    const targetId = currentMaster.id;
    const targetName = currentMaster.name;
    const remainingMasters = masters.filter((m) => m.id !== targetId);

    softDeleteMaster(targetId, 'meistras');
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
      notify(`Meistro paskyra „${targetName}“ ištrinta. Su tuo pačiu telefono numeriu vėl registruotis bus galima po 30 d.`);
    } else {
      setCurrentMasterId('');
      setIsMasterLoggedIn(false);
      setActiveView('home');
      notify(`Meistro paskyra „${targetName}“ ištrinta. Su tuo pačiu telefono numeriu vėl registruotis bus galima po 30 d. Grįžote į pagrindinį puslapį.`);
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
        date: nowStamp
      },
      ...prev
    ]);

    if (requestInvoiceChecked) {
      notify(
        `Balansas papildytas +${amount.toFixed(2)} €. Sąskaita faktūra ${invoiceNumber} išrašyta (${targetEmail}).`
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
      senderName:
        clientSupportForm.senderName.trim() ||
        clientSession.name ||
        jobForm.clientName.trim() ||
        'Klientas',
      senderContact:
        clientSupportForm.senderContact.trim() ||
        clientSession.phone ||
        jobForm.clientPhone.trim() ||
        'Kliento paskyra',
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
    notify('Žinutė išsiųsta administratoriui!');
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
    notify(`Žinutė išsiųsta administratoriui!`);
  };

  const handleAdminReplyToSupport = (e, msgId) => {
    e.preventDefault();
    const replyText = (adminReplyDrafts[msgId] || '').trim();
    if (!replyText) {
      notify('Įrašykite atsakymo tekstą.', 'error');
      return;
    }

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
    notify('Atsakymas išsiųstas!');
  };

  const handleAdminDeleteSupportMessage = (msgId) => {
    setSupportMessages((prev) => prev.filter((m) => m.id !== msgId));
    notify('Žinutė pašalinta.');
  };

  // ==========================================================================
  // ADMINISTRATORIAUS VEIKSMAI
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
    softDeleteMaster(masterId, 'administratorius');
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
    notify(`Meistras ${target ? target.name : ''} perkeltas į ištrintas paskyras (30 d. galima atkurti).`);
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
  // VIRŠUTINĖ NAVIGACIJA (HEADER)
  // ==========================================================================

  const renderHeader = () => (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 min-h-16 sm:h-20 py-2 flex items-center justify-between gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => {
            setActiveView('home');
            setMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 sm:gap-2.5 text-left shrink-0 cursor-pointer"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
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

<<<<<<< HEAD
=======
        {/* 3 aiškiai atskirti vaidmenų mygtukai: Klientas / Meistras / Admin */}
        <div className="order-3 sm:order-2 w-full sm:w-auto flex items-center justify-between sm:justify-start gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => openRoleLoginModal('client')}
            className={`flex-1 sm:flex-initial px-2.5 sm:px-3.5 py-2 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition cursor-pointer text-center flex items-center justify-center gap-1 ${
              activeView === 'client'
                ? 'bg-white text-blue-600 shadow-2xs border border-blue-100'
                : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
            }`}
          >
            <span>Klientas</span>
            {isClientLoggedIn && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Prisijungęs" />
            )}
          </button>

          <button
            type="button"
            onClick={() => openRoleLoginModal('master')}
            className={`flex-1 sm:flex-initial px-2.5 sm:px-3.5 py-2 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition cursor-pointer text-center flex items-center justify-center gap-1 ${
              activeView === 'master'
                ? 'bg-white text-blue-600 shadow-2xs border border-blue-100'
                : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
            }`}
          >
            <span>Meistras</span>
            {isMasterLoggedIn && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Prisijungęs" />
            )}
          </button>

          <button
            type="button"
            onClick={() => openRoleLoginModal('admin')}
            className={`flex-1 sm:flex-initial px-2.5 sm:px-3.5 py-2 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeView === 'admin'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
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
>>>>>>> 890a9086a604ab17944e25193392f52db7d4a9aa
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
<<<<<<< HEAD
=======
          <button
            type="button"
            onClick={() => openRoleLoginModal('master')}
            className="hover:text-slate-900 font-bold text-slate-800 transition cursor-pointer"
          >
            Prisijungti
          </button>
>>>>>>> 890a9086a604ab17944e25193392f52db7d4a9aa
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() =>
              isClientLoggedIn
                ? (setClientSubView('orders'), setActiveView('client'))
                : openLoginModal('client')
            }
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-[11px] sm:text-xs transition cursor-pointer"
          >
            {isClientLoggedIn ? 'Kliento paskyra' : 'Kliento prisijungimas'}
          </button>

          <button
            type="button"
            onClick={() =>
              isMasterLoggedIn ? setActiveView('master') : openLoginModal('master')
            }
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-[11px] sm:text-xs transition cursor-pointer"
          >
            {isMasterLoggedIn ? 'Meistro kabinetas' : 'Meistro prisijungimas'}
          </button>

          <button
            type="button"
            onClick={openBecomeMasterModal}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-[11px] sm:text-xs shadow-sm transition cursor-pointer"
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
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => openLoginModal('client')}
              className="py-2 px-3 rounded-xl border border-slate-300 text-slate-800 font-bold text-xs cursor-pointer"
            >
              Kliento SMS prisijungimas
            </button>
            <button
              type="button"
              onClick={() => openLoginModal('master')}
              className="py-2 px-3 rounded-xl border border-slate-300 text-slate-800 font-bold text-xs cursor-pointer"
            >
              Meistro SMS prisijungimas
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
  // PRADINIS PUSLAPIS ('home')
  // ==========================================================================

  const renderHomeView = () => (
    <div className="space-y-16">
      <section
        className="relative overflow-hidden border-b border-slate-200/70 pt-10 pb-14 sm:pt-14 sm:pb-20 px-4"
        style={{
          background:
            'radial-gradient(circle at 12% 35%, rgba(254, 240, 138, 0.35), transparent 42%), radial-gradient(circle at 85% 20%, rgba(219, 234, 254, 0.75), transparent 48%), linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)'
        }}
      >
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-sm text-xs font-semibold text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>
              Vilnius • Kaunas • Klaipėda — klientams nemokamai, o meistrams pirmi du užsakymai
              nemokamai
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-950 leading-[1.08]">
            Patikimas meistras jūsų namų darbams per kelias minutes
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Aprašykite, ką reikia sutvarkyti, gaukite iki 5 patikrintų meistrų kainų pasiūlymus ir
            išsirinkite tinkamiausią. Nemokamai ir be jokių įsipareigojimų.
          </p>

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

      <section ref={howItWorksRef} className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
            },
            {
              step: '4 žingsnis',
              title: 'Tiesioginis derinimas su meistru',
              desc: 'Pasirinkus meistrą, jūs su juo tiesiogiai derinate galutines kainas, darbus ir detales. Platforma neatsako už darbų kokybę – ji tik suveda klientą ir meistrą.'
            }
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2"
            >
              <span className="inline-block px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-extrabold">
                {item.step}
              </span>
              <h2 className="text-base font-extrabold text-slate-900">{item.title}</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

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
                className="bg-white hover:border-blue-400 hover:bg-blue-50/30 border border-slate-200 rounded-2xl p-4 text-left transition shadow-sm cursor-pointer"
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
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between gap-4 pointer-events-none"
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
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between gap-4 pointer-events-none"
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

      <section ref={faqSectionRef} className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
        <h2 className="text-xl font-black text-slate-900">Dažniausiai užduodami klausimai</h2>
        <div className="space-y-3">
          {FAQ_ITEMS.map((faq) => (
            <div
              key={faq.q}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-1.5"
            >
              <h3 className="font-extrabold text-sm text-slate-900">{faq.q}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
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
                <li>
                  <button
                    type="button"
                    onClick={() => setCookieSettingsOpen(true)}
                    className="hover:text-white underline transition cursor-pointer text-left"
                  >
                    Slapukų nustatymai
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
              <button
                type="button"
                onClick={() => setCookieSettingsOpen(true)}
                className="hover:text-slate-300 cursor-pointer"
              >
                Slapukų nustatymai
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );

  // ==========================================================================
  // KLIENTO PUSLAPIS ('client')
  // ==========================================================================

<<<<<<< HEAD
  const renderClientView = () => {
    const showAccountShell = isClientLoggedIn || clientSubView === 'support';

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {showAccountShell ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
=======
  const renderClientView = () => (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Viršutinis kliento perjungiklis */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
              Kliento paskyra
            </span>
            {isClientLoggedIn && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                ✓ {clientSession.name || 'Klientas'} ({clientSession.phone})
              </span>
            )}
          </div>
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

          {isClientLoggedIn ? (
            <button
              type="button"
              onClick={() => handleLogoutRole('client')}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
            >
              Atsijungti
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openRoleLoginModal('client')}
              className="px-3.5 py-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-xs font-extrabold text-blue-700 cursor-pointer"
            >
              Prisijungti
            </button>
          )}
        </div>
      </div>

      {/* KLIENTO SKILTIS: PAGALBA */}
      {clientSubView === 'support' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={handleSendClientSupportMessage}
            className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4 h-fit"
          >
>>>>>>> 890a9086a604ab17944e25193392f52db7d4a9aa
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
                  Kliento paskyra
                </span>
                {isClientLoggedIn && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    ✓ {clientSession.name || 'Klientas'} ({clientSession.phone})
                  </span>
                )}
              </div>
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
                    ? 'bg-blue-600 text-white shadow-sm'
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
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Mano užsakymai ir pasiūlymai ({ownClientJobs.length})
              </button>

              <button
                type="button"
                onClick={() => setClientSubView('support')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                  clientSubView === 'support'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Pagalba
              </button>

              {isClientLoggedIn && (
                <button
                  type="button"
                  onClick={() => handleLogoutRole('client')}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Atsijungti
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
              Nauja užklausa meistrui (0 €)
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Aprašykite, ką reikia sutvarkyti
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Pateikus užklausą išsiųsime SMS kodą jūsų nurodytu numeriu – patvirtinus jį,
              atsidarys jūsų kliento paskyra su gautais pasiūlymais.
            </p>
          </div>
        )}

        {clientSubView === 'support' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form
              onSubmit={handleSendClientSupportMessage}
              className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 h-fit"
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

            <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 h-fit">
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
                  Telefono numeris (SMS patvirtinimui) *
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
                Patvirtinus SMS kodą užklausa bus paskelbta, o jūs prijungtas prie kliento paskyros.
              </p>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-sm transition cursor-pointer"
              >
                Patvirtinti SMS ir paskelbti (0 €)
              </button>
            </div>
          </form>
        )}

        {showAccountShell && clientSubView !== 'support' && (
          <div ref={clientOrdersSectionRef} className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-black text-slate-900">
                Mano užsakymai ir pasiūlymai ({filteredClientJobs.length})
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

            {filteredClientJobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-2">
                <p className="text-sm font-bold text-slate-800">
                  Jūs dar neturite paskelbtų užsakymų.
                </p>
                <p className="text-xs text-slate-500">
                  Užpildykite užklausos formą ir patvirtinkite SMS kodą, kad matytumėte savo
                  užsakymą bei meistrų pasiūlymus.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredClientJobs.map((job) => {
                  const selectedMaster = masters.find((m) => m.id === job.selectedMasterId);

                  return (
                    <div
                      key={job.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4"
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
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400">
                            {job.createdAt} • Išsitrins po 7 d.
                          </span>
                          <button
                            type="button"
                            onClick={() => handleClientDeleteJob(job.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-red-200 bg-red-50/60 hover:bg-red-100 text-red-700 font-bold transition cursor-pointer"
                            title="Ištrinti užsakymą"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Ištrinti</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                          {job.title}
                        </h3>
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
                              {job.reviewSubmitted
                                ? '✓ Palikti dar atsiliepimą'
                                : 'Palikti atsiliepimą'}
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
            )}
          </div>
        )}
      </div>
    );
  };

  // ==========================================================================
  // MEISTRO KABINETAS ('master')
  // ==========================================================================

  const renderMasterView = () => {
    if (!currentMaster) return null;

    const hiddenJobIds = hiddenJobIdsByMaster[currentMaster.id] || [];
    const visibleJobs = jobs.filter((j) => !hiddenJobIds.includes(j.id));
    const masterTransactions = transactions.filter((tx) => tx.masterId === currentMaster.id);
    const masterInvoices = masterTransactions.filter(
      (tx) => tx.invoiceRequested && Number(tx.amount) > 0
    );
    const masterSupportMessages = supportMessages.filter(
      (msg) => msg.senderRole === 'Meistras' && msg.senderId === currentMaster.id
    );

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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
            {[
              { id: 'orders', label: `Užsakymai (${visibleJobs.length})` },
              { id: 'profile', label: 'Profilis' },
              { id: 'balance', label: 'Balansas' },
              { id: 'invoices', label: `Sąskaitos (${masterInvoices.length})` },
              { id: 'support', label: 'Pagalba' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMasterSubTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  masterSubTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
<<<<<<< HEAD

            {isMasterLoggedIn && (
              <button
                type="button"
                onClick={() => handleLogoutRole('master')}
                className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
              >
                Atsijungti
              </button>
            )}
          </div>
        </div>

        {masterSubTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-slate-500">
                Paspauskite ant užsakymo, kad matytumėte pilną aprašymą. Kliento kontaktai
                atsiveria, kai klientas patvirtina jūsų pasiūlymą.
              </p>
              {hiddenJobIds.length > 0 && (
                <button
                  type="button"
                  onClick={handleRestoreHiddenJobsForMaster}
                  className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Atkurti paslėptus ({hiddenJobIds.length})
                </button>
              )}
            </div>

            {visibleJobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
                Šiuo metu rodomų užsakymų nėra.
              </div>
            ) : (
              <div className="space-y-4">
                {visibleJobs.map((job) => {
                  const alreadyOffered = job.offers.some(
                    (o) => o.masterId === currentMaster.id
                  );
                  const isConfirmedForCurrentMaster =
                    job.status === 'pasirinktas_meistras' &&
                    job.selectedMasterId === currentMaster.id;
                  const draft = offerDrafts[job.id] || {
                    price: '40',
                    eta: 'Šiandien',
                    note: ''
                  };

                  return (
                    <div
                      key={job.id}
                      onClick={() => setSelectedMasterJobId(job.id)}
                      className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 p-5 sm:p-6 shadow-sm space-y-4 cursor-pointer transition"
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
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400">{job.createdAt}</span>
                          <button
                            type="button"
                            onClick={(e) => handleHideJobForMaster(e, job.id)}
                            className="text-slate-400 hover:text-red-600 font-bold cursor-pointer"
                          >
                            Slėpti
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
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {job.description}
                        </p>
                        {job.photo1Url && (
                          <img
                            src={job.photo1Url}
                            alt={job.photo1Name || 'Kliento nuotrauka'}
                            className="mt-2 w-28 h-20 object-cover rounded-lg border border-slate-200"
                          />
                        )}
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
                })}
              </div>
            )}
          </div>
        )}

        {masterSubTab === 'profile' && (
          <form
            onSubmit={handleSaveMasterProfile}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 max-w-3xl"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-extrabold text-slate-900">Meistro profilis</h2>
              <button
                type="button"
                onClick={() => setMasterReviewsModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-extrabold cursor-pointer"
              >
                ★ {Number(currentMaster.rating || 5).toFixed(1)} • Atsiliepimai (
                {currentMaster.reviews.length})
              </button>
            </div>

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
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join('')}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <label className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer">
                  Keisti nuotrauką
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
                    className="px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold cursor-pointer"
                  >
                    Šalinti
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Vardas, pavardė
                </label>
                <input
                  type="text"
                  value={currentMaster.name}
                  onChange={(e) => handleUpdateCurrentMasterField('name', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Miestas</label>
                <select
                  value={currentMaster.city}
                  onChange={(e) => handleUpdateCurrentMasterField('city', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Telefonas</label>
                <input
                  type="tel"
                  value={currentMaster.phone}
                  onChange={(e) => handleUpdateCurrentMasterField('phone', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">El. paštas</label>
                <input
                  type="email"
                  value={currentMaster.email || ''}
                  onChange={(e) => handleUpdateCurrentMasterField('email', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Paslaugų sritys
              </label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => {
                  const active = currentMaster.categories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCurrentMasterCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
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
                Aprašymas klientams
              </label>
              <textarea
                rows={4}
                value={currentMaster.bio}
                onChange={(e) => handleUpdateCurrentMasterField('bio', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                Rekvizitai sąskaitoms faktūroms
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={currentMaster.invoiceDetails?.companyOrPersonName || ''}
                  onChange={(e) =>
                    handleUpdateCurrentMasterInvoiceField('companyOrPersonName', e.target.value)
                  }
                  placeholder="Įmonės pavadinimas arba Vardas Pavardė (IV)"
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                />
                <input
                  type="text"
                  value={currentMaster.invoiceDetails?.codeOrVat || ''}
                  onChange={(e) =>
                    handleUpdateCurrentMasterInvoiceField('codeOrVat', e.target.value)
                  }
                  placeholder="Įmonės / IV kodas arba PVM kodas"
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                />
                <input
                  type="text"
                  value={currentMaster.invoiceDetails?.address || ''}
                  onChange={(e) =>
                    handleUpdateCurrentMasterInvoiceField('address', e.target.value)
                  }
                  placeholder="Adresas"
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                />
                <input
                  type="email"
                  value={currentMaster.invoiceDetails?.invoiceEmail || ''}
                  onChange={(e) =>
                    handleUpdateCurrentMasterInvoiceField('invoiceEmail', e.target.value)
                  }
                  placeholder="El. paštas sąskaitoms"
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold cursor-pointer"
              >
                Išsaugoti profilį
              </button>

              <div className="flex flex-col items-end gap-1">
              {!confirmDeleteMasterAccount ? (
                <button
                  type="button"
                  onClick={() => setConfirmDeleteMasterAccount(true)}
                  className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold cursor-pointer"
                >
                  Ištrinti paskyrą
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDeleteOwnMasterAccount}
                    className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold cursor-pointer"
                  >
                    Patvirtinti ištrynimą
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteMasterAccount(false)}
                    className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    Atšaukti
                  </button>
                </div>
              )}
                <p className="text-[10px] leading-snug text-slate-400 max-w-[230px] text-right">
                  (su tuo pačiu telefono numeriu vėl registruotis bus galima tik po 30 d.)
                </p>
              </div>
            </div>
          </form>
        )}

        {masterSubTab === 'balance' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form
              onSubmit={handleMasterTopUp}
              className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 h-fit"
            >
              <h2 className="text-base font-extrabold text-slate-900">Papildyti balansą</h2>
              <p className="text-xs text-slate-500">
                Dabartinis balansas:{' '}
                <strong className="text-emerald-600">
                  {Number(currentMaster.balance).toFixed(2)} €
                </strong>
                . Už patvirtintą užsakymą nuskaičiuojama 3 €.
              </p>

              <div className="flex gap-2">
                {[10, 15, 30, 50].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopUpAmount(amt)}
                    className={`flex-1 py-2 rounded-xl text-xs font-extrabold border cursor-pointer ${
                      Number(topUpAmount) === amt
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    +{amt} €
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Suma eurais (€)
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold"
                />
              </div>

              <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requestInvoiceChecked}
                  onChange={(e) => setRequestInvoiceChecked(e.target.checked)}
                />
                <span>Išrašyti sąskaitą faktūrą ir išsiųsti el. paštu</span>
              </label>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold cursor-pointer"
              >
                Papildyti balansą ({Number(topUpAmount || 0).toFixed(2)} €)
              </button>
            </form>

            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3 h-fit">
              <h2 className="text-base font-extrabold text-slate-900">Operacijų istorija</h2>
              {masterTransactions.length === 0 ? (
                <p className="text-xs text-slate-500">Operacijų dar nėra.</p>
              ) : (
                <div className="divide-y divide-slate-100 text-xs">
                  {masterTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="py-3 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{tx.type}</div>
                        <div className="text-slate-400">{tx.date}</div>
                      </div>
                      <span
                        className={`font-extrabold text-sm ${
                          Number(tx.amount) >= 0 ? 'text-emerald-600' : 'text-slate-800'
                        }`}
                      >
                        {Number(tx.amount) >= 0 ? '+' : ''}
                        {Number(tx.amount).toFixed(2)} €
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {masterSubTab === 'invoices' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-slate-900">
              Išrašytos sąskaitos faktūros ({masterInvoices.length})
            </h2>
            {masterInvoices.length === 0 ? (
              <p className="text-xs text-slate-500">
                Sąskaitų faktūrų dar nėra. Papildykite balansą ir pažymėkite sąskaitos
                išrašymą.
              </p>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {masterInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {inv.invoiceNumber || 'Sąskaita faktūra'}
                      </span>
                      <span className="text-slate-500 ml-2">
                        • Išsiųsta: {inv.invoiceSentTo || currentMaster.email || 'el. paštu'} •{' '}
                        {inv.date}
                      </span>
                    </div>
                    <span className="font-extrabold text-emerald-700 text-sm">
                      {Number(inv.amount).toFixed(2)} €
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {masterSubTab === 'support' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form
              onSubmit={handleSendMessageToAdmin}
              className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 h-fit"
            >
              <h2 className="text-base font-extrabold text-slate-900">
                Susisiekti su administratoriumi
              </h2>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tema</label>
                <select
                  value={adminSupportForm.topic}
                  onChange={(e) =>
                    setAdminSupportForm((prev) => ({ ...prev, topic: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                >
                  <option value="Balansas / Sąskaita faktūra">Balansas / Sąskaita faktūra</option>
                  <option value="Paskyros patvirtinimas">Paskyros patvirtinimas</option>
                  <option value="Užsakymų klausimai">Užsakymų klausimai</option>
                  <option value="Kitas klausimas">Kitas klausimas</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Žinutė *</label>
                <textarea
                  rows={4}
                  required
                  value={adminSupportForm.message}
                  onChange={(e) =>
                    setAdminSupportForm((prev) => ({ ...prev, message: e.target.value }))
                  }
                  placeholder="Parašykite savo klausimą administratoriui..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold cursor-pointer"
              >
                Siųsti žinutę
              </button>
            </form>

            <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3 h-fit">
              <h2 className="text-base font-extrabold text-slate-900">Jūsų žinutės</h2>
              {masterSupportMessages.length === 0 ? (
                <p className="text-xs text-slate-500">Žinučių dar neišsiuntėte.</p>
              ) : (
                <div className="space-y-3 text-xs">
                  {masterSupportMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-extrabold text-slate-900">{msg.topic}</span>
                        <span className="text-slate-400">{msg.sentAt}</span>
                      </div>
                      <p className="text-slate-700">{msg.message}</p>
                      {msg.adminReply && (
                        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-emerald-950">
                          <strong>Admin atsakymas ({msg.repliedAt}):</strong> {msg.adminReply}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==========================================================================
  // ADMINISTRATORIAUS PUSLAPIS ('admin')
  // ==========================================================================

  const renderAdminView = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600">
            Administratoriaus valdymas
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            namupagalba.lt – Admin panelė
          </h1>
=======

            {isMasterLoggedIn ? (
              <button
                type="button"
                onClick={() => handleLogoutRole('master')}
                className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
              >
                Atsijungti
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openRoleLoginModal('master')}
                className="px-3.5 py-2 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-xs font-extrabold text-blue-700 cursor-pointer"
              >
                Prisijungti
              </button>
            )}
          </div>
>>>>>>> 890a9086a604ab17944e25193392f52db7d4a9aa
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
            { id: 'deleted', label: `Ištrintos paskyros (${deletedMasters.length})` },
            { id: 'jobs', label: `Skelbimai (${jobs.length})` },
            { id: 'categories', label: `Kategorijos (${categories.length})` }
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setAdminSubTab(t.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                adminSubTab === t.id
                  ? 'bg-slate-900 text-white shadow-sm'
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

          {isAdminLoggedIn && (
            <button
              type="button"
              onClick={() => handleLogoutRole('admin')}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
            >
              Atsijungti
            </button>
          )}
        </div>
      </div>
<<<<<<< HEAD

      {adminSubTab === 'messages' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:px-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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
                  className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-sm space-y-3 ${
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

      {adminSubTab === 'balance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
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

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
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

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Viso klientų apsilankė
              </span>
              <p className="text-2xl font-black text-slate-900 mt-1.5">
                {128 + jobs.length * 4}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Bendras klientų apsilankymų skaičius</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Užklausų per dieną
              </span>
              <p className="text-2xl font-black text-blue-600 mt-1.5">{jobs.length}</p>
              <p className="text-[11px] text-slate-500 mt-1">Paskelbtos užklausos šiandien</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Naujų klientų
              </span>
              <p className="text-2xl font-black text-slate-900 mt-1.5">
                {14 + Math.max(0, jobs.length - 3)}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Nauji klientai šiandien</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Naujų meistrų
              </span>
              <p className="text-2xl font-black text-amber-600 mt-1.5">{masters.length}</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Viso registruota ({pendingApprovalMasters.length} laukia)
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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

      {adminSubTab === 'deleted' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-base font-extrabold text-slate-900">Ištrintos paskyros</h2>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Ištrinta paskyra čia laikoma 30 dienų ir ją galima atkurti. Per tą laiką telefono numeris negali būti naudojamas naujai registracijai.
              Jei per 30 d. nieko nedarote, paskyra automatiškai ištrinama visam laikui.
            </p>
          </div>
          {deletedMasters.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              Ištrintų paskyrų nėra.
            </div>
          ) : (
            <div className="space-y-3">
              {deletedMasters.map((entry) => {
                const left = Math.max(0, Math.ceil((entry.deletedAt + DELETION_GRACE_MS - Date.now()) / DAY_MS));
                return (
                  <div key={entry.master.id} className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-extrabold text-slate-900">{entry.master.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {entry.master.city} • {entry.master.phone} • Balansas: {Number(entry.master.balance).toFixed(2)} €
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Ištrynė: {entry.deletedBy} • {new Date(entry.deletedAt).toLocaleDateString('lt-LT')}
                      </p>
                      <span className="mt-2 inline-block px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-800">
                        Automatiškai išsitrins po {left} d.
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleRestoreMaster(entry.master.id)}
                        className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold cursor-pointer"
                      >
                        Atkurti paskyrą
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeletedMasters((prev) => prev.filter((e) => e.master.id !== entry.master.id));
                          notify(`Praėjo 30 d.: paskyra „${entry.master.name}“ ištrinta visam laikui (demo).`);
                        }}
                        className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-bold cursor-pointer"
                      >
                        Demo: praėjo 30 d.
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {adminSubTab === 'masters' && (
        <div className="space-y-6">
          {pendingApprovalMasters.length > 0 && (
            <div className="bg-white rounded-2xl border border-amber-300 shadow-sm overflow-hidden">
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

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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

      {adminSubTab === 'jobs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
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

      {adminSubTab === 'categories' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 max-w-2xl">
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
  // MODALAI (PRISIJUNGIMAS, SMS PATVIRTINIMAS, PROFILIAI, ATSILIEPIMAI, TEISĖ)
  // ==========================================================================

  const renderModals = () => (
    <>
      {howItWorksModalOpen && (
        <div
          onClick={() => setHowItWorksModalOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
                  Išsamus platformos gidas
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                  Kaip veikia Namupagalba.lt?
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Aiškus veikimo principas tiek ieškantiems pagalbos namuose klientams, tiek
                  paslaugas teikiantiems meistrams.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setHowItWorksModalOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-2xl bg-blue-50/45 border border-blue-200/80 p-5 space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-blue-200/70 pb-3">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700">
                      Klientams • 0 €
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      Kaip tai veikia klientui?
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold">
                    100 % nemokama
                  </span>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <div className="rounded-xl bg-white border border-blue-100 p-3.5 space-y-1">
                    <div className="font-extrabold text-slate-900">
                      1. Užklausos paskelbimas per kelias minutes
                    </div>
                    <p className="text-xs text-slate-600">
                      Pasirenkate miestą (Vilnius, Kaunas, Klaipėda), paslaugos sritį, patogų
                      atvykimo laiką, trumpai aprašote darbą (galite pridėti nuotrauką) ir
                      nurodote telefono numerį.
                    </p>
                  </div>

                  <div className="rounded-xl bg-white border border-blue-100 p-3.5 space-y-1">
                    <div className="font-extrabold text-slate-900">
                      2. SMS patvirtinimas ir paskyros aktyvavimas
                    </div>
                    <p className="text-xs text-slate-600">
                      Patvirtinus telefono numerį SMS kodu, užklausa paskelbiama (galioja iki 7
                      dienų), o jūs automatiškai prijungiama prie kliento paskyros, kurioje
                      matysite visus pasiūlymus.
                    </p>
                  </div>

                  <div className="rounded-xl bg-white border border-blue-100 p-3.5 space-y-1">
                    <div className="font-extrabold text-slate-900">
                      3. Pasiūlymų palyginimas ir meistro pasirinkimas
                    </div>
                    <p className="text-xs text-slate-600">
                      Meistrai pateikia orientacinę kainą, atvykimo laiką ir komentarą. Galite
                      peržiūrėti meistro profilį, įvertinimus bei atsiliepimus ir pasirinkti
                      tinkamiausią.
                    </p>
                  </div>

                  <div className="rounded-xl bg-white border border-blue-100 p-3.5 space-y-1">
                    <div className="font-extrabold text-slate-900">
                      4. Saugūs kontaktai ir tiesioginis susitarimas
                    </div>
                    <p className="text-xs text-slate-600">
                      Jūsų kontaktai lieka paslėpti, kol pats nepasirenkate meistro. Pasirinkus
                      meistrą, atveriami jo kontaktai, o galutinę darbų apimtį, kainą bei laiką
                      suderinate tiesiogiai. Baigus darbą galite palikti atsiliepimą.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setHowItWorksModalOpen(false);
                    goToClientForm();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold cursor-pointer transition"
                >
                  Paskelbti užklausą (0 €)
                </button>
              </div>

              <div className="rounded-2xl bg-amber-50/55 border border-amber-200/90 p-5 space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-amber-200/80 pb-3">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800">
                      Meistrams • Startinis kreditas
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      Kaip tai veikia meistrui?
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-200/80 text-slate-950 text-[11px] font-extrabold">
                    Pirmi 2 užsakymai 0 €
                  </span>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <div className="rounded-xl bg-white border border-amber-100 p-3.5 space-y-1">
                    <div className="font-extrabold text-slate-900">
                      1. Registracija, SMS patvirtinimas ir profilis
                    </div>
                    <p className="text-xs text-slate-600">
                      Paspauskite „Tapti meistru“, užpildykite savo duomenis, miestą, paslaugų
                      sritis bei aprašymą ir patvirtinkite numerį SMS kodu. Profilis perduodamas
                      administratoriui papildomam patvirtinimui ir gauna 6 € startinį balansą.
                    </p>
                  </div>

                  <div className="rounded-xl bg-white border border-amber-100 p-3.5 space-y-1">
                    <div className="font-extrabold text-slate-900">
                      2. Užsakymų paieška ir kainos pasiūlymo pateikimas
                    </div>
                    <p className="text-xs text-slate-600">
                      Prisijungę prie meistro kabineto matote klientų užklausas. Prie
                      tinkamo užsakymo nurodote siūlomą kainą (€), kada galite atvykti ir trumpą
                      komentarą.
                    </p>
                  </div>

                  <div className="rounded-xl bg-white border border-amber-100 p-3.5 space-y-1">
                    <div className="font-extrabold text-slate-900">
                      3. Kliento pasirinkimas ir kontaktų atvėrimas
                    </div>
                    <p className="text-xs text-slate-600">
                      Kai klientas patvirtina jūsų pasiūlymą, užsakymas priskiriamas jums, o jūs
                      matote kliento vardą ir telefono numerį, kad galėtumėte greitai susisiekti
                      ir suderinti darbą.
                    </p>
                  </div>

                  <div className="rounded-xl bg-white border border-amber-100 p-3.5 space-y-1">
                    <div className="font-extrabold text-slate-900">
                      4. Balansas (3 €) ir sąskaitos faktūros
                    </div>
                    <p className="text-xs text-slate-600">
                      Startinis 6 € kreditas leidžia patvirtinti pirmuosius 2 užsakymus, vėliau už
                      patvirtintą pasirinkimą nuskaitoma 3 €. Kabinete galite papildyti balansą,
                      suvesti rekvizitus ir matyti išrašytas sąskaitas faktūras.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setHowItWorksModalOpen(false);
                    openBecomeMasterModal();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold cursor-pointer transition"
                >
                  Tapti meistru
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loginModalOpen && (
        <div
          onClick={() => setLoginModalOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
                  SMS patvirtinimo prisijungimas
                </span>
                <h2 className="text-xl font-black text-slate-900">
                  {loginRole === 'master' ? 'Meistro prisijungimas' : 'Kliento prisijungimas'}
                </h2>
              </div>
=======
>>>>>>> 890a9086a604ab17944e25193392f52db7d4a9aa
              <button
                type="button"
                onClick={() => setLoginModalOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setLoginRole('client');
                  setLoginPhoneInput(clientSession.phone || jobForm.clientPhone || '');
                  setLoginSmsSentCode('');
                  setLoginSmsEnteredCode('');
                  setLoginError('');
                }}
                className={`py-2 rounded-xl text-xs font-extrabold cursor-pointer ${
                  loginRole === 'client' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Klientas
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginRole('master');
                  setLoginPhoneInput(currentMaster?.phone || '+370 612 34567');
                  setLoginSmsSentCode('');
                  setLoginSmsEnteredCode('');
                  setLoginError('');
                }}
                className={`py-2 rounded-xl text-xs font-extrabold cursor-pointer ${
                  loginRole === 'master' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Meistras
              </button>
            </div>

            <form onSubmit={handleVerifyLoginSmsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Telefono numeris *
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    required
                    value={loginPhoneInput}
                    onChange={(e) => setLoginPhoneInput(e.target.value)}
                    placeholder="+370 6XX XXXXX"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleSendLoginSmsCode}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shrink-0 cursor-pointer"
                  >
                    Gauti SMS kodą
                  </button>
                </div>
              </div>

              {loginSmsSentCode && (
                <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4 space-y-2">
                  <p className="text-xs font-bold text-blue-900">
                    Išsiųstas SMS kodas: <span className="font-black">{loginSmsSentCode}</span>
                  </p>
                  <input
                    type="text"
                    maxLength={6}
                    value={loginSmsEnteredCode}
                    onChange={(e) => setLoginSmsEnteredCode(e.target.value)}
                    placeholder="Įveskite 4 skaitmenų SMS kodą"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-blue-300 bg-white text-sm font-bold tracking-widest"
                  />
                </div>
              )}

              {loginError && (
                <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold cursor-pointer"
              >
                Patvirtinti SMS ir prisijungti
              </button>
            </form>
          </div>
        </div>
      )}

      {clientJobSmsModalOpen && pendingClientJobData && (
        <div
          onClick={() => setClientJobSmsModalOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
                  Užklausos SMS patvirtinimas
                </span>
                <h2 className="text-xl font-black text-slate-900">Patvirtinkite numerį</h2>
              </div>
              <button
                type="button"
                onClick={() => setClientJobSmsModalOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4 text-xs text-blue-950 space-y-1">
              <p>
                Kodas išsiųstas į: <strong>{pendingClientJobData.clientPhone}</strong>
              </p>
              <p>
                Testinis SMS kodas: <strong className="text-sm">{clientJobSmsSentCode}</strong>
              </p>
            </div>

            <form onSubmit={handleVerifyClientJobSmsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  SMS patvirtinimo kodas *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={clientJobSmsEnteredCode}
                  onChange={(e) => setClientJobSmsEnteredCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold tracking-widest"
                />
              </div>

              {clientJobSmsError && (
                <p className="text-xs font-bold text-red-600">{clientJobSmsError}</p>
              )}

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleResendClientJobSms}
                  className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Siųsti kodą iš naujo
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold cursor-pointer"
                >
                  Patvirtinti ir paskelbti
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {becomeMasterOpen && (
  // MODALAI (BDAR/TEISINIAI DOKUMENTAI, UŽSAKYMAS, PROFILIAI, ADMIN, SMS)
  // ==========================================================================

  const renderModals = () => (
    <>
      {/* PRISIJUNGIMO MODALAI: KLIENTAS / MEISTRAS / ADMIN */}
      {loginModalRole && (
        <div
<<<<<<< HEAD
          onClick={() => setBecomeMasterOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
=======
          onClick={() => setLoginModalRole(null)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-2xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-5"
>>>>>>> 890a9086a604ab17944e25193392f52db7d4a9aa
          >
            <div className="flex items-start justify-between gap-4">
              <div>
<<<<<<< HEAD
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600">
                  Meistro registracija
                </span>
                <h2 className="text-xl font-black text-slate-900">Tapti meistru</h2>
              </div>
              <button
                type="button"
                onClick={() => setBecomeMasterOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
=======
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
                  {loginModalRole === 'client'
                    ? 'Kliento prisijungimas'
                    : loginModalRole === 'master'
                    ? 'Meistro kabineto prisijungimas'
                    : 'Administratoriaus prisijungimas'}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  {loginModalRole === 'client'
                    ? 'Prisijungti kaip klientui'
                    : loginModalRole === 'master'
                    ? 'Prisijungti prie meistro kabineto'
                    : 'Prisijungti prie admin panelės'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLoginModalRole(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
>>>>>>> 890a9086a604ab17944e25193392f52db7d4a9aa
              >
                <X className="w-5 h-5" />
              </button>
            </div>

<<<<<<< HEAD
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      placeholder="meistras@pastas.lt"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                    />
=======
            {loginModalRole === 'client' && (
              <form onSubmit={handleClientLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jūsų vardas
                  </label>
                  <input
                    type="text"
                    value={clientLoginForm.name}
                    onChange={(e) =>
                      setClientLoginForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Pvz., Greta"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Telefono numeris *
                  </label>
                  <input
                    type="tel"
                    required
                    value={clientLoginForm.phone}
                    onChange={(e) =>
                      setClientLoginForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder="+370 6XX XXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                {clientLoginError && (
                  <p className="text-xs font-bold text-red-600">{clientLoginError}</p>
                )}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm cursor-pointer"
                >
                  Prisijungti kaip klientas
                </button>
              </form>
            )}

            {loginModalRole === 'master' && (
              <form onSubmit={handleMasterLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Meistro telefono numeris *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      required
                      value={masterLoginInput}
                      onChange={(e) => {
                        setMasterLoginInput(e.target.value);
                        setMasterLoginError('');
                      }}
                      placeholder="+370 612 34567"
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                    />
                    <button
                      type="button"
                      onClick={handleSendMasterLoginCode}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shrink-0 cursor-pointer"
                    >
                      Gauti SMS kodą
                    </button>
>>>>>>> 890a9086a604ab17944e25193392f52db7d4a9aa
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Miestas</label>
                    <select
                      value={masterRegForm.city}
                      onChange={(e) =>
                        setMasterRegForm((prev) => ({ ...prev, city: e.target.value }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                    >
                      {CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

<<<<<<< HEAD
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
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                            active
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-slate-700 border-slate-300'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
=======
                {masterLoginSentCode && (
                  <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-xs text-blue-900">
                    Testavimo SMS kodas: <strong>{masterLoginSentCode}</strong>
>>>>>>> 890a9086a604ab17944e25193392f52db7d4a9aa
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
<<<<<<< HEAD
                    Trumpai apie patirtį
                  </label>
                  <textarea
                    rows={3}
                    value={masterRegForm.bio}
                    onChange={(e) =>
                      setMasterRegForm((prev) => ({ ...prev, bio: e.target.value }))
                    }
                    placeholder="Kokius darbus atliekate, kokius įrankius turite..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                {smsError && <p className="text-xs font-bold text-red-600">{smsError}</p>}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold cursor-pointer"
                >
                  Gauti SMS patvirtinimo kodą
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifySmsCode} className="space-y-4">
                <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-950 space-y-1">
                  <p>
                    SMS kodas išsiųstas į: <strong>{masterRegForm.phone}</strong>
                  </p>
                  <p>
                    Testinis SMS kodas: <strong className="text-sm">{generatedSmsCode}</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Įveskite SMS kodą *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={enteredSmsCode}
                    onChange={(e) => setEnteredSmsCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold tracking-widest"
=======
                    SMS patvirtinimo kodas *
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={masterLoginSmsCode}
                    onChange={(e) => {
                      setMasterLoginSmsCode(e.target.value);
                      setMasterLoginError('');
                    }}
                    placeholder="4 skaitmenų kodas"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-black tracking-widest"
>>>>>>> 890a9086a604ab17944e25193392f52db7d4a9aa
                  />
                </div>

                {masterLoginError && (
                  <p className="text-xs font-bold text-red-600">{masterLoginError}</p>
                )}

<<<<<<< HEAD
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSmsStep('form')}
                    className="text-xs font-bold text-slate-600 hover:underline cursor-pointer"
                  >
                    ← Grįžti į formą
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold cursor-pointer"
                  >
                    Patvirtinti ir sukurti paskyrą
=======
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm cursor-pointer"
                >
                  Prisijungti į meistro kabinetą
                </button>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMasterLoggedIn(true);
                      setLoginModalRole(null);
                      setActiveView('master');
                      notify(`Prisijungta prie meistro kabineto (${currentMaster?.name || 'Meistras'}).`);
                    }}
                    className="font-bold text-slate-600 hover:text-slate-900 underline cursor-pointer"
                  >
                    Greitas prisijungimas (testui)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginModalRole(null);
                      openBecomeMasterModal();
                    }}
                    className="font-extrabold text-amber-600 hover:underline cursor-pointer"
                  >
                    Neturi paskyros? Tapti meistru →
>>>>>>> 890a9086a604ab17944e25193392f52db7d4a9aa
                  </button>
                </div>
              </form>
            )}

            {loginModalRole === 'admin' && (
              <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Administratoriaus el. paštas *
                  </label>
                  <input
                    type="email"
                    required
                    value={adminLoginForm.email}
                    onChange={(e) => {
                      setAdminLoginForm((prev) => ({ ...prev, email: e.target.value }));
                      setAdminLoginError('');
                    }}
                    placeholder="admin@namupagalba.lt"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Slaptažodis *
                  </label>
                  <input
                    type="password"
                    required
                    value={adminLoginForm.password}
                    onChange={(e) => {
                      setAdminLoginForm((prev) => ({ ...prev, password: e.target.value }));
                      setAdminLoginError('');
                    }}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                {adminLoginError && (
                  <p className="text-xs font-bold text-red-600">{adminLoginError}</p>
                )}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm cursor-pointer"
                >
                  Prisijungti kaip administratorius
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {profileModalMaster && (
        <div
          onClick={() => setProfileModalMasterId(null)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">{profileModalMaster.name}</h2>
                <p className="text-xs text-slate-500">
                  📍 {profileModalMaster.city} • ★ {profileModalMaster.rating.toFixed(1)} (
                  {profileModalMaster.reviews.length} atsiliepimai)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProfileModalMasterId(null)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {profileModalMaster.bio}
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Atsiliepimai ({profileModalMaster.reviews.length})
              </h3>
              {profileModalMaster.reviews.length === 0 ? (
                <p className="text-xs text-slate-500">Atsiliepimų dar nėra.</p>
              ) : (
                <div className="space-y-2">
                  {profileModalMaster.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{rev.author}</span>
                        <span className="text-amber-600">
                          {'★'.repeat(rev.rating)} • {rev.date}
                        </span>
                      </div>
                      <p className="text-slate-600">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {reviewModalJob && (
        <div
          onClick={() => setReviewModalJob(null)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">Palikti atsiliepimą</h2>
                <p className="text-xs text-slate-500">{reviewModalJob.jobTitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setReviewModalJob(null)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jūsų vardas *</label>
                <input
                  type="text"
                  required
                  value={reviewForm.author}
                  onChange={(e) =>
                    setReviewForm((prev) => ({ ...prev, author: e.target.value }))
                  }
                  placeholder="Pvz., Aistė"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Įvertinimas</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) =>
                    setReviewForm((prev) => ({ ...prev, rating: Number(e.target.value) }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold"
                >
                  <option value={5}>★★★★★ (5 / 5)</option>
                  <option value={4}>★★★★☆ (4 / 5)</option>
                  <option value={3}>★★★☆☆ (3 / 5)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Atsiliepimas *
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm((prev) => ({ ...prev, comment: e.target.value }))
                  }
                  placeholder="Kaip meistras atliko darbą?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold cursor-pointer"
              >
                Paskelbti atsiliepimą
              </button>
            </form>
          </div>
        </div>
      )}

      {masterReviewsModalOpen && currentMaster && (
        <div
          onClick={() => setMasterReviewsModalOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-black text-slate-900">
                Klientų atsiliepimai ({currentMaster.reviews.length})
              </h2>
              <button
                type="button"
                onClick={() => setMasterReviewsModalOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {currentMaster.reviews.length === 0 ? (
              <p className="text-xs text-slate-500">Atsiliepimų dar nėra.</p>
            ) : (
              <div className="space-y-2.5">
                {currentMaster.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{rev.author}</span>
                      <span className="text-amber-600">
                        {'★'.repeat(rev.rating)} • {rev.date}
                      </span>
                    </div>
                    <p className="text-slate-600">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {selectedAdminMaster && (
        <div
          onClick={() => setSelectedAdminMasterId(null)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">{selectedAdminMaster.name}</h2>
                <p className="text-xs text-slate-500">
                  📍 {selectedAdminMaster.city} • {selectedAdminMaster.phone} • Balansas:{' '}
                  <strong className="text-emerald-600">
                    {Number(selectedAdminMaster.balance).toFixed(2)} €
                  </strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAdminMasterId(null)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedAdminMaster.status === 'laukiantis_patvirtinimo' && (
                <button
                  type="button"
                  onClick={() => handleApproveMaster(selectedAdminMaster.id)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold cursor-pointer"
                >
                  ✓ Patvirtinti paskyrą
                </button>
              )}
              <button
                type="button"
                onClick={() => handleToggleBlockMaster(selectedAdminMaster.id)}
                className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold cursor-pointer"
              >
                {selectedAdminMaster.status === 'uzblokuotas' ? 'Atblokuoti' : 'Užblokuoti'}
              </button>
              <button
                type="button"
                onClick={() => handleDeleteMaster(selectedAdminMaster.id)}
                className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold cursor-pointer"
              >
                Šalinti meistrą
              </button>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2.5">
              <div className="text-xs font-extrabold text-slate-800">Keisti balansą (€)</div>
              <div className="flex gap-2">
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
                      Number(adminBalanceAdjustInput)
                    )
                  }
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold cursor-pointer"
                >
                  + Pridėti
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleAdminAdjustBalance(
                      selectedAdminMaster.id,
                      -Math.abs(Number(adminBalanceAdjustInput) || 0)
                    )
                  }
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-extrabold cursor-pointer"
                >
                  - Nurašyti
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-extrabold text-slate-800">
                Atsiliepimai ({selectedAdminMaster.reviews.length})
              </div>
              {selectedAdminMaster.reviews.length === 0 ? (
                <p className="text-xs text-slate-500">Atsiliepimų nėra.</p>
              ) : (
                <div className="space-y-2">
                  {selectedAdminMaster.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs flex items-start justify-between gap-2"
                    >
                      <div>
                        <div className="font-bold text-slate-900">
                          {rev.author} • {'★'.repeat(rev.rating)}
                        </div>
                        <p className="text-slate-600 mt-0.5">{rev.comment}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAdminDeleteReview(selectedAdminMaster.id, rev.id)}
                        className="text-red-600 hover:underline font-bold shrink-0 cursor-pointer"
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

      {selectedMasterJob && (
        <div
          onClick={() => setSelectedMasterJobId(null)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-extrabold text-blue-600">
                  📍 {selectedMasterJob.city}
                  {selectedMasterJob.district ? `, ${selectedMasterJob.district}` : ''}
                </span>
                <h2 className="text-lg font-black text-slate-900">{selectedMasterJob.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMasterJobId(null)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {selectedMasterJob.description}
            </p>

            {selectedMasterJob.photo1Url && (
              <img
                src={selectedMasterJob.photo1Url}
                alt={selectedMasterJob.photo1Name || 'Kliento nuotrauka'}
                className="w-full max-h-72 object-contain rounded-xl border border-slate-200 bg-slate-50"
              />
            )}

            {selectedMasterJob.status === 'pasirinktas_meistras' &&
            selectedMasterJob.selectedMasterId === currentMaster?.id ? (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs">
                <div className="font-extrabold text-emerald-900">
                  Klientas: {selectedMasterJob.clientName || 'Klientas'}
                </div>
                <div className="font-bold text-emerald-800 mt-0.5">
                  Telefonas: {selectedMasterJob.clientPhone}
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 text-xs text-slate-600">
                Kliento kontaktai atveriami, kai klientas patvirtina jūsų pasiūlymą.
              </div>
            )}
          </div>
        </div>
      )}

      {!cookieConsent && !cookieSettingsOpen && (
        <CookieBanner
          onAcceptAll={() => saveCookieConsent({ functional: true, analytics: true })}
          onRejectAll={() => saveCookieConsent({ functional: false, analytics: false })}
          onSettings={() => setCookieSettingsOpen(true)}
          onPolicy={() => setActiveLegalDoc('cookies')}
        />
      )}
      {cookieSettingsOpen && (
        <CookieSettingsModal
          initial={cookieConsent}
          onSave={saveCookieConsent}
          onClose={() => setCookieSettingsOpen(false)}
          onPolicy={() => {
            setCookieSettingsOpen(false);
            setActiveLegalDoc('cookies');
          }}
        />
      )}

      {activeLegalDoc && LEGAL_DOCS[activeLegalDoc] && (
        <div
          onClick={() => setActiveLegalDoc(null)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
                  {LEGAL_DOCS[activeLegalDoc].updated}
                </span>
                <h2 className="text-xl font-black text-slate-900">
                  {LEGAL_DOCS[activeLegalDoc].title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveLegalDoc(null)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {LEGAL_DOCS[activeLegalDoc].sections.map((sec) => (
                <div key={sec.heading} className="space-y-1">
                  <h3 className="font-extrabold text-slate-900">{sec.heading}</h3>
                  <p>{sec.body}</p>
                </div>
              ))}
            </div>

            {activeLegalDoc === 'cookies' && (
              <button
                type="button"
                onClick={() => {
                  setActiveLegalDoc(null);
                  setCookieSettingsOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold cursor-pointer"
              >
                Keisti slapukų nustatymus
              </button>
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
        {activeView === 'admin' &&
          (isAdminLoggedIn ? (
            renderAdminView()
          ) : (
            <div className="max-w-md mx-auto px-4 py-14">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 text-center">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600">
                  Apsaugota skiltis
                </span>
                <h1 className="text-xl font-black text-slate-900">
                  Administratoriaus prisijungimas
                </h1>
                <p className="text-xs text-slate-600">
                  Norėdami atidaryti administratoriaus panelę, prisijunkite su savo el. paštu ir
                  slaptažodžiu.
                </p>
                <button
                  type="button"
                  onClick={() => openRoleLoginModal('admin')}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold cursor-pointer"
                >
                  Atidaryti admin prisijungimą
                </button>
              </div>
            </div>
          ))}
      </main>

      {renderModals()}

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
          onClick={() =>
            isClientLoggedIn ? goToClientOrders() : openLoginModal('client')
          }
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
          onClick={() =>
            isMasterLoggedIn ? setActiveView('master') : openLoginModal('master')
          }
          className={`flex-1 py-2 px-2 rounded-xl text-[11px] font-bold transition cursor-pointer ${
            activeView === 'master'
              ? 'bg-blue-50 text-blue-700'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Meistras
        </button>
      </div>

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
<<<<<<< HEAD

// ============================================================================
// SLAPUKŲ PRANEŠIMAS IR NUSTATYMAI
// ============================================================================
function CookieBanner({ onAcceptAll, onRejectAll, onSettings, onPolicy }) {
  return (
    <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-md z-[60] bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 space-y-4">
      <div className="space-y-1.5">
        <p className="text-sm font-extrabold text-slate-900">Mes naudojame slapukus</p>
        <p className="text-xs text-slate-600 leading-relaxed">
          Būtinieji slapukai veikia visada. Funkcinius ir analitinius įjungsime tik jums sutikus. Pasirinkimą galite pakeisti bet kada.{' '}
          <button type="button" onClick={onPolicy} className="underline text-blue-700 font-semibold cursor-pointer">
            Slapukų politika
          </button>
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <button type="button" onClick={onRejectAll} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold cursor-pointer">
          Tik būtinieji
        </button>
        <button type="button" onClick={onSettings} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold cursor-pointer">
          Nustatymai
        </button>
        <button type="button" onClick={onAcceptAll} className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold cursor-pointer">
          Priimti visus
        </button>
      </div>
    </div>
  );
}

function CookieSettingsModal({ initial, onSave, onClose, onPolicy }) {
  const [functional, setFunctional] = useState(Boolean(initial && initial.functional));
  const [analytics, setAnalytics] = useState(Boolean(initial && initial.analytics));
  const rows = [
    { key: 'necessary', title: 'Būtinieji', text: 'Reikalingi svetainės veikimui, saugumui ir jūsų slapukų pasirinkimui išsaugoti. Jų išjungti negalima.', on: true, locked: true },
    { key: 'functional', title: 'Funkciniai', text: 'Prisimena jūsų nustatymus, pvz., pasirinktą miestą ir kitus patogumo pasirinkimus.', on: functional, set: setFunctional },
    { key: 'analytics', title: 'Analitiniai', text: 'Padeda suprasti, kaip naudojamasi svetaine, ir ją tobulinti. Duomenys naudojami apibendrintai.', on: analytics, set: setAnalytics }
  ];
  return (
    <div onClick={onClose} className="fixed inset-0 z-[70] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">Slapukų nustatymai</h2>
            <p className="text-xs text-slate-500 mt-1">
              Pasirinkite, kuriuos slapukus leidžiate.{' '}
              <button type="button" onClick={onPolicy} className="underline text-blue-700 font-semibold cursor-pointer">Slapukų politika</button>
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.key} className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-slate-200">
              <div>
                <p className="text-sm font-extrabold text-slate-900">{r.title}</p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{r.text}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={r.on}
                aria-label={r.title}
                disabled={r.locked}
                onClick={() => r.set && r.set(!r.on)}
                className={`relative shrink-0 w-11 h-6 rounded-full transition ${r.on ? 'bg-blue-600' : 'bg-slate-300'} ${r.locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${r.on ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button type="button" onClick={() => onSave({ functional: false, analytics: false })} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold cursor-pointer">
            Tik būtinieji
          </button>
          <button type="button" onClick={() => onSave({ functional, analytics })} className="flex-1 px-4 py-2.5 rounded-xl border border-blue-600 text-blue-700 hover:bg-blue-50 text-xs font-extrabold cursor-pointer">
            Išsaugoti pasirinkimą
          </button>
          <button type="button" onClick={() => onSave({ functional: true, analytics: true })} className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold cursor-pointer">
            Priimti visus
          </button>
        </div>
      </div>
    </div>
  );
}
=======
>>>>>>> 890a9086a604ab17944e25193392f52db7d4a9aa

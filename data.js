/*
  ATLAS DES MANIFS : données du site
  ----------------------------------
  Pour ajouter une pancarte, une manif ou une tactique, copiez un bloc
  existant, collez-le à la suite (sans oublier la virgule entre deux blocs)
  et modifiez les valeurs. Le mode d'emploi complet est dans README.md.

  Valeurs possibles pour les critères des pancartes :
  registre   : Jeu de mots, Revendication, Cri de colère, Ironie, Mème et culture web,
               Détournement, Témoignage, Question rhétorique
  procede    : Paronymie, Homonymie, Double sens, Antithèse, Rime, Parallélisme,
               Bilinguisme, Formule détournée
  sujet      : Moyens, Effectifs, Profs absents, Bâtiments, Parcoursup, Violences policières,
               Gouvernement, Génération, Démocratie, Vie chère, Climat, Féminisme, Travail, Logement
  forme      : Carton au marqueur, Peinture, Dessin, Collage, Banderole, Costume,
               Objet détourné, Inscription, Non précisée
  references : Pop culture, Histoire de l’art, TikTok et web, Slogans historiques
  (Vous pouvez inventer de nouvelles valeurs : elles apparaîtront automatiquement dans les filtres.)
*/
window.ATLAS = {

  /* Un mouvement regroupe plusieurs manifs (un cycle de mobilisation). */
  mouvements: [
    {
      id: "automne-2026",
      hashtag: "#automne2026",
      nom: "Automne 2026 : le mouvement lycéen et la convergence des colères",
      periode: "Depuis le 18 septembre 2026",
      contexte: "Parti d’un lycée de Créteil à la mi-septembre, le mouvement lycéen s’est étendu à des centaines d’établissements pour réclamer des moyens : classes moins chargées, remplacement des professeurs absents, rénovation des bâtiments, fin de Parcoursup. Les violences policières subies par des lycéen·nes, dont plusieurs mutilations, sont devenues un second moteur de la colère. Mi-octobre, la mobilisation a rejoint celle des gilets jaunes et d’autres secteurs contre la vie chère.",
      sources: [
        { titre: "Public Sénat, dossier mobilisation lycéenne", url: "https://www.publicsenat.fr/dossier/mobilisation-lycenne" },
        { titre: "Politis, dossier « 17 octobre : Macron récolte la colère »", url: "https://www.politis.fr/dossiers/17-octobre-macron-recolte-la-colere/" }
      ]
    }
  ],

  /* Chaque manif a sa page, son hashtag et son type d'événement. */
  manifs: [
    {
      slug: "blocus-rentree-2026",
      hashtag: "#blocusrentree2026",
      nom: "Les blocus de la rentrée",
      date: "2026-09-18",
      dateFin: "2026-10-02",
      type: "Blocus",
      mouvement: "automne-2026",
      villes: ["Créteil", "Paris", "Lille", "Toulouse"],
      chiffres: "Environ 400 établissements fermés le 2 octobre",
      contexte: "Tout commence le 18 septembre au lycée Saint-Exupéry de Créteil. Fin septembre, une soixantaine de lycées sont bloqués en Île-de-France, puis le mouvement gagne tout le pays : des centaines d’actions sont recensées autour du 1er octobre. Les élèves dénoncent des classes surchargées, des professeurs non remplacés, des bâtiments dégradés et des emplois du temps à trous. Les blocus donnent lieu à des face-à-face tendus avec la police.",
      sources: [
        { titre: "Le Bonbon", url: "https://lebonbon.fr/paris/news/blocage-lycees-colere-toujours-plus-vive-quelle-est-suite-mouvement/" },
        { titre: "Euronews", url: "https://fr.euronews.com/2026/10/02/les-lyceens-francais-affrontent-la-police-les-protestations-scolaires-setendent-a-tout-le" }
      ]
    },
    {
      slug: "6-octobre-2026",
      hashtag: "#6octobre2026",
      nom: "Acte III, journée nationale",
      date: "2026-10-06",
      type: "Manifestation nationale",
      mouvement: "automne-2026",
      villes: ["Paris", "Nantes", "Lyon", "Marseille", "Rennes", "Bordeaux"],
      chiffres: "256 000 manifestant·es selon le ministère de l’Intérieur, dont 56 000 à Paris ; 450 000 selon l’Union syndicale lycéenne",
      contexte: "Le point culminant du mouvement lycéen. Les élèves sont rejoints par des professeurs, des parents, des étudiant·es et des syndicats, dans une trentaine de villes. À Paris, le cortège va de République à Nation. Dans les cortèges, les pancartes contre les violences policières sont presque aussi nombreuses que celles qui réclament des moyens pour l’école.",
      sources: [
        { titre: "AFP, via Paris Match Belgique", url: "https://www.parismatch.be/actualites/monde/2026/10/06/mouvement-lyceen-en-france-plus-de-250000-manifestants-dans-les-rues-la-mobilisation-appelee-a-se-poursuivre-EOPSKOPQAVAJBHRVJAMTH5CY5M/" },
        { titre: "Public Sénat, reportage", url: "https://www.publicsenat.fr/actualites/politique/reportage-on-est-tous-dans-le-meme-bateau-quand-enseignants-et-syndicats-rejoignent-la-mobilisation-lyceenne" }
      ]
    },
    {
      slug: "13-octobre-2026",
      hashtag: "#13octobre2026",
      nom: "Acte V",
      date: "2026-10-13",
      type: "Manifestation lycéenne",
      mouvement: "automne-2026",
      villes: ["Paris", "Nancy", "Marseille"],
      chiffres: "",
      contexte: "Cinquième journée du mouvement. À Paris, deux cortèges défilent, dont l’un part de l’Hôtel de Ville vers les Invalides. Les violences policières sont au cœur des pancartes. C’est aussi le moment où les codes du web envahissent les cortèges : batailles d’aura, gestes viraux, slogans tirés des mèmes. Les regards se tournent déjà vers la journée du 17 octobre.",
      sources: [
        { titre: "Politis, reportage photo", url: "https://www.politis.fr/articles/2026/10/en-images-qui-nous-protege-de-la-police-dans-le-cortege-de-la-mobilisation-lyceenne-a-paris/" },
        { titre: "AFP, les lycéens manifestent avec les codes du web", url: "https://www.sudradio.fr/societe/batailles-daura-bismillah-cest-les-tenebres-les-lyceens-manifestent-avec-les-codes-du-web" }
      ]
    },
    {
      slug: "17-octobre-2026",
      hashtag: "#17octobre2026",
      nom: "17 octobre, la convergence des colères",
      date: "2026-10-17",
      type: "Journée interprofessionnelle",
      mouvement: "automne-2026",
      villes: ["Paris", "Toulouse", "Lille", "Nice", "Montpellier", "Calais"],
      chiffres: "550 000 manifestant·es selon le ministère de l’Intérieur, 800 000 selon les organisateurs",
      contexte: "Une journée lancée début septembre sur les réseaux sociaux contre la hausse du prix de l’essence et du coût de la vie, que les organisations lycéennes ont appelé à rejoindre. Gilets jaunes, lycéen·nes, étudiant·es, cheminot·es et paysan·nes défilent ensemble, au premier jour des vacances scolaires. La journée est marquée par des affrontements et de nombreuses dégradations dans plusieurs grandes villes.",
      sources: [
        { titre: "Politis, dossier du 17 octobre", url: "https://www.politis.fr/dossiers/17-octobre-macron-recolte-la-colere/" },
        { titre: "vacances-scolaires.com, bilan", url: "https://vacances-scolaires.com/actualites/2026/10/17/manifestations-du-17-octobre-2026-la-jeunesse-et-les-syndicats-durcissent-le-ton-un-lourd-bilan-humain-et-materiel/" }
      ]
    },
    {
      slug: "24-octobre-2026",
      hashtag: "#24octobre2026",
      nom: "24 octobre, deuxième acte",
      date: "2026-10-24",
      type: "Journée de mobilisation",
      mouvement: "automne-2026",
      villes: ["Orléans", "Paris"],
      chiffres: "",
      contexte: "Une semaine après le 17, la coordination des gilets jaunes appelle à un « acte II » contre la vie chère. Le gouvernement déploie un dispositif de maintien de l’ordre exceptionnel. À Orléans, des milliers de personnes manifestent contre le congrès du Rassemblement national qui s’y tient le même jour.",
      sources: [
        { titre: "Sud Radio, l’appel à un acte II", url: "https://www.sudradio.fr/sud-radio/les-gilets-jaunes-appellent-a-une-nouvelle-journee-de-mobilisation-des-ce-samedi-24-octobre" },
        { titre: "Sud Radio, le dispositif de sécurité", url: "https://www.sudradio.fr/sud-radio/mobilisation-du-24-octobre-un-dispositif-de-securite-exceptionnel-avec-larmee-des-blindes-le-raid-et-le-gign" }
      ]
    },
    {
      slug: "5-novembre-2026",
      hashtag: "#5novembre2026",
      nom: "Grève du 5 novembre",
      date: "2026-11-05",
      type: "Grève interprofessionnelle",
      mouvement: "automne-2026",
      villes: [],
      chiffres: "",
      aVenir: true,
      contexte: "Une intersyndicale appelle les salarié·es du public et du privé à la grève et à manifester, notamment pour les salaires et les services publics. Des organisations lycéennes appellent à la rejoindre.",
      sources: [
        { titre: "AFP, via Sud Radio", url: "https://www.sudradio.fr/societe/journee-test-pour-la-convergence-des-coleres-entre-jeunes-et-gilets-jaunes" }
      ]
    }
  ],

  pancartes: [
    { id: "p01", texte: "Jeunesse fâchée, pas facho", ville: "Nantes", manif: "6-octobre-2026", registre: ["Jeu de mots", "Revendication"], procede: ["Paronymie"], sujet: ["Génération"], forme: ["Non précisée"], references: [], pepite: true, auteur: "", photo: { credit: "AFP", fichier: "" }, source: { titre: "AFP, via Sud Radio", url: "https://www.sudradio.fr/societe/mouvement-lyceen-des-milliers-de-personnes-ont-commence-a-defiler" }, note: "" },
    { id: "p02", texte: "Lancez des profs, pas des lacrymo", ville: "Nantes", manif: "6-octobre-2026", registre: ["Jeu de mots", "Revendication"], procede: ["Formule détournée", "Parallélisme"], sujet: ["Moyens", "Profs absents", "Violences policières"], forme: ["Non précisée"], references: [], pepite: true, auteur: "", photo: { credit: "AFP", fichier: "" }, source: { titre: "AFP, via Sud Radio", url: "https://www.sudradio.fr/societe/mouvement-lyceen-des-milliers-de-personnes-ont-commence-a-defiler" }, note: "" },
    { id: "p03", texte: "Écoles sans argent, pays sans avenir", ville: "Nantes", manif: "6-octobre-2026", registre: ["Revendication"], procede: ["Parallélisme"], sujet: ["Moyens"], forme: ["Banderole"], references: [], pepite: false, auteur: "", photo: { credit: "AFP", fichier: "" }, source: { titre: "AFP, via Sud Radio", url: "https://www.sudradio.fr/societe/mouvement-lyceen-des-milliers-de-personnes-ont-commence-a-defiler" }, note: "Banderole de tête du cortège nantais." },
    { id: "p04", texte: "On n’est pas le problème mais le résultat de vos décisions", ville: "Paris", manif: "6-octobre-2026", registre: ["Revendication"], procede: ["Antithèse"], sujet: ["Gouvernement"], forme: ["Non précisée"], references: [], pepite: false, auteur: "", photo: { credit: "", fichier: "" }, source: { titre: "Public Sénat", url: "https://www.publicsenat.fr/actualites/politique/reportage-on-est-tous-dans-le-meme-bateau-quand-enseignants-et-syndicats-rejoignent-la-mobilisation-lyceenne" }, note: "Vue parmi les pancartes contre les réformes du lycée et du bac." },
    { id: "p05", texte: "Gen Z en colère", ville: "", manif: "blocus-rentree-2026", registre: ["Cri de colère"], procede: [], sujet: ["Génération"], forme: ["Non précisée"], references: [], pepite: false, auteur: "", photo: { credit: "", fichier: "" }, source: { titre: "Le Bonbon", url: "https://lebonbon.fr/paris/news/blocage-lycees-colere-toujours-plus-vive-quelle-est-suite-mouvement/" }, note: "" },
    { id: "p06", texte: "Nos classes débordent, notre patience aussi", ville: "", manif: "blocus-rentree-2026", registre: ["Jeu de mots", "Cri de colère"], procede: ["Double sens"], sujet: ["Effectifs"], forme: ["Non précisée"], references: [], pepite: true, auteur: "", photo: { credit: "", fichier: "" }, source: { titre: "Le Bonbon", url: "https://lebonbon.fr/paris/news/blocage-lycees-colere-toujours-plus-vive-quelle-est-suite-mouvement/" }, note: "" },
    { id: "p07", texte: "On veut pas le monde, juste être pris au sérieux", ville: "", manif: "blocus-rentree-2026", registre: ["Témoignage", "Revendication"], procede: [], sujet: ["Démocratie"], forme: ["Non précisée"], references: [], pepite: false, auteur: "", photo: { credit: "", fichier: "" }, source: { titre: "Le Bonbon", url: "https://lebonbon.fr/paris/news/blocage-lycees-colere-toujours-plus-vive-quelle-est-suite-mouvement/" }, note: "" },
    { id: "p08", texte: "We want BAC not the BAC", ville: "Lille", date: "2026-10-01", manif: "blocus-rentree-2026", registre: ["Jeu de mots"], procede: ["Homonymie", "Bilinguisme"], sujet: ["Violences policières"], forme: ["Non précisée"], references: [], pepite: true, auteur: "", photo: { credit: "Voir Euronews", fichier: "" }, source: { titre: "Euronews", url: "https://fr.euronews.com/2026/10/02/les-lyceens-francais-affrontent-la-police-les-protestations-scolaires-setendent-a-tout-le" }, note: "Le bac, le diplôme, contre la BAC, la brigade anti-criminalité." },
    { id: "p09", texte: "Trop jeunes pour voter, assez grands pour se faire gazer", ville: "Rennes", manif: "6-octobre-2026", registre: ["Cri de colère", "Jeu de mots"], procede: ["Antithèse", "Rime"], sujet: ["Violences policières", "Démocratie"], forme: ["Non précisée"], references: [], pepite: false, auteur: "", photo: { credit: "AFP", fichier: "" }, source: { titre: "AFP", url: "https://www.boursedirect.fr/fr/actualites/categorie/politique/mouvement-des-lyceens-lecornu-defend-l-ordre-et-cible-a-nouveau-lfi-afp-18601b1d91c800b5855349d306f39be487a23e17" }, note: "" },
    { id: "p10", texte: "Lecornu, t’es foutu, le 6-7 est dans la rue", ville: "", manif: "", mouvement: "automne-2026", registre: ["Mème et culture web"], procede: ["Rime", "Formule détournée"], sujet: ["Gouvernement"], forme: ["Non précisée"], references: ["TikTok et web", "Slogans historiques"], pepite: false, auteur: "", photo: { credit: "", fichier: "" }, source: { titre: "AFP, via Sud Radio", url: "https://www.sudradio.fr/societe/batailles-daura-bismillah-cest-les-tenebres-les-lyceens-manifestent-avec-les-codes-du-web" }, note: "Reprend la structure d’un slogan classique des cortèges en y glissant le « six-seven », geste viral sur les réseaux. Vu dans plusieurs cortèges entre le 6 et le 13 octobre." },
    { id: "p11", texte: "Ton budget, on le plie avec un scuba", ville: "", manif: "", mouvement: "automne-2026", registre: ["Mème et culture web", "Ironie"], procede: [], sujet: ["Gouvernement", "Moyens"], forme: ["Non précisée"], references: ["TikTok et web"], pepite: false, auteur: "", photo: { credit: "", fichier: "" }, source: { titre: "AFP, via Sud Radio", url: "https://www.sudradio.fr/societe/batailles-daura-bismillah-cest-les-tenebres-les-lyceens-manifestent-avec-les-codes-du-web" }, note: "Le « scuba » est un geste viral : nez pincé, l’autre main qui ondule. Vu dans plusieurs cortèges entre le 6 et le 13 octobre." },
    { id: "p12", texte: "Bismillah, c’est les ténèbres", ville: "Paris", manif: "13-octobre-2026", registre: ["Mème et culture web"], procede: ["Formule détournée"], sujet: ["Génération"], forme: ["Inscription"], references: ["TikTok et web"], pepite: false, auteur: "", photo: { credit: "Maxime Sirvins / Politis", fichier: "" }, source: { titre: "Politis", url: "https://www.politis.fr/articles/2026/10/en-images-qui-nous-protege-de-la-police-dans-le-cortege-de-la-mobilisation-lyceenne-a-paris/" }, note: "La formule vient d’un message viral attribué à un prétendu policier infiltré qui empilait les clichés sur le langage des jeunes. Son authenticité n’est pas établie, mais elle est devenue un slogan du mouvement." },
    { id: "p13", texte: "La France dévore ses enfants", ville: "Paris", manif: "13-octobre-2026", registre: ["Détournement"], procede: ["Formule détournée"], sujet: ["Gouvernement", "Violences policières"], forme: ["Dessin"], references: ["Histoire de l’art"], pepite: true, auteur: "", photo: { credit: "Maxime Sirvins / Politis", fichier: "" }, source: { titre: "Politis", url: "https://www.politis.fr/articles/2026/10/en-images-qui-nous-protege-de-la-police-dans-le-cortege-de-la-mobilisation-lyceenne-a-paris/" }, note: "Détourne le Saturne dévorant un de ses fils de Goya, avec le président à la place de Saturne." },
    { id: "p14", texte: "Spoiler : on ne lâchera pas", ville: "Nice", manif: "17-octobre-2026", registre: ["Revendication", "Mème et culture web"], procede: ["Formule détournée"], sujet: [], forme: ["Non précisée"], references: ["Pop culture"], pepite: false, auteur: "", photo: { credit: "", fichier: "" }, source: { titre: "vacances-scolaires.com", url: "https://vacances-scolaires.com/actualites/2026/10/17/manifestations-du-17-octobre-2026-la-jeunesse-et-les-syndicats-durcissent-le-ton-un-lourd-bilan-humain-et-materiel/" }, note: "" },
    { id: "p15", texte: "Contre Parcoursup, contre le manque de profs : lycéens en colère", ville: "Bordeaux", manif: "6-octobre-2026", registre: ["Revendication", "Cri de colère"], procede: ["Parallélisme"], sujet: ["Parcoursup", "Profs absents"], forme: ["Non précisée"], references: [], pepite: false, auteur: "", photo: { credit: "Gaétan Trillat / L’Étudiant", fichier: "" }, source: { titre: "L’Étudiant", url: "https://www.letudiant.fr/lycee/les-revendications-des-lyceens-sont-legitimes-a-bordeaux-etudiants-et-profs-se-joignent-au-mouvement.html" }, note: "Relevé dans le cortège bordelais." }
  ],

  tactiques: [
    { id: "t01", nom: "Bataille d’aura", famille: "performance", description: "Un duel de charisme : chacun son tour enchaîne gestes et poses, sous les rires. Filmée, la scène devient virale et suspend un instant le face-à-face, parfois avec un proviseur ou un policier qui se prête au jeu.", exemples: [{ texte: "Blocus et cortèges lycéens d’octobre 2026.", manif: "13-octobre-2026", source: "AFP, via Sud Radio", url: "https://www.sudradio.fr/societe/batailles-daura-bismillah-cest-les-tenebres-les-lyceens-manifestent-avec-les-codes-du-web" }], credit: "" },
    { id: "t02", nom: "Cyberblocage", famille: "numerique", description: "Quand les cours passent en distanciel, des jeunes extérieurs à la classe rejoignent la visio pour la perturber avec de la musique ou des slogans.", exemples: [{ texte: "Pendant les fermetures d’établissements d’octobre 2026.", source: "AFP, via Sud Radio", url: "https://www.sudradio.fr/societe/batailles-daura-bismillah-cest-les-tenebres-les-lyceens-manifestent-avec-les-codes-du-web" }], credit: "" },
    { id: "t03", nom: "Danser une trend face aux policiers", famille: "performance", description: "Reprendre la chorégraphie du moment sur les réseaux, devant le cordon de police, et la filmer. Le contraste fait passer le message sans un mot.", exemples: [{ texte: "Sur une chanson de Patrick Sébastien, devant des blocus.", manif: "blocus-rentree-2026", source: "AFP, via Sud Radio", url: "https://www.sudradio.fr/societe/batailles-daura-bismillah-cest-les-tenebres-les-lyceens-manifestent-avec-les-codes-du-web" }], credit: "" },
    { id: "t04", nom: "Défiler costumé", famille: "costumes", description: "Venir en super-héros, en personnage de série ou en figure politique caricaturée. Le costume attire l’œil des photographes, protège un peu l’anonymat et rend le cortège joyeux.", exemples: [{ texte: "Défilé lycéen costumé à Nancy.", manif: "13-octobre-2026", source: "AFP", url: "https://www.sudradio.fr/societe/batailles-daura-bismillah-cest-les-tenebres-les-lyceens-manifestent-avec-les-codes-du-web" }], credit: "" },
    { id: "t05", nom: "Chaîne humaine de protection", famille: "protection", description: "Des adultes, enseignants, parents ou syndicalistes, se donnent le bras de chaque côté du cortège pour le protéger.", exemples: [{ texte: "Des enseignants du lycée Paul-Éluard autour des élèves, à Saint-Denis.", manif: "blocus-rentree-2026", source: "VL Media", url: "https://vl-media.fr/?p=430280" }, { texte: "Cortège parisien.", manif: "13-octobre-2026", source: "Politis", url: "https://www.politis.fr/articles/2026/10/en-images-qui-nous-protege-de-la-police-dans-le-cortege-de-la-mobilisation-lyceenne-a-paris/" }], credit: "" },
    { id: "t06", nom: "Filmer et raconter soi-même", famille: "documentation", description: "Filmer les forces de l’ordre et les moments du cortège, puis publier ses propres vidéos, souvent sous la légende « Ce que les médias ne montreront jamais ».", exemples: [{ texte: "Paris.", manif: "13-octobre-2026", source: "AFP, via Sud Radio", url: "https://www.sudradio.fr/societe/batailles-daura-bismillah-cest-les-tenebres-les-lyceens-manifestent-avec-les-codes-du-web" }], credit: "" },
    { id: "t07", nom: "Blocus d’établissement", famille: "blocage", description: "Bloquer l’entrée du lycée tôt le matin pour empêcher les cours et rendre la mobilisation visible.", exemples: [{ texte: "Environ 400 établissements fermés le 2 octobre.", manif: "blocus-rentree-2026", source: "Le Bonbon", url: "https://lebonbon.fr/paris/news/blocage-lycees-colere-toujours-plus-vive-quelle-est-suite-mouvement/" }], credit: "" },
    { id: "t08", nom: "Pavés gonflables", famille: "gonflables", description: "De grands pavés gonflables argentés que les manifestant·es se renvoient au-dessus du cortège. Ils jouent avec l’image du pavé tout en restant inoffensifs.", exemples: [{ texte: "Le collectif qui les a imaginés.", source: "Tools for Action", url: "https://toolsforaction.net" }], credit: "Tools for Action" },
    { id: "t09", nom: "Banderole de tête", famille: "banderoles", description: "Une grande banderole portée en tête de cortège, avec un slogan court qui donne le ton de la journée et sera repris par les photographes.", exemples: [{ texte: "« Écoles sans argent, pays sans avenir », Nantes.", manif: "6-octobre-2026", source: "AFP, via Sud Radio", url: "https://www.sudradio.fr/societe/mouvement-lyceen-des-milliers-de-personnes-ont-commence-a-defiler" }], credit: "" },
    { id: "t10", nom: "Gestes de connivence", famille: "performance", description: "Reprendre en cortège des gestes viraux, comme le « scuba » ou le « six-seven », pour se reconnaître entre soi et transformer la manif en moment collectif.", exemples: [{ texte: "Repris jusque dans une vidéo de soutien de Greta Thunberg.", source: "AFP, via Sud Radio", url: "https://www.sudradio.fr/societe/batailles-daura-bismillah-cest-les-tenebres-les-lyceens-manifestent-avec-les-codes-du-web" }], credit: "" }
  ]
};

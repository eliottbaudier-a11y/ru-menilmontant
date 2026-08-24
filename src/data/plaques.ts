/* =========================================================================
   src/data/plaques.ts — SOURCE DE VÉRITÉ des 8 plaques du parcours.
   Contenu narratif complet pour I / II / III (pages en ligne).
   IV → VIII : métadonnées + géolocalisation (pages verrouillées, à révéler).
   ========================================================================= */

export type Spec = { label: string; value: string };

export type DuoImage = {
  /** image du dessous (révélée au survol) */
  back: string;
  /** image du dessus (s'efface au survol) */
  front: string;
  caption: string;
};

export type PlaqueContent = {
  /** crédit affiché sous le titre du héros */
  heroCredit: string;
  intro: {
    eyebrow: string;
    title: string;
    lead: string;
    paragraphs: string[];
  };
  duo: DuoImage[];
  band: {
    eyebrow: string;
    title: string;
    image: string;
    paragraphs: string[];
  };
  quote: {
    text: string;
    image: string;
  };
  object: {
    title: string;
    paragraphs: string[];
  };
};

export type Plaque = {
  n: number;
  roman: string;
  slug: string;
  /** titre principal (nom du lieu) */
  title: string;
  /** accroche / sous-titre poétique */
  subtitle: string;
  quartier: string;
  arrondissement: string;
  coords: { lat: number; lng: number };
  /** image de héros (fond plein écran) */
  hero: string;
  /** rendu 3D / photo de la plaque en fonte */
  fonte: string | null;
  /** true = fiche narrative complète disponible ; false = verrouillée */
  hasContent: boolean;
  specs: Spec[];
  content: PlaqueContent | null;
};

const SPECS_COMMON = (n: string, lieu: string, coords: string): Spec[] => [
  { label: "Emplacement", value: lieu },
  { label: "Coordonnées", value: coords },
  { label: "Matériau", value: "Fonte et bitume" },
  { label: "Classe de résistance", value: "D400 (chaussée)" },
  { label: "Diamètre", value: "Ø 800 mm (80 cm)" },
  { label: "Poids", value: "50-70 kg" },
  { label: "Fonderie (réf.)", value: "Saint-Gobain PAM · Pont-à-Mousson" },
  { label: "Motif gravé", value: "Tracé du ru + cartographie de Paris" },
  { label: "Inscriptions", value: "VILLE DE PARIS · ASSAINISSEMENT · EU/EP" },
  { label: "N° de série", value: `RU-${n} / 08` },
  { label: "Mise en service", value: "2026 (projet de diplôme)" },
];

export const plaques: Plaque[] = [
  {
    n: 1,
    roman: "I",
    slug: "aux-sources-du-ru",
    title: "Aux sources du ru",
    subtitle: "Sous vos pieds naît une rivière oubliée",
    quartier: "Ménilmontant",
    arrondissement: "Paris 20ᵉ",
    coords: { lat: 48.8677, lng: 2.386 },
    hero: "/img/plaque-1/00.jpg",
    fonte: "/plaques/plaque1-fonte.png",
    hasContent: true,
    specs: SPECS_COMMON("01", "Ménilmontant · Paris 20ᵉ", "48.8677 N · 2.3860 E"),
    content: {
      heroCredit: "Image : Les vignes de Belleville",
      intro: {
        eyebrow: "La plaque · point I",
        title: "Une rivière née de la pluie",
        lead: "Difficile de l'imaginer aujourd'hui : ici, les immeubles et les cafés ont remplacé une campagne vallonnée, plus proche du village que du quartier parisien.",
        paragraphs: [
          "Il y a trois siècles, on apercevait des vignes, des jardins et des vergers descendant les pentes de Belleville. Après chaque pluie, l'eau surgissait du sol par de petites sources qui se rejoignaient dans les fossés des chemins pour former un ruisseau : le Ru de Ménilmontant.",
          "Ce n'était pas une rivière majestueuse (certains étés, un simple filet d'eau), mais pour le village, elle était indispensable : on y abreuvait les bêtes, on arrosait les cultures, on surveillait son débit. Après l'orage, les enfants y lançaient de petits bateaux de bois qui dérivaient vers Paris.",
        ],
      },
      duo: [
        {
          back: "/img/plaque-1/01.jpg",
          front: "/img/plaque-1/02.jpg",
          caption: "Belleville, village et vignes (gravure, 1707)",
        },
        {
          back: "/img/plaque-1/03.jpg",
          front: "/img/plaque-1/04.jpg",
          caption: "Les vignes de Belleville, aujourd'hui",
        },
      ],
      band: {
        eyebrow: "Du ruisseau à l'égout",
        title: "Une rivière enfermée sous terre",
        image: "/img/plaque-1/05.jpg",
        paragraphs: [
          "Au XIXᵉ siècle, Paris s'étend. Les champs sont lotis, les chemins deviennent des rues, et le ru est progressivement enfermé sous terre. La rivière disparaît des regards, mais pas du territoire : quand la pluie tombe sur Belleville, l'eau emprunte encore sensiblement le même chemin qu'autrefois.",
          "Le ru a disparu de la surface, mais son tracé n'a jamais cessé d'exister. En construisant ses égouts, Paris s'appuie sur les vallons naturels : une partie des collecteurs souterrains suit encore le chemin creusé pendant des siècles par le ruisseau.",
        ],
      },
      quote: {
        text: "Le ru a disparu de la surface, mais son tracé n'a jamais cessé d'exister.",
        image: "/img/plaque-1/06.jpg",
      },
      object: {
        title: "Une gravure dans le béton",
        paragraphs: [
          "Au départ, l'idée était une peinture hydrochromique qui apparaît sous la pluie. Pour le diplôme, elle prend une forme plus durable : une plaque gravée dans le béton, posée au sol.",
          "Le tracé du ru et la carte de Paris sont incisés dans la matière. Quand il pleut, l'eau se loge dans les creux et fait ressortir le dessin. Le réseau oublié réapparaît sous les pas, comme si le ruisseau reprenait son chemin dans la ville.",
          "La pluie sert de révélateur : le temps d'une averse, un paysage enfoui remonte à la surface, et le ru redevient visible dans la rue.",
        ],
      },
    },
  },
  {
    n: 2,
    roman: "II",
    slug: "saint-martin",
    title: "Saint-Martin",
    subtitle: "Avant le canal, il y avait la rivière",
    quartier: "Canal Saint-Martin",
    arrondissement: "Paris 10ᵉ",
    coords: { lat: 48.8664, lng: 2.3689 },
    hero: "/img/plaque-2/00.jpg",
    fonte: "/plaques/plaque2-fonte.png",
    hasContent: true,
    specs: SPECS_COMMON("02", "Canal Saint-Martin · Paris 10ᵉ", "48.8664 N · 2.3689 E"),
    content: {
      heroCredit: "Image : Lavoir sur le canal Saint-Martin (carte postale LL.)",
      intro: {
        eyebrow: "La plaque · point II",
        title: "L'eau circulait déjà ici",
        lead: "Quand on évoque l'eau dans ce quartier, on pense aussitôt au canal Saint-Martin. Pourtant, bien avant sa construction, l'eau circulait déjà.",
        paragraphs: [
          "Le Ru de Ménilmontant descendait des hauteurs de Belleville en suivant les pentes naturelles du terrain. Son passage creusait des fossés, alimentait des mares et transformait certains chemins en véritables bourbiers après les orages.",
          "Les habitants apprennent à vivre avec cette géographie mouvante : de petits ponts de bois franchissent les zones les plus humides, et les artisans s'installent à proximité des écoulements pour profiter d'une ressource essentielle à leurs activités.",
        ],
      },
      duo: [
        {
          back: "/img/plaque-2/01.jpg",
          front: "/img/plaque-2/02.jpg",
          caption: "Assainissement du canal Saint-Martin (L'Illustration, XIXᵉ s.)",
        },
        {
          back: "/img/plaque-2/03.jpg",
          front: "/img/plaque-2/04.jpg",
          caption: "Le canal Saint-Martin aujourd'hui",
        },
      ],
      band: {
        eyebrow: "Du ruisseau à l'égout",
        title: "Le canal organise une eau ancienne",
        image: "/img/plaque-2/05.jpg",
        paragraphs: [
          "Lorsque le canal Saint-Martin est inauguré au XIXᵉ siècle, il ne fait finalement qu'organiser et maîtriser une présence de l'eau installée depuis des siècles. L'hiver, sa surface gelait et tout Paris venait y patiner.",
          "Sous les quais paisibles que l'on connaît aujourd'hui subsiste la mémoire d'un paysage bien plus sauvage, avant que le canal ne soit à son tour partiellement recouvert, boulevard Richard-Lenoir.",
        ],
      },
      quote: {
        text: "Le canal a rendu l'eau visible, et fait oublier les cours d'eau plus anciens.",
        image: "/img/plaque-2/06.jpg",
      },
      object: {
        title: "Une mémoire dans le béton",
        paragraphs: [
          "Au départ, l'idée était une peinture hydrochromique qui apparaît sous la pluie. Pour le diplôme, elle prend une forme plus durable : une plaque gravée dans le béton, posée au sol.",
          "Le tracé du ru et la carte de Paris sont incisés dans la matière. Quand il pleut, l'eau se loge dans les creux et fait ressortir le dessin. Le réseau oublié réapparaît sous les pas, comme si le ruisseau reprenait son chemin dans la ville.",
          "La pluie sert de révélateur : le temps d'une averse, un paysage enfoui remonte à la surface, et le ru redevient visible dans la rue.",
        ],
      },
    },
  },
  {
    n: 3,
    roman: "III",
    slug: "le-marais",
    title: "Le Marais",
    subtitle: "Quand l'eau régnait sur Paris",
    quartier: "Le Marais",
    arrondissement: "Paris 3ᵉ",
    coords: { lat: 48.868, lng: 2.3534 },
    hero: "/img/plaque-3/00.jpg",
    fonte: "/plaques/plaque3-fonte.png",
    hasContent: true,
    specs: SPECS_COMMON("03", "Le Marais · Paris 3ᵉ", "48.8680 N · 2.3534 E"),
    content: {
      heroCredit: "Image : Place des Vosges (l'ancien marais asséché et bâti)",
      intro: {
        eyebrow: "La plaque · point III",
        title: "Le nom dit l'eau",
        lead: "Aujourd'hui, le Marais évoque les hôtels particuliers, les galeries et les rues pavées. Pourtant, son nom raconte une tout autre histoire.",
        paragraphs: [
          "Pendant des siècles, cette partie de Paris est une vaste zone humide. Les eaux venues des collines de Belleville et du Ru de Ménilmontant s'y accumulent avant de poursuivre vers la Seine ; après les pluies, le paysage se change en un entrelacs de mares, de fossés et de terrains détrempés.",
          "On avance sur des chemins surélevés pour éviter la boue, les charrettes s'embourbent, certaines parcelles restent inutilisables plusieurs mois par an. Cette eau omniprésente décourage longtemps les constructions.",
        ],
      },
      duo: [
        {
          back: "/img/plaque-3/01.jpg",
          front: "/img/plaque-3/02.jpg",
          caption: "Le vieux Paris avant les grands travaux",
        },
        {
          back: "/img/plaque-3/03.jpg",
          front: "/img/plaque-3/04.jpg",
          caption: "La rue des Francs-Bourgeois, au cœur du Marais",
        },
      ],
      band: {
        eyebrow: "Du ruisseau à l'égout",
        title: "Le secteur se fait plus bâti",
        image: "/img/plaque-3/05.jpg",
        paragraphs: [
          "Puis Paris grandit. Dès le Moyen Âge, religieux, artisans et nobles entreprennent d'assécher ces terres : fossés, remblais et canaux modifient peu à peu le paysage. Là où l'eau stagnait s'élèvent bientôt des jardins, puis de prestigieuses demeures.",
          "Aujourd'hui, les marécages ont disparu, mais leur souvenir demeure dans le nom même du quartier : l'un des secteurs les plus bâtis de Paris porte encore le nom d'un paysage entièrement façonné par l'eau.",
        ],
      },
      quote: {
        text: "Assécher pour bâtir.",
        image: "/img/plaque-3/06.jpg",
      },
      object: {
        title: "Une gravure dans le béton",
        paragraphs: [
          "Au départ, l'idée était une peinture hydrochromique qui apparaît sous la pluie. Pour le diplôme, elle prend une forme plus durable : une plaque gravée dans le béton, posée au sol.",
          "Le tracé du ru et la carte de Paris sont incisés dans la matière. Quand il pleut, l'eau se loge dans les creux et fait ressortir le dessin. Le réseau oublié réapparaît sous les pas, comme si le ruisseau reprenait son chemin dans la ville.",
          "La pluie sert de révélateur : le temps d'une averse, un paysage enfoui remonte à la surface, et le ru redevient visible dans la rue.",
        ],
      },
    },
  },
  {
    n: 4,
    roman: "IV",
    slug: "grands-boulevards",
    title: "Les Grands Boulevards",
    subtitle: "L'eau, un problème",
    quartier: "Grands Boulevards",
    arrondissement: "Paris 9ᵉ",
    coords: { lat: 48.871, lng: 2.3469 },
    hero: "/img/carousel/plaque-4-grands-boulevards.jpg",
    fonte: null,
    hasContent: false,
    specs: SPECS_COMMON("04", "Grands Boulevards · Paris 9ᵉ", "48.8710 N · 2.3469 E"),
    content: null,
  },
  {
    n: 5,
    roman: "V",
    slug: "opera-chaussee-dantin",
    title: "Opéra · Chaussée d'Antin",
    subtitle: "La revanche de l'eau",
    quartier: "Opéra",
    arrondissement: "Paris 9ᵉ",
    coords: { lat: 48.8731, lng: 2.3328 },
    hero: "/img/carousel/plaque-5-opera.jpg",
    fonte: null,
    hasContent: false,
    specs: SPECS_COMMON("05", "Opéra · Chaussée d'Antin · Paris 9ᵉ", "48.8731 N · 2.3328 E"),
    content: null,
  },
  {
    n: 6,
    roman: "VI",
    slug: "boulevard-haussmann",
    title: "Boulevard Haussmann",
    subtitle: "Enterrer les rivières",
    quartier: "Boulevard Haussmann",
    arrondissement: "Paris 9ᵉ",
    coords: { lat: 48.8741, lng: 2.3272 },
    hero: "/img/carousel/plaque-6-haussmann.jpg",
    fonte: null,
    hasContent: false,
    specs: SPECS_COMMON("06", "Boulevard Haussmann · Paris 9ᵉ", "48.8741 N · 2.3272 E"),
    content: null,
  },
  {
    n: 7,
    roman: "VII",
    slug: "saint-lazare",
    title: "Saint-Lazare",
    subtitle: "Aux frontières de la ville",
    quartier: "Saint-Lazare",
    arrondissement: "Paris 8ᵉ",
    coords: { lat: 48.8759, lng: 2.3295 },
    hero: "/img/carousel/plaque-7-saint-lazare.jpg",
    fonte: null,
    hasContent: false,
    specs: SPECS_COMMON("07", "Saint-Lazare · Paris 8ᵉ", "48.8759 N · 2.3295 E"),
    content: null,
  },
  {
    n: 8,
    roman: "VIII",
    slug: "alma-la-seine",
    title: "Alma · la Seine",
    subtitle: "L'embouchure",
    quartier: "Alma",
    arrondissement: "Paris 8ᵉ",
    coords: { lat: 48.8675, lng: 2.3071 },
    hero: "/img/carousel/plaque-8-alma.jpg",
    fonte: null,
    hasContent: false,
    specs: SPECS_COMMON("08", "Alma · la Seine · Paris 8ᵉ", "48.8675 N · 2.3071 E"),
    content: null,
  },
];

export const TOTAL_PLAQUES = plaques.length;

/** Par défaut (démo / visiteur non connecté) : I, II, III débloquées. */
export const DEFAULT_UNLOCKED = ["aux-sources-du-ru", "saint-martin", "le-marais"];

export function getPlaque(slug: string): Plaque | undefined {
  return plaques.find((p) => p.slug === slug);
}

export function getPlaqueByNumber(n: number): Plaque | undefined {
  return plaques.find((p) => p.n === n);
}

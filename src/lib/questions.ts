// The content moat. Each question is multiple-choice with exactly 4 options;
// `answer` is the index (0-3) of the correct one. `fact` is a one-liner shown
// after answering. Keep answers factually correct — this is a trust product.
// Adding questions is the cheapest growth lever: append here, deploy, done.

export type Category =
  | "modismos"
  | "música"
  | "fútbol"
  | "comida"
  | "geografía"
  | "historia"
  | "cultura";

export interface Question {
  id: number;
  category: Category;
  q: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  fact: string;
}

export const CATEGORY_LABEL: Record<Category, string> = {
  modismos: "Modismos",
  música: "Música",
  fútbol: "Fútbol",
  comida: "Comida",
  geografía: "Geografía",
  historia: "Historia",
  cultura: "Cultura pop",
};

export const QUESTIONS: Question[] = [
  // ---- Modismos ----
  {
    id: 1,
    category: "modismos",
    q: '¿Qué significa "cachai"?',
    options: ["¿Entiendes?", "¿Comes?", "¿Corres?", "¿Duermes?"],
    answer: 0,
    fact: '"Cachai" viene del inglés "to catch" y se usa para preguntar "¿entiendes?".',
  },
  {
    id: 2,
    category: "modismos",
    q: 'Si algo está "bacán", está…',
    options: ["Genial", "Aburrido", "Caro", "Roto"],
    answer: 0,
    fact: '"Bacán" es lo mejor: genial, estupendo, la raja.',
  },
  {
    id: 3,
    category: "modismos",
    q: '"Al tiro" significa…',
    options: ["De inmediato", "Con un arma", "Nunca", "Muy lento"],
    answer: 0,
    fact: 'Hacer algo "al tiro" es hacerlo de inmediato, en el acto.',
  },
  {
    id: 4,
    category: "modismos",
    q: "Una \"polola\" es…",
    options: ["Novia", "Un insecto", "Una amiga", "Una hermana"],
    answer: 0,
    fact: 'En Chile "pololear" es tener una relación de pareja formal pero no casada.',
  },
  {
    id: 5,
    category: "modismos",
    q: 'Un "carrete" es…',
    options: ["Una fiesta", "Un trabajo", "Una carrera", "Un enojo"],
    answer: 0,
    fact: '"Carretear" es salir de fiesta. El "carrete" es el evento.',
  },
  {
    id: 6,
    category: "modismos",
    q: 'Si estái "pato", estái…',
    options: ["Sin plata", "Enfermo", "Feliz", "Mojado"],
    answer: 0,
    fact: 'Andar "pato" es andar sin dinero, sin un peso.',
  },
  {
    id: 7,
    category: "modismos",
    q: '"Fome" significa…',
    options: ["Aburrido", "Divertido", "Rico", "Grande"],
    answer: 0,
    fact: 'Algo "fome" es aburrido o sin gracia. Muy usado en todo Chile.',
  },
  {
    id: 8,
    category: "modismos",
    q: '"La once" en Chile es…',
    options: ["La merienda de la tarde", "Una reunión a las 11", "Un equipo", "Un juego"],
    answer: 0,
    fact: 'La "once" es la merienda de la tarde, con pan, té y agregados.',
  },
  {
    id: 9,
    category: "modismos",
    q: 'Si algo te da "lata", te da…',
    options: ["Flojera o fastidio", "Hambre", "Alegría", "Miedo"],
    answer: 0,
    fact: 'Que algo "te dé lata" es que te dé pereza o fastidio hacerlo.',
  },
  {
    id: 10,
    category: "modismos",
    q: 'Un "guatón" es alguien…',
    options: ["De guata grande", "Muy alto", "Muy flaco", "Muy viejo"],
    answer: 0,
    fact: '"Guata" es la barriga; un "guatón" es alguien de barriga prominente.',
  },

  // ---- Música ----
  {
    id: 11,
    category: "música",
    q: '¿Qué banda chilena grabó "Tren al sur"?',
    options: ["Los Prisioneros", "Los Jaivas", "La Ley", "Los Bunkers"],
    answer: 0,
    fact: 'Los Prisioneros, de San Miguel, la publicaron en 1990 en "Corazones".',
  },
  {
    id: 12,
    category: "música",
    q: '¿Quién compuso "Gracias a la vida"?',
    options: ["Violeta Parra", "Gabriela Mistral", "Mon Laferte", "Myriam Hernández"],
    answer: 0,
    fact: 'Violeta Parra la compuso en 1966, poco antes de su muerte.',
  },
  {
    id: 13,
    category: "música",
    q: "Además de cantautor, Víctor Jara era destacado…",
    options: ["Director de teatro", "Futbolista", "Pintor", "Arquitecto"],
    answer: 0,
    fact: 'Víctor Jara fue un premiado director teatral antes de su carrera musical.',
  },
  {
    id: 14,
    category: "música",
    q: "La cantante Mon Laferte nació en…",
    options: ["Viña del Mar", "Santiago", "Concepción", "Antofagasta"],
    answer: 0,
    fact: 'Norma Monserrat Bustamante, "Mon Laferte", nació en Viña del Mar en 1983.',
  },
  {
    id: 15,
    category: "música",
    q: "El vocalista histórico de La Ley es…",
    options: ["Beto Cuevas", "Jorge González", "Álvaro Henríquez", "Gepe"],
    answer: 0,
    fact: 'Beto Cuevas lideró La Ley, banda ganadora de Grammy Latino.',
  },
  {
    id: 16,
    category: "música",
    q: 'Los Jaivas musicalizaron un poema de Neruda en el disco…',
    options: ["Alturas de Machu Picchu", "Canto libre", "La voz de los 80", "Pateando piedras"],
    answer: 0,
    fact: '"Alturas de Machu Picchu" (1981) llevó a Neruda al rock progresivo.',
  },

  // ---- Fútbol ----
  {
    id: 17,
    category: "fútbol",
    q: "¿En qué año ganó Chile su primera Copa América?",
    options: ["2015", "1962", "2016", "1998"],
    answer: 0,
    fact: "Chile ganó su primer título en 2015, como local, ante Argentina.",
  },
  {
    id: 18,
    category: "fútbol",
    q: "El apodo de la selección chilena es…",
    options: ["La Roja", "La Verde", "La Albiceleste", "La Tricolor"],
    answer: 0,
    fact: '"La Roja" por el color de su camiseta titular.',
  },
  {
    id: 19,
    category: "fútbol",
    q: "En la final de la Copa América 2015, Chile venció a…",
    options: ["Argentina", "Brasil", "Perú", "Uruguay"],
    answer: 0,
    fact: "Chile venció a Argentina por penales tras un 0-0 en el Nacional.",
  },
  {
    id: 20,
    category: "fútbol",
    q: 'Iván Zamorano usó en el Inter el número "1+8" porque…',
    options: ["No le dieron el 9", "Le gustaba sumar", "Era su cumpleaños", "Lo pidió el club"],
    answer: 0,
    fact: "Ronaldo se quedó con el 9, así que Zamorano llevó el 18 leído como 1+8.",
  },
  {
    id: 21,
    category: "fútbol",
    q: "¿Qué club tiene más títulos del fútbol chileno?",
    options: ["Colo-Colo", "Universidad de Chile", "Universidad Católica", "Cobreloa"],
    answer: 0,
    fact: "Colo-Colo, fundado en 1925, es el más laureado de Chile.",
  },
  {
    id: 22,
    category: "fútbol",
    q: "El apodo del goleador Marcelo Salas era…",
    options: ["El Matador", "El Bam Bam", "El Chino", "El Rey"],
    answer: 0,
    fact: 'Salas era "El Matador"; "Bam Bam" era el apodo de Iván Zamorano.',
  },
  {
    id: 23,
    category: "fútbol",
    q: "¿En qué Mundial Chile logró el tercer lugar como anfitrión?",
    options: ["1962", "1950", "1974", "1982"],
    answer: 0,
    fact: "En el Mundial de 1962, jugado en Chile, la Roja fue tercera.",
  },
  {
    id: 24,
    category: "fútbol",
    q: "El único club chileno que ganó la Copa Libertadores es…",
    options: ["Colo-Colo", "U. de Chile", "U. Católica", "Cobreloa"],
    answer: 0,
    fact: "Colo-Colo ganó la Libertadores en 1991, dirigido por Mirko Jozić.",
  },

  // ---- Comida ----
  {
    id: 25,
    category: "comida",
    q: 'El "terremoto" se prepara con pipeño y…',
    options: ["Helado de piña", "Cerveza", "Ron", "Jugo de limón"],
    answer: 0,
    fact: "El terremoto: vino pipeño con helado de piña. La réplica viene después.",
  },
  {
    id: 26,
    category: "comida",
    q: 'Un "completo italiano" lleva palta, tomate y…',
    options: ["Mayonesa", "Mostaza", "Queso", "Ají"],
    answer: 0,
    fact: "Palta, tomate y mayonesa imitan los colores de la bandera italiana.",
  },
  {
    id: 27,
    category: "comida",
    q: 'El "mote con huesillo" combina trigo mote con…',
    options: ["Duraznos deshidratados", "Manzanas", "Uvas", "Peras"],
    answer: 0,
    fact: 'El "huesillo" es un durazno deshidratado que se rehidrata en almíbar.',
  },
  {
    id: 28,
    category: "comida",
    q: 'El "pastel de choclo" se cubre con una capa de…',
    options: ["Maíz molido", "Puré de papas", "Arroz", "Masa de hojaldre"],
    answer: 0,
    fact: 'El "pino" queda bajo una capa dorada de choclo (maíz) molido.',
  },
  {
    id: 29,
    category: "comida",
    q: "Las sopaipillas chilenas se hacen tradicionalmente con…",
    options: ["Zapallo", "Papa", "Choclo", "Betarraga"],
    answer: 0,
    fact: "La masa lleva zapallo cocido; se comen con chancaca en invierno.",
  },
  {
    id: 30,
    category: "comida",
    q: 'El "pisco" chileno es un destilado de…',
    options: ["Uva", "Papa", "Caña de azúcar", "Maíz"],
    answer: 0,
    fact: "El pisco se destila de uvas, principalmente en Atacama y Coquimbo.",
  },

  // ---- Geografía ----
  {
    id: 31,
    category: "geografía",
    q: "El desierto más árido del mundo, en el norte de Chile, es el de…",
    options: ["Atacama", "Gobi", "Sahara", "Patagonia"],
    answer: 0,
    fact: "En zonas de Atacama hay estaciones sin registro de lluvia en años.",
  },
  {
    id: 32,
    category: "geografía",
    q: "El parque Torres del Paine está en la región de…",
    options: ["Magallanes", "Aysén", "Los Lagos", "Antofagasta"],
    answer: 0,
    fact: "Torres del Paine está en Magallanes, el extremo sur del país.",
  },
  {
    id: 33,
    category: "geografía",
    q: "La isla chilena famosa por sus moáis es…",
    options: ["Isla de Pascua", "Chiloé", "Robinson Crusoe", "Isla Mocha"],
    answer: 0,
    fact: "Rapa Nui (Isla de Pascua) está a unos 3.700 km del continente.",
  },
  {
    id: 34,
    category: "geografía",
    q: "El río más largo de Chile es el…",
    options: ["Loa", "Biobío", "Maipo", "Maule"],
    answer: 0,
    fact: "El Loa, en el norte, recorre unos 440 km en pleno desierto.",
  },
  {
    id: 35,
    category: "geografía",
    q: "El archipiélago de Chiloé es famoso por sus…",
    options: ["Iglesias de madera", "Volcanes activos", "Viñedos", "Playas tropicales"],
    answer: 0,
    fact: "Sus iglesias de madera son Patrimonio de la Humanidad de la Unesco.",
  },
  {
    id: 36,
    category: "geografía",
    q: "¿Cuántas regiones tiene Chile actualmente?",
    options: ["16", "15", "13", "12"],
    answer: 0,
    fact: "Ñuble se sumó en 2018 como la región número 16.",
  },
  {
    id: 37,
    category: "geografía",
    q: "El palacio de gobierno de Chile se llama…",
    options: ["La Moneda", "La Casa Rosada", "El Palacio Real", "La Zarzuela"],
    answer: 0,
    fact: "La Moneda fue, en su origen, la casa de moneda colonial.",
  },

  // ---- Historia ----
  {
    id: 38,
    category: "historia",
    q: "¿Qué chileno ganó el Premio Nobel de Literatura en 1971?",
    options: ["Pablo Neruda", "Nicanor Parra", "Isabel Allende", "José Donoso"],
    answer: 0,
    fact: "Neruda fue el segundo Nobel chileno de Literatura, tras Gabriela Mistral.",
  },
  {
    id: 39,
    category: "historia",
    q: "Gabriela Mistral ganó el Nobel de Literatura en…",
    options: ["1945", "1971", "1922", "1960"],
    answer: 0,
    fact: "En 1945 fue la primera persona latinoamericana en ganar ese Nobel.",
  },
  {
    id: 40,
    category: "historia",
    q: "El baile nacional de Chile es…",
    options: ["La cueca", "El tango", "La cumbia", "La marinera"],
    answer: 0,
    fact: "La cueca es baile nacional oficial desde 1979.",
  },
  {
    id: 41,
    category: "historia",
    q: "Las Fiestas Patrias se celebran el…",
    options: ["18 de septiembre", "12 de octubre", "21 de mayo", "1 de mayo"],
    answer: 0,
    fact: "El 18 recuerda la Primera Junta de Gobierno de 1810.",
  },
  {
    id: 42,
    category: "historia",
    q: 'El prócer conocido como "Libertador" de Chile es…',
    options: ["Bernardo O'Higgins", "José de San Martín", "Manuel Rodríguez", "Arturo Prat"],
    answer: 0,
    fact: "O'Higgins fue Director Supremo tras la independencia de 1818.",
  },
  {
    id: 43,
    category: "historia",
    q: 'El "21 de mayo" conmemora…',
    options: ["El Combate Naval de Iquique", "La Independencia", "El terremoto de 2010", "La fundación de Santiago"],
    answer: 0,
    fact: "Recuerda a Arturo Prat en el Combate Naval de Iquique de 1879.",
  },
  {
    id: 44,
    category: "historia",
    q: "El pueblo originario que resistió a los españoles en el sur es el…",
    options: ["Mapuche", "Aimara", "Rapa Nui", "Diaguita"],
    answer: 0,
    fact: "El pueblo mapuche resistió siglos al sur del río Biobío.",
  },
  {
    id: 45,
    category: "historia",
    q: "El terremoto de Valdivia de 1960, el más fuerte jamás registrado, tuvo magnitud…",
    options: ["9,5", "8,8", "7,0", "9,0"],
    answer: 0,
    fact: "Con 9,5 Mw sigue siendo el sismo más potente medido en el mundo.",
  },

  // ---- Cultura pop ----
  {
    id: 46,
    category: "cultura",
    q: '"31 minutos" es un exitoso programa chileno de…',
    options: ["Títeres", "Dibujos animados", "Concursos en vivo", "Noticias reales"],
    answer: 0,
    fact: "Es un noticiero de títeres creado por Aplaplac en 2003.",
  },
  {
    id: 47,
    category: "cultura",
    q: "El conductor del noticiero en 31 minutos es…",
    options: ["Tulio Triviño", "Juan Carlos Bodoque", "Policarpo Avendaño", "Mario Hugo"],
    answer: 0,
    fact: "Tulio Triviño Tufillo, de peinado imposible, es el ancla del programa.",
  },
  {
    id: 48,
    category: "cultura",
    q: "Juan Carlos Bodoque, de 31 minutos, es un…",
    options: ["Conejo rojo", "Perro café", "Gato negro", "Oso azul"],
    answer: 0,
    fact: 'El conejo rojo de la "Nota Verde" y voz crítica del noticiero.',
  },
  {
    id: 49,
    category: "cultura",
    q: "El premio que entrega el Festival de Viña a los artistas es la…",
    options: ["Gaviota", "Antorcha", "Estrella", "Palma"],
    answer: 0,
    fact: "La Gaviota de Plata y de Oro se entregan según el favor del público.",
  },
  {
    id: 50,
    category: "cultura",
    q: 'En el Festival de Viña, "el monstruo" se refiere a…',
    options: ["El público", "Un premio", "Un cantante", "El escenario"],
    answer: 0,
    fact: 'Al exigente público de la Quinta Vergara le dicen "el monstruo".',
  },
  {
    id: 51,
    category: "cultura",
    q: "El animal que acompaña al cóndor en el escudo de Chile es el…",
    options: ["Huemul", "Puma", "Guanaco", "Zorro"],
    answer: 0,
    fact: "El huemul, un ciervo nativo del sur, junto al cóndor de los Andes.",
  },
  {
    id: 52,
    category: "cultura",
    q: "La flor nacional de Chile es…",
    options: ["El copihue", "La rosa", "El clavel", "El girasol"],
    answer: 0,
    fact: "El copihue, rojo y colgante, crece en los bosques del sur.",
  },
  {
    id: 53,
    category: "cultura",
    q: "La Teletón chilena recauda fondos para…",
    options: ["Niños con discapacidad", "Adultos mayores", "Animales abandonados", "Reforestación"],
    answer: 0,
    fact: "Desde 1978, financia la rehabilitación de niños y jóvenes con discapacidad.",
  },
];

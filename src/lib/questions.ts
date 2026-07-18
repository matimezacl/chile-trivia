// The content moat. Each question is multiple-choice with exactly 4 options;
// `answer` is the index (0-3) of the correct one. `fact` is a one-liner shown
// after answering. `difficulty` drives scoring: harder = more points.
// Keep answers factually correct — this is a trust product. Adding questions is
// the cheapest growth lever: append here, deploy, done.

export type Category =
  | "modismos"
  | "música"
  | "fútbol"
  | "comida"
  | "geografía"
  | "historia"
  | "cultura"
  | "tv"
  | "ciencia";

// 1 = fácil, 2 = media, 3 = difícil.
export type Difficulty = 1 | 2 | 3;

export interface Question {
  id: number;
  category: Category;
  difficulty: Difficulty;
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
  tv: "Cine y TV",
  ciencia: "Ciencia",
};

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  1: "Fácil",
  2: "Media",
  3: "Difícil",
};

export const QUESTIONS: Question[] = [
  // ---- Modismos ----
  { id: 1, category: "modismos", difficulty: 1, q: '¿Qué significa "cachai"?', options: ["¿Entiendes?", "¿Comes?", "¿Corres?", "¿Duermes?"], answer: 0, fact: '"Cachai" viene del inglés "to catch" y se usa para preguntar "¿entiendes?".' },
  { id: 2, category: "modismos", difficulty: 1, q: 'Si algo está "bacán", está…', options: ["Genial", "Aburrido", "Caro", "Roto"], answer: 0, fact: '"Bacán" es lo mejor: genial, estupendo, la raja.' },
  { id: 3, category: "modismos", difficulty: 1, q: '"Al tiro" significa…', options: ["De inmediato", "Con un arma", "Nunca", "Muy lento"], answer: 0, fact: 'Hacer algo "al tiro" es hacerlo de inmediato, en el acto.' },
  { id: 4, category: "modismos", difficulty: 1, q: 'Una "polola" es…', options: ["Novia", "Un insecto", "Una amiga", "Una hermana"], answer: 0, fact: 'En Chile "pololear" es tener una relación de pareja formal pero no casada.' },
  { id: 5, category: "modismos", difficulty: 1, q: 'Un "carrete" es…', options: ["Una fiesta", "Un trabajo", "Una carrera", "Un enojo"], answer: 0, fact: '"Carretear" es salir de fiesta. El "carrete" es el evento.' },
  { id: 6, category: "modismos", difficulty: 2, q: 'Si estái "pato", estái…', options: ["Sin plata", "Enfermo", "Feliz", "Mojado"], answer: 0, fact: 'Andar "pato" es andar sin dinero, sin un peso.' },
  { id: 7, category: "modismos", difficulty: 1, q: '"Fome" significa…', options: ["Aburrido", "Divertido", "Rico", "Grande"], answer: 0, fact: 'Algo "fome" es aburrido o sin gracia. Muy usado en todo Chile.' },
  { id: 8, category: "modismos", difficulty: 2, q: '"La once" en Chile es…', options: ["La merienda de la tarde", "Una reunión a las 11", "Un equipo", "Un juego"], answer: 0, fact: 'La "once" es la merienda de la tarde, con pan, té y agregados.' },
  { id: 9, category: "modismos", difficulty: 2, q: 'Si algo te da "lata", te da…', options: ["Flojera o fastidio", "Hambre", "Alegría", "Miedo"], answer: 0, fact: 'Que algo "te dé lata" es que te dé pereza o fastidio hacerlo.' },
  { id: 10, category: "modismos", difficulty: 1, q: 'Un "guatón" es alguien…', options: ["De guata grande", "Muy alto", "Muy flaco", "Muy viejo"], answer: 0, fact: '"Guata" es la barriga; un "guatón" es alguien de barriga prominente.' },
  { id: 54, category: "modismos", difficulty: 2, q: 'Andar "piola" es andar…', options: ["Tranquilo y discreto", "Muy apurado", "Enojado", "Perdido"], answer: 0, fact: '"Piola" es pasar desapercibido, sin llamar la atención.' },
  { id: 55, category: "modismos", difficulty: 2, q: '"El tata" en Chile suele ser…', options: ["El abuelo", "El jefe", "Un amigo", "El perro"], answer: 0, fact: 'Cariñosamente, "el tata" es el abuelo (y "la tata", la abuela o niñera).' },
  { id: 56, category: "modismos", difficulty: 2, q: 'Algo "cuático" es algo…', options: ["Exagerado o intenso", "Barato", "Lento", "Dulce"], answer: 0, fact: '"Cuático" describe lo exagerado, aparatoso o complicado.' },
  { id: 57, category: "modismos", difficulty: 2, q: 'Estar "achacado" es estar…', options: ["Decaído o triste", "Muy feliz", "Con mucha energía", "Con hambre"], answer: 0, fact: '"Achacarse" es desanimarse o entristecerse por algo.' },

  // ---- Música ----
  { id: 11, category: "música", difficulty: 2, q: '¿Qué banda chilena grabó "Tren al sur"?', options: ["Los Prisioneros", "Los Jaivas", "La Ley", "Los Bunkers"], answer: 0, fact: 'Los Prisioneros, de San Miguel, la publicaron en 1990 en "Corazones".' },
  { id: 12, category: "música", difficulty: 2, q: '¿Quién compuso "Gracias a la vida"?', options: ["Violeta Parra", "Gabriela Mistral", "Mon Laferte", "Myriam Hernández"], answer: 0, fact: 'Violeta Parra la compuso en 1966, poco antes de su muerte.' },
  { id: 13, category: "música", difficulty: 3, q: "Además de cantautor, Víctor Jara era destacado…", options: ["Director de teatro", "Futbolista", "Pintor", "Arquitecto"], answer: 0, fact: 'Víctor Jara fue un premiado director teatral antes de su carrera musical.' },
  { id: 14, category: "música", difficulty: 2, q: "La cantante Mon Laferte nació en…", options: ["Viña del Mar", "Santiago", "Concepción", "Antofagasta"], answer: 0, fact: 'Norma Monserrat Bustamante, "Mon Laferte", nació en Viña del Mar en 1983.' },
  { id: 15, category: "música", difficulty: 2, q: "El vocalista histórico de La Ley es…", options: ["Beto Cuevas", "Jorge González", "Álvaro Henríquez", "Gepe"], answer: 0, fact: 'Beto Cuevas lideró La Ley, banda ganadora de Grammy Latino.' },
  { id: 16, category: "música", difficulty: 3, q: 'Los Jaivas musicalizaron un poema de Neruda en el disco…', options: ["Alturas de Machu Picchu", "Canto libre", "La voz de los 80", "Pateando piedras"], answer: 0, fact: '"Alturas de Machu Picchu" (1981) llevó a Neruda al rock progresivo.' },
  { id: 58, category: "música", difficulty: 2, q: 'La "Nueva Canción Chilena" tuvo como referente al grupo…', options: ["Inti-Illimani", "Los Bunkers", "Kudai", "Los Tres"], answer: 0, fact: 'Inti-Illimani y Quilapayún fueron pilares de la Nueva Canción Chilena.' },
  { id: 59, category: "música", difficulty: 3, q: 'El éxito internacional "Tu falta de querer" es de…', options: ["Mon Laferte", "Javiera Mena", "Denise Rosenthal", "Cami"], answer: 0, fact: 'El tema de Mon Laferte (2015) la catapultó en México y Chile.' },
  { id: 60, category: "música", difficulty: 2, q: 'La cueca, baile nacional, se baila agitando…', options: ["Un pañuelo", "Un sombrero", "Un bastón", "Una bandera"], answer: 0, fact: 'La pareja "corteja" describiendo círculos y agitando un pañuelo blanco.' },

  // ---- Fútbol ----
  { id: 17, category: "fútbol", difficulty: 1, q: "¿En qué año ganó Chile su primera Copa América?", options: ["2015", "1962", "2016", "1998"], answer: 0, fact: "Chile ganó su primer título en 2015, como local, ante Argentina." },
  { id: 18, category: "fútbol", difficulty: 1, q: "El apodo de la selección chilena es…", options: ["La Roja", "La Verde", "La Albiceleste", "La Tricolor"], answer: 0, fact: '"La Roja" por el color de su camiseta titular.' },
  { id: 19, category: "fútbol", difficulty: 2, q: "En la final de la Copa América 2015, Chile venció a…", options: ["Argentina", "Brasil", "Perú", "Uruguay"], answer: 0, fact: "Chile venció a Argentina por penales tras un 0-0 en el Nacional." },
  { id: 20, category: "fútbol", difficulty: 3, q: 'Iván Zamorano usó en el Inter el número "1+8" porque…', options: ["No le dieron el 9", "Le gustaba sumar", "Era su cumpleaños", "Lo pidió el club"], answer: 0, fact: "Ronaldo se quedó con el 9, así que Zamorano llevó el 18 leído como 1+8." },
  { id: 21, category: "fútbol", difficulty: 2, q: "¿Qué club tiene más títulos del fútbol chileno?", options: ["Colo-Colo", "Universidad de Chile", "Universidad Católica", "Cobreloa"], answer: 0, fact: "Colo-Colo, fundado en 1925, es el más laureado de Chile." },
  { id: 22, category: "fútbol", difficulty: 2, q: "El apodo del goleador Marcelo Salas era…", options: ["El Matador", "El Bam Bam", "El Chino", "El Rey"], answer: 0, fact: 'Salas era "El Matador"; "Bam Bam" era el apodo de Iván Zamorano.' },
  { id: 23, category: "fútbol", difficulty: 3, q: "¿En qué Mundial Chile logró el tercer lugar como anfitrión?", options: ["1962", "1950", "1974", "1982"], answer: 0, fact: "En el Mundial de 1962, jugado en Chile, la Roja fue tercera." },
  { id: 24, category: "fútbol", difficulty: 3, q: "El único club chileno que ganó la Copa Libertadores es…", options: ["Colo-Colo", "U. de Chile", "U. Católica", "Cobreloa"], answer: 0, fact: "Colo-Colo ganó la Libertadores en 1991, dirigido por Mirko Jozić." },
  { id: 61, category: "fútbol", difficulty: 2, q: "El Estadio Nacional de Chile está en la comuna de…", options: ["Ñuñoa", "Providencia", "Maipú", "La Florida"], answer: 0, fact: "El Estadio Nacional Julio Martínez está en Ñuñoa, Santiago." },
  { id: 62, category: "fútbol", difficulty: 2, q: 'El "Superclásico" del fútbol chileno enfrenta a Colo-Colo con…', options: ["Universidad de Chile", "U. Católica", "Cobreloa", "Everton"], answer: 0, fact: "Colo-Colo vs. Universidad de Chile es el clásico más popular del país." },

  // ---- Comida ----
  { id: 25, category: "comida", difficulty: 2, q: 'El "terremoto" se prepara con pipeño y…', options: ["Helado de piña", "Cerveza", "Ron", "Jugo de limón"], answer: 0, fact: "El terremoto: vino pipeño con helado de piña. La réplica viene después." },
  { id: 26, category: "comida", difficulty: 1, q: 'Un "completo italiano" lleva palta, tomate y…', options: ["Mayonesa", "Mostaza", "Queso", "Ají"], answer: 0, fact: "Palta, tomate y mayonesa imitan los colores de la bandera italiana." },
  { id: 27, category: "comida", difficulty: 2, q: 'El "mote con huesillo" combina trigo mote con…', options: ["Duraznos deshidratados", "Manzanas", "Uvas", "Peras"], answer: 0, fact: 'El "huesillo" es un durazno deshidratado que se rehidrata en almíbar.' },
  { id: 28, category: "comida", difficulty: 1, q: 'El "pastel de choclo" se cubre con una capa de…', options: ["Maíz molido", "Puré de papas", "Arroz", "Masa de hojaldre"], answer: 0, fact: 'El "pino" queda bajo una capa dorada de choclo (maíz) molido.' },
  { id: 29, category: "comida", difficulty: 2, q: "Las sopaipillas chilenas se hacen tradicionalmente con…", options: ["Zapallo", "Papa", "Choclo", "Betarraga"], answer: 0, fact: "La masa lleva zapallo cocido; se comen con chancaca en invierno." },
  { id: 30, category: "comida", difficulty: 1, q: 'El "pisco" chileno es un destilado de…', options: ["Uva", "Papa", "Caña de azúcar", "Maíz"], answer: 0, fact: "El pisco se destila de uvas, principalmente en Atacama y Coquimbo." },
  { id: 63, category: "comida", difficulty: 2, q: 'El "curanto" es un plato típico de…', options: ["Chiloé", "Atacama", "Santiago", "Valparaíso"], answer: 0, fact: "El curanto se cocina en un hoyo con piedras calientes, tradición chilota." },
  { id: 64, category: "comida", difficulty: 1, q: 'El "pebre" chileno es una salsa a base de…', options: ["Tomate, cilantro y ají", "Palta", "Queso", "Mayonesa"], answer: 0, fact: "El pebre acompaña el pan y los asados en casi toda mesa chilena." },
  { id: 65, category: "comida", difficulty: 3, q: 'El "charquicán" lleva papas, zapallo, verduras y…', options: ["Charqui (carne seca)", "Mariscos", "Pollo", "Pescado"], answer: 0, fact: "Su nombre viene del charqui, la carne secada al sol de origen prehispánico." },

  // ---- Geografía ----
  { id: 31, category: "geografía", difficulty: 1, q: "El desierto más árido del mundo, en el norte de Chile, es el de…", options: ["Atacama", "Gobi", "Sahara", "Patagonia"], answer: 0, fact: "En zonas de Atacama hay estaciones sin registro de lluvia en años." },
  { id: 32, category: "geografía", difficulty: 2, q: "El parque Torres del Paine está en la región de…", options: ["Magallanes", "Aysén", "Los Lagos", "Antofagasta"], answer: 0, fact: "Torres del Paine está en Magallanes, el extremo sur del país." },
  { id: 33, category: "geografía", difficulty: 1, q: "La isla chilena famosa por sus moáis es…", options: ["Isla de Pascua", "Chiloé", "Robinson Crusoe", "Isla Mocha"], answer: 0, fact: "Rapa Nui (Isla de Pascua) está a unos 3.700 km del continente." },
  { id: 34, category: "geografía", difficulty: 3, q: "El río más largo de Chile es el…", options: ["Loa", "Biobío", "Maipo", "Maule"], answer: 0, fact: "El Loa, en el norte, recorre unos 440 km en pleno desierto." },
  { id: 35, category: "geografía", difficulty: 2, q: "El archipiélago de Chiloé es famoso por sus…", options: ["Iglesias de madera", "Volcanes activos", "Viñedos", "Playas tropicales"], answer: 0, fact: "Sus iglesias de madera son Patrimonio de la Humanidad de la Unesco." },
  { id: 36, category: "geografía", difficulty: 2, q: "¿Cuántas regiones tiene Chile actualmente?", options: ["16", "15", "13", "12"], answer: 0, fact: "Ñuble se sumó en 2018 como la región número 16." },
  { id: 37, category: "geografía", difficulty: 1, q: "El palacio de gobierno de Chile se llama…", options: ["La Moneda", "La Casa Rosada", "El Palacio Real", "La Zarzuela"], answer: 0, fact: "La Moneda fue, en su origen, la casa de moneda colonial." },
  { id: 66, category: "geografía", difficulty: 3, q: "El punto más alto de Chile es el…", options: ["Nevado Ojos del Salado", "Aconcagua", "Volcán Villarrica", "Cerro El Plomo"], answer: 0, fact: "Ojos del Salado (6.893 m) es además el volcán activo más alto del mundo." },
  { id: 67, category: "geografía", difficulty: 2, q: "La corriente marina fría que recorre la costa chilena es la de…", options: ["Humboldt", "Del Golfo", "El Niño", "De Brasil"], answer: 0, fact: "La corriente de Humboldt enfría el mar y sostiene una rica pesca." },
  { id: 68, category: "geografía", difficulty: 3, q: "La ciudad chilena considerada la más austral del mundo es…", options: ["Puerto Williams", "Punta Arenas", "Puerto Natales", "Coyhaique"], answer: 0, fact: "Puerto Williams, en la isla Navarino, ostenta el título de ciudad más austral." },

  // ---- Historia ----
  { id: 38, category: "historia", difficulty: 2, q: "¿Qué chileno ganó el Premio Nobel de Literatura en 1971?", options: ["Pablo Neruda", "Nicanor Parra", "Isabel Allende", "José Donoso"], answer: 0, fact: "Neruda fue el segundo Nobel chileno de Literatura, tras Gabriela Mistral." },
  { id: 39, category: "historia", difficulty: 2, q: "Gabriela Mistral ganó el Nobel de Literatura en…", options: ["1945", "1971", "1922", "1960"], answer: 0, fact: "En 1945 fue la primera persona latinoamericana en ganar ese Nobel." },
  { id: 40, category: "historia", difficulty: 1, q: "El baile nacional de Chile es…", options: ["La cueca", "El tango", "La cumbia", "La marinera"], answer: 0, fact: "La cueca es baile nacional oficial desde 1979." },
  { id: 41, category: "historia", difficulty: 1, q: "Las Fiestas Patrias se celebran el…", options: ["18 de septiembre", "12 de octubre", "21 de mayo", "1 de mayo"], answer: 0, fact: "El 18 recuerda la Primera Junta de Gobierno de 1810." },
  { id: 42, category: "historia", difficulty: 2, q: 'El prócer conocido como "Libertador" de Chile es…', options: ["Bernardo O'Higgins", "José de San Martín", "Manuel Rodríguez", "Arturo Prat"], answer: 0, fact: "O'Higgins fue Director Supremo tras la independencia de 1818." },
  { id: 43, category: "historia", difficulty: 2, q: 'El "21 de mayo" conmemora…', options: ["El Combate Naval de Iquique", "La Independencia", "El terremoto de 2010", "La fundación de Santiago"], answer: 0, fact: "Recuerda a Arturo Prat en el Combate Naval de Iquique de 1879." },
  { id: 44, category: "historia", difficulty: 1, q: "El pueblo originario que resistió a los españoles en el sur es el…", options: ["Mapuche", "Aimara", "Rapa Nui", "Diaguita"], answer: 0, fact: "El pueblo mapuche resistió siglos al sur del río Biobío." },
  { id: 45, category: "historia", difficulty: 3, q: "El terremoto de Valdivia de 1960, el más fuerte jamás registrado, tuvo magnitud…", options: ["9,5", "8,8", "7,0", "9,0"], answer: 0, fact: "Con 9,5 Mw sigue siendo el sismo más potente medido en el mundo." },
  { id: 69, category: "historia", difficulty: 3, q: "¿En qué año fundó Pedro de Valdivia la ciudad de Santiago?", options: ["1541", "1520", "1600", "1492"], answer: 0, fact: "Santiago de Nueva Extremadura se fundó el 12 de febrero de 1541." },
  { id: 70, category: "historia", difficulty: 2, q: "La Guerra del Pacífico (1879-1884) enfrentó a Chile contra…", options: ["Perú y Bolivia", "Argentina y Perú", "Bolivia y Brasil", "Argentina y Bolivia"], answer: 0, fact: "Tras la guerra, Chile incorporó territorios del norte como Antofagasta y Arica." },
  { id: 71, category: "historia", difficulty: 2, q: "Chile declaró formalmente su independencia en…", options: ["1818", "1810", "1820", "1826"], answer: 0, fact: "La independencia se proclamó el 12 de febrero de 1818." },
  { id: 72, category: "historia", difficulty: 3, q: "¿Quién comandó la Escuadra Libertadora que zarpó de Valparaíso hacia Perú en 1820?", options: ["Lord Cochrane", "Arturo Prat", "Manuel Rodríguez", "Diego Portales"], answer: 0, fact: "El marino británico Thomas Cochrane comandó la naciente escuadra chilena." },
  { id: 73, category: "historia", difficulty: 2, q: "La primera mujer en ser Presidenta de Chile fue…", options: ["Michelle Bachelet", "Isabel Allende", "Evelyn Matthei", "Gabriela Mistral"], answer: 0, fact: "Michelle Bachelet asumió la presidencia en 2006." },

  // ---- Cultura pop ----
  { id: 46, category: "cultura", difficulty: 1, q: '"31 minutos" es un exitoso programa chileno de…', options: ["Títeres", "Dibujos animados", "Concursos en vivo", "Noticias reales"], answer: 0, fact: "Es un noticiero de títeres creado por Aplaplac en 2003." },
  { id: 47, category: "cultura", difficulty: 2, q: "El conductor del noticiero en 31 minutos es…", options: ["Tulio Triviño", "Juan Carlos Bodoque", "Policarpo Avendaño", "Mario Hugo"], answer: 0, fact: "Tulio Triviño Tufillo, de peinado imposible, es el ancla del programa." },
  { id: 48, category: "cultura", difficulty: 2, q: "Juan Carlos Bodoque, de 31 minutos, es un…", options: ["Conejo rojo", "Perro café", "Gato negro", "Oso azul"], answer: 0, fact: 'El conejo rojo de la "Nota Verde" y voz crítica del noticiero.' },
  { id: 49, category: "cultura", difficulty: 2, q: "El premio que entrega el Festival de Viña a los artistas es la…", options: ["Gaviota", "Antorcha", "Estrella", "Palma"], answer: 0, fact: "La Gaviota de Plata y de Oro se entregan según el favor del público." },
  { id: 50, category: "cultura", difficulty: 3, q: 'En el Festival de Viña, "el monstruo" se refiere a…', options: ["El público", "Un premio", "Un cantante", "El escenario"], answer: 0, fact: 'Al exigente público de la Quinta Vergara le dicen "el monstruo".' },
  { id: 51, category: "cultura", difficulty: 2, q: "El animal que acompaña al cóndor en el escudo de Chile es el…", options: ["Huemul", "Puma", "Guanaco", "Zorro"], answer: 0, fact: "El huemul, un ciervo nativo del sur, junto al cóndor de los Andes." },
  { id: 52, category: "cultura", difficulty: 1, q: "La flor nacional de Chile es…", options: ["El copihue", "La rosa", "El clavel", "El girasol"], answer: 0, fact: "El copihue, rojo y colgante, crece en los bosques del sur." },
  { id: 53, category: "cultura", difficulty: 1, q: "La Teletón chilena recauda fondos para…", options: ["Niños con discapacidad", "Adultos mayores", "Animales abandonados", "Reforestación"], answer: 0, fact: "Desde 1978, financia la rehabilitación de niños y jóvenes con discapacidad." },

  // ---- Cine y TV ----
  { id: 74, category: "tv", difficulty: 3, q: "La película chilena que ganó el Oscar a Mejor Película Extranjera fue…", options: ["Una mujer fantástica", "No", "Gloria", "El Club"], answer: 0, fact: '"Una mujer fantástica" de Sebastián Lelio ganó el Oscar en 2018.' },
  { id: 75, category: "tv", difficulty: 1, q: "El Festival Internacional de la Canción se realiza en la…", options: ["Quinta Vergara", "Plaza Italia", "Estadio Nacional", "Cerro San Cristóbal"], answer: 0, fact: "La Quinta Vergara, en Viña del Mar, alberga el festival desde 1960." },
  { id: 76, category: "tv", difficulty: 2, q: '"Los 80", exitosa teleserie chilena, estaba ambientada en…', options: ["La década de 1980", "Los años 60", "El futuro", "La Colonia"], answer: 0, fact: "Canal 13 retrató la vida de una familia chilena durante los años 80." },
  { id: 77, category: "tv", difficulty: 2, q: "El popular animador de la TV chilena apodado 'Don Francisco' condujo por décadas…", options: ["Sábados Gigantes", "Mekano", "Rojo", "Yingo"], answer: 0, fact: "Mario Kreutzberger, Don Francisco, condujo Sábados Gigantes por más de 50 años." },

  // ---- Ciencia ----
  { id: 78, category: "ciencia", difficulty: 2, q: "Los grandes observatorios astronómicos se instalan en el norte de Chile por…", options: ["Sus cielos despejados", "Su cercanía al mar", "Sus lluvias", "Su vegetación"], answer: 0, fact: "El desierto de Atacama tiene algunos de los cielos más limpios del planeta." },
  { id: 79, category: "ciencia", difficulty: 3, q: "El observatorio ALMA, en Atacama, observa el universo en ondas…", options: ["Milimétricas", "De rayos X", "De radio AM", "Ultravioleta solamente"], answer: 0, fact: "ALMA es un conjunto de 66 antenas que captan ondas milimétricas del cosmos." },
  { id: 80, category: "ciencia", difficulty: 3, q: "El árbol nativo chileno 'quillay' es valorado mundialmente por sus…", options: ["Saponinas usadas en vacunas", "Frutos comestibles", "Flores azules", "Madera para barcos"], answer: 0, fact: "Sus saponinas se usan como adyuvante en vacunas, incluida una contra el COVID-19." },
  { id: 81, category: "ciencia", difficulty: 2, q: "El árbol más longevo de Chile, el alerce, puede vivir más de…", options: ["3.000 años", "300 años", "100 años", "500 años"], answer: 0, fact: "El alerce patagónico es de los seres vivos más longevos del planeta." },

  // ==== Batch 2 (2026-07-18): grow the pool from 81 → 200+ ====

  // ---- Modismos ----
  { id: 82, category: "modismos", difficulty: 2, q: 'Estar "chato" significa…', options: ["Estar harto o cansado", "Estar contento", "Tener hambre", "Estar apurado"], answer: 0, fact: '"Estoy chato" es una queja muy chilena de aburrimiento o hastío.' },
  { id: 83, category: "modismos", difficulty: 2, q: 'Amanecer "con caña" es amanecer…', options: ["Con resaca", "Descansado", "Enfermo del estómago", "Con hambre"], answer: 0, fact: '"Andar con caña" es sentir los efectos del carrete del día anterior.' },
  { id: 84, category: "modismos", difficulty: 1, q: 'En Chile, una "guagua" es…', options: ["Un bebé", "Un bus", "Un juguete", "Un pájaro"], answer: 0, fact: 'A diferencia del Caribe, en Chile "guagua" es un bebé de brazos.' },
  { id: 85, category: "modismos", difficulty: 3, q: 'Conseguir algo "por pituto" es conseguirlo por…', options: ["Un contacto o palanca", "Concurso público", "Casualidad", "Herencia"], answer: 0, fact: 'Un "pituto" es un contacto o enchufe que te ayuda a lograr algo.' },
  { id: 86, category: "modismos", difficulty: 2, q: 'Tener "tuto" es tener…', options: ["Sueño", "Frío", "Hambre", "Miedo"], answer: 0, fact: '"Tuto" es el sueño o cansancio, sobre todo en el habla con guaguas.' },
  { id: 87, category: "modismos", difficulty: 3, q: 'Alguien "cuico" es alguien…', options: ["De clase alta o pituco", "Muy pobre", "Muy gordo", "Muy tímido"], answer: 0, fact: '"Cuico" alude a alguien acomodado, a menudo del "barrio alto".' },
  { id: 88, category: "modismos", difficulty: 2, q: 'La "pega" en Chile es…', options: ["El trabajo", "La comida", "Una fiesta", "Una mentira"], answer: 0, fact: '"Voy a la pega" = "voy al trabajo". Uso muy común.' },
  { id: 89, category: "modismos", difficulty: 3, q: 'Una "picada" en Chile es…', options: ["Un restaurante barato y bueno", "Una discusión", "Un baile", "Un dolor"], answer: 0, fact: 'Una "picada" es un lugar sencillo de comer, con buena relación precio-calidad.' },
  { id: 90, category: "modismos", difficulty: 2, q: 'La "yapa" es…', options: ["Un pequeño regalo extra", "Una deuda", "Un dolor", "Un peinado"], answer: 0, fact: 'Herencia del quechua, la "yapa" es lo que el vendedor agrega gratis.' },
  { id: 91, category: "modismos", difficulty: 3, q: 'Un "quiltro" es…', options: ["Un perro callejero o mestizo", "Un pájaro", "Un gato con manchas", "Un niño travieso"], answer: 0, fact: 'Del mapudungun "trilque"; se usa para perros sin raza definida.' },
  { id: 92, category: "modismos", difficulty: 2, q: '"Sipo" es una forma corta de decir…', options: ["Sí, pues", "No sé", "Chao", "Vale"], answer: 0, fact: 'La partícula "po" (de "pues") aparece por todos lados en el habla chilena.' },
  { id: 93, category: "modismos", difficulty: 3, q: 'Algo "encachado" es algo…', options: ["Bonito o entretenido", "Caro", "Fome", "Sucio"], answer: 0, fact: '"Encachado" es sinónimo informal de "bacán" o "buena onda".' },
  { id: 94, category: "modismos", difficulty: 1, q: 'Decir "chao" en Chile es…', options: ["Despedirse", "Saludar", "Agradecer", "Pedir perdón"], answer: 0, fact: 'Se usa igual que "adiós", con influencia del "ciao" italiano.' },
  { id: 95, category: "modismos", difficulty: 2, q: 'La "once" tradicionalmente incluye…', options: ["Pan, té y agregados", "Sopa y ensalada", "Pescado y arroz", "Fruta fresca"], answer: 0, fact: 'Combina té o café con pan, palta, mermeladas, queso y hasta huevo.' },
  { id: 96, category: "modismos", difficulty: 3, q: 'Un "chascón" es alguien…', options: ["De pelo desordenado", "Muy pulcro", "Muy alto", "Muy pequeño"], answer: 0, fact: '"Chascón" viene del mapudungun y describe pelo largo y despeinado.' },
  { id: 97, category: "modismos", difficulty: 2, q: 'Andar "colgado" en clase o en la pega es andar…', options: ["Atrasado o distraído", "Adelantado", "Alegre", "Enojado"], answer: 0, fact: '"Estás colgado" = te perdiste, no cachái lo que pasa.' },
  { id: 98, category: "modismos", difficulty: 3, q: '"Andar pato" es un modismo hermano de…', options: ["Andar sin plata", "Andar cansado", "Andar enfermo", "Andar apurado"], answer: 0, fact: 'Otras variantes: "pato malo", "andar corto de billete".' },

  // ---- Música ----
  { id: 99, category: "música", difficulty: 1, q: "El festival musical más famoso de Chile se realiza en…", options: ["Viña del Mar", "Santiago", "Iquique", "Valparaíso"], answer: 0, fact: 'El Festival de Viña del Mar se realiza cada febrero desde 1960.' },
  { id: 100, category: "música", difficulty: 2, q: "Los Bunkers son una banda de rock originaria de…", options: ["Concepción", "Valparaíso", "La Serena", "Santiago"], answer: 0, fact: 'Formados en Concepción en 1999, mezclaron rock y canción latinoamericana.' },
  { id: 101, category: "música", difficulty: 2, q: "La cantante y rapera chileno-francesa Ana Tijoux es conocida por…", options: ['"1977"', '"Latinoamérica"', '"Zamba"', '"Ojalá"'], answer: 0, fact: '"1977" (2010) le dio proyección internacional a Ana Tijoux.' },
  { id: 102, category: "música", difficulty: 2, q: "La banda chilena de cumbia moderna con éxitos como 'Loca' es…", options: ["Chico Trujillo", "Los Prisioneros", "La Ley", "Los Jaivas"], answer: 0, fact: 'Chico Trujillo revitalizó la cumbia chilena desde fines de los 90.' },
  { id: 103, category: "música", difficulty: 3, q: "El grupo Inti-Illimani debe su nombre a…", options: ["Un cerro de Bolivia", "Un río chileno", "Una estrella", "Un poema"], answer: 0, fact: 'El Illimani es una montaña de Bolivia; el grupo se formó en 1967.' },
  { id: 104, category: "música", difficulty: 3, q: "La canción 'La Exiliada del Sur' fue compuesta por Violeta Parra a partir de…", options: ["Un poema de su hermano Nicanor", "Un cuento popular", "Una carta anónima", "Un poema propio"], answer: 0, fact: 'Nicanor Parra escribió el poema y Violeta lo musicalizó.' },
  { id: 105, category: "música", difficulty: 2, q: "Camila Gallardo, conocida como 'Cami', se hizo famosa tras participar en…", options: ["The Voice Chile", "Rojo", "Yo Soy Chile", "Talento Chileno"], answer: 0, fact: "Cami quedó segunda en la primera temporada de The Voice Chile (2015)." },
  { id: 106, category: "música", difficulty: 1, q: "Violeta Parra nació en…", options: ["San Carlos, Ñuble", "Santiago", "Valparaíso", "Chillán"], answer: 0, fact: 'Nació en San Carlos en 1917 y creció en la zona de Chillán.' },
  { id: 107, category: "música", difficulty: 2, q: "El principal premio musical del país es el Premio…", options: ["Pulsar", "Copihue de Oro", "Altazor", "Gaviota"], answer: 0, fact: 'El Pulsar, entregado por la SCD desde 2015, reconoce lo mejor de la música chilena.' },
  { id: 108, category: "música", difficulty: 3, q: "El disco 'Alturas de Machu Picchu' de Los Jaivas se publicó en…", options: ["1981", "1972", "1990", "1968"], answer: 0, fact: 'El álbum musicaliza cantos de Pablo Neruda y es un clásico latinoamericano.' },
  { id: 109, category: "música", difficulty: 1, q: '"El Baile de los que Sobran" es un himno de…', options: ["Los Prisioneros", "Los Jaivas", "La Ley", "Los Bunkers"], answer: 0, fact: 'Publicada en 1986, la canción se volvió emblema de generaciones chilenas.' },
  { id: 110, category: "música", difficulty: 3, q: "Roberto Parra, tío del músico Ángel Parra, es autor de…", options: ["La Negra Ester", "Gracias a la Vida", "La Jardinera", "Run Run se fue pal Norte"], answer: 0, fact: '"La Negra Ester" (1980) es un clásico de la cueca chora en décimas.' },
  { id: 111, category: "música", difficulty: 2, q: "Los Prisioneros surgieron en la comuna santiaguina de…", options: ["San Miguel", "Ñuñoa", "La Reina", "Providencia"], answer: 0, fact: 'Jorge González, Claudio Narea y Miguel Tapia se conocieron en San Miguel.' },
  { id: 112, category: "música", difficulty: 3, q: "Illapu, referente del canto andino chileno, se formó en…", options: ["Antofagasta", "Santiago", "Iquique", "Arica"], answer: 0, fact: 'Los hermanos Márquez fundaron Illapu en Antofagasta en 1971.' },
  { id: 113, category: "música", difficulty: 2, q: "Myriam Hernández es conocida como…", options: ["La Baladista de América", "La Reina del Bolero", "La Voz del Sur", "La Diva del Pacífico"], answer: 0, fact: 'Su balada romántica la consolidó en toda Latinoamérica desde los 80.' },

  // ---- Fútbol ----
  { id: 114, category: "fútbol", difficulty: 2, q: "El defensa histórico chileno tres veces mejor jugador de Sudamérica es…", options: ["Elías Figueroa", "Iván Zamorano", "Marcelo Salas", "Sergio Livingstone"], answer: 0, fact: 'Elías Figueroa ganó el premio en 1974, 1975 y 1976.' },
  { id: 115, category: "fútbol", difficulty: 1, q: "Alexis Sánchez recibió el apodo de…", options: ["Niño Maravilla", "El Matador", "El Bam Bam", "El Cóndor"], answer: 0, fact: '"Niño Maravilla" viene de sus primeros pasos en Cobreloa y Colo-Colo.' },
  { id: 116, category: "fútbol", difficulty: 2, q: "Arturo Vidal debutó profesionalmente en…", options: ["Colo-Colo", "U. de Chile", "U. Católica", "Cobreloa"], answer: 0, fact: 'Debutó en Colo-Colo en 2006 antes de partir a Europa.' },
  { id: 117, category: "fútbol", difficulty: 2, q: "Claudio Bravo es histórico jugando en la posición de…", options: ["Arquero", "Delantero", "Defensor central", "Volante"], answer: 0, fact: 'Bravo defendió el arco de La Roja en los títulos de 2015 y 2016.' },
  { id: 118, category: "fútbol", difficulty: 2, q: "Chile ganó su segunda Copa América en el año…", options: ["2016", "2015", "2019", "2011"], answer: 0, fact: "La Copa América Centenario de 2016 fue el bicampeonato, otra vez ante Argentina." },
  { id: 119, category: "fútbol", difficulty: 3, q: 'Carlos Caszely, "el rey del metro cuadrado", jugó principalmente en…', options: ["Colo-Colo", "U. de Chile", "U. Católica", "Palestino"], answer: 0, fact: 'Ídolo colocolino de los 70, campeón y goleador histórico.' },
  { id: 120, category: "fútbol", difficulty: 2, q: "El estadio del Colo-Colo se llama…", options: ["Monumental David Arellano", "Nacional", "Santa Laura", "San Carlos de Apoquindo"], answer: 0, fact: 'El Monumental está en Macul, en Santiago.' },
  { id: 121, category: "fútbol", difficulty: 3, q: "El estadio de la Universidad Católica se llama…", options: ["San Carlos de Apoquindo", "Monumental", "Santa Laura", "El Teniente"], answer: 0, fact: 'San Carlos de Apoquindo está en Las Condes, en la precordillera.' },
  { id: 122, category: "fútbol", difficulty: 2, q: "Marcelo Bielsa dirigió a la selección chilena entre…", options: ["2007 y 2011", "2010 y 2014", "2015 y 2018", "2003 y 2006"], answer: 0, fact: '"El Loco" instaló un estilo de presión alta que marcó a una generación.' },
  { id: 123, category: "fútbol", difficulty: 3, q: 'El defensor Gary Medel es apodado…', options: ["Pitbull", "Rey", "León", "Bulldog"], answer: 0, fact: 'Su carácter combativo le valió el apodo Pitbull desde niño.' },
  { id: 124, category: "fútbol", difficulty: 2, q: "Iván Zamorano fue apodado…", options: ["Bam Bam", "Matador", "Niño Maravilla", "Chino"], answer: 0, fact: 'El apodo se hizo mundial durante sus años en Real Madrid e Inter.' },
  { id: 125, category: "fútbol", difficulty: 3, q: "Colo-Colo lleva el nombre de un…", options: ["Cacique mapuche", "Ave del sur", "Río chileno", "Volcán"], answer: 0, fact: 'Colo-Colo fue toqui mapuche del siglo XVI; el club se fundó en 1925.' },
  { id: 126, category: "fútbol", difficulty: 1, q: "Los tres grandes del fútbol chileno son Colo-Colo, U. Católica y…", options: ["Universidad de Chile", "Cobreloa", "Everton", "Palestino"], answer: 0, fact: 'Los tres concentran la mayoría de los títulos del profesionalismo.' },
  { id: 127, category: "fútbol", difficulty: 3, q: "El clásico universitario enfrenta a U. de Chile con…", options: ["U. Católica", "Colo-Colo", "Everton", "U. Española"], answer: 0, fact: 'La U vs UC es uno de los clásicos más antiguos del país.' },
  { id: 128, category: "fútbol", difficulty: 2, q: "El Sifup es la asociación que agrupa a…", options: ["Los futbolistas profesionales", "Los árbitros", "Los técnicos", "Los hinchas"], answer: 0, fact: 'El Sindicato de Futbolistas Profesionales existe desde 1949.' },

  // ---- Comida ----
  { id: 129, category: "comida", difficulty: 1, q: "La chorrillana lleva papas fritas, cebolla, huevo y…", options: ["Carne", "Palta", "Queso solamente", "Mariscos"], answer: 0, fact: 'Nació en Valparaíso y suele compartirse en fuentes de soda.' },
  { id: 130, category: "comida", difficulty: 1, q: "La empanada chilena más clásica es de…", options: ["Pino", "Queso", "Champiñón", "Mariscos"], answer: 0, fact: 'El "pino" es carne, cebolla, huevo, aceituna y una pasa.' },
  { id: 131, category: "comida", difficulty: 2, q: "La cazuela chilena es un plato de…", options: ["Sopa con carne y verduras", "Postre horneado", "Ensalada de mariscos", "Guiso de mariscos"], answer: 0, fact: 'Combina carne o pollo con papas, choclo, zapallo y arroz.' },
  { id: 132, category: "comida", difficulty: 2, q: "Las humitas chilenas se hacen con…", options: ["Choclo molido y albahaca", "Harina de trigo", "Papa rallada", "Arroz y leche"], answer: 0, fact: 'Envueltas en hojas del propio choclo, se hierven o se hornean.' },
  { id: 133, category: "comida", difficulty: 3, q: "Las prietas son…", options: ["Un tipo de morcilla", "Un pan negro", "Un dulce", "Un pescado"], answer: 0, fact: 'Embutido a base de sangre de cerdo, típico de asados y curantos.' },
  { id: 134, category: "comida", difficulty: 2, q: "El manjar chileno equivale a…", options: ["Dulce de leche", "Miel de palma", "Almíbar de higos", "Crema pastelera"], answer: 0, fact: 'Base de mil postres chilenos, del alfajor a la torta de mil hojas.' },
  { id: 135, category: "comida", difficulty: 3, q: "El kuchen es una herencia culinaria de…", options: ["Colonos alemanes en el sur", "Piratas ingleses", "Migrantes croatas", "Misioneros italianos"], answer: 0, fact: 'Los colonos alemanes de mediados del siglo XIX trajeron esta tradición.' },
  { id: 136, category: "comida", difficulty: 2, q: "El congrio, protagonista de la 'Oda' de Neruda, es un…", options: ["Pescado", "Marisco", "Alga", "Ave marina"], answer: 0, fact: 'Neruda le dedicó la célebre "Oda al Caldillo de Congrio".' },
  { id: 137, category: "comida", difficulty: 3, q: "Los 'locos' que se comen en Chile son…", options: ["Un molusco marino", "Un tipo de pan", "Un dulce", "Una carne roja"], answer: 0, fact: "El loco (Concholepas concholepas) es un molusco muy apreciado en la mesa." },
  { id: 138, category: "comida", difficulty: 2, q: "La bebida gaseosa color amarillo típica de Chile es…", options: ["Bilz y Pap", "Inca Kola", "Guaraná", "Manzana Postobón"], answer: 0, fact: 'La combinación Bilz + Pap acompaña completos hace décadas.' },
  { id: 139, category: "comida", difficulty: 1, q: 'El "asado" en Chile suele hacerse con…', options: ["Carne a la parrilla al fuego de leña o carbón", "Carne al horno", "Carne guisada", "Solamente pollo"], answer: 0, fact: 'El asado con "choripán" y ensalada a la chilena es un ritual social.' },
  { id: 140, category: "comida", difficulty: 3, q: "La 'ensalada a la chilena' clásica lleva…", options: ["Tomate y cebolla en pluma", "Lechuga y palta", "Zanahoria rallada", "Papas y huevo"], answer: 0, fact: 'Se aliña con aceite, sal y algo de cilantro; imprescindible en los asados.' },
  { id: 141, category: "comida", difficulty: 2, q: 'Un "choripán" es…', options: ["Un pan con chorizo asado", "Un pan con palta", "Una empanada frita", "Un sándwich de pollo"], answer: 0, fact: 'Popular en asados y estadios; también se come con pebre.' },
  { id: 142, category: "comida", difficulty: 3, q: "El pan típico de Chile más consumido a diario es…", options: ["La marraqueta", "La ciabatta", "La baguette", "El pan pita"], answer: 0, fact: 'La marraqueta (o "pan francés" al sur) es el pan más comido del país.' },
  { id: 143, category: "comida", difficulty: 2, q: "El vino chileno más famoso proviene del valle de…", options: ["Colchagua", "Copiapó", "Huasco", "Aconcagua solamente"], answer: 0, fact: 'Colchagua es uno de los grandes valles vitivinícolas, junto al Maipo y Casablanca.' },

  // ---- Geografía ----
  { id: 144, category: "geografía", difficulty: 1, q: "Valparaíso fue declarada Patrimonio de la Humanidad por sus…", options: ["Cerros y casco histórico", "Playas", "Museos", "Estadios"], answer: 0, fact: 'La Unesco distinguió el casco histórico y su ascensor cultura en 2003.' },
  { id: 202, category: "geografía", difficulty: 3, q: "La antigua ciudad minera del salitre declarada Patrimonio de la Humanidad es…", options: ["Humberstone", "Sewell", "Chuquicamata", "Chañaral"], answer: 0, fact: 'Humberstone y Santa Laura (Tarapacá) son Patrimonio desde 2005.' },
  { id: 145, category: "geografía", difficulty: 2, q: "La ciudad minera enclavada en la cordillera, Patrimonio de la Humanidad, se llama…", options: ["Sewell", "Lota", "Chuquicamata", "El Salvador"], answer: 0, fact: 'Sewell, la "ciudad de las escaleras", está en la mina El Teniente.' },
  { id: 146, category: "geografía", difficulty: 2, q: "El valle famoso por sus cielos y por ser cuna de Gabriela Mistral es el de…", options: ["Elqui", "Cachapoal", "Choapa", "Aconcagua"], answer: 0, fact: 'El Valle del Elqui está en Coquimbo; hoy es meca de la astronomía y el pisco.' },
  { id: 147, category: "geografía", difficulty: 1, q: "El principal puerto de Chile es…", options: ["San Antonio", "Coquimbo", "Iquique", "Antofagasta"], answer: 0, fact: 'San Antonio, en la región de Valparaíso, es el mayor puerto de contenedores del país.' },
  { id: 148, category: "geografía", difficulty: 2, q: "El principal lago del sur, cerca de Puerto Varas, es…", options: ["Llanquihue", "Todos los Santos", "Ranco", "Vichuquén"], answer: 0, fact: 'El Llanquihue es el segundo lago más grande de Chile continental.' },
  { id: 149, category: "geografía", difficulty: 3, q: "El volcán activo que domina el paisaje de Villarrica se llama…", options: ["Villarrica", "Osorno", "Quetrupillán", "Llaima"], answer: 0, fact: 'El Villarrica es uno de los volcanes más activos de Sudamérica.' },
  { id: 150, category: "geografía", difficulty: 2, q: "La capital de la Región de La Araucanía es…", options: ["Temuco", "Valdivia", "Osorno", "Chillán"], answer: 0, fact: 'Temuco es el mayor centro urbano del sur central del país.' },
  { id: 151, category: "geografía", difficulty: 2, q: "La ciudad conocida como 'la perla del norte' es…", options: ["Antofagasta", "Iquique", "Arica", "La Serena"], answer: 0, fact: 'Antofagasta debe su prosperidad histórica a la minería del cobre y del salitre.' },
  { id: 152, category: "geografía", difficulty: 3, q: "La Región del Ñuble, la más nueva de Chile, tiene por capital a…", options: ["Chillán", "Concepción", "Los Ángeles", "Talca"], answer: 0, fact: 'Chillán es la capital de Ñuble desde 2018.' },
  { id: 153, category: "geografía", difficulty: 2, q: "El cerro más famoso para mirar Santiago es el…", options: ["San Cristóbal", "Manquehue", "La Campana", "Roble"], answer: 0, fact: 'Coronado por la Virgen del Cerro San Cristóbal, es parte del Parque Metropolitano.' },
  { id: 154, category: "geografía", difficulty: 3, q: 'El paso "Los Libertadores" conecta Chile con…', options: ["Argentina", "Bolivia", "Perú", "Paraguay"], answer: 0, fact: 'Es el paso terrestre más usado hacia Mendoza, por la ruta 60 CH.' },
  { id: 155, category: "geografía", difficulty: 2, q: 'Puerto Williams, la ciudad más austral del mundo, está en la isla…', options: ["Navarino", "Grande de Tierra del Fuego", "Wellington", "Chiloé"], answer: 0, fact: 'Puerto Williams tiene menos de 3.000 habitantes al sur del Beagle.' },
  { id: 156, category: "geografía", difficulty: 3, q: "El río Loa nace en la región de…", options: ["Antofagasta", "Atacama", "Tarapacá", "Arica y Parinacota"], answer: 0, fact: 'El Loa nace en el volcán Miño y atraviesa el desierto de Atacama.' },
  { id: 157, category: "geografía", difficulty: 1, q: "Chile limita al este con…", options: ["Argentina", "Bolivia", "Perú", "Brasil"], answer: 0, fact: 'La cordillera de los Andes forma la frontera este con Argentina.' },
  { id: 158, category: "geografía", difficulty: 2, q: "El desierto florido se produce en…", options: ["Atacama", "Patagonia", "Andes centrales", "Aysén"], answer: 0, fact: 'En años de lluvia, el desierto de Atacama florece con miles de especies.' },

  // ---- Historia ----
  { id: 159, category: "historia", difficulty: 3, q: "El nombre verdadero de Gabriela Mistral era…", options: ["Lucila Godoy Alcayaga", "Marcela Serrano", "Isabel Riquelme", "Elvira López"], answer: 0, fact: "Adoptó su seudónimo por Gabriele D'Annunzio y Frédéric Mistral." },
  { id: 160, category: "historia", difficulty: 2, q: "El primer libro que publicó Pablo Neruda fue…", options: ['"Crepusculario"', '"Canto General"', '"Residencia en la tierra"', '"España en el corazón"'], answer: 0, fact: '"Crepusculario" apareció en 1923, cuando Neruda tenía 19 años.' },
  { id: 161, category: "historia", difficulty: 3, q: "Chile anexó Isla de Pascua en…", options: ["1888", "1810", "1930", "1950"], answer: 0, fact: 'El capitán Policarpo Toro firmó el "Acuerdo de Voluntades" el 9 de septiembre de 1888.' },
  { id: 162, category: "historia", difficulty: 2, q: "La Batalla de Chacabuco (1817) fue una victoria decisiva liderada por…", options: ["San Martín y O'Higgins", "Carrera y Rodríguez", "O'Higgins y Prat", "Freire y Bulnes"], answer: 0, fact: 'Marcó el inicio de la Patria Nueva tras cruzar los Andes.' },
  { id: 163, category: "historia", difficulty: 3, q: "La Universidad de Chile fue fundada en 1842 gracias al impulso de…", options: ["Andrés Bello", "Diego Portales", "Manuel Rodríguez", "Manuel Bulnes"], answer: 0, fact: 'El venezolano Andrés Bello fue su primer rector y dio forma al derecho civil chileno.' },
  { id: 164, category: "historia", difficulty: 2, q: "El Instituto Nacional, colegio emblemático fundado en 1813, fue impulsado por…", options: ["Camilo Henríquez y Manuel de Salas", "O'Higgins", "Portales", "Prat"], answer: 0, fact: 'Formó a decenas de presidentes y figuras públicas chilenas.' },
  { id: 165, category: "historia", difficulty: 3, q: "El guerrillero patriota de la Independencia famoso por burlar a los españoles disfrazado fue…", options: ["Manuel Rodríguez", "Bernardo O'Higgins", "Ramón Freire", "José Miguel Carrera"], answer: 0, fact: 'Rodríguez organizó redes clandestinas durante la Reconquista.' },
  { id: 166, category: "historia", difficulty: 2, q: "Los tres hermanos Carrera protagonistas de la Patria Vieja fueron…", options: ["José Miguel, Juan José y Luis", "Bernardo, José y Juan", "Manuel, Ramón y Luis", "Diego, Fernando y Juan"], answer: 0, fact: 'Los Carrera dominaron el primer gobierno independiente entre 1811 y 1813.' },
  { id: 167, category: "historia", difficulty: 3, q: "El Combate Naval de Iquique de 1879 se libró durante la…", options: ["Guerra del Pacífico", "Guerra contra la Confederación", "Ocupación de la Araucanía", "Revolución de 1891"], answer: 0, fact: 'Arturo Prat murió al abordar el Huáscar peruano ese 21 de mayo.' },
  { id: 168, category: "historia", difficulty: 2, q: "La primera mujer en llegar al Senado chileno fue…", options: ["María de la Cruz", "Michelle Bachelet", "Julieta Kirkwood", "Elena Caffarena"], answer: 0, fact: 'María de la Cruz asumió como senadora por Santiago en 1953.' },
  { id: 169, category: "historia", difficulty: 3, q: "La 'Escuadra Libertadora' que zarpó de Valparaíso en 1820 tenía como destino…", options: ["Perú", "México", "Colombia", "Filipinas"], answer: 0, fact: 'Buscaba independizar al Virreinato del Perú al mando de Lord Cochrane.' },
  { id: 170, category: "historia", difficulty: 2, q: "Bernardo O'Higgins nació en la ciudad de…", options: ["Chillán", "Talca", "Concepción", "La Serena"], answer: 0, fact: "Nació en 1778, hijo del gobernador Ambrosio O'Higgins." },
  { id: 171, category: "historia", difficulty: 3, q: "El Fuerte Bulnes, en la Patagonia, fue fundado en 1843 para…", options: ["Reclamar el Estrecho de Magallanes", "Vigilar la frontera con Perú", "Guardar el salitre", "Recibir colonos alemanes"], answer: 0, fact: 'La expedición del capitán John Williams tomó posesión del Estrecho para Chile.' },
  { id: 172, category: "historia", difficulty: 2, q: "La ciudad fundada por colonos alemanes en 1853 en el sur es…", options: ["Puerto Montt", "Osorno", "Valdivia", "Puerto Varas"], answer: 0, fact: 'Puerto Montt (originalmente Melipulli) recibió a los colonos gestionados por Vicente Pérez Rosales.' },
  { id: 173, category: "historia", difficulty: 1, q: "El emblema nacional que muestra un cóndor y un huemul es…", options: ["El escudo", "La bandera", "La cueca", "El himno"], answer: 0, fact: 'El escudo nacional fue adoptado en 1834; luce el lema "Por la razón o la fuerza".' },

  // ---- Cultura pop ----
  { id: 174, category: "cultura", difficulty: 2, q: "El personaje de historieta chileno creado por René Ríos (Pepo) es…", options: ["Condorito", "Mampato", "Papelucho", "Ogú"], answer: 0, fact: 'Condorito, un cóndor humanizado, apareció por primera vez en 1949.' },
  { id: 175, category: "cultura", difficulty: 2, q: "El clásico personaje infantil creado por Marcela Paz es…", options: ["Papelucho", "Condorito", "Mampato", "Chuquete"], answer: 0, fact: 'Papelucho apareció en 1947 y protagoniza más de una docena de libros.' },
  { id: 176, category: "cultura", difficulty: 3, q: "El niño Mampato viajaba en el tiempo acompañado por…", options: ["Ogú", "Petronila", "Chocolito", "Copito"], answer: 0, fact: 'Ogú, cavernícola de gran corazón, es su fiel amigo prehistórico.' },
  { id: 177, category: "cultura", difficulty: 3, q: "La telenovela 'Machos' (2003) fue transmitida por…", options: ["Canal 13", "TVN", "Chilevisión", "Mega"], answer: 0, fact: 'Un fenómeno televisivo que retrató a los hermanos Mercader.' },
  { id: 178, category: "cultura", difficulty: 2, q: "El actor Alfredo Castro es reconocido por su trabajo con el director…", options: ["Pablo Larraín", "Sebastián Lelio", "Andrés Wood", "Silvio Caiozzi"], answer: 0, fact: 'Ha protagonizado varias películas de Larraín ("Tony Manero", "Post Mortem", "El Club").' },
  { id: 179, category: "cultura", difficulty: 3, q: "El director de la película 'Machuca' (2004) es…", options: ["Andrés Wood", "Pablo Larraín", "Silvio Caiozzi", "Miguel Littín"], answer: 0, fact: '"Machuca" retrata la amistad de dos niños en el Santiago de 1973.' },
  { id: 180, category: "cultura", difficulty: 2, q: 'La animación "Historia de un Oso", ganadora del Oscar 2016, fue dirigida por…', options: ["Gabriel Osorio", "Andrés Wood", "Sebastián Lelio", "Nicolás López"], answer: 0, fact: 'Ganó el primer Oscar de la historia para el cine chileno.' },
  { id: 181, category: "cultura", difficulty: 2, q: "El escritor de 'La Casa de los Espíritus', nacida en Perú pero criada en Chile, es…", options: ["Isabel Allende", "José Donoso", "Pía Barros", "Marcela Serrano"], answer: 0, fact: 'Su novela debut (1982) es una de las más leídas de la literatura chilena.' },
  { id: 182, category: "cultura", difficulty: 3, q: "El fotógrafo chileno célebre por retratar la vida en la Patagonia es…", options: ["Sergio Larraín", "Paz Errázuriz", "Luis Weinstein", "Marcelo Montecino"], answer: 0, fact: 'Sergio Larraín integró la agencia Magnum y su obra es referente mundial.' },
  { id: 183, category: "cultura", difficulty: 2, q: 'Los Prisioneros marcaron a la generación de la…', options: ["Nueva Ola Chilena de los 80", "Nueva Canción Chilena de los 60", "Cumbia sound de los 70", "Punk de los 2000"], answer: 0, fact: 'Su rock crítico definió el pop chileno de la década de 1980.' },

  // ---- Cine y TV ----
  { id: 184, category: "tv", difficulty: 2, q: "'Sábados Gigantes' fue creado y presentado por…", options: ["Don Francisco", "Julio Videla", "Kiko Alvarez", "Antonio Vodanovic"], answer: 0, fact: 'Mario Kreutzberger condujo el programa desde 1962 hasta 2015.' },
  { id: 185, category: "tv", difficulty: 3, q: "El animador histórico del Festival de Viña conocido como 'el rostro' de Canal 13 fue…", options: ["Antonio Vodanovic", "Don Francisco", "Cristián Sánchez", "Sergio Riesenberg"], answer: 0, fact: 'Vodanovic condujo el festival por casi dos décadas.' },
  { id: 186, category: "tv", difficulty: 2, q: "El canal público de Chile es…", options: ["TVN", "Canal 13", "Mega", "Chilevisión"], answer: 0, fact: 'Televisión Nacional de Chile fue creada en 1969.' },
  { id: 187, category: "tv", difficulty: 3, q: "Canal 13 fue fundado por…", options: ["La Universidad Católica", "El Estado", "La Fuerza Aérea", "El grupo Edwards"], answer: 0, fact: 'Nació en 1959 como el primer canal de televisión del país.' },
  { id: 188, category: "tv", difficulty: 3, q: 'El talentoso musical juvenil "Rojo" se emitió por…', options: ["TVN", "Canal 13", "Mega", "Chilevisión"], answer: 0, fact: '"Rojo, fama contrafama" (2002-2007) lanzó a artistas como Mónica Rodríguez y Nicole Natalino.' },
  { id: 189, category: "tv", difficulty: 2, q: "El personaje 'Yerko Puchento' es interpretado por…", options: ["Daniel Alcaíno", "Álvaro Salas", "Bombo Fica", "Kramer"], answer: 0, fact: 'Alcaíno creó al provocador Puchento para el humor televisivo.' },
  { id: 190, category: "tv", difficulty: 3, q: "El humorista chileno conocido por sus imitaciones y su rutina en Viña es…", options: ["Stefan Kramer", "Bombo Fica", "Coco Legrand", "Álvaro Salas"], answer: 0, fact: 'Kramer imita a políticos y famosos con gran precisión.' },
  { id: 191, category: "tv", difficulty: 2, q: "La comedia de situación 'Los Venegas' fue emitida por…", options: ["TVN", "Canal 13", "Chilevisión", "Mega"], answer: 0, fact: 'Los Venegas se transmitió de 1988 a 2015 en TVN.' },
  { id: 192, category: "tv", difficulty: 3, q: "El animador Mario Kreutzberger nació en la ciudad de…", options: ["Talca", "Santiago", "Valparaíso", "Concepción"], answer: 0, fact: 'Nació en Talca en 1940, hijo de inmigrantes judeoalemanes.' },

  // ---- Ciencia ----
  { id: 193, category: "ciencia", difficulty: 2, q: "El observatorio de La Silla pertenece al…", options: ["ESO (Observatorio Europeo Austral)", "NASA", "JAXA", "Universidad de Chile solamente"], answer: 0, fact: 'La Silla, en Coquimbo, fue el primer observatorio de ESO en Chile (1969).' },
  { id: 203, category: "ciencia", difficulty: 3, q: "El observatorio con el 'Very Large Telescope' está en el cerro…", options: ["Paranal", "Tololo", "Armazones", "La Silla"], answer: 0, fact: 'Paranal, en Antofagasta, alberga cuatro telescopios de 8,2 m.' },
  { id: 194, category: "ciencia", difficulty: 2, q: "El camélido nativo chileno más pequeño y de fibra fina es…", options: ["La vicuña", "El guanaco", "La alpaca", "La llama"], answer: 0, fact: 'La vicuña vive sobre los 3.500 m en el Altiplano.' },
  { id: 195, category: "ciencia", difficulty: 2, q: "El zorro chileno más común en el país es el…", options: ["Culpeo", "Rojo", "Ártico", "De las llanuras"], answer: 0, fact: 'El zorro culpeo es el segundo cánido más grande de Sudamérica.' },
  { id: 196, category: "ciencia", difficulty: 3, q: "La rana de Darwin, endémica y en peligro, es especial porque…", options: ["El macho incuba a las crías en su boca", "Cambia de color según la temperatura", "Vive bajo tierra", "No tiene ojos"], answer: 0, fact: 'Charles Darwin la describió durante su viaje por Chiloé en 1834.' },
  { id: 197, category: "ciencia", difficulty: 2, q: "El terremoto de Chile de 2010 alcanzó una magnitud de…", options: ["8,8", "9,5", "7,0", "6,5"], answer: 0, fact: 'El terremoto y tsunami del 27F devastaron la zona centro-sur.' },
  { id: 198, category: "ciencia", difficulty: 3, q: "La astrónoma María Teresa Ruiz fue la primera mujer chilena en recibir…", options: ["El Premio Nacional de Ciencias Exactas", "El Nobel de Física", "El Copley", "El Nobel de Medicina"], answer: 0, fact: 'Lo recibió en 1997; también fue presidenta de la Academia Chilena de Ciencias.' },
  { id: 199, category: "ciencia", difficulty: 2, q: "El puma andino chileno es un pariente cercano de…", options: ["El león de montaña", "El leopardo", "El jaguar", "El tigre"], answer: 0, fact: 'Puma concolor tiene amplia distribución en las Américas.' },
  { id: 200, category: "ciencia", difficulty: 3, q: "El observatorio óptico infrarrojo europeo más grande, que se construye en el Cerro Armazones, se conoce como…", options: ["ELT (Extremely Large Telescope)", "VLT", "ALMA", "SOAR"], answer: 0, fact: 'El ELT contará con un espejo primario de 39 metros de diámetro.' },
  { id: 201, category: "ciencia", difficulty: 2, q: "La palma chilena, en peligro por la sobreexplotación de su savia, produce…", options: ["Miel de palma", "Aceite de girasol", "Ron", "Azúcar refinada"], answer: 0, fact: 'La miel de palma es un jarabe concentrado tradicional del valle central.' },
];

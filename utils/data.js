import bcrypt from "bcryptjs";

const data = {
  users: [
    {
      name: "Eden",
      email: "admin@marlin.com",
      password: bcrypt.hashSync("123456"),
      isAdmin: true,
    },
    {
      name: "Stef",
      email: "stef@hidalgo.com",
      password: bcrypt.hashSync("123456"),
      isAdmin: false,
    },
  ],
  products: [
    {
      name: "CEIQ Surgical Skin 1.0",
      slug: "surgical-skin-v1",
      category: "Skins",
      image: "/images/surgical-skin-1.jpg",
      price: 15.0,
      countInStock: 20,
      brand: "CEIQ",
      rating: 3.0,
      numReviews: 10,
      description:
        "Nuestra CEIQ Surgical Skin 1.0 10 x 15 cms consta de 3 capas que simulan la piel, tejido celular subcutáneo y capa muscular. Consta de un refuerzo de malla que le brinda fortaleza para el trabajo continuo y repetitivo. Óptimo para prácticas de sutura, nudos, fijación de drenajes, curación de heridas, colocación de trocares laparoscópicos, sutura intracorpórea, recubrimiento de fantomas, administración de anestésicos locales con jeringas y más.",
      code: "001",
    },
    {
      name: "CEIQ Surgical Skin 2.0",
      slug: "surgical-skin-v2",
      category: "Skins",
      image: "/images/surgical-skin-2.jpg",
      price: 20.0,
      countInStock: 230,
      brand: "CEIQ",
      rating: 5.0,
      numReviews: 30,
      description:
        "Nuestra NUEVA y renovada CEIQ Surgical Skin 2.0 10 x 15 cms además de contar con las 3 capas que simulan la piel, tejido celular subcutáneo y capa muscular más malla de refuerzo, tiene una mayor resistencia y flexibilidad que nuestra 1.0. Otra gran ventaja es el paso de las ondas ecosonográficas a través de la misma lo que le faculta para prácticas de destrezas vasculares eco dirigidas que las puedes imaginar y realizar.",
      code: "002",
    },
    {
      name: "Soporte para Piel Sintética",
      slug: "soporte-para-piel-sintetica",
      category: "Accesorios",
      image: "/images/soporte-piel-sintetica.jpg",
      price: 15.0,
      countInStock: 230,
      brand: "CEIQ",
      rating: 5.0,
      numReviews: 30,
      description:
        "Fijación y soporte a nuestra piel sintética para desarrollar un mejor trabajo en la mesa de destrezas. Constituye un accesorio importante para cada uno de nuestros simuladores de piel sintética docente “CEIQ Surgical Skin” 1.0 y 2.0.",
      code: "003",
    },
    {
      name: "CEIQ Surgical Skin 1.0 MINI",
      slug: "ceiq-surgical-skin-1-mini",
      category: "Skins",
      image: "/images/surgical-skin-1-mini.jpg",
      price: 5.0,
      countInStock: 130,
      brand: "CEIQ",
      rating: 4.8,
      numReviews: 25,
      description:
        "Nuestra CEIQ Surgical Skin 1.0 ahora se adapta a tus necesidades y espacio de trabajo con 10 x 5 cms de superficie, cuenta con tres capas que incluye piel, tejido celular subcutáneo y muscular; su ya conocida malla de refuerzo que brinda la fortaleza para todas tus prácticas quirúrgicas.",
      code: "004",
    },
    {
      name: "CEIQ  Simulador para inyección intramuscular",
      slug: "ceiq-simulador-para-inyeccion-intramuscular",
      category: "Skins",
      image: "/images/simulador-inyeccion-intramuscular.jpg",
      price: 20.0,
      brand: "CEIQ",
      countInStock: 200,
      rating: 4.5,
      numReviews: 13,
      description:
        "CEIQ te trae un excelente simulador para la aplicación de inyecciones intramusculares simuladas. Úsalo tantas veces quieras, por su alta durabilidad te permitirá múltiples prácticas con un solo simulador.",
      code: "005",
    },
    {
      name: "Simulador Diafragmático",
      slug: "simulador-diafragmatico",
      category: "Endo Training",
      image: "/images/simulador-diafragmatico.jpg",
      price: 15.0,
      countInStock: 45,
      brand: "CEIQ",
      rating: 4.6,
      numReviews: 20,
      description:
        "Simula la reparación de una Hernia Hiatal Laparoscópica y abierta. Desarrolla destrezas quirúrgicas especialmente laparoscópicas en endotrainers para la reparación de hernias diafragmáticas junto a tejido real preparado simulando el cierre de pilares mediante puntos separados o continuos además de realizar funduplicatura gástrica con este simulador híbrido.",
      code: "006",
    },
    {
      name: "Endrotrainer Laparoscópico tablet 1",
      slug: "endrotrainer-laparospo-tablet-1",
      category: "Endo Training",
      image: "/images/endrotrainer-laparospo-tablet-1.jpg",
      price: 100.0,
      countInStock: 45,
      brand: "CEIQ",
      rating: 4.6,
      numReviews: 20,
      description:
        "CEIQ te trae el mejor sistema de entrenamiento laparoscópico portátil para que desarrolles tus destrezas desde básicas como avanzadas. Colocas una tablet y usarás su pantalla y cámara incorporada donde podrás grabar tus ejercicios y evaluarlos posteriormente. No requiere aplicativos extras y funciona mejor con un iPad o mini iPad; si lo prefieres con un celular también.",
      code: "007",
    },
    {
      name: "Endrotrainer Laparoscópico tablet 2",
      slug: "endrotrainer-laparospo-tablet-2",
      category: "Endo Training",
      image: "/images/endrotrainer-laparospo-tablet-2.jpg",
      price: 150.0,
      countInStock: 45,
      brand: "CEIQ",
      rating: 4.6,
      numReviews: 20,
      description:
        "CEIQ te trae el mejor sistema de entrenamiento laparoscópico portátil para que desarrolles tus destrezas desde básicas como avanzadas. Colocas una tablet y usarás su pantalla y cámara incorporada donde podrás grabar tus ejercicios y evaluarlos posteriormente. No requiere aplicativos extras y funcionan mejor con un iPad o mini iPad; si lo prefieres con un celular también.",
      code: "008",
    },
  ],
};

export default data;

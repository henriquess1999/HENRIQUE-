// ============================================
// CellShop - Product Database
// All products with real Amazon data
// ============================================

// Nomes únicos para avaliações (não repetir)
const reviewerNames = [
    "João Silva", "Maria Santos", "Pedro Costa", "Ana Oliveira", "Carlos Souza",
    "Julia Lima", "Fernando Alves", "Beatriz Rocha", "Lucas Ferreira", "Camila Martins",
    "Rafael Gomes", "Larissa Pereira", "Bruno Dias", "Gabriela Ribeiro", "Thiago Carvalho",
    "Amanda Freitas", "Daniel Castro", "Isabela Correia", "Felipe Barbosa", "Patricia Mendes",
    "John Smith", "Emma Johnson", "Michael Brown", "Sarah Davis", "David Wilson",
    "Emily Martinez", "James Anderson", "Olivia Taylor", "Robert Thomas", "Sophia Moore",
    "Marco Rossi", "Luigi Bianchi", "Francesco Ferrari", "Antonio Russo", "Giuseppe Marino",
    "Claude Bernard", "Monique Dubois", "Pierre Laurent", "Sophie Martin", "Jean Dupont",
    "Alejandro García", "María López", "Carlos Rodríguez", "Ana Martínez", "Jose Hernández",
    "Miguel Sánchez", "Rosa González", "Juan Pérez", "Lucia Flores", "Diego Moreno",
    "Kenji Tanaka", "Yuki Yamamoto", "Hiroshi Nakamura", "Sakura Suzuki", "Takeshi Ito"
];

// Comentários positivos traduzidos (PT/EN/ES)
const reviewComments = {
    pt: [
        "Produto excelente! Recomendo muito.",
        "Superou minhas expectativas. Muito satisfeito!",
        "Qualidade premium, entrega rápida.",
        "Vale cada centavo. Produto de primeira qualidade.",
        "Estou muito feliz com a compra!",
        "Recomendo para todos que buscam qualidade.",
        "Perfeito! Chegou antes do prazo.",
        "Melhor que imaginava. Muito bom!",
        "Produto de excelente qualidade.",
        "Totalmente satisfeito com a compra!",
        "Acabei de receber e amei!",
        "Muito bom custo-benefício.",
        "Excelente atendimento e produto.",
        "Recomendo demais!",
        "Estou muito impressionado com a qualidade.",
        "Funciona perfeitamente!",
        "Chegou rápido e bem embalado.",
        "Produto durável e confiável.",
        "Vale a pena investir nisto.",
        "Muito feliz com o resultado.",
        "Excelente custo-benefício.",
        "Totalmente recomendado!",
        "Produto de primeira ordem.",
        "Estou encantado com a qualidade.",
        "Entrega impecável, produto ótimo."
    ],
    en: [
        "Excellent product! I highly recommend it.",
        "Exceeded my expectations. Very satisfied!",
        "Premium quality, fast delivery.",
        "Worth every penny. Top quality product.",
        "Very happy with my purchase!",
        "I recommend it to everyone looking for quality.",
        "Perfect! Arrived before the deadline.",
        "Better than I imagined. Very good!",
        "Excellent quality product.",
        "Completely satisfied with the purchase!",
        "Just received it and I love it!",
        "Great value for money.",
        "Excellent service and product.",
        "Highly recommend!",
        "Very impressed with the quality.",
        "Works perfectly!",
        "Arrived quickly and well packaged.",
        "Durable and reliable product.",
        "Worth investing in.",
        "Very happy with the result.",
        "Excellent value for money.",
        "Totally recommended!",
        "Top quality product.",
        "I'm delighted with the quality.",
        "Flawless delivery, excellent product."
    ],
    es: [
        "¡Producto excelente! Lo recomiendo mucho.",
        "Superó mis expectativas. ¡Muy satisfecho!",
        "Calidad premium, entrega rápida.",
        "Vale cada peso. Producto de primera calidad.",
        "¡Muy feliz con mi compra!",
        "Lo recomiendo a todos los que buscan calidad.",
        "¡Perfecto! Llegó antes de lo previsto.",
        "Mejor de lo que imaginaba. ¡Muy bueno!",
        "Producto de excelente calidad.",
        "¡Completamente satisfecho con la compra!",
        "¡Acabo de recibirlo y me encanta!",
        "Muy buena relación calidad-precio.",
        "Excelente servicio y producto.",
        "¡Muy recomendado!",
        "Muy impresionado con la calidad.",
        "¡Funciona perfectamente!",
        "Llegó rápido y bien embalado.",
        "Producto duradero y confiable.",
        "Vale la pena invertir en esto.",
        "Muy feliz con el resultado.",
        "Excelente relación calidad-precio.",
        "¡Totalmente recomendado!",
        "Producto de primera orden.",
        "Estoy encantado con la calidad.",
        "Entrega impecable, producto excelente."
    ]
};

// Función para obtener comentario en idioma correto
function getRandomComment(lang = 'pt') {
    const comments = reviewComments[lang] || reviewComments.pt;
    return comments[Math.floor(Math.random() * comments.length)];
}

// Función para gerar avaliaciónes
function generateReviews(count = 4, lang = 'pt') {
    const reviews = [];
    const availableNames = [...reviewerNames].sort(() => Math.random() - 0.5); // Embaralhar nomes
    for (let i = 0; i < Math.min(count, availableNames.length); i++) {
        reviews.push({
            name: availableNames[i],
            rating: Math.floor(Math.random() * 2) + 4, // 4 ou 5 estrelas
            comment: getRandomComment(lang)
        });
    }
    return reviews;
}

const products = [
    {
        id: 111,
        name: "Placas vibratórias",
        category: "construcao",
        price: 3599.00,
        image: "https://anmax.com.br/wp-content/uploads/2024/09/Anmax_Placa_Vibratoria_C80T_Frente45.png",
        images: [
            "https://anmax.com.br/wp-content/uploads/2024/09/Anmax_Placa_Vibratoria_C80T_Frente45-300x300.png"
        ],
        description: "Placa vibratória C80T, ideal para compactação de solo em obras, calçadas e fundações. Robusta, eficiente e fácil de operar.",
        rating: 4.9,
        reviews: 18,
        badge: "Lançamento",
        tableImage: "https://anmax.com.br/wp-content/uploads/2024/09/x6.png"
    },
    // Novo produto principal: Furadeira e Parafusadeira à Bateria (CR)
    {
        id: 312,
        name: "Furadeira e Parafusadeira à Bateria 12 V Máx Lithium-Ion QFC1012.25N",
        category: "brasilcr",
        price: 0.00,
        // Imagens restauradas conforme solicitado
        image: "https://brasilcr.com.br/wp-content/uploads/QFC1012.25N.jpg",
        images: [
            "https://brasilcr.com.br/wp-content/uploads/QFC1012.25N.jpg",
            "https://brasilcr.com.br/wp-content/uploads/CAIXA-MAQUINA-JUNTOS-6.jpg"
        ],
        description: "Furadeira e Parafusadeira à Bateria 12V Max Lithium-Ion QFC1012.25N - conjunto profissional.",
        rating: 4.6,
        reviews: 0,
        badge: "Novo"
    },
    // Variantes para o produto 312
    {
        id: 313,
        name: "Furadeira e Parafusadeira à Bateria 12 V Máx Lithium-Ion BFC1012.30N",
        category: "brasilcr",
        price: 0.00,
        image: "https://brasilcr.com.br/wp-content/uploads/CAIXA-MAQUINA-JUNTOS-6.jpg",
        images: ["https://brasilcr.com.br/wp-content/uploads/CAIXA-MAQUINA-JUNTOS-6.jpg"],
        description: "Opção BFC1012.30N - Furadeira e Parafusadeira 12V.",
        rating: 4.4,
        reviews: 0,
        badge: "Novo"
    },
    {
        id: 314,
        name: "Parafusadeira / Furadeira de Impacto a Bateria 12V Bivolt BIC1012.30N",
        category: "brasilcr",
        price: 0.00,
        image: "https://brasilcr.com.br/wp-content/uploads/CAIXA-MAQUINA-JUNTOS-6.jpg",
        images: ["https://brasilcr.com.br/wp-content/uploads/CAIXA-MAQUINA-JUNTOS-6.jpg"],
        description: "Opção BIC1012.30N - Parafusadeira / Furadeira de Impacto 12V Bivolt.",
        rating: 4.5,
        reviews: 0,
        badge: "Novo"
    },
    {
        id: 315,
        name: "Parafusadeira / Furadeira de Impacto a Bateria 12V Bivolt QIC1012.30N",
        category: "brasilcr",
        price: 0.00,
        image: "https://brasilcr.com.br/wp-content/uploads/CAIXA-MAQUINA-JUNTOS-6-300x300.jpg",
        images: ["https://brasilcr.com.br/wp-content/uploads/CAIXA-MAQUINA-JUNTOS-6-300x300.jpg"],
        description: "Opção QIC1012.30N - Parafusadeira / Furadeira 12V Bivolt.",
        rating: 4.5,
        reviews: 0,
        badge: "Novo"
    },
                        {
                            id: 101,
                            name: "Alisadora de Concreto",
                            category: "construcao",
                            price: 4999.90,
                            image: "https://anmax.com.br/wp-content/uploads/2024/09/6.3-1.png",
                            images: [
                                "https://anmax.com.br/wp-content/uploads/2024/09/6.3-1-600x568.png"
                            ],
                            description: "Alisadora de concreto profissional para acabamento perfeito em pisos. Ideal para grandes áreas, fácil operação e alta durabilidade.",
                            rating: 4.8,
                            reviews: 87,
                            badge: "Destaque"
                        },
                        {
                            id: 102,
                            name: "Cortadoras de piso",
                            category: "construcao",
                            price: 799.00,
                            image: "https://img.lojadomecanico.com.br/256/46/448/301747/1655755875006.JPG",
                            images: [
                                "https://img.lojadomecanico.com.br/256/46/448/301747/1655755875006.JPG"
                            ],
                            description: "Cortadora de piso industrial para cortes precisos em concreto e asfalto. Robusta, potente e fácil de manusear.",
                            rating: 4.7,
                            reviews: 54,
                            badge: "Novo"
                        },
                        {
                            id: 103,
                            name: "Bomba Submersível de mangote",
                            category: "construcao",
                            price: 3999.00,
                            image: "https://anmax.com.br/wp-content/uploads/2024/09/rrrrrrrrrre.jpg",
                            images: [
                                "https://anmax.com.br/wp-content/uploads/2024/09/rrrrrrrrrre-300x300.jpg"
                            ],
                            description: "Bomba submersível de mangote para drenagem eficiente em obras e fundações. Alta performance e robustez.",
                            rating: 4.9,
                            reviews: 39,
                            badge: "Oferta"
                        },
                        // Segunda linha (4 produtos)
                        {
                            id: 107,
                            name: "Perfurador de Solo",
                            category: "construcao",
                            price: 2499.00,
                            image: "https://anmax.com.br/wp-content/uploads/2024/09/hhhh.jpg",
                            images: [
                                "https://anmax.com.br/wp-content/uploads/2024/09/hhhh.jpg"
                            ],
                            description: "Perfurador de solo profissional, ideal para agricultura, construção civil e instalação de postes. Potente, robusto e fácil de operar.",
                            rating: 4.8,
                            reviews: 28,
                            badge: "Especial",
                            tableImage: "https://anmax.com.br/wp-content/uploads/2024/09/ffft.png"
                        },
                        {
                            id: 110,
                            name: "Roçadeira Gasolina CG52",
                            category: "construcao",
                            price: 1299.00,
                            image: "https://anmax.com.br/wp-content/uploads/2024/09/ccvvv-300x300.jpg",
                            images: [
                                "https://anmax.com.br/wp-content/uploads/2024/09/ccvvv-300x300.jpg"
                            ],
                            description: "Roçadeira a gasolina CG52, ideal para corte de grama e vegetação densa em áreas rurais e urbanas. Potente, resistente e fácil de operar.",
                            rating: 4.6,
                            reviews: 21,
                            badge: "Lançamento",
                            tableImage: "https://anmax.com.br/wp-content/uploads/2024/09/x56.png"
                        },
    // ...outros produtos...
    // Adicione os dois produtos ao final do array para aparecerem na aba 2
    {
        id: 104,
        name: "Motor a diesel",
        category: "construcao",
        price: 3999.00,
        image: "https://img.lojadomecanico.com.br/256/46/448/301741/1655753660793.JPG",
        images: [
            "https://img.lojadomecanico.com.br/256/46/448/301741/1655753660793.JPG"
        ],
        description: "Motor a diesel de alta performance para uso em equipamentos de construção civil. Robusto, econômico e confiável.",
        rating: 4.9,
        reviews: 39,
        badge: "Oferta"
    },
    // ...outros produtos...
    // Adicione os dois produtos ao final do array para aparecerem na aba 2
    {
        id: 109,
        name: "Motosserra Gasolina CS5800",
        category: "construcao",
        price: 1899.00,
        image: "https://anmax.com.br/wp-content/uploads/2024/09/fffff-300x300.jpg",
        images: [
            "https://anmax.com.br/wp-content/uploads/2024/09/fffff-300x300.jpg"
        ],
        description: "Motosserra a gasolina CS5800, robusta, potente e ideal para corte de madeira em obras e fazendas. Fácil de operar e manutenção simples.",
        rating: 4.7,
        reviews: 32,
        badge: "Lançamento",
        tableImage: "https://anmax.com.br/wp-content/uploads/2024/09/vvvvv-1.png"
    },
    // Produto solicitado: GERADORES DIESEL
    {
        id: 200,
        name: "GERADORES DIESEL",
        category: "construcao",
        price: 0.00,
        image: "https://anmax.com.br/wp-content/uploads/2024/09/x1-1-300x300.jpg",
        images: [
            "https://anmax.com.br/wp-content/uploads/2024/09/x1-1-300x300.jpg"
        ],
        description: "Geradores a diesel de alta eficiência para aplicações industriais e residenciais. Robustez e baixo consumo para energia confiável.",
        rating: 4.8,
        reviews: 5,
        badge: "Novo",
        tableImage: "https://anmax.com.br/wp-content/uploads/2024/09/ff4444.png"
    },
    // Produto novo da BrasilCR (Novos Produtos)
    {
        id: 201,
        name: "Martelo Rompedor SDS PLUS Industrial 4Joules 28mm 920W com Maleta MRC28.920-4J",
        category: "brasilcr",
        price: 0.00,
        image: "https://brasilcr.com.br/wp-content/uploads/DSC_0370-600x600.jpg",
        images: [
            "https://brasilcr.com.br/wp-content/uploads/DSC_0370-600x600.jpg"
        ],
        description: "Martelo rompedor SDS PLUS industrial 4Joules 28mm 920W. Acompanha maleta modelo MRC28.920-4J.",
        rating: 4.7,
        reviews: 3,
        badge: "Novo",
        tableImage: "https://brasilcr.com.br/wp-content/uploads/DSC_0370-600x600.jpg"
    },
    {
        id: 202,
        name: "Martelete ROMPEDOR SDS PLUS INDUSTRIAL 5JOULES 28mm 1100W com Maleta MRC28.1100-5J",
        category: "brasilcr",
        price: 0.00,
        image: "https://brasilcr.com.br/wp-content/uploads/DSC_0370-600x600.jpg",
        images: ["https://brasilcr.com.br/wp-content/uploads/DSC_0370-600x600.jpg"],
        description: "Martelete rompedor SDS PLUS industrial 5Joules 28mm 1100W com maleta.",
        rating: 4.6,
        reviews: 2,
        badge: "Novo"
    },
    {
        id: 203,
        name: "Martelete ROMPEDOR SDS PLUS INDUSTRIAL 6JOULES 30mm 1200W com Maleta MRC30.1200-6J",
        category: "brasilcr",
        price: 0.00,
        image: "https://brasilcr.com.br/wp-content/uploads/DSC_0370-600x600.jpg",
        images: ["https://brasilcr.com.br/wp-content/uploads/DSC_0370-600x600.jpg"],
        description: "Martelete rompedor SDS PLUS industrial 6Joules 30mm 1200W com maleta.",
        rating: 4.6,
        reviews: 2,
        badge: "Novo"
    },
    {
        id: 204,
        name: "Martelete Rompedor SDS MAX INDUSTRIAL 13JOULES 40mm 1600W com Maleta MRC40.1600-13J",
        category: "brasilcr",
        price: 0.00,
        image: "https://brasilcr.com.br/wp-content/uploads/DSC_0370-600x600.jpg",
        images: ["https://brasilcr.com.br/wp-content/uploads/DSC_0370-600x600.jpg"],
        description: "Martelete rompedor SDS MAX industrial 13Joules 40mm 1600W com maleta.",
        rating: 4.5,
        reviews: 1,
        badge: "Novo"
    },
    {
        id: 205,
        name: "Martelo Demolidor Industrial Encaixe 17mm Sextavado 1100W MDC17.1100-10J",
        category: "brasilcr",
        price: 0.00,
        image: "https://brasilcr.com.br/wp-content/uploads/DSC_0370-600x600.jpg",
        images: ["https://brasilcr.com.br/wp-content/uploads/DSC_0370-600x600.jpg"],
        description: "Martelo demolidor industrial encaixe 17mm sextavado 1100W.",
        rating: 4.4,
        reviews: 0,
        badge: "Novo"
    },
    {
        id: 206,
        name: "Martelo Demolidor Industrial SDS MAX 19JOULES 1600W com Maleta MDC18.1600-19J",
        category: "brasilcr",
        price: 0.00,
        image: "https://brasilcr.com.br/wp-content/uploads/DSC_0370-600x600.jpg",
        images: ["https://brasilcr.com.br/wp-content/uploads/DSC_0370-600x600.jpg"],
        description: "Martelo demolidor industrial SDS MAX 19Joules 1600W com maleta.",
        rating: 4.6,
        reviews: 0,
        badge: "Novo"
    },
    // Produto Lixadeira Roto Orbital Industrial (BrasilCR)
    {
        id: 301,
        name: "Lixadeira Roto Orbital Industrial 5 Pol. 300W – CR DO BRASIL-LRC125300",
        category: "brasilcr",
        price: 0.00,
        image: "https://brasilcr.com.br/wp-content/uploads/PRINCIPAL-51-300x300.jpg",
        images: [
            "https://brasilcr.com.br/wp-content/uploads/PRINCIPAL-51-300x300.jpg",
            "https://brasilcr.com.br/wp-content/uploads/6-VELOCIDADES-6.jpg",
            "https://brasilcr.com.br/wp-content/uploads/BASE-2.jpg",
            "https://brasilcr.com.br/wp-content/uploads/MAQUINA-CAIXA-JUNTOS-3.jpg"
        ],
        description: "Lixadeira roto orbital industrial 5 polegadas, 300W, modelo LRC125300 - CR DO BRASIL.",
        rating: 4.7,
        reviews: 2,
        badge: "Novo",
        tableImage: "https://brasilcr.com.br/wp-content/uploads/PRINCIPAL-51-300x300.jpg"
    },
    {
        id: 317,
        name: "SERRA MARMORE 1680 WATTS SMC110.1680",
        category: "brasilcr",
        price: 0.00,
        image: "https://brasilcr.com.br/wp-content/uploads/%E4%BE%A7%E9%9D%A2-1-300x300.jpg",
        images: [
            "https://brasilcr.com.br/wp-content/uploads/%E4%BE%A7%E9%9D%A2-1-300x300.jpg",
            "https://brasilcr.com.br/wp-content/uploads/MAQUINA-CAIXA-JUNTOS-2-300x300.jpg"
        ],
        description: "Serra mármore 1680W modelo SMC110.1680 — alta performance para cortes em pedra e mármore.",
        rating: 4.6,
        reviews: 0,
        badge: "Novo",
        // Não exibir seletor de variantes para este produto
        disableVariants: true
    },
    {
        id: 318,
        name: "Tupia Manual 6mm 1/4 pol. 550W TLC06.550",
        category: "brasilcr",
        price: 0.00,
        image: "https://brasilcr.com.br/wp-content/uploads/PRINCIPAL-30-300x300.jpg",
        images: [
            "https://brasilcr.com.br/wp-content/uploads/PRINCIPAL-30-300x300.jpg",
            "https://brasilcr.com.br/wp-content/uploads/CAIXA-MAQUINA-JUNTOS-3-300x300.jpg"
        ],
        description: "Tupia manual 6mm (1/4\") 550W — ideal para trabalhos de acabamento em madeira.",
        rating: 4.5,
        reviews: 0,
        badge: "Novo",
        // Não exibir seletor de variantes para este produto
        disableVariants: true
    },
    {
        id: 319,
        name: "Serra Tico Tico 750W STC90.750",
        category: "brasilcr",
        price: 0.00,
        image: "https://brasilcr.com.br/wp-content/uploads/STC90.750-300x300.jpg",
        images: [
            "https://brasilcr.com.br/wp-content/uploads/STC90.750-300x300.jpg",
            "https://brasilcr.com.br/wp-content/uploads/lado-3-1-300x300.jpg"
        ],
        description: "Serra tico-tico 750W modelo STC90.750 — cortes precisos em madeira e metal.",
        rating: 4.5,
        reviews: 0,
        badge: "Novo",
        // Não exibir seletor de variantes para este produto
        disableVariants: true
    },
    {
        id: 320,
        name: "Máquina De Solda Inversora Mini Com Display Digital MSC225MINI",
        category: "brasilcr",
        price: 0.00,
        image: "https://brasilcr.com.br/wp-content/uploads/PRINCIPAL-29-600x600.jpg",
        images: [
            "https://brasilcr.com.br/wp-content/uploads/PRINCIPAL-29-600x600.jpg",
            "https://brasilcr.com.br/wp-content/uploads/ATRAS-8-600x600.jpg",
            "https://brasilcr.com.br/wp-content/uploads/CAIXA-MAQUINA-JUNTOS-2-600x600.jpg"
        ],
        description: "Máquina de solda inversora mini com display digital - MSC225MINI (opções disponíveis).",
        rating: 4.6,
        reviews: 0,
        badge: "Novo"
    },
    {
        id: 321,
        name: "Máquina De Solda Inversora Mini 127V Com Display Digital MSC200MINI",
        category: "brasilcr",
        price: 0.00,
        image: "https://brasilcr.com.br/wp-content/uploads/PRINCIPAL-29-600x600.jpg",
        images: [
            "https://brasilcr.com.br/wp-content/uploads/PRINCIPAL-29-600x600.jpg",
            "https://brasilcr.com.br/wp-content/uploads/ATRAS-8-600x600.jpg"
        ],
        description: "Máquina de solda inversora mini 127V com display digital - MSC200MINI.",
        rating: 4.5,
        reviews: 0,
        badge: "Novo"
    },
    {
        id: 322,
        name: "Máquina De Solda Inversora Mini Com Display Digital BIVOLT MSC225BV",
        category: "brasilcr",
        price: 0.00,
        image: "https://brasilcr.com.br/wp-content/uploads/PRINCIPAL-29-600x600.jpg",
        images: [
            "https://brasilcr.com.br/wp-content/uploads/PRINCIPAL-29-600x600.jpg",
            "https://brasilcr.com.br/wp-content/uploads/CAIXA-MAQUINA-JUNTOS-2-600x600.jpg"
        ],
        description: "Máquina de solda inversora mini com display digital BIVOLT - MSC225BV.",
        rating: 4.6,
        reviews: 0,
        badge: "Novo"
    },
    // Produto Esmerilhadeira (BrasilCR) solicitado pelo usuário
    {
        id: 302,
        name: "ESMERILHADEIRA 115MM (4-1/2\") EAC115.900",
        category: "brasilcr",
        price: 0.00,
        image: "https://brasilcr.com.br/wp-content/uploads/3-300x300.jpg",
        images: [
            "https://brasilcr.com.br/wp-content/uploads/3-300x300.jpg",
            "https://brasilcr.com.br/wp-content/uploads/JUNTOS-29-300x300.jpg"
        ],
        description: "Esmerilhadeira 115mm (4-1/2\") modelo EAC115.900 - ferramenta industrial de alta performance.",
        rating: 4.5,
        reviews: 0,
        badge: "Novo",
        tableImage: "https://brasilcr.com.br/wp-content/uploads/3-300x300.jpg"
    },
    // Variantes específicas da Esmerilhadeira (opções no modal)
    {
        id: 303,
        name: "Esmerilhadeira Angular de 7 Pol. 2600W EAC180.2600",
        category: "brasilcr",
        price: 0.00,
        image: "https://brasilcr.com.br/wp-content/uploads/3-300x300.jpg",
        images: [
            "https://brasilcr.com.br/wp-content/uploads/3-300x300.jpg",
            "https://brasilcr.com.br/wp-content/uploads/JUNTOS-29-300x300.jpg"
        ],
        description: "Esmerilhadeira angular 7'' 2600W - modelo EAC180.2600.",
        rating: 4.5,
        reviews: 0,
        badge: "Novo"
    },
    {
        id: 304,
        name: "Esmerilhadeira Angular de 9 Pol. 2600W EAC230.2600",
        category: "brasilcr",
        price: 0.00,
        image: "https://brasilcr.com.br/wp-content/uploads/3-300x300.jpg",
        images: [
            "https://brasilcr.com.br/wp-content/uploads/3-300x300.jpg",
            "https://brasilcr.com.br/wp-content/uploads/JUNTOS-29-300x300.jpg"
        ],
        description: "Esmerilhadeira angular 9'' 2600W - modelo EAC230.2600.",
        rating: 4.5,
        reviews: 0,
        badge: "Novo"
    },
    {
        id: 305,
        name: "Esmerilhadeira Angular 4.1/2'' 1050W EAC115.1050",
        category: "brasilcr",
        price: 0.00,
        image: "https://brasilcr.com.br/wp-content/uploads/3-300x300.jpg",
        images: [
            "https://brasilcr.com.br/wp-content/uploads/3-300x300.jpg",
            "https://brasilcr.com.br/wp-content/uploads/JUNTOS-29-300x300.jpg"
        ],
        description: "Esmerilhadeira angular 4.1/2'' 1050W - modelo EAC115.1050.",
        rating: 4.5,
        reviews: 0,
        badge: "Novo"
    },
    // Opções da Lixadeira (variantes mostradas no seletor do produto 301)
    {
        id: 307,
        name: "Lixadeira Vertical 125 Mm (5 ) 440 Watts LVC125.440",
        category: "brasilcr",
        price: 0.00,
        image: "https://brasilcr.com.br/wp-content/uploads/PRINCIPAL-51-300x300.jpg",
        images: [
            "https://brasilcr.com.br/wp-content/uploads/PRINCIPAL-51-300x300.jpg"
        ],
        description: "Lixadeira vertical 125mm (5\") 440W - modelo LVC125.440.",
        rating: 4.5,
        reviews: 0,
        badge: "Novo"
    },
    {
        id: 308,
        name: "Lixadeira/ Politriz Angular de 7Pol. 1400W LHC180.1400",
        category: "brasilcr",
        price: 0.00,
        image: "https://brasilcr.com.br/wp-content/uploads/PRINCIPAL-51-300x300.jpg",
        images: [
            "https://brasilcr.com.br/wp-content/uploads/PRINCIPAL-51-300x300.jpg"
        ],
        description: "Lixadeira/Politriz angular 7'' 1400W - modelo LHC180.1400.",
        rating: 4.5,
        reviews: 0,
        badge: "Novo"
    },
    // Novo produto: Furadeira de Impacto - principal da CR para aparecer na 2ª página/aba
    {
        id: 309,
        name: "Furadeira de Impacto Velocidade Variável e Reversível 1/2 Pol. 850W FIC13.850",
        category: "brasilcr",
        price: 0.00,
        image: "https://brasilcr.com.br/wp-content/uploads/PRINCIPAL-41-300x300.jpg",
        images: [
            "https://brasilcr.com.br/wp-content/uploads/PRINCIPAL-41-300x300.jpg",
            "https://brasilcr.com.br/wp-content/uploads/JUNTOS-26-300x300.jpg"
        ],
        description: "Furadeira de impacto 1/2\" Velocidade variável e reversível, 850W. Modelo FIC13.850.",
        rating: 4.6,
        reviews: 0,
        badge: "Novo",
        // Forçar este produto para a 2ª página da aba BrasilCR
        crPage: 2
    },
    // Variante exclusiva mostrada apenas no seletor deste produto
    {
        id: 310,
        name: "Furadeira 3/8 Pol. 450W FSC10.450",
        category: "brasilcr",
        price: 0.00,
        image: "https://brasilcr.com.br/wp-content/uploads/PRINCIPAL-41-300x300.jpg",
        images: [
            "https://brasilcr.com.br/wp-content/uploads/PRINCIPAL-41-300x300.jpg"
        ],
        description: "Furadeira 3/8'' 450W - modelo FSC10.450 (opção do produto FIC13.850).",
        rating: 4.4,
        reviews: 0,
        badge: "Novo"
    },
    // Novo produto sem opção de escolha solicitado (aparecerá ao lado da Esmerilhadeira)
    {
        id: 311,
        name: "Combo de Parafusadeira de Impacto e Furadeira 12V Máx. Li-ion Bivolt com Maleta 12.30100-2",
        category: "brasilcr",
        price: 0.00,
        image: "https://brasilcr.com.br/wp-content/uploads/12.30100-2-4-4-300x300.jpg",
        images: [
            "https://brasilcr.com.br/wp-content/uploads/12.30100-2-4-4-300x300.jpg",
            "https://brasilcr.com.br/wp-content/uploads/JUNTOS-2-MAQUINAS-300x300.jpg",
            "https://brasilcr.com.br/wp-content/uploads/2-rotacoes-3-300x300.jpg"
        ],
        description: "Combo: Parafusadeira de impacto e furadeira 12V, Li-ion, bivolt, acompanha maleta - modelo 12.30100-2.",
        rating: 4.5,
        reviews: 0,
        badge: "Novo",
        // Não exibir seletor de variantes para este produto
        disableVariants: true
    },
    {
        id: 316,
        name: "PARAFUSADEIRA A BATERIA IMPACTO 20V QIC1020.35N",
        category: "brasilcr",
        price: 0.00,
        image: "https://brasilcr.com.br/wp-content/uploads/PRINCIPAL-2-7-300x300.jpg",
        images: [
            "https://brasilcr.com.br/wp-content/uploads/PRINCIPAL-2-7-300x300.jpg",
            "https://brasilcr.com.br/wp-content/uploads/CAIXA-MAQUINA-JUNTOS-4-300x300.jpg"
        ],
        description: "Parafusadeira a bateria 20V modelo QIC1020.35N. Compacta e potente.",
        rating: 4.5,
        reviews: 0,
        badge: "Novo",
        // Não exibir seletor de variantes para este SKU
        disableVariants: true
    },
    // Produto Martelo Demolidor principal solicitado
    {
        id: 306,
        name: "MARTELO DEMOLIDOR 28MM SEXTAVADO 48 JOULES 1600W MDC28.1600-48J",
        category: "brasilcr",
        price: 0.00,
        image: "https://brasilcr.com.br/wp-content/uploads/LADO-13-300x300.jpg",
        images: [
            "https://brasilcr.com.br/wp-content/uploads/LADO-13-300x300.jpg",
            "https://brasilcr.com.br/wp-content/uploads/CAIXA-MAQUINA-JUNTOS-8-300x300.jpg"
        ],
        description: "Martelo demolidor 28mm sextavado 48 joules 1600W - modelo MDC28.1600-48J.",
        rating: 4.6,
        reviews: 0,
        badge: "Novo",
        tableImage: "https://brasilcr.com.br/wp-content/uploads/LADO-13-300x300.jpg"
    },
    {
        id: 107,
        name: "Perfurador de Solo",
        category: "construcao",
        price: 2499.00,
        image: "https://anmax.com.br/wp-content/uploads/2024/09/hhhh.jpg",
        images: [
            "https://anmax.com.br/wp-content/uploads/2024/09/hhhh.jpg"
        ],
        description: "Perfurador de solo profissional, ideal para agricultura, construção civil e instalação de postes. Potente, robusto e fácil de operar.",
        rating: 4.8,
        reviews: 28,
        badge: "Especial",
        tableImage: "https://anmax.com.br/wp-content/uploads/2024/09/ffft.png"
    },
    // Produto UP: Paleteira Elétrica 1,5ton Lítio UP-CBD15
    {
        id: 401,
        name: "Paleteira Elétrica 1,5ton Lítio UP-CBD15",
        category: "up",
        price: 0.00,
        // imagem principal fornecida pelo usuário
        image: "https://www.upequipamentos.com.br/wp-content/uploads/2025/07/UP-Equipamentos-Linha-Eletrica-Transpaleteira-Eletrica-15-TON-Litio.webp",
        images: [
            "https://www.upequipamentos.com.br/wp-content/uploads/2025/07/UP-Equipamentos-Linha-Eletrica-Transpaleteira-Eletrica-15-TON-Litio.webp"
        ],
        specs: "<ul style='margin:0.6rem 0 0 1rem;line-height:1.45;color:#222;list-style:disc;padding-left:1rem;'>\n<li><strong>Capacidade de Carga:</strong> 1,5 ton</li>\n<li><strong>Acionamento:</strong> Elétrico</li>\n<li><strong>Operação:</strong> Pedestre</li>\n<li><strong>Rodas:</strong> PU</li>\n<li><strong>Altura máxima de subida dos garfos:</strong> 110mm</li>\n<li><strong>Freio:</strong> Eletromagnétio</li>\n<li><strong>Bateria:</strong> 24/20 V/AH</li>\n<li><strong>Peso Total:</strong> 145 kg</li>\n</ul>",
        // Link EMBED do vídeo do YouTube (inicia em 2s)
        video: "https://www.youtube.com/embed/RqqUSewfX6o?start=2",
        description: "Paleteira elétrica 1,5 ton com bateria de lítio — solução compacta para movimentação de paletes em armazéns e centros de distribuição. Operação elétrica, baixo ruído e manutenção reduzida. Consulte acessórios e autonomia da bateria.",
        rating: 4.6,
        reviews: 0,
        badge: "Novo",
        // Não exibir seletor de variantes para este produto
        disableVariants: true
    },
    // Novo produto UP: Empilhadeira Elétrica 1,5ton 3m UP-CDD15R-E
    {
        id: 402,
        name: "Empilhadeira Elétrica 1,5ton 3m UP-CDD15R-E",
        category: "up",
        price: 0.00,
        image: "https://www.equipacenter.com.br/media/catalog/product/cache/7c77f8fc44ed84362f498f3d56f9ad95/e/m/empilhadeira-eletrica-patolada-1500kg_1.jpg",
        images: [
            "https://www.equipacenter.com.br/media/catalog/product/cache/7c77f8fc44ed84362f498f3d56f9ad95/e/m/empilhadeira-eletrica-patolada-1500kg_1.jpg"
        ],
        // vídeo embed do YouTube (link fornecido)
        video: "https://www.youtube.com/embed/4ZOEut8P7tQ",
        description: "Empilhadeira Patolada Elétrica 1,5ton 3 metros\nEmpilhadeira Patolada Elétrica 1,5 ton (1500kg) e elevação de 3 metros, dê um UP na sua Intralogistica!",
        specs: "<ul style='margin:0.6rem 0 0 1rem;line-height:1.45;color:#222;list-style:disc;padding-left:1rem;'>\n<li><strong>Capacidade de Carga:</strong> 1,5 ton</li>\n<li><strong>Acionamento:</strong> Elétrico</li>\n<li><strong>Operação:</strong> Pedestre</li>\n<li><strong>Rodas:</strong> PU</li>\n<li><strong>Altura máxima de subida dos garfos:</strong> 3000mm</li>\n<li><strong>Freio:</strong> Eletromagnético</li>\n<li><strong>Bateria:</strong> 24/120 V/AH</li>\n<li><strong>Raio de giro:</strong> 1365mm</li>\n<li><strong>Comprimento total:</strong> 1748mm</li>\n<li><strong>Largura total:</strong> 800mm</li>\n<li><strong>Altura da torre totalmente abaixada:</strong> 2090mm</li>\n<li><strong>Peso Total:</strong> 503 kg</li>\n</ul>",
        rating: 4.6,
        reviews: 0,
        badge: "Novo",
        disableVariants: true
    },
    // Novo produto UP: Empilhadeira Elétrica Embarcada 1,5ton – 5,6m UP-CDDK 15 – III
    {
        id: 403,
        name: "Empilhadeira Elétrica Embarcada 1,5ton – 5,6 metros UP-CDDK 15 – III",
        category: "up",
        price: 0.00,
        image: "https://tse3.mm.bing.net/th/id/OIP.OPgvqLGneUYPp80PCKYrswHaHa?pid=Api&P=0&h=180",
        images: [
            "https://tse3.mm.bing.net/th/id/OIP.OPgvqLGneUYPp80PCKYrswHaHa?pid=Api&P=0&h=180"
        ],
        // vídeo mp4 fornecido pelo usuário
        video: "https://www.upequipamentos.com.br/wp-content/uploads/2025/04/WhatsApp-Video-2025-04-29-at-11.26.32.mp4?_=1",
        description: "Principais características:\n\nEmpilhadeira Elétrica Embarcada 1,5ton – 5,6 metros\n\nCom design compacto e rodas de poliuretano, oferece excelente manobrabilidade e é perfeita para corredores estreitos e ambientes com limitação de altura. Seu sistema elétrico completo proporciona operação silenciosa e livre de emissões, sendo uma solução sustentável para o seu negócio.",
        specs: "<ul style='margin:0.6rem 0 0 1rem;line-height:1.45;color:#222;list-style:disc;padding-left:1rem;'>\n<li><strong>Capacidade de carga:</strong> 1.500 kg</li>\n<li><strong>Altura de elevação:</strong> até 5,6 metros</li>\n<li><strong>Elevação livre dos garfos:</strong> 1,90 m</li>\n<li><strong>Tipo de operação:</strong> Operador embarcado em pé</li>\n<li><strong>Fonte de energia:</strong> Elétrica (bateria 24V/150Ah)</li>\n<li><strong>Velocidade de movimentação:</strong> 6,5 km/h (com carga)</li>\n<li><strong>Raio de giro:</strong> 1.655 mm</li>\n<li><strong>Dimensões dos garfos:</strong> 695 mm x 1.150 mm</li>\n<li><strong>Controlador:</strong> CURTIS F2A</li>\n<li><strong>Tempo de recarga:</strong> 6 a 8 horas</li>\n<li><strong>Duração da bateria:</strong> 4 a 6 horas (direta/fulltime)</li>\n</ul>",
        rating: 4.6,
        reviews: 0,
        badge: "Novo",
        disableVariants: true
    },
    // Novo produto UP: Empilhadeira Elétrica Embarcada 2,0ton UP-CQD20-D-12M
    {
        id: 404,
        name: "Empilhadeira Elétrica Embarcada 2,0ton – UP-CQD20-D-12M",
        category: "up",
        price: 0.00,
        image: "https://www.htmaquinasbrasil.com.br/wp-content/uploads/2024/06/Electric_Reach_Truck_1.6-2_Tonne_CQD16-20.jpg",
        images: [
            "https://www.htmaquinasbrasil.com.br/wp-content/uploads/2024/06/Electric_Reach_Truck_1.6-2_Tonne_CQD16-20.jpg"
        ],
        description: "A UP-CQD20-D-12M é uma empilhadeira elétrica embarcada, com capacidade nominal de 2000 kg e centro de carga de 600 mm, ideal para operações em armazéns e centros logísticos de alta demanda. Equipada com sistema de direção elétrica e assento almofadado, oferece conforto e precisão durante o uso.",
        specs: "<ul style='margin:0.6rem 0 0 1rem;line-height:1.45;color:#222;list-style:disc;padding-left:1rem;'>\n<li><strong>Capacidade nominal:</strong> 2.000 kg</li>\n<li><strong>Centro de carga:</strong> 600 mm</li>\n<li><strong>Elevação máxima:</strong> até 12.500 mm</li>\n<li><strong>Velocidade de condução:</strong> 11 km/h</li>\n<li><strong>Níveis de velocidade:</strong> 4 níveis selecionáveis</li>\n<li><strong>Freio:</strong> Eletromagnético</li>\n<li><strong>Bateria:</strong> Lítio 48 V / 400 Ah com carregador 150A</li>\n<li><strong>Peso total:</strong> 4.750 kg</li>\n<li><strong>Raio de giro:</strong> 1.783 mm</li>\n<li><strong>Capacidade de rampa:</strong> até 12%</li>\n<li><strong>Motor de tração:</strong> 6,5 kW</li>\n<li><strong>Motor de elevação:</strong> 8,2 kW (AC)</li>\n</ul>",
        rating: 4.6,
        reviews: 0,
        badge: "Novo",
        disableVariants: true
    },
    // Novo produto UP: Empilhadeira Retrátil 2,5TON 12,5M UP-CQD25-D-12,5M
    {
        id: 405,
        name: "Empilhadeira Retrátil 2,5TON 12,5M UP-CQD25-D-12,5M",
        category: "up",
        price: 0.00,
        image: "https://www.htmaquinasbrasil.com.br/wp-content/uploads/2024/06/Electric_Reach_Truck_1.6-2_Tonne_CQD16-20.jpg",
        images: [
            "https://www.htmaquinasbrasil.com.br/wp-content/uploads/2024/06/Electric_Reach_Truck_1.6-2_Tonne_CQD16-20.jpg"
        ],
        description: "SOB ENCOMENDA\n\nA UP-CQD25-D-12,5M é uma empilhadeira retrátil elétrica embarcada, desenvolvida para operações intensivas e de grande capacidade. Com capacidade nominal de 2500 kg e centro de carga de 600 mm, oferece alto desempenho em elevação, movimentação e empilhamento de cargas pesadas em espaços industriais e logísticos.\n\nEquipada com sistema de direção elétrica e assento almofadado, garante conforto e precisão ao operador. Seu mastro permite elevação máxima de até 12.500 mm, e o sistema de inclinação de 3° para frente e 4° para trás assegura estabilidade durante o manuseio da carga.\n\nCom peso total de 5830 kg, raio de giro de 1920 mm e largura total de 2100 mm, combina robustez com boa manobrabilidade. A empilhadeira alcança velocidade de deslocamento de até 11 km/h e possui freio eletromagnético, garantindo segurança e controle em rampas de até 12% de inclinação.\n\nSeu conjunto motriz inclui um motor de tração de 15 kW e motor de elevação de 17 kW, ambos elétricos de alto rendimento. A bateria de 80 V / até 775 Ah, com carregador de 200A, proporciona longa autonomia e recarga eficiente, ideal para turnos prolongados.\n\nA UP-CQD25-D-12,5M é a solução ideal para quem busca força, estabilidade e eficiência energética em empilhadeiras retráteis de grande porte.\n\nSOB ENCOMENDA",
        specs: "<ul style='margin:0.6rem 0 0 1rem;line-height:1.45;color:#222;list-style:disc;padding-left:1rem;'>\n<li><strong>Capacidade nominal:</strong> 2.500 kg</li>\n<li><strong>Centro de carga:</strong> 600 mm</li>\n<li><strong>Elevação máxima:</strong> até 12.500 mm</li>\n<li><strong>Inclinação do mastro:</strong> 3° frente / 4° trás</li>\n<li><strong>Velocidade de deslocamento:</strong> até 11 km/h</li>\n<li><strong>Freio:</strong> Eletromagnético</li>\n<li><strong>Bateria:</strong> 80 V / até 775 Ah com carregador 200A</li>\n<li><strong>Peso total:</strong> 5.830 kg</li>\n<li><strong>Raio de giro:</strong> 1.920 mm</li>\n<li><strong>Largura total:</strong> 2.100 mm</li>\n<li><strong>Capacidade de rampa:</strong> até 12%</li>\n<li><strong>Motor de tração:</strong> 15 kW</li>\n<li><strong>Motor de elevação:</strong> 17 kW (AC)</li>\n</ul>",
        rating: 4.6,
        reviews: 0,
        badge: "SOB ENCOMENDA",
        disableVariants: true
    },
    // Novo produto UP: Paleteira Hidráulica 3,0 TON
    {
        id: 406,
        name: "Paleteira Hidráulica 3,0 TON XPL-3062",
        category: "up",
        price: 0.00,
        image: "https://images.tcdn.com.br/img/img_prod/673916/paleteira_hidraulica_3000kg_x_685mm_longa_xtrong_xpl_3062_779763_1_ecd72734b9ab6aa19ac6815b0e22bf06.jpg",
        images: [
            "https://images.tcdn.com.br/img/img_prod/673916/paleteira_hidraulica_3000kg_x_685mm_longa_xtrong_xpl_3062_779763_1_ecd72734b9ab6aa19ac6815b0e22bf06.jpg"
        ],
        description: "Tipo de rodado: Duplo\nCapacidade de carga: 3 toneladas\nElevação máxima: 200 mm\nLargura de cada garfo: 150 mm\nComprimento do garfo: 1150 mm\nMaterial da roda: Nylon\nDimensões da roda de direção: 180 mm x 50 mm\nDimensões da roda do garfo: 70 mm x 60 mm\nMaterial da estrutura: Aço carbono reforçado\nAltura do garfo: 53,0 mm\nAltura total: 1186 mm\nAltura mínima: 85 mm\nAltura do solo até a base: 32 mm\nComprimento total: 1520 mm\nLargura total: 685 mm\nRaio de giro: 1265 mm\nPeso: 67,7kg",
        specs: "<ul style='margin:0.6rem 0 0 1rem;line-height:1.45;color:#222;list-style:disc;padding-left:1rem;'>\n<li><strong>Tipo de rodado:</strong> Duplo</li>\n<li><strong>Capacidade de carga:</strong> 3.000 kg</li>\n<li><strong>Elevação máxima:</strong> 200 mm</li>\n<li><strong>Largura de cada garfo:</strong> 150 mm</li>\n<li><strong>Comprimento do garfo:</strong> 1.150 mm</li>\n<li><strong>Material da roda:</strong> Nylon</li>\n<li><strong>Dimensões roda de direção:</strong> 180 x 50 mm</li>\n<li><strong>Dimensões roda do garfo:</strong> 70 x 60 mm</li>\n<li><strong>Material da estrutura:</strong> Aço carbono reforçado</li>\n<li><strong>Altura do garfo:</strong> 53,0 mm</li>\n<li><strong>Altura total:</strong> 1.186 mm</li>\n<li><strong>Altura mínima:</strong> 85 mm</li>\n<li><strong>Altura do solo até a base:</strong> 32 mm</li>\n<li><strong>Comprimento total:</strong> 1.520 mm</li>\n<li><strong>Largura total:</strong> 685 mm</li>\n<li><strong>Raio de giro:</strong> 1.265 mm</li>\n<li><strong>Peso:</strong> 67,7 kg</li>\n</ul>",
        rating: 4.5,
        reviews: 0,
        badge: "Novo",
        disableVariants: false,
        options: [410,411,412,413,414,415,416,417]
    },
    // Produto UP: Plataforma Elevatória ELEVUS 8
    {
        id: 407,
        name: "ELEVUS 8 – PLATAFORMA ELEVATÓRIA – UP-GTWY8-100",
        category: "up",
        price: 0.00,
        image: "https://eme54.ru/upload/iblock/065/fed8oue9kzxz530vorwk9ae0glss2a8k/75dcd0f3-1aa5-11eb-b334-3cfdfea44ee4_e98f754b-7c08-11eb-b362-3cfdfea44ee4.jpg",
        images: [
            "https://eme54.ru/upload/iblock/065/fed8oue9kzxz530vorwk9ae0glss2a8k/75dcd0f3-1aa5-11eb-b334-3cfdfea44ee4_e98f754b-7c08-11eb-b362-3cfdfea44ee4.jpg",
            "https://tse4.mm.bing.net/th/id/OIP.t7y65HLI9-t0dkfuAH9-OAHaHa?pid=Api&P=0&h=180"
        ],
        description: "Código: UP-GTWY8-100\nAltura máxima da plataforma: 8000 mm (8 metros)\nAltura máxima de trabalho da plataforma: 9700 mm (9,7 metros)\nCapacidade de carga: 125 kg\nTamanho da plataforma: 640×580 mm (64×58 cm)\nVoltagem: AC220/60HZ\nClassificação do motor: 0.75 V/kw\nPeso: 290 kg\nComprimento/Largura/Altura: 1280x800x1980mm",
        specs: "<ul style='margin:0.6rem 0 0 1rem;line-height:1.45;color:#222;list-style:disc;padding-left:1rem;'>\n<li><strong>Código:</strong> UP-GTWY8-100</li>\n<li><strong>Altura máxima da plataforma:</strong> 8000 mm</li>\n<li><strong>Altura máxima de trabalho:</strong> 9700 mm</li>\n<li><strong>Capacidade de carga:</strong> 125 kg</li>\n<li><strong>Tamanho da plataforma:</strong> 640×580 mm</li>\n<li><strong>Voltagem:</strong> AC220/60HZ</li>\n<li><strong>Motor:</strong> 0.75 V/kw</li>\n<li><strong>Peso:</strong> 290 kg</li>\n<li><strong>Dimensões:</strong> 1280x800x1980 mm</li>\n</ul>",
        rating: 4.5,
        reviews: 0,
        badge: "Novo",
        disableVariants: true
    },
    // Novo produto: Andaime Tubular (ao lado do ELEVUS 8)
    {
        id: 408,
        name: "Andaime Tubular 1M X 1,5M",
        category: "up",
        price: 0.00,
        image: "https://tse1.mm.bing.net/th/id/OIP.wfE8XaBYJDcMUOsDOCEtKAHaHa?pid=Api&P=0&h=180",
        images: [
            "https://tse1.mm.bing.net/th/id/OIP.wfE8XaBYJDcMUOsDOCEtKAHaHa?pid=Api&P=0&h=180"
        ],
        description: "Andaime Tubular\nOs andaimes, estrutura montada, de maneira provisória, para sustentar os trabalhadores na execução de serviços – são muito utilizados na construção civil para a execução de serviços no alto, como pintura, colocação de gessos e outros tipos de acabamento.\n\nÉ por meio do andaime que os operários conseguem trabalhar em toda a extensão da obra, garantindo maior eficiência no canteiro de obras.\n\nEletrosoldado por processos MIG, o que proporciona menos distorção nas peças e mais velocidade durante a soldagem;\n\nAcabamento superior de altíssima resistência, possibilitando maior vida útil para o equipamento.",
        specs: "<ul style='margin:0.6rem 0 0 1rem;line-height:1.45;color:#222;list-style:disc;padding-left:1rem;'>\n<li><strong>Tipo:</strong> Andaime Tubular</li>\n<li><strong>Processo de soldagem:</strong> Eletrosoldado (MIG)</li>\n<li><strong>Acabamento:</strong> Alta resistência</li>\n<li><strong>Aplicação:</strong> Pintura, gesso, acabamentos em obras</li>\n<li><strong>Observações:</strong> Estrutura provisória para trabalho em altura</li>\n</ul>",
        rating: 4.4,
        reviews: 0,
        badge: "Novo",
        disableVariants: true
    },
    // Novo produto: Piso Galvanizado para Andaime 037×1,5m – UP152.3
    {
        id: 409,
        name: "Piso Galvanizado para Andaime 037×1,5m – UP152.3",
        category: "up",
        price: 0.00,
        image: "https://tse2.mm.bing.net/th/id/OIP.jC76BKgtQxH4lBL3wdjxAwHaHa?pid=Api&P=0&h=180",
        images: [
            "https://tse2.mm.bing.net/th/id/OIP.jC76BKgtQxH4lBL3wdjxAwHaHa?pid=Api&P=0&h=180"
        ],
        description: "Piso galvanizado para andaime 037×1,5m galvanizado com trava de segurança e dois reforços na parte inferior para garantir mais facilidade no manuseio.\n\nComprimento total com as abas: 1,58m\nComprimento da prancha: 1,48m\nLargura: 37cm\nAltura: 4cm\nEspessura: 1,5m",
        specs: "<ul style='margin:0.6rem 0 0 1rem;line-height:1.45;color:#222;list-style:disc;padding-left:1rem;'>\n<li><strong>Modelo:</strong> UP152.3</li>\n<li><strong>Comprimento total com abas:</strong> 1,58 m</li>\n<li><strong>Comprimento da prancha:</strong> 1,48 m</li>\n<li><strong>Largura:</strong> 37 cm</li>\n<li><strong>Altura:</strong> 4 cm</li>\n<li><strong>Espessura:</strong> 1,5 mm</li>\n<li><strong>Acabamento:</strong> Galvanizado com trava de segurança e reforços inferiores</li>\n</ul>",
        rating: 4.4,
        reviews: 0,
        badge: "Novo",
        disableVariants: true
    },
    // Novo produto: CONJUNTO GUARDA CORPO 1,5M COM PORTA UP153.1
    {
        id: 418,
        name: "CONJUNTO GUARDA CORPO 1,5M COM PORTA UP153.1",
        category: "up",
        price: 0.00,
        image: "https://www.newmaqlocadora.com.br/wp-content/uploads/2023/09/guarda_corpo.jpg",
        images: [
            "https://www.newmaqlocadora.com.br/wp-content/uploads/2023/09/guarda_corpo.jpg"
        ],
        description: "Painel Guarda Corpo de 1,5m com porta para andaime.",
        specs: "<ul style='margin:0.6rem 0 0 1rem;line-height:1.45;color:#222;list-style:disc;padding-left:1rem;'>\n<li><strong>Modelo:</strong> UP153.1</li>\n<li><strong>Comprimento:</strong> 1,5 m</li>\n<li><strong>Uso:</strong> Guarda-corpo de andaime com porta</li>\n<li><strong>Acabamento:</strong> Tratamento anticorrosivo (quando aplicável)</li>\n</ul>",
        rating: 4.5,
        reviews: 0,
        badge: "Novo",
        disableVariants: true
    },
    // Opções/variantes vendáveis para a paleteira (referenciadas pelo produto 406)
    {
        id: 410,
        name: "Paleteira Hidraulica Manual 3ton UP 3000",
        category: "up",
        price: 0.00,
        image: "https://images.tcdn.com.br/img/img_prod/673916/paleteira_hidraulica_3000kg_x_685mm_longa_xtrong_xpl_3062_779763_1_ecd72734b9ab6aa19ac6815b0e22bf06.jpg",
        images: ["https://images.tcdn.com.br/img/img_prod/673916/paleteira_hidraulica_3000kg_x_685mm_longa_xtrong_xpl_3062_779763_1_ecd72734b9ab6aa19ac6815b0e22bf06.jpg"],
        description: "Paleteira Hidraulica Manual 3ton UP 3000 - versão manual padrão.",
        rating: 4.4,
        reviews: 0,
        disableVariants: true
    },
    {
        id: 411,
        name: "Paleteira Hidraulica Manual 3ton UP 3000+",
        category: "up",
        price: 0.00,
        image: "https://images.tcdn.com.br/img/img_prod/673916/paleteira_hidraulica_3000kg_x_685mm_longa_xtrong_xpl_3062_779763_1_ecd72734b9ab6aa19ac6815b0e22bf06.jpg",
        images: ["https://images.tcdn.com.br/img/img_prod/673916/paleteira_hidraulica_3000kg_x_685mm_longa_xtrong_xpl_3062_779763_1_ecd72734b9ab6aa19ac6815b0e22bf06.jpg"],
        description: "Paleteira Hidraulica Manual 3ton UP 3000+ - versão com reforço.",
        rating: 4.4,
        reviews: 0,
        disableVariants: true
    },
    {
        id: 412,
        name: "Paleteira Hidraulica Manual 3ton UP 3000-550",
        category: "up",
        price: 0.00,
        image: "https://images.tcdn.com.br/img/img_prod/673916/paleteira_hidraulica_3000kg_x_685mm_longa_xtrong_xpl_3062_779763_1_ecd72734b9ab6aa19ac6815b0e22bf06.jpg",
        images: ["https://images.tcdn.com.br/img/img_prod/673916/paleteira_hidraulica_3000kg_x_685mm_longa_xtrong_xpl_3062_779763_1_ecd72734b9ab6aa19ac6815b0e22bf06.jpg"],
        description: "Paleteira Hidraulica Manual 3ton UP 3000-550 - versão de curso longo.",
        rating: 4.4,
        reviews: 0,
        disableVariants: true
    },
    {
        id: 413,
        name: "Paleteira Hidráulica Manual 5ton UP5000",
        category: "up",
        price: 0.00,
        image: "https://images.tcdn.com.br/img/img_prod/673916/paleteira_hidraulica_3000kg_x_685mm_longa_xtrong_xpl_3062_779763_1_ecd72734b9ab6aa19ac6815b0e22bf06.jpg",
        images: ["https://images.tcdn.com.br/img/img_prod/673916/paleteira_hidraulica_3000kg_x_685mm_longa_xtrong_xpl_3062_779763_1_ecd72734b9ab6aa19ac6815b0e22bf06.jpg"],
        description: "Paleteira Hidráulica Manual 5ton UP5000 - versão de maior capacidade.",
        rating: 4.3,
        reviews: 0,
        disableVariants: true
    },
    {
        id: 414,
        name: "Empilhadeira Manual Gira Tambor",
        category: "up",
        price: 0.00,
        image: "https://images.tcdn.com.br/img/img_prod/673916/paleteira_hidraulica_3000kg_x_685mm_longa_xtrong_xpl_3062_779763_1_ecd72734b9ab6aa19ac6815b0e22bf06.jpg",
        images: ["https://images.tcdn.com.br/img/img_prod/673916/paleteira_hidraulica_3000kg_x_685mm_longa_xtrong_xpl_3062_779763_1_ecd72734b9ab6aa19ac6815b0e22bf06.jpg"],
        description: "Empilhadeira Manual Gira Tambor - equipamento para manuseio de tambores.",
        rating: 4.2,
        reviews: 0,
        disableVariants: true
    },
    {
        id: 415,
        name: "Empilhadeira Hidráulica Manual 1Ton UP1000",
        category: "up",
        price: 0.00,
        image: "https://images.tcdn.com.br/img/img_prod/673916/paleteira_hidraulica_3000kg_x_685mm_longa_xtrong_xpl_3062_779763_1_ecd72734b9ab6aa19ac6815b0e22bf06.jpg",
        images: ["https://images.tcdn.com.br/img/img_prod/673916/paleteira_hidraulica_3000kg_x_685mm_longa_xtrong_xpl_3062_779763_1_ecd72734b9ab6aa19ac6815b0e22bf06.jpg"],
        description: "Empilhadeira Hidráulica Manual 1Ton UP1000 - solução compacta.",
        rating: 4.3,
        reviews: 0,
        disableVariants: true
    },
    {
        id: 416,
        name: "Empilhadeira Hidráulica Manual 1,5Ton UP1500",
        category: "up",
        price: 0.00,
        image: "https://images.tcdn.com.br/img/img_prod/673916/paleteira_hidraulica_3000kg_x_685mm_longa_xtrong_xpl_3062_779763_1_ecd72734b9ab6aa19ac6815b0e22bf06.jpg",
        images: ["https://images.tcdn.com.br/img/img_prod/673916/paleteira_hidraulica_3000kg_x_685mm_longa_xtrong_xpl_3062_779763_1_ecd72734b9ab6aa19ac6815b0e22bf06.jpg"],
        description: "Empilhadeira Hidráulica Manual 1,5Ton UP1500 - capacidade intermediária.",
        rating: 4.3,
        reviews: 0,
        disableVariants: true
    },
    {
        id: 417,
        name: "Empilhadeira Hidráulica Manual 2Ton UP2000E",
        category: "up",
        price: 0.00,
        image: "https://images.tcdn.com.br/img/img_prod/673916/paleteira_hidraulica_3000kg_x_685mm_longa_xtrong_xpl_3062_779763_1_ecd72734b9ab6aa19ac6815b0e22bf06.jpg",
        images: ["https://images.tcdn.com.br/img/img_prod/673916/paleteira_hidraulica_3000kg_x_685mm_longa_xtrong_xpl_3062_779763_1_ecd72734b9ab6aa19ac6815b0e22bf06.jpg"],
        description: "Empilhadeira Hidráulica Manual 2Ton UP2000E - versão elétrica assistida.",
        rating: 4.3,
        reviews: 0,
        disableVariants: true
    },
    // --- Flach: Auxiliar de Partida (Novo produto + opções) ---
    {
        id: 430,
        name: "Auxiliar de Partida Flach APF-1000C",
        category: "flach",
        price: 0.00,
        image: "https://flachequipamentos.com.br/wp-content/uploads/APF-1000C-1.png",
        images: [
            "https://flachequipamentos.com.br/wp-content/uploads/APF-1000C-1.png",
            "https://flachequipamentos.com.br/wp-content/uploads/APF-1000C-5.png",
            "https://flachequipamentos.com.br/wp-content/uploads/APF-1000C-2.png"
        ],
        description: "Garantia do Produto: O APF-1000C possui uma garantia de 12 meses a partir da data de compra, a qual deve ser comprovada pela nota fiscal de venda. Cobertura da Garantia: A garantia cobre defeitos de fabricação dos componentes do produto. Caso o produto precise ser enviado à fábrica, os custos de frete serão pagos pela Flach, desde que o produto seja utilizado de forma correta e conforme as instruções do manual. Exclusões da Garantia: A garantia não cobre violação do lacre de garantia, danos causados por contato com água ou outros líquidos, danos por descargas elétricas ou curtos-circuitos, danos resultantes de quedas, batidas ou mau uso, alterações nos cabos de partida ou cabos de recarga fornecidos, desgaste natural de acessórios como cabos e conectores. Substituição de Cabos: Em caso de danos nos cabos, substitua por modelos indicados ou fornecidos pela Flach para evitar riscos futuros.",
        specs: "<ul style='margin:0.6rem 0 0 1rem;line-height:1.45;color:#222;list-style:disc;padding-left:1rem;'><li><strong>Modelo:</strong> APF-1000C</li><li><strong>Aplicação:</strong> Auxiliar de partida e recarga de baterias automotivas</li><li><strong>Garantia:</strong> 12 meses (com nota fiscal)</li><li><strong>Acessórios:</strong> Cabos de partida e carregador integrado</li></ul>",
        rating: 4.7,
        reviews: 0,
        badge: "Novo",
        // opções vendáveis (selector no modal) — incluir APF-800D e APF-600C
        options: [430, 431, 432]
    },
    {
        id: 431,
        name: "Auxiliar de Partida Flach APF-800D",
        category: "flach",
        price: 0.00,
        image: "https://flachequipamentos.com.br/wp-content/uploads/APF-1000C-5.png",
        images: ["https://flachequipamentos.com.br/wp-content/uploads/APF-1000C-5.png"],
        description: "Auxiliar de Partida Flach APF-800D — modelo compacto com funcionalidades de partida e recarga. Consulte manual para instruções de uso e garantia.",
        rating: 4.6,
        reviews: 0,
        disableVariants: true
    },
    {
        id: 432,
        name: "Auxiliar de Partida Flach APF-600C",
        category: "flach",
        price: 0.00,
        image: "https://flachequipamentos.com.br/wp-content/uploads/APF-1000C-2.png",
        images: ["https://flachequipamentos.com.br/wp-content/uploads/APF-1000C-2.png"],
        description: "Auxiliar de Partida Flach APF-600C — versão econômica para partidas de bateria e carga assistida. Consulte manual e termos de garantia.",
        rating: 4.5,
        reviews: 0,
        disableVariants: true
    },
    // --- Flach: Cabo de Transferência 500A (novo solicitado) ---
    {
        id: 454,
        name: "Cabo de Transferência 500A",
        category: "flach",
        price: 0.00,
        image: "https://flachequipamentos.com.br/wp-content/uploads/CTF_500A-1.png",
        images: [
            "https://flachequipamentos.com.br/wp-content/uploads/CTF_500A-1.png",
            "https://flachequipamentos.com.br/wp-content/uploads/Para-de-Garra_CTF-5.png",
            "https://flachequipamentos.com.br/wp-content/uploads/CTF_500Ax.png"
        ],
        description: "Corrente: 500 A\nComprimento: 3 metros\nCor: Vermelho/Preto\nIndicação: Baterias até 180A",
        rating: 4.5,
        reviews: 0,
        badge: "Novo",
        // opções vendáveis (ids de variantes criadas abaixo)
        options: [455,456,457,458]
    },
    {
        id: 455,
        name: "Cabo de Transferência 100A",
        category: "flach",
        price: 0.00,
        image: "https://flachequipamentos.com.br/wp-content/uploads/CTF_500A-1.png",
        images: ["https://flachequipamentos.com.br/wp-content/uploads/CTF_500A-1.png"],
        description: "Cabo de Transferência 100A — cabo reforçado para transfêrencia de corrente em serviços automotivos.",
        rating: 4.4,
        reviews: 0,
        disableVariants: true
    },
    {
        id: 456,
        name: "Cabo de Transferência 200A",
        category: "flach",
        price: 0.00,
        image: "https://flachequipamentos.com.br/wp-content/uploads/CTF_500A-1.png",
        images: ["https://flachequipamentos.com.br/wp-content/uploads/CTF_500A-1.png"],
        description: "Cabo de Transferência 200A — ideal para baterias de maior capacidade.",
        rating: 4.4,
        reviews: 0,
        disableVariants: true
    },
    {
        id: 457,
        name: "Cabo de Transferência 300A",
        category: "flach",
        price: 0.00,
        image: "https://flachequipamentos.com.br/wp-content/uploads/CTF_500A-1.png",
        images: ["https://flachequipamentos.com.br/wp-content/uploads/CTF_500A-1.png"],
        description: "Cabo de Transferência 300A — cabo robusto para aplicações profissionais.",
        rating: 4.4,
        reviews: 0,
        disableVariants: true
    },
    {
        id: 458,
        name: "Cabo de Transferência 500A",
        category: "flach",
        price: 0.00,
        image: "https://flachequipamentos.com.br/wp-content/uploads/CTF_500A-1.png",
        images: ["https://flachequipamentos.com.br/wp-content/uploads/CTF_500A-1.png"],
        description: "Cabo de Transferência 500A — versão de alta corrente para baterias até 180A.",
        rating: 4.5,
        reviews: 0,
        disableVariants: true
    },
    // --- Flach: Testador de Baterias com impressora TPF-2000 (novo) ---
    {
        id: 433,
        name: "Testador de Baterias com impressora 12/24V Flach TPF-2000",
        category: "flach",
        price: 0.00,
        image: "https://flachequipamentos.com.br/wp-content/uploads/Produto-TPF-2000-7.png",
        images: [
            "https://flachequipamentos.com.br/wp-content/uploads/Produto-TPF-2000-7.png",
            "https://flachequipamentos.com.br/wp-content/uploads/Produto-TPF-2000-6.png",
            "https://flachequipamentos.com.br/wp-content/uploads/Produto-TPF-2000-4.png"
        ],
        description: "RECURSOS E FUNÇÕES DO TESTADOR TPF-2000: tensão do sistema 12/24V; impressora térmica (sem tinta); resultado do teste: bom, recarregar ou substituir; capacidade em CCA/DIN/EN/IEC de 10 até 2000A; resistência interna (mΩ); vida útil da bateria em %; teste dentro/fora do veículo; teste de sistema de partida e de carga; oscilação do alternador em forma de onda; registrar e reproduzir resultados (atualização vitalícia). 12 meses de garantia de fábrica.",
        specs: "<ul style='margin:0.6rem 0 0 1rem;line-height:1.45;color:#222;list-style:disc;padding-left:1rem;'><li><strong>Display:</strong> LCD retroiluminado</li><li><strong>Temperatura de operação:</strong> 0º à 50ºC</li><li><strong>Temperatura de armazenamento:</strong> -20º à 70ºC</li><li><strong>Sistema:</strong> 12/24 Volts (alcance 8V~28V)</li><li><strong>Fonte de energia:</strong> Não necessita de bateria interna (liga quando conectado)</li><li><strong>Capacidade de medição:</strong> 10 até 2000 A (CCA/DIN/EN/IEC)</li><li><strong>Impressora:</strong> Térmica integrada (impressão sem tinta)</li><li><strong>Garantia:</strong> 12 meses</li></ul>",
        rating: 4.6,
        reviews: 0,
        badge: "Novo",
        // ativar seletor de variantes e referenciar opções vendáveis (TPF-2000 + TCF-2005 + TBF2000)
        disableVariants: false,
        options: [433, 434, 435]
    },
    {
        id: 434,
        name: "Testador, Carregador e Reativador de Baterias Flach TCF-2005",
        category: "flach",
        price: 0.00,
        image: "https://flachequipamentos.com.br/wp-content/uploads/Produto-TPF-2000-7.png",
        images: ["https://flachequipamentos.com.br/wp-content/uploads/Produto-TPF-2000-7.png"],
        description: "Testador, carregador e reativador de baterias Flach TCF-2005 — equipamento multifuncional para diagnóstico, carregamento e reativação de baterias 12/24V. Consulte manual e termos de garantia (12 meses).",
        rating: 4.5,
        reviews: 0,
        disableVariants: true
    },
    {
        id: 435,
        name: "Testador de Baterias Flach TBF2000",
        category: "flach",
        price: 0.00,
        image: "https://flachequipamentos.com.br/wp-content/uploads/Produto-TPF-2000-6.png",
        images: ["https://flachequipamentos.com.br/wp-content/uploads/Produto-TPF-2000-6.png"],
        description: "Testador de Baterias Flach TBF2000 — diagnóstico completo de baterias e sistema de carga. 12 meses de garantia.",
        rating: 4.4,
        reviews: 0,
        disableVariants: true
    },
    // --- Flach: Inversores Senoidais Puro IFP Series (IFP2000 + variantes) ---
    {
        id: 436,
        name: "Inversor Senoidal Puro IFP2000",
        category: "flach",
        price: 0.00,
        image: "https://flachequipamentos.com.br/wp-content/uploads/IFP2000-scaled.png",
        images: [
            "https://flachequipamentos.com.br/wp-content/uploads/IFP2000-scaled.png",
            "https://flachequipamentos.com.br/wp-content/uploads/IFP2000-3-scaled.png",
            "https://flachequipamentos.com.br/wp-content/uploads/IFP2000-2-scaled.png"
        ],
        description: "TENSÕES DISPONÍVEIS: 12/220V, 24/220V, 12/127V, 24/127V. INFORMAÇÕES: Eficiência 90%; Cooler para refrigeração; Proteções: sobrecarga, subtensão, sobretensão; Tensão de saída 127/220V: ±5%; Frequência: 60Hz ±3Hz; Temperatura de operação: 0°C a +40°C; Desligamento por temperatura >75°C. Garantia: 1 ano.",
        specs: "<ul style='margin:0.6rem 0 0 1rem;line-height:1.45;color:#222;list-style:disc;padding-left:1rem;'><li><strong>Tensões disponíveis:</strong> 12/220V, 24/220V, 12/127V, 24/127V</li><li><strong>Eficiência:</strong> 90%</li><li><strong>Proteções:</strong> sobrecarga, subtensão, sobretensão, desligamento térmico</li><li><strong>Frequência:</strong> 60Hz ±3Hz</li><li><strong>Temperatura de operação:</strong> 0°C a +40°C</li><li><strong>Garantia:</strong> 1 ano</li></ul>",
        rating: 4.6,
        reviews: 0,
        badge: "Novo",
        disableVariants: false,
        options: [436, 437, 438, 439, 440]
    },
    {
        id: 437,
        name: "Inversor Senoidal Puro IFP3000",
        category: "flach",
        price: 0.00,
        image: "https://flachequipamentos.com.br/wp-content/uploads/IFP2000-scaled.png",
        images: ["https://flachequipamentos.com.br/wp-content/uploads/IFP2000-scaled.png"],
        description: "Inversor Senoidal Puro IFP3000 — modelo de maior potência da série IFP. Consulte especificações e disponibilidade.",
        rating: 4.5,
        reviews: 0,
        disableVariants: true
    },
    {
        id: 438,
        name: "Inversor Senoidal Puro IFP4000",
        category: "flach",
        price: 0.00,
        image: "https://flachequipamentos.com.br/wp-content/uploads/IFP2000-3-scaled.png",
        images: ["https://flachequipamentos.com.br/wp-content/uploads/IFP2000-3-scaled.png"],
        description: "Inversor Senoidal Puro IFP4000 — especificações para cargas maiores. Consulte disponibilidade.",
        rating: 4.5,
        reviews: 0,
        disableVariants: true
    },
    {
        id: 439,
        name: "Inversor Senoidal Puro IFP6000",
        category: "flach",
        price: 0.00,
        image: "https://flachequipamentos.com.br/wp-content/uploads/IFP2000-2-scaled.png",
        images: ["https://flachequipamentos.com.br/wp-content/uploads/IFP2000-2-scaled.png"],
        description: "Inversor Senoidal Puro IFP6000 — modelo de alta capacidade para aplicações exigentes.",
        rating: 4.4,
        reviews: 0,
        disableVariants: true
    },
    {
        id: 440,
        name: "Inversor Senoidal Puro IFP8000",
        category: "flach",
        price: 0.00,
        image: "https://flachequipamentos.com.br/wp-content/uploads/IFP2000-2-scaled.png",
        images: ["https://flachequipamentos.com.br/wp-content/uploads/IFP2000-2-scaled.png"],
        description: "Inversor Senoidal Puro IFP8000 — modelo top da linha para cargas muito altas. Entre em contato para prazos e orçamento.",
        rating: 4.3,
        reviews: 0,
        disableVariants: true
    },
    // --- Flach: Conversor de Tensão CF-10A (novo) ---
    {
        id: 446,
        name: "Conversor de Tensão CF-10A",
        category: "flach",
        price: 0.00,
        image: "https://flachequipamentos.com.br/wp-content/uploads/CF-10A-2.jpg",
        images: [
            "https://flachequipamentos.com.br/wp-content/uploads/CF-10A-2.jpg",
            "https://flachequipamentos.com.br/wp-content/uploads/CF-10A-3.jpg",
            "https://flachequipamentos.com.br/wp-content/uploads/CF-10A-4.jpg"
        ],
        description: "Conversor 24 para 12 volts — permite instalação de acessórios automotivos 12V em veículos 24V. Potência: 120W / 10A. Entrada: 24VDC; Saída: 12VDC ±0,5V. Eficiência: 90–93%. Proteções: alta temperatura, baixa tensão, alta tensão, sobrecarga. Temperatura de operação: 0–50°C. Dimensões: A:65mm L:135mm C:170mm. Peso: 530 g. Garantia: 1 ano.",
        specs: "<ul style='margin:0.6rem 0 0 1rem;line-height:1.45;color:#222;list-style:disc;padding-left:1rem;'><li><strong>Potência:</strong> 120W / 10A</li><li><strong>Entrada:</strong> 24 VDC</li><li><strong>Saída:</strong> 12 VDC ±0,5V</li><li><strong>Eficiência:</strong> 90–93%</li><li><strong>Temperatura:</strong> 0–50°C</li><li><strong>Proteções:</strong> alta temperatura, baixa tensão, alta tensão, sobrecarga</li><li><strong>Dimensões:</strong> 65 x 135 x 170 mm</li><li><strong>Peso:</strong> 530 g</li><li><strong>Garantia:</strong> 1 ano</li></ul>",
        video: "https://www.youtube.com/embed/DlkNz7zupzo",
        rating: 4.5,
        reviews: 0,
        badge: "Novo",
        disableVariants: false,
        options: [446, 447]
    },
    {
        id: 447,
        name: "Conversor de Tensão CF-30A",
        category: "flach",
        price: 0.00,
        image: "https://flachequipamentos.com.br/wp-content/uploads/CF-10A-3.jpg",
        images: ["https://flachequipamentos.com.br/wp-content/uploads/CF-10A-3.jpg"],
        description: "Conversor de Tensão CF-30A — versão com maior corrente disponível. Consulte especificações e disponibilidade.",
        rating: 4.4,
        reviews: 0,
        disableVariants: true
    },
    // --- Flach: Carregador Inteligente de Bateria F60 RNEW e variantes ---
    {
        id: 441,
        name: "Carregador Inteligente de Bateria F30 RNEW",
        category: "flach",
        price: 0.00,
        image: "https://flachequipamentos.com.br/wp-content/uploads/F60-1.jpg",
        images: [
            "https://flachequipamentos.com.br/wp-content/uploads/F60-1.jpg",
            "https://flachequipamentos.com.br/wp-content/uploads/F60-2.png"
        ],
        description: "Carregador Inteligente de Bateria série RNEW. Modelos disponíveis: F30, F60, F100, F150, F250. Seleção automática de carga 12V/24V; amperímetro digital; alça retrátil; carrinho de transporte; auxilia na partida; transformador envernizado; caixa galvanizada com pintura eletrostática; proteção contra sobrecargas e ligação invertida; refrigeração forçada; sistema automático de reativação; carga inteligente; compatível com SLI, EFB, AGM e lítio. Garantia: 2 anos.",
        specs: "<ul style='margin:0.6rem 0 0 1rem;line-height:1.45;color:#222;list-style:disc;padding-left:1rem;'><li><strong>Potência real:</strong> 12V = 240W / 24V = 480W</li><li><strong>Sistema de flutuação:</strong> 14V / 28V</li><li><strong>Entrada:</strong> Bivolt 127/220V</li><li><strong>Corrente de saída:</strong> 1–20 A/H automático</li><li><strong>Recursos:</strong> Amperímetro digital, carrinho, alça retrátil, reativação automática</li><li><strong>Proteções:</strong> sobrecarga, ligação invertida, proteção térmica</li><li><strong>Garantia:</strong> 2 anos</li></ul>",
        video: "https://www.youtube.com/embed/w3Xc_4l7a70",
        rating: 4.7,
        reviews: 0,
        badge: "Novo",
        disableVariants: false,
        options: [441, 442, 443, 444, 445]
    },
    {
        id: 442,
        name: "Carregador Inteligente de Bateria F60 RNEW",
        category: "flach",
        price: 0.00,
        image: "https://flachequipamentos.com.br/wp-content/uploads/F60-1.jpg",
        images: ["https://flachequipamentos.com.br/wp-content/uploads/F60-1.jpg"],
        description: "Carregador Inteligente de Bateria F60 RNEW — versão intermediária da série RNEW. Consulte especificações.",
        rating: 4.5,
        reviews: 0,
        disableVariants: true
    },
    {
        id: 443,
        name: "Carregador Inteligente de Bateria F100 RNEW",
        category: "flach",
        price: 0.00,
        image: "https://flachequipamentos.com.br/wp-content/uploads/F60-2.png",
        images: ["https://flachequipamentos.com.br/wp-content/uploads/F60-2.png"],
        description: "Carregador Inteligente de Bateria F100 RNEW — versão de maior potência da série RNEW. Consulte especificações.",
        rating: 4.4,
        reviews: 0,
        disableVariants: true
    },
    {
        id: 444,
        name: "Carregador Inteligente de Bateria F150 RNEW",
        category: "flach",
        price: 0.00,
        image: "https://flachequipamentos.com.br/wp-content/uploads/F60-1.jpg",
        images: ["https://flachequipamentos.com.br/wp-content/uploads/F60-1.jpg"],
        description: "Carregador Inteligente de Bateria F150 RNEW — versão para aplicações de maior demanda.",
        rating: 4.3,
        reviews: 0,
        disableVariants: true
    },
    {
        id: 445,
        name: "Carregador Inteligente de Bateria F250 RNEW",
        category: "flach",
        price: 0.00,
        image: "https://flachequipamentos.com.br/wp-content/uploads/F60-2.png",
        images: ["https://flachequipamentos.com.br/wp-content/uploads/F60-2.png"],
        description: "Carregador Inteligente de Bateria F250 RNEW — modelo top de capacidade da série RNEW.",
        rating: 4.3,
        reviews: 0,
        disableVariants: true
    },
    // --- Flach: Carregador Inteligente de Bateria F10 (novo solicitado) ---
    {
        id: 448,
        name: "Carregador Inteligente de Bateria F10",
        category: "flach",
        price: 0.00,
        image: "https://flachequipamentos.com.br/wp-content/uploads/F0A5725.jpg",
        images: [
            "https://flachequipamentos.com.br/wp-content/uploads/F0A5725.jpg",
            "https://flachequipamentos.com.br/wp-content/uploads/F0A5723.jpg",
            "https://flachequipamentos.com.br/wp-content/uploads/Sem-Titulo-3.png"
        ],
        description: "Potência real: 10 A = 120 W\nSistema de flutuação: 14 V\nTensão de entrada: Bivolt 127/220V\nCorrente de entrada 127 V: 2 A\nCorrente de entrada 220 V: 1,5 A\nCorrente de saída: 1-10 A/H AUTOMÁTICO\nFrequência: 60Hz\nPeso: 3,3Kg\nTamanho: A:15cm – L:16,5cm – C:27cm (com embalagem)\nAuxilia a bateria na partida com até 10 A\nAmperímetro digital\nTransformador envernizado\nCaixa Galvanizada com pintura eletrostática\nVoltagem de acionamento automático: 1,5 V\nProteção contra sobrecargas na saída e ligação invertida\nProteção térmica\nSistema automático de reativação de baterias\nCarga inteligente (somente a necessidade da bateria)\nCarrega qualquer tipo e tamanho de bateria automotiva 12V\nRecarrega baterias SLI, EFB, AGM, baterias start stop.\n2 (dois) anos de garantia\nCertificado pelo INMETRO\nProjeto exclusivo\n\nInformações Importantes - LEDS INDICADORES:\nPolo invertido: quando aceso indica ligação invertida dos cabos do carregador na bateria.\nConectado: Aceso = carregador conectado corretamente. Apagado = verificar conexão/voltagem da bateria.\nProteção: Aceso = proteção térmica. Piscando = proteção contra sobrecarga.\nIndicativo de carga: Aceso = carregador em carga. Piscando = bateria carregada (modo seguro, pode permanecer conectado).\nPara regiões 127V: padrão de fábrica selecionado em 220V; se não mudar chave seletora, o LED acenderá mas não haverá carga.",
        specs: "<ul style='margin:0.6rem 0 0 1rem;line-height:1.45;color:#222;list-style:disc;padding-left:1rem;'><li><strong>Potência real:</strong> 10 A = 120 W</li><li><strong>Sistema de flutuação:</strong> 14 V</li><li><strong>Tensão de entrada:</strong> Bivolt 127/220V</li><li><strong>Corrente de entrada 127V:</strong> 2 A</li><li><strong>Corrente de entrada 220V:</strong> 1,5 A</li><li><strong>Corrente de saída:</strong> 1-10 A/H automático</li><li><strong>Frequência:</strong> 60Hz</li><li><strong>Peso:</strong> 3,3Kg</li><li><strong>Dimensões (A×L×C):</strong> 15 × 16.5 × 27 cm (com embalagem)</li><li><strong>Garantia:</strong> 2 anos</li><li><strong>Certificações:</strong> INMETRO</li></ul>",
        video: "https://www.youtube.com/embed/_ZDCrtxQhms",
        rating: 4.6,
        reviews: 0,
        badge: "Novo",
        disableVariants: false,
        // opções: incluir o próprio F10 + variantes F06, F10x4, F10x8, F100 SR, F150 SR
        options: [448, 449, 450, 451, 452, 453]
    },
    {
        id: 449,
        name: "Carregador Inteligente de Bateria F06",
        category: "flach",
        price: 0.00,
        image: "https://flachequipamentos.com.br/wp-content/uploads/F0A5723.jpg",
        images: ["https://flachequipamentos.com.br/wp-content/uploads/F0A5723.jpg"],
        description: "Carregador Inteligente de Bateria F06 — versão compacta da linha F. Consulte manual para especificações e garantia.",
        rating: 4.5,
        reviews: 0,
        disableVariants: true
    },
    {
        id: 450,
        name: "Carregador Inteligente de Bateria F10x4",
        category: "flach",
        price: 0.00,
        image: "https://flachequipamentos.com.br/wp-content/uploads/Sem-Titulo-3.png",
        images: ["https://flachequipamentos.com.br/wp-content/uploads/Sem-Titulo-3.png"],
        description: "Carregador Inteligente de Bateria F10x4 — versão com 4 saídas/porta. Ideal para aplicações de oficina e múltiplas baterias.",
        rating: 4.4,
        reviews: 0,
        disableVariants: true
    },
    {
        id: 451,
        name: "Carregador Inteligente de Bateria F10x8",
        category: "flach",
        price: 0.00,
        image: "https://flachequipamentos.com.br/wp-content/uploads/Sem-Titulo-3.png",
        images: ["https://flachequipamentos.com.br/wp-content/uploads/Sem-Titulo-3.png"],
        description: "Carregador Inteligente de Bateria F10x8 — versão com 8 saídas para aplicações em frotas/lojas.",
        rating: 4.4,
        reviews: 0,
        disableVariants: true
    },
    {
        id: 452,
        name: "Carregador Inteligente de Bateria F100 SR",
        category: "flach",
        price: 0.00,
        image: "https://flachequipamentos.com.br/wp-content/uploads/F60-2.png",
        images: ["https://flachequipamentos.com.br/wp-content/uploads/F60-2.png"],
        description: "Carregador Inteligente de Bateria F100 SR — versão SR para aplicações de maior demanda.",
        rating: 4.3,
        reviews: 0,
        disableVariants: true
    },
    {
        id: 453,
        name: "Carregador Inteligente de Bateria F150 SR",
        category: "flach",
        price: 0.00,
        image: "https://flachequipamentos.com.br/wp-content/uploads/F60-1.jpg",
        images: ["https://flachequipamentos.com.br/wp-content/uploads/F60-1.jpg"],
        description: "Carregador Inteligente de Bateria F150 SR — versão SR para aplicações pesadas.",
        rating: 4.3,
        reviews: 0,
        disableVariants: true
    },
];

// Mesclar produtos base com produtos personalizados salvos pelo admin
// (customProducts em localStorage). A lista mesclada fica em window.products
// para ser reutilizada em outras partes do site.
try {
    const customProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');
    if (Array.isArray(customProducts) && customProducts.length) {
        const baseWithoutCustom = products.filter(bp => !customProducts.some(cp => cp.id === bp.id));
        window.products = [...baseWithoutCustom, ...customProducts];
    } else {
        window.products = products;
    }
} catch (e) {
    console.warn('Falha ao carregar customProducts, usando apenas products base:', e);
    window.products = products;
}

// Gerar avaliações para cada produto em todos os idiomas
window.products.forEach(product => {
    product.reviews_list_pt = generateReviews(4, 'pt');
    product.reviews_list_en = generateReviews(4, 'en');
    product.reviews_list_es = generateReviews(4, 'es');
    product.reviews_list = product.reviews_list_pt; // Default para português
});

// Selecionar 30 produtos para promoção e marcar o badge como "Promoção"
(function markPromotions(){
    try {
        const excluded = new Set(['brasilcr','up','flach']);
        // Elegíveis: somente ANMAX (não parceiros)
        const eligible = window.products.filter(p => p && !excluded.has(p.category));
        // Alternar: um produto SIM, outro NÃO
        let applied = 0;
        eligible.forEach((p, idx) => {
            const isPromo = idx % 2 === 0; // alterna: 0 = sim, 1 = não
            if (isPromo) {
                p.badge = 'Promoção';
                if (typeof p.name === 'string' && !/promoção/i.test(p.name)) {
                    p.name = `${p.name} — Promoção`;
                }
                applied++;
            } else {
                // Remover quaisquer marcas prévias de promoção do nome/badge
                if (p.badge === 'Promoção') p.badge = undefined;
                if (typeof p.name === 'string') p.name = p.name.replace(/\s*—\s*Promoção/i, '').trim();
            }
        });
        window.promoSelection = eligible.filter((_, idx) => idx % 2 === 0).map(p => ({ id: p.id, name: p.name }));
        console.log('Promoção alternada aplicada em', applied, 'produtos ANMAX');
    } catch (e) {
        console.warn('Falha ao marcar promoções:', e);
    }
})();

// diagnostic console removed

// --- Utility functions and renderers ---
function generateStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    let s = '';
    for (let i = 0; i < full; i++) s += '<i class="fas fa-star"></i>';
    if (half) s += '<i class="fas fa-star-half-alt"></i>';
    for (let i = 0; i < 5 - Math.ceil(rating); i++) s += '<i class="far fa-star"></i>';
    return s;
}

function formatPrice(price, currency = 'USD') {
    const rates = { USD: 1, BRL: 5.0 };
    const value = price * (rates[currency] || 1);
    return currency === 'BRL'
        ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
        : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function getCategoryName(category) {
    const map = { iphone: 'iPhone & Acessórios', audio: 'Áudio', power: 'Carregadores', storage: 'Armazenamento', security: 'Segurança', crypto: 'Cripto', lifestyle: 'Lifestyle' };
    return map[category] || category;
}

function loadProducts(category = 'all') {
    const grid = document.getElementById('productsGrid');
    const pagination = document.getElementById('pagination');
    if (!grid) return;
    const lang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'pt';
    const currency = localStorage.getItem('currency') || 'USD';
    // Trabalha sempre com a lista mesclada (base + custom) em window.products
    const source = Array.isArray(window.products) ? window.products : products;

    // Excluir explicitamente produtos das categorias 'brasilcr' e 'up' das abas/visões padrão
    // (eles só aparecem quando a aba/categoria solicitada for 'brasilcr' ou 'up' respectivamente)
    let list;
    if (category === 'all') {
        // 'all' deve mostrar apenas os produtos da área ANMAX (ex.: 'construcao' etc.)
        // Filtragem defensiva: excluir categorias parceiras e qualquer produto cujo nome
        // contenha 'flach' (protege contra produtos mal categorizados)
        const partnerCats = ['brasilcr', 'up', 'flach'];
        list = source.filter(p => {
            if (!p) return false;
            if (partnerCats.includes(p.category)) return false;
            if (typeof p.name === 'string' && /flach/i.test(p.name)) return false;
            return true;
        });
    } else if (category === 'brasilcr') {
        // Garantir que alguns produtos BrasilCR possam ser forçados para páginas posteriores
        const allCr = source.filter(p => p.category === 'brasilcr');
        const firstPage = allCr.filter(p => p.crPage !== 2);
        const secondPage = allCr.filter(p => p.crPage === 2);
        list = [...firstPage, ...secondPage];
    } else {
        list = source.filter(p => p.category === category);
    }
    // Paginação
    // Mostrar 4 produtos por página/aba (primeira aba terá 4, os demais irão para a 2ª aba)
    const pageSize = 4;
    let currentPage = window.currentProductPage || 1;
    // Se for adição de produto novo, garantir que a página 1 seja exibida
    if (window.forceFirstPage) {
        currentPage = 1;
        window.currentProductPage = 1;
        window.forceFirstPage = false;
    }
    const totalPages = Math.ceil(list.length / pageSize);
    if (currentPage > totalPages) currentPage = 1;
    window.currentProductPage = currentPage;
    const paginated = list.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    grid.innerHTML = paginated.map(p => {
        const desc = typeof getProductDescription === 'function' ? getProductDescription(p.id, lang) : p.description;
        const bestImage = p.images && p.images.length > 0 ? p.images[0] : p.image;
        return `
            <div class="product-card" data-category="${p.category}">
                <div class="product-image" onclick="showProductModal(${p.id})">
                    <img src="${bestImage}" alt="${p.name}" loading="lazy" style="cursor:pointer;image-rendering:crisp-edges;">
                    ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
                </div>
                    <div class="product-info">
                    <div class="product-category">${getCategoryName(p.category)}</div>
                    <h3 class="product-name">${p.name}</h3>
                    <p class="product-description">${desc}</p>
                    <div class="product-rating"><div class="stars">${generateStars(p.rating)}</div><span class="rating-count">(${p.reviews})</span></div>
                    <div class="product-footer" style="display:flex;justify-content:center;align-items:center;margin-top:1.2rem;gap:0.6rem;">
                        <div style="display:flex;align-items:center;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;background:#fff;">
                            <button type="button" onclick="(function(ev){ ev && ev.stopPropagation(); const el=document.getElementById('card-qty-${p.id}'); let v=parseInt(el.textContent,10)||1; if(v>1) el.textContent = v-1; })(event)" style="border:none;background:transparent;padding:0.5rem 0.8rem;font-size:1.05rem;cursor:pointer;">−</button>
                            <span id="card-qty-${p.id}" style="min-width:48px;display:inline-block;text-align:center;padding:0.45rem 0.6rem;font-weight:700;color:#000;">1</span>
                            <button type="button" onclick="(function(ev){ ev && ev.stopPropagation(); const el=document.getElementById('card-qty-${p.id}'); let v=parseInt(el.textContent,10)||1; el.textContent = v+1; })(event)" style="border:none;background:transparent;padding:0.5rem 0.8rem;font-size:1.05rem;cursor:pointer;">+</button>
                        </div>
                        <button class="add-to-cart-btn" onclick="(function(ev){ ev && ev.stopPropagation(); const qEl=document.getElementById('card-qty-${p.id}'); const qty = qEl? parseInt(qEl.textContent,10)||1 : 1; addToCart(${p.id}, qty); })(event)" style="font-size:1.05rem;padding:0.7rem 1.4rem;min-width:120px;display:flex;align-items:center;justify-content:center;gap:0.5rem;">
                            <i class="fas fa-shopping-cart"></i>
                            <span data-translate="add_to_cart">Adicionar</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    // Renderizar paginação
    if (pagination) {
        if (totalPages > 1) {
            pagination.innerHTML = Array.from({length: totalPages}, (_, i) =>
                `<button class="page-btn${i+1===currentPage?' active':''}" onclick="changeProductPage(${i+1})">${i+1}</button>`
            ).join('');
        } else {
            pagination.innerHTML = '';
        }
    }
}

window.changeProductPage = function(page) {
    window.currentProductPage = page;
    loadProducts();
}

// Sempre que adicionar um produto novo, forçar exibição da página 1
window.forceFirstPage = true;

window.showProductModal = function showProductModal(productId) {
    const source = Array.isArray(window.products) ? window.products : products;
    const product = source.find(p => p.id === productId);
    if (!product) return;
    // Não exibir a imagem extra (tableImage) para produtos da categoria 'brasilcr'
    const hasTableImage = !!product.tableImage && product.category !== 'brasilcr';
    if (!product) return;
    const isMotorDiesel = product.name.toLowerCase().includes('motor a diesel');
    const images = product.images && product.images.length ? product.images : [product.image];
    const lang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'pt';
    const trans = translations[lang] || translations.pt;

    let thumbs = '';
    // Tabelas especiais: exibir como bloco extra apenas para produtos especiais
    // Para motosserra, garantir que a imagem da tabela está nas miniaturas (images)
    // Para outros produtos especiais, restaurar bloco extra
    if (images.length > 1) {
        thumbs += `<div style="display:grid;grid-template-columns:repeat(${Math.min(images.length,5)},1fr);gap:0.6rem;">`;
        images.forEach((im, i) => thumbs += `<img src="${im}" class="gallery-thumb" data-image="${im}" alt="Imagem ${i+1}" style="width:100%;height:110px;object-fit:cover;object-position:center center;border-radius:8px;cursor:pointer;border:2.5px solid ${i===0? 'var(--primary)':'transparent'};image-rendering:crisp-edges;filter:contrast(1.08) saturate(1.12);">`);
        thumbs += `</div>`;
    }

    let colorsHtml = '';
    if (product.colors) colorsHtml = product.colors.map((c,i)=>`<div class="color-option" data-color="${c.name}" title="${c.name}" style="width:40px;height:40px;border-radius:6px;background:${c.code};border:3px solid ${i===0? 'var(--primary)':'transparent'};cursor:pointer;display:flex;align-items:center;justify-content:center;">${i===0? '✓':''}</div>`).join('');

    let devicesOptions = '';
    if (product.devices) devicesOptions = product.devices.map(d=>`<option value="${d}">${d}</option>`).join('');

    // Gerar HTML de avaliações com estilo melhorado (usar reviews no idioma correto)
    let reviewsHtml = '';
    const reviewsToShow = lang === 'en' ? product.reviews_list_en : (lang === 'es' ? product.reviews_list_es : product.reviews_list_pt);
    if (reviewsToShow && reviewsToShow.length > 0) {
        reviewsHtml = reviewsToShow.map(review => `
            <div style="background:linear-gradient(135deg,#f0f7ff 0%,#f9fafb 100%);border:2px solid var(--primary);padding:1.2rem;border-radius:10px;box-shadow:0 4px 12px rgba(102,126,234,0.15);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
                    <strong style="color:var(--primary);font-size:1.05rem;">${review.name}</strong>
                    <div style="color:var(--primary);font-size:1rem;">${generateStars(review.rating)}</div>
                </div>
                <p style="color:var(--gray-700);font-size:0.95rem;margin:0;line-height:1.6;">"${review.comment}"</p>
            </div>
        `).join('');
    }

    const isCortadora = product.name.toLowerCase().includes('cortadoras de piso');
    const isBomba = product.name.toLowerCase().includes('bomba submersível de mangote');
    const isAlisadora = product.name.toLowerCase().includes('alisadora de concreto');
    // Se for produto BrasilCR, criar seletor de variantes (todas da mesma categoria)
    // Produtos com `disableVariants: true` não terão seletor
    let variantsHtml = '';
    if (!product.disableVariants && (product.options && product.options.length || product.category === 'brasilcr')) {
        let variants = [];
        // Se o produto tiver uma lista explícita de options (ids), usar essas opções
        if (product.options && product.options.length) {
            variants = product.options.map(id => products.find(p => p.id === id)).filter(Boolean);
        } else {
            // Mantém o comportamento anterior para BrasilCR (vários grupos com regras específicas)
            if (product.id === 302) {
                const allowedIds = [302, 303, 304, 305];
                variants = products.filter(v => allowedIds.includes(v.id));
            } else if (product.id === 306) {
                variants = products.filter(v => (v.category === 'brasilcr' && /martelo demolidor/i.test(v.name)) || v.id === 306);
            } else if (product.id === 309) {
                const allowedIds = [309, 310];
                variants = products.filter(v => allowedIds.includes(v.id));
            } else if (product.id === 312) {
                const allowedIds = [312, 313, 314, 315];
                variants = products.filter(v => allowedIds.includes(v.id));
            } else if (product.id === 320) {
                const allowedIds = [320, 321, 322];
                variants = products.filter(v => allowedIds.includes(v.id));
            } else if (product.id === 201) {
                const allowedIds = [201, 202, 203, 204];
                variants = products.filter(v => allowedIds.includes(v.id));
            } else {
                variants = products.filter(v => v.category === 'brasilcr');
            }
        }

        const optionsHtml = variants.map(v => {
            const label = v.name || '';
            return `<option value="${v.id}" ${v.id===product.id? 'selected' : ''}>${label.trim()}</option>`;
        }).join('');

        variantsHtml = `
            <div style="margin-bottom:0.8rem;display:flex;align-items:center;gap:0.6rem;">
                <label for="variantSelect-${product.id}" style="font-weight:600;color:var(--gray-700);">Escolha a opção:</label>
                <select id="variantSelect-${product.id}" style="padding:0.5rem;border:1px solid #e5e7eb;border-radius:6px;">
                    ${optionsHtml}
                </select>
            </div>
        `;
    }

    const modalHtml = `
        <div class="modal active" id="productModal">
            <div class="modal-content modal-lg" style="max-width:1000px; max-height:90vh; overflow-y:auto;">
                <div class="modal-header"><h3 style="color:#181818;">${product.name}</h3><button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button></div>
                <div class="modal-body">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin-bottom:2rem;">
                        <div style="position:relative;">
                            <div id="mainMediaContainer" style="width:100%;height:480px;display:flex;align-items:center;justify-content:center;border:1px solid #e5e7eb;border-radius:12px;background:#f9fafb;padding:1rem;position:relative;">
                                <img id="mainImage" src="${images[0]}" alt="${product.name}" style="max-width:100%;max-height:100%;object-fit:contain;">
                            </div>
                            ${isCortadora ? `<div style='margin-top:1.5rem;display:flex;justify-content:center;'><img src='https://anmax.com.br/wp-content/uploads/2024/09/x3.png' alt='Cortadoras de piso' style='max-width:90%;border-radius:10px;box-shadow:0 4px 24px #0002;' class='zoomable-extra'></div>` : ''}
                            ${isBomba ? `<div style='margin-top:1.5rem;display:flex;justify-content:center;'><img src='https://anmax.com.br/wp-content/uploads/2024/09/rrrrr.png' alt='Bomba Submersível de mangote' style='max-width:90%;border-radius:10px;box-shadow:0 4px 24px #0002;' class='zoomable-extra'></div>` : ''}
                            ${isAlisadora ? `<div style='margin-top:1.5rem;display:flex;justify-content:center;'><img src='https://anmax.com.br/wp-content/uploads/2024/09/x1.jpg' alt='Alisadora de Concreto' style='max-width:90%;border-radius:10px;box-shadow:0 4px 24px #0002;' class='zoomable-extra'></div>` : ''}
                            ${isMotorDiesel ? `<div style='margin-top:1.5rem;display:flex;justify-content:center;'><img src='https://anmax.com.br/wp-content/uploads/2024/09/motor-a-diesel-descricao-1.png' alt='Motor a diesel' style='max-width:90%;border-radius:10px;box-shadow:0 4px 24px #0002;' class='zoomable-extra'></div>` : ''}
                            ${hasTableImage ? `<div style='margin-top:1.5rem;display:flex;justify-content:center;'><img src='${product.tableImage}' alt='Tabela do Produto' style='max-width:90%;border-radius:10px;box-shadow:0 4px 24px #0002;' class='zoomable-extra'></div>` : ''}
                            ${thumbs}
                            ${product.specs ? `<div style="margin-top:1rem;display:flex;justify-content:center;"><div style="max-width:900px;width:100%;">${product.specs}</div></div>` : ''}
                            ${product.video ? (product.video.match(/\.(mp4|webm|ogg)(\?|$)/i) ? `<div style="margin-top:1.2rem;display:flex;justify-content:center;"><div style="max-width:820px;width:100%;border-radius:10px;overflow:hidden;box-shadow:0 8px 28px rgba(0,0,0,0.12);"><video controls style="width:100%;height:420px;background:#000;display:block;" src="${product.video}"></video></div></div>` : `<div style="margin-top:1.2rem;display:flex;justify-content:center;"><div style="max-width:820px;width:100%;border-radius:10px;overflow:hidden;box-shadow:0 8px 28px rgba(0,0,0,0.12);"><iframe src="${product.video}" title="Vídeo do produto" style="width:100%;height:420px;border:0;display:block;" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe></div></div>`) : ''}
                        </div>
                        <div>
                            <div class="product-category" style="background:var(--primary);color:#fff;padding:0.4rem 0.8rem;border-radius:6px;display:inline-block;font-weight:600;margin-bottom:1rem;">${getCategoryName(product.category)}</div>
                            <h2 style="margin:0.6rem 0;font-size:2.1rem;color:#181818;">${product.name}</h2>
                            <div style="margin-bottom:1rem;color:var(--gray-600);">${generateStars(product.rating)} <strong style="color:var(--gray-800);">${product.rating}</strong> · <small>(${product.reviews})</small></div>
                            ${variantsHtml}
                            <div style="margin-top:0.6rem;display:flex;align-items:center;gap:0.6rem;">
                                <label style="font-weight:600;color:var(--gray-700);">Quantidade:</label>
                                <div style="display:flex;align-items:center;border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;background:#fff;">
                                    <button type="button" onclick="(function(ev){ ev && ev.stopPropagation(); const el=document.getElementById('qty-${product.id}'); let v=parseInt(el.textContent,10)||1; if(v>1) el.textContent = v-1; })(event)" style="border:none;background:transparent;padding:0.45rem 0.7rem;font-size:1.05rem;cursor:pointer;">−</button>
                                    <span id="qty-${product.id}" style="min-width:56px;display:inline-block;text-align:center;padding:0.45rem 0.6rem;font-weight:700;color:#000;">1</span>
                                    <button type="button" onclick="(function(ev){ ev && ev.stopPropagation(); const el=document.getElementById('qty-${product.id}'); let v=parseInt(el.textContent,10)||1; el.textContent = v+1; })(event)" style="border:none;background:transparent;padding:0.45rem 0.7rem;font-size:1.05rem;cursor:pointer;">+</button>
                                </div>
                            </div>
                            <p style="color:var(--gray-700);">${typeof getProductDescription === 'function' ? getProductDescription(product.id, lang) : product.description}</p>
                            ${product.colors? `<div style="margin-top:1rem;"><h4 style="margin:0 0 0.5rem 0;">${trans.product_colors}</h4><div style="display:flex;gap:0.6rem;">${colorsHtml}</div><p style="margin-top:0.5rem;color:var(--gray-600);">${trans.selected}: <strong id="selectedColor">${product.colors[0].name}</strong></p></div>` : ''}
                            ${product.devices? `<div style="margin-top:1rem;"><h4 style="margin:0 0 0.5rem 0;">${trans.product_devices}</h4><select id="deviceSelect" style="width:100%;padding:0.6rem;border:1px solid #e5e7eb;border-radius:6px;">${devicesOptions}</select><p style="margin-top:0.5rem;color:var(--gray-600);">${trans.device}: <strong id="selectedDevice">${product.devices[product.devices.length-1]}</strong></p></div>` : ''}
                            <div style="display:flex;gap:0.8rem;margin-top:1rem;">
                                <button class="btn btn-primary" onclick="(function(){ const qEl = document.getElementById('qty-${product.id}'); const qty = qEl? parseInt(qEl.textContent,10)||1 : 1; const sel = document.getElementById('variantSelect-${product.id}'); const pid = sel ? parseInt(sel.value,10) : ${product.id}; addToCart(pid, qty); document.getElementById('productModal') && document.getElementById('productModal').remove(); })();">${trans.add_cart}</button>
                                <button class="btn" onclick="document.getElementById('productModal') && document.getElementById('productModal').remove();">${trans.close}</button>
                            </div>
                        </div>
                    </div>
                    ${reviewsHtml? `<div style="border-top:2px solid #e5e7eb;padding-top:2rem;"><h3 style="margin:0 0 1.5rem 0;font-weight:700;color:var(--primary);">${trans.customer_reviews}</h3><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.5rem;">${reviewsHtml}</div></div>` : ''}
                </div>
            </div>
        </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modalEl = document.getElementById('productModal');

    // Sincronizar seleção de variante com imagem/título para qualquer produto que tenha um seletor
    (function(){
        const sel = modalEl.querySelector(`#variantSelect-${product.id}`);
        if (!sel) return;
        sel.addEventListener('change', function() {
            const pid = parseInt(this.value, 10);
            const variant = products.find(x => x.id === pid);
            if (!variant) return;
            const mainImg = modalEl.querySelector('#mainImage');
            const headerH3 = modalEl.querySelector('.modal-header h3');
            const titleH2 = modalEl.querySelector('h2');
            // o parágrafo de descrição principal fica logo após os controles de quantidade
            const descP = Array.from(modalEl.querySelectorAll('p')).find(p => p.textContent && p.textContent.length > 10);
            if (mainImg) mainImg.src = (variant.images && variant.images[0]) || variant.image;
            if (headerH3) headerH3.textContent = variant.name;
            if (titleH2) titleH2.textContent = variant.name;
            if (descP) descP.textContent = variant.description || descP.textContent;

            // Atualizar miniaturas (se houver) para refletir as imagens da variante
            const thumbsEls = modalEl.querySelectorAll('.gallery-thumb');
            if (thumbsEls && thumbsEls.length) {
                const imgs = variant.images && variant.images.length ? variant.images : (variant.image ? [variant.image] : []);
                if (imgs.length) {
                    thumbsEls.forEach((t, i) => {
                        const src = imgs[i] || imgs[0];
                        t.dataset.image = src;
                        t.src = src;
                        t.style.border = '2px solid transparent';
                    });
                    // marcar a primeira miniatura como ativa
                    thumbsEls[0].style.border = '2px solid var(--primary)';
                }
            }
        });
    })();

    // Efeito de zoom (lupa móvel) na imagem extra abaixo da principal
    setTimeout(() => {
        modalEl.querySelectorAll('.zoomable-extra').forEach(img => {
            img.addEventListener('mousemove', function(e) {
                const rect = img.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                img.classList.add('zoomed');
                img.style.transformOrigin = `${x}% ${y}%`;
            });
            img.addEventListener('mouseleave', function() {
                img.classList.remove('zoomed');
                img.style.transformOrigin = '';
            });
        });
    }, 100);

    if (images.length > 1) {
        const thumbsEls = modalEl.querySelectorAll('.gallery-thumb');
        thumbsEls.forEach(t => {
            t.addEventListener('click', function() {
                thumbsEls.forEach(x => x.style.border = '2px solid transparent');
                this.style.border = '2px solid var(--primary)';
                const mainImg = modalEl.querySelector('#mainImage');
                if (mainImg) {
                    mainImg.src = this.dataset.image;
                }
            });
        });
    }

    // Efeito de lupa (zoom on hover) na imagem principal
    const mainMediaContainer = modalEl.querySelector('#mainMediaContainer');
    const mainImg = modalEl.querySelector('#mainImage');
    if (mainMediaContainer && mainImg) {
        mainMediaContainer.addEventListener('mousemove', function(e) {
            const rect = mainMediaContainer.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            mainImg.classList.add('zoomed');
            mainImg.style.transformOrigin = `${x}% ${y}%`;
        });
        mainMediaContainer.addEventListener('mouseleave', function() {
            mainImg.classList.remove('zoomed');
            mainImg.style.transformOrigin = '';
        });
    }

    // Efeito de lupa (zoom on hover) na imagem de baixo (com descrição do produto)
    const descMediaContainer = modalEl.querySelector('#descMediaContainer');
    const descImg = modalEl.querySelector('#descImage');
    if (descMediaContainer && descImg) {
        descMediaContainer.addEventListener('mousemove', function(e) {
            const rect = descMediaContainer.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            descImg.classList.add('zoomed');
            descImg.style.transformOrigin = `${x}% ${y}%`;
        });
        descMediaContainer.addEventListener('mouseleave', function() {
            descImg.classList.remove('zoomed');
            descImg.style.transformOrigin = '';
        });
    }

    if (product.colors) {
        const colorEls = modalEl.querySelectorAll('.color-option');
        colorEls.forEach(c => c.addEventListener('click', function(){
            colorEls.forEach(x => x.style.border = '3px solid transparent');
            this.style.border = '3px solid var(--primary)';
            const sc = modalEl.querySelector('#selectedColor'); if (sc) sc.textContent = this.dataset.color;
        }));
    }

    if (product.devices) {
        const sel = modalEl.querySelector('#deviceSelect');
        if (sel) sel.addEventListener('change', function(){ const sd = modalEl.querySelector('#selectedDevice'); if (sd) sd.textContent = this.value; });
    }
}

// initialize on DOM ready
document.addEventListener('DOMContentLoaded', function(){
    console.log('DOM loaded, loading products...');
    if (typeof loadProducts === 'function') {
        loadProducts();
        console.log('Products loaded successfully');
    } else {
        console.error('loadProducts function not found');
    }
});

// Fallback: Call loadProducts immediately if DOM is already ready
if (document.readyState === 'loading') {
    // DOM still loading
} else {
    // DOM already loaded
    console.log('DOM already ready, loading products immediately...');
    if (typeof loadProducts === 'function') loadProducts();
}

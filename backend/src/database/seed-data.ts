// Стартовое меню ресторана Classic (цены примерные). Используется командой npm run seed.
export const seedMenu = [
  {
    name: "Национальная",
    dishes: [
      {
        name: "Ошский плов",
        price: 380,
        description: "Девзира, баранина, жёлтая морковь, перепелиное яйцо",
        photoUrl: "https://images.unsplash.com/photo-1671048116810-6f885b2b35a5?auto=format&fit=crop&w=400&q=75"
      },
      {
        name: "Бешбармак",
        price: 520,
        description: "Домашняя лапша, конина и баранина, шорпо",
        photoUrl: null
      },
      {
        name: "Казан-кебаб",
        price: 650,
        description: "Молодая баранина с картофелем и луком в казане",
        photoUrl: null
      },
      {
        name: "Манты",
        price: 320,
        description: "Рубленая баранина, курдючный жир, сметана",
        photoUrl: "https://images.unsplash.com/photo-1616895427217-5318221a3e79?auto=format&fit=crop&w=400&q=75"
      },
      {
        name: "Шашлык из баранины",
        price: 280,
        description: "Корейка на углях, маринованный лук",
        photoUrl: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=400&q=75"
      },
      {
        name: "Шашлык ассорти",
        price: 450,
        description: "Баранина, курица, люля-кебаб, овощи на углях",
        photoUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=75"
      },
      {
        name: "Лагман гуйру",
        price: 350,
        description: "Тянутая лапша, говядина, овощи на воке",
        photoUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=400&q=75"
      },
      {
        name: "Самса из тандыра",
        price: 120,
        description: "Слоёное тесто, баранина, кунжут",
        photoUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=75"
      },
      {
        name: "Чучвара",
        price: 300,
        description: "Маленькие пельмени с говядиной, сметана, зелень",
        photoUrl: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=400&q=75"
      },
      {
        name: "Шорпо",
        price: 300,
        description: "Прозрачный бульон на баранине с овощами",
        photoUrl: null
      }
    ]
  },
  {
    name: "Европейская",
    dishes: [
      {
        name: "Стейк рибай",
        price: 1450,
        description: "Мраморная говядина, перечный соус, печёный картофель",
        photoUrl: "https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&w=400&q=75"
      },
      {
        name: "Стейк с картофелем фри",
        price: 780,
        description: "Говяжья вырезка, картофель фри, соус демиглас",
        photoUrl: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=400&q=75"
      },
      {
        name: "Цезарь с курицей",
        price: 420,
        description: "Ромэн, пармезан, гренки, соус по классическому рецепту",
        photoUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=75"
      },
      {
        name: "Салат с овощами гриль",
        price: 340,
        description: "Перец, цукини, руккола, бальзамик",
        photoUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=400&q=75"
      },
      {
        name: "Паста арабьята",
        price: 420,
        description: "Пенне, томатный соус, чили, пармезан",
        photoUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=400&q=75"
      },
      {
        name: "Бургер «Classic»",
        price: 520,
        description: "Говяжья котлета, чеддер, свежие овощи, фирменный соус",
        photoUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=400&q=75"
      },
      {
        name: "Паста с белыми грибами",
        price: 480,
        description: "Тальятелле, сливки, трюфельное масло",
        photoUrl: null
      },
      {
        name: "Лосось в сливочном соусе",
        price: 1200,
        description: "Филе лосося, сливки, лимон, зелень",
        photoUrl: "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=400&q=75"
      },
      {
        name: "Крем-суп из тыквы",
        price: 290,
        description: "Тыквенные семечки, сливки",
        photoUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=400&q=75"
      }
    ]
  },
  {
    name: "Десерты",
    dishes: [
      {
        name: "Торт с малиной",
        price: 290,
        description: "Бисквит, сливочный крем, свежая малина",
        photoUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=400&q=75"
      },
      {
        name: "Тирамису",
        price: 290,
        description: "Маскарпоне, савоярди, эспрессо",
        photoUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=400&q=75"
      },
      {
        name: "Шоколадный торт",
        price: 280,
        description: "Бельгийский шоколад, ганаш",
        photoUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=75"
      },
      {
        name: "Чизкейк с черникой",
        price: 300,
        description: "Сливочный сыр, песочная основа, черника",
        photoUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=400&q=75"
      },
      {
        name: "Панна-котта",
        price: 240,
        description: "Сливочный десерт с клубникой",
        photoUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=75"
      },
      {
        name: "Блинчики с клубникой",
        price: 250,
        description: "Тонкие блины, взбитые сливки, свежие ягоды",
        photoUrl: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=400&q=75"
      },
      {
        name: "Медовик",
        price: 260,
        description: "Тонкие коржи, сметанный крем",
        photoUrl: null
      },
      {
        name: "Чак-чак",
        price: 220,
        description: "Горный мёд, грецкий орех",
        photoUrl: null
      },
      {
        name: "Наполеон",
        price: 270,
        description: "Заварной крем, слоёное тесто",
        photoUrl: null
      },
      {
        name: "Фруктовая тарелка",
        price: 550,
        description: "Сезонные фрукты для компании",
        photoUrl: null
      }
    ]
  },
  {
    name: "Напитки",
    dishes: [
      {
        name: "Капучино",
        price: 180,
        description: "Зерно средней обжарки",
        photoUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=75"
      },
      {
        name: "Холодный чай с лаймом",
        price: 200,
        description: "Чёрный чай, лайм, мята, лёд",
        photoUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=75"
      },
      {
        name: "Американо",
        price: 150,
        description: "Эспрессо и горячая вода",
        photoUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=75"
      },
      {
        name: "Айс-латте",
        price: 220,
        description: "Эспрессо, холодное молоко, лёд",
        photoUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&q=75"
      },
      {
        name: "Зелёный чай в чайнике",
        price: 80,
        description: "Классика к плову",
        photoUrl: null
      },
      {
        name: "Чай с чабрецом",
        price: 150,
        description: "Горные травы, мёд, лимон",
        photoUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=75"
      },
      {
        name: "Компот домашний, 1 л",
        price: 200,
        description: "Сухофрукты и сезонные ягоды",
        photoUrl: null
      },
      {
        name: "Свежевыжатый сок",
        price: 250,
        description: "Апельсин, яблоко или морковь",
        photoUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=400&q=75"
      },
      {
        name: "Лимонад «Classic»",
        price: 220,
        description: "Тархун, лайм, газированная вода",
        photoUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=75"
      },
      {
        name: "Лимонад с мятой",
        price: 200,
        description: "Лимон, свежая мята, лёд",
        photoUrl: "https://images.unsplash.com/photo-1523371054106-bbf80586c38c?auto=format&fit=crop&w=400&q=75"
      }
    ]
  }
];

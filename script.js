// ===== 1. Данные: список знаков зодиака =====
// from/to — дата начала и конца знака в формате [месяц, день]
const signs = [
  { name: "Овен",     symbol: "♈", dates: "21 марта – 19 апреля",     from: [3, 21],  to: [4, 19] },
  { name: "Телец",    symbol: "♉", dates: "20 апреля – 20 мая",       from: [4, 20],  to: [5, 20] },
  { name: "Близнецы", symbol: "♊", dates: "21 мая – 20 июня",         from: [5, 21],  to: [6, 20] },
  { name: "Рак",      symbol: "♋", dates: "21 июня – 22 июля",        from: [6, 21],  to: [7, 22] },
  { name: "Лев",      symbol: "♌", dates: "23 июля – 22 августа",     from: [7, 23],  to: [8, 22] },
  { name: "Дева",     symbol: "♍", dates: "23 августа – 22 сентября", from: [8, 23],  to: [9, 22] },
  { name: "Весы",     symbol: "♎", dates: "23 сентября – 22 октября", from: [9, 23],  to: [10, 22] },
  { name: "Скорпион", symbol: "♏", dates: "23 октября – 21 ноября",   from: [10, 23], to: [11, 21] },
  { name: "Стрелец",  symbol: "♐", dates: "22 ноября – 21 декабря",   from: [11, 22], to: [12, 21] },
  { name: "Козерог",  symbol: "♑", dates: "22 декабря – 19 января",   from: [12, 22], to: [1, 19] },
  { name: "Водолей",  symbol: "♒", dates: "20 января – 18 февраля",   from: [1, 20],  to: [2, 18] },
  { name: "Рыбы",     symbol: "♓", dates: "19 февраля – 20 марта",    from: [2, 19],  to: [3, 20] },
];

// ===== 2. Кусочки, из которых собирается прогноз =====
const openings = [
  "Сегодня звёзды на вашей стороне.",
  "День обещает быть необычным.",
  "Луна советует не торопиться.",
  "Вселенная готовит вам приятный сюрприз.",
  "Сегодня отличный день для новых начинаний.",
  "Планеты выстроились в вашу пользу.",
];

const middles = [
  "Смело беритесь за дело, которое давно откладывали.",
  "Уделите время близким — они это оценят.",
  "Прислушайтесь к интуиции, она не подведёт.",
  "Возможна интересная встреча или важный разговор.",
  "Хорошее время, чтобы научиться чему-то новому.",
  "Не бойтесь попросить о помощи — её охотно окажут.",
];

const endings = [
  "Вечером позвольте себе отдохнуть.",
  "Главное — сохранять хорошее настроение.",
  "Удача любит тех, кто улыбается.",
  "К концу дня всё сложится как надо.",
  "Не забудьте выпить чаю с чем-нибудь вкусным.",
  "Маленький шаг сегодня — большой успех завтра.",
];

const colors = ["синий", "зелёный", "золотой", "фиолетовый", "красный", "белый", "оранжевый"];

// ===== 3. «Случайное» число, одинаковое весь день =====
// Для одного знака в один день прогноз всегда одинаковый,
// а на следующий день — уже другой.
function dailyNumber(signIndex, salt) {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  let x = seed + signIndex * 97 + salt * 31;
  x = (x * 9301 + 49297) % 233280;
  return x;
}

function pick(list, signIndex, salt) {
  return list[dailyNumber(signIndex, salt) % list.length];
}

// ===== 4. Показать прогноз для выбранного знака =====
function showHoroscope(index) {
  const sign = signs[index];

  const text = pick(openings, index, 1) + " " + pick(middles, index, 2) + " " + pick(endings, index, 3);
  const luckyNumber = (dailyNumber(index, 4) % 99) + 1;
  const luckyColor = pick(colors, index, 5);

  document.getElementById("result-symbol").textContent = sign.symbol;
  document.getElementById("result-name").textContent = sign.name;
  document.getElementById("result-dates").textContent = sign.dates;
  document.getElementById("result-text").textContent = text;
  document.getElementById("result-extra").textContent =
    "Счастливое число: " + luckyNumber + " · Цвет дня: " + luckyColor;

  // Подсвечиваем выбранную карточку
  document.querySelectorAll(".sign-card").forEach((card, i) => {
    card.classList.toggle("active", i === index);
  });

  const result = document.getElementById("result");
  result.hidden = false;
  result.scrollIntoView({ behavior: "smooth" });
}

// ===== 5. Узнать знак по дате рождения =====
function findSignIndex(month, day) {
  return signs.findIndex((sign) => {
    const [fromM, fromD] = sign.from;
    const [toM, toD] = sign.to;
    if (fromM === toM) return month === fromM && day >= fromD && day <= toD;
    return (month === fromM && day >= fromD) || (month === toM && day <= toD);
  });
}

document.getElementById("find-btn").addEventListener("click", () => {
  const value = document.getElementById("birthday").value; // например "1998-05-14"
  if (!value) {
    alert("Сначала выберите дату рождения");
    return;
  }
  const [, month, day] = value.split("-").map(Number);
  showHoroscope(findSignIndex(month, day));
});

// ===== 6. Создаём 12 карточек знаков на странице =====
const signsContainer = document.getElementById("signs");

signs.forEach((sign, index) => {
  const card = document.createElement("button");
  card.className = "sign-card";
  card.innerHTML =
    '<span class="symbol">' + sign.symbol + "</span>" +
    '<span class="name">' + sign.name + "</span>" +
    '<span class="dates">' + sign.dates + "</span>";
  card.addEventListener("click", () => showHoroscope(index));
  signsContainer.appendChild(card);
});

// ===== 7. Сегодняшняя дата в шапке =====
document.getElementById("today").textContent = new Date().toLocaleDateString("ru-RU", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

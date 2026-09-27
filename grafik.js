// ===== 1. График двух недель =====
// Чтобы изменить время, поправьте start / end у нужного пункта.
// type: "work" — работа (красная полоска), "sleep" — сон (фиолетовая).
const weeks = [
  {
    name: "Неделя 1 — первая смена",
    summary: "Подъём 3:50 · работа 6:00–15:00 · отбой 20:00",
    items: [
      { start: "03:50", end: "04:00", icon: "⏰", title: "Подъём",
        note: "Сразу включить свет и выпить стакан воды — так проще проснуться." },
      { start: "04:00", end: "04:30", icon: "🚿", title: "Умывание и одевание",
        note: "Одежда и сумка приготовлены с вечера." },
      { start: "04:30", end: "05:00", icon: "🍳", title: "Завтрак",
        note: "Плотный завтрак: до обеда на работе ещё долго." },
      { start: "05:00", end: "06:00", icon: "🚌", title: "Дорога на работу",
        note: "С запасом времени, чтобы не спешить." },
      { start: "06:00", end: "15:00", icon: "🏭", title: "Работа (первая смена)", type: "work",
        note: "Перерыв на обед примерно в 10:00–10:30. Взять с собой перекус и воду." },
      { start: "15:00", end: "16:00", icon: "🚌", title: "Дорога домой" },
      { start: "16:00", end: "16:30", icon: "🍲", title: "Обед",
        note: "Горячий обед дома." },
      { start: "16:30", end: "17:30", icon: "🛋️", title: "Отдых",
        note: "Можно короткий сон 20–30 минут, но не дольше — иначе трудно уснуть вечером." },
      { start: "17:30", end: "19:00", icon: "🌳", title: "Прогулка, дела, хобби",
        note: "Покупки, домашние дела, общение." },
      { start: "19:00", end: "19:30", icon: "🍽️", title: "Лёгкий ужин" },
      { start: "19:30", end: "20:00", icon: "🎒", title: "Подготовка к завтра",
        note: "Одежда, еда на работу, будильник. Без телефона в кровати." },
      { start: "20:00", end: "03:50", icon: "🌙", title: "Сон", type: "sleep",
        note: "Около 8 часов сна. Шторы плотно закрыты, в комнате тихо." },
    ],
    tips: [
      "Ложитесь в 20:00 даже если не очень хочется спать — иначе подъём в 3:50 будет тяжёлым.",
      "Утром сразу яркий свет, вечером — приглушённый.",
      "Кофе и крепкий чай — только до обеда.",
    ],
  },
  {
    name: "Неделя 2 — вторая смена",
    summary: "Подъём 11:00 · работа 15:00–00:00 · отбой 1:30",
    items: [
      { start: "11:00", end: "11:30", icon: "⏰", title: "Подъём и умывание",
        note: "Открыть шторы — дневной свет помогает проснуться." },
      { start: "11:30", end: "12:00", icon: "🍳", title: "Завтрак" },
      { start: "12:00", end: "13:00", icon: "🌳", title: "Прогулка или спорт",
        note: "Единственное время дня при свете — лучше провести его на улице." },
      { start: "13:00", end: "13:30", icon: "🏠", title: "Дела и покупки" },
      { start: "13:30", end: "14:00", icon: "🍲", title: "Обед",
        note: "Сытно: следующая еда будет только в перерыв." },
      { start: "14:00", end: "15:00", icon: "🚌", title: "Дорога на работу" },
      { start: "15:00", end: "00:00", icon: "🏭", title: "Работа (вторая смена)", type: "work",
        note: "Перерыв на ужин примерно в 19:00–19:30. Взять с собой еду и воду." },
      { start: "00:00", end: "01:00", icon: "🚌", title: "Дорога домой",
        note: "Заранее узнайте, как добраться ночью: транспорт, такси, попутчики." },
      { start: "01:00", end: "01:30", icon: "🚿", title: "Душ и лёгкий перекус",
        note: "Без плотной еды и без экранов — чтобы быстро уснуть." },
      { start: "01:30", end: "11:00", icon: "🌙", title: "Сон", type: "sleep",
        note: "Плотные шторы или маска для сна — утром будет светло." },
    ],
    tips: [
      "Переход с первой смены на вторую: в выходные ложитесь и вставайте на 2–3 часа позже.",
      "Утром не ставьте встреч и звонков раньше 11:00 — это ваше время сна.",
      "После смены не садитесь за телефон и сериалы — сон и так начинается поздно.",
    ],
  },
];

// ===== 2. Время =====
function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function formatTime(time) {
  // "03:50" → "3:50", "00:00" → "0:00"
  return time.replace(/^0(\d)/, "$1");
}

// Идёт ли дело сейчас. Учитывает дела через полночь (например, сон 20:00–3:50).
function isNow(item) {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const start = toMinutes(item.start);
  let end = toMinutes(item.end);
  if (end === 0) end = 24 * 60;
  if (start < end) return minutes >= start && minutes < end;
  return minutes >= start || minutes < end;
}

// ===== 3. Показ выбранной недели =====
let currentWeek = 0;

function showWeek(index) {
  currentWeek = index;
  const week = weeks[index];

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.setAttribute("aria-selected", Number(tab.dataset.week) === index);
  });

  document.getElementById("summary").textContent = week.summary;

  const scheduleEl = document.getElementById("schedule");
  scheduleEl.innerHTML = "";

  week.items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "item" + (item.type ? " " + item.type : "");
    if (isNow(item)) li.classList.add("now");

    li.innerHTML =
      '<span class="icon" aria-hidden="true">' + item.icon + '</span>' +
      '<span>' +
        '<span class="time">' + formatTime(item.start) + ' – ' + formatTime(item.end) +
          (isNow(item) ? '<span class="now-badge">сейчас</span>' : '') +
        '</span>' +
        '<span class="title">' + item.title + '</span>' +
        (item.note ? '<span class="note">' + item.note + '</span>' : '') +
      '</span>';

    scheduleEl.appendChild(li);
  });

  document.getElementById("tips-title").textContent = "Советы: " + week.name.toLowerCase();
  const tipsEl = document.getElementById("tips");
  tipsEl.innerHTML = "";
  week.tips.forEach((tip) => {
    const li = document.createElement("li");
    li.textContent = tip;
    tipsEl.appendChild(li);
  });

  try { localStorage.setItem("grafik-week", index); } catch (e) {}
}

// ===== 4. Кнопки =====
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => showWeek(Number(tab.dataset.week)));
});

const fontBtn = document.getElementById("font-btn");
fontBtn.addEventListener("click", () => {
  const isBig = document.body.classList.toggle("big-font");
  fontBtn.setAttribute("aria-pressed", isBig);
  try { localStorage.setItem("raspisanie-big-font", isBig); } catch (e) {}
});

try {
  if (localStorage.getItem("raspisanie-big-font") === "true") {
    document.body.classList.add("big-font");
    fontBtn.setAttribute("aria-pressed", "true");
  }
} catch (e) {}

document.getElementById("print-btn").addEventListener("click", () => window.print());

// ===== 5. Запуск =====
document.getElementById("today").textContent = new Date().toLocaleDateString("ru-RU", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

// Открываем ту неделю, которую смотрели в прошлый раз
let savedWeek = 0;
try { savedWeek = Number(localStorage.getItem("grafik-week")) || 0; } catch (e) {}
showWeek(savedWeek);

setInterval(() => showWeek(currentWeek), 60 * 1000); // обновляем подсветку «сейчас»

// ===== 1. Распорядок дня =====
// Чтобы изменить расписание, поменяйте время, текст или добавьте свой пункт.
// start и end — начало и конец дела (нужны, чтобы подсветить текущее дело).
const plan = [
  { start: "07:00", end: "07:20", icon: "🌅", title: "Спокойный подъём",
    note: "Без спешки. Лёгкая разминка рук и плеч прямо в постели." },
  { start: "07:20", end: "08:00", icon: "🚿", title: "Умывание и одевание",
    note: "Закладываем побольше времени. Удобна одежда на липучках и молниях." },
  { start: "08:00", end: "08:30", icon: "🍳", title: "Завтрак",
    note: "Сытный завтрак и стакан воды." },
  { start: "08:30", end: "09:00", icon: "💊", title: "Лекарства и самочувствие",
    note: "Приём назначенных лекарств. Отметить, как себя чувствуете." },
  { start: "09:00", end: "11:00", icon: "💻", title: "Работа, учёба или дела",
    note: "Каждые 20–30 минут меняйте положение тела. Короткий перерыв каждый час." },
  { start: "11:00", end: "11:30", icon: "🍎", title: "Перекус и вода",
    note: "Фрукты, орехи, вода." },
  { start: "11:30", end: "12:30", icon: "🏋️", title: "ЛФК и упражнения",
    note: "Упражнения, которые подобрал реабилитолог. Без боли и перегрузки." },
  { start: "12:30", end: "13:00", icon: "🧘", title: "Отдых после занятий",
    note: "Восстановить дыхание, выпить воды." },
  { start: "13:00", end: "14:00", icon: "🍲", title: "Обед",
    note: "Горячий обед без спешки." },
  { start: "14:00", end: "15:00", icon: "🛏️", title: "Отдых лёжа",
    note: "Даёт отдых спине и коже после долгого сидения." },
  { start: "15:00", end: "16:30", icon: "🌳", title: "Прогулка или выход из дома",
    note: "Заранее проверить погоду, маршрут, пандусы и лифты." },
  { start: "16:30", end: "18:00", icon: "🎨", title: "Хобби и общение",
    note: "Любимое занятие, звонок друзьям или близким." },
  { start: "18:00", end: "19:00", icon: "🏠", title: "Посильные домашние дела",
    note: "Только то, что удобно. Можно попросить о помощи." },
  { start: "19:00", end: "20:00", icon: "🍽️", title: "Ужин",
    note: "Лёгкий ужин." },
  { start: "20:00", end: "21:00", icon: "🔋", title: "Подготовка к завтра",
    note: "Осмотреть кожу (нет ли покраснений). Поставить коляску на зарядку. Приготовить вещи." },
  { start: "21:00", end: "22:00", icon: "📖", title: "Спокойный вечер",
    note: "Книга, фильм, музыка. Меньше экранов перед сном." },
  { start: "22:00", end: "23:59", icon: "🌙", title: "Сон",
    note: "Удобное положение. Менять позу ночью — по совету врача." },
];

// ===== 2. Сохранение отметок в браузере =====
// Отметки хранятся отдельно для каждого дня. Если браузер не даёт
// ничего сохранять, страница всё равно работает, просто без памяти.
const todayKey = "raspisanie-" + new Date().toISOString().slice(0, 10);

function loadDone() {
  try {
    return JSON.parse(localStorage.getItem(todayKey)) || [];
  } catch (e) {
    return [];
  }
}

function saveDone(list) {
  try {
    localStorage.setItem(todayKey, JSON.stringify(list));
  } catch (e) {
    // Сохранить не получилось — ничего страшного
  }
}

let done = loadDone();

// ===== 3. Рисуем список дел =====
const scheduleEl = document.getElementById("schedule");

plan.forEach((item, index) => {
  const li = document.createElement("li");
  li.className = "item";

  li.innerHTML =
    '<label>' +
      '<input type="checkbox">' +
      '<span class="icon" aria-hidden="true">' + item.icon + '</span>' +
      '<span>' +
        '<span class="time">' + item.start + ' – ' + item.end + '</span>' +
        '<span class="title">' + item.title + '</span>' +
        '<span class="note">' + item.note + '</span>' +
      '</span>' +
    '</label>';

  const checkbox = li.querySelector("input");
  checkbox.checked = done.includes(index);
  li.classList.toggle("done", checkbox.checked);

  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      done.push(index);
    } else {
      done = done.filter((i) => i !== index);
    }
    li.classList.toggle("done", checkbox.checked);
    saveDone(done);
    updateProgress();
  });

  scheduleEl.appendChild(li);
});

// ===== 4. Сколько дел выполнено =====
function updateProgress() {
  document.getElementById("progress").textContent =
    "Выполнено: " + done.length + " из " + plan.length;
}

// ===== 5. Подсветка дела, которое идёт сейчас =====
function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function highlightNow() {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();

  document.querySelectorAll(".item").forEach((li, index) => {
    const item = plan[index];
    const isNow = minutes >= toMinutes(item.start) && minutes < toMinutes(item.end);
    li.classList.toggle("now", isNow);

    const oldBadge = li.querySelector(".now-badge");
    if (oldBadge) oldBadge.remove();
    if (isNow) {
      const badge = document.createElement("span");
      badge.className = "now-badge";
      badge.textContent = "сейчас";
      li.querySelector(".time").appendChild(badge);
    }
  });
}

// ===== 6. Кнопки =====
const fontBtn = document.getElementById("font-btn");
fontBtn.addEventListener("click", () => {
  const isBig = document.body.classList.toggle("big-font");
  fontBtn.setAttribute("aria-pressed", isBig);
  try { localStorage.setItem("raspisanie-big-font", isBig); } catch (e) {}
});

// Вспоминаем, был ли включён крупный шрифт в прошлый раз
try {
  if (localStorage.getItem("raspisanie-big-font") === "true") {
    document.body.classList.add("big-font");
    fontBtn.setAttribute("aria-pressed", "true");
  }
} catch (e) {}

document.getElementById("reset-btn").addEventListener("click", () => {
  done = [];
  saveDone(done);
  document.querySelectorAll(".item").forEach((li) => {
    li.classList.remove("done");
    li.querySelector("input").checked = false;
  });
  updateProgress();
});

document.getElementById("print-btn").addEventListener("click", () => window.print());

// ===== 7. Запуск =====
document.getElementById("today").textContent = new Date().toLocaleDateString("ru-RU", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

updateProgress();
highlightNow();
setInterval(highlightNow, 60 * 1000); // обновляем подсветку раз в минуту

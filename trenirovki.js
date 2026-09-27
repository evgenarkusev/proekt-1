// ===== 1. Упражнения =====
// name — обычный вариант, easy — более простой и безопасный
// (для новичков и при большом весе). main: true — базовое упражнение.
const ex = {
  squat:    { name: "Приседания со штангой", easy: "Жим ногами в тренажёре", main: true },
  bench:    { name: "Жим штанги лёжа", easy: "Жим гантелей лёжа", main: true },
  deadlift: { name: "Становая тяга", easy: "Гиперэкстензия", main: true },
  row:      { name: "Тяга штанги в наклоне", easy: "Тяга горизонтального блока", main: true },
  pullup:   { name: "Подтягивания", easy: "Тяга верхнего блока к груди" },
  latpull:  { name: "Тяга верхнего блока к груди" },
  ohp:      { name: "Жим гантелей сидя" },
  incline:  { name: "Жим гантелей на наклонной скамье" },
  rdl:      { name: "Румынская тяга с гантелями" },
  lunge:    { name: "Выпады с гантелями", easy: "Разгибание ног в тренажёре" },
  legpress: { name: "Жим ногами в тренажёре" },
  legcurl:  { name: "Сгибание ног в тренажёре" },
  glute:    { name: "Ягодичный мост" },
  dbrow:    { name: "Тяга гантели одной рукой" },
  dips:     { name: "Отжимания на брусьях", easy: "Разгибание рук на блоке" },
  lateral:  { name: "Махи гантелями в стороны" },
  facepull: { name: "Тяга каната к лицу" },
  biceps:   { name: "Подъём гантелей на бицепс" },
  triceps:  { name: "Разгибание рук на блоке" },
  calves:   { name: "Подъём на носки" },
  plank:    { name: "Планка", time: true },
  crunch:   { name: "Скручивания на пресс" },
};

// ===== 2. Типы тренировочных дней =====
const dayTypes = {
  fullA: { title: "Всё тело (А)", focus: "ноги, грудь, спина, плечи", list: ["squat", "bench", "latpull", "rdl", "ohp", "plank"] },
  fullB: { title: "Всё тело (Б)", focus: "ноги, спина, грудь, руки", list: ["lunge", "row", "dips", "glute", "biceps", "crunch"] },
  push:  { title: "Жимовой день", focus: "грудь, плечи, трицепс", list: ["bench", "incline", "ohp", "lateral", "triceps", "dips"] },
  pull:  { title: "Тяговый день", focus: "спина, бицепс", list: ["deadlift", "pullup", "row", "dbrow", "facepull", "biceps"] },
  legs:  { title: "День ног", focus: "ноги, ягодицы, пресс", list: ["squat", "rdl", "legpress", "legcurl", "calves", "plank"] },
  upper: { title: "Верх тела", focus: "грудь, спина, плечи, руки", list: ["bench", "row", "ohp", "latpull", "biceps", "triceps"] },
  lower: { title: "Низ тела", focus: "ноги, ягодицы, пресс", list: ["squat", "rdl", "lunge", "legcurl", "calves", "crunch"] },
};

// Какие дни в какой день недели — в зависимости от числа тренировок
function makeSplit(days, level) {
  if (days === 2) return [["Понедельник", "fullA"], ["Четверг", "fullB"]];
  if (days === 3 && level === "beginner")
    return [["Понедельник", "fullA"], ["Среда", "fullB"], ["Пятница", "fullA"]];
  if (days === 3) return [["Понедельник", "push"], ["Среда", "pull"], ["Пятница", "legs"]];
  if (days === 4)
    return [["Понедельник", "upper"], ["Вторник", "lower"], ["Четверг", "upper"], ["Пятница", "lower"]];
  return [["Понедельник", "push"], ["Вторник", "pull"], ["Среда", "legs"], ["Пятница", "upper"], ["Суббота", "lower"]];
}

// ===== 3. Подходы и повторения под цель =====
const goals = {
  loss:     { name: "похудение", mainSets: 3, mainReps: "10–12", sets: 3, reps: "12–15", rest: "45–60 сек", mainRest: "60–90 сек", cardio: 25, calories: 0.85 },
  mass:     { name: "набор массы", mainSets: 4, mainReps: "6–10",  sets: 3, reps: "8–12",  rest: "60–90 сек", mainRest: "2 мин",     cardio: 10, calories: 1.10 },
  strength: { name: "сила",        mainSets: 5, mainReps: "4–6",   sets: 3, reps: "8–10",  rest: "90 сек",    mainRest: "2–3 мин",   cardio: 0,  calories: 1.05 },
  tone:     { name: "форма",       mainSets: 3, mainReps: "10–12", sets: 2, reps: "12–15", rest: "60 сек",    mainRest: "90 сек",    cardio: 15, calories: 1.00 },
};

// ===== 4. Расчёты =====
function calcBmi(height, weight) {
  const m = height / 100;
  return weight / (m * m);
}

function bmiText(bmi) {
  if (bmi < 18.5) return "ниже нормы";
  if (bmi < 25) return "норма";
  if (bmi < 30) return "выше нормы";
  return "ожирение";
}

// Суточная норма калорий по формуле Миффлина — Сан Жеора
function calcCalories(p) {
  const base = 10 * p.weight + 6.25 * p.height - 5 * p.age + (p.sex === "m" ? 5 : -161);
  const activity = { 2: 1.375, 3: 1.45, 4: 1.55, 5: 1.6 }[p.days];
  return Math.round((base * activity * goals[p.goal].calories) / 50) * 50;
}

// ===== 5. Составление программы =====
function buildProgram(p) {
  const goal = goals[p.goal];
  const bmi = calcBmi(p.height, p.weight);
  // Простые варианты упражнений: новичкам, при ИМТ от 30 и после 55 лет
  const useEasy = p.level === "beginner" || bmi >= 30 || p.age >= 55;
  // Новичкам — 5 упражнений за тренировку и на 1 подход меньше
  const count = p.level === "beginner" ? 5 : 6;
  const setsMinus = p.level === "beginner" ? 1 : 0;

  return makeSplit(p.days, p.level).map(([dayName, typeKey]) => {
    const type = dayTypes[typeKey];
    const exercises = type.list.slice(0, count).map((key) => {
      const e = ex[key];
      const name = useEasy && e.easy ? e.easy : e.name;
      const isMain = e.main && !(useEasy && e.easy);
      let sets = (isMain ? goal.mainSets : goal.sets) - setsMinus;
      if (sets < 2) sets = 2;
      let reps = isMain ? goal.mainReps : goal.reps;
      if (e.time) reps = p.level === "beginner" ? "20–30 сек" : "40–60 сек";
      return { name, sets, reps, rest: isMain ? goal.mainRest : goal.rest, isMain, isTime: !!e.time };
    });
    return { dayName, title: type.title, focus: type.focus, exercises };
  });
}

// ===== 6. Вывод на страницу =====
let lastParams = null; // последняя составленная программа — нужна, чтобы перерисовать её после входа

function render(p) {
  lastParams = p;
  const user = getUser();
  const lastW = user ? lastWeights(user) : {};
  const today = todayStr();

  const goal = goals[p.goal];
  const bmi = calcBmi(p.height, p.weight);
  // Белок: 1,6–2 г на кг. При большом весе считаем от веса при ИМТ 25
  const proteinWeight = bmi > 27 ? 25 * (p.height / 100) ** 2 : p.weight;
  const protein = Math.round(proteinWeight * (p.goal === "loss" || p.goal === "mass" ? 1.8 : 1.6));
  const water = (p.weight * 0.033).toFixed(1);

  document.getElementById("stats").innerHTML =
    stat(bmi.toFixed(1), "Индекс массы тела — " + bmiText(bmi)) +
    stat(calcCalories(p), "ккал в день (цель: " + goal.name + ")") +
    stat(protein + " г", "белка в день") +
    stat(water + " л", "воды в день");

  const cardioType = bmi >= 30
    ? "велотренажёр, эллипс или быстрая ходьба в горку (без бега и прыжков)"
    : "беговая дорожка, велотренажёр или эллипс";

  document.getElementById("program").innerHTML = buildProgram(p).map((day, dayIndex) => {
    const fullTitle = day.dayName + " — " + day.title;
    const doneToday = user && user.log.some((x) => x.date === today && x.title === fullTitle);

    return '<article class="card day' + (doneToday ? " done-today" : "") + '" data-title="' + fullTitle + '">' +
      "<h2>" + fullTitle + "</h2>" +
      '<p class="focus">Работаем: ' + day.focus + "</p>" +
      '<p class="extra">🔥 Разминка: ' + (p.age >= 50 ? "10–15" : "5–10") +
        " мин лёгкого кардио + суставная гимнастика</p>" +
      '<div class="table-wrap"><table>' +
        "<tr><th>Упражнение</th><th>Подходы × повторы</th><th>Отдых</th>" +
          (user ? "<th>Вес, кг</th>" : "") + "</tr>" +
        day.exercises.map((e) =>
          "<tr>" +
            '<td class="' + (e.isMain ? "main-ex" : "") + '">' + e.name + "</td>" +
            '<td class="num">' + e.sets + " × " + e.reps + "</td>" +
            '<td class="num">' + e.rest + "</td>" +
            // Поле веса: сразу подставлен вес с прошлой тренировки
            (user
              ? "<td>" + (e.isTime ? "—" :
                  '<input type="number" class="w-input" min="0" max="500" step="0.5"' +
                  ' data-ex="' + e.name + '" aria-label="Вес: ' + e.name + '"' +
                  ' value="' + (lastW[e.name] !== undefined ? lastW[e.name] : "") + '">') + "</td>"
              : "") +
          "</tr>"
        ).join("") +
      "</table></div>" +
      (goal.cardio
        ? '<p class="extra">🚴 В конце: ' + goal.cardio + " мин кардио — " + cardioType + "</p>"
        : "") +
      (user
        ? '<p><button type="button" class="done-btn small-btn">' +
            (doneToday ? "✅ Выполнено сегодня — обновить веса" : "✅ Тренировка выполнена") +
          '</button><span class="saved-msg" aria-live="polite"></span></p>'
        : '<p class="hint">Войдите, чтобы записывать рабочие веса и отмечать тренировки.</p>') +
    "</article>";
  }).join("");

  document.getElementById("notes").innerHTML =
    "<h2>Как заниматься</h2><ul>" +
    tips(p, bmi).map((t) => "<li>" + t + "</li>").join("") +
    "</ul>";

  document.getElementById("result").hidden = false;
  document.getElementById("result").scrollIntoView({ behavior: "smooth" });
}

function stat(value, label) {
  return '<div><span class="stat-value">' + value + '</span><span class="stat-label">' + label + "</span></div>";
}

// Советы, которые зависят от данных человека
function tips(p, bmi) {
  const list = [
    "Жирным выделены базовые упражнения — их делайте первыми, пока есть силы.",
    "Вес подбирайте так, чтобы последние 1–2 повтора давались тяжело, но техника не ломалась.",
    "Когда все подходы выполняются легко — добавьте 2,5–5% веса.",
  ];
  if (p.level === "beginner")
    list.push("Первые 2 недели берите лёгкие веса и учите технику. Хорошо, если её покажет тренер зала.");
  if (bmi >= 30)
    list.push("Бег и прыжки пока заменены на щадящее кардио — так меньше нагрузка на колени и спину.");
  if (bmi < 18.5)
    list.push("Вес ниже нормы: кардио держите минимальным, питайтесь с небольшим профицитом калорий.");
  if (p.age >= 50)
    list.push("После 50 лет разминка длиннее, а тяжёлые упражнения заменены на более безопасные.");
  if (p.goal === "loss")
    list.push("Для похудения главное — питание: держитесь указанной нормы калорий.");
  if (p.goal === "mass")
    list.push("Для набора массы спите не меньше 7–8 часов и не пропускайте приёмы пищи.");
  list.push("Между тренировками одной группы мышц — минимум 48 часов отдыха.");
  return list;
}

// ===== 7. Анкета =====
const fields = ["height", "weight", "age", "sex", "goal", "level", "days"];

document.getElementById("form").addEventListener("submit", (event) => {
  event.preventDefault(); // не перезагружать страницу

  const p = {
    height: Number(document.getElementById("height").value),
    weight: Number(document.getElementById("weight").value),
    age: Number(document.getElementById("age").value),
    sex: document.getElementById("sex").value,
    goal: document.getElementById("goal").value,
    level: document.getElementById("level").value,
    days: Number(document.getElementById("days").value),
  };

  const error = document.getElementById("error");
  if (p.height < 120 || p.height > 230) return (error.textContent = "Проверьте рост: от 120 до 230 см");
  if (p.weight < 30 || p.weight > 250) return (error.textContent = "Проверьте вес: от 30 до 250 кг");
  if (p.age < 14 || p.age > 90) return (error.textContent = "Проверьте возраст: от 14 до 90 лет");
  error.textContent = "";

  // Запоминаем анкету: вошедшему — в аккаунт, гостю — просто в браузер
  if (currentUser) {
    updateUser((u) => (u.form = p));
  } else {
    try { localStorage.setItem("trenirovki-form", JSON.stringify(p)); } catch (e) {}
  }

  render(p);
});

function fillForm(p) {
  fields.forEach((f) => (document.getElementById(f).value = p[f]));
}

document.getElementById("print-btn").addEventListener("click", () => window.print());

// ===== 8. Аккаунты (учебные, хранятся в браузере) =====
const USERS_KEY = "trenirovki-users";
const SESSION_KEY = "trenirovki-session";
let currentUser = null; // логин вошедшего человека или null

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  } catch (e) {
    return false;
  }
}

function getUser() {
  return currentUser ? loadUsers()[currentUser] || null : null;
}

// Изменить данные вошедшего человека и сразу сохранить
function updateUser(change) {
  const users = loadUsers();
  change(users[currentUser]);
  saveUsers(users);
}

// Пароль храним не как есть, а в виде «отпечатка» (хэша) с солью
async function hashPassword(password, salt) {
  const text = salt + ":" + password;
  if (window.crypto && crypto.subtle) {
    const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(bytes)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  // Запасной простой вариант, если браузер не умеет SHA-256
  let h = 5381;
  for (const ch of text) h = ((h * 33) ^ ch.charCodeAt(0)) >>> 0;
  return "s" + h.toString(16);
}

// ----- Окно входа / регистрации -----
let authMode = "login"; // "login" или "register"

function openAuth(mode) {
  authMode = mode;
  const isRegister = mode === "register";
  document.getElementById("auth-title").textContent = isRegister ? "Регистрация" : "Вход";
  document.getElementById("auth-submit").textContent = isRegister ? "Зарегистрироваться" : "Войти";
  document.getElementById("auth-switch").textContent = isRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Регистрация";
  document.getElementById("auth-pass2-wrap").hidden = !isRegister;
  document.getElementById("auth-pass2").required = isRegister;
  document.getElementById("auth-pass").autocomplete = isRegister ? "new-password" : "current-password";
  document.getElementById("auth-error").textContent = "";
  document.getElementById("auth-card").hidden = false;
  document.getElementById("auth-login").focus();
}

function closeAuth() {
  document.getElementById("auth-form").reset();
  document.getElementById("auth-card").hidden = true;
}

document.getElementById("auth-switch").addEventListener("click", () =>
  openAuth(authMode === "login" ? "register" : "login"));
document.getElementById("auth-close").addEventListener("click", closeAuth);

document.getElementById("auth-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const error = document.getElementById("auth-error");
  const login = document.getElementById("auth-login").value.trim().toLowerCase();
  const pass = document.getElementById("auth-pass").value;
  const users = loadUsers();

  if (authMode === "register") {
    if (!/^[a-zа-яё0-9_.-]{3,20}$/i.test(login))
      return (error.textContent = "Логин: от 3 до 20 букв или цифр, без пробелов");
    if (users[login]) return (error.textContent = "Такой логин уже занят");
    if (pass.length < 6) return (error.textContent = "Пароль должен быть не короче 6 символов");
    if (pass !== document.getElementById("auth-pass2").value)
      return (error.textContent = "Пароли не совпадают");

    const salt = Math.random().toString(36).slice(2);
    // Если человек уже составил программу как гость — сохраняем её в новый аккаунт
    users[login] = { salt, hash: await hashPassword(pass, salt), form: lastParams, log: [] };
    if (!saveUsers(users)) return (error.textContent = "Браузер не разрешает сохранять данные");
  } else {
    const user = users[login];
    if (!user || (await hashPassword(pass, user.salt)) !== user.hash)
      return (error.textContent = "Неверный логин или пароль");
  }

  closeAuth();
  logIn(login);
});

// ----- Вход и выход -----
function logIn(login) {
  currentUser = login;
  try { localStorage.setItem(SESSION_KEY, login); } catch (e) {}

  const user = getUser();
  renderAuthBar();
  renderProgress();
  if (user.form) {
    fillForm(user.form);
    render(user.form);
  } else if (lastParams) {
    render(lastParams);
  }
}

function logOut() {
  currentUser = null;
  try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
  renderAuthBar();
  renderProgress();
  if (lastParams) render(lastParams); // убираем поля весов
}

function renderAuthBar() {
  const bar = document.getElementById("auth-bar");
  bar.innerHTML = "";

  if (currentUser) {
    const name = document.createElement("span");
    name.textContent = "👤 " + currentUser; // textContent — логин не сможет «сломать» страницу
    bar.appendChild(name);
    bar.appendChild(makeButton("Выйти", "ghost", logOut));
  } else {
    const text = document.createElement("span");
    text.textContent = "Войдите, чтобы сохранять программу и прогресс";
    bar.appendChild(text);
    bar.appendChild(makeButton("Вход", "ghost", () => openAuth("login")));
    bar.appendChild(makeButton("Регистрация", "", () => openAuth("register")));
  }
}

function makeButton(text, className, onClick) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = text;
  btn.className = className;
  btn.addEventListener("click", onClick);
  return btn;
}

// ===== 9. Отслеживание тренировок и весов =====
function todayStr() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

function formatDate(str) {
  return new Date(str + "T00:00").toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
}

// Записи по порядку дат
function sortedLog(user) {
  return user.log.slice().sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

// Последний записанный вес по каждому упражнению
function lastWeights(user) {
  const result = {};
  sortedLog(user).forEach((entry) => Object.assign(result, entry.weights));
  return result;
}

// Кнопка «Тренировка выполнена» в любой карточке дня
document.getElementById("program").addEventListener("click", (event) => {
  const btn = event.target.closest(".done-btn");
  if (!btn || !currentUser) return;

  const card = btn.closest(".day");
  const weights = {};
  card.querySelectorAll(".w-input").forEach((input) => {
    const value = parseFloat(input.value);
    if (value > 0) weights[input.dataset.ex] = value;
  });

  const entry = { date: todayStr(), title: card.dataset.title, weights };
  updateUser((u) => {
    // Если эту тренировку уже отмечали сегодня — заменяем запись
    u.log = u.log.filter((x) => !(x.date === entry.date && x.title === entry.title));
    u.log.push(entry);
  });

  card.classList.add("done-today");
  btn.textContent = "✅ Выполнено сегодня — обновить веса";
  btn.nextElementSibling.textContent = "Сохранено!";
  renderProgress();
});

// Блок «Мой прогресс»
function renderProgress() {
  const section = document.getElementById("progress");
  const user = getUser();
  if (!user) {
    section.hidden = true;
    return;
  }
  section.hidden = false;

  if (!user.log.length) {
    section.innerHTML = "<h2>📈 Мой прогресс</h2>" +
      "<p>Пока нет записей. Составьте программу, впишите рабочие веса и нажмите «Тренировка выполнена».</p>";
    return;
  }

  const log = sortedLog(user);
  const now = new Date();
  const lastMonth = log.filter((x) => (now - new Date(x.date + "T00:00")) / 86400000 < 30).length;

  // Первый и последний вес по каждому упражнению
  const first = {};
  const last = {};
  log.forEach((entry) => {
    Object.entries(entry.weights).forEach(([name, w]) => {
      if (!(name in first)) first[name] = w;
      last[name] = w;
    });
  });

  const growthRows = Object.keys(last).map((name) => {
    const diff = Math.round((last[name] - first[name]) * 10) / 10;
    const diffText = diff > 0
      ? '<span class="up">+' + diff + " кг</span>"
      : diff < 0 ? '<span class="down">' + diff + " кг</span>" : "без изменений";
    return "<tr><td>" + name + '</td><td class="num">' + first[name] + " → " + last[name] +
      ' кг</td><td class="num">' + diffText + "</td></tr>";
  }).join("");

  const history = log.slice(-10).reverse().map((entry) => {
    const list = Object.entries(entry.weights).map(([name, w]) => name + " " + w + " кг").join(", ");
    return "<li><b>" + formatDate(entry.date) + "</b> — " + entry.title +
      (list ? '<br><span class="hint">' + list + "</span>" : "") + "</li>";
  }).join("");

  section.innerHTML =
    "<h2>📈 Мой прогресс</h2>" +
    '<div class="stats">' +
      stat(log.length, "всего тренировок") +
      stat(lastMonth, "за последние 30 дней") +
      stat(formatDate(log[log.length - 1].date), "последняя тренировка") +
    "</div>" +
    (growthRows
      ? '<h3>Рабочие веса</h3><div class="table-wrap"><table>' +
        "<tr><th>Упражнение</th><th>Было → стало</th><th>Рост</th></tr>" + growthRows +
        "</table></div>"
      : "") +
    '<h3>Последние тренировки</h3><ol class="history">' + history + "</ol>" +
    '<button type="button" class="ghost small-btn" id="undo-btn">Удалить последнюю запись</button>';

  document.getElementById("undo-btn").addEventListener("click", () => {
    if (!confirm("Удалить последнюю запись о тренировке?")) return;
    const lastEntry = sortedLog(getUser()).pop();
    updateUser((u) => {
      u.log = u.log.filter((x) => !(x.date === lastEntry.date && x.title === lastEntry.title));
    });
    renderProgress();
    if (lastParams) render(lastParams);
  });
}

// ===== 10. Запуск страницы =====
let savedLogin = null;
try { savedLogin = localStorage.getItem(SESSION_KEY); } catch (e) {}

if (savedLogin && loadUsers()[savedLogin]) {
  logIn(savedLogin); // человек не выходил в прошлый раз — входим автоматически
} else {
  renderAuthBar();
  // Гостю подставляем прошлые ответы анкеты
  try {
    const saved = JSON.parse(localStorage.getItem("trenirovki-form"));
    if (saved) fillForm(saved);
  } catch (e) {}
}

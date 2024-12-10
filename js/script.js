const svgNS = "http://www.w3.org/2000/svg";
const containerWidth = 1200; // Можно оставить, чтобы использовать для расчета
const containerHeight = 300;

// Список призов
const prizes = [
    "img/prise_01.png",
    "img/prise_02.png",
    "img/prise_03.png",
    "img/prise_04.png",
    "img/prise_05.png",
    "img/prise_06.png",
    "img/prise_07.png",
    "img/prise_08.png"
];

// Сообщения для каждого приза
function getPrizeMessage(index) {
    const rootStyles = getComputedStyle(document.documentElement);
    return rootStyles.getPropertyValue(`--prize-message-${index + 1}`).trim();
}

const svg = document.createElementNS(svgNS, "svg");
svg.setAttribute("width", prizes.length * containerWidth);
svg.setAttribute("height", containerHeight);
document.getElementById("roulette-container").appendChild(svg);

const prizeWidth = containerWidth / 3; // Ширина одной ячейки
const prizeElements = [];

// Бесконечный ряд призов
for (let i = 0; i < prizes.length * 3; i++) {
    const prizeIndex = i % prizes.length;

    const image = document.createElementNS(svgNS, "image");
    image.setAttribute("href", prizes[prizeIndex]);
    image.setAttribute("x", i * prizeWidth);
    image.setAttribute("y", 0);
    image.setAttribute("width", prizeWidth);
    image.setAttribute("height", containerHeight);

    const group = document.createElementNS(svgNS, "g");
    group.appendChild(image);
    svg.appendChild(group);
    prizeElements.push(group);
}

function calculateWinner() {
    return Math.floor(Math.random() * prizes.length);
}

function spinRoulette() {
    cancelAnimationFrame(autoSpinId); // Остановить автоспин

    const winnerIndex = calculateWinner();

    const randomOffset = Math.random() * (prizeWidth / 2) - (prizeWidth / 4);
    const winnerPosition = (prizes.length + winnerIndex) * prizeWidth + randomOffset;

    const offsetFromCenter = (containerWidth / 2) - (prizeWidth / 2);
    const translateX = winnerPosition - offsetFromCenter;

    svg.style.transition = "transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)";
    svg.style.transform = `translateX(-${translateX}px)`;

    setTimeout(() => {
        prizeElements.forEach(el => el.classList.remove('highlight'));

        const winningElement = prizeElements[(prizes.length + winnerIndex) % prizes.length];
        winningElement.classList.add('highlight');

        const message = getPrizeMessage(winnerIndex);
        alert(message); // Отобразить сообщение
    }, 4000);
}

document.getElementById("spin-button").addEventListener("click", () => {
    svg.style.transition = "none";
    svg.style.transform = "translateX(0)";

    setTimeout(spinRoulette, 100);
});

// Установка текущей даты в подвале
document.getElementById("current-date").textContent = new Date().toLocaleDateString();

// Настройка вращения рулетки
const spinSpeed = 0.35; // Скорость вращения (пикселей за кадр)
let offset = 0; // Начальный оффсет для автоспина
let autoSpinId; // Идентификатор анимации автоспина

// Функция для медленного вращения рулетки
function autoSpin() {
    offset += spinSpeed; // Увеличиваем смещение
    svg.style.transform = `translateX(-${offset}px)`; // Сдвигаем SVG влево
    autoSpinId = requestAnimationFrame(autoSpin); // Постоянное вращение
}

// Запуск автоспина при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    autoSpin();
});

// Функция для остановки автоспина перед запуском пользовательского вращения
function stopAutoSpin() {
    cancelAnimationFrame(autoSpinId); // Останавливаем автоспин
}
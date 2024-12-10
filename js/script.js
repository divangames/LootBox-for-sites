const svgNS = "http://www.w3.org/2000/svg";
const containerWidth = 1200; // Ширина контейнера
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

// Шансы на выпадение (настраиваемые веса)
const prizeWeights = [10, 20, 5, 15, 10, 5, 25, 10]; // Вес для каждого приза

// Список распределенных карточек
const distributedPrizes = [];

// Функция для получения сообщения для каждого приза
function getPrizeMessage(index) {
    const rootStyles = getComputedStyle(document.documentElement);
    return rootStyles.getPropertyValue(`--prize-message-${index + 1}`).trim();
}

// Создание SVG контейнера
const svg = document.createElementNS(svgNS, "svg");
svg.setAttribute("width", prizes.length * containerWidth);
svg.setAttribute("height", containerHeight);
document.getElementById("roulette-container").appendChild(svg);

const prizeWidth = containerWidth / 3; // Ширина одной ячейки
const prizeElements = [];

// Создание бесконечного ряда призов
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

// Функция для расчета выигрыша
function calculateWinner() {
    const totalWeight = prizeWeights.reduce((sum, weight) => sum + weight, 0);
    const randomValue = Math.random() * totalWeight;

    let cumulativeWeight = 0;
    for (let i = 0; i < prizeWeights.length; i++) {
        cumulativeWeight += prizeWeights[i];
        if (randomValue <= cumulativeWeight) {
            return i;
        }
    }
}

// Параметры для вращения рулетки
const spinDuration = 6; // Время прокрутки в секундах
let offset = 0; // Начальный оффсет для автоспина
let autoSpinId; // Идентификатор анимации автоспина

// Функция для запуска вращения рулетки
function spinRoulette() {
    stopAutoSpin(); // Остановить автоспин
    console.log("Spinning roulette...");
    const winnerIndex = calculateWinner();
    const randomOffset = Math.random() * (prizeWidth / 2) - (prizeWidth / 4);
    const winnerPosition = (prizes.length + winnerIndex) * prizeWidth + randomOffset;
    const offsetFromCenter = (containerWidth / 2) - (prizeWidth / 2);
    const translateX = winnerPosition - offsetFromCenter;

    svg.style.transition = `transform ${spinDuration}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
    svg.style.transform = `translateX(-${translateX}px)`;

    setTimeout(() => {
        console.log("Roulette spin completed.");
        prizeElements.forEach(el => el.classList.remove('highlight'));
		
		

        const winningElementIndex = (prizes.length + winnerIndex) % prizeElements.length;
        prizeElements[winningElementIndex].classList.add('highlight');

        // Показ сообщения о выигрыше
        const message = getPrizeMessage(winnerIndex);
        alert(message);
    }, spinDuration * 1000);
	
	        // Обновляем сообщение о выигрыше в элементе
        const winMessageElement = document.getElementById("win-message");
        if (winMessageElement) {
            winMessageElement.textContent = `Вы выиграли: ${message}`;
        }
	
	
}

// Функция для остановки автоспина
function stopAutoSpin() {
    cancelAnimationFrame(autoSpinId);
}

// Функция для бесконечного автоспина
function autoSpin() {
    offset += 0.35; // Увеличиваем смещение
    if (offset >= prizeWidth * prizes.length) {
        offset = 0; // Сбрасываем смещение, чтобы было бесконечное движение
    }
    svg.style.transform = `translateX(-${offset}px)`;
    autoSpinId = requestAnimationFrame(autoSpin); // Запускаем следующий кадр
}

// Запуск автоспина при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    autoSpin();
});

// Обработчик нажатия на кнопку spin
document.getElementById("spin-button").addEventListener("click", () => {
    svg.style.transition = "none";
    svg.style.transform = `translateX(-${offset}px)`; // Устанавливаем текущую позицию
    setTimeout(spinRoulette, 100);
});

// Установка текущей даты в подвале
document.getElementById("current-date").textContent = new Date().toLocaleDateString();

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

        // Показ попапа с сообщением о выигрыше
        const message = getPrizeMessage(winnerIndex);
        const popup = document.getElementById('popup');
        const prizeImage = document.getElementById('prize-image');

        if (prizeImage) {
            prizeImage.src = prizes[winnerIndex]; // Устанавливаем картинку приза
        }

        const winMessageElement = document.getElementById('win-message');
        if (winMessageElement) {
            winMessageElement.textContent = message; // Устанавливаем текст сообщения
        }

        popup.classList.remove('hidden'); // Показываем попап
    }, spinDuration * 1000);
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
document.addEventListener('DOMContentLoaded', function () {
    const popup = document.getElementById('popup');
    const spinButton = document.getElementById('spin-button');

    if (!popup || !spinButton) {
        console.error('Не удалось найти элементы интерфейса.');
        return;
    }

    const savedData = JSON.parse(localStorage.getItem('prizeData'));
    if (savedData) {
        displayResult(savedData);
    } else {
        autoSpin(); // Запуск автоспина, если данных нет
    }
});

// Обработчик нажатия на кнопку spin
document.getElementById("spin-button").addEventListener("click", () => {
    svg.style.transition = "none";
    svg.style.transform = `translateX(-${offset}px)`; // Устанавливаем текущую позицию
    setTimeout(spinRoulette, 100);
});

// ВРЕМЕННЫАЯ КНОПКА СБРОСА ЗАЩИТЫ

document.addEventListener('DOMContentLoaded', () => {
    const spinButton = document.getElementById('spin-button');
    const resetButton = document.getElementById('reset-button');
    const winMessage = document.getElementById('win-message');

    // Проверяем статус защиты из локального хранилища
    const isSpinDisabled = localStorage.getItem('spinDisabled') === 'true';

    if (isSpinDisabled) {
        spinButton.disabled = true;
        spinButton.textContent = 'НЕДОСТУПНО';
        spinButton.style.backgroundColor = '#555'; // Устанавливаем неактивный стиль
        spinButton.style.cursor = 'not-allowed';
        resetButton.classList.remove('hidden'); // Показываем кнопку сброса
    }

    // Обработчик нажатия на кнопку "КРУТИТЬ СПИННЕР"
    spinButton.addEventListener('click', () => {
        spinButton.disabled = true;
        spinButton.textContent = 'НЕДОСТУПНО';
        spinButton.style.backgroundColor = '#555';
        spinButton.style.cursor = 'not-allowed';

        // Показываем сообщение о выигрыше
        winMessage.textContent = 'Поздравляем, вы выиграли!';
        winMessage.style.color = '#fff';

        // Сохраняем состояние в локальное хранилище
        localStorage.setItem('spinDisabled', 'true');

        // Показываем кнопку сброса
        resetButton.classList.remove('hidden');
    });

    // Обработчик нажатия на кнопку "СБРОСИТЬ ЗАЩИТУ"
    resetButton.addEventListener('click', () => {
        // Сбрасываем состояние в локальном хранилище
        localStorage.removeItem('spinDisabled');

        // Снимаем блокировку с кнопки "КРУТИТЬ СПИННЕР"
        spinButton.disabled = false;
        spinButton.textContent = 'КРУТИТЬ СПИННЕР';
        spinButton.style.backgroundColor = '#ff4c4c';
        spinButton.style.cursor = 'pointer';

        // Скрываем кнопку сброса
        resetButton.classList.add('hidden');

        // Очищаем сообщение о выигрыше
        winMessage.textContent = '';
    });
});

// Установка текущей даты в подвале
document.getElementById("current-date").textContent = new Date().toLocaleDateString();

// Автопрокрутка проверка при старте
document.addEventListener('DOMContentLoaded', function () {
    autoSpin();
});

// Поп-апы
document.getElementById('popup-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Предотвращаем отправку формы

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!name || !email) {
        alert('Пожалуйста, заполните обязательные поля: Имя и Email.');
        return;
    }

    const savedPrize = JSON.parse(localStorage.getItem('selectedPrize'));
    const prizeData = {
        name: name,
        phone: phone,
        email: email,
        prizeImage: savedPrize ? savedPrize.prizeImage : ''
    };
    localStorage.setItem('prizeData', JSON.stringify(prizeData));

    // Скрыть попап после отправки
    document.getElementById('popup').classList.add('hidden');

    // Отобразить результат
    displayResult(prizeData);
});

// Обработчик для кнопки закрытия попапа (дополнительно)
document.getElementById('popup-close').addEventListener('click', function () {
    document.getElementById('popup').classList.add('hidden');
});

document.getElementById('popup-close').addEventListener('click', function () {
    const popup = document.getElementById('popup');
    if (popup) {
        popup.classList.add('hidden');
    }
});





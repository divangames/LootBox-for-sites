# Рулетка с призами

![image](https://github.com/user-attachments/assets/a4635118-7794-442f-9eaa-3949ecbcfdc4)


## Описание проекта

Этот проект реализует виртуальную рулетку с изображениями призов, которая позволяет пользователю вращать колесо и получать случайный приз с учетом заданных весов. Это отличное решение для игр, акций или веб-приложений, где требуется случайный выбор из списка вариантов.

## Технологии

- **HTML/CSS/JavaScript** — для структуры и логики работы рулетки.
- **SVG** — для визуализации и отображения элементов на веб-странице.

## Установка и использование

### Шаг 1: Подключение файлов

Убедитесь, что ваши изображения призов находятся в папке `img` и доступны по указанным путям. Подключите основной JavaScript-файл к вашему HTML-документу:

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Рулетка с призами</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="roulette-container"></div>
    <button id="spin-button">Вращать</button>
    <div id="current-date"></div>
    <script src="script.js"></script>
</body>
</html>
```

### Шаг 2: Настройка призов и весов
В коде `JavaScript` необходимо задать пути к изображениям и веса для каждого приза.

```javascript
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
```
## Вес для каждого приза
``` javascript
const prizeWeights = [10, 20, 5, 15, 10, 5, 25, 10];
```
![image](https://github.com/user-attachments/assets/ccbc7fb3-a9fc-457a-b968-3c5392794bc3)

### Шаг 3: Инициализация и запуск рулетки
При загрузке страницы создается SVG-элемент, который заполняется изображениями призов. Вручную можно запустить вращение рулетки, нажав на кнопку с ID spin-button.

``` javascript
document.getElementById("spin-button").addEventListener("click", () => {
    svg.style.transition = "none";
    svg.style.transform = "translateX(0)";

    setTimeout(spinRoulette, 100);
});
```

## Основные функции
### Генерация приза
Функция `calculateWinner()` вычисляет индекс приза с учетом его веса.

``` javascript

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
```

## Вращение рулетки
Функция `spinRoulette()` отвечает за анимацию вращения и подсветку выигравшего приза.

```javascript
function spinRoulette() {
    stopAutoSpin(); // Останавливаем автоспин

    const winnerIndex = calculateWinner();
    const randomOffset = Math.random() * (prizeWidth / 2) - (prizeWidth / 4);
    const winnerPosition = (prizes.length + winnerIndex) * prizeWidth + randomOffset;

    const offsetFromCenter = (containerWidth / 2) - (prizeWidth / 2);
    const translateX = winnerPosition - offsetFromCenter;

    svg.style.transition = `transform ${spinDuration}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
    svg.style.transform = `translateX(-${translateX}px)`;

    setTimeout(() => {
        prizeElements.forEach(el => el.classList.remove('highlight'));
        const winningElementIndex = (prizes.length + winnerIndex) % distributedPrizes.length;
        prizeElements[winningElementIndex].classList.add('highlight');
        const message = getPrizeMessage(winnerIndex);
        alert(message);
    }, spinDuration * 1000);
}
```

## Настройки
`containerWidth` и `containerHeight` — размеры контейнера для рулетки.
`prizeWeights` — массив, где каждый элемент соответствует вероятности выпадения соответствующего приза.
`spinDuration` — время анимации вращения в секундах.
`spinSpeed` — скорость автоспина.

## Заключение
Этот проект представляет собой простую, но гибкую реализацию рулетки, которую можно использовать для создания различных игровых приложений. Настройка весов позволяет изменять вероятность выпадения каждого приза, а анимация и обработка событий обеспечивают плавный и интерактивный пользовательский опыт.

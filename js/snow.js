function createSnowflake() {
    const snowContainer = document.getElementById("snow-container");

    if (!snowContainer) {
        console.error("Snow container not found!");
        return;
    }

    const snowflake = document.createElement("div");
    snowflake.classList.add("snowflake");
    snowflake.textContent = "❄️"; // Эмодзи снежинки

    // Случайное начальное положение по горизонтали
    const startX = Math.random() * window.innerWidth;
    const animationDuration = Math.random() * 3 + 3; // 3–6 секунд
    const size = Math.random() * 20 + 10; // Размер 10–30px

    snowflake.style.left = `${startX}px`;
    snowflake.style.animationDuration = `${animationDuration}s`;
    snowflake.style.fontSize = `${size}px`;

    snowContainer.appendChild(snowflake);

    // Удаляем снежинку после завершения анимации
    setTimeout(() => {
        snowflake.remove();
    }, animationDuration * 1000);
}

// Создание снежинок с интервалом
setInterval(createSnowflake, 200); // Каждые 200 мс создаётся снежинка

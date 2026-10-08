const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();


let user = tg.initDataUnsafe?.user;


if (user) {

    document.getElementById("name").textContent =
        user.first_name || "Игрок";

    document.getElementById("username").textContent =
        user.username
            ? "@" + user.username
            : "Telegram игрок";

    if (user.photo_url) {

        document.getElementById("avatar").innerHTML =
            `<img src="${user.photo_url}"
            style="width:60px;height:60px;border-radius:50%;">`;

    }

}


function openGame(game) {

    const screen =
        document.getElementById("gameScreen");

    const content =
        document.getElementById("gameContent");

    screen.classList.add("active");


    if (game === "rps") {

        content.innerHTML = `
            <div class="game-title">✊ КНБ</div>

            <p>Выбери свой ход</p>

            <button class="choice"
                onclick="playRPS('rock')">
                ✊ Камень
            </button>

            <button class="choice"
                onclick="playRPS('paper')">
                ✋ Бумага
            </button>

            <button class="choice"
                onclick="playRPS('scissors')">
                ✌️ Ножницы
            </button>

            <div id="result"></div>
        `;

    }


    if (game === "dice") {

        content.innerHTML = `
            <div class="game-title">🎲 Кубики</div>

            <p>Брось кубик!</p>

            <button class="choice"
                onclick="rollDice()">
                🎲 Бросить
            </button>

            <div id="result"></div>
        `;

    }


    if (game === "coin") {

        content.innerHTML = `
            <div class="game-title">🪙 Орёл / Решка</div>

            <button class="choice"
                onclick="flipCoin('heads')">
                🦅 Орёл
            </button>

            <button class="choice"
                onclick="flipCoin('tails')">
                🪙 Решка
            </button>

            <div id="result"></div>
        `;

    }


    if (game === "target") {

        content.innerHTML = `
            <div class="game-title">🎯 Цель</div>

            <p>Выбери число</p>

            <button class="choice"
                onclick="target(1)">1</button>

            <button class="choice"
                onclick="target(2)">2</button>

            <button class="choice"
                onclick="target(3)">3</button>

            <button class="choice"
                onclick="target(4)">4</button>

            <button class="choice"
                onclick="target(5)">5</button>

            <div id="result"></div>
        `;

    }

}


function playRPS(player) {

    const choices =
        ["rock", "paper", "scissors"];

    const bot =
        choices[Math.floor(Math.random() * 3)];

    let result;


    if (player === bot) {

        result = "🤝 Ничья!";

    } else if (

        (player === "rock" && bot === "scissors") ||
        (player === "paper" && bot === "rock") ||
        (player === "scissors" && bot === "paper")

    ) {

        result = "🏆 Ты победил!";

    } else {

        result = "💀 Ты проиграл!";

    }


    document.getElementById("result").innerHTML =
        `<h2>${result}</h2>
         <p>Твой ход: ${player}</p>
         <p>Бот: ${bot}</p>`;
}


function rollDice() {

    const player =
        Math.floor(Math.random() * 6) + 1;

    const bot =
        Math.floor(Math.random() * 6) + 1;

    let result;

    if (player > bot) {
        result = "🏆 Победа!";
    } else if (player < bot) {
        result = "💀 Проигрыш!";
    } else {
        result = "🤝 Ничья!";
    }

    document.getElementById("result").innerHTML =
        `<h2>${result}</h2>
         <p>👤 Ты: ${player}</p>
         <p>🤖 Бот: ${bot}</p>`;
}


function flipCoin(player) {

    const result =
        Math.random() < 0.5
            ? "heads"
            : "tails";

    const text =
        player === result
            ? "🏆 Ты угадал!"
            : "💀 Не угадал!";

    document.getElementById("result").innerHTML =
        `<h2>${text}</h2>
         <p>Выпало: ${result}</p>`;
}


function target(player) {

    const result =
        Math.floor(Math.random() * 5) + 1;

    const text =
        player === result
            ? "🔥 ПОПАДАНИЕ!"
            : "❌ Мимо!";

    document.getElementById("result").innerHTML =
        `<h2>${text}</h2>
         <p>Ты выбрал: ${player}</p>
         <p>Цель: ${result}</p>`;
}


function closeGame() {

    document
        .getElementById("gameScreen")
        .classList.remove("active");

}


function friendGame() {

    tg.showAlert(
        "👥 Скоро здесь появится игра с другом!"
    );

}


function showHome() {

    closeGame();

}


function showRating() {

    tg.showAlert(
        "🏆 Рейтинг скоро подключим к базе данных."
    );

}


function showProfile() {

    tg.showAlert(
        "👤 Профиль скоро подключим к твоему Python-боту."
    );

}
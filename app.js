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

    if (game === "uno") {
        startUnoMenu();
        return;
    }

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
    startUnoMenu();
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

// --- UNO: локальная игра против трёх ботов ---
const UNO_COLORS = ["red", "yellow", "green", "blue"];
const UNO_COLOR_NAMES = {red:"красный", yellow:"жёлтый", green:"зелёный", blue:"синий"};
const UNO_EMOJI = {red:"🔴", yellow:"🟡", green:"🟢", blue:"🔵", wild:"🌈"};
let uno = null;
let unoBusy = false;

function startUnoMenu() {
    const screen = document.getElementById("gameScreen");
    const content = document.getElementById("gameContent");
    screen.classList.add("active");
    content.innerHTML = `
      <div class="game-title">🃏 UNO</div>
      <p class="uno-subtitle">Собери комбинацию и избавься от всех карт первым!</p>
      <button class="choice uno-start" onclick="startUno()">🤖 Играть против 3 ботов</button>
      <button class="choice" onclick="unoFriendInfo()">👥 Играть с другом онлайн</button>
      <p class="uno-note">Онлайн-режим потребует сервер для синхронизации ходов. Сейчас доступна полноценная игра против ботов.</p>
    `;
}

function unoFriendInfo() {
    const msg = "Для настоящей игры с другом онлайн нужно подключить сервер, который будет хранить комнату и передавать ходы обоим игрокам. GitHub Pages сам по себе этого не делает.";
    if (tg && typeof tg.showAlert === "function") tg.showAlert(msg);
    else alert(msg);
}

function makeUnoDeck() {
    const deck = [];
    for (const color of UNO_COLORS) {
        deck.push({color, value:"0"});
        for (let n = 1; n <= 9; n++) {
            deck.push({color, value:String(n)}, {color, value:String(n)});
        }
        for (const value of ["skip", "reverse", "+2"]) {
            deck.push({color, value}, {color, value});
        }
    }
    for (let i = 0; i < 4; i++) {
        deck.push({color:"wild", value:"wild"}, {color:"wild", value:"+4"});
    }
    return shuffleUno(deck);
}

function shuffleUno(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function startUno() {
    const deck = makeUnoDeck();
    uno = {
        deck,
        players: [
            {name:"Ты", hand:[], human:true},
            {name:"Бот Алекс", hand:[], human:false},
            {name:"Бот Мия", hand:[], human:false},
            {name:"Бот Макс", hand:[], human:false}
        ],
        discard:[], current:0, direction:1, activeColor:null, finished:false,
        message:"Твой ход! Сыграй карту того же цвета или значения."
    };
    for (let round = 0; round < 7; round++) {
        for (const player of uno.players) player.hand.push(drawUnoCard());
    }
    let first = drawUnoCard();
    while (first.color === "wild" || ["skip", "reverse", "+2"].includes(first.value)) {
        uno.deck.push(first);
        shuffleUno(uno.deck);
        first = drawUnoCard();
    }
    uno.discard.push(first);
    uno.activeColor = first.color;
    unoBusy = false;
    renderUno();
}

function drawUnoCard() {
    if (!uno.deck.length) {
        if (uno.discard.length > 1) {
            const top = uno.discard.pop();
            uno.deck = shuffleUno(uno.discard.splice(0));
            uno.discard = [top];
        } else {
            return {color:UNO_COLORS[Math.floor(Math.random()*4)], value:String(Math.floor(Math.random()*10))};
        }
    }
    return uno.deck.pop();
}

function unoCardLabel(card) {
    return ({skip:"🚫", reverse:"🔄", "+2":"+2", wild:"🌈", "+4":"+4"})[card.value] || card.value;
}

function unoCanPlay(card) {
    const top = uno.discard[uno.discard.length - 1];
    return card.color === "wild" || card.color === uno.activeColor || card.value === top.value;
}

function renderUno() {
    if (!uno) return;
    const content = document.getElementById("gameContent");
    const top = uno.discard[uno.discard.length - 1];
    const currentName = uno.players[uno.current]?.name || "Игрок";
    const opponents = uno.players.slice(1).map((p, i) => `
      <div class="uno-opponent ${uno.current === i+1 ? "is-turn" : ""}">
        <span>${["🤖","👾","🧠"][i]} ${p.name}</span>
        <b>${p.hand.length} 🃏</b>
      </div>`).join("");
    const cards = uno.players[0].hand.map((card, i) => `
      <button class="uno-card-face ${card.color} ${unoCanPlay(card) && uno.current===0 && !uno.finished ? "playable" : "unplayable"}"
        ${uno.current!==0 || uno.finished || !unoCanPlay(card) || unoBusy ? "disabled" : ""}
        onclick="playUnoCard(${i})" aria-label="${card.color} ${card.value}">
        <span class="uno-corner">${unoCardLabel(card)}</span><strong>${unoCardLabel(card)}</strong><span class="uno-corner bottom">${unoCardLabel(card)}</span>
      </button>`).join("");
    content.innerHTML = `
      <div class="uno-header"><div class="game-title">🃏 UNO</div><span class="uno-deck-count">Колода: ${uno.deck.length}</span></div>
      <div class="uno-opponents">${opponents}</div>
      <div class="uno-table">
        <div class="uno-turn">${uno.finished ? "Игра окончена" : (uno.current===0 ? "ТВОЙ ХОД" : `Ход: ${currentName}`)}</div>
        <div class="uno-piles">
          <button class="uno-draw" onclick="drawUnoForPlayer()" ${uno.current!==0 || uno.finished || unoBusy ? "disabled" : ""}>＋<small>Взять карту</small></button>
          <div class="uno-discard-card ${top.color}"><span>${unoCardLabel(top)}</span></div>
        </div>
        <div class="uno-active-color">Активный цвет: ${UNO_EMOJI[uno.activeColor]} ${UNO_COLOR_NAMES[uno.activeColor]}</div>
      </div>
      <p class="uno-message">${uno.message}</p>
      ${uno.finished ? `<button class="choice uno-start" onclick="startUno()">🔁 Играть ещё раз</button>` : ""}
      <div class="uno-hand-title">Твои карты (${uno.players[0].hand.length})</div>
      <div class="uno-hand">${cards || ""}</div>
      ${uno.players[0].hand.length===1 && !uno.finished ? `<button class="uno-call" onclick="callUno()">📣 UNO!</button>` : ""}
    `;
}

function playUnoCard(index) {
    if (!uno || uno.finished || uno.current !== 0 || unoBusy) return;
    const card = uno.players[0].hand[index];
    if (!card || !unoCanPlay(card)) return;
    if (card.color === "wild") {
        showUnoColorPicker(index);
        return;
    }
    applyUnoPlay(0, index, card.color);
}

function showUnoColorPicker(index) {
    const content = document.getElementById("gameContent");
    content.insertAdjacentHTML("beforeend", `
      <div class="uno-color-modal" id="unoColorModal">
        <div class="uno-color-box"><h3>Выбери цвет</h3>
          ${UNO_COLORS.map(c => `<button class="uno-color-pick ${c}" onclick="chooseUnoColor(${index},'${c}')">${UNO_EMOJI[c]} ${UNO_COLOR_NAMES[c]}</button>`).join("")}
        </div>
      </div>`);
}

function chooseUnoColor(index, color) {
    const modal = document.getElementById("unoColorModal");
    if (modal) modal.remove();
    const card = uno?.players[0].hand[index];
    if (card && card.color === "wild") applyUnoPlay(0, index, color);
}

function applyUnoPlay(playerIndex, cardIndex, chosenColor) {
    const player = uno.players[playerIndex];
    const card = player.hand.splice(cardIndex, 1)[0];
    uno.discard.push(card);
    uno.activeColor = card.color === "wild" ? chosenColor : card.color;
    const name = playerIndex === 0 ? "Ты" : player.name;
    uno.message = `${name} сыграл карту ${unoCardLabel(card)}.`;
    if (player.hand.length === 0) {
        uno.finished = true;
        if (playerIndex === 0) {
            uno.message = "🏆 Ты выиграл UNO!";
            awardUnoWin();
        } else {
            uno.message = `🤖 ${player.name} выиграл. Попробуй ещё раз!`;
        }
        renderUno();
        return;
    }
    let steps = 1;
    if (card.value === "skip") steps = 2;
    if (card.value === "reverse") {
        uno.direction *= -1;
        if (uno.players.length === 2) steps = 2;
    }
    if (card.value === "+2") {
        const target = nextUnoPlayer(playerIndex, 1);
        uno.players[target].hand.push(drawUnoCard(), drawUnoCard());
        uno.message += ` ${uno.players[target].name} берёт 2 карты.`;
        steps = 2;
    }
    if (card.value === "+4") {
        const target = nextUnoPlayer(playerIndex, 1);
        for (let i=0;i<4;i++) uno.players[target].hand.push(drawUnoCard());
        uno.message += ` ${uno.players[target].name} берёт 4 карты.`;
        steps = 2;
    }
    uno.current = nextUnoPlayer(playerIndex, steps);
    renderUno();
    if (uno.current !== 0) setTimeout(playUnoBotTurn, 650);
}

function nextUnoPlayer(from, steps) {
    let idx = from;
    for (let i=0;i<steps;i++) idx = (idx + uno.direction + uno.players.length) % uno.players.length;
    return idx;
}

function drawUnoForPlayer() {
    if (!uno || uno.finished || uno.current !== 0 || unoBusy) return;
    uno.players[0].hand.push(drawUnoCard());
    uno.message = "Ты взял карту. Ход переходит дальше.";
    uno.current = nextUnoPlayer(0, 1);
    renderUno();
    if (uno.current !== 0) setTimeout(playUnoBotTurn, 500);
}

function playUnoBotTurn() {
    if (!uno || uno.finished || uno.current === 0) return;
    unoBusy = true;
    const playerIndex = uno.current;
    const player = uno.players[playerIndex];
    const playable = player.hand.map((c,i)=>({card:c,index:i})).filter(x=>unoCanPlay(x.card));
    setTimeout(() => {
        if (!uno || uno.finished) { unoBusy=false; return; }
        if (!playable.length) {
            player.hand.push(drawUnoCard());
            uno.message = `${player.name} взял карту.`;
            uno.current = nextUnoPlayer(playerIndex, 1);
            unoBusy = false;
            renderUno();
            if (uno.current !== 0) setTimeout(playUnoBotTurn, 500);
            return;
        }
        playable.sort((a,b)=>unoCardScore(b.card)-unoCardScore(a.card));
        const chosen = playable[0];
        let color = chosen.card.color;
        if (color === "wild") {
            const counts = {red:0,yellow:0,green:0,blue:0};
            for (const c of player.hand) if (counts[c.color] !== undefined) counts[c.color]++;
            color = UNO_COLORS.sort((a,b)=>counts[b]-counts[a])[0];
        }
        unoBusy = false;
        applyUnoPlay(playerIndex, chosen.index, color);
    }, 650);
}

function unoCardScore(card) {
    if (card.value === "+4") return 8;
    if (card.value === "+2") return 7;
    if (card.value === "skip" || card.value === "reverse") return 6;
    if (card.color === "wild") return 5;
    return 1;
}

function callUno() {
    if (!uno || uno.players[0].hand.length !== 1) return;
    uno.message = "📣 UNO! У тебя осталась одна карта!";
    renderUno();
}

function awardUnoWin() {
    // Local demo stats only; syncing to the bot requires a backend connection.
    const coinsEl = document.getElementById("coins");
    const winsEl = document.getElementById("wins");
    const coins = Number(localStorage.getItem("mg_coins") || coinsEl.textContent || 100) + 25;
    const wins = Number(localStorage.getItem("mg_wins") || winsEl.textContent || 0) + 1;
    localStorage.setItem("mg_coins", String(coins));
    localStorage.setItem("mg_wins", String(wins));
    coinsEl.textContent = coins;
    winsEl.textContent = wins;
    uno.message += " +25 монет";
}

(function loadLocalStats(){
    try {
        const coins = localStorage.getItem("mg_coins");
        const wins = localStorage.getItem("mg_wins");
        if (coins !== null) document.getElementById("coins").textContent = coins;
        if (wins !== null) document.getElementById("wins").textContent = wins;
    } catch(e) { /* storage may be unavailable in some webviews */ }
})();

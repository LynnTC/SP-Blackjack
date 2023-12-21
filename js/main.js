/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h']
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const originalDeck = buildOriginalDeck();
const vsSound = new Audio('../css/audio-library/verses.wav');
const cardSound = new Audio('../css/audio-library/cardsound.mp3');

/*----- state variables -----*/
let money;
let pHand;
let dHand;
let winner;
let shuffledDeck;

/*----- cached elements  -----*/

/*----- event listeners -----*/
document.getElementById('bet-amounts')
    .addEventListener('click', handleBet);
document.getElementById('bet-controls')
    .addEventListener('click', handleControls);

/*----- functions -----*/

init ();

function handleDeal(){
    let dealtCard = 0;
    while (pHand.cards.length < 2){
    const dealtCard = shuffledDeck.pop();
    pHand.cards.push(dealtCard);
    }
    while (dHand.cards.length < 2){
    const dealtCard = shuffledDeck.pop();
    dHand.cards.push(dealtCard);
    } if (pHand.value === 21 && pHand.cards.length === 2){
        endRound();
    }
    hideBetButtons();
    pHand.value = pHand.cards[0].value + pHand.cards[1].value
    dHand.value = dHand.cards[0].value + dHand.cards[1].value
    setTimeout(() => {
        cardSound.play();
        renderPHand(pHand.cards,document.getElementById('player-hand'));
    }, 1000);
    setTimeout(() => {
        cardSound.play();
        renderDHand(dHand.cards,document.getElementById('dealer-hand'));
    }, 2000);
    setTimeout(() => {
        betConEn(); 
    }, 3000);
}

function handleHit(){
    const dealtCard = shuffledDeck.pop();
    pHand.cards.push(dealtCard);
    renderPHand(pHand.cards,document.getElementById('player-hand'));
    pHand.value += dealtCard.value;
    cardSound.play();
    if (dealtCard.face === 'A') {
        pHand.aces += 1;
      }
    if (pHand.value > 21 && pHand.aces > 0){
        pHand.value -= 10;
        pHand.aces -= 1;
        console.log("ace convert");
    } 
    if(pHand.value > 21 ) {
        betConDis();
        console.log("bust");
        console.log(pHand.value)
        setTimeout(() => {
            endRound();
        }, 2000);
        
    } else {
        return;
    }
}


function handleDouble(){
    cardSound.play();
    const dealtCard = shuffledDeck.pop();
    pHand.cards.push(dealtCard);
    console.log(dealtCard);
    renderPHand(pHand.cards,document.getElementById('player-hand'));
    money -= pHand.amountBet
    pHand.amountBet *= 2
    pHand.value += dealtCard.value;
    betConDis();
    setTimeout(() => {
        endRound();
    }, 1000);
}

function init(){
    pHand = {
        cards:[],
        value:0,
        amountBet:0,
        aces:0,
    };
    dHand = {
        cards:[],
        value:0
    };
    winner = 't';
    money = 5000;
    render();

}

function handleBet(evt){
    if (evt.target.tagName !== 'BUTTON') return;
    pHand.amountBet = parseInt(evt.target.innerText);
    money -= pHand.amountBet;
    vsSound.play();
    renderVS();
    setTimeout(() => {
        handleDeal();
        render();
    }, 5000);
    
}

function handleControls(evt){
    if (evt.target.tagName !== 'BUTTON') return;
    if (evt.target.id === 'hit'){
        handleHit();
    } if (evt.target.id === 'double'){
        handleDouble();
    } if (evt.target.id === 'stay'){
        hideBetButtons();
        dealerTurn();
    }
}

function hideBetButtons() {
    const betButtons = document.querySelectorAll('button[id^="bet"]');
    betButtons.forEach(button => {
        button.style.display = 'none';
    });
    const bossPortraits = document.querySelectorAll('[id=bossportraits]');
    bossPortraits.forEach(bossPortrait => {
        bossPortrait.style.display = 'none';
    });
    const betTxt = document.getElementById('chooseBetTxt');
    if (pHand.amountBet !== 0) {
        betTxt.style.display = 'none';
    }
}

function showBetButtons(){
    const betButtons = document.querySelectorAll('button[id^="bet"]');
    betButtons.forEach(button =>{
        button.style.display = '';
    })
    const bossPortraits = document.querySelectorAll('[id=bossportraits]');
    bossPortraits.forEach(bossPortrait => {
        bossPortrait.style.display = '';
    });
    const betTxt = document.getElementById('chooseBetTxt');
    if (betTxt) {
        betTxt.style.display = '';
    }
    
}

function renderHitStay(){
    setTimeout(() => {
        const hitBtn = document.getElementById('hit');
        if (pHand.amountBet == 0){
            hitBtn.style.display ='none';
        } else {
            hitBtn.style.display = '';
        };
        const stayBtn = document.getElementById('stay');
        if (pHand.amountBet == 0){
            stayBtn.style.display ='none';
        } else {
            stayBtn.style.display = '';
        };
        const doubleBtn = document.getElementById('double');
        if (pHand.amountBet == 0){
            doubleBtn.style.display ='none';
        } else {
            doubleBtn.style.display = '';
        };
    }, 3000);
}

function renderMoney(){
    const moneyEl = document.getElementById(`playMoney`);
    moneyEl.innerText = money;
}

function renderBet(){
    const betEl = document.getElementById(`betMoney`);
    betEl.innerText = pHand.amountBet;
}

function dealerTurn(){
    while (dHand.value < 17){
        const dealtCard = shuffledDeck.pop();
        dHand.cards.push(dealtCard);
        console.log(dealtCard);
        renderDHand(dHand.cards,document.getElementById('dealer-hand'));
        dHand.value += dealtCard.value;
    } if (dHand.value >= 17 ){
        revealDealer();
        setTimeout(() => {
            endRound();
        }, 2000);
    }
}

function endRound() {
    if (pHand.value > dHand.value && pHand.value <= 21){
        console.log ('playerwins')
        playerWin();
    } else if (pHand.value < dHand.value && dHand.value <= 21 ) {
        console.log ('dealer wins')
        playerLose();
    } else if (pHand.value <= 21 && dHand.value > 21) {
        console.log ('player wins')
        playerWin();
    } else if (pHand.value == dHand.value) {
        console.log ('tie')
        tieGame();
    } else if (pHand.value > 21) {
        playerLose();
    }
}

function playerWin(){
    pHand.amountBet *= 2;
    money += pHand.amountBet;
    pHand.amountBet = 0;
    render();
    getNewShuffledDeck();
    showBetButtons();
    clearCards();
}

function playerLose(){
    pHand.amountBet = 0;
    render();
    getNewShuffledDeck();
    showBetButtons();
    clearCards();
}

function tieGame(){
    render();
    getNewShuffledDeck();
    clearCards();
}

function gameOver(){
    alert('gameover')
}

function gameUnover(){
    alert('win')
}
function render(){
    renderMoney();
    renderBetButtons();
    renderHitStay();
    renderBet();
}

function clearCards(){
    pHand.cards = [];
    dHand.cards = [];
    pHand.value = 0;
    dHand.value = 0;
    renderPHand(pHand.cards,document.getElementById('player-hand'));
    renderDHand(dHand.cards,document.getElementById('dealer-hand'));
    if (money === 0 && pHand.amountBet === 0){
        gameOver();
    } if (money === 10000){
        gameUnover();
    }
}
function renderPHand(hand, container) {
    container.innerHTML = '';
    let cardsHtml = '';
    hand.forEach(function(card) {
      cardsHtml += `<div class="card ${card.face}"></div>`;
    });
    container.innerHTML = cardsHtml;
}

function renderDHand(hand, container) {
    container.innerHTML = '';
    let cardsHtml = '';
    hand.forEach(function(card, index) {
        if (index === 0) {
            cardsHtml += '<div class="card face-down"></div>'
        } else {
            cardsHtml += `<div class="card ${card.face}"></div>`;
        }
    });
    container.innerHTML = cardsHtml;

  }

function revealDealer() {
    const container = document.getElementById('dealer-hand');
    container.children[0].className = `card ${dHand.cards[0].face}`;
}

function renderBetButtons(){
    const bet100Button = document.getElementById('bet100');
    if (money < 100) {
        bet100Button.disabled = true;
        bet100Button.classList.add('disabled');
    } else {
        bet100Button.disabled = false;
        bet100Button.classList.remove('disabled');
    }
    const bet500Button = document.getElementById('bet500');
    if (money < 500) {
        bet500Button.disabled = true;
        bet500Button.classList.add('disabled');
    } else {
        bet500Button.disabled = false;
        bet500Button.classList.remove('disabled');
    }
    const bet1000Button = document.getElementById('bet1000');
    if (money < 1000) {
        bet1000Button.disabled = true;
        bet100Button.classList.add('disabled');
    } else {
        bet1000Button.disabled = false;
        bet1000Button.classList.remove('disabled');
    }
}

function betConDis(){
    const betBtns = document.querySelectorAll('#bet-controls button');
    for (const btn of betBtns){
        btn.disabled = true;
    }
}

function betConEn(){
    const betBtns = document.querySelectorAll('#bet-controls button');
    for (const btn of betBtns){
        btn.disabled = false;
    }
}

function renderVS(){
    let img = new Image(),
    width = 100,
    screenWidth = window.innerWidth,
    duration = 5000;
    img.style.position = 'absolute';
    img.style.top = '300px';
    img.style.right = '0';
    img.id = 'bossVs';
    if (pHand.amountBet === 10) {
        img.src = '../images/bossportraits/wallacevs.png';
    } else if (pHand.amountBet === 100) {
        img.src = '../images/bossportraits/lucasvs.png';
    } else if (pHand.amountBet === 500) {
        img.src = '../images/bossportraits/gideonvs.png';
    } else if (pHand.amountBet === 1000) {
        img.src = '../images/bossportraits/scottvs.png';
    } 
    document.body.appendChild(img);

    img.onload = function () {
        let start = Date.now();

        function move() {
            let timePassed = Date.now() - start;
            img.style.right = (timePassed / duration) * (screenWidth / 3) + 'px';

            if (timePassed < duration) {
                requestAnimationFrame(move);
            } if (timePassed > duration){
                img.style.display = 'none';
            }
        }

        move();
    };
}
/*----- deck functions -----*/
function getNewShuffledDeck() {
    const tempDeck = [...originalDeck];
    const newShuffledDeck = [];
    while (tempDeck.length) {
      const rndIdx = Math.floor(Math.random() * tempDeck.length);
      newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
    }
    shuffledDeck = newShuffledDeck;
  }

  function buildOriginalDeck() {
    const deck = [];
    suits.forEach(function(suit) {
      ranks.forEach(function(rank) {
        deck.push({
          face: `${suit}${rank}`,
          value: Number(rank) || (rank === 'A' ? 11 : 10)
        });
      });
    });
    return deck;
  }
  
  getNewShuffledDeck();
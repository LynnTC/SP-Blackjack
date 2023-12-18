/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h']
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const originalDeck = buildOriginalDeck();

/*----- state variables -----*/
let money;
let pHand;
let dHand;
let winner;
let shuffledDeck;

/*----- cached elements  -----*/
const shuffledContainer = document.getElementById('shuffled-deck-container');
const betBtns = document.querySelectorAll('#bet-amounts > button')
const playerHandEl = document.getElementById('pHand.cards');
const dealerHandEl = document.getElementById('dHand.cards');

/*----- event listeners -----*/
document.getElementById('bet-amounts')
    .addEventListener('click', handleBet);
document.getElementById('bet-controls')
    .addEventListener('click', handleControls);

document.querySelector('button').addEventListener('click', renderNewShuffledDeck);

/*----- functions -----*/

init ();

function handleDeal(){
    while (pHand.cards.length < 2){
    const dealtCard = shuffledDeck.pop();
    pHand.cards.push(dealtCard);
    }
    while (dHand.cards.length < 2){
    const dealtCard = shuffledDeck.pop();
    dHand.cards.push(dealtCard);
    }
}

function handleHit(){
    pHand.cards.push(shuffledDeck.pop());

}
function handleStand(){

}
function handleDouble(){

}

function init(){
    pHand = {
        cards:[],
        value:0,
        amountBet:0
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
    renderBet();
    hideBetButtons();
    handleDeal();
    renderPHand(pHand.cards,document.getElementById('player-hand'));
    renderDHand(dHand.cards,document.getElementById('dealer-hand'));
    render();
}

function handleControls(evt){
    if (evt.target.tagName !== 'BUTTON') return;
}

//  TODO: Change hide/show functions to 1 function
function hideBetButtons() {
    const betButtons = document.querySelectorAll('button[id^="bet"]');
    betButtons.forEach(button => {
        button.style.display = 'none';
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
    const betTxt = document.getElementById('chooseBetTxt');
    if (betTxt) {
        betTxt.style.display = '';
    }
    
}

function renderHitStay(){
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
}

function renderMoney(){
    const moneyEl = document.getElementById(`playMoney`);
    moneyEl.innerText = money;
}

function renderBet(){
    const betEl = document.getElementById(`betMoney`);
    betEl.innerText = pHand.amountBet;
}

function renderCards() {

}

function render(){
    renderMoney();
    renderBetButtons();
    renderHitStay();
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

/*----- deck functions -----*/
function getNewShuffledDeck() {
    const tempDeck = [...originalDeck];
    const newShuffledDeck = [];
    while (tempDeck.length) {
      const rndIdx = Math.floor(Math.random() * tempDeck.length);
      newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
    }
    return newShuffledDeck;
  }
  
  function renderNewShuffledDeck() {
    shuffledDeck = getNewShuffledDeck();
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
  
  renderNewShuffledDeck();
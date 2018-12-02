/*
Copyright (C) 2018 Alkis Georgopoulos <alkisg@gmail.com>.
SPDX-License-Identifier: CC-BY-SA-4.0
*/
var act = null;

function onError(message, source, lineno, colno, error) {
  alert(sformat('Σφάλμα προγραμματιστή!\n'
    + 'message: {}\nsource: {}\nlineno: {}\ncolno: {}\nerror: {}',
  message, source, lineno, colno, error));
}

// ES6 string templates don't work in old Android WebView
function sformat(format) {
  var args = arguments;
  var i = 0;
  return format.replace(/{(\d*)}/g, function sformatReplace(match, number) {
    i += 1;
    if (typeof args[number] !== 'undefined') {
      return args[number];
    }
    if (typeof args[i] !== 'undefined') {
      return args[i];
    }
    return match;
  });
}

// Return an integer from 0 to num-1.
function random(num) {
  return Math.floor(Math.random() * num);
}

// Return a shuffled array [0, ..., num-1].
// If differentIndex==true, make sure that array[i] != i.
function shuffledArray(num, differentIndex) {
  var result = [];
  var i;
  var j;
  var temp;

  // Fill the array with [0, ..., num-1]
  for (i = 0; i < num; i += 1) {
    result.push(i);
  }
  // Shuffle the array
  for (i = 0; i < num; i += 1) {
    j = random(num);
    temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  // Make sure that result[i] != i
  if (differentIndex) {
    for (i = 0; i < num; i += 1) {
      if (result[i] === i) {
        j = (i + 1) % num;
        temp = result[i];
        result[i] = result[j];
        result[j] = temp;
      }
    }
  }
  return result;
}

function ge(element) {
  return document.getElementById(element);
}

function setAnimation(eleName,aniName,aniDur){
  /* Code for Chrome, Safari, and Opera */
  ge(eleName).classList.add(aniName);
  ge(eleName).style.animationName = aniName;
  ge(eleName).style.animationDuration = aniDur;
}

function onResize(event) {
  var w = window.innerWidth;
  var h = window.innerHeight;
  if (w / h < 640 / 360) {
    document.body.style.fontSize = sformat('{}px', 10 * w / 640);
  } else {
    document.body.style.fontSize = sformat('{}px', 10 * h / 360);
  }
}

function onHome(event) {
  window.history.back();
}

function onHelp(event) {
  ge('help').style.display = 'flex';
}

function onHelpHide(event) {
  ge('help').style.display = '';
}

function onAbout(event) {
  window.open('credits/index_DS_II.html');
}

function onFullScreen(event) {
  var doc = window.document;
  var docEl = doc.documentElement;
  var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen
    || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
  var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen
    || doc.webkitExitFullscreen || doc.msExitFullscreen;

  if (!doc.fullscreenElement && !doc.mozFullScreenElement
    && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    requestFullScreen.call(docEl);
  } else {
    cancelFullScreen.call(doc);
  }
}

function onPrevious(event) {
  initLevel(act.level - 1);
}

function onNext(event) {
  initLevel(act.level + 1);
}


function pickCards(num){
  retArr = [];
  x = [];
  for (var i = 0; i<18; i++){
    x.push(i);
  }
  for (var i=0; i<num; i++){
    j = random(x.length);
    retArr.push(x[j]);
    x.splice(j,1);
  }
  return(retArr);
}

function rearrangeCards(cards){
  cards = cards.concat(cards);
  cardsIndex = shuffledArray(cards.length,false);
  arrangedCards = [];
  for (var i = 0; i<cardsIndex.length; i++){
    arrangedCards.push(cards[cardsIndex[i]]+1);
  }
  return(arrangedCards);
}

function hideCards(){
  for (var i = 0; i<6; i++){
    for (var j = 0; j<3; j++){
        var id = 'r' + (j+1).toString() + 'c' + (i+1).toString();
        ge(id).style.display = 'none';
        ge(id).src = 'resource/backcard.svg';
        var aid = 'a' + id;
        ge(aid).style.display = 'none';

    }
  }
}

function onCardClick(event){
  var animalId;
  var cardId;
  if (event.target.id[0] == 'a'){//click on animal
    animalId = event.target.id;
    cardId = animalId.substr(1);
  }
  else{//click on card
    animalId = 'a' + event.target.id;
    cardId = event.target.id;
  }
  if (ge(animalId).style.display == 'none'){
    setAnimation(cardId,'flipit','1s');
    setAnimation(animalId,'flipit','1s')
    checkLastTwo();
    setTimeout(function(){openCard(cardId,animalId)},450);
  }
}


function checkLastTwo(){
    if (act.cardsOpen.length>=2 && act.cardsOpen.length % 2 == 0){
      console.log(act.gridAnimals[act.cardsOpen[act.cardsOpen.length-1][0]][act.cardsOpen[act.cardsOpen.length-1][1]],
                  act.gridAnimals[act.cardsOpen[act.cardsOpen.length-2][0]][act.cardsOpen[act.cardsOpen.length-2][1]])
      if (act.gridAnimals[act.cardsOpen[act.cardsOpen.length-1][0]][act.cardsOpen[act.cardsOpen.length-1][1]] !=
          act.gridAnimals[act.cardsOpen[act.cardsOpen.length-2][0]][act.cardsOpen[act.cardsOpen.length-2][1]]){
            var cardId = 'r' + (act.cardsOpen[act.cardsOpen.length-1][0]+1).toString() + 'c' + (act.cardsOpen[act.cardsOpen.length-1][1]+1).toString();
            var animalId = 'a' + cardId;
            closeCard(cardId,animalId);
            var cardId = 'r' + (act.cardsOpen[act.cardsOpen.length-2][0]+1).toString() + 'c' + (act.cardsOpen[act.cardsOpen.length-2][1]+1).toString();
            var animalId = 'a' + cardId;
            closeCard(cardId,animalId);
            act.cardsOpen.splice(act.cardsOpen.length-1,1);
            act.cardsOpen.splice(act.cardsOpen.length-1,1);
          }
    }
}


function openCard(cardId,animalId){
  setAnimation(cardId,'reset','0s');
  setAnimation(animalId,'reset','0s');
  ge(cardId).src = "resource/emptycard.svg";
  ge(animalId).style.display = "";
  if (act.player){
    act.player.pause();
  }
  act.player = ge(ge(animalId).audioId);
  act.player.currentTime = 0;
  act.player.play();
  act.cardsOpen.push([ge(cardId).row,ge(cardId).col]);
  if (act.cardsOpen.length == act.totalCards){
    ge('flowergood').style.display = "block";
    ge('flowergood').style.position = "fixed";
    ge('flowergood').style.zIndex = 100;
    ge('flowergood').style.align = "center";
    setAnimation('flowergood','flower','2s');
    setTimeout(onNext,2000);
  }
  console.log(act.cardsOpen);
}
function closeCard(cardId,animalId){
    setAnimation(cardId,'reset','0s');
    setAnimation(animalId,'reset','0s');
    ge(cardId).src = "resource/backcard.svg";
    ge(animalId).style.display = "none";
}


function initLevel(newLevel){
  ge('flowergood').style.display = 'none';
  setAnimation('flowergood','reset','0s');
  act.level = (newLevel + act.gridXArr.length) % act.gridXArr.length;
  ge('level').innerHTML = act.level + 1;
  var cards = rearrangeCards(pickCards(act.tilesNumArr[act.level]/2));

  hideCards();
  columns = act.gridXArr[act.level];
  rows = act.gridYArr[act.level];
  act.totalCards = rows*columns;
  for (var i = 0; i<columns; i++){
    for (var j = 0; j<rows; j++){
        var id = 'r' + (j+1).toString() + 'c' + (i+1).toString();      
        ge(id).row  = j;
        ge(id).col = i;
        ge(id).style.display = '';
        ge(id).style.padding = sformat('{}em',1/(3*rows));
        ge(id).style.height = sformat('{}em',30 / rows);
        ge(id).onclick = onCardClick;
        var aid = 'a' + id;
        var rAnimal = cards[i*rows+j].toString();
        act.gridAnimals[j][i] = cards[i*rows+j];
        act.cardsOpen = [];
        var audioId = 'audio' + rAnimal;
        ge(aid).audioId = audioId;//attach audio to aid element
        ge(aid).src = ge('a'+rAnimal).src;
        ge(aid).style.width = sformat('{}em',(30 / rows) * 0.5);
        ge(aid).style.top = sformat('{}em',(30 / rows) * 0.1);
        ge(aid).style.left = sformat('{}em',(30 / rows) * 0.1);
        ge(aid).style.display = 'none';
        ge(aid).onclick = onCardClick;
    }
  }

}

function initActivity(event){
  act = {  
  // Internal level number is zero-based; but we display it as 1-based.
  // Levels:       0   1    2    3    4  
  // Card layout: 2x3 2x4  2x5  3x4  3x6 
  // Tiles number: 6   8   10   12   18  
  // Cards needed: 3   4    5    6    9  
  level: 0,
  tilesNumArr: [ 4,  6,  8,  10, 12, 18],
  gridXArr: [ 2,  3,  4,   5,  4,  6],
  gridYArr: [ 2,  2,  2,   2,  3,  3],
  player : null,
  gridAnimals: [[-1,-1,-1,-1,-1,-1,],[-1,-1,-1,-1,-1,-1,],[-1,-1,-1,-1,-1,-1,]],
  cardsOpen: [],
  };
  ge('flowergood').style.display = 'none';
  ge('bar_home').onclick = onHome;
  ge('bar_help').onclick = onHelp;
  ge('help').onclick = onHelpHide;
  ge('bar_about').onclick = onAbout;
  ge('bar_fullscreen').onclick = onFullScreen;
  ge('bar_previous').onclick = onPrevious;
  ge('bar_next').onclick = onNext;
  //hide everything
  for (var i = 0; i<6; i++){
    for (var j = 0; j<3; j++){
        var id = 'r' + (j+1).toString() + 'c' + (i+1).toString();
        ge(id).style.display = 'none';
    }
  }
  
  document.body.onresize = onResize;
  initLevel(0);
  onResize();

}

window.onerror = onError;
window.onload = initActivity;
// Call onResize even before the images are loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onResize);
} else {  // `DOMContentLoaded` already fired
  onResize();
}

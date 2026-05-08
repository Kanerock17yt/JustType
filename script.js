const words = 'in one good real one not school set they state high life consider on and not come what also for set point can want as while with of order child about school thing never hold find order each too between program work end you home place around while place problem end begin interest while public or where see time those increase interest be give end think seem small as both another a child same eye you between way do who into again good fact than under very head become real possible some write know however late each that with because that place nation only for each change form consider we would interest with world so order or run more open that large write turn never over open each over change still old take hold need give by consider line only leave while what set up number part form want against great problem can because head so first this here would course become help year first end want both fact public long word down also long for without new turn against the because write seem line interest call not if line thing what work people way may old consider leave hold want life between most place may if go who need fact such program where which end off child down change to from people high during people find to however into small new general it do that could old for last get another hand much eye great no work and with but good there last think can around use like number never since world need what we around part show new come seem while some and since still small these you general which seem will place come order form how about just also they with state late use both early too lead general seem there point take general seem few out like might under if ask while such interest feel word right again how about system such between late want fact up problem stand new say move a lead small however large public out by eye here over so be way use like say people work for since interest so face order school good not most run problem group run she late other problem real form what just high no man do under would to each too end point give number child through so this large see get form also all those course to work during about he plan still so like down he look down where course at who plan way so since come against he all who at world because while so few last these mean take house who old way large no first too now off would in this course present order home public school back own little about he develop of do over help day house stand present another by few come that down last or use say take would each even govern play around back under some line think she even when from do real problem between long as there school do as mean to all on other good may from might call world thing life turn of he look last problem after get show want need thing old other during be again develop come from consider the now number say life interest to system only group world same state school one problem between for turn run at very against eye must go both still all a as so after play eye little be those should out after which these both much house become both school this he real and may mean time by real number other as feel at end ask plan come turn by all head increase he present increase use stand after see order lead than system here ask in of look point little too without each for both but right we come world much own set we right off long those stand go both but under now must real general then before with much those at no of we only back these person plan from run new as own take early just increase only look open follow get that on system the mean plan man over it possible if most late line would first without real hand say turn point small set at in system however to be home show new again come under because about show face child know person large program how over could thing from out world while nation stand part run have look what many system order some one program you great could write day do he any also where child late face eye run still again on by as call high the must by late little mean never another seem to leave because for day against public long number word about after much need open change also'.split(' ');

const wordsCount = words.length;
const gameTime = 30 * 1000;

let timer = null;
let gameStart = null;
let latestWPM = 0;

function randomWord() {
  return words[Math.floor(Math.random() * wordsCount)];
}

function formatWord(word) {
  return `
    <div class="word">
      ${word
        .split('')
        .map(letter => `<span class="letter">${letter}</span>`)
        .join('')}
    </div>
  `;
}

function newGame() {

  const wordsElement = document.getElementById('words');

  wordsElement.innerHTML = '';

  for (let i = 0; i < 200; i++) {
    wordsElement.innerHTML += formatWord(randomWord());
  }

  wordsElement.style.marginTop = '0px';

  const firstWord = document.querySelector('.word');
  const firstLetter = document.querySelector('.letter');

  firstWord.classList.add('current');
  firstLetter.classList.add('current');

  document.getElementById('info').innerHTML = '30';

  document.getElementById('game').classList.remove('over');

  clearInterval(timer);

  timer = null;
  gameStart = null;

  moveCursor();
}

function moveCursor() {

  const cursor = document.getElementById('cursor');

  const currentLetter = document.querySelector('.letter.current');
  const currentWord = document.querySelector('.word.current');

  const target = currentLetter || currentWord;

  if (!target) return;

  const rect = target.getBoundingClientRect();

  cursor.style.top = rect.top + 2 + 'px';

  cursor.style.left =
    (currentLetter ? rect.left : rect.right) + 'px';
}

function getWpm() {

  const words = [...document.querySelectorAll('.word')];

  const currentWord = document.querySelector('.word.current');

  const currentIndex = words.indexOf(currentWord);

  const typedWords = words.slice(0, currentIndex);

  const correctWords = typedWords.filter(word => {

    const letters = [...word.querySelectorAll('.letter')];

    return letters.every(letter =>
      letter.classList.contains('correct')
    );
  });

  return Math.round(correctWords.length / (gameTime / 60000));
}

function gameOver() {

  clearInterval(timer);

  document.getElementById('game').classList.add('over');

  latestWPM = getWpm();

  document.getElementById('info').innerHTML =
    `WPM: ${latestWPM}`;
}

document.getElementById('game').addEventListener('keydown', ev => {

  if (document.getElementById('game').classList.contains('over')) {
    return;
  }

  const key = ev.key;

  const currentWord = document.querySelector('.word.current');
  const currentLetter = document.querySelector('.letter.current');

  if (!currentWord) return;

  const expected = currentLetter?.innerText || ' ';
  const isLetter = key.length === 1 && key !== ' ';
  const isSpace = key === ' ';
  const isBackspace = key === 'Backspace';

  if (!timer && isLetter) {

    gameStart = new Date().getTime();

    timer = setInterval(() => {

      const currentTime = new Date().getTime();

      const elapsed = currentTime - gameStart;

      const remaining = Math.max(
        0,
        Math.ceil((gameTime - elapsed) / 1000)
      );

      document.getElementById('info').innerHTML = remaining;

      if (remaining <= 0) {
        gameOver();
      }

    }, 1000);
  }

  if (isLetter) {

    if (currentLetter) {

      if (key === expected) {
        currentLetter.classList.add('correct');
      } else {
        currentLetter.classList.add('incorrect');
      }

      currentLetter.classList.remove('current');

      if (currentLetter.nextElementSibling) {
        currentLetter.nextElementSibling.classList.add('current');
      }

    }
  }

  if (isSpace) {

    ev.preventDefault();

    if (expected !== ' ') {

      const remainingLetters =
        currentWord.querySelectorAll('.letter:not(.correct)');

      remainingLetters.forEach(letter => {
        letter.classList.add('incorrect');
      });
    }

    currentWord.classList.remove('current');

    if (currentWord.nextElementSibling) {

      currentWord.nextElementSibling.classList.add('current');

      const firstLetter =
        currentWord.nextElementSibling.querySelector('.letter');

      firstLetter.classList.add('current');
    }
  }

  if (isBackspace) {

    if (currentLetter &&
        currentLetter.previousElementSibling) {

      currentLetter.classList.remove('current');

      currentLetter.previousElementSibling.classList.remove(
        'correct',
        'incorrect'
      );

      currentLetter.previousElementSibling.classList.add('current');
    }
  }

  if (currentWord.getBoundingClientRect().top > 250) {

    const words = document.getElementById('words');

    const margin =
      parseInt(words.style.marginTop || '0');

    words.style.marginTop = (margin - 35) + 'px';
  }

  moveCursor();
});

document.getElementById('newGameBtn').addEventListener('click', () => {
  newGame();
});

const shareButton = document.getElementById('shareScore');

if (shareButton) {

  shareButton.addEventListener('click', () => {

    if (latestWPM <= 0) {
      alert('Finish a game first!');
      return;
    }

    const shareURL =
  `${window.location.origin}${window.location.pathname}score.html?wpm=${latestWPM}`;

    navigator.clipboard.writeText(shareURL);

    alert('Share link copied!');
  });
}

const params = new URLSearchParams(window.location.search);

const sharedWPM = params.get('wpm');

if (sharedWPM) {

  document.body.innerHTML = `

    <div style="
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: #111;
      color: white;
      font-family: Arial;
      text-align: center;
    ">

      <h1 style="
        font-size: 80px;
        margin: 0;
      ">
        ${sharedWPM} WPM
      </h1>

      <p style="
        font-size: 28px;
        opacity: 0.8;
      ">
        Shared from JustType
      </p>

      <a href="${window.location.origin}${window.location.pathname}" style="
        margin-top: 30px;
        padding: 15px 30px;
        background: white;
        color: black;
        text-decoration: none;
        border-radius: 12px;
        font-size: 20px;
      ">
        Play JustType
      </a>

    </div>
  `;

} else {

  newGame();

}

newGame();
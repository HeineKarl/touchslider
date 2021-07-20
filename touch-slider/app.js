// S-News Card Event
// Variables for the Touch and Mouse Events
const newsCon = document.querySelector(".marian__news"),
  newsCards = Array.from(newsCon.querySelectorAll(".marian__card"));

let isDragging = false,
  startPos = 0,
  currentTranslate = 0,
  prevTranslate = 0,
  animationID = 0,
  currentIndex = 0;

// Variables for the positioning
let fullWidth, cardWidth, marginSize, newsCardWidth;

// Preventing while holding touch propagation
window.oncontextmenu = (e) => {
  e.preventDefault();
  e.stopPropagation();
  return false;
};

// Selecting each Cards
newsCards.forEach((newsCard, index) => {
  // Positioning in the right place
  newsCard.style.left = `${getCardWidth() * index + getMargin()}px`;

  // Preventing image to drag
  const newsImage = newsCard.querySelector("img");
  newsImage.addEventListener("dragstart", (e) => e.preventDefault());

  // Touch Event
  newsCard.addEventListener("touchstart", touchStart(index));
  newsCard.addEventListener("touchend", touchEnd);
  newsCard.addEventListener("touchmove", touchMove);

  // Mouse Event
  newsCard.addEventListener("mousedown", touchStart(index));
  newsCard.addEventListener("mouseup", touchEnd);
  newsCard.addEventListener("mouseleave", touchEnd);
  newsCard.addEventListener("mousemove", touchMove);
});

// If touch or mouse starts, execute the function
function touchStart(index) {
  return function (e) {
    isDragging = true;
    currentIndex = index;
    startPos = getPositionX(e);
    animationID = requestAnimationFrame(animation);
  };
}

// If touch or mouse ends, move in their current position
function touchEnd() {
  isDragging = false;
  cancelAnimationFrame(animationID);

  const movedBy = currentTranslate - prevTranslate;

  if (movedBy < -80 && currentIndex < newsCards.length - 1) currentIndex += 1;
  if (movedBy > 80 && currentIndex > 0) currentIndex -= 1;

  setPosByIndex();
}

// Moving the Card
function touchMove(e) {
  if (isDragging) {
    const currentPos = getPositionX(e);
    currentTranslate = prevTranslate + currentPos - startPos;
  }
}

// Figuring if it is Mouse or Touch
function getPositionX(e) {
  return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
}

// Animating the Card by sliding
function animation() {
  setNewsCardPos();
  if (isDragging) requestAnimationFrame(animation);
}

// Transforming the Container of the Card
function setNewsCardPos() {
  return (newsCon.style.transform = `translateX(${currentTranslate}px)`);
}

// Setting the position of the Card by sliding
function setPosByIndex() {
  currentTranslate = currentIndex * -getCardWidth();
  prevTranslate = currentTranslate;
  setNewsCardPos();
}

// Getting the exact Card width
function getCardWidth() {
  return (newsCardWidth = newsCards[0].getBoundingClientRect().width);
}

// Getting the Screen width
function getScreenWidth() {
  return (fullWidth = window.innerWidth);
}

// Getting the left and right Margin
function getMargin() {
  return (marginSize = (getScreenWidth() - getCardWidth()) / 2);
}

// E-News Card Event

// Resize Event
window.addEventListener("resize", setWait);

// Wait for the resize to end, then executes
function setWait() {
  let rtime;
  let timeout = false;
  let delta = 1000;
  // Set the resize to start
  rtime = new Date();
  if (timeout === false) {
    timeout = true;
    setTimeout(resizeend, delta);
  }

  function resizeend() {
    if (new Date() - rtime < delta) {
      // Wait for the resize to end
      setTimeout(resizeend, delta);
    } else {
      timeout = false;

      newsCards.forEach((newsCard, index) => {
        newsCard.style.left = `${getCardWidth() * index + getMargin()}px`;
      });
    }
  }
}

var cards, nCards, cover, openContent, openContentText, pageIsOpen = false,
    openContentImage, closeContent, windowWidth, windowHeight, currentCard;

// initiate the process
init();

function init() {
    resize();
    selectElements();
    attachListeners();
}

// select all the elements in the DOM that are going to be used
function selectElements() {
    cards = document.getElementsByClassName('card'),
        nCards = cards.length,
        cover = document.getElementById('cover'),
        openContent = document.getElementById('open-content'),
        openContentText = document.getElementById('open-content-text'),
        openContentImage = document.getElementById('open-content-image')
    closeContent = document.getElementById('close-content');
}

/* Attaching three event listeners here:
  - a click event listener for each card
  - a click event listener to the close button
  - a resize event listener on the window
*/
function attachListeners() {
    for (var i = 0; i < nCards; i++) {
        attachListenerToCard(i);
    }
    closeContent.addEventListener('click', onCloseClick);
    window.addEventListener('resize', resize);
}

function attachListenerToCard(i) {
    cards[i].addEventListener('click', function(e) {
        var card = getCardElement(e.target);
        onCardClick(card, i);
    })
}

/* When a card is clicked */
function onCardClick(card, i) {
    // set the current card
    currentCard = card;
    // add the 'clicked' class to the card, so it animates out
    currentCard.className += ' clicked';
    // animate the card 'cover' after a 500ms delay
    setTimeout(function() { animateCoverUp(currentCard) }, 500);
    // animate out the other cards
    animateOtherCards(currentCard, true);
    // add the open class to the page content
    openContent.className += ' open';
}

/*
 * This effect is created by taking a separate 'cover' div, placing
 * it in the same position as the clicked card, and animating it to
 * become the background of the opened 'page'.
 * It looks like the card itself is animating in to the background,
 * but doing it this way is more performant (because the cover div is
 * absolutely positioned and has no children), and there's just less
 * having to deal with z-index and other elements in the card
 */
function animateCoverUp(card) {
    // get the position of the clicked card
    var cardPosition = card.getBoundingClientRect();
    // get the style of the clicked card
    var cardStyle = getComputedStyle(card);
    setCoverPosition(cardPosition);
    setCoverColor(cardStyle);
    scaleCoverToFillWindow(cardPosition);
    // update the content of the opened page
    openContentText.innerHTML = '<h1>' + card.children[2].textContent + '</h1>' + paragraphText;
    openContentImage.src = card.children[1].src;
    setTimeout(function() {
        // update the scroll position to 0 (so it is at the top of the 'opened' page)
        window.scroll(0, 0);
        // set page to open
        pageIsOpen = true;
    }, 300);
}

function animateCoverBack(card) {
    var cardPosition = card.getBoundingClientRect();
    // the original card may be in a different position, because of scrolling, so the cover position needs to be reset before scaling back down
    setCoverPosition(cardPosition);
    scaleCoverToFillWindow(cardPosition);
    // animate scale back to the card size and position
    cover.style.transform = 'scaleX(' + 1 + ') scaleY(' + 1 + ') translate3d(' + (0) + 'px, ' + (0) + 'px, 0px)';
    setTimeout(function() {
        // set content back to empty
        openContentText.innerHTML = '';
        openContentImage.src = '';
        // style the cover to 0x0 so it is hidden
        cover.style.width = '0px';
        cover.style.height = '0px';
        pageIsOpen = false;
        // remove the clicked class so the card animates back in
        currentCard.className = currentCard.className.replace(' clicked', '');
    }, 301);
}

function setCoverPosition(cardPosition) {
    // style the cover so it is in exactly the same position as the card
    cover.style.left = cardPosition.left + 'px';
    cover.style.top = cardPosition.top + 'px';
    cover.style.width = cardPosition.width + 'px';
    cover.style.height = cardPosition.height + 'px';
}

function setCoverColor(cardStyle) {
    // style the cover to be the same color as the card
    cover.style.backgroundColor = cardStyle.backgroundColor;
}

function scaleCoverToFillWindow(cardPosition) {
    // calculate the scale and position for the card to fill the page,
    var scaleX = windowWidth / cardPosition.width;
    var scaleY = windowHeight / cardPosition.height;
    var offsetX = (windowWidth / 2 - cardPosition.width / 2 - cardPosition.left) / scaleX;
    var offsetY = (windowHeight / 2 - cardPosition.height / 2 - cardPosition.top) / scaleY;
    // set the transform on the cover - it will animate because of the transition set on it in the CSS
    cover.style.transform = 'scaleX(' + scaleX + ') scaleY(' + scaleY + ') translate3d(' + (offsetX) + 'px, ' + (offsetY) + 'px, 0px)';
}

/* When the close is clicked */
function onCloseClick() {
    // remove the open class so the page content animates out
    openContent.className = openContent.className.replace(' open', '');
    // animate the cover back to the original position card and size
    animateCoverBack(currentCard);
    // animate in other cards
    animateOtherCards(currentCard, false);
}

function animateOtherCards(card, out) {
    var delay = 100;
    for (var i = 0; i < nCards; i++) {
        // animate cards on a stagger, 1 each 100ms
        if (cards[i] === card) continue;
        if (out) animateOutCard(cards[i], delay);
        else animateInCard(cards[i], delay);
        delay += 100;
    }
}

// animations on individual cards (by adding/removing card names)
function animateOutCard(card, delay) {
    setTimeout(function() {
        card.className += ' out';
    }, delay);
}

function animateInCard(card, delay) {
    setTimeout(function() {
        card.className = card.className.replace(' out', '');
    }, delay);
}

// this function searches up the DOM tree until it reaches the card element that has been clicked
function getCardElement(el) {
    if (el.className.indexOf('card ') > -1) return el;
    else return getCardElement(el.parentElement);
}

// resize function - records the window width and height
function resize() {
    if (pageIsOpen) {
        // update position of cover
        var cardPosition = currentCard.getBoundingClientRect();
        setCoverPosition(cardPosition);
        scaleCoverToFillWindow(cardPosition);
    }
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
}

var paragraphText = '<p>Food is just another way to know more about a country. Many countries have cooking traditions using various spices or combinations of flavors unique to that culture that evolves over time.  Some popular types of foods include Italian, American and Mexican.  The most delicious, traditional and unique cuisine is Mexican food; it is known for its varied flavors, colorful decoration, and variety of spices and ingredients. American food is known for a cultural mix in its cuisine, and Italian food for its variety depending on the regions, and for keeping the cooking style simple and easy to prepare. Although each cuisine is delicious, there are some differences that make them stand out among the others.  Some countries have diversified their foods by variety, flavors and the utensils they use to prepare it.Mexican, American and Italian cuisines vary by region.Mexican food depends on the weather, geography and ethnicity.The north of Mexico is known for its beef, goat, ostrich, and meat dishes.Central Mexico cuisine is largely influenced by the rest of the country, but has unique dishes such as barbacoa, pozole, menudo, and carnitas. The cuisine of South Mexico has a lot of Caribbean influence due to its location. Seafood is commonly prepared in states that border the Pacific Ocean or the Gulf of Mexico. The variety of Italian food is huge. Because it is divided into nineteen regions, this means there are nineteen different types of Italian food. In contrast with Mexican food that is only divided in three regions, it is harder to know nineteen types of food than three. The use of a lot of cheese, pasta and tomato in its food is another things that contrast Italian and Mexican food. So, I’m going to divide the Italian cuisine into three regions, north, central, and south. Northern Italy’s most common plates are polenta, risotto, and hearty soups. Southern Italy is best known for pizza, minestra marinata, a soup that combines pork fat and boiled greens. Another plate is the Maccheroni, it is made with little meatballs, sliced hardboiled eggs, pieces of artichoke, salame, and cheese. And central Italy is known for Tortellini of Emilia and the Cappelletti of Romagna.</p>';
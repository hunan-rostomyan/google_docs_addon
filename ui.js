var $cardList = $('#cards');
var $highlightAllButton = $('#highlight_all');
var $spinner = $('#spinner');
var $unhighlightAllButton = $('#unhighlight_all');


// Given a list of comments, generate Cards and render them.
function populateCards(comments) {
  var $cards = $cardList.html('');
  comments.forEach(function(comment) {
    new Card({
      text: comment.text,
      module: comment.module,
      indices: comment.indices}).appendTo($cards);
  });
}


// Displaying cards involves selectively showing
// toolbar buttons. Note: it's a little too clever
// for the sake of keeping things DRY.
function showCards(show) {
  var elements = {
    '#no_comments': show,
    '#yes_comments': !show,
    '#cards': !show,
  };
  Object.keys(elements).forEach(function(key) {
    $(key)[elements[key] ? 'addClass' : 'removeClass']('hidden');
  });
}


// Spinner
function toggleSpinner(yes) {
  _toggleHidden($spinner, yes);
}


// (Un)select all cards
function selectAllCards() {
  $cardList.children('li').each(function() {
    selectCard($(this));
  });
}
function unselectAllCards() {
  $cardList.children('li').each(function() {
    unselectCard($(this));
  });
}


// Card (un)select
function selectCard($card) {
  _selectCard($card, true);
}
function unselectCard($card) {
  _selectCard($card, false);
}


// (Un)Highlight All Button(s)
function toggleHighlightAllButton(enable) {
  _toggleHidden($highlightAllButton, enable);
}
function toggleUnhighlightAllButton(enable) {
  _toggleHidden($unhighlightAllButton, enable);
}

// Error notifications
function errorNotify(msg) {
  var $errors = $('#errors');
  var $error = $('<li>').text(msg);
  $errors.append($error);
  $errors.fadeIn();
  setTimeout(function() {
    $errors.html('');
    $errors.fadeOut();
  }, 5000);
}

/*
* Helpers
*/
function _selectCard($card, yes) {
  $card.attr('data-selected', yes ? 'yes' : 'no');
}

function _toggleHidden($el, yes) {
  $el[yes ? 'removeClass' : 'addClass']('hidden');
}

$(document).ready(function() {

  var $analyzeButton = $('#analyze');
  var $cardList = $('#cards');
  var $highlightAllButton = $('#highlight_all');
  var $unhighlightAllButton = $('#unhighlight_all');
  var CHECK_STATUS_DELAY = 1000;
  var comments = [];


  $analyzeButton.on('click', function(_) {
    Ajax.submitDocument(analysisStart, submitFailure);
  });


  $highlightAllButton.on('click', function(_) {
    if (comments) {
      Ajax.highlightComments(comments, function() {
        toggleHighlightAllButton(false);
        toggleUnhighlightAllButton(true);
        selectAllCards();
      });
    }
  });

  $unhighlightAllButton.on('click', function(_) {
    Ajax.unhighlightComments(function() {
      toggleUnhighlightAllButton(false);
      toggleHighlightAllButton(true);
      unselectAllCards();
    });
  });


  // Text has been submitted for analysis, so we show
  // the spinner and start polling the backend.
  function analysisStart(location) {
    toggleSpinner(true);

    // Poll the server for the comments
    var id = setInterval(function() {

      Ajax.checkStatus(location, function(response) {

        // If no response, continue
        if (!response) {return;}

        // Otherwise, stop polling
        clearInterval(id);

        // Extract the comments
        comments = response.comments;

        // Hide the spinner
        toggleSpinner(false);

        // Populate and render the cards
        populateCards(comments);
        showCards(true);

        // Initially all cards are selected
        selectAllCards();

        toggleUnhighlightAllButton(true);
        listenOnCards();
      });
    }, CHECK_STATUS_DELAY);
  }

  function submitFailure(err) {
    errorNotify('Sorry, wasn\'t able to submit the text.');
    showCards(false);
  }


  function listenOnCards() {
    $cardList.children('li').on('click', function(_) {

      // Select only $(this) card
      unselectAllCards();
      selectCard($(this));

      // Highlight the corresponding tokens
      Ajax.emphasizeByIndices(
        $(this).attr('data-indices'),
        $(this).attr('data-module'),

        // Upon success, enable (un)highlight all button(s)
        function() {
          toggleHighlightAllButton(true);
          toggleUnhighlightAllButton(true);
        },
        comments);
    });
  }

});

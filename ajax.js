// The interface for making backend calls
var Ajax = (function(){
  return {

    // A helper for those methods that don't have
  	// anything more interesting to report in cases of failure.
    genericFailure: function(func_name) {
      console.log('Ajax error: ' + func_name);
    },

    // Submit the text of the current document for analysis.
    //
    // The handler `success` will get a location argument passed
    // to it, using which, it'll be possible to check the status
    // of the draft.
    submitDocument: function(success, failure) {
      google.script.run
        .withSuccessHandler(success)
        .withFailureHandler(failure || this.genericFailure('submitDocument'))
        .analyze_all();
    },

    // Check the document status using `location`. Note that success
    // and failure handlers have nothing to do with status itself,
    // but are for responding to the ajax call: if the status check
    // call succeeds, `success` gets called, otherwise `failure` does.
    //
    // If the the document at `location` has not been processed,
    // `success` gets called with a falsy value. Otherwise, it gets
    // an options object of form {status: 200, comments: []}.
    checkStatus: function(location, success, failure) {
      google.script.run
        .withSuccessHandler(success)
        .withFailureHandler(failure || this.genericFailure('checkStatus'))
        .checkStatus(location);
    },

    // Highlight the given comments
    highlightComments: function(comments, success) {
      google.script.run
        .withSuccessHandler(success)
        .highlightComments(comments);
    },

    // Unhighlight all comments
    unhighlightComments: function(success) {
      google.script.run
        .withSuccessHandler(success)
        .unhighlight();
    },

    // Highlight indices with the color of module.
    highlightByIndices: function(indices, module, success) {
      google.script.run
        .withSuccessHandler(success)
        .highlightByIndices(indices, module);
    },

    // Comments are passed so that unemphasize can piggyback on highlight
    emphasizeByIndices: function(indices, module, success, comments) {
      google.script.run
        .withSuccessHandler(success)
        .emphasizeByIndices(indices, module, comments);
    },

  };
}());

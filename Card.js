// Comments are presented to the user as `Card`s.
var Card = (function(){

  function Card(options) {
    this.indices = options.indices;
    this.module = options.module;
    this.text = options.text;
  }

  // Render `this` card and append to `$rootEl`
  Card.prototype.appendTo = function($rootEl) {
    var $card = $('<li>')
      .attr('data-module', this.module)
      .attr('data-indices', '' + this.indices);
    var $contents = $('<div>')
      .addClass('body')
      .html(this.text);
    $card.html($contents);
    $rootEl.append($card);
  };

  return Card;
}());

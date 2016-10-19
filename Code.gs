// Note: highlights coordinated with the frontend colors in index.css
var colors = {
  concision: {highlight: '#ffb0fa', emphasis: '#e469dd'},
  clarity: {highlight: '#f9be8b', emphasis: '#fd9842'},
  logic: {highlight: '#8ed6f9', emphasis: '#23b7fd'},
  grammar: {highlight: '#9decb0', emphasis: '#38e562'},
};

// Through `ui` we access the menu, the sidebar, etc.
var ui = DocumentApp.getUi();

/*
* Init
*/
function onOpen() {
  ui.createMenu('Comments')
   .addItem('Start', 'index')
   .addToUi();
}


/*
* Handle menu item clicks
*/
function index() {
  renderToSidebar('index', 'Revise');
}


/*
* API
*/
var production_api_website = 'https://www.writelab.com';
var production_api_root = production_api_website + '/api/';
var production_api_auth = PropertiesService
  .getScriptProperties()
  .getProperty('WRITELAB_BASIC_AUTH');

// Supplies the necessary header, content type and body parameters
// for making requests using `UrlFetchApp.fetch`.
function prepareParams(options) {
  var params = {
    contentType: "application/json",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Basic " + Utilities.base64Encode(production_api_auth)
    }
  };

  if (options) {
    if (options.text)
      params.payload = JSON.stringify({text: options.text});
    params.method = options.method || "get";
  }

  return params;
}

// Submit text for analysis and return the status resource location.
function api_submitText(text) {
  var params = prepareParams({method: "post", text: '' + text});
  var response = UrlFetchApp.fetch(production_api_root, params);
  return response.getAllHeaders().Location;
}

// Given a status resource location, check if the resource is ready.
// If it is, return the comments. If it's not ready, return `undefined`.
function api_getCommentsOrUndefined(location) {
  var params = prepareParams();
  var response = UrlFetchApp.fetch(production_api_website + location, params);
  var status = response.getResponseCode();

  // Still parsing...
  if (status !== 200) {
    return;
  }

  // Comments are ready
  return {
    status: status,
    comments: JSON.parse(response.getContentText()).comments
  };
}


/*
* Highlighting
*/
function hilite(options) {
  var text = options.text || DocumentApp.getActiveDocument().getBody().editAsText();
  text.setBackgroundColor(
    options.start,
    options.end,
    options.color || '#FF0000');
}

function emphasize(options) {
  var text = options.text || DocumentApp.getActiveDocument().getBody().editAsText();
  text.setBackgroundColor(options.start, options.end, options.color);
}

function unhighlight() {
  var body = DocumentApp.getActiveDocument().getBody();
  var n = body.getNumChildren();
  var i;
  for (i = 0; i < n; i++) {
    // Warning: passing `null` as a way of making bg transparent is an undocumented
    // feature. The previous alternative was '#FFFFFF' (white), but that's intrusive.
    body.getChild(i).asText().editAsText().setBackgroundColor(null);
  }
}

function unemphasize(comments) {
  // Highlighting has the effect of unemphasizing by replacing highlight
  // colors with emphasis colors
  highlightComments(comments);
}

function highlightComments(comments) {
  var comment;
  var i, j;
  var indices;
  var index;
  var module;
  for (i = 0; i < comments.length; i++) {
    comment = comments[i];
    indices = comment.indices;
    color = colors[comment.module].highlight;
    for (j = 0; j < indices.length; j++) {
      index = indices[j];
      hilite({start: index[0], end: index[1], color: color});
    }
  }
}


/*
* Ajax
*/

// Analyze the entire document
function analyze_all() {
  var doc = DocumentApp.getActiveDocument();
  return api_submitText(doc.getBody().getText());
}

// Make API request to WL and if successful, highlight the returned comments.
// Note: functionality combined to reduce the number of requests.
function checkStatus(location) {
  var resp = api_getCommentsOrUndefined(location);
  if (resp) {
    highlightComments(resp.comments);
  }
  return resp;
}

// Highlight indices
function highlightByIndices(indices, module) {
  indices = indices.split(',').map(function(str) {
    return parseInt(str, 10);
  });
  unhighlight();
  hilite({start: indices[0], end: indices[1], color: colors[module].highlight});
}

function emphasizeByIndices(indices, module, comments) {
  unemphasize(comments);
  indices = indices.split(',').map(function(str) {
    return parseInt(str, 10);
  });
  emphasize({start: indices[0], end: indices[1], color: colors[module].emphasis});
}



/*
* Helpers
*/
// Evaluates a given template and assigns its contents
// to the sidebar.
function renderToSidebar(template, title) {
  ui.showSidebar(HtmlService
    .createTemplateFromFile(template)
    .evaluate()
    .setTitle(title)
    .setWidth(300)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME));
}

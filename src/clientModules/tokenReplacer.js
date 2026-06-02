// Replace <your_app_token> in code blocks with actual tokens from cookies
// Ported from bugsee_theme/js/main.js lines 329-352

function getCookie(name) {
  var matches = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function onRouteDidUpdate() {
  if (typeof window === 'undefined') return;

  var rawAppTokens = getCookie('_bgs_apptokens');
  if (!rawAppTokens) return;

  var appTokens = {};
  rawAppTokens.split(';').forEach(function (token) {
    var segments = token.split(':');
    if (!segments || segments.length !== 2) return;
    appTokens[segments[0]] = segments[1];
  });

  for (var prop in appTokens) {
    if (appTokens.hasOwnProperty(prop) && appTokens[prop] && document.location.pathname.indexOf(prop) >= 0) {
      Array.from(document.querySelectorAll('code') || []).forEach(function (codeElem) {
        codeElem.innerHTML = codeElem.innerHTML.replace('&lt;your_app_token&gt;', appTokens[prop]);
      });
      break;
    }
  }
}

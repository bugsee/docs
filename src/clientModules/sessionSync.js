// Session sync with app.bugsee.com via hidden iframe + MessagePort
// Ported from bugsee_theme/js/main.js lines 354-532

const FRAME_STYLE = {
  width: '1px',
  height: '1px',
  position: 'fixed',
  left: '0',
  right: '0',
  transform: 'translate(-9999px, -9999px)',
  'pointer-events': 'none',
};
const FRAME_ID = 'bgs__SyncFrame';

// MD5 implementation for Gravatar
// Source: http://www.myersdaily.org/joseph/javascript/md5-text.html
function md5cycle(e,t){var n=e[0],r=e[1],i=e[2],s=e[3];n=ff(n,r,i,s,t[0],7,-680876936);s=ff(s,n,r,i,t[1],12,-389564586);i=ff(i,s,n,r,t[2],17,606105819);r=ff(r,i,s,n,t[3],22,-1044525330);n=ff(n,r,i,s,t[4],7,-176418897);s=ff(s,n,r,i,t[5],12,1200080426);i=ff(i,s,n,r,t[6],17,-1473231341);r=ff(r,i,s,n,t[7],22,-45705983);n=ff(n,r,i,s,t[8],7,1770035416);s=ff(s,n,r,i,t[9],12,-1958414417);i=ff(i,s,n,r,t[10],17,-42063);r=ff(r,i,s,n,t[11],22,-1990404162);n=ff(n,r,i,s,t[12],7,1804603682);s=ff(s,n,r,i,t[13],12,-40341101);i=ff(i,s,n,r,t[14],17,-1502002290);r=ff(r,i,s,n,t[15],22,1236535329);n=gg(n,r,i,s,t[1],5,-165796510);s=gg(s,n,r,i,t[6],9,-1069501632);i=gg(i,s,n,r,t[11],14,643717713);r=gg(r,i,s,n,t[0],20,-373897302);n=gg(n,r,i,s,t[5],5,-701558691);s=gg(s,n,r,i,t[10],9,38016083);i=gg(i,s,n,r,t[15],14,-660478335);r=gg(r,i,s,n,t[4],20,-405537848);n=gg(n,r,i,s,t[9],5,568446438);s=gg(s,n,r,i,t[14],9,-1019803690);i=gg(i,s,n,r,t[3],14,-187363961);r=gg(r,i,s,n,t[8],20,1163531501);n=gg(n,r,i,s,t[13],5,-1444681467);s=gg(s,n,r,i,t[2],9,-51403784);i=gg(i,s,n,r,t[7],14,1735328473);r=gg(r,i,s,n,t[12],20,-1926607734);n=hh(n,r,i,s,t[5],4,-378558);s=hh(s,n,r,i,t[8],11,-2022574463);i=hh(i,s,n,r,t[11],16,1839030562);r=hh(r,i,s,n,t[14],23,-35309556);n=hh(n,r,i,s,t[1],4,-1530992060);s=hh(s,n,r,i,t[4],11,1272893353);i=hh(i,s,n,r,t[7],16,-155497632);r=hh(r,i,s,n,t[10],23,-1094730640);n=hh(n,r,i,s,t[13],4,681279174);s=hh(s,n,r,i,t[0],11,-358537222);i=hh(i,s,n,r,t[3],16,-722521979);r=hh(r,i,s,n,t[6],23,76029189);n=hh(n,r,i,s,t[9],4,-640364487);s=hh(s,n,r,i,t[12],11,-421815835);i=hh(i,s,n,r,t[15],16,530742520);r=hh(r,i,s,n,t[2],23,-995338651);n=ii(n,r,i,s,t[0],6,-198630844);s=ii(s,n,r,i,t[7],10,1126891415);i=ii(i,s,n,r,t[14],15,-1416354905);r=ii(r,i,s,n,t[5],21,-57434055);n=ii(n,r,i,s,t[12],6,1700485571);s=ii(s,n,r,i,t[3],10,-1894986606);i=ii(i,s,n,r,t[10],15,-1051523);r=ii(r,i,s,n,t[1],21,-2054922799);n=ii(n,r,i,s,t[8],6,1873313359);s=ii(s,n,r,i,t[15],10,-30611744);i=ii(i,s,n,r,t[6],15,-1560198380);r=ii(r,i,s,n,t[13],21,1309151649);n=ii(n,r,i,s,t[4],6,-145523070);s=ii(s,n,r,i,t[11],10,-1120210379);i=ii(i,s,n,r,t[2],15,718787259);r=ii(r,i,s,n,t[9],21,-343485551);e[0]=add32(n,e[0]);e[1]=add32(r,e[1]);e[2]=add32(i,e[2]);e[3]=add32(s,e[3])}
function cmn(e,t,n,r,i,s){t=add32(add32(t,e),add32(r,s));return add32(t<<i|t>>>32-i,n)}
function ff(e,t,n,r,i,s,o){return cmn(t&n|~t&r,e,t,i,s,o)}
function gg(e,t,n,r,i,s,o){return cmn(t&r|n&~r,e,t,i,s,o)}
function hh(e,t,n,r,i,s,o){return cmn(t^n^r,e,t,i,s,o)}
function ii(e,t,n,r,i,s,o){return cmn(n^(t|~r),e,t,i,s,o)}
function md51(e){var t=e.length,n=[1732584193,-271733879,-1732584194,271733878],r;for(r=64;r<=e.length;r+=64){md5cycle(n,md5blk(e.substring(r-64,r)))}e=e.substring(r-64);var i=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(r=0;r<e.length;r++)i[r>>2]|=e.charCodeAt(r)<<(r%4<<3);i[r>>2]|=128<<(r%4<<3);if(r>55){md5cycle(n,i);for(r=0;r<16;r++)i[r]=0}i[14]=t*8;md5cycle(n,i);return n}
function md5blk(e){var t=[],n;for(n=0;n<64;n+=4){t[n>>2]=e.charCodeAt(n)+(e.charCodeAt(n+1)<<8)+(e.charCodeAt(n+2)<<16)+(e.charCodeAt(n+3)<<24)}return t}
var hex_chr='0123456789abcdef'.split('');
function rhex(e){var t='',n=0;for(;n<4;n++)t+=hex_chr[e>>n*8+4&15]+hex_chr[e>>n*8&15];return t}
function hex(e){for(var t=0;t<e.length;t++)e[t]=rhex(e[t]);return e.join('')}
function md5(e){return hex(md51(e))}
var add32 = function(e,t){return e+t&4294967295};
if(md5('hello')!='5d41402abc4b2a76b9719d911017c592'){add32=function(e,t){var n=(e&65535)+(t&65535),r=(e>>16)+(t>>16)+(n>>16);return r<<16|n&65535}}

function generateGravatar(email, options) {
  options = options || {};
  options = {
    size: options.size || '50',
    rating: options.rating || 'g',
    secure: options.secure || (location.protocol === 'https:'),
    backup: options.backup || '',
  };
  email = email.trim().toLowerCase();
  var base = options.secure ? 'https://secure.gravatar.com/avatar/' : 'http://www.gravatar.com/avatar/';
  var params = [];
  if (options.rating) params.push('r=' + options.rating);
  if (options.backup) params.push('d=' + encodeURIComponent(options.backup));
  if (options.size) params.push('s=' + options.size);
  return base + md5(email) + '?' + params.join('&');
}

let initialized = false;

export function onRouteDidUpdate() {
  if (typeof window === 'undefined' || initialized) return;
  initialized = true;

  var Tawk_API = window.Tawk_API || {};
  window.Tawk_LoadStart = window.Tawk_LoadStart || new Date();
  if (!window.Tawk_API_Ready) {
    window.Tawk_API_Ready = new Promise(function (resolve) {
      Tawk_API.onLoad = resolve;
    });
    window.Tawk_API = Tawk_API;
  }

  var syncFrame;
  var sessionData;
  var msgChannel = new MessageChannel();

  msgChannel.port1.onmessage = onMessage;
  createFrame();

  function createFrame() {
    syncFrame = document.getElementById(FRAME_ID);
    if (!syncFrame) {
      syncFrame = document.createElement('IFRAME');
      for (var p in FRAME_STYLE) {
        syncFrame.style[p] = FRAME_STYLE[p];
      }
      syncFrame.addEventListener('load', onFrameLoaded);
      syncFrame.addEventListener('error', onFrameError);
      syncFrame.id = FRAME_ID;
      syncFrame.name = FRAME_ID;
      syncFrame.title = 'Bugsee Sync Frame';
      syncFrame.src = 'https://app.bugsee.com/frame.html';
      document.body.appendChild(syncFrame);
    } else {
      onFrameLoaded();
    }
  }

  function onFrameLoaded() {
    if (syncFrame) {
      syncFrame.contentWindow.postMessage(
        JSON.stringify({bgsEvt: 'setup', payload: {}}),
        '*',
        [msgChannel.port2]
      );
      notifyFrame('getsession');
    }
    setTimeout(updateSession, 300);
  }

  function onFrameError() {
    updateSession();
  }

  function notifyFrame(event, payload) {
    if (syncFrame) {
      msgChannel.port1.postMessage(
        JSON.stringify({bgsEvt: event, payload: payload || {}}),
        []
      );
    }
  }

  function onMessage(e) {
    if (!e || !e.data) {
      sessionData = null;
      updateSession();
      return;
    }
    var decodedData;
    try {
      decodedData = JSON.parse(e.data);
    } catch (ex) {}
    if (!decodedData || !decodedData.bgsEvt) {
      sessionData = null;
      updateSession();
      return;
    }
    if (decodedData.bgsEvt === 'session') {
      sessionData = decodedData.payload;
      updateSession();
    }
  }

  function updateSession() {
    var isAuthenticated = !!(sessionData && sessionData.user && !sessionData.user.demo);

    updateNavbar(isAuthenticated);

    if (window.Tawk_API_Ready) {
      window.Tawk_API_Ready.then(function () {
        if (window.Tawk_API && window.Tawk_API.setAttributes) {
          var attrs = {};
          if (sessionData && sessionData.user) {
            attrs.name = sessionData.user.name;
            attrs.email = sessionData.user.email;
          } else {
            attrs.name = 'Guest';
            attrs.email = ' ';
          }
          window.Tawk_API.setAttributes(attrs, function () {});
        }
      });
    }
  }

  function updateNavbar(isAuthenticated) {
    var rightItems = document.querySelector('.navbar__items--right');
    if (!rightItems) return;

    // Find the auth links
    var demoLink = rightItems.querySelector('a[href*="login?as=demo"]');
    var loginLink = rightItems.querySelector('a[href*="signin"]');
    var signupLink = rightItems.querySelector('.navbar-signup-link');

    // Remove any previously injected user profile
    var existingProfile = rightItems.querySelector('.navbar-user-profile');
    if (existingProfile) existingProfile.remove();

    if (isAuthenticated && sessionData && sessionData.user) {
      // Hide auth links
      if (demoLink) demoLink.style.display = 'none';
      if (loginLink) loginLink.style.display = 'none';
      if (signupLink) signupLink.style.display = 'none';

      // Create user profile link
      var profileLink = document.createElement('a');
      profileLink.href = 'https://app.bugsee.com/';
      profileLink.target = '_blank';
      profileLink.rel = 'noopener noreferrer';
      profileLink.className = 'navbar__item navbar__link navbar-user-profile';

      var dpr = window.devicePixelRatio || 1;
      var avatarSize = Math.round(28 * dpr);
      var avatarUrl = generateGravatar(sessionData.user.email || '', {
        size: String(avatarSize),
        backup: 'mp',
      });

      var orgName = (sessionData.user.organization || sessionData.user.org || '');
      var nameHtml = '<span class="navbar-user-name">' + (sessionData.user.name || 'Dashboard') + '</span>';
      if (orgName) {
        nameHtml += '<span class="navbar-user-org">' + orgName + '</span>';
      }

      profileLink.innerHTML =
        '<img src="' + avatarUrl + '" alt="" class="navbar-user-avatar" />' +
        '<span class="navbar-user-info">' + nameHtml + '</span>';

      // Insert before the color mode toggle
      var toggleWrapper = rightItems.querySelector('[class*="colorModeToggle"]');
      if (toggleWrapper) {
        rightItems.insertBefore(profileLink, toggleWrapper);
      } else {
        rightItems.appendChild(profileLink);
      }
    } else {
      // Show auth links
      if (demoLink) demoLink.style.display = '';
      if (loginLink) loginLink.style.display = '';
      if (signupLink) signupLink.style.display = '';
    }
  }
}

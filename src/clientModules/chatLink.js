// Handle chat toggle links in footer
// Ported from bugsee_theme/js/main.js lines 318-327

export function onRouteDidUpdate() {
  if (typeof window === 'undefined') return;

  Array.from(document.querySelectorAll('.bs-toggle-chat') || []).forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      if (window.Tawk_API) {
        window.Tawk_API.toggle();
      }
    });
  });
}

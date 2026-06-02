// Add data-title attributes to table cells for responsive mobile layout
// Ported from bugsee_theme/js/main.js lines 203-243

export function onRouteDidUpdate() {
  if (typeof window === 'undefined') return;

  function setTdDataTitle(tableElement, index, html, customClass) {
    var foundElements = tableElement.querySelectorAll(
      'td' + (customClass ? '.' + customClass : '') + ':nth-child(' + (+index + 1) + ')'
    );
    if (foundElements) {
      Array.from(foundElements).forEach(function (element) {
        element.setAttribute('data-title', html);
      });
    }
  }

  // Regular tables
  var tables = document.querySelectorAll('table:not(#overview)');
  Array.from(tables).forEach(function (table) {
    var headers = table.querySelectorAll('thead tr:last-child th');
    Array.from(headers).forEach(function (header, index) {
      setTdDataTitle(table, index, header.innerHTML);
    });
    if (table.querySelectorAll('tr > td:first-child > strong').length) {
      table.classList.add('first-col-th-like');
    }
  });

  // Overview table
  var overviewTable = document.querySelector('table#overview');
  if (overviewTable) {
    var mainHeaders = overviewTable.querySelectorAll('thead tr:first-child th span');
    Array.from(mainHeaders).forEach(function (header, index) {
      setTdDataTitle(overviewTable, index, header.innerHTML);
    });
  }
}

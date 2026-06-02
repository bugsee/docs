// AI Page Actions split button: Copy page + dropdown with View/ChatGPT/Claude

var BASE_URL = 'https://docs.bugsee.com';

function getMarkdownPath() {
  var path = window.location.pathname;
  path = path.replace(/\/$/, '');
  if (!path || path === '') path = '/index';
  return path + '.md';
}

function getFullMarkdownUrl(mdPath) {
  return BASE_URL + mdPath;
}

function buildPrompt(mdUrl) {
  return 'Read from ' + mdUrl + ' so I can ask questions about its contents';
}

// Prefetch the .md file
function prefetchMarkdown(mdPath) {
  var oldLink = document.querySelector('link[data-ai-prefetch]');
  if (oldLink) oldLink.remove();

  var link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = mdPath;
  link.as = 'fetch';
  link.setAttribute('data-ai-prefetch', '');
  document.head.appendChild(link);
}

// Flash "Copied!" (success) / "Failed" (rejection) on the given label
// for 2s, then restore the original text. Shared between Copy page
// (which copies the markdown body) and Copy Markdown URL (which copies
// just the URL string) so both report status consistently.
function flashLabel(labelEl, work) {
  var origText = labelEl.textContent;
  work
    .then(function () {
      labelEl.textContent = 'Copied!';
      setTimeout(function () { labelEl.textContent = origText; }, 2000);
    })
    .catch(function (err) {
      console.error('Failed to copy:', err);
      labelEl.textContent = 'Failed';
      setTimeout(function () { labelEl.textContent = origText; }, 2000);
    });
}

function copyMarkdown(mdPath, labelEl) {
  flashLabel(labelEl, fetch(mdPath)
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.text();
    })
    .then(function (text) {
      return navigator.clipboard.writeText(text);
    })
  );
}

function copyMarkdownUrl(mdUrl, labelEl) {
  flashLabel(labelEl, navigator.clipboard.writeText(mdUrl));
}

function createSplitButton() {
  var mdPath = getMarkdownPath();
  var mdUrl = getFullMarkdownUrl(mdPath);
  var prompt = buildPrompt(mdUrl);
  var encodedPrompt = encodeURIComponent(prompt);

  var container = document.createElement('div');
  container.className = 'ai-page-actions';

  // Split button wrapper
  var splitBtn = document.createElement('div');
  splitBtn.className = 'ai-page-actions__split';

  // Main button (Copy page)
  var mainBtn = document.createElement('button');
  mainBtn.className = 'ai-page-actions__main';
  mainBtn.type = 'button';
  mainBtn.innerHTML =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>' +
    '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>' +
    '</svg>' +
    '<span class="ai-page-actions__label">Copy page</span>';

  var mainLabel = mainBtn.querySelector('.ai-page-actions__label');
  mainBtn.addEventListener('click', function () {
    copyMarkdown(mdPath, mainLabel);
  });

  // Chevron toggle
  var toggleBtn = document.createElement('button');
  toggleBtn.className = 'ai-page-actions__toggle';
  toggleBtn.type = 'button';
  toggleBtn.innerHTML =
    '<svg class="ai-page-actions__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
    '<polyline points="6 9 12 15 18 9"></polyline>' +
    '</svg>';

  toggleBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    container.classList.toggle('ai-page-actions--open');
  });

  splitBtn.appendChild(mainBtn);
  splitBtn.appendChild(toggleBtn);

  // Dropdown menu
  var menu = document.createElement('div');
  menu.className = 'ai-page-actions__menu';

  var items = [
    {
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
      label: 'Copy page',
      sublabel: 'Copy page as Markdown for LLMs',
      action: 'copy',
    },
    {
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>',
      label: 'View as Markdown',
      sublabel: 'View this page as plain text',
      action: 'view',
      href: mdPath,
    },
    {
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17H7A5 5 0 0 1 7 7h2"></path><path d="M15 7h2a5 5 0 1 1 0 10h-2"></path><line x1="8" y1="12" x2="16" y2="12"></line></svg>',
      label: 'Copy Markdown URL',
      sublabel: 'Copy the .md URL so AI agents can fetch it',
      action: 'copy-url',
      href: mdUrl,
    },
    {
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.282 0H1.718C.77 0 0 .77 0 1.718v20.564C0 23.23.77 24 1.718 24h20.564C23.23 24 24 23.23 24 22.282V1.718C24 .77 23.23 0 22.282 0zM12 20.4c-4.636 0-8.4-3.764-8.4-8.4S7.364 3.6 12 3.6s8.4 3.764 8.4 8.4-3.764 8.4-8.4 8.4zm0-14.7a6.3 6.3 0 1 0 0 12.6 6.3 6.3 0 0 0 0-12.6z"/></svg>',
      label: 'Open in ChatGPT',
      sublabel: 'Ask ChatGPT questions about this page',
      action: 'link',
      href: 'https://chatgpt.com/?hint=search&q=' + encodedPrompt,
    },
    {
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4.709 15.955l4.397-2.006a.4.4 0 0 0 .2-.2l2.006-4.397a.2.2 0 0 1 .364 0l2.006 4.397a.4.4 0 0 0 .2.2l4.397 2.006a.2.2 0 0 1 0 .364l-4.397 2.006a.4.4 0 0 0-.2.2l-2.006 4.397a.2.2 0 0 1-.364 0l-2.006-4.397a.4.4 0 0 0-.2-.2l-4.397-2.006a.2.2 0 0 1 0-.364z"/></svg>',
      label: 'Open in Claude',
      sublabel: 'Ask Claude questions about this page',
      action: 'link',
      href: 'https://claude.ai/new?q=' + encodedPrompt,
    },
  ];

  items.forEach(function (item, index) {
    if (index > 0) {
      var sep = document.createElement('div');
      sep.className = 'ai-page-actions__sep';
      menu.appendChild(sep);
    }

    var el;
    if (item.action === 'link') {
      el = document.createElement('a');
      el.href = item.href;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    } else {
      el = document.createElement('button');
      el.type = 'button';
    }
    el.className = 'ai-page-actions__item';

    el.innerHTML =
      '<span class="ai-page-actions__item-icon">' + item.icon + '</span>' +
      '<span class="ai-page-actions__item-text">' +
      '<span class="ai-page-actions__item-label">' + item.label + '</span>' +
      '<span class="ai-page-actions__item-sublabel">' + item.sublabel + '</span>' +
      '</span>';

    if (item.action === 'link') {
      el.innerHTML +=
        '<svg class="ai-page-actions__external" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>' +
        '<polyline points="15 3 21 3 21 9"></polyline>' +
        '<line x1="10" y1="14" x2="21" y2="3"></line>' +
        '</svg>';
    }

    if (item.action === 'copy') {
      el.addEventListener('click', function () {
        var label = el.querySelector('.ai-page-actions__item-label');
        copyMarkdown(mdPath, label);
        container.classList.remove('ai-page-actions--open');
      });
    } else if (item.action === 'copy-url') {
      el.addEventListener('click', function () {
        var label = el.querySelector('.ai-page-actions__item-label');
        copyMarkdownUrl(item.href, label);
        // Deliberately do NOT close the menu — the "Copied!" flash on
        // the in-menu label IS the action's only feedback (unlike
        // Copy page, where the user usually clicks the main split
        // button and sees the flash on the always-visible main label).
        // The outside-click handler will close the menu when the user
        // moves on.
      });
    } else if (item.action === 'view') {
      el.addEventListener('click', function () {
        window.open(item.href, '_blank');
      });
    }

    menu.appendChild(el);
  });

  container.appendChild(splitBtn);
  container.appendChild(menu);

  // Close on outside click
  document.addEventListener('click', function () {
    container.classList.remove('ai-page-actions--open');
  });

  menu.addEventListener('click', function (e) {
    e.stopPropagation();
  });

  return container;
}

export function onRouteDidUpdate() {
  if (typeof window === 'undefined') return;

  var existing = document.querySelector('.ai-page-actions');
  if (existing) existing.remove();

  // Insert into the breadcrumb row so it aligns with the nav line
  var breadcrumbs = document.querySelector('.theme-doc-breadcrumbs');
  if (!breadcrumbs) return;

  // Prefetch the .md file so copy is instant
  prefetchMarkdown(getMarkdownPath());

  var dropdown = createSplitButton();
  breadcrumbs.appendChild(dropdown);
}

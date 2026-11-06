/* RAMA-UI-JS v1: local colour customisation for the SearXNG AQUA theme, applied in the shipped theme bundles. */

;(function () {
  'use strict';

  if (window.__ramaColours) return;
  window.__ramaColours = true;

  var STORE_KEY = 'rama-user-colours';
  var FIELDS = ['accent', 'bg', 'surface', 'ink', 'muted'];
  var SOURCE = {
    accent: '--accent-fill',
    bg: '--ground',
    surface: '--surface',
    ink: '--ink',
    muted: '--muted'
  };
  var FALLBACK = {
    accent: '#e11235',
    bg: '#1e2030',
    surface: '#282a3b',
    ink: '#eef2f6',
    muted: '#aab4c5'
  };
  var LABELS = {
    accent: 'Accent',
    bg: 'Background',
    surface: 'Cards',
    ink: 'Text',
    muted: 'Muted text'
  };
  var TOP_KEY = 'rama-back-to-top';

  function hex2rgb(value) {
    var h = String(value || '').trim().replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    if (!/^[0-9a-f]{6}$/i.test(h)) return null;
    var n = parseInt(h, 16);
    return [n >> 16 & 255, n >> 8 & 255, n & 255];
  }

  function channel(value) {
    value = Math.max(0, Math.min(255, Math.round(value)));
    return (value < 16 ? '0' : '') + value.toString(16);
  }

  function rgb2hex(r, g, b) {
    return '#' + channel(r) + channel(g) + channel(b);
  }

  function normalizeHex(value) {
    var rgb = hex2rgb(value);
    return rgb ? rgb2hex(rgb[0], rgb[1], rgb[2]) : null;
  }

  function mix(a, b, amount) {
    var A = hex2rgb(a);
    var B = hex2rgb(b);
    if (!A || !B) return a;
    return rgb2hex(
      A[0] + (B[0] - A[0]) * amount,
      A[1] + (B[1] - A[1]) * amount,
      A[2] + (B[2] - A[2]) * amount
    );
  }

  function alpha(colour, amount) {
    var rgb = hex2rgb(colour);
    if (!rgb) return colour;
    return 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + amount + ')';
  }

  function luminance(colour) {
    var rgb = hex2rgb(colour);
    if (!rgb) return 0;
    var v = rgb.map(function (value) {
      value /= 255;
      return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  }

  function readableOn(colour) {
    return luminance(colour) > 0.42 ? '#111318' : '#ffffff';
  }

  var iconState = null;

  function snapshotIcons() {
    iconState = [];
    var links = document.querySelectorAll('link[rel~="icon"]');
    for (var i = 0; i < links.length; i++) {
      iconState.push({
        el: links[i],
        href: links[i].getAttribute('href'),
        type: links[i].getAttribute('type'),
        sizes: links[i].getAttribute('sizes')
      });
    }
  }

  function faviconColour(accent) {
    return luminance(accent) < 0.12 ? mix(accent, '#ffffff', 0.35) : accent;
  }

  function updateFavicon(colour) {
    if (!iconState) snapshotIcons();
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">' +
      '<circle cx="10" cy="10" r="6.5" stroke="' + colour + '" stroke-width="2.5"/>' +
      '<path stroke="' + colour + '" stroke-linecap="round" stroke-width="2.5" d="m15 15 6 6"/></svg>';
    var href = 'data:image/svg+xml,' + encodeURIComponent(svg);
    if (!iconState.length) {
      var link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
      iconState.push({ el: link, href: null, type: null, sizes: null });
    }
    iconState.forEach(function (icon) {
      icon.el.setAttribute('type', 'image/svg+xml');
      icon.el.removeAttribute('sizes');
      icon.el.setAttribute('href', href);
    });
  }

  function restoreFavicon() {
    if (!iconState) return;
    iconState.forEach(function (icon) {
      if (icon.href === null) icon.el.removeAttribute('href');
      else icon.el.setAttribute('href', icon.href);
      if (icon.type === null) icon.el.removeAttribute('type');
      else icon.el.setAttribute('type', icon.type);
      if (icon.sizes === null) icon.el.removeAttribute('sizes');
      else icon.el.setAttribute('sizes', icon.sizes);
    });
  }

  function loadSaved() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch (error) {
      return null;
    }
  }

  function storeSaved(colours) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(colours));
    } catch (error) {}
  }

  function clearSaved() {
    try {
      localStorage.removeItem(STORE_KEY);
    } catch (error) {}
  }

  function topPosition() {
    try {
      return localStorage.getItem(TOP_KEY) === 'right' ? 'right' : 'left';
    } catch (error) {
      return 'left';
    }
  }

  function applyTopPosition(value) {
    document.documentElement.setAttribute(
      'data-rama-back-to-top',
      value === 'right' ? 'right' : 'left'
    );
  }

  function saveTopPosition(value) {
    try {
      localStorage.setItem(TOP_KEY, value === 'right' ? 'right' : 'left');
    } catch (error) {}
  }

  function bindBackToTop() {
    var button = document.getElementById('backToTop');
    if (!button || button.getAttribute('data-rama-bound') === '1') return;
    var link = button.querySelector('a');
    if (!link) return;
    button.setAttribute('data-rama-bound', '1');
    link.addEventListener('click', function (event) {
      event.preventDefault();
      // The theme scrolls <body>, not the window; href="#" only changed the hash.
      var scroller = document.body;
      try {
        scroller.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } catch (error) {
        scroller.scrollTop = 0;
      }
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } catch (error) {
        window.scrollTo(0, 0);
      }
    });
  }

  function savedColours() {
    var saved = loadSaved();
    if (!saved) return null;
    var colours = {};
    FIELDS.forEach(function (field) {
      colours[field] = normalizeHex(saved[field]) || FALLBACK[field];
    });
    return colours;
  }

  function themeColours() {
    var computed = getComputedStyle(document.documentElement);
    var colours = {};
    FIELDS.forEach(function (field) {
      colours[field] = normalizeHex(computed.getPropertyValue(SOURCE[field])) || FALLBACK[field];
    });
    return colours;
  }

  function tokens(colours) {
    var accent = colours.accent;
    var accentLight = luminance(accent) < 0.35 ? mix(accent, '#ffffff', 0.3) : accent;
    var accentDark = mix(accent, '#000000', 0.18);
    var ground = colours.bg;
    var ground2 = mix(ground, '#000000', 0.18);
    var surface = colours.surface;
    var surface2 = mix(surface, colours.ink, 0.07);
    var surface3 = mix(surface, colours.ink, 0.13);
    var ink = colours.ink;
    var muted = colours.muted;
    var faint = mix(ink, ground, 0.55);
    var line = alpha(ink, 0.08);
    var line2 = alpha(ink, 0.16);
    var onAccent = readableOn(accent);
    var inkRgb = hex2rgb(ink) || [0, 0, 0];

    return {
      '--accent': accentLight,
      '--accent-fill': accent,
      '--accent-fill-2': accentDark,
      '--glow': alpha(accent, 0.16),
      '--rama-home-glow': alpha(accentLight, 0.14),
      '--rama-home-glow-2': alpha(muted, 0.05),

      '--ground': ground,
      '--ground-2': ground2,
      '--surface': surface,
      '--surface-2': surface2,
      '--surface-3': surface3,
      '--ink': ink,
      '--muted': muted,
      '--faint': faint,
      '--line': line,
      '--line-2': line2,

      '--color-base-background': ground,
      '--color-base-background-mobile': ground,
      '--color-header-background': ground,
      '--color-footer-background': ground2,
      '--color-result-detail-background': ground,
      '--color-result-keyvalue-odd': ground,
      '--color-toolkit-dialog-background': ground,
      '--color-toolkit-engine-tooltip-background': ground,
      '--color-toolkit-checkbox-label-background': ground,

      '--color-result-background': surface,
      '--color-sidebar-background': surface,
      '--color-search-background': surface,
      '--color-autocomplete-background': surface,
      '--color-autocomplete-background-hover': surface3,
      '--color-answer-background': surface,
      '--color-backtotop-background': surface2,
      '--color-toolkit-select-background': surface,
      '--color-toolkit-select-background-hover': surface2,
      '--color-toolkit-checkbox-onoff-off-background': surface2,
      '--color-toolkit-checkbox-onoff-on-background': alpha(accent, 0.28),
      '--color-toolkit-kbd-background': surface2,
      '--color-toolkit-badge-background': surface2,
      '--color-doc-code-background': surface2,
      '--color-favicon-background-color': surface2,
      '--color-show-btn-background': surface2,
      '--color-result-keyvalue-even': surface2,
      '--color-settings-table-group-background': surface2,

      '--color-base-font': ink,
      '--color-base-font-rgb': inkRgb.join(', '),
      '--color-result-link-font': ink,
      '--color-result-link-font-highlight': ink,
      '--color-result-url-font': ink,
      '--color-result-detail-font': ink,
      '--color-search-font': ink,
      '--color-sidebar-font': ink,
      '--color-result-image-span-font': ink,
      '--color-toolkit-input-text-font': ink,
      '--color-toolkit-kbd-font': ink,
      '--color-toolkit-badge-font': ink,
      '--color-answer-font': ink,
      '--color-doc-code': ink,
      '--color-show-btn-font': ink,
      '--color-autocomplete-font': ink,
      '--color-btn-font': onAccent,
      '--color-toolkit-checkbox-onoff-on-mark-color': onAccent,

      '--color-result-search-url-font': muted,
      '--color-result-publishdate-font': muted,
      '--color-result-engines-font': muted,
      '--color-result-detail-label-font': muted,
      '--color-settings-engine-description-font': muted,
      '--color-line-number': muted,
      '--color-toolkit-checkbox-onoff-off-mark-background': faint,

      '--color-btn-background': accent,
      '--color-search-background-hover': accentLight,
      '--color-categories-item-selected-font': accentLight,
      '--color-categories-item-border-selected': accentLight,
      '--color-result-vim-arrow': accent,
      '--color-toolkit-checkbox-input-border': accent,
      '--color-toolkit-checkbox-onoff-on-mark-background': accent,
      '--color-url-font': accentLight,
      '--color-url-visited-font': accentDark,
      '--color-result-link-visited-font': accentLight,
      '--color-result-detail-link': accentLight,
      '--color-result-description-highlight-font': accentLight,
      '--color-bar-chart-primary': accent,
      '--color-bar-chart-secondary': accentDark,
      '--color-result-vim-selected': surface3,

      '--color-result-border': line,
      '--color-sidebar-border': line,
      '--color-header-border': line,
      '--color-footer-border': line,
      '--color-result-detail-hr': line,
      '--color-toolkit-dialog-border': line,
      '--color-toolkit-engine-tooltip-border': line,
      '--color-toolkit-checkbox-label-border': line,
      '--color-toolkit-tabs-label-border': line,
      '--color-toolkit-tabs-section-border': line,
      '--color-result-search-url-border': line,
      '--color-result-keyvalue-col-table': line,
      '--color-toolkit-select-border': line2,
      '--color-autocomplete-border': line2,
      '--color-favicon-border-color': line2,
      '--color-backtotop-border': line2,
      '--color-settings-tr-hover': alpha(ink, 0.05),
      '--color-loading-indicator-gap': ink
    };
  }

  function applyColours(colours) {
    var values = tokens(colours);
    // :root:root matches the theme's dark-mode specificity; appended last, it wins.
    var css = ':root:root{';
    Object.keys(values).forEach(function (name) {
      css += name + ':' + values[name] + ';';
    });
    css += '}';

    var style = document.getElementById('rama-user-colours-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'rama-user-colours-style';
      (document.head || document.documentElement).appendChild(style);
    }
    style.textContent = css;
    document.documentElement.style.colorScheme = luminance(colours.bg) > 0.55 ? 'light' : 'dark';
    updateFavicon(faviconColour(colours.accent));
  }

  function resetColours() {
    clearSaved();
    var style = document.getElementById('rama-user-colours-style');
    if (style && style.parentNode) style.parentNode.removeChild(style);
    document.documentElement.style.colorScheme = '';
    restoreFavicon();
  }

  function collectColours(fieldset) {
    var colours = {};
    fieldset.querySelectorAll('input[data-rama-colour]').forEach(function (input) {
      var field = input.getAttribute('data-rama-colour');
      colours[field] = normalizeHex(input.value) || FALLBACK[field];
    });
    return colours;
  }

  function syncPickers(fieldset, colours) {
    fieldset.querySelectorAll('input[data-rama-colour]').forEach(function (input) {
      var field = input.getAttribute('data-rama-colour');
      input.value = colours[field] || FALLBACK[field];
    });
  }

  function buildColoursUI() {
    var section = document.getElementById('tab-content-ui');
    if (!section || document.getElementById('rama-colours')) return;

    var colours = savedColours() || themeColours();
    var fieldset = document.createElement('fieldset');
    fieldset.id = 'rama-colours';

    var html = '<legend>Theme colours</legend><div class="value"><div class="rama-color-grid">';
    FIELDS.forEach(function (field) {
      html += '<label class="rama-color"><span>' + LABELS[field] + '</span>' +
        '<input type="color" data-rama-colour="' + field + '" value="' + colours[field] +
        '" aria-label="' + LABELS[field] + ' colour"></label>';
    });
    html += '</div><div class="rama-color-actions">' +
      '<button type="button" class="rama-color-reset">Reset to theme</button></div></div>' +
      '<div class="description">Choose your own accent, background and text colours. ' +
      'Saved in this browser and applied instantly on every page.</div>';
    fieldset.innerHTML = html;
    section.appendChild(fieldset);

    fieldset.addEventListener('input', function (event) {
      var input = event.target;
      if (!input || input.type !== 'color' || !input.getAttribute('data-rama-colour')) return;
      var current = collectColours(fieldset);
      storeSaved(current);
      applyColours(current);
    });

    fieldset.addEventListener('click', function (event) {
      var target = event.target;
      var reset = target && target.closest ? target.closest('.rama-color-reset') : null;
      if (!reset) return;
      resetColours();
      syncPickers(fieldset, themeColours());
    });
  }

  function buildLayoutUI() {
    var section = document.getElementById('tab-content-ui');
    if (!section || document.getElementById('rama-layout')) return;

    var fieldset = document.createElement('fieldset');
    fieldset.id = 'rama-layout';
    fieldset.innerHTML = '<legend>Back to top button</legend>' +
      '<div class="value"><select id="rama-back-to-top-position" aria-label="Back to top button position">' +
      '<option value="left">Left side</option>' +
      '<option value="right">Right side</option>' +
      '</select></div>' +
      '<div class="description">Choose which side the round back-to-top button uses on result pages.</div>';
    section.appendChild(fieldset);

    var select = fieldset.querySelector('select');
    select.value = topPosition();
    select.addEventListener('change', function () {
      var value = select.value === 'right' ? 'right' : 'left';
      saveTopPosition(value);
      applyTopPosition(value);
    });
  }

  function buildUI() {
    buildColoursUI();
    buildLayoutUI();
  }

  function initPage() {
    buildUI();
    bindBackToTop();
  }

  applyTopPosition(topPosition());
  snapshotIcons();
  var saved = savedColours();
  if (saved) applyColours(saved);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
  } else {
    initPage();
  }
})();
/* /RAMA-UI-JS v1 */

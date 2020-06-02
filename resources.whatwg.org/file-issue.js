// Usage: include a link like `<a href="https://github.com/whatwg/{my-repo}/issues/new">file an issue</a>`, or give it
// `id="file-issue-link"` instead. The URL can include ?title=... to give a title prefix. Then include this script with
// `<script src="https://resources.whatwg.org/file-issue.js" async></script>` after that link. Style the element using
// the selector `.selected-text-file-an-issue`.
//
// If you don't have a file an issue link on your spec (e.g. for a spec split into multiple documents), you can use
// a `data-file-issue-url=""` attribute on the `<script>` tag, and include this script right after the `<body>` tag.
//
// If you want to include this script in `head`, use `defer` instead of `async`.

(function () {
  'use strict';

  let originalFilingURL = getOriginalFilingURL();
  let titlePrefix = '';
  const queryParamIndex = originalFilingURL.indexOf('?title=');
  if (queryParamIndex != -1) {
    titlePrefix = decodeURIComponent(originalFilingURL.substr(queryParamIndex + '?title='.length));
    originalFilingURL = originalFilingURL.substr(0, queryParamIndex);
  }

  const specURL = getSpecURL();

  const fileLink = document.createElement('a');
  fileLink.href = originalFilingURL;
  fileLink.accessKey = '1';
  fileLink.className = 'selected-text-file-an-issue';
  fileLink.textContent = 'File an issue about the selected text';
  fileLink.onclick = e => {
    fileLink.href = getFilingURL(originalFilingURL, window.getSelection());
  };

  document.body.prepend(fileLink);

  function getOriginalFilingURL() {
    const dataAttr = document.currentScript.getAttribute("data-file-issue-url");
    if (dataAttr) {
      return dataAttr;
    }

    const link = document.querySelector('#file-issue-link, a[href$="/issues/new"], a[href*="/issues/new?title="]');
    if (link) {
      return link.href;
    }

    throw new Error('No "file an issue" link found and no data-file-issue-url attribute present on the script');
  }

  function getSpecURL() {
    const link = document.getElementById('commit-snapshot-link');
    if (link) {
      return link.href;
    }
    return window.location.href;
  }

  function getFilingURL(originalFilingURL, selection) {
    const bugData = getBugData(selection);
    return originalFilingURL + '?title=' + encodeURIComponent(bugData.title) + '&body=' +
           encodeURIComponent(bugData.body);
  }

  function getBugData(selection) {
    const selectionText = selection.toString();
    const url = getURLToReport(selection);

    return {
      title: getTitle(selectionText),
      body: getBody(url, selectionText)
    };
  }

  function escapeGFM(text) {
    return text.replace(/&/g, '&amp;') // HTML
               .replace(/</g, '&lt;') // HTML
               .replace(/>/g, '&gt;') // blockquote
               .replace(/([:@=])/g, '$1\u200b') // emoji, @mention, headings
               .replace(/([\\`\*_\{\}\[\]\(\)#\+\-\.!\~\|])/g, '\\$1'); // other formatting
  }

  function getBody(url, selectionText) {
    let quotedText = selectionText;
    if (quotedText.length > 1000) {
      quotedText = quotedText.substring(0, 997) + '...';
    }

    quotedText = escapeGFM(quotedText).replace(/\r/g, '').replace(/\n/g, '\n> ');
    if (quotedText.length > 0) {
      quotedText = '> ' + quotedText;
    }

    return url + '\n\n' + quotedText;
  }

  function getTitle(selectionText) {
    let title = selectionText.replace(/\n/g, ' ');
    if (title.length > 50) {
      title = title.substring(0, 47) + '...';
    }

    if (title.length > 0) {
      title = '"' + title + '"';
    }

    return titlePrefix + title;
  }

  function getURLToReport(selection) {
    let url = specURL;

    const node = getBestNodeToReport(selection);
    if (node) {
      url = url.split('#')[0] + '#' + node.id;
    }

    return url;
  }

  function getBestNodeToReport(selection) {
    let node = null;

    if (selection.anchorNode) {
      node = selection.anchorNode;

      if (selection.focusNode && selection.focusNode.compareDocumentPosition) {
        const compare = selection.focusNode.compareDocumentPosition(selection.anchorNode);
        if (compare & Node.DOCUMENT_POSITION_FOLLOWING || compare & Node.DOCUMENT_POSITION_CONTAINED_BY) {
          node = selection.focusNode;
        }
      }
    }

    while (node && !node.id) {
      node = node.previousSibling || node.parentNode;
    }

    return node;
  }

  // Solidarity with Black Lives Matter
  function addSolidarityMessage() {
    if (location.hostname === "html.spec.whatwg.org" ||
        location.hostname === "localhost") {

      // Skip snapshots that already have an "annoying-warning"
      if (document.querySelector('.annoying-warning')) {
        return;
      }

      const header = document.querySelector('.head');
      const details = document.createElement('details');

      // Stay collapsed when navigating in multipage
      let shouldOpen = true;
      if ('sessionStorage' in window && sessionStorage.getItem('blm-open') === 'false') {
        shouldOpen = false;
      }
      details.open = shouldOpen;

      details.innerHTML = `
      <summary>George Floyd</summary>
      <p>Natosha McDade, Yassin Mohamed, Finan H. Berhe, Sean Reed, Steven Demarco Taylor, Breonna Taylor, Ariane McCree, Terrance Franklin, Miles Hall, Darius Tarver, William Green, Samuel David Mallard, Kwame Jones, De’von Bailey, Christopher Whitfield, Anthony Hill, De’Von Bailey, Eric Logan, Jamarion Robinson, Gregory Hill Jr, JaQuavion Slaton, Ryan Twyman, Brandon Webber, Jimmy Atchison, Willie McCoy, Emantic Fitzgerald Bradford J, D’ettrick Griffin, Jemel Roberson, DeAndre Ballard, Botham Shem Jean, Robert Lawrence White, Anthony Lamar Smith, Ramarley Graham, Manuel Loggins Jr, Trayvon Martin, Wendell Allen, Kendrec McDade, Larry Jackson Jr, Jonathan Ferrell, Jordan Baker, Victor White III, Dontre Hamilton, Eric Garner, John Crawford III, Michael Brown, Ezell Ford, Dante Parker, Kajieme Powell, Laquan McDonald, Akai Gurley, Tamir Rice, Rumain Brisbon, Jerame Reid, Charly Keunang, Tony Robinson, Walter Scott, Freddie Gray, Brendon Glenn, Samuel DuBose, Christian Taylor, Jamar Clark, Mario Woods, Quintonio LeGrier, Gregory Gunn, Akiel Denkins, Alton Sterling, Philando Castile, Terrence Sterling, Terence Crutcher, Keith Lamont Scott, Alfred Olango, Jordan Edwards, Stephon Clark, Danny Ray Thomas, DeJuan Guillory, Patrick Harmon, Jonathan Hart, Maurice Granton, Julius Johnson, Jamee Johnson, Michael Dean, and too many more to list here...</p>
      <p>The maintainers of this Standard stand in solidarity with Black Lives Matter.</p>
      <p>Please consider donating to <a href="https://blacklivesmatter.com/">Black Lives Matter</a>, <a href="https://www.naacpldf.org/">The NAACP Legal Defense and Educational Fund</a>, <a href="https://eji.org/">The Equal Justice Initiativea</a>, <a href="https://www.wetheprotesters.org/">We The Protesters</a>, and <a href="https://www.gofundme.com/f/georgefloyd">George Floyd Memorial Fund</a>.</p>
      `;

      details.className = 'annoying-warning blm';

      details.ontoggle = function() {
        if ('sessionStorage' in window) {
          sessionStorage.setItem('blm-open', String(details.open));
        }
      }

      const style = document.createElement('style');
      style.textContent = `
      .annoying-warning.blm {
        background: black;
      }
      .annoying-warning.blm:not([open]) {
        top: 0;
        bottom: auto;
      }
      html {
        scroll-padding: 40px 0 0 0;
      }`;

      document.head.appendChild(style);
      header.parentNode.insertBefore(details, header.nextSibling);
    }
  }
  if (document.readyState === 'interactive') {
    addSolidarityMessage();
  } else {
    addEventListener('DOMContentLoaded', addSolidarityMessage, false);
  }

}());

// static/js/sidenotes.js
(function() {
  'use strict';

  // Only run on wider screens
  function shouldUseSidenotes() {
    return window.innerWidth >= 1200;
  }

  function initSidenotes() {
    if (!shouldUseSidenotes()) {
      return;
    }

    const footnoteSection = document.querySelector('.footnotes');
    if (!footnoteSection) {
      return;
    }

    const postContent = document.querySelector('.post-content');
    if (!postContent) {
      return;
    }

    // Get all footnote references in the text
    const footnoteRefs = postContent.querySelectorAll('a[href^="#fn:"]');

    footnoteRefs.forEach((ref, index) => {
      // Extract footnote ID (e.g., "fn:1" from href="#fn:1")
      const footnoteId = ref.getAttribute('href').substring(1);
      const footnoteContent = document.getElementById(footnoteId);

      if (!footnoteContent) {
        return;
      }

      // Create sidenote element
      const sidenote = document.createElement('span');
      sidenote.className = 'sidenote';
      sidenote.innerHTML = footnoteContent.innerHTML;

      // Remove the back reference link from sidenote
      const backref = sidenote.querySelector('.footnote-backref');
      if (backref) {
        backref.remove();
      }

      // Insert sidenote after the reference
      ref.parentNode.insertBefore(sidenote, ref.nextSibling);

      // Mark the reference as having a sidenote
      ref.classList.add('sidenote-ref');
    });

    // Hide the original footnotes section
    footnoteSection.style.display = 'none';
  }

  function initPopups() {
    if (shouldUseSidenotes()) {
      return;
    }

    const postContent = document.querySelector('.post-content');
    if (!postContent) {
      return;
    }

    // Get all footnote references in the text
    const footnoteRefs = postContent.querySelectorAll('a[href^="#fn:"]');

    footnoteRefs.forEach((ref) => {
      // Extract footnote ID
      const footnoteId = ref.getAttribute('href').substring(1);
      const footnoteContent = document.getElementById(footnoteId);

      if (!footnoteContent) {
        return;
      }

      // Prevent default jump behavior
      ref.addEventListener('click', function(e) {
        e.preventDefault();

        // Remove any existing popups
        const existingPopup = document.querySelector('.footnote-popup');
        if (existingPopup) {
          existingPopup.remove();
        }

        // Create popup element
        const popup = document.createElement('div');
        popup.className = 'footnote-popup';
        popup.innerHTML = footnoteContent.innerHTML;

        // Remove the back reference link from popup
        const backref = popup.querySelector('.footnote-backref');
        if (backref) {
          backref.remove();
        }

        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'footnote-popup-close';
        closeBtn.innerHTML = '×';
        closeBtn.setAttribute('aria-label', 'Close');
        popup.insertBefore(closeBtn, popup.firstChild);

        // Position popup near the clicked reference
        document.body.appendChild(popup);

        const refRect = ref.getBoundingClientRect();
        const popupRect = popup.getBoundingClientRect();

        // Try to position below the reference
        let top = refRect.bottom + window.scrollY + 5;
        let left = refRect.left + window.scrollX;

        // Adjust if popup goes off screen
        if (left + popupRect.width > window.innerWidth) {
          left = window.innerWidth - popupRect.width - 10;
        }
        if (left < 10) {
          left = 10;
        }

        popup.style.top = top + 'px';
        popup.style.left = left + 'px';

        // Close popup when clicking close button
        closeBtn.addEventListener('click', function() {
          popup.remove();
        });

        // Close popup when clicking outside
        setTimeout(function() {
          document.addEventListener('click', function closePopup(e) {
            if (!popup.contains(e.target) && e.target !== ref) {
              popup.remove();
              document.removeEventListener('click', closePopup);
            }
          });
        }, 10);
      });

      ref.classList.add('footnote-popup-ref');
    });
  }

  function resetSidenotes() {
    // Remove all sidenotes
    const sidenotes = document.querySelectorAll('.sidenote');
    sidenotes.forEach(note => note.remove());

    // Remove sidenote-ref class
    const refs = document.querySelectorAll('.sidenote-ref');
    refs.forEach(ref => ref.classList.remove('sidenote-ref'));

    // Show footnotes section again
    const footnoteSection = document.querySelector('.footnotes');
    if (footnoteSection) {
      footnoteSection.style.display = 'block';
    }
  }

  function resetPopups() {
    // Remove any existing popup
    const popup = document.querySelector('.footnote-popup');
    if (popup) {
      popup.remove();
    }

    // Remove popup-ref class and event listeners by cloning
    const refs = document.querySelectorAll('.footnote-popup-ref');
    refs.forEach(ref => {
      const newRef = ref.cloneNode(true);
      ref.parentNode.replaceChild(newRef, ref);
    });
  }

  function initialize() {
    if (shouldUseSidenotes()) {
      initSidenotes();
    } else {
      initPopups();
    }
  }

  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // Handle window resize with debouncing
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (shouldUseSidenotes()) {
        if (!document.querySelector('.sidenote')) {
          resetPopups();
          initSidenotes();
        }
      } else {
        if (document.querySelector('.sidenote')) {
          resetSidenotes();
          initPopups();
        }
      }
    }, 250);
  });
})();

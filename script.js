/**
 * EDIT: This file powers mobile navigation, "Salons" dropdowns, and image sliders (hero & gallery).
 * Autoplay interval is set per-slider via data-interval (milliseconds) on the slider root.
 * data-autoplay="false" disables auto-advance for that slider.
 */

(function () {
  "use strict";

  // --- EDIT: Footer year (auto) — no change needed unless you prefer static text ---
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // --- Mobile navigation ---
  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.getElementById("site-nav");

  function setNavOpen(open) {
    if (!navToggle || !siteNav) return;
    siteNav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      setNavOpen(!siteNav.classList.contains("is-open"));
    });

    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNavOpen(false);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setNavOpen(false);
    });
  }

  // --- "Salons" dropdown (desktop + mobile) ---
  document.querySelectorAll(".nav-dropdown").forEach(function (wrap) {
    var toggle = wrap.querySelector(".nav-dropdown-toggle");
    var panel = wrap.querySelector(".nav-dropdown-panel");
    if (!toggle || !panel) return;

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = !wrap.classList.contains("is-open");
      document.querySelectorAll(".nav-dropdown.is-open").forEach(function (w) {
        if (w !== wrap) {
          w.classList.remove("is-open");
          var t = w.querySelector(".nav-dropdown-toggle");
          if (t) t.setAttribute("aria-expanded", "false");
        }
      });
      wrap.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  document.addEventListener("click", function (e) {
    if (e.target.closest(".nav-dropdown")) return;
    document.querySelectorAll(".nav-dropdown.is-open").forEach(function (w) {
      w.classList.remove("is-open");
      var t = w.querySelector(".nav-dropdown-toggle");
      if (t) t.setAttribute("aria-expanded", "false");
    });
  });

  /**
   * Slider: auto + manual (prev/next + dots). Multiple sliders via data-slider id string.
   * @param {HTMLElement} root - element with [data-slider="uniqueId"] matching button [data-slider-prev/next="uniqueId"]
   */
  function initSlider(root) {
    if (!root) return;

    var id = root.getAttribute("data-slider");
    if (!id) return;

    var slides = root.querySelectorAll(".hero-slide, .gallery-slide");
    if (!slides.length) return;

    var prevBtn = document.querySelector('[data-slider-prev="' + id + '"]');
    var nextBtn = document.querySelector('[data-slider-next="' + id + '"]');
    var dotsHost = document.querySelector('[data-slider-dots="' + id + '"]');

    var autoplay = root.getAttribute("data-autoplay") !== "false";
    var intervalMs = parseInt(root.getAttribute("data-interval") || "5000", 10);
    if (isNaN(intervalMs) || intervalMs < 2000) intervalMs = 5000;

    var index = 0;
    var timer = null;

    function goTo(i) {
      var n = slides.length;
      index = ((i % n) + n) % n;
      slides.forEach(function (slide, j) {
        slide.classList.toggle("is-active", j === index);
      });
      if (dotsHost) {
        dotsHost.querySelectorAll(".slider-dot").forEach(function (dot, j) {
          dot.setAttribute("aria-current", j === index ? "true" : "false");
        });
      }
    }

    function next() {
      goTo(index + 1);
    }

    function prev() {
      goTo(index - 1);
    }

    function startTimer() {
      if (!autoplay) return;
      stopTimer();
      timer = window.setInterval(next, intervalMs);
    }

    function stopTimer() {
      if (timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function resetTimer() {
      stopTimer();
      startTimer();
    }

    // Build dot buttons
    if (dotsHost) {
      dotsHost.innerHTML = "";
      slides.forEach(function (_, j) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "slider-dot";
        dot.setAttribute("aria-label", "Go to slide " + (j + 1));
        dot.addEventListener("click", function () {
          goTo(j);
          resetTimer();
        });
        dotsHost.appendChild(dot);
      });
    }

    goTo(0);
    startTimer();

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        next();
        resetTimer();
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        prev();
        resetTimer();
      });
    }

    // Pause autoplay on hover/focus inside slider (accessibility + UX)
    root.addEventListener("mouseenter", stopTimer);
    root.addEventListener("mouseleave", startTimer);
    root.addEventListener("focusin", stopTimer);
    root.addEventListener("focusout", function (e) {
      if (!root.contains(e.relatedTarget)) startTimer();
    });

    // Optional: keyboard when slider or controls are focused
    root.setAttribute("tabindex", "0");
    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
        resetTimer();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
        resetTimer();
      }
    });
  }

  document.querySelectorAll("[data-slider]").forEach(function (el) {
    initSlider(el);
  });
})();

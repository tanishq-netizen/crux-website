// CRUX v2 — script.js

document.addEventListener("DOMContentLoaded", function () {

  // Nav: add .scrolled class after 40px
  var nav = document.querySelector(".site-nav");
  if (nav) {
    function onScroll() {
      nav.classList.toggle("scrolled", window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Mobile nav toggle
  var toggle    = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".nav-mobile");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  // Pre-select interest dropdown via ?interest= URL param
  var sel = document.getElementById("interest");
  if (sel) {
    var param = new URLSearchParams(window.location.search).get("interest");
    if (param && sel.querySelector('option[value="' + param + '"]')) {
      sel.value = param;
    }
  }

  // Contact form → Web3Forms
  var form    = document.getElementById("inquiry-form");
  if (form) {
    var success = document.getElementById("form-success");
    var errorEl = document.getElementById("form-error");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var key = (form.querySelector('[name="access_key"]') || {}).value || "";
      if (!key || key.indexOf("REPLACE") === 0) {
        errorEl.querySelector("p").textContent =
          "The form isn't connected yet — add your Web3Forms access key in contact.html before going live.";
        errorEl.hidden = false;
        success.hidden = true;
        return;
      }

      var btn  = form.querySelector('button[type="submit"]');
      var orig = btn.textContent;
      btn.disabled    = true;
      btn.textContent = "Sending…";
      errorEl.hidden  = true;

      fetch("https://api.web3forms.com/submit", {
        method:  "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body:    JSON.stringify(Object.fromEntries(new FormData(form)))
      })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d.success) {
            form.hidden    = true;
            success.hidden = false;
            success.scrollIntoView({ behavior: "smooth", block: "center" });
          } else {
            throw new Error();
          }
        })
        .catch(function () {
          errorEl.querySelector("p").textContent =
            "Something went wrong — please try again or email us directly.";
          errorEl.hidden  = false;
          btn.disabled    = false;
          btn.textContent = orig;
        });
    });
  }
});

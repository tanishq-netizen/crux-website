// CRUX — shared behavior

document.addEventListener("DOMContentLoaded", function () {
  /* Mobile nav toggle */
  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".nav-mobile");

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* Pre-select "area of interest" on the contact form via ?interest=vault|communities|audit */
  var interestSelect = document.getElementById("interest");
  if (interestSelect) {
    var params = new URLSearchParams(window.location.search);
    var interest = params.get("interest");
    if (interest && interestSelect.querySelector('option[value="' + interest + '"]')) {
      interestSelect.value = interest;
    }
  }

  /* Inquiry form submission via Web3Forms */
  var form = document.getElementById("inquiry-form");
  if (form) {
    var successBox = document.getElementById("form-success");
    var errorBox = document.getElementById("form-error");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var key = form.querySelector('input[name="access_key"]').value;
      if (!key || key.indexOf("REPLACE_WITH") === 0) {
        errorBox.querySelector("p").textContent =
          "The form isn't connected to an inbox yet — add your Web3Forms access key in contact.html before going live.";
        errorBox.hidden = false;
        successBox.hidden = true;
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      var originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
      errorBox.hidden = true;

      var formData = new FormData(form);
      var payload = Object.fromEntries(formData.entries());

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (result) {
          if (result.success) {
            form.hidden = true;
            successBox.hidden = false;
            successBox.scrollIntoView({ behavior: "smooth", block: "center" });
          } else {
            throw new Error(result.message || "Submission failed");
          }
        })
        .catch(function () {
          errorBox.querySelector("p").textContent =
            "Something went wrong sending that. Please try again, or email us directly.";
          errorBox.hidden = false;
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        });
    });
  }
});

(function() {
  const ERRORS = {
    invalidCodeFormat: "Invalid code. Please enter a six-character code.",
    invalidCode: "Invalid code. Please try again.",
    unknownError: "Sorry, something went wrong."
  };

  setup();

  function setup() {
    // indicate which items have been purchased
    const buyLinks = document.querySelectorAll(".wishlist-buy-link");
    const boughtButtons = document.querySelectorAll(
      ".wishlist-i-bought-this-btn"
    );
    const itemLinks = Array.from(buyLinks).map(e => e.href);

    fetch("https://api.taravancil.com/wishlist/purchases")
      .then(function(res) {
        return res.json();
      })
      .then(function(purchases) {
        for (let i = 0; i < buyLinks.length; i++) {
          if (purchases.indexOf(itemLinks[i]) !== -1) {
            let newEl = document.createElement("div");
            newEl.innerHTML =
              'Someone bought this <span aria-hidden="true">:-)</span>';
            newEl.classList.add("buy-link");
            newEl.classList.add("small-text");
            buyLinks[i].replaceWith(newEl);
            boughtButtons[i].remove();
          }
        }
      });

    const togglePurchasedFormButtons = document.querySelectorAll(
      ".wishlist-toggle-purchased-form-btn"
    );
    const submitPurchasedFormButtons = document.querySelectorAll(
      ".wishlist-submit-purchased-form-btn"
    );

    for (let btn of togglePurchasedFormButtons) {
      btn.addEventListener("click", onTogglePurchasedForm);
    }

    for (let btn of submitPurchasedFormButtons) {
      btn.addEventListener("click", onSubmitPurchasedForm);
    }
  }

  // events
  function onTogglePurchasedForm(e) {
    const form = document.querySelector(
      `form[data-key="${e.target.dataset.key}"]`
    );

    form.classList.toggle("hidden");

    if (!form.classList.contains("hidden")) {
      form.querySelector('input[name="wishlist-code"]').focus();
    }
  }

  function onSubmitPurchasedForm(e) {
    e.preventDefault();

    const key = e.target.dataset.key;

    // form elements
    const form = document.querySelector(`form[data-key="${key}"]`);
    const codeEl = form.querySelector('input[name="wishlist-code"]');
    const boughtButton = document.querySelector(
      `.wishlist-i-bought-this-btn[data-key="${key}"]`
    );

    const code = codeEl.value;
    const url = form.querySelector('input[name="wishlist-url"]').value;

    // feedback and error elements
    const codeError = form.querySelector("#wishlist-code-error");
    const genericError = form.querySelector("#wishlist-generic-error");
    const successFeedback = document.querySelector(
      `#wishlist-success-feedback[data-key="${key}"]`
    );

    if (!code.match(/.{6}/g)) {
      setError(codeError, false, ERRORS.invalidCodeFormat);
    } else {
      // update wishlist data
      fetch("https://api.taravancil.com/wishlist/purchases", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({ code, url })
      })
        .then(function(res) {
          switch (res.status) {
            case 201:
              // clear all errors
              setError(codeError, true, "");
              setError(genericError, true, "");

              // set success message and hide form
              successFeedback.classList.remove("hidden");
              form.classList.add("hidden");
              boughtButton.classList.add("hidden");
              document
                .querySelecetor(`wishlist-buy-link[data-key="${key}"]`)
                .remove();

              // set all code input values to the code for sake of convenience
              document
                .querySelectorAll('input[name="wishlist-code"]')
                .forEach(function(el) {
                  el.value = code;
                });
              break;
            case 401:
              setError(genericError, true, "");
              setError(codeError, false, ERRORS.invalidCode);
              break;
            case 500:
              setError(codeError, true);
              setError(genericErorr, false, ERRORS.unknownError);
              break;
          }
        })
        .catch(function(err) {
          setError(genericErorr, false, ERRORS.unknownError);
        });
    }
  }

  // utils
  function setError(el, valid, errorMessage) {
    if (!valid) {
      el.setAttribute("aria-invalid", true);
      el.setAttribute("role", "alert");
      el.innerText = errorMessage;
    } else {
      el.setAttribute("aria-invalid", false);
      el.removeAttribute("role");
      el.innerText = "";
    }
  }
})();

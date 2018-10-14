(function() {
  const els = document.querySelectorAll(".buy-link");
  const itemLinks = Array.from(els).map(e => e.href);

  fetch("https://api.taravancil.com/wishlist/purchases")
    .then(function(res) {
      return res.json();
    })
    .then(function(purchases) {
      for (let i = 0; i < els.length; i++) {
        if (purchases.indexOf(itemLinks[i]) !== -1) {
          const el = els[i];
          let newEl = document.createElement("div");
          newEl.innerHTML =
            'Someone bought this <span aria-hidden="true">:-)</span>';
          newEl.classList.add("buy-link");
          el.replaceWith(newEl);
        }
      }
    });
})();

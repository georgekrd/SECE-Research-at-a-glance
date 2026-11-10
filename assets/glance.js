/* Research at a glance: map tooltips (also on touch), the height for a page that embeds this one,
   and ?embed kept when switching language. The page reads fully without this script. */
(function () {
  "use strict";

  var wrap = document.querySelector(".map-wrap");
  if (wrap) {
    var tip = wrap.querySelector(".map-tip");
    // the custom tooltip replaces the browser's own (the <title> elements) inside the map
    Array.prototype.forEach.call(wrap.querySelectorAll("[data-tip] > title"), function (t) { t.remove(); });
    var show = function (el, x, y) {
      var box = wrap.getBoundingClientRect();
      tip.textContent = el.getAttribute("data-tip");
      tip.hidden = false;
      var left = Math.min(x - box.left + 14, box.width - tip.offsetWidth - 4);
      var top = y - box.top - tip.offsetHeight - 12;
      tip.style.left = Math.max(left, 4) + "px";
      tip.style.top = (top < 0 ? y - box.top + 18 : top) + "px";
    };
    var hide = function () { tip.hidden = true; };
    var at = function (e) {
      var el = e.target.closest ? e.target.closest("[data-tip]") : null;
      if (el) { show(el, e.clientX, e.clientY); } else { hide(); }
    };
    wrap.addEventListener("mousemove", at);
    wrap.addEventListener("click", at);
    wrap.addEventListener("mouseleave", hide);
  }

  // Tell an embedding page (iframe) how tall this page is: {type: "sece-glance:height", height}
  if (window.parent !== window) {
    var last = 0;
    var post = function () {
      var h = Math.ceil(document.documentElement.scrollHeight);
      if (h !== last) {
        last = h;
        window.parent.postMessage({ type: "sece-glance:height", height: h }, "*");
      }
    };
    window.addEventListener("load", post);
    window.addEventListener("resize", post);
    if ("ResizeObserver" in window) { new ResizeObserver(post).observe(document.body); }
  }

  // Keep the other query parameters (such as ?embed=1) when switching language
  var params = new URLSearchParams(location.search);
  params.delete("lang");
  var query = params.toString();
  if (query) {
    Array.prototype.forEach.call(document.querySelectorAll(".lang-switch a"), function (a) {
      a.setAttribute("href", a.getAttribute("href") + "?" + query);
    });
  }
})();

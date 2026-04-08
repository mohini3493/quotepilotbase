/**
 * QuotePilot Product Cards Embed Script
 *
 * Usage:
 *   <div id="quotepilot-products"></div>
 *   <script src="https://YOUR_DOMAIN/embed.js"></script>
 *
 * Options (data attributes on the script tag):
 *   data-cols="3"         – Number of columns (1, 2, or 3). Default: 3
 *   data-target="my-id"   – Custom container ID. Default: quotepilot-products
 *
 * Example with options:
 *   <div id="my-products"></div>
 *   <script src="https://YOUR_DOMAIN/embed.js" data-cols="2" data-target="my-products"></script>
 */
(function () {
  "use strict";

  // Find the current script tag to read data attributes
  var scripts = document.getElementsByTagName("script");
  var currentScript =
    document.currentScript || scripts[scripts.length - 1];

  var cols = currentScript.getAttribute("data-cols") || "3";
  var targetId =
    currentScript.getAttribute("data-target") || "quotepilot-products";

  // Derive the base URL from the script's src
  var scriptSrc = currentScript.getAttribute("src") || "";
  var baseUrl = scriptSrc.replace(/\/embed\.js(\?.*)?$/, "");

  // If script is loaded locally or src is empty, try origin
  if (!baseUrl || baseUrl === scriptSrc) {
    baseUrl = window.location.origin;
  }

  var embedUrl = baseUrl + "/embed/products?cols=" + encodeURIComponent(cols);

  // Find or create container
  var container = document.getElementById(targetId);
  if (!container) {
    container = document.createElement("div");
    container.id = targetId;
    currentScript.parentNode.insertBefore(container, currentScript);
  }

  // Create iframe
  var iframe = document.createElement("iframe");
  iframe.src = embedUrl;
  iframe.style.width = "100%";
  iframe.style.border = "none";
  iframe.style.overflow = "hidden";
  iframe.style.minHeight = "600px";
  iframe.style.colorScheme = "normal";
  iframe.setAttribute("scrolling", "no");
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute(
    "allow",
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
  );
  iframe.title = "QuotePilot Products";

  container.innerHTML = "";
  container.appendChild(iframe);

  // Auto-resize iframe based on content height
  window.addEventListener("message", function (event) {
    if (
      event.data &&
      event.data.type === "quotepilot-embed-resize" &&
      typeof event.data.height === "number"
    ) {
      iframe.style.height = event.data.height + "px";
    }
  });
})();

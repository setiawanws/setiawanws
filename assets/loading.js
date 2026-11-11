document.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector("[data-site-loader]");
  if (!loader) return;

  const minimumVisibleTime = 450;
  const startedAt = performance.now();
  let dismissed = false;

  const dismissLoader = () => {
    if (dismissed) return;
    dismissed = true;

    const delay = Math.max(0, minimumVisibleTime - (performance.now() - startedAt));
    window.setTimeout(() => {
      loader.setAttribute("aria-hidden", "true");
      loader.classList.add("is-hidden");
      window.setTimeout(() => loader.setAttribute("hidden", ""), 260);
    }, delay);
  };

  const fallbackTimer = window.setTimeout(dismissLoader, 12000);
  window.addEventListener(
    "load",
    () => {
      window.clearTimeout(fallbackTimer);
      dismissLoader();
    },
    { once: true },
  );

  if (document.readyState === "complete") {
    window.clearTimeout(fallbackTimer);
    dismissLoader();
  }
});

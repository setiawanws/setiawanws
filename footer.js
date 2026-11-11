document.addEventListener("DOMContentLoaded", async () => {
  const mount = document.querySelector("[data-footer-mount]");
  if (!mount) return;

  try {
    const response = await fetch("footer.html");
    if (!response.ok) {
      throw new Error(`footer.html returned HTTP ${response.status}`);
    }

    const template = document.createElement("template");
    template.innerHTML = await response.text();

    const styles = template.content.querySelector("style");
    const footer = template.content.querySelector("footer");
    if (!styles || !footer) {
      throw new Error("footer.html must contain a style element and a footer element");
    }

    styles.dataset.sharedFooter = "";
    document.head.append(styles);
    mount.replaceWith(footer);
  } catch (error) {
    console.error("Failed to load the shared footer from footer.html.", error);
    mount.setAttribute("role", "alert");
    mount.textContent = "Footer gagal dimuat. Silakan muat ulang halaman.";
  }
});

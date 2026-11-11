document.addEventListener("DOMContentLoaded", async () => {
  const mount = document.querySelector("[data-header-page]");
  if (!mount) return;

  try {
    const response = await fetch("header.html");
    if (!response.ok) {
      throw new Error(`header.html returned HTTP ${response.status}`);
    }

    const template = document.createElement("template");
    template.innerHTML = await response.text();

    const styles = template.content.querySelector("style");
    const header = template.content.querySelector("header");
    if (!styles || !header) {
      throw new Error("header.html must contain a style element and a header element");
    }

    styles.dataset.sharedHeader = "";
    document.head.append(styles);

    header.dataset.page = mount.dataset.headerPage;

    if (mount.dataset.headerPage === "portfolio") {
      header.querySelector("[data-header-home]").href = "index.html";
      header.querySelectorAll("[data-header-section]").forEach((link) => {
        link.href = `index.html#${link.dataset.headerSection}`;
      });
      const portfolioLink = header.querySelector("[data-header-portfolio]");
      portfolioLink.setAttribute("aria-current", "page");
    }

    mount.replaceWith(header);
  } catch (error) {
    console.error("Failed to load the shared header from header.html.", error);
    mount.setAttribute("role", "alert");
    mount.textContent = "Navigasi gagal dimuat. Silakan muat ulang halaman.";
  }
});

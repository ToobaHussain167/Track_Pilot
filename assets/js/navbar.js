export function renderNavbar() {
  const navbarContainer = document.querySelector("[data-navbar]");

  if (!navbarContainer) return;

  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  navbarContainer.innerHTML = `
    <nav class="navbar navbar-expand-lg sticky-top">
      <div class="container">
        <a class="navbar__brand" href="index.html">TrackPilot</a>

        <button
          class="navbar-toggler bg-light"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav navbar__links">
            <li class="nav-item">
              <a
                class="nav-link navbar__link ${currentPage === "index.html" ? "active" : ""}"
                href="index.html"
                ${currentPage === "index.html" ? 'aria-current="page"' : ""}
              >
                Dashboard
              </a>
            </li>

            <li class="nav-item">
              <a
                class="nav-link navbar__link ${currentPage === "about.html" ? "active" : ""}"
                href="about.html"
                ${currentPage === "about.html" ? 'aria-current="page"' : ""}
              >
                About &amp; Workflow
              </a>
            </li>

            <li class="nav-item">
              <a
                class="nav-link navbar__link ${currentPage === "contact.html" ? "active" : ""}"
                href="contact.html"
                ${currentPage === "contact.html" ? 'aria-current="page"' : ""}
              >
                Support &amp; Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `;
}
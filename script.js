const menuButton = document.getElementById("menuButton");
const navMenu = document.getElementById("navMenu");

if (menuButton && navMenu) {
  menuButton.addEventListener("click", () => {
    const opened = navMenu.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", opened ? "true" : "false");
  });

  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

document.querySelectorAll("[data-year]").forEach(el => {
  el.textContent = new Date().getFullYear();
});

const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

if (form && status) {
  form.addEventListener("submit", event => {
    event.preventDefault();

    const honeypot = document.getElementById("website");
    if (honeypot && honeypot.value.trim() !== "") return;

    if (!form.checkValidity()) {
      status.textContent = "Merci de compléter correctement les champs obligatoires.";
      status.style.color = "#b91c1c";
      form.reportValidity();
      return;
    }

    status.textContent = "Le formulaire est prêt. L'envoi sécurisé sera activé à l'étape suivante.";
    status.style.color = "#047857";
  });
}

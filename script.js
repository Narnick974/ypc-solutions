const menuButton = document.getElementById("menuButton");
const navMenu = document.getElementById("navMenu");

if (menuButton && navMenu) {

  menuButton.addEventListener("click", () => {

    const opened =
      navMenu.classList.toggle("open");

    menuButton.setAttribute(
      "aria-expanded",
      opened ? "true" : "false"
    );

  });


  navMenu
    .querySelectorAll("a")
    .forEach(link => {

      link.addEventListener("click", () => {

        navMenu.classList.remove("open");

        menuButton.setAttribute(
          "aria-expanded",
          "false"
        );

      });

    });

}


/* Année du footer */

document
  .querySelectorAll("[data-year]")
  .forEach(el => {

    el.textContent =
      new Date().getFullYear();

  });


/* Formulaire de contact */

const form =
  document.getElementById("contactForm");

const status =
  document.getElementById("formStatus");

const submitButton =
  document.getElementById("submitButton");


if (form && status && submitButton) {

  form.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      /*
       * Empêche les doubles clics / doubles soumissions
       */
      if (submitButton.disabled) {
        return;
      }


      /*
       * Honeypot :
       * un utilisateur normal ne peut pas remplir ce champ.
       */
      const honeypot =
        document.getElementById("website");

      if (
        honeypot &&
        honeypot.value.trim() !== ""
      ) {
        return;
      }


      /*
       * Validation HTML5
       */
      if (!form.checkValidity()) {

        status.textContent =
          "Merci de compléter correctement les champs obligatoires.";

        status.style.color =
          "#b91c1c";

        form.reportValidity();

        return;
      }


      /*
       * Blocage du bouton pendant l'envoi
       */
      const originalButtonText =
        submitButton.textContent;

      submitButton.disabled = true;

      submitButton.textContent =
        "Envoi en cours…";

      status.textContent = "";

      status.style.color = "";


      try {

        const response =
          await fetch(
            form.action,
            {
              method: "POST",

              body:
                new FormData(form),

              headers: {
                "Accept":
                  "application/json"
              }
            }
          );


        /*
         * Envoi réussi
         */
        if (response.ok) {

          form.reset();

          status.textContent =
            "Votre demande a bien été envoyée. Merci, nous reviendrons vers vous dès que possible.";

          status.style.color =
            "#047857";

          return;
        }


        /*
         * Trop de requêtes
         */
        if (response.status === 429) {

          status.textContent =
            "Trop de tentatives ont été effectuées. Merci de patienter quelques instants avant de réessayer.";

          status.style.color =
            "#b45309";

          return;
        }


        /*
         * Erreur renvoyée par Formspree
         */
        let errorMessage =
          "L'envoi n'a pas pu être effectué. Merci de réessayer dans quelques instants.";


        try {

          const data =
            await response.json();


          if (
            data &&
            Array.isArray(data.errors) &&
            data.errors.length > 0
          ) {

            errorMessage =
              data.errors
                .map(error => error.message)
                .join(" ");

          }

        }
        catch (_) {

          /*
           * Réponse non JSON :
           * on conserve le message générique.
           */

        }


        status.textContent =
          errorMessage;

        status.style.color =
          "#b91c1c";

      }
      catch (_) {

        /*
         * Erreur réseau
         */
        status.textContent =
          "Impossible de contacter le service d'envoi. Vérifiez votre connexion puis réessayez.";

        status.style.color =
          "#b91c1c";

      }
      finally {

        /*
         * Réactive le bouton
         */
        submitButton.disabled = false;

        submitButton.textContent =
          originalButtonText;

      }

    }
  );

}

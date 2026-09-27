(() => {
  const track = (event, properties = {}) => {
    if (window.palaAnalytics?.capture) {
      window.palaAnalytics.capture(event, properties);
      return;
    }
    if (window.posthog?.capture) {
      window.posthog.capture(event, properties);
    }
  };

  const bindNetlifyForm = (form, { successState, formName, method }) => {
    if (!form) return;

    form.addEventListener("submit", async (event) => {
      if (typeof fetch !== "function") return;
      event.preventDefault();

      const formData = new FormData(form);
      const body = new URLSearchParams(formData).toString();
      const email = String(formData.get("email") || "").trim();

      try {
        await fetch(window.location.pathname, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body,
        });

        track("contact_form_submitted", { form: formName });
        track("booking_completed", { method });

        if (email && window.posthog?.identify) {
          window.posthog.identify(email, { email });
        }

        form.hidden = true;
        if (successState) successState.hidden = false;
      } catch (error) {
        if (window.location.protocol === "file:") {
          alert("Form submission is only available on the deployed site.");
          return;
        }
        throw error;
      }
    });
  };

  const reviewForm = document.querySelector("[data-review-form]");
  if (reviewForm) {
    bindNetlifyForm(reviewForm, {
      successState: document.querySelector("[data-review-success]"),
      formName: reviewForm.getAttribute("name") || "post-acquisition-review",
      method: "review_form",
    });
  }

  const modal = document.querySelector("[data-intake-modal]");
  if (!modal) return;

  const openers = Array.from(document.querySelectorAll("[data-intake-open]"));
  const closers = Array.from(modal.querySelectorAll("[data-intake-close]"));
  const dialog = modal.querySelector("[data-intake-dialog]");
  const form = modal.querySelector("form");
  const firstField = form?.querySelector("input:not([type='hidden']), select, textarea, button[type='submit']");
  const successState = modal.querySelector("[data-intake-success]");

  let lastFocusedElement = null;

  const setHidden = (hidden) => {
    modal.hidden = hidden;
    modal.setAttribute("aria-hidden", hidden ? "true" : "false");
    document.body.classList.toggle("modal-open", !hidden);
  };

  const openModal = () => {
    lastFocusedElement = document.activeElement;
    setHidden(false);
    track("contact_form_started", { form: "intake" });
    window.requestAnimationFrame(() => {
      firstField?.focus();
    });
  };

  const closeModal = () => {
    setHidden(true);
    if (form) {
      form.hidden = false;
    }
    if (successState) {
      successState.hidden = true;
    }
    lastFocusedElement?.focus?.();
  };

  openers.forEach((button) => {
    button.addEventListener("click", openModal);
  });

  closers.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target.hasAttribute("data-intake-close")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });

  bindNetlifyForm(form, {
    successState,
    formName: "intake",
    method: "intake_form",
  });

  setHidden(true);
  if (dialog) {
    dialog.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }
})();

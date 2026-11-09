/* =========================================================
   SAVCLICK Career page — CV form
   Checks the form in the browser, then lets it post to FormSubmit
   (see the comment above the form in careers.html).
   ========================================================= */

(() => {
  const form = document.getElementById("careerForm");
  if (!form) return;

  const MAX_BYTES = 5 * 1024 * 1024; // 5MB per file
  const success = document.getElementById("careerSuccess");
  const submit = document.getElementById("careerSubmit");

  // After sending, FormSubmit brings the visitor back here with ?sent=1
  const back = new URL(window.location.href);
  back.search = "?sent=1";
  back.hash = "apply";
  document.getElementById("careerNext").value = back.toString();

  if (new URLSearchParams(window.location.search).get("sent") === "1") {
    form.hidden = true;
    success.hidden = false;
  }

  const field = (id) => document.getElementById(id);
  const mark = (el, ok) => el.closest(".field").classList.toggle("has-error", !ok);
  const fileOk = (input, exts) => {
    const f = input.files && input.files[0];
    if (!f || f.size > MAX_BYTES) return false;
    const ext = f.name.split(".").pop().toLowerCase();
    return exts.includes(ext);
  };

  form.addEventListener("submit", (e) => {
    const name = field("cName"), email = field("cEmail"), phone = field("cPhone");
    const cv = field("cCv"), photo = field("cPhoto"), consent = field("cConsent");

    const checks = [
      [name, name.value.trim().length > 1],
      [email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())],
      [phone, phone.value.replace(/\D/g, "").length >= 7],
      [cv, fileOk(cv, ["pdf", "doc", "docx"])],
      [photo, fileOk(photo, ["jpg", "jpeg", "png"])],
      [consent, consent.checked],
    ];
    checks.forEach(([el, ok]) => mark(el, ok));

    const firstBad = checks.find(([, ok]) => !ok);
    if (firstBad) {
      e.preventDefault();
      firstBad[0].focus();
      return;
    }
    submit.disabled = true;
    submit.textContent = "Sending…";
  });

  // Clear an error as soon as the visitor fixes the field
  form.querySelectorAll("input").forEach((el) =>
    el.addEventListener("change", () => el.closest(".field")?.classList.remove("has-error"))
  );
})();

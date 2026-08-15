const deadline = new Date("2026-09-15T23:59:59+09:00");

function updateCountdown() {
  const remaining = Math.max(0, deadline - new Date());
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  document.querySelector("#days").textContent = String(days).padStart(2, "0");
  document.querySelector("#hours").textContent = String(hours).padStart(2, "0");
  document.querySelector("#minutes").textContent = String(minutes).padStart(2, "0");
  if (!remaining) document.querySelector("#countdown").innerHTML = "<strong>모집이 마감되었습니다.</strong>";
}

updateCountdown();
setInterval(updateCountdown, 60000);

document.querySelectorAll("details").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll("details[open]").forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

const form = document.querySelector("#apply-form");
const status = document.querySelector("#form-status");
const submitButton = form.querySelector("button[type='submit']");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  submitButton.disabled = true;
  submitButton.firstChild.textContent = "신청서를 보내는 중입니다 ";
  status.className = "form-status";
  status.textContent = "";

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    });
    if (!response.ok) throw new Error("Submission failed");
    form.reset();
    status.className = "form-status success";
    status.textContent = "신청이 완료되었습니다. 이메일로 결제 및 수강 방법을 안내해 드리겠습니다.";
  } catch (error) {
    status.className = "form-status error";
    status.textContent = "신청서를 보내지 못했습니다. 잠시 후 다시 시도해 주세요.";
  } finally {
    submitButton.disabled = false;
    submitButton.firstChild.textContent = "49,000원에 수강 신청하기 ";
  }
});


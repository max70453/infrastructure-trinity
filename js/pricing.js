document.addEventListener("DOMContentLoaded", function() {
  const pricingSection = document.querySelector(".pricing-section");
  if (!pricingSection) {
    console.log("[pricing.js] .pricing-section не найдена на странице");
    return;
  }
  const planCards = pricingSection.querySelectorAll(".pricing-card");
  const chooseButtons = pricingSection.querySelectorAll(".choose-plan-btn");
  let selectedPlan = null;

  chooseButtons.forEach(function(btn) {
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      // Снять выделение со всех карточек
      planCards.forEach(function(card) {
        card.classList.remove("active");
      });
      // Найти родительскую карточку
      const card = btn.closest(".pricing-card");
      if (card) {
        card.classList.add("active");
        selectedPlan = card.getAttribute("data-plan") || card.id || "unknown";
        console.log(`[pricing.js] Выбран план: ${selectedPlan}`);
      }
      // Прокрутить к форме заказа, если она есть
      const orderForm = document.querySelector("#order, .order-form");
      if (orderForm) {
        orderForm.scrollIntoView({behavior: "smooth"});
        // Можно сохранить выбранный план в скрытое поле формы
        const planInput = orderForm.querySelector("input[name='plan']");
        if (planInput) {
          planInput.value = selectedPlan;
        }
      }
    });
  });
});
// Модальное окно заказа
const orderModal = document.getElementById("orderModal");
const orderForm = document.getElementById("orderForm");
const orderPlanInput = document.getElementById("orderPlan");
const orderCloseBtn = document.querySelector(".modal-order-close");
const orderSuccess = document.getElementById("orderSuccess");

function openOrderModal(planName) {
  if (orderModal) {
    orderModal.classList.add("show");
    orderModal.style.display = "flex";
    if (orderPlanInput) orderPlanInput.value = planName || "";
    document.body.style.overflow = "hidden";
    orderSuccess && (orderSuccess.style.display = "none");
    orderForm && orderForm.reset();
    if (orderPlanInput) orderPlanInput.value = planName || "";
  }
}
function closeOrderModal() {
  if (orderModal) {
    orderModal.classList.remove("show");
    orderModal.style.display = "none";
    document.body.style.overflow = "";
  }
}
if (orderCloseBtn) {
  orderCloseBtn.addEventListener("click", closeOrderModal);
}
window.addEventListener("click", function(e) {
  if (e.target === orderModal) closeOrderModal();
});

// Открытие модального окна при выборе тарифа
const pricingSection = document.querySelector(".pricing-section");
if (pricingSection) {
  const planCards = pricingSection.querySelectorAll(".pricing-card");
  const chooseButtons = pricingSection.querySelectorAll(".choose-plan-btn");
  chooseButtons.forEach(function(btn) {
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      planCards.forEach(function(card) {
        card.classList.remove("active");
      });
      const card = btn.closest(".pricing-card");
      let selectedPlan = card ? (card.getAttribute("data-plan") || card.id || "unknown") : "unknown";
      if (card) card.classList.add("active");
      openOrderModal(selectedPlan);
    });
  });
}

// Обработка отправки формы заказа
if (orderForm) {
  orderForm.addEventListener("submit", function(e) {
    e.preventDefault();
    // Здесь можно добавить отправку данных на сервер через fetch/AJAX
    orderSuccess && (orderSuccess.style.display = "block");
    setTimeout(closeOrderModal, 2000);
  });
}
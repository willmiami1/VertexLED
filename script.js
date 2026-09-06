const salesPhoneDisplay = "1 (888) 590-1720";
const salesPhoneHref = "tel:18885901720";

document.querySelectorAll("[data-sales-phone-text]").forEach((node) => {
  node.textContent = salesPhoneDisplay;
});

document.querySelectorAll("[data-sales-phone-link]").forEach((node) => {
  node.setAttribute("href", salesPhoneHref);
});

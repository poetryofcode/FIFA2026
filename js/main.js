const swiper = new Swiper(".swiper", {
  // loop: true,

  pagination: {
    el: ".swiper-pagination",
    type: "fraction",
  },

  navigation: {
    nextEl: ".slider-button-next",
    prevEl: ".slider-button-prev",
  },
});

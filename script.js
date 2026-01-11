console.log("Script Loaded");

// GSAP MatchMedia Initialize
let mm = gsap.matchMedia();

// --- DESKTOP ANIMATION (Loader + Transition) ---
mm.add("(min-width: 800px)", () => {
  // Desktop ke liye wahi purana heavy loader logic
  let tl = gsap.timeline({ delay: 0 });

  tl.to(".col", {
    top: 0,
    duration: 3,
    ease: "power4.inOut",
  });

  tl.to(
    ".c-1 .item",
    { top: 0, stagger: 0.25, duration: 3, ease: "power4.inOut" },
    "-=2"
  );
  tl.to(
    ".c-2 .item",
    { top: 0, stagger: -0.25, duration: 3, ease: "power4.inOut" },
    "-=4"
  );
  tl.to(
    ".c-3 .item",
    { top: 0, stagger: 0.25, duration: 3, ease: "power4.inOut" },
    "-=4"
  );
  tl.to(
    ".c-4 .item",
    { top: 0, stagger: -0.25, duration: 3, ease: "power4.inOut" },
    "-=4"
  );
  tl.to(
    ".c-5 .item",
    { top: 0, stagger: 0.25, duration: 3, ease: "power4.inOut" },
    "-=4"
  );

  tl.to(
    ".loader-container",
    { scale: 6, duration: 4, ease: "power4.inOut" },
    "-=2"
  );

  tl.to(
    ".loader-nav-item a, .loader-title p, .loader-slide-num p, .loader-preview img",
    { top: 0, stagger: 0.075, duration: 1, ease: "power3.Out" },
    "-=1.5"
  );


  tl.to(
    ".loader-wrapper",
    {
      opacity: 0,
      duration: 0.9,
      ease: "power3.inOut",
      onComplete: () => {
        document.querySelector(".loader-wrapper").classList.add("hidden");
        document.querySelector(".slider").classList.add("active");
        initSlider(); // Animation khatam hone ke baad slider shuru karo
      },
    },
    "+=0.4"
  );

  return () => {

  };
});


mm.add("(max-width: 799px)", () => {
  // Mobile pe loader ko turant chhupa do
  gsap.set(".loader-wrapper", { display: "none", opacity: 0 });

  // Slider/Content ko turant dikha do
  gsap.set(".slider", { opacity: 1, visibility: "visible" });
  document.querySelector(".slider").classList.add("active");

  initSlider();
});


function initSlider() {
  const sliderImage = document.querySelector(".slider-images");
  const counter = document.querySelector(".counter");
  const titles = document.querySelector(".slider-title-wrapper");
  const indicators = document.querySelectorAll(".slider-indicator p");
  const presSlides = document.querySelectorAll(".slider-preview .preview");
  const sliderPreview = document.querySelector(".slider-preview");

  if (!sliderImage) return;

  let currentImg = 1;
  const totalSlides = 5;
  let indicatorRotation = 0;
  const imageUrls = [
    "./assets/img29.webp",
    "./assets/img28.webp",
    "./assets/img27.webp",
    "./assets/img19.webp",
    "./assets/img12.webp",
  ];

  const updateCounterAndTitlePosition = () => {
    const counterY = -20 * (currentImg - 1);
    const titleY = -60 * (currentImg - 1);

    gsap.to(counter, {
      y: counterY,
      duration: 1,
      ease: "power2.out",
    });

    gsap.to(titles, {
      y: titleY,
      duration: 1,
      ease: "power2.out",
    });
  };

  const updateActiveSliderPreview = () => {
    presSlides.forEach((prev) => prev.classList.remove("active"));
    if (presSlides[currentImg - 1]) {
      presSlides[currentImg - 1].classList.add("active");
    }
  };

  const cleanupSlides = () => {
    const imgElements = document.querySelectorAll(".slider-images .img");
    if (imgElements.length > totalSlides) {
      imgElements[0].remove();
    }
  };

  const animateSlides = (direction) => {
    const currentSlides = document.querySelectorAll(".img");
    const lastSlide = currentSlides[currentSlides.length - 1];

    const slideImg = document.createElement("div");
    slideImg.classList.add("img");

    const slideImgElem = document.createElement("img");
    slideImgElem.src = imageUrls[currentImg - 1];

    gsap.set(slideImg, { x: direction === "left" ? -300 : 300 });

    slideImg.appendChild(slideImgElem);
    sliderImage.appendChild(slideImg);

    gsap.to(lastSlide.querySelector("img"), {
      x: direction === "left" ? 300 : -300,
      duration: 1.5,
      ease: "power4.inOut",
    });

    gsap.fromTo(
      slideImg,
      {
        clipPath:
          direction === "left"
            ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
            : "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
      },
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 1.5,
        ease: "power4.inOut",
      }
    );

    gsap.to(slideImg, {
      x: 0,
      duration: 1.5,
      ease: "power4.inOut",
    });

    cleanupSlides();

    indicatorRotation += direction === "left" ? -90 : 90;
    gsap.to(indicators, {
      rotation: indicatorRotation,
      duration: 1,
      ease: "power2.out",
    });
  };

  // Click Event Listener
  document.addEventListener("click", (e) => {
    // Sirf tab kaam kare jab slider active ho
    if (!document.querySelector(".slider.active")) return;

    const sliderElement = document.querySelector(".slider");
    if (!sliderElement) return;

    const sliderWidth = sliderElement.clientWidth;
    const clickPosition = e.clientX;

    if (sliderPreview && sliderPreview.contains(e.target)) {
      const clickPrev = e.target.closest(".preview");

      if (clickPrev) {
        const clickIndex = Array.from(presSlides).indexOf(clickPrev) + 1;
        if (clickIndex !== currentImg) {
          if (clickIndex < currentImg) {
            currentImg = clickIndex;
            animateSlides("left");
          } else {
            currentImg = clickIndex;
            animateSlides("right");
          }
          updateActiveSliderPreview();
          updateCounterAndTitlePosition();
        }
      }
      return;
    }

    // Navigation logic (Left/Right click)
    if (clickPosition < sliderWidth / 2 && currentImg !== 1) {
      currentImg--;
      animateSlides("left");
    } else if (clickPosition > sliderWidth / 2 && currentImg !== totalSlides) {
      currentImg++;
      animateSlides("right");
    }
    updateActiveSliderPreview();
    updateCounterAndTitlePosition();
  });
}

const menuToggle=document.getElementById("menuToggle");
const nav=document.getElementById("nav");
menuToggle.addEventListener("click",()=>{nav.classList.toggle("open");menuToggle.textContent=nav.classList.contains("open")?"×":"☰"});
nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>nav.classList.remove("open")));

const modal=document.getElementById("loginModal");
const openModal=()=>{modal.classList.add("show");document.body.style.overflow="hidden";setTimeout(()=>document.getElementById("studentId").focus(),100)};
const closeModal=()=>{modal.classList.remove("show");document.body.style.overflow="";document.getElementById("modalMessage").textContent=""};
["loginOpen","quickLogin","portalLogin","footerLogin"].forEach(id=>document.getElementById(id).addEventListener("click",e=>{e.preventDefault();openModal()}));
document.getElementById("modalClose").addEventListener("click",closeModal);
modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
document.getElementById("demoLogin").addEventListener("submit",e=>{
  e.preventDefault();
  document.getElementById("modalMessage").textContent="This is a frontend preview. Student authentication will be enabled after the secure school backend is connected.";
});


// Slide navigation: one section is visible at a time.
document.body.classList.add("presentation-mode");
const slides = Array.from(document.querySelectorAll("main > .slide, footer.slide"));
const prevButton = document.getElementById("prevSlide");
const nextButton = document.getElementById("nextSlide");
const counter = document.getElementById("slideCounter");
const progress = document.getElementById("slideProgress");
const progressTrack = document.querySelector(".slide-progress");
let currentSlide = Math.max(0, slides.findIndex(slide => slide.classList.contains("active")));

function showSlide(index, updateHash = true) {
  currentSlide = Math.max(0, Math.min(index, slides.length - 1));
  slides.forEach((slide, i) => {
    const active = i === currentSlide;
    slide.classList.toggle("active", active);
    slide.setAttribute("aria-hidden", String(!active));
    if (active) slide.scrollTop = 0;
  });
  prevButton.disabled = currentSlide === 0;
  nextButton.disabled = currentSlide === slides.length - 1;
  counter.textContent = `${String(currentSlide + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  progress.style.width = `${((currentSlide + 1) / slides.length) * 100}%`;
  progressTrack.setAttribute("aria-valuemax", String(slides.length));
  progressTrack.setAttribute("aria-valuenow", String(currentSlide + 1));
  document.querySelectorAll("#nav a").forEach(link => {
    const target = link.getAttribute("href");
    link.classList.toggle("active", target === `#${slides[currentSlide].id}` || (currentSlide === 0 && target === "#"));
  });
  if (updateHash) {
    const id = slides[currentSlide].id;
    history.replaceState(null, "", id ? `#${id}` : location.pathname);
  }
  window.scrollTo({ top: 0, behavior: "instant" });
}

prevButton.addEventListener("click", () => showSlide(currentSlide - 1));
nextButton.addEventListener("click", () => showSlide(currentSlide + 1));
document.addEventListener("keydown", event => {
  if (modal.classList.contains("show") || event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === "ArrowRight" || event.key === "PageDown") { event.preventDefault(); showSlide(currentSlide + 1); }
  if (event.key === "ArrowLeft" || event.key === "PageUp") { event.preventDefault(); showSlide(currentSlide - 1); }
});

// Any in-page link moves to the slide containing its target instead of scrolling.
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", event => {
    const href = link.getAttribute("href");
    if (!href || href === "#" || link.id === "footerLogin") {
      if (href === "#") { event.preventDefault(); showSlide(0); }
      return;
    }
    const target = document.querySelector(href);
    if (!target) return;
    const targetSlide = target.closest(".slide");
    if (targetSlide) {
      event.preventDefault();
      showSlide(slides.indexOf(targetSlide));
      nav.classList.remove("open");
    }
  });
});

// Open the slide named by a shared URL hash, if present.
if (location.hash) {
  const target = document.querySelector(location.hash);
  const targetSlide = target && target.closest(".slide");
  if (targetSlide) currentSlide = slides.indexOf(targetSlide);
}
showSlide(currentSlide, false);

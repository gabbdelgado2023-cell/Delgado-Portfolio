/* =========================
   DOM Elements
   ========================= */
const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const loader = document.querySelector(".page-loader");
const hoverElements = document.querySelectorAll(
  "a, button, .nav-item, .skill-card, .stat-item, .contact-item, .project-card, .project-actions .btn"
);
const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll(".section, .hero");
/* =========================
      Theme Toggle
      ========================= */
let isDark = false;
themeToggle.addEventListener("click", () => {
  isDark = !isDark;
  if (isDark) {
    body.setAttribute("data-theme", "dark");
    themeIcon.classList.replace("fa-sun", "fa-moon");
  } else {
    body.removeAttribute("data-theme");
    themeIcon.classList.replace("fa-moon", "fa-sun");
  }
});

/* =========================
      Scroll Progress Bar
      ========================= */
window.addEventListener("scroll", () => {
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const progress = (scrollTop / (scrollHeight || 1)) * 100;
  document.querySelector(".scroll-progress").style.width = progress + "%";
});

/* =========================
      Smooth Nav Clicks
      ========================= */
navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const id = item.getAttribute("data-section");
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

/* =========================
      Active Nav on Scroll
      ========================= */
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.clientHeight;
    if (window.scrollY >= top - 200) current = section.getAttribute("id");
  });
  navItems.forEach((item) => {
    item.classList.remove("active");
    if (item.getAttribute("data-section") === current)
      item.classList.add("active");
  });
});

/* =========================
      Typing Animation
      ========================= */
const typingText = document.getElementById("typingText");
const roles = [
  "Web Developer",
  "UI Designer",
  "Student",
  "Problem Solver",
  "Tech Enthusiast",
];
let roleIndex = 0,
  charIndex = 0,
  isDeleting = false;
function typeRole() {
  const current = roles[roleIndex];
  typingText.textContent = isDeleting
    ? current.substring(0, charIndex--)
    : current.substring(0, charIndex++);
  let speed = isDeleting ? 50 : 110;
  if (!isDeleting && charIndex === current.length) {
    speed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    speed = 500;
  }
  setTimeout(typeRole, speed);
}
typeRole();

/* =========================
      Intersection Observers
      ========================= */
// Reveal animation
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document
  .querySelectorAll(".timeline-item, .skill-card, .stat-item, .project-card")
  .forEach((el) => revealObserver.observe(el));

// Skill progress bars
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const pct = parseInt(card.getAttribute("data-progress") || 0, 10);
        const fill = card.querySelector(".progress-fill");
        const meta = card.querySelector(".meta-percent");
        fill.style.width = pct + "%";
        if (meta)
          meta.textContent = meta.textContent.includes("%")
            ? pct + "%"
            : meta.textContent;
        skillObserver.unobserve(card);
      }
    });
  },
  { threshold: 0.25 }
);
document
  .querySelectorAll(".skill-card")
  .forEach((c) => skillObserver.observe(c));

// Stats count up
function animateCount(el, start, end, duration) {
  let startTime = null;
  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    const raw = el.getAttribute("data-count") || "";
    if (raw.includes("+")) el.textContent = raw;
    else if (raw.includes("%")) el.textContent = value + "%";
    else el.textContent = value;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const stat = entry.target.querySelector(".stat-number");
        if (!stat) return;
        const raw = stat.getAttribute("data-count") || "0";
        const target = parseInt(raw.replace("%", "").replace("+", "")) || 0;
        animateCount(stat, 0, target, 1600);
        statObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);
document
  .querySelectorAll(".stat-item")
  .forEach((si) => statObserver.observe(si));

/* =========================
      Contact Form (Simulated)
      ========================= */
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const submitBtn = e.target.querySelector(".submit-btn");
  submitBtn.textContent = "Sending...";
  submitBtn.style.background = "var(--text-secondary)";
  setTimeout(() => {
    submitBtn.textContent = "Message Sent!";
    submitBtn.style.background = "#28a745";
    setTimeout(() => {
      submitBtn.textContent = "Send Message";
      submitBtn.style.background = "var(--text-primary)";
      e.target.reset();
    }, 1600);
  }, 900);
});

/* =========================
      Modal for Projects
      ========================= */
const projectData = [
  { title: "Gaming Esports Team Website", image: "projects/nexus.png" },
  { title: "Personal Portfolio", image: "projects/portfolio.png" },
  { title: "iPhone 17 Ad Poster", image: "projects/ad.png" },
  { title: "STORM (Mini App)", image: "projects/STORM.jpg" },
];

const modal = document.getElementById("projectModal");
const modalImg = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const closeBtn = document.querySelector(".close-btn");

document.querySelectorAll(".project-card").forEach((card, index) => {
  const viewBtn = card.querySelector(".project-actions .btn:first-child");
  if (viewBtn) {
    viewBtn.addEventListener("click", () => {
      const data = projectData[index];
      if (data) {
        modalImg.src = data.image;
        modalTitle.textContent = data.title;
        modal.style.display = "flex";
      }
    });
  }
});

closeBtn.addEventListener("click", () => (modal.style.display = "none"));
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

/* =========================
      GSAP Animations
      ========================= */
gsap.registerPlugin(ScrollTrigger);

// === Unified Load Handler (Fix for Hero Missing Issue) ===
window.addEventListener("load", () => {
  const loader = document.querySelector(".page-loader");
  const hero = document.querySelector("#hero");
  gsap.to(loader, {
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    onComplete: () => {
      loader.style.display = "none";
      hero.classList.add("visible");

      gsap.to(hero, {
        opacity: 1,
        filter: "blur(0px)",
        duration: 1,
        ease: "power2.out",
        onComplete: startHeroAnimations,
      });
    },
  });
});

function startHeroAnimations() {
  gsap.from(".id-card", {
    y: 50,
    opacity: 1,
    duration: 1,
    delay: 0.3,
    ease: "power3.out",
  });
  gsap.from(".name-display", {
    y: 30,
    opacity: 0,
    duration: 1,
    delay: 0.6,
    ease: "power3.out",
  });
  gsap.from(".role-text", {
    y: 20,
    opacity: 0,
    duration: 1,
    delay: 0.9,
    ease: "power3.out",
  });
}



// === Skills Section ===
ScrollTrigger.batch(".skill-card", {
  onEnter: (batch) =>
    gsap.fromTo(
      batch,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
      }
    ),
  start: "top 90%",
});

// === Projects Section ===
ScrollTrigger.batch(".project-card", {
  onEnter: (batch) =>
    gsap.fromTo(
      batch,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
      }
    ),
  start: "top 90%",
});

// === Activity Section ===
ScrollTrigger.batch(".timeline-item", {
  onEnter: (batch) =>
    gsap.fromTo(
      batch,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.15,
        ease: "power2.out",
      }
    ),
  start: "top 90%",
});

// === About Stats Count (smooth GSAP version) ===
document.querySelectorAll(".stat-number").forEach((num) => {
  let endValue = parseInt(num.getAttribute("data-count")) || 0;
  ScrollTrigger.create({
    trigger: num,
    start: "top 90%",
    onEnter: () => {
      gsap.fromTo(
        { val: 0 },
        {
          val: endValue,
          duration: 2,
          ease: "power1.out",
          onUpdate: function () {
            num.innerText = Math.floor(this.targets()[0].val);
          },
        }
      );
    },
  });
});

// === Contact Section ===
ScrollTrigger.batch([".contact-info", ".contact-form"], {
  onEnter: (batch) =>
    batch.forEach((el) => {
      const x = el.classList.contains("contact-info") ? -50 : 50;
      gsap.fromTo(
        el,
        { x: x, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power2.out" }
      );
    }),
  start: "top 90%",
});

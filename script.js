/* =========================
           DOM Elements
           ========================= */
           const body = document.body;
           const themeToggle = document.getElementById('themeToggle');
           const themeIcon = document.getElementById('themeIcon');
           const loader = document.querySelector('.page-loader');
           const cursor = document.querySelector('.cursor');
           const cursorFollower = document.querySelector('.cursor-follower');
           const hoverElements = document.querySelectorAll('a, button, .nav-item, .skill-card, .stat-item, .contact-item, .project-card, .project-actions .btn');
           const navItems = document.querySelectorAll('.nav-item');
           const sections = document.querySelectorAll('.section, .hero');
   
           /* =========================
              Page load / loader
              ========================= */
           window.addEventListener('load', () => {
               setTimeout(()=> loader.classList.add('hidden'), 800);
           });
   
           /* =========================
              Custom cursor
              ========================= */
           document.addEventListener('mousemove', (e) => {
               cursor.style.left = e.clientX + 'px';
               cursor.style.top = e.clientY + 'px';
               // follower with slight delay
               setTimeout(()=>{ cursorFollower.style.left = e.clientX + 'px'; cursorFollower.style.top = e.clientY + 'px'; }, 70);
           });
   
           hoverElements.forEach(el => {
               el.addEventListener('mouseenter', ()=> cursor.classList.add('hover'));
               el.addEventListener('mouseleave', ()=> cursor.classList.remove('hover'));
           });
   
           /* =========================
              Theme toggle (manual)
              ========================= */
           let isDark = false;
           themeToggle.addEventListener('click', () => {
               isDark = !isDark;
               if (isDark){ body.setAttribute('data-theme','dark'); themeIcon.classList.remove('fa-sun'); themeIcon.classList.add('fa-moon'); }
               else{ body.removeAttribute('data-theme'); themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun'); }
           });
   
           /* =========================
              Scroll progress
              ========================= */
           window.addEventListener('scroll', () => {
               const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
               const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
               const progress = (scrollTop / (scrollHeight || 1)) * 100;
               document.querySelector('.scroll-progress').style.width = progress + '%';
           });
   
           /* =========================
              Smooth nav clicks
              ========================= */
           navItems.forEach(item => {
               item.addEventListener('click', () => {
                   const id = item.getAttribute('data-section');
                   const target = document.getElementById(id);
                   if (target) target.scrollIntoView({behavior:'smooth'});
               });
           });
   
           /* =========================
              Active nav on scroll
              ========================= */
           window.addEventListener('scroll', () => {
               let current = '';
               sections.forEach(section => {
                   const top = section.offsetTop;
                   const height = section.clientHeight;
                   if (window.scrollY >= top - 200) current = section.getAttribute('id');
               });
               navItems.forEach(item => {
                   item.classList.remove('active');
                   if (item.getAttribute('data-section') === current) item.classList.add('active');
               });
           });
   
           /* =========================
              Typing animation
              ========================= */
           const typingText = document.getElementById('typingText');
           const roles = ['Web Developer', 'UI Designer', 'Student', 'Problem Solver', 'Tech Enthusiast'];
           let roleIndex=0,charIndex=0,isDeleting=false;
           function typeRole(){
               const current = roles[roleIndex];
               if (isDeleting){
                   typingText.textContent = current.substring(0,charIndex-1);
                   charIndex--;
               } else {
                   typingText.textContent = current.substring(0,charIndex+1);
                   charIndex++;
               }
               let speed = isDeleting ? 50 : 110;
               if (!isDeleting && charIndex === current.length){ speed = 2000; isDeleting=true; }
               else if (isDeleting && charIndex === 0){ isDeleting=false; roleIndex = (roleIndex+1) % roles.length; speed = 500; }
               setTimeout(typeRole, speed);
           }
           typeRole();
   
           /* =========================
              Intersection Observer - reveal + stats count + timeline
              ========================= */
           const revealObserver = new IntersectionObserver((entries) => {
               entries.forEach(entry => {
                   if (entry.isIntersecting){
                       entry.target.style.opacity = '1';
                       entry.target.style.transform = 'translateY(0)';
                       revealObserver.unobserve(entry.target);
                   }
               });
           }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
   
           // observe timeline items, skill cards, stat-items, project-cards
           document.querySelectorAll('.timeline-item, .skill-card, .stat-item, .project-card').forEach(el=>{
               revealObserver.observe(el);
           });
   
           // animate skill progress bars when in view
           const skillObserver = new IntersectionObserver((entries) => {
               entries.forEach(entry=>{
                   if (entry.isIntersecting){
                       const card = entry.target;
                       const pct = parseInt(card.getAttribute('data-progress') || 0,10);
                       const fill = card.querySelector('.progress-fill');
                       const meta = card.querySelector('.meta-percent');
                       fill.style.width = pct + '%';
                       if (meta) meta.textContent = (meta.textContent.includes('%') ? pct + '%' : meta.textContent);
                       skillObserver.unobserve(card);
                   }
               });
           }, { threshold: 0.25 });
   
           document.querySelectorAll('.skill-card').forEach(c => skillObserver.observe(c));
   
           // count up for stats
           function animateCount(el, start, end, duration){
               let startTime = null;
               function step(timestamp){
                   if (!startTime) startTime = timestamp;
                   const progress = Math.min((timestamp - startTime) / duration, 1);
                   const value = Math.floor(progress * (end - start) + start);
                   // handle "1+" and "%" values gracefully
                   const raw = el.getAttribute('data-count') || '';
                   if (raw.includes('+')) el.textContent = (value < 1 ? raw : raw);
                   else if (raw.includes('%')) el.textContent = value + '%';
                   else el.textContent = value;
                   if (progress < 1) requestAnimationFrame(step);
               }
               requestAnimationFrame(step);
           }
   
           const statObserver = new IntersectionObserver((entries) => {
               entries.forEach(entry=>{
                   if (entry.isIntersecting){
                       const stat = entry.target.querySelector('.stat-number');
                       if (!stat) return;
                       const raw = stat.getAttribute('data-count') || '0';
                       // parse safe int
                       const target = parseInt(raw.replace('%','').replace('+','')) || 0;
                       animateCount(stat, 0, target, 1600);
                       statObserver.unobserve(entry.target);
                   }
               });
           }, { threshold: 0.3 });
   
           document.querySelectorAll('.stat-item').forEach(si => statObserver.observe(si));
   
           /* =========================
              Contact form UI (local simulation)
              ========================= */
           document.getElementById('contactForm').addEventListener('submit', (e) => {
               e.preventDefault();
               const submitBtn = e.target.querySelector('.submit-btn');
               submitBtn.textContent = 'Sending...';
               submitBtn.style.background = 'var(--text-secondary)';
               setTimeout(()=>{
                   submitBtn.textContent = 'Message Sent!';
                   submitBtn.style.background = '#28a745';
                   setTimeout(()=>{
                       submitBtn.textContent = 'Send Message';
                       submitBtn.style.background = 'var(--text-primary)';
                       e.target.reset();
                   }, 1600);
               }, 900);
           });
   
           /* =========================
              Accessibility: keyboard focus for project cards
              ========================= */
           document.querySelectorAll('.project-card').forEach(pc => {
               pc.addEventListener('keypress', (e) => {
                   if (e.key === 'Enter') pc.click();
               });
           });
   
           /* small utility: reveal timeline items so they show up */
           document.querySelectorAll('.timeline-item').forEach((t, i) => {
               // small stagger if already visible on load
               setTimeout(()=> { t.style.opacity = '1'; t.style.transform='translateY(0)'; }, 300 + i*120);
           });
   
           /* Prevent default drag on images */
           document.querySelectorAll('img').forEach(img => img.addEventListener('dragstart', e => e.preventDefault()));
   
   
   
           
       // === Dynamic Project Data (images + titles) ===
       const projectData = [
         {
           title: "Gaming Esports Team Website",
           image: "projects/nexus.png",
         },
         {
           title: "Personal Portfolio",
           image: "/projects/portfolio.png",
         },
         {
           title: "iPhone 17 Ad Poster",
           image: "projects/ad.png",
         },
         {
           title: "STORM (Mini App)",
           image: "/projects/STORM.jpg",
         },
       ];
   
       // === Select Elements ===
       const modal = document.getElementById("projectModal");
       const modalImg = document.getElementById("modalImage");
       const modalTitle = document.getElementById("modalTitle");
       const closeBtn = document.querySelector(".close-btn");
   
       // === Link "View / Live / Open" Buttons to Modal ===
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
   
       // === Close Modal on X or Outside Click ===
       closeBtn.addEventListener("click", () => modal.style.display = "none");
       modal.addEventListener("click", (e) => {
       if (e.target === modal) modal.style.display = "none";
       });


       gsap.registerPlugin(ScrollTrigger);

       // === Register GSAP Plugins ===
gsap.registerPlugin(ScrollTrigger);

// === Page Loader ===
window.addEventListener("load", () => {
  gsap.to(".page-loader", {
    opacity: 0,
    duration: 1,
    onComplete: () => document.querySelector(".page-loader").style.display = "none"
  });
});

// === Hero Animations ===
gsap.from(".hero-content", { y: 80, opacity: 0, duration: 1.2, ease: "power3.out" });
gsap.from(".id-card", { y: 50, opacity: 0, duration: 1, delay: 0.3, ease: "power3.out" });
gsap.from(".name-display", { y: 30, opacity: 0, duration: 1, delay: 0.5, ease: "power3.out" });
gsap.from(".role-text", { y: 20, opacity: 0, duration: 1, delay: 0.7, ease: "power3.out" });

// === Skills Section (reliable for dynamic items) ===
ScrollTrigger.batch(".skill-card", {
  interval: 0.1,
  batchMax: 10,
  onEnter: batch => {
    gsap.fromTo(batch, { y: 40, opacity: 0, scale: 1 }, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out"
    });
  },
  start: "top 90%"
});

// === Projects Section ===
ScrollTrigger.batch(".project-card", {
  interval: 0.1,
  batchMax: 10,
  onEnter: batch => {
    gsap.fromTo(batch, { y: 40, opacity: 0, scale: 1 }, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out"
    });
  },
  start: "top 90%"
});

// === Project Hover Effect ===
document.querySelectorAll(".project-card").forEach(card => {
  card.addEventListener("mouseenter", () => {
    gsap.to(card, { scale: 1.05, boxShadow: "0 15px 30px rgba(0,0,0,0.2)", duration: 0.3 });
  });
  card.addEventListener("mouseleave", () => {
    gsap.to(card, { scale: 1, boxShadow: "0 5px 15px rgba(0,0,0,0.1)", duration: 0.3 });
  });
});

// === Activity Section ===
ScrollTrigger.batch(".timeline-item", {
  interval: 0.1,
  batchMax: 10,
  onEnter: batch => {
    gsap.fromTo(batch, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: "power2.out" });
  },
  start: "top 90%"
});

// === About Section Stats Count Up ===
document.querySelectorAll(".stat-number").forEach(num => {
  let endValue = parseInt(num.getAttribute("data-count")) || 0;
  ScrollTrigger.create({
    trigger: num,
    start: "top 90%",
    onEnter: () => {
      gsap.fromTo({ val: 0 }, { val: endValue, duration: 2, ease: "power1.out",
        onUpdate: function() { num.innerText = Math.floor(this.targets()[0].val); }
      });
    }
  });
});

// === Contact Section ===
ScrollTrigger.batch([".contact-info", ".contact-form"], {
  interval: 0.1,
  batchMax: 2,
  onEnter: batch => {
    batch.forEach(el => {
      const x = el.classList.contains("contact-info") ? -50 : 50;
      gsap.fromTo(el, { x: x, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power2.out" });
    });
  },
  start: "top 90%"
});

// === Scroll Progress Indicator ===
window.addEventListener("scroll", () => {
  const scrollProgress = document.querySelector(".scroll-progress");
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  scrollProgress.style.width = (scrollTop / docHeight) * 100 + "%";
});






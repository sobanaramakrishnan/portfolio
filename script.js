document.addEventListener('DOMContentLoaded', function () {

  // === Loader ===
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = 'auto';
    initReveal();
  }, 1800);
  document.body.style.overflow = 'hidden';


  // === Particle Canvas — subtle, reduced ===
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const colors = [
    'rgba(245,158,11,0.5)',
    'rgba(139,92,246,0.5)',
    'rgba(6,182,212,0.4)',
    'rgba(16,185,129,0.35)'
  ];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.5;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.4 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Reduced to 50 particles
  for (let i = 0; i < 50; i++) particles.push(new Particle());

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();


  // === Sticky Nav ===
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveNav();
  });


  // === Active Nav Link ===
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    const scrollY = window.scrollY;
    sections.forEach(section => {
      const top = section.offsetTop - 80;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(link => link.classList.remove('active'));
        const match = document.querySelector(`.nav-links a[href="#${section.id}"]`);
        if (match) match.classList.add('active');
      }
    });
  }

  const homeLink = document.querySelector('.nav-links a[href="#home"]');
  if (homeLink) homeLink.classList.add('active');


  // === Smooth Scroll Nav ===
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) window.scrollTo({ top: target.offsetTop - 60, behavior: 'smooth' });
    });
  });


  // === Mobile Menu ===
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (toggle) toggle.addEventListener('click', () => mobileMenu.classList.add('open'));
  if (mobileClose) mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));

  mobileLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      mobileMenu.classList.remove('open');
      const target = document.querySelector(this.getAttribute('href'));
      if (target) window.scrollTo({ top: target.offsetTop - 60, behavior: 'smooth' });
    });
  });


  // === Typed Role Animation ===
  const roles = [
    'AI Systems',
    'RAG Chatbots',
    'LLM Pipelines',
    'Deep Learning Models',
    'Intelligent Automation'
  ];
  let roleIdx = 0, charIdx = 0, isDeleting = false;
  const typedEl = document.getElementById('typedRole');

  function typeRole() {
    if (!typedEl) return;
    const current = roles[roleIdx];
    if (!isDeleting) {
      typedEl.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        isDeleting = true;
        setTimeout(typeRole, 2000);
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    setTimeout(typeRole, isDeleting ? 55 : 95);
  }
  setTimeout(typeRole, 800);


  // === Scroll Reveal ===
  function initReveal() {
    const revealEls = document.querySelectorAll(
      '.hero-photo-wrap, .hero-text, .about-text, .about-details, .tl-item, .project-card, .skill-group, .contact-item, .contact-form, .achievement-item, .pub-item, .stat-pill, .highlight-chip'
    );

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, delay);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    revealEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
      el.dataset.delay = (i % 5) * 70;
      obs.observe(el);
    });
  }


  // === Project Filter ===
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.dataset.filter;
      projectCards.forEach(card => {
        if (filter === 'all') {
          card.style.display = 'block';
        } else {
          const cats = (card.dataset.category || '').split(' ');
          card.style.display = cats.includes(filter) ? 'block' : 'none';
        }
      });
    });
  });


  // === Contact Form ===
  const scriptURL = 'https://script.google.com/macros/s/AKfycbzbDdO-G02uBnqrY95txrPBlVhdVKGFPx86xOigTyRHR4qZuUb-wGBxgi33UcfOWnTNRw/exec';
  const form = document.forms['submitToGoogleSheet'];
  const msg = document.getElementById('msg');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      fetch(scriptURL, { method: 'POST', body: new FormData(form), mode: 'no-cors' })
        .then(() => {
          msg.textContent = '✓ Message sent successfully!';
          msg.style.color = '#10b981';
          form.reset();
          btn.innerHTML = '<i class="fa fa-paper-plane"></i> Send Message';
          btn.disabled = false;
          setTimeout(() => { msg.textContent = ''; }, 4000);
        })
        .catch(error => {
          console.error('Error!', error.message);
          msg.textContent = 'Something went wrong. Please try again.';
          msg.style.color = '#ef4444';
          btn.innerHTML = '<i class="fa fa-paper-plane"></i> Send Message';
          btn.disabled = false;
        });
    });
  }

});

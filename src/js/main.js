// Scroll-triggered fade-in
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Navbar scroll effect
window.addEventListener('scroll', () => {
  document.querySelector('.nav').classList.toggle('scrolled', window.scrollY > 20);
});

// Smooth scroll for nav links (skip links handled by inquiry modal)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    if (a.hasAttribute('data-open-modal')) return;
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      document.querySelector('.nav-links').classList.remove('open');
    }
  });
});

// Hero carousel — auto-play with arrows & dots
// ➜ To add a new hero image: drop the file in src/images/hero-carousel/
//   then add an entry to this array with the filename and alt text.
const heroImages = [
  { src: '/images/hero-carousel/donna-champagne-flower-wall.jpg', alt: 'Donna Champagne flower wall with white roses and hydrangeas at a Tampa Bay wedding venue' },
  { src: '/images/hero-carousel/flora-pink-flower-wall.jpg', alt: 'Flora Pink flower wall with pink roses for a bridal shower in Clearwater Florida' },
  { src: '/images/hero-carousel/pink-flower-wall-baby-shower-led-sign-tampa.jpg', alt: 'Pink flower wall with Baby In Bloom LED sign for a baby shower in Tampa Florida' },
  { src: '/images/hero-carousel/serenity-twin-floral-arches-outdoor-ceremony-tampa.jpg', alt: 'Serenity twin floral arches with white roses at an outdoor wedding ceremony in Tampa Bay' },
  { src: '/images/hero-carousel/pink-flower-wall-happily-ever-after-led-sign-tampa.jpg', alt: 'Pink flower wall with Happily Ever After LED sign and wicker chairs at a Tampa Bay wedding reception' },
  { src: '/images/hero-carousel/flora-pink-flower-wall-photo-booth-setup-tampa.jpg', alt: 'Flora Pink flower wall with mirror photo booth setup at a Tampa Bay celebration' },
  { src: '/images/hero-carousel/photo-booth-rental-tampa.jpg', alt: 'Amor Red rose flower wall with mirror photo booth rental at a Tampa Bay event venue' },
  { src: '/images/hero-carousel/photo-booth-rental.jpg', alt: 'Hedge flower wall with LED sign and mirror photo booth at a corporate event in Tampa' },
  // Add more images here ↓
];

(function() {
  const carousel = document.querySelector('.hero-carousel');
  const track = document.querySelector('.hero-carousel-track');
  const dotsWrap = document.querySelector('.hero-carousel-dots');
  if (!carousel || !track || !dotsWrap) return;

  // Build slides from heroImages array
  heroImages.forEach(function(img, i) {
    var slide = document.createElement('div');
    slide.className = 'hero-carousel-slide';
    var image = document.createElement('img');
    image.src = img.src;
    image.alt = img.alt;
    image.width = 400;
    image.height = 533;
    image.loading = i === 0 ? 'eager' : 'lazy';
    slide.appendChild(image);
    track.appendChild(slide);
  });

  const slides = track.querySelectorAll('.hero-carousel-slide');
  const prevBtn = carousel.querySelector('.hero-carousel-arrow--prev');
  const nextBtn = carousel.querySelector('.hero-carousel-arrow--next');
  let current = 0;
  let autoPlayTimer;

  function goToSlide(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dotsWrap.querySelectorAll('.hero-carousel-dot').forEach(function(d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    for (var i = 0; i < slides.length; i++) {
      var dot = document.createElement('button');
      dot.className = 'hero-carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to image ' + (i + 1));
      dot.addEventListener('click', (function(idx) { return function() { goToSlide(idx); resetAutoPlay(); }; })(i));
      dotsWrap.appendChild(dot);
    }
  }

  function startAutoPlay() {
    autoPlayTimer = setInterval(function() { goToSlide(current + 1); }, 5000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  prevBtn.addEventListener('click', function() { goToSlide(current - 1); resetAutoPlay(); });
  nextBtn.addEventListener('click', function() { goToSlide(current + 1); resetAutoPlay(); });

  carousel.addEventListener('mouseenter', function() { clearInterval(autoPlayTimer); });
  carousel.addEventListener('mouseleave', function() { startAutoPlay(); });

  buildDots();
  startAutoPlay();
})();

// Reviews carousel — arrows & dots
(function() {
  const track = document.getElementById('reviews-track');
  const dotsWrap = document.getElementById('reviews-dots');
  if (!track || !dotsWrap) return;

  const cards = track.querySelectorAll('.review-card');
  const prevBtn = document.querySelector('.reviews-arrow--prev');
  const nextBtn = document.querySelector('.reviews-arrow--next');

  function getVisibleCount() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    const count = Math.ceil(cards.length / getVisibleCount());
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = 'reviews-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to review group ' + (i + 1));
      dot.addEventListener('click', () => scrollToGroup(i));
      dotsWrap.appendChild(dot);
    }
  }

  function scrollToGroup(index) {
    const card = cards[index * getVisibleCount()];
    if (card) track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' });
  }

  function updateDots() {
    const scrollPos = track.scrollLeft;
    const cardWidth = cards[0].offsetWidth + 24;
    const groupIndex = Math.round(scrollPos / (cardWidth * getVisibleCount()));
    dotsWrap.querySelectorAll('.reviews-dot').forEach((d, i) => {
      d.classList.toggle('active', i === groupIndex);
    });
  }

  track.addEventListener('scroll', updateDots);

  prevBtn.addEventListener('click', () => {
    const cardWidth = cards[0].offsetWidth + 24;
    track.scrollBy({ left: -(cardWidth * getVisibleCount()), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    const cardWidth = cards[0].offsetWidth + 24;
    track.scrollBy({ left: cardWidth * getVisibleCount(), behavior: 'smooth' });
  });

  buildDots();
  window.addEventListener('resize', buildDots);
})();

// Walls carousel (product detail pages) — arrow scroll
(function() {
  var track = document.querySelector('.walls-carousel-track');
  if (!track) return;
  var prevBtn = document.querySelector('.walls-carousel-arrow--prev');
  var nextBtn = document.querySelector('.walls-carousel-arrow--next');
  var cards = track.querySelectorAll('.walls-carousel-card');
  if (!cards.length) return;

  prevBtn.addEventListener('click', function() {
    var cardWidth = cards[0].offsetWidth + 20;
    track.scrollBy({ left: -cardWidth * 2, behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', function() {
    var cardWidth = cards[0].offsetWidth + 20;
    track.scrollBy({ left: cardWidth * 2, behavior: 'smooth' });
  });
})();

// Product image carousel — per-product multi-image gallery
// Images come from PRODUCT_IMAGES (generated by scripts/build-carousel.js)
// Falls back to data-fallback URL when no folder images exist
(function() {
  document.querySelectorAll('.product-carousel').forEach(function(carousel) {
    var track = carousel.querySelector('.product-carousel-track');
    var dotsWrap = carousel.querySelector('.product-carousel-dots');
    var prevBtn = carousel.querySelector('.product-carousel-arrow--prev');
    var nextBtn = carousel.querySelector('.product-carousel-arrow--next');
    if (!track) return;

    var slug = carousel.getAttribute('data-wall');
    var fallbackSrc = carousel.getAttribute('data-fallback');
    var fallbackAlt = carousel.getAttribute('data-alt') || '';

    // Get images from the auto-generated manifest, or fall back to the single image
    var images = [];
    if (slug && typeof PRODUCT_IMAGES !== 'undefined' && PRODUCT_IMAGES[slug] && PRODUCT_IMAGES[slug].length) {
      images = PRODUCT_IMAGES[slug];
    } else if (fallbackSrc) {
      images = [{ src: fallbackSrc, alt: fallbackAlt }];
    }
    if (!images.length) return;

    if (images.length === 1) {
      carousel.setAttribute('data-single', '');
    }

    images.forEach(function(img, i) {
      var slide = document.createElement('div');
      slide.className = 'product-carousel-slide';
      var image = document.createElement('img');
      image.src = img.src;
      image.alt = img.alt || '';
      image.width = 600;
      image.height = 600;
      image.loading = i === 0 ? 'eager' : 'lazy';
      slide.appendChild(image);
      track.appendChild(slide);
    });

    if (images.length <= 1) return;

    var current = 0;
    var total = images.length;

    function goToSlide(index) {
      current = (index % total + total) % total;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dotsWrap.querySelectorAll('.product-carousel-dot').forEach(function(d, i) {
        d.classList.toggle('active', i === current);
      });
    }

    for (var i = 0; i < total; i++) {
      var dot = document.createElement('button');
      dot.className = 'product-carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to image ' + (i + 1));
      dot.addEventListener('click', (function(idx) {
        return function() { goToSlide(idx); };
      })(i));
      dotsWrap.appendChild(dot);
    }

    prevBtn.addEventListener('click', function() { goToSlide(current - 1); });
    nextBtn.addEventListener('click', function() { goToSlide(current + 1); });

    var startX = 0, deltaX = 0;
    carousel.addEventListener('touchstart', function(e) {
      startX = e.touches[0].clientX;
      deltaX = 0;
    }, { passive: true });
    carousel.addEventListener('touchmove', function(e) {
      deltaX = e.touches[0].clientX - startX;
    }, { passive: true });
    carousel.addEventListener('touchend', function() {
      if (Math.abs(deltaX) > 50) {
        goToSlide(deltaX > 0 ? current - 1 : current + 1);
      }
    });
  });
})();

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initMindmap } from './mindmap.js';

gsap.registerPlugin(ScrollTrigger);

const formatNumber = (value, el) => {
  const decimals = Number(el.dataset.decimals || 0);
  if (el.dataset.format === 'compact') {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${Math.round(value / 1_000)}k`;
  }
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

const animateCounter = (el, sound) => {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const state = { value: 0 };
  gsap.to(state, {
    value: target,
    duration: 2.2,
    ease: 'power3.out',
    onUpdate: () => {
      el.textContent = `${formatNumber(state.value, el)}${suffix}`;
    },
    onComplete: () => {
      el.textContent = `${formatNumber(target, el)}${suffix}`;
    },
  });
  sound.bloop();
};

const bindTilt = (card) => {
  const rotateX = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3.out' });
  const rotateY = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3.out' });
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY(x * 10);
    rotateX(-y * 10);
  });
  card.addEventListener('pointerleave', () => {
    rotateX(0);
    rotateY(0);
  });
};

const initHeroIntro = () => {
  const timeline = gsap.timeline({ defaults: { ease: 'power4.out' } });
  timeline
    .from('[data-hero-title] .word', {
      yPercent: 110,
      opacity: 0,
      duration: 1.1,
      stagger: 0.08,
    })
    .from('[data-hero-fade]', { y: 24, opacity: 0, duration: 0.9, stagger: 0.14 }, '-=0.7')
    .from('.ticker', { yPercent: 100, duration: 1, ease: 'expo.out' }, '-=0.8');
};

const initNavAndProgress = () => {
  const nav = document.getElementById('nav');
  const bar = document.querySelector('.scroll-progress');
  ScrollTrigger.create({
    start: 80,
    end: 'max',
    onToggle: ({ isActive }) => nav.classList.toggle('scrolled', isActive),
  });
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => gsap.set(bar, { scaleX: self.progress }),
  });
};

const initReveals = () => {
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.fromTo(
      el,
      { y: 56, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      },
    );
  });
};

const initCounters = (sound) => {
  gsap.utils.toArray('[data-count]').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => animateCounter(el, sound),
    });
  });
};

const initBars = () => {
  gsap.utils.toArray('[data-fill]').forEach((el) => {
    gsap.to(el, {
      scaleX: Number(el.dataset.fill),
      duration: 1.8,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
  gsap.to('.waste-fill', {
    scaleX: 1,
    duration: 2,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.waste-meter', start: 'top 85%', once: true },
  });
};

const initStepsPath = (sound) => {
  gsap.fromTo(
    '#bridge-path',
    { strokeDashoffset: 1 },
    {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: { trigger: '.steps', start: 'top 70%', end: 'bottom 60%', scrub: true },
    },
  );
  gsap.utils.toArray('[data-step]').forEach((step) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.from(step.querySelector('.step-dot'), {
          scale: 0,
          duration: 0.9,
          ease: 'back.out(1.8)',
        });
        sound.bloop();
      },
    });
  });
};

const initStoryTrack = () => {
  const track = document.querySelector('[data-story-track]');
  ScrollTrigger.matchMedia({
    '(min-width: 861px)': () => {
      const distance = () => Math.max(0, track.scrollWidth - track.parentElement.clientWidth);
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: track,
          start: 'top 65%',
          end: () => `+=${distance() + 400}`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    },
  });
};

const initTilt = () => {
  document.querySelectorAll('.tilt').forEach(bindTilt);
};

const initSectionSounds = (sound) => {
  document.querySelectorAll('section[id]').forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      onEnter: () => sound.whoosh(),
    });
  });
};

export function initMotion({ sound }) {
  initHeroIntro();
  initNavAndProgress();
  initReveals();
  initCounters(sound);
  initBars();
  initMindmap(document.querySelector('[data-mindmap]'));
  initStepsPath(sound);
  initStoryTrack();
  initTilt();
  initSectionSounds(sound);
}

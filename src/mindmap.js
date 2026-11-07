import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SVG_NS = 'http://www.w3.org/2000/svg';
const STACK_BREAKPOINT = 760;

const rectIn = (el, box) => {
  const r = el.getBoundingClientRect();
  return {
    left: r.left - box.left,
    top: r.top - box.top,
    right: r.right - box.left,
    bottom: r.bottom - box.top,
  };
};

const connectorPath = (center, branch, stacked) => {
  if (stacked) {
    const sx = (center.left + center.right) / 2;
    const sy = center.bottom;
    const ex = (branch.left + branch.right) / 2;
    const ey = branch.top;
    const dy = (ey - sy) / 2;
    return `M${sx} ${sy} C${sx} ${sy + dy} ${ex} ${ey - dy} ${ex} ${ey}`;
  }
  const cy = (center.top + center.bottom) / 2;
  const by = (branch.top + branch.bottom) / 2;
  const onLeft = (branch.left + branch.right) / 2 < (center.left + center.right) / 2;
  const sx = onLeft ? center.left : center.right;
  const ex = onLeft ? branch.right : branch.left;
  const dx = (ex - sx) / 2;
  return `M${sx} ${cy} C${sx + dx} ${cy} ${ex - dx} ${by} ${ex} ${by}`;
};

const createPath = (svg, className) => {
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('pathLength', '1');
  path.setAttribute('class', className);
  svg.append(path);
  return path;
};

export function initMindmap(root) {
  const svg = root.querySelector('[data-mm-lines]');
  const center = root.querySelector('[data-mm-center]');
  const branches = [...root.querySelectorAll('[data-mm-branch]')];

  const connectors = branches.map(() => ({
    base: createPath(svg, 'mm-base'),
    flow: createPath(svg, 'mm-flow'),
  }));

  const layout = () => {
    const box = root.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    const stacked = box.width < STACK_BREAKPOINT;
    const centerBox = rectIn(center, box);
    branches.forEach((branch, index) => {
      const d = connectorPath(centerBox, rectIn(branch, box), stacked);
      connectors[index].base.setAttribute('d', d);
      connectors[index].flow.setAttribute('d', d);
    });
  };

  layout();
  new ResizeObserver(layout).observe(root);

  const bases = connectors.map((c) => c.base);
  const flows = connectors.map((c) => c.flow);
  const trigger = { trigger: root, start: 'top 70%', once: true };

  gsap.fromTo(bases, { strokeDashoffset: 1 }, {
    strokeDashoffset: 0,
    duration: 1.6,
    ease: 'power2.inOut',
    stagger: 0.2,
    scrollTrigger: trigger,
  });
  gsap.from(flows, { opacity: 0, duration: 1, delay: 1.2, scrollTrigger: trigger });
  gsap.from(branches, {
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    stagger: 0.18,
    delay: 0.3,
    scrollTrigger: trigger,
  });
  gsap.from(center, { opacity: 0, duration: 1.2, ease: 'power2.out', scrollTrigger: trigger });
}

import type { Variants } from 'framer-motion';

export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 8,
    filter: 'blur(4px)',
  },
  enter: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: 'blur(4px)',
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

export const modalTransition: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    filter: 'blur(4px)',
  },
  enter: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    filter: 'blur(4px)',
    transition: {
      duration: 0.15,
    },
  },
};

export const overlayTransition: Variants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

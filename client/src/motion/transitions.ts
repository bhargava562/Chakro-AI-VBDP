import type { Transition } from 'framer-motion';

export const springGentle: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 30,
};

export const springBouncy: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 17,
};

export const springStiff: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 35,
};

export const tweenFast: Transition = {
  type: 'tween',
  duration: 0.2,
  ease: 'easeOut',
};

export const tweenMedium: Transition = {
  type: 'tween',
  duration: 0.3,
  ease: [0.25, 0.46, 0.45, 0.94],
};

export const tweenSlow: Transition = {
  type: 'tween',
  duration: 0.5,
  ease: [0.25, 0.46, 0.45, 0.94],
};

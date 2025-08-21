import { 
  Easing, 
  withSpring, 
  withTiming, 
  withDelay,
  withRepeat,
  withSequence,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

// Animation timing presets
export const ANIMATION_TIMING = {
  fast: 200,
  normal: 400,
  slow: 600,
  verySlow: 800
} as const;

// Spring animation presets
export const SPRING_CONFIG = {
  gentle: { damping: 20, stiffness: 300, mass: 1 },
  bouncy: { damping: 15, stiffness: 300, mass: 1 },
  stiff: { damping: 25, stiffness: 400, mass: 1 },
  slow: { damping: 30, stiffness: 200, mass: 1 }
} as const;

// Easing presets
export const EASING = {
  easeInOut: Easing.bezier(0.4, 0, 0.2, 1),
  easeOut: Easing.bezier(0, 0, 0.2, 1),
  easeIn: Easing.bezier(0.4, 0, 1, 1),
  bounce: Easing.bounce,
  elastic: Easing.elastic(1),
  back: Easing.back(1.5)
} as const;

// Common animation functions
export const createFadeAnimation = (
  delay: number = 0,
  duration: number = ANIMATION_TIMING.normal
) => {
  return withDelay(
    delay,
    withTiming(1, { 
      duration, 
      easing: EASING.easeInOut 
    })
  );
};

export const createSlideAnimation = (
  direction: 'up' | 'down' | 'left' | 'right',
  delay: number = 0,
  distance: number = 50,
  springConfig: typeof SPRING_CONFIG.gentle = SPRING_CONFIG.gentle
) => {
  const translateValue = withDelay(
    delay,
    withSpring(0, springConfig)
  );

  switch (direction) {
    case 'up':
      return { translateY: withDelay(delay, withSpring(distance, springConfig)) };
    case 'down':
      return { translateY: withDelay(delay, withSpring(-distance, springConfig)) };
    case 'left':
      return { translateX: withDelay(delay, withSpring(distance, springConfig)) };
    case 'right':
      return { translateX: withDelay(delay, withSpring(-distance, springConfig)) };
    default:
      return { translateY: withDelay(delay, withSpring(distance, springConfig)) };
  }
};

export const createScaleAnimation = (
  delay: number = 0,
  springConfig: typeof SPRING_CONFIG.gentle = SPRING_CONFIG.gentle
) => {
  return withDelay(
    delay,
    withSpring(1, springConfig)
  );
};

export const createStaggeredAnimation = (
  count: number,
  staggerDelay: number = 100,
  baseDelay: number = 0
) => {
  return Array.from({ length: count }, (_, index) => 
    baseDelay + (index * staggerDelay)
  );
};

// Press animation helpers
export const createPressAnimation = (
  scale: number = 0.95,
  translateY: number = 2,
  springConfig: typeof SPRING_CONFIG.bouncy = SPRING_CONFIG.bouncy
) => {
  return {
    scale: withSpring(scale, springConfig),
    translateY: withSpring(translateY, springConfig)
  };
};

export const createReleaseAnimation = (
  springConfig: typeof SPRING_CONFIG.bouncy = SPRING_CONFIG.bouncy
) => {
  return {
    scale: withSpring(1, springConfig),
    translateY: withSpring(0, springConfig)
  };
};

// Hover animation helpers
export const createHoverAnimation = (
  scale: number = 1.05,
  springConfig: typeof SPRING_CONFIG.gentle = SPRING_CONFIG.gentle
) => {
  return withSpring(scale, springConfig);
};

export const createHoverReleaseAnimation = (
  springConfig: typeof SPRING_CONFIG.gentle = SPRING_CONFIG.gentle
) => {
  return withSpring(1, springConfig);
};

// Loading animation helpers
export const createPulseAnimation = (
  minScale: number = 0.8,
  maxScale: number = 1.2,
  duration: number = 1000
) => {
  return withRepeat(
    withSequence(
      withTiming(maxScale, { duration: duration / 2, easing: EASING.easeInOut }),
      withTiming(minScale, { duration: duration / 2, easing: EASING.easeInOut })
    ),
    -1,
    true
  );
};

export const createShimmerAnimation = (
  duration: number = 1500,
  easing: typeof EASING.easeInOut = EASING.easeInOut
) => {
  return withRepeat(
    withTiming(100, { duration, easing }),
    -1,
    false
  );
};

// Interpolation helpers
export const createOpacityInterpolation = (
  animationValue: any,
  inputRange: number[] = [-1, 0, 1],
  outputRange: number[] = [0.8, 1, 0.8]
) => {
  return interpolate(
    animationValue.value,
    inputRange,
    outputRange,
    Extrapolate.CLAMP
  );
};

export const createScaleInterpolation = (
  animationValue: any,
  inputRange: number[] = [-1, 0, 1],
  outputRange: number[] = [0.92, 1, 0.92]
) => {
  return interpolate(
    animationValue.value,
    inputRange,
    outputRange,
    Extrapolate.CLAMP
  );
};

export const createTranslateInterpolation = (
  animationValue: any,
  inputRange: number[] = [-1, 0, 1],
  outputRange: number[] = [-20, 0, 20]
) => {
  return interpolate(
    animationValue.value,
    inputRange,
    outputRange,
    Extrapolate.CLAMP
  );
};

// Entrance animation helpers
export const createEntranceAnimation = (
  direction: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale' = 'fade',
  delay: number = 0,
  duration: number = ANIMATION_TIMING.normal
) => {
  switch (direction) {
    case 'fade':
      return {
        opacity: createFadeAnimation(delay, duration)
      };
    case 'scale':
      return {
        opacity: createFadeAnimation(delay, duration),
        scale: createScaleAnimation(delay)
      };
    default:
      return {
        opacity: createFadeAnimation(delay, duration),
        ...createSlideAnimation(direction, delay, 50)
      };
  }
};

// Exit animation helpers
export const createExitAnimation = (
  direction: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale' = 'fade',
  duration: number = ANIMATION_TIMING.normal
) => {
  switch (direction) {
    case 'fade':
      return {
        opacity: withTiming(0, { duration, easing: EASING.easeInOut })
      };
    case 'scale':
      return {
        opacity: withTiming(0, { duration, easing: EASING.easeInOut }),
        scale: withSpring(0.8, SPRING_CONFIG.gentle)
      };
    default:
      const distance = 50;
      switch (direction) {
        case 'up':
          return {
            opacity: withTiming(0, { duration, easing: EASING.easeInOut }),
            translateY: withSpring(-distance, SPRING_CONFIG.gentle)
          };
        case 'down':
          return {
            opacity: withTiming(0, { duration, easing: EASING.easeInOut }),
            translateY: withSpring(distance, SPRING_CONFIG.gentle)
          };
        case 'left':
          return {
            opacity: withTiming(0, { duration, easing: EASING.easeInOut }),
            translateX: withSpring(-distance, SPRING_CONFIG.gentle)
          };
        case 'right':
          return {
            opacity: withTiming(0, { duration, easing: EASING.easeInOut }),
            translateX: withSpring(distance, SPRING_CONFIG.gentle)
          };
        default:
          return {
            opacity: withTiming(0, { duration, easing: EASING.easeInOut })
          };
      }
  }
};

// Utility function to create consistent animation delays
export const createAnimationSequence = (
  animations: Array<{
    delay: number;
    duration: number;
    type: 'fade' | 'slide' | 'scale';
    direction?: 'up' | 'down' | 'left' | 'right';
  }>
) => {
  return animations.map((animation, index) => {
    const totalDelay = animations
      .slice(0, index)
      .reduce((acc, curr) => acc + curr.delay + curr.duration, 0);
    
    return {
      ...animation,
      delay: totalDelay
    };
  });
};

import React, { useEffect, useRef } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming,
  withDelay,
  interpolate,
  Easing,
  runOnJS
} from 'react-native-reanimated';

interface PageTransitionProps {
  children: React.ReactNode;
  style?: ViewStyle;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';
  onAnimationComplete?: () => void;
}

export function PageTransition({ 
  children, 
  style, 
  delay = 0,
  duration = 600,
  direction = 'fade',
  onAnimationComplete 
}: PageTransitionProps) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const isAnimating = useRef(false);

  useEffect(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    // Set initial values based on direction
    switch (direction) {
      case 'up':
        translateY.value = 50;
        break;
      case 'down':
        translateY.value = -50;
        break;
      case 'left':
        translateX.value = 50;
        break;
      case 'right':
        translateX.value = -50;
        break;
      case 'scale':
        scale.value = 0.8;
        break;
      case 'fade':
      default:
        opacity.value = 0;
        break;
    }

    // Animate to final values
    const animationDelay = delay;
    
    if (direction === 'fade') {
      opacity.value = withDelay(
        animationDelay, 
        withTiming(1, { 
          duration, 
          easing: Easing.bezier(0.4, 0, 0.2, 1) 
        })
      );
    } else if (direction === 'scale') {
      scale.value = withDelay(
        animationDelay, 
        withSpring(1, { 
          damping: 20, 
          stiffness: 300 
        })
      );
      opacity.value = withDelay(
        animationDelay, 
        withTiming(1, { 
          duration: duration * 0.8, 
          easing: Easing.bezier(0.4, 0, 0.2, 1) 
        })
      );
    } else {
      // Slide animations
      translateX.value = withDelay(
        animationDelay, 
        withSpring(0, { 
          damping: 20, 
          stiffness: 300 
        })
      );
      translateY.value = withDelay(
        animationDelay, 
        withSpring(0, { 
          damping: 20, 
          stiffness: 300 
        })
      );
      opacity.value = withDelay(
        animationDelay, 
        withTiming(1, { 
          duration: duration * 0.8, 
          easing: Easing.bezier(0.4, 0, 0.2, 1) 
        })
      );
    }

    // Call completion callback
    if (onAnimationComplete) {
      setTimeout(() => {
        runOnJS(onAnimationComplete)();
      }, delay + duration);
    }
  }, [direction, delay, duration, onAnimationComplete]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value }
    ]
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}

// Specialized transition components
export function FadeIn({ children, ...props }: Omit<PageTransitionProps, 'direction'>) {
  return <PageTransition {...props} direction="fade">{children}</PageTransition>;
}

export function SlideUp({ children, ...props }: Omit<PageTransitionProps, 'direction'>) {
  return <PageTransition {...props} direction="up">{children}</PageTransition>;
}

export function SlideDown({ children, ...props }: Omit<PageTransitionProps, 'direction'>) {
  return <PageTransition {...props} direction="down">{children}</PageTransition>;
}

export function SlideLeft({ children, ...props }: Omit<PageTransitionProps, 'direction'>) {
  return <PageTransition {...props} direction="left">{children}</PageTransition>;
}

export function SlideRight({ children, ...props }: Omit<PageTransitionProps, 'direction'>) {
  return <PageTransition {...props} direction="right">{children}</PageTransition>;
}

export function ScaleIn({ children, ...props }: Omit<PageTransitionProps, 'direction'>) {
  return <PageTransition {...props} direction="scale">{children}</PageTransition>;
}

// Staggered children animation
interface StaggeredContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  style?: ViewStyle;
}

export function StaggeredContainer({ 
  children, 
  staggerDelay = 100, 
  style 
}: StaggeredContainerProps) {
  const childrenArray = React.Children.toArray(children);
  
  return (
    <View style={style}>
      {childrenArray.map((child, index) => (
        <PageTransition
          key={index}
          delay={index * staggerDelay}
          direction="up"
        >
          {child}
        </PageTransition>
      ))}
    </View>
  );
}

# 🎬 Animation System Documentation

Welcome to the Campus Gate Animation System! This comprehensive animation library provides smooth, performant, and delightful user experiences using React Native Reanimated and Gesture Handler.

## 🚀 **Core Principles**

- **Performance First**: All animations run on the native UI thread
- **Consistent Language**: Unified timing, easing, and animation styles
- **Purposeful Motion**: Every animation serves a clear UX purpose
- **Accessibility**: Haptic feedback and smooth transitions for all users

## 📦 **Components Overview**

### 1. **SimpleCard** - Enhanced Card with Press Animations
```tsx
import { SimpleCard } from '@/components/ui';

<SimpleCard
  title="Card Title"
  subtitle="Card Subtitle"
  rating="4.5"
  onPress={() => console.log('Card pressed!')}
  showArrow={true}
/>
```

**Features:**
- Smooth press scale and translate animations
- Haptic feedback on press
- Arrow rotation animation
- Gesture-based interactions

### 2. **StatCard** - Animated Statistics Display
```tsx
import { StatCard } from '@/components/ui';

<StatCard
  label="Total Applications"
  value="24"
  index={0} // For staggered entrance
/>
```

**Features:**
- Staggered entrance animations
- Hover scale effects
- Smooth value and label transitions
- Index-based animation delays

### 3. **SkeletonLoader** - Smooth Loading States
```tsx
import { SkeletonLoader, SkeletonCard, SkeletonStatCard } from '@/components/ui';

// Basic skeleton
<SkeletonLoader width={200} height={20} borderRadius={8} />

// Pre-built skeletons
<SkeletonCard />
<SkeletonStatCard />
<SkeletonCarouselItem />
<SkeletonCategoryItem />
```

**Features:**
- Shimmer animation effect
- Pre-built component skeletons
- Customizable dimensions
- Smooth loading transitions

### 4. **AnimatedButton** - Interactive Button System
```tsx
import { 
  AnimatedButton, 
  PrimaryButton, 
  SecondaryButton,
  OutlineButton,
  GhostButton 
} from '@/components/ui';

// Custom button
<AnimatedButton
  title="Press Me"
  onPress={() => console.log('Pressed!')}
  variant="primary"
  size="medium"
  hapticFeedback={Haptics.ImpactFeedbackStyle.Medium}
/>

// Pre-built variants
<PrimaryButton title="Primary Action" onPress={handlePress} />
<SecondaryButton title="Secondary Action" onPress={handlePress} />
<OutlineButton title="Outline Action" onPress={handlePress} />
<GhostButton title="Ghost Action" onPress={handlePress} />
```

**Features:**
- Multiple variants (primary, secondary, outline, ghost)
- Three sizes (small, medium, large)
- Haptic feedback customization
- Icon support (left/right positioning)
- Loading states

### 5. **PageTransition** - Screen Transition Animations
```tsx
import { 
  PageTransition, 
  FadeIn, 
  SlideUp, 
  SlideDown,
  SlideLeft,
  SlideRight,
  ScaleIn,
  StaggeredContainer
} from '@/components/ui';

// Basic transition
<PageTransition direction="up" delay={200} duration={600}>
  <YourComponent />
</PageTransition>

// Specialized transitions
<FadeIn delay={100}>
  <Header />
</FadeIn>

<SlideUp delay={200}>
  <Content />
</SlideUp>

// Staggered children
<StaggeredContainer staggerDelay={100}>
  <Item1 />
  <Item2 />
  <Item3 />
</StaggeredContainer>
```

**Features:**
- 6 transition directions (up, down, left, right, fade, scale)
- Customizable delays and durations
- Staggered children animations
- Animation completion callbacks

## 🛠 **Animation Utilities**

### **Timing Presets**
```tsx
import { ANIMATION_TIMING } from '@/utils/animation-utils';

ANIMATION_TIMING.fast    // 200ms
ANIMATION_TIMING.normal  // 400ms
ANIMATION_TIMING.slow    // 600ms
ANIMATION_TIMING.verySlow // 800ms
```

### **Spring Configurations**
```tsx
import { SPRING_CONFIG } from '@/utils/animation-utils';

SPRING_CONFIG.gentle  // Smooth, natural feel
SPRING_CONFIG.bouncy  // Playful, energetic
SPRING_CONFIG.stiff   // Quick, responsive
SPRING_CONFIG.slow    // Relaxed, smooth
```

### **Easing Functions**
```tsx
import { EASING } from '@/utils/animation-utils';

EASING.easeInOut  // Smooth start and end
EASING.easeOut    // Quick start, smooth end
EASING.easeIn     // Smooth start, quick end
EASING.bounce     // Bouncy effect
EASING.elastic    // Elastic, stretchy effect
EASING.back       // Overshoot effect
```

### **Common Animation Functions**
```tsx
import { 
  createFadeAnimation,
  createSlideAnimation,
  createScaleAnimation,
  createPressAnimation,
  createHoverAnimation,
  createPulseAnimation,
  createShimmerAnimation
} from '@/utils/animation-utils';

// Create fade animation
const fadeAnim = createFadeAnimation(200, 400);

// Create slide animation
const slideAnim = createSlideAnimation('up', 100, 50);

// Create press animation
const pressAnim = createPressAnimation(0.95, 2);
```

## 🎯 **Best Practices**

### **Performance**
1. **Use `useSharedValue`** for values that change during animations
2. **Prefer `withSpring`** over `withTiming` for natural motion
3. **Limit concurrent animations** to prevent frame drops
4. **Use `runOnJS`** sparingly and only when necessary

### **User Experience**
1. **Keep animations under 600ms** for optimal feel
2. **Use haptic feedback** for important interactions
3. **Maintain consistent timing** across similar animations
4. **Provide visual feedback** for all interactive elements

### **Accessibility**
1. **Respect reduced motion** preferences
2. **Ensure sufficient contrast** during animations
3. **Provide alternative interactions** for gesture-based features
4. **Test with screen readers** and assistive technologies

## 🔧 **Customization**

### **Creating Custom Animations**
```tsx
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const MyComponent = () => {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));
  
  const handlePress = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }, 100);
  };
  
  return (
    <Animated.View style={animatedStyle} onTouchEnd={handlePress}>
      {/* Your content */}
    </Animated.View>
  );
};
```

### **Extending Existing Components**
```tsx
import { SimpleCard } from '@/components/ui';

const CustomCard = ({ customProp, ...props }) => {
  // Add your custom logic here
  return <SimpleCard {...props} />;
};
```

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Animation not working**
   - Check if `react-native-reanimated` is properly linked
   - Ensure animations are wrapped in `Animated.View`
   - Verify `useSharedValue` is used for animated values

2. **Performance issues**
   - Reduce concurrent animations
   - Use `useCallback` for animation functions
   - Avoid complex calculations in `useAnimatedStyle`

3. **Gesture conflicts**
   - Check gesture handler configuration
   - Use `simultaneousHandlers` for multiple gestures
   - Ensure proper gesture priorities

### **Debug Tips**
```tsx
// Add console logs to debug animations
const animatedStyle = useAnimatedStyle(() => {
  console.log('Animation value:', scale.value);
  return {
    transform: [{ scale: scale.value }]
  };
});
```

## 📱 **Platform Considerations**

### **iOS**
- Smooth 60fps animations
- Native gesture handling
- Haptic feedback support

### **Android**
- Hardware acceleration enabled
- Gesture handler compatibility
- Performance optimizations

## 🔮 **Future Enhancements**

- [ ] Lottie integration for complex animations
- [ ] Shared element transitions
- [ ] Advanced gesture recognition
- [ ] Animation performance monitoring
- [ ] Accessibility animation controls

## 📚 **Resources**

- [React Native Reanimated Documentation](https://docs.swmansion.com/react-native-reanimated/)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)
- [Animation Principles](https://material.io/design/motion/understanding-motion.html)

---

**Happy Animating! 🎉**

For questions or contributions, please refer to the main project documentation or create an issue in the repository.

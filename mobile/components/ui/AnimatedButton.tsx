import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming,
  interpolate,
  runOnJS
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  hapticFeedback?: Haptics.ImpactFeedbackStyle;
}

export function AnimatedButton({ 
  title, 
  onPress, 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  hapticFeedback = Haptics.ImpactFeedbackStyle.Light
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  const handlePress = () => {
    if (disabled || loading) return;
    
    Haptics.impactAsync(hapticFeedback);
    onPress();
  };

  const pressGesture = Gesture.Pan()
    .onBegin(() => {
      if (disabled || loading) return;
      
      scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
      translateY.value = withSpring(2, { damping: 15, stiffness: 300 });
      opacity.value = withTiming(0.8, { duration: 150 });
    })
    .onFinalize(() => {
      if (disabled || loading) return;
      
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 300 });
      opacity.value = withTiming(1, { duration: 200 });
      runOnJS(handlePress)();
    })
    .onTouchesUp(() => {
      if (disabled || loading) return;
      
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 300 });
      opacity.value = withTiming(1, { duration: 200 });
    });

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value }
    ],
    opacity: disabled ? 0.5 : opacity.value,
  }));

  // Get button styles based on variant and size
  const getButtonStyles = () => {
    const baseStyles = 'flex-row items-center justify-center rounded-full';
    
    // Size styles
    const sizeStyles = {
      small: 'px-4 py-2',
      medium: 'px-6 py-3',
      large: 'px-8 py-4'
    };
    
    // Variant styles
    const variantStyles = {
      primary: 'bg-gray-900',
      secondary: 'bg-gray-100',
      outline: 'bg-transparent border border-gray-300',
      ghost: 'bg-transparent'
    };
    
    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]}`;
  };

  const getTextStyles = () => {
    const baseTextStyles = 'font-semibold text-center';
    
    // Size styles
    const sizeStyles = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg'
    };
    
    // Variant styles
    const variantStyles = {
      primary: 'text-white',
      secondary: 'text-gray-900',
      outline: 'text-gray-900',
      ghost: 'text-gray-900'
    };
    
    return `${baseTextStyles} ${sizeStyles[size]} ${variantStyles[variant]}`;
  };

  const getIconSize = () => {
    switch (size) {
      case 'small': return 16;
      case 'medium': return 18;
      case 'large': return 20;
      default: return 18;
    }
  };

  return (
    <GestureDetector gesture={pressGesture}>
      <Animated.View 
        className={getButtonStyles()}
        style={[buttonAnimatedStyle, style]}
      >
        {icon && iconPosition === 'left' ? (
          <View className="mr-2">
            {React.cloneElement(icon as React.ReactElement, { 
              size: getIconSize() 
            })}
          </View>
        ) : null}
        
        <Text className={getTextStyles()} style={textStyle}>
          {loading ? 'Loading...' : title}
        </Text>
        
        {icon && iconPosition === 'right' ? (
          <View className="ml-2">
            {React.cloneElement(icon as React.ReactElement, { 
              size: getIconSize() 
            })}
          </View>
        ) : null}
      </Animated.View>
    </GestureDetector>
  );
}

// Specialized button variants
export function PrimaryButton(props: Omit<AnimatedButtonProps, 'variant'>) {
  return <AnimatedButton {...props} variant="primary" />;
}

export function SecondaryButton(props: Omit<AnimatedButtonProps, 'variant'>) {
  return <AnimatedButton {...props} variant="secondary" />;
}

export function OutlineButton(props: Omit<AnimatedButtonProps, 'variant'>) {
  return <AnimatedButton {...props} variant="outline" />;
}

export function GhostButton(props: Omit<AnimatedButtonProps, 'variant'>) {
  return <AnimatedButton {...props} variant="ghost" />;
}

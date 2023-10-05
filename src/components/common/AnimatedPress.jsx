import React from "react";
import { Pressable } from "react-native";

const AnimatedPressable = ({
  children,
  disabled,
  onLongPress,
  onPress,
  onPressIn,
  onPressOut,
  style,
}) => {
  return (
    <Pressable
      disabled={disabled}
      onLongPress={onLongPress}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={({ pressed }) => [{ opacity: pressed ? 0.25 : 1.0 }].concat(style)}
    >
      {children}
    </Pressable>
  );
};

export default AnimatedPressable;

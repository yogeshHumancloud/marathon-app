import React from "react";
import AnimatedPressable from "./AnimatedPress";
import { Font } from "./constants";
import { StyleSheet, View } from "react-native";
import { Body } from "./Body";

const Button = ({
  label,
  color = "#0064AD",
  labelStyle = {},
  width = "auto",
  height = 48,
  marginBottom = 0,
  fullWidth = false,
  isDisabled = false,
  outline = false,
  onPress,
}) => {
  const buttonWidth = fullWidth ? "100%" : width;
  const disabledColor = "#99d5ff";
  const currentColor = isDisabled ? disabledColor : color;
  const borderColor = outline ? labelStyle?.color ?? "0064AD" : undefined;
  const borderWidth = outline ? 2 : 0;
  return (
    <AnimatedPressable
      disabled={isDisabled || !onPress}
      style={{
        width: buttonWidth,
        marginBottom,
        ...styles.touchableWrapper,
      }}
      onPress={onPress}
    >
      <View
        style={{
          height,
          backgroundColor: currentColor,
          borderColor,
          borderWidth,
          ...styles.buttonInner,
        }}
      >
        <Body
          align="center"
          color={labelStyle?.color ?? "white"}
          style={{
            fontFamily: labelStyle?.fontFamily ?? Font.MONTSERRAT,
            fontSize: labelStyle?.fontSize ?? 16,
          }}
          letterSpacing={labelStyle?.letterSpacing ?? 2}
        >
          {label}
        </Body>
      </View>
    </AnimatedPressable>
  );
};
const styles = StyleSheet.create({
  touchableWrapper: {
    flexDirection: "row",
  },
  buttonInner: {
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    borderRadius: 20,
  },
});

export default Button;

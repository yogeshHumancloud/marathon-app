import React from "react";
import { Text, StyleSheet, TextStyle } from "react-native";

const BasicText = ({
  children,
  color = "#000000",
  marginBottom,
  style,
  letterSpacing,
  underline,
  numberOfLines,
  align = "left",
}) => {
  const textDecorationLine = underline ? "underline" : "none";

  return (
    <Text
      allowFontScaling={false}
      numberOfLines={numberOfLines}
      style={{
        color,
        marginBottom,
        letterSpacing,
        textDecorationLine,
        textAlign: align,
        // ...style,
      }}
    >
      {children}
    </Text>
  );
};

export default BasicText;

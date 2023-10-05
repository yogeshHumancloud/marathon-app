import { StyleSheet } from "react-native";
import { Font } from "./constants";
import BasicText from "./BasicText";

export const Body = (props) => {
  const bodyStyles = props.v2 ? styles.bodyV2 : styles.body;

  return (
    <BasicText {...props} style={{ ...bodyStyles, ...props.style }}>
      {props.children}
    </BasicText>
  );
};

const styles = StyleSheet.create({
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Font.MONTSERRAT,
  },
});

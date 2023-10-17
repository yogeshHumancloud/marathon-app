import * as React from "react";
import Svg, { Path } from "react-native-svg";

function OtherSVG(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M6 10.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm4.5 1.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
        fill="#666"
      />
    </Svg>
  );
}

export default OtherSVG;

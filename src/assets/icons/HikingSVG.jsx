import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

function HikingSVG(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G clipPath="url(#clip0_280_8983)">
        <Path
          d="M22.6 23.297h-5.106a.882.882 0 00.018-.18v-3.945a.352.352 0 00-.703 0v3.945a.18.18 0 01-.36 0V11.6h.36v6.118a.352.352 0 10.703 0V11.41a.583.583 0 00.155-.395V9.434a.583.583 0 00-.155-.395v-.372a.884.884 0 00-1.766 0v.26h-2.924c-.275 0-.81-.221-1.005-.416l-.16-.16v-.723a2.44 2.44 0 00-.688-1.698 2.907 2.907 0 001.362-2.645h1.732a.352.352 0 100-.704h-1.78v-.268A2.316 2.316 0 009.97 0H8.834a2.316 2.316 0 00-2.313 2.313v1.153c0 .927.437 1.755 1.115 2.287a2.47 2.47 0 00-.465.518H5.018a.955.955 0 00-.953.954v.058H3.052a.352.352 0 100 .703h1.013v.522h-.373a.352.352 0 100 .703h.373v.715a.953.953 0 00-.422.791v2.228c0 .525.428.953.954.953h.783a.948.948 0 00.462-.12h.918v.227c0 .119.058.224.149.287v.514h-.98a.352.352 0 100 .704h.98v.468H6.3a.352.352 0 100 .703h.206L3.37 20.968a.582.582 0 00-.076.087l-.342.489a.582.582 0 00-.097.438.582.582 0 00.241.378l1.338.937H1.4a.352.352 0 100 .703H22.6a.352.352 0 100-.703zM5.63 12.945a.25.25 0 01-.25.25h-.783a.25.25 0 01-.25-.25v-2.228a.25.25 0 01.25-.25h.783a.25.25 0 01.25.25v2.228zm1.13-5.317v5.447h-.437a.952.952 0 00.01-.13v-2.228a.955.955 0 00-.953-.954h-.612v-.552h.255a.352.352 0 100-.703h-.255v-.522h.255a.352.352 0 100-.703h-.255v-.058a.25.25 0 01.25-.25h1.746c.029 0 .055.005.08.014a2.442 2.442 0 00-.084.639zm4.56 1.38c.326.326 1.042.623 1.502.623h2.65v.894h-2.65c-.7 0-1.639-.388-2.134-.884L9.436 8.39a.444.444 0 010-.633.444.444 0 01.633 0l1.251 1.252zm-3.857 2.137v-.525a3.474 3.474 0 002.82-.394c.068.062.14.122.217.18a2.792 2.792 0 01-3.037.739zm-.239-8.832c0-.888.723-1.61 1.61-1.61H9.97c.888 0 1.61.722 1.61 1.61v.268H7.225v-.268zm0 1.153c0-.061.004-.122.009-.181h4.393a2.207 2.207 0 01-1.271 2.181 2.433 2.433 0 00-2.059-.11 2.205 2.205 0 01-1.072-1.89zm.239 4.162c0-.962.783-1.745 1.745-1.745.962 0 1.745.783 1.745 1.745v.019l-.387-.387a1.143 1.143 0 00-.814-.337c-.307 0-.596.12-.813.337a1.143 1.143 0 00-.337.813c0 .308.12.597.337.814l.827.827a2.778 2.778 0 01-2.303.163v-2.25zm-2 15.53l-1.868-1.307.208-.296 1.867 1.307-.207.297zm6.484-.34v.479H6.224l.09-.128a.582.582 0 00.096-.437.582.582 0 00-.24-.379l-.2-.14.977-1.334a.352.352 0 10-.568-.415l-.985 1.346-1.17-.819 3.154-4.31h.574a.352.352 0 100-.703h-.34v-.469h.394a.352.352 0 100-.703h-.394v-.45h1.427v1.707c0 .444-.19 1.026-.453 1.384L7.202 19.34a.352.352 0 10.568.415l1.384-1.892c.326-.445.552-1.098.584-1.666l1.384 1.384a.855.855 0 01.076.15l.767 4.947a.585.585 0 00-.018.14zm-.056-5.213a1.27 1.27 0 00-.26-.51l-1.889-1.89v-.848h1.17l1.73 1.73c.314.314.591.86.66 1.299l.75 4.846h-1.444l-.717-4.627zm3.039 5.692h-2.28v-.362h2.28v.362zm.703 0v-.48a.587.587 0 00-.586-.585h-.284l-.767-4.954a3.298 3.298 0 00-.856-1.687l-1.496-1.496a.354.354 0 00.012-.09v-.927a.352.352 0 00-.703 0v.576h-3.49v-1.77a3.495 3.495 0 003.49-.932v.673a.352.352 0 00.703 0v-.61c.393.135.798.214 1.166.214h2.691a.588.588 0 00.233.281v11.607c0 .061.007.122.019.18h-.132zm.816-14.63a.18.18 0 01.36 0v.18h-.36v-.18zm-.273.884h.788v1.347h-.788V9.551z"
          fill="#666"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_280_8983">
          <Path fill="#fff" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default HikingSVG;

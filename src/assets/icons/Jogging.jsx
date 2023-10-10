import React from "react";
import Svg, { Path } from "react-native-svg";

function Jogging(props) {
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
        d="M21.397 7.108A1.456 1.456 0 0019.46 5.27l-2.122.888-.746-1.267a2.22 2.22 0 001.724-1.882l.065-.512a2.202 2.202 0 00-.444-1.636 2.201 2.201 0 00-1.471-.844 2.201 2.201 0 00-1.637.445 2.201 2.201 0 00-.843 1.471l-.066.512c-.033.258-.021.516.034.763-.18.005-.361.04-.534.107l-2.29.881a2.45 2.45 0 00-1.554 2.62L9.922 9.4a1.46 1.46 0 001.171 1.238c-.096.394-.13.799-.1 1.204l-1.122 4.041-3.428.166-.734-.423a1.405 1.405 0 00-1.074-.142c-.365.098-.67.332-.86.66l-1.119 1.938a1.045 1.045 0 00.685 1.54 2.318 2.318 0 001.9-.426s4.67.154 4.705.154c1.187 0 2.296-.67 2.846-1.727l.974-1.873 1.378 1.186 1.283 5.783c.154.743.815 1.28 1.573 1.28h.005l2.024-.005c.332 0 .647-.162.841-.431.195-.27.25-.619.147-.935a2.32 2.32 0 00-1.68-1.543l-.148-.918a.469.469 0 10-.926.15l.115.708-1.35.004-1.004-4.45a.47.47 0 00-.152-.252l-.242-.209 1.473-1.035.101.165c.179.29.307.604.382.936a.469.469 0 00.915-.206 4.002 4.002 0 00-.498-1.222l-2.448-3.972.523-1.795a2.472 2.472 0 002.213.058l2.356-1.113c.352-.166.618-.46.75-.826zM18.8 21.96h.004c.603 0 1.133.385 1.32.958a.102.102 0 01-.014.094.101.101 0 01-.085.044l-2.024.006H18a.67.67 0 01-.654-.534l-.117-.563 1.572-.005zM12.82 9.078l-.203-2.292 1.738-.395a1.606 1.606 0 001.232-1.295c.287.36.402.85.264 1.322l-1.163 3.987-2.077-.437c.158-.258.237-.566.208-.89zm2.03-6.513l.065-.512a1.27 1.27 0 01.487-.848 1.268 1.268 0 01.944-.257c.7.09 1.195.732 1.105 1.431l-.065.512a1.28 1.28 0 01-2.536-.326zm-4 6.71l-.345-2.582c-.094-.7.301-1.367.961-1.62l2.29-.882a.673.673 0 11.392 1.286l-2.138.485a.469.469 0 00-.363.499l.238 2.7a.52.52 0 01-1.034.114zm-7.314 9.431a.101.101 0 01-.074-.06.101.101 0 01.005-.095l1.12-1.939a.478.478 0 01.652-.174l.538.31-.747 1.294c-.302.524-.903.79-1.494.664zm6.336-.294l-3.898-.13.755-1.308 3.524-.17a.469.469 0 00.43-.343l.053-.194 1.268.837-.045.087c-.4.77-1.22 1.248-2.087 1.22zm2.567-2.144l-1.44-.95.503-1.808c.219.381.502.725.842 1.018l.69.594-.595 1.146zm2.457-.78l-1.94-1.67a2.96 2.96 0 01-.939-3.017l2.81.591 1.782 2.892-1.713 1.204zm5.617-8.696a.517.517 0 01-.268.295L17.891 8.2a1.525 1.525 0 01-1.54-.143l.337-1.155.05.085a.469.469 0 00.585.195l2.5-1.046a.52.52 0 01.691.656z"
        fill={props.selected ? "#FF9230" : "#999"}
      />
      <Path
        d="M18.387 18.627a.469.469 0 100-.937.469.469 0 000 .937z"
        fill={props.selected ? "#FF9230" : "#999"}
      />
    </Svg>
  );
}

export default Jogging;
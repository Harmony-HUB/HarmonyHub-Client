// import React from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faPlay,
//   faPause,
//   faStop,
//   faMinus,
//   faPlus,
// } from "@fortawesome/free-solid-svg-icons";
// import Button from "../common/Button/Button";
// import ButtonWrapper from "../common/ButtonWrapper/ButtonWrapper";

// function Controls({
//   playSound,
//   pauseSound,
//   stopSound,
//   handlePitchChange,
//   handleTempoChange,
// }) {
//   const horizontalButtonsConfig = [
//     {
//       id: "play-button",
//       icon: faPlay,
//       margin: "",
//       onClick: playSound,
//     },
//     {
//       id: "pause-button",
//       icon: faPause,
//       margin: "0 0 0 1rem",
//       onClick: pauseSound,
//     },
//     {
//       id: "stop-button",
//       icon: faStop,
//       margin: "0 0 0 1rem",
//       onClick: stopSound,
//     },
//     {
//       id: "pitch-down-button",
//       icon: faMinus,
//       margin: "0 0 0 1rem",
//       onClick: () => handlePitchChange(-0.1),
//     },
//     {
//       id: "pitch-up-button",
//       icon: faPlus,
//       margin: "0 0 0 1rem",
//       onClick: () => handlePitchChange(0.1),
//     },
//     {
//       id: "tempo-down-button",
//       icon: faMinus,
//       margin: "0 0 0 1rem",
//       onClick: () => handleTempoChange(-0.1),
//     },
//     {
//       id: "tempo-up-button",
//       icon: faPlus,
//       margin: "0 0 0 1rem",
//       onClick: () => handleTempoChange(0.1),
//     },
//   ];

//   return (
//     <ButtonWrapper bottom="10%" left="3%">
//       {horizontalButtonsConfig.map(config => (
//         <Button
//           id={config.id}
//           margin={config.margin}
//           key={config.id}
//           onClick={config.onClick}
//         >
//           <FontAwesomeIcon icon={config.icon} />
//         </Button>
//       ))}
//     </ButtonWrapper>
//   );
// }

// export default Controls;

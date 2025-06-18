/** @type {import('tailwindcss').Config} */

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}
module.exports = {
    mode: "jit",
    content: [
        "./application/views/**/*.php",
        "./assets/script/**/*.js",
        "./assets/style/*.css",
    ],
//   content: ["./application/views/**/*.php", "./assets/script/**/*.js"],
//   theme: {
//     extend: {
//       fontFamily: {
//         sans: [
//           "LINE Seed EN",
//           "LINE Seed EN Bold",
//           "LINE Seed TH",
//           "LINE Seed TH Bold",
//           "LINE Seed JP",
//           "LINE Seed JP Bold",
//           "sans-serif",
//         ],
//       },
//     },
//   },
//   daisyui: {
//     themes: [
//       {
//         light: {
//           primary: "#0147B2",
//           secondary: "#8a8a8b",
//           accent: "#011b63",
//           neutral: "#020017",
//           "base-100": "#ffffff",
//           info: "#00b7eb",
//           success: "#29ab87",
//           warning: "#ffbf00",
//           error: "#f55959",
//         },
//       },
//     ],
//   },
  plugins: [
    // require("daisyui"),
    require("tailwindcss-animate"),
    require("tailwindcss-bg-patterns"),
  ],
};

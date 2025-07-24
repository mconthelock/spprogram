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
    "./assets/script/*.js",
    "./assets/script/**/*.js",
    "./assets/style/*.css",
  ],
};

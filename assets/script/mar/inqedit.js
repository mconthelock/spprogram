var table;
var tableElmes;
var tableAttach;
import * as dwg from "../drawing.js";

$(document).ready(async () => {
  $(".mainmenu").find("details").attr("open", false);
  $(".mainmenu.navmenu-newinq").find("details").attr("open", true);

  //   const general =
  //     "A=533.5,B=533.5,C=0,D=700,G=404.5,J=0,L=0,M=760.5,AA=1600,BB=1400,K=2174.5";
  //   console.log(dwg.validateVariable(general)); // true
  const invalidKey =
    "A=533.5,B=533.5,C=0,D=700,G=404.5,J=0,L=0,M=760.5,AA=1600,BB=1400,K=2174.5";
  console.log(dwg.validateVariable(invalidKey, true)); // false
});

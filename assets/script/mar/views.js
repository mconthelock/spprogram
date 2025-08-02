import * as inqs from "../inquiry/detail.js";
import * as service from "../service/inquiry.js";

$(document).ready(async () => {
  $(".mainmenu").find("details").attr("open", false);
  $(".mainmenu.navmenu-newinq").find("details").attr("open", true);

  const inquiry = await service.getInquiry({ INQ_ID: $("#inquiry-id").val() });
  const cards = await inqs.setupCard();
  const cardsData = await inqs.applyValueCard(inquiry[0]);
});

$(function () {
  if ($("#message").html() != "") {
    $.notify(
      {
        title: "Login Failure",
        icon: "icofont-exclamation-circle",
        message: $("#message").html(),
      },
      alertOption
    );
  }
});

$(".showpass").on("click", function () {
  var eys_class = $(this).find("i").attr("class");
  if (eys_class == "icofont-eye") {
    $(this).find("i").removeClass("icofont-eye");
    $(this).find("i").addClass("icofont-eye-blocked");
    $(this).closest(".row").find("input").prop("type", "text");
  } else {
    $(this).find("i").addClass("icofont-eye");
    $(this).find("i").removeClass("icofont-eye-blocked");
    $(this).closest(".row").find("input").prop("type", "password");
  }
});

$("#submit").on("submit", function (e) {
  e.preventDefault();
  $("#loading").removeClass("d-none");
  let res = true;
  $(".required").each(function (i) {
    if ($(this).val() == "") {
      $(this).focus();
      res = false;
    }
  });

  if (res === false) {
    $("#loading").addClass("d-none");
    return false;
  }

  $.ajax({
    url: host + "welcome/checklogin/",
    type: "post",
    dataType: "json",
    async: false,
    data: {
      username: $("#userlogin").val(),
      password: $("#userpassword").val(),
    },
    success: function (res) {
      if (res.status !== true) {
        var notify = $.notify(
          {
            title: "Login Failure",
            icon: "icofont-close-circled",
            message: res.message,
          },
          alertOption
        );
        notify.update("type", "error");
        $("#userlogin").val("");
        $("#userpassword").val("");
        $("#userlogin").focus();
        $("#loading").addClass("d-none");
      } else {
        window.location = host;
      }
    },
  });
});

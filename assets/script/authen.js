import { getCookie, setCookie } from "@amec/webasset/jsCookie";
import { decryptText } from "@amec/webasset/crypto";
import { directlogin } from "@amec/webasset/api/auth";

$(async function () {
	const cookie = getCookie(process.env.APP_NAME);
	if (!cookie) {
		// window.location.replace(
		//   `${process.env.APP_HOST}/form/authen/index/${process.env.APP_ID}`
		// );
	}
	const indexedDBID = decryptText(cookie, process.env.APP_NAME);
	setCookie(process.env.APP_NAME, cookie, { expires: 0.5 / 24 });
	const [appid, empno] = indexedDBID.split("-");
	const res = await directlogin(empno, appid);
	//   const session = await setSession(res);
	//   window.location.replace(
	//     `${process.env.APP_ENV}/${res.GROUP_HOME == null ? "home" : res.GROUP_HOME}`
	//   );
});

export function setSession(res) {
	return new Promise((resolve) => {
		$.ajax({
			type: "post",
			dataType: "json",
			url: `${process.env.APP_ENV}/authen/setSession`,
			data: {
				group: res.appgroup,
				info: res.appuser,
				menu: res.auth,
			},
			success: function (data) {
				resolve(data);
			},
		});
	});
}

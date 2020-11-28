import axios from "axios";
import store from "../store/index";
import router from "../router";

export default async (reqType, reqURL, data) => {
  store.set("loading", true);
  store.commit("alert/setAlertMsg", "");

  const authenticationHeader = {
    headers: {
      Authorization: `${store.state.authentication.token}`
    }
  };
  const options = store.state.authentication.token ? authenticationHeader : {};

  try {
    switch (reqType) {
      case "post":
        return await axios.post(
          store.state.baseURL + "/" + reqURL,
          data,
          options
        );

      case "patch":
        return await axios.patch(
          store.state.baseURL + "/" + reqURL,
          data,
          options
        );

      case "get":
        return await axios.get(store.state.baseURL + "/" + reqURL, options);
    }
  } catch (e) {
    if (e.response.status === 401) {
      store.commit("authentication/logout");
      router.push("/login");
    }
    const msgPrefix = ["post", "patch"].includes(reqType)
      ? `Error saving data. `
      : `Error fetching details. `;

    const err =
      (e["response"] &&
        e["response"]["data"] &&
        (e["response"]["data"]["error"] || e["response"]["data"])) ||
      "";

    let errMsg = err["message"] ? err["message"] : err;
    if (
      err &&
      err["message"] &&
      err["message"].includes("E_JWT_TOKEN_EXPIRED")
    ) {
      errMsg = "Your session has expired. Re-login to continue.";
      store.commit("authentication/logout");
      router.push("/login");
    }

    store.commit("alert/setAlertMsg", `${msgPrefix} ${errMsg}`);

    // stop further processing in caller!
  } finally {
    store.set("loading", false);
  }
};

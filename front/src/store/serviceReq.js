/* eslint-disable */
import req from "../util/req";
import { parseISO, format, addMinutes } from "date-fns";

import { make } from "vuex-pathify";
import store from ".";

const getDefaultState = () => {
  return {
    serviceReqs: [],
    activeServiceReq: {}
  };
};

const state = getDefaultState();

export default {
  namespaced: true,
  name: "serviceReq",
  state: state,

  actions: {
    async fetchServiceReq(args, params) {
      const { date } = params;
      let url = `deliveries/${format(date, "yyyy-MM-dd")}`;

      const { data } = await req("get", url);
      const events = data.map(delivery => {
        return {
          start: format(parseISO(delivery.date), "yyyy-MM-dd hh:mm"),
          end: format(addMinutes(parseISO(delivery.date), 15), "yyyy-MM-dd hh:mm"),
          name: `${delivery.recipient.username} (${delivery.recipient.phone})`
        };
      })
      console.log("data", events);
      if (data) store.set("serviceReq/serviceReqs", events);
      else store.set("serviceReq/serviceReqs", { data: [] });
    },

    async createServiceReq({ commit }, sr) {
      try {
        const response = await req("post", "deliveries/", sr);
        if (!response || response.status === 404) {
          return null;
        }
        const { data } = response;
        store.set("serviceReq/activeServiceReq", data);
        commit("appendServiceReq", data);
        return data;
      } catch (e) {
        throw(e);
      }
    },

    async acceptServiceReq(_, deliveryId) {
      try {
        const { data } = await req("post", "deliveries/accept", {
          deliveryId: deliveryId
        });
        return data;
      } catch (e) {
        // error
        console.error(e);
      }
    },

    async updateServiceReq({ state }) {
      try {
        const { data } = await req(
          "patch",
          `v0/sr/${state.activeServiceReq.id}`,
          state.activeServiceReq
        );

        if (data) {
          store.set("serviceReq/activeServiceReq", data);
          store.set("snackbar/snack", {
            message: "Service request updated.",
            color: "success"
          });
        } else {
          store.set("snackbar/snack", {
            message: "Service request update failed.",
            color: "error"
          });
          store.commit(
            "pgtalert/setAlertMsg",
            "Service update failed. Retry later or contact us for assistance."
          );
        }
      } catch (e) {
        // i am error}
      }
    }
  },

  mutations: {
    ...make.mutations(state),

    appendServiceReq(state, record) {
      if (state.serviceReqs && state.serviceReqs.data)
        state.serviceReqs.data.unshift(record);
    },

    resetState(state) {
      Object.assign(state, getDefaultState());
    }
  }
};

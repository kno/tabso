/* eslint-disable */
import req from "../util/req";
import { parseISO, format, addMinutes } from "date-fns";

import { make } from "vuex-pathify";
import store from ".";

const getDefaultState = () => {
  return {
    deliveries: [],
    activeDelivery: {}
  };
};

const state = getDefaultState();

export default {
  namespaced: true,
  name: "deliveries",
  state: state,

  actions: {
    async fetchDeliveries(args, params) {
      let url = "deliveries";
      if (params && params.date) {
        const { date } = params;
        url += `/${format(date, "yyyy-MM-dd")}`;
      }

      const { data } = await req("get", url);
      const events = data.map(delivery => {
        return {
          tag: delivery,
          start: format(parseISO(delivery.date), "yyyy-MM-dd hh:mm"),
          end: format(addMinutes(parseISO(delivery.date), 15), "yyyy-MM-dd hh:mm"),
          name: `${delivery.recipient.username} (${delivery.recipient.phone})`
        };
      });
      if (data) store.set("deliveries/deliveries", events);
      else store.set("deliveries/deliveries", { data: [] });
    },

    async createDelivery({ commit }, sr) {
      try {
        const response = await req("post", "deliveries/", sr);
        if (!response || response.status === 404) {
          return null;
        }
        const { data } = response;
        //store.set("deliveries/activeDelivery", data);
        //commit("deliveries", data);
        return data;
      } catch (e) {
        throw(e);
      }
    },

    async acceptDelivery(_, deliveryId) {
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

    async updateDelivery({ state }) {
      try {
        console.log(state.activeDelivery);
        const { data } = await req(
          "post",
          `deliveries/${state.activeDelivery.id}`,
          state.activeDelivery
        );

        if (data) {
          //store.set("deliveries/activeDelivery", data);
          store.set("snackbar/snack", {
            message: "Delivery updated.",
            color: "success"
          });
        } else {
          store.set("snackbar/snack", {
            message: "Delive update failed.",
            color: "error"
          });
/*          store.commit(
            "pgtalert/setAlertMsg",
            "Delivery failed. Retry later or contact us for assistance."
          );*/
          this.fetchDeliveries(state.activeDelivery.date);
        }
      } catch (e) {
        // i am error}
      }
    }
  },

  mutations: {
    ...make.mutations(state),

    appendDelivery(state, record) {
      if (state.deliveries && state.deliveries.data)
        state.deliveries.data.unshift(record);
    },

    resetState(state) {
      Object.assign(state, getDefaultState());
    }
  }
};

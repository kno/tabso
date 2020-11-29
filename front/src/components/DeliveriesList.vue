<template>
  <PanelListMain>
    <template slot="toolbar-items">
      <span class="subtitle-2">Delivery List</span>
      <v-spacer></v-spacer>
      <v-btn @click="newRecord" small outlined>
        <v-icon small>mdi-plus</v-icon>New
      </v-btn>
      <v-icon @click="prev()">
        mdi-arrow-left-bold-circle
      </v-icon>
      <v-icon @click="next()" right>
        mdi-arrow-right-bold-circle
      </v-icon>
    </template>
    <template slot="content">
      <v-sheet v-touch="{ left: () => next(), right: () => prev() }">
        <v-calendar
          ref="calendar"
          type="day"
          interval-minutes="15"
          first-time="8:00"
          light
          v-model="today"
          :events="deliveries"
          @change="getEvents"
          @click:event="editEvent"
          @click:time="addEvent"
        >
        </v-calendar>
      </v-sheet>
      <DeliveryEdit v-model="detailDialog" />
    </template>
  </PanelListMain>
</template>

<script>
import { sync } from "vuex-pathify";
import { mapActions } from "vuex";
import { addDays, parseISO } from "date-fns";
import zeropad from "zeropad";

import PanelListMain from "./layouts/PanelListMain";

export default {
  data() {
    return {
      options: {},
      detailDialog: false,
      headers: [
        { text: "SR Num.", value: "#" },
        { text: "Deliverer", value: "Deliverer" },
        { text: "Recipient", value: "Recipient" },
        { text: "Date", value: "status_cd", sortable: false },
        { text: "Actions", value: "actions", sortable: false }
      ],
      srchSrNum: "",
      srchSrDesc: "",
      awaitingSearch: false,
      timeout: 2000,
      today: new Date()
    };
  },

  watch: {
    search: function() {
      if (!this.awaitingSearch) {
        setTimeout(() => {
          this.fetchDeliveries({
            date: this.today
          });
          this.awaitingSearch = false;
        }, 1000);
      }
      this.awaitingSearch = true;
    }
  },

  computed: {
    ...sync("deliveries", ["deliveries", "activeDelivery"]),

    search() {
      const srchStr = {};
      if (this.srchSrNum) srchStr["sr_number"] = this.srchSrNum;
      if (this.srchSrDesc) srchStr["description"] = this.srchSrDesc;

      return srchStr;
    }
  },

  methods: {
    ...mapActions("deliveries", ["fetchDeliveries", "acceptDelivery"]),

    next() {
      this.today = addDays(new Date(this.today), 1);
    },

    prev() {
      this.today = addDays(new Date(this.today), -1);
    },

    getEvents() {
      this.fetchDeliveries({
        date: this.today
      });
    },

    addEvent(when) {
      this.activeDelivery = {};
      const minutes = Math.floor(when.minute / 15) * 15;
      this.activeDelivery.date = parseISO(
        `${when.date} ${zeropad(when.hour)}:${zeropad(minutes)}`
      );
      this.detailDialog = true;
    },

    editEvent({ event, nativeEvent }) {
      nativeEvent.stopImmediatePropagation();
      this.activeDelivery = {
        ...event.tag,
        date: parseISO(event.start),
        phone: event.tag.recipient.phone
      };
      this.detailDialog = true;
    },

    changePage() {
      this.fetchDeliveries({
        date: this.today
      });
    },

    editRecord(item) {
      this.activeDelivery = item;
      this.detailDialog.show = true;
    },

    accept(id) {
      this.acceptDelivery(id);
      this.fetchDeliveries({
        date: this.today
      });
    },

    newRecord() {
      this.activeDelivery = { status: 0 };
      this.detailDialog = true;
    }
  },

  components: {
    PanelListMain,
    DeliveryEdit: () => import("./DeliveryEdit")
  }
};
</script>

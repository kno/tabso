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
          :events="serviceReqs"
          @change="getEvents"
          @click:time="addEvent"
        >
        </v-calendar>
      </v-sheet>
      <ServiceReqEdit v-model="detailDialogData" />
      <v-snackbar v-model="snackbar" :timeout="timeout" top>
        {{ snackbarText }}
      </v-snackbar>
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
      detailDialogData: { show: false },
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
      snackbar: false,
      snackbarText: "Default snack text",
      today: new Date()
    };
  },

  watch: {
    search: function() {
      if (!this.awaitingSearch) {
        setTimeout(() => {
          this.fetchServiceReq({
            date: this.today
          });
          this.awaitingSearch = false;
        }, 1000);
      }
      this.awaitingSearch = true;
    }
  },

  computed: {
    ...sync("serviceReq", ["serviceReqs", "activeServiceReq"]),

    search() {
      const srchStr = {};
      if (this.srchSrNum) srchStr["sr_number"] = this.srchSrNum;
      if (this.srchSrDesc) srchStr["description"] = this.srchSrDesc;

      return srchStr;
    }
  },

  methods: {
    ...mapActions("serviceReq", ["fetchServiceReq", "acceptServiceReq"]),

    next() {
      this.today = addDays(new Date(this.today), 1);
    },

    prev() {
      this.today = addDays(new Date(this.today), -1);
    },

    getEvents() {
      this.fetchServiceReq({
        date: this.today
      });
    },

    addEvent(when) {
      this.activeServiceReq = {};
      const minutes = Math.floor(when.minute / 15) * 15;
      this.activeServiceReq.date = parseISO(
        `${when.date} ${zeropad(when.hour)}:${zeropad(minutes)}`
      );
      this.detailDialogData.show = true;
    },

    changePage() {
      this.fetchServiceReq({
        date: this.today
      });
    },

    editRecord(item) {
      this.activeServiceReq = item;
      this.detailDialogData.show = true;
    },

    accept(id) {
      this.acceptServiceReq(id);
      this.fetchServiceReq({
        date: this.today
      });
    },

    newRecord() {
      this.activeServiceReq = { status: 0 };
      this.detailDialogData.show = true;
    }
  },

  components: {
    PanelListMain,
    ServiceReqEdit: () => import("./ServiceReqEdit")
  }
};
</script>

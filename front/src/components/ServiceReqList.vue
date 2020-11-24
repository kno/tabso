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
        >
        </v-calendar>
      </v-sheet>
      <ServiceReqEdit v-model="detailDialog" />
      <v-snackbar v-model="snackbar" :timeout="timeout" top>
        {{ snackbarText }}
      </v-snackbar>
    </template>
  </PanelListMain>
</template>

<script>
import { sync } from "vuex-pathify";
import { mapActions } from "vuex";
import { addDays } from "date-fns";

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
      snackbar: false,
      snackbarText: "Default snack text",
      today: new Date()
    };
  },

  created: function() {
    this.getEvents();
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

    changePage() {
      this.fetchServiceReq({
        date: this.today
      });
    },

    editRecord(item) {
      this.activeServiceReq = item;
      this.detailDialog = true;
    },

    accept(id) {
      this.acceptServiceReq(id);
      this.fetchServiceReq({
        date: this.today
      });
    },

    newRecord() {
      this.activeServiceReq = { status: 0 };
      this.detailDialog = true;
    }
  },

  components: {
    PanelListMain,
    ServiceReqEdit: () => import("./ServiceReqEdit")
  }
};
</script>

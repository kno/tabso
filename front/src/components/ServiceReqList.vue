<template>
  <PanelListMain>
    <template slot="toolbar-items">
      <span class="subtitle-2">Service List</span>
      <v-spacer></v-spacer>
      <v-btn @click="newRecord" small outlined>
        <v-icon small>mdi-plus</v-icon>New
      </v-btn>
    </template>
    <template slot="content">
      <v-row dense>
        <v-col cols="12">
          <v-card flat color="transparent" height="100%" style="overflow:auto">
            <v-card-title>
              <v-spacer></v-spacer>

              <v-text-field
                v-model="srchSrNum"
                prepend-icon="mdi-magnify"
                label="Search SR Number"
                single-line
              ></v-text-field>
              <v-text-field
                v-model="srchSrDesc"
                prepend-icon="mdi-file-outline"
                label="Search Description"
                single-line
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="serviceReqs"
              :options.sync="options"
              :server-items-length="Number(serviceReqs.total)"
              hide-default-footer
            >
              <template v-slot:item="props">
                <tr @click="activeServiceReq = props.item">
                  <td>{{ props.item.id }}</td>
                  <td>{{ props.item.deliverer.username }}</td>
                  <td>{{ props.item.recipient.username }}</td>
                  <td>{{ props.item.date }}</td>
                  <td>
                    <v-icon color="success" @click="editRecord(props.item)"
                      >mdi-pencil</v-icon
                    >
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
        <v-col cols="12" class="text-md-right pt-2">
          <v-pagination
            v-model="serviceReqs.page"
            :total-visible="7"
            :length="serviceReqs.lastPage"
            @input="changePage"
            justify="end"
          ></v-pagination>
        </v-col>
      </v-row>
      <ServiceReqEdit v-model="detailDialog" />
    </template>
  </PanelListMain>
</template>

<script>
import { sync } from "vuex-pathify";
import { mapActions } from "vuex";

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
      awaitingSearch: false
    };
  },
  watch: {
    options: {
      handler() {
        this.fetchServiceReq({
          page: 1,
          query: this.search
        });
      },
      deep: true
    },

    search: function() {
      if (!this.awaitingSearch) {
        setTimeout(() => {
          this.fetchServiceReq({
            page: 1,
            query: this.search
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
    ...mapActions("serviceReq", ["fetchServiceReq"]),

    changePage(page) {
      this.fetchServiceReq({
        page: page,
        query: this.search
      });
    },

    editRecord(item) {
      this.activeServiceReq = item;
      this.detailDialog = true;
    },

    newRecord() {
      this.activeServiceReq = { type_cd: "Request", status_cd: "Created" };
      this.detailDialog = true;
    }
  },

  components: {
    PanelListMain,
    ServiceReqEdit: () => import("./ServiceReqEdit")
  }
};
</script>

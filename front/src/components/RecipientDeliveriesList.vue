<template>
  <PanelListMain>
    <template slot="toolbar-items">
      <span class="subtitle-2">Delivery List</span>
      <v-spacer></v-spacer>
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
                label="Search Delivery Number"
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
              :items="deliveries"
              :options.sync="options"
              :server-items-length="Number(deliveries.total)"
              hide-default-footer
            >
              <template v-slot:item="props">
                <tr @click="activeDelivery = props.item">
                  <td>{{ props.item.tag.id }}</td>
                  <td>{{ props.item.start }}</td>
                  <td>{{ props.item.tag.remarks }}</td>
                  <td>{{ props.item.tag.status }}</td>
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
            v-model="deliveries.page"
            :total-visible="7"
            :length="deliveries.lastPage"
            @input="changePage"
            justify="end"
          ></v-pagination>
        </v-col>
      </v-row>
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
      srchSrNum: "",
      srchSrDesc: "",
      headers: [
        { text: "Delivery Num.", value: "delivery_number" },
        { text: "Date", value: "date" },
        { text: "Description", value: "description" },
        { text: "Status", value: "status_cd", sortable: false },
        { text: "Actions", value: "actions", sortable: false }
      ],
      options: {},
      detailDialog: false
    };
  },

  methods: {
    ...mapActions("deliveries", ["fetchDeliveries"]),

    changePage(page) {
      this.fetchDeliveries({
        page: page,
        query: this.search
      });
    }
  },

  computed: {
    ...sync("deliveries", ["deliveries", "activeDelivery"])
  },

  watch: {
    options: {
      handler() {
        this.fetchDeliveries();
      }
    }
  },
  components: {
    PanelListMain
  }
};
</script>

<template>
  <v-dialog
    v-model="showDialog"
    persistent
    max-width="960px"
    @keydown.esc="showDialog = false"
  >
    <SubPanel>
      <template slot="toolbar-items">
        <span class="subtitle-2">New/Edit Delivery</span>
      </template>

      <template slot="content">
        <v-card flat>
          <v-card-text>
            <v-form ref="form" v-model="validInput">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Phone Number"
                    v-model="activeDelivery['phone']"
                    :rules="[rules.required]"
                    :prepend-icon="'mdi-card-account-phone'"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <DatePick
                    label="Porpoused Date"
                    v-model="activeDelivery['date']"
                  >
                  </DatePick>
                </v-col>
                <v-col cols="12" md="9">
                  <v-textarea
                    label="Remarks"
                    v-model="activeDelivery['remarks']"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn outlined @click="closeDialog">Cancel</v-btn>
            <v-btn color="primary" @click="saveRecord">Save</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </SubPanel>
    <v-snackbar v-model="snackbar" :timeout="timeout" top>
      {{ snackbarText }}
    </v-snackbar>
  </v-dialog>
</template>

<script>
import { sync } from "vuex-pathify";
import { mapActions } from "vuex";
import SubPanel from "./layouts/SubPanel";
import PgtUtilMix from "../mixins/PgtUtilMix.vue";

export default {
  data() {
    return {
      validInput: true,
      snackbar: false,
      snackbarText: "Default snackbar text",
      timeout: 2000
    };
  },
  mixins: [PgtUtilMix],
  props: {
    value: {
      type: Boolean,
      default: () => false
    }
  },

  computed: {
    ...sync("deliveries", ["activeDelivery"]),

    showDialog: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },

  components: {
    SubPanel,
    DatePick: () => import("./util/DatePick")
  },

  mutations: {
    setDate: (state, date) => {
      state.activeDelivery.date = date;
    }
  },

  methods: {
    ...mapActions("deliveries", [
      "createDelivery",
      "updateDelivery",
      "fetchDeliveries"
    ]),

    async saveRecord() {
      if (!this.activeDelivery["id"]) {
        try {
          const createDeliveryResult = await this.createDelivery(
            this.activeDelivery
          );
          if (!createDeliveryResult) {
            this.snackbarText = "Delivery not created";
            this.snackbar = true;
          }
        } catch (e) {
          this.snackbarText = "There was an error " + e;
          this.snackbar = true;
        }
      } else {
        await this.updateDelivery(this.activeDelivery);
      }

      await this.fetchDeliveries({
        date: this.activeDelivery.date
      });
      this.closeDialog();
    },

    closeDialog() {
      this.showDialog = false;
    }
  }
};
</script>

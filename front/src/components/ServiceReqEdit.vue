<template>
  <v-dialog v-model="showDialog" persistent max-width="960px">
    <SubPanel>
      <template slot="toolbar-items">
        <span class="subtitle-2">New/Edit Service</span>
      </template>

      <template slot="content">
        <v-card flat>
          <v-card-text>
            <v-form ref="form" v-model="validInput">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Phone Number"
                    v-model="activeServiceReq['phone']"
                    :rules="[rules.required]"
                    :prepend-icon="'mdi-card-account-phone'"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <DatePick
                    label="Porpoused Date"
                    v-model="activeServiceReq['date']"
                  >
                  </DatePick>
                </v-col>
                <v-col cols="12" md="9">
                  <v-textarea
                    label="Remarks"
                    v-model="activeServiceReq['remarks']"
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
      validInput: true
    };
  },
  mixins: [PgtUtilMix],
  props: {
    value: Boolean
  },

  computed: {
    ...sync("serviceReq", ["activeServiceReq"]),

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

  methods: {
    ...mapActions("serviceReq", ["createServiceReq", "updateServiceReq"]),

    saveRecord() {
      //   this.activeServiceReq = this.activeServiceReq;
      if (!this.activeServiceReq["id"])
        this.createServiceReq(this.activeServiceReq);
      else this.updateServiceReq(this.activeServiceReq);

      this.closeDialog();
    },

    closeDialog() {
      this.showDialog = false;
    }
  }
};
</script>

<template>
  <v-menu
    ref="menu"
    v-model="dropdownOpen"
    :close-on-content-click="false"
    :return-value.sync="model"
    transition="scale-transition"
    offset-y
    max-width="600"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="displayDate"
        label="Date Time"
        prepend-icon="mdi-calendar"
        readonly
        v-on="on"
      ></v-text-field>
    </template>

    <div class="v-date-time-widget-container">
      <v-layout wrap align-center justify-center>
        <v-flex xs12 sm6>
          <v-date-picker
            v-model="dateModel"
            color="primary"
            :first-day-of-week="1"
          >
          </v-date-picker>
        </v-flex>
        <v-flex xs12 sm6>
          <v-time-picker
            v-if="dropdownOpen"
            :value="timeModel"
            color="primary"
            :no-title="true"
            format="24hr"
          >
          </v-time-picker>

          <h3 class="text-center">{{ currentSelection }}</h3>
        </v-flex>
        <v-flex xs12>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn outlined @click="dropdownOpen = false">Cancel</v-btn>
            <v-btn color="primary" @click="confirm()">Ok</v-btn>
          </v-card-actions>
        </v-flex>
      </v-layout>
    </div>
  </v-menu>
</template>

<script>
import { formatISO, format } from "date-fns";
import PgtUtilMix from "../../mixins/PgtUtilMix";
//https://codepen.io/xristian/pen/VoLRYa

export default {
  data() {
    return {
      dropdownOpen: false,
      displayDate: "",
      dateModel: "",
      timeModel: ""
    };
  },
  mixins: [PgtUtilMix],
  props: {
    value: Date
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(model) {
        this.value = model;
      }
    },

    currentSelection() {
      return format(this.value, "yyyy/MM/dd hh:mm");
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return "";
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },

    // Confirm the datetime selection and close the popover
    confirm() {
      this.onUpdateDate();
      this.dropdownOpen = false;
    },

    // Format the date and trigger the input event
    onUpdateDate() {
      if (!this.dateModel || !this.timeModel) return false;

      let selectedTime = this.timeModel;
      this.displayDate = this.formatDate(this.dateModel) + " " + selectedTime;
      this.$emit("input", this.dateModel + " " + selectedTime);
    },

    // Set the active state for the meridiam buttons
    getMeridiamButtonColor(m) {
      if (m === this.meridiam) {
        return "primary";
      } else {
        return "darkgray";
      }
    }
  },

  updated() {
    this.displayDate = format(this.value, "yyyy/MM/dd hh:mm");
    this.timeModel = format(this.value, "hh:mm");
    console.log("timemodel", this.timeModel);
    this.dateModel = formatISO(this.value, { representation: "date" });
  }
};
</script>

<style scoped>
.v-date-time-widget-container {
  background: white;
  padding: 15px;
}

.v-card {
  box-shadow: none;
}
</style>

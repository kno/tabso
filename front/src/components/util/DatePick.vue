<template>
  <v-menu
    ref="menu"
    v-model="dropdownOpen"
    :close-on-content-click="false"
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
            @change="timeChange"
          >
          </v-time-picker>

          <h3 class="text-center">{{ currentSelection }}</h3>
        </v-flex>
        <v-flex xs12>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn outlined @click="cancel">Cancel</v-btn>
            <v-btn color="primary" @click="confirm()">Ok</v-btn>
          </v-card-actions>
        </v-flex>
      </v-layout>
    </div>
  </v-menu>
</template>

<script>
import {
  formatISO,
  format,
  parse,
  parseISO,
  getHours,
  getMinutes
} from "date-fns";
import PgtUtilMix from "../../mixins/PgtUtilMix";
import zeropad from "zeropad";
//https://codepen.io/xristian/pen/VoLRYa

export default {
  data() {
    return {
      dropdownOpen: false,
      previousValue: "",
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
    currentSelection() {
      return `${this.dateModel} ${this.timeModel}`;
    }
  },
  methods: {
    // Confirm the datetime selection and close the popover
    confirm() {
      this.onUpdateDate();
      this.dropdownOpen = false;
    },

    // Format the date and trigger the input event
    onUpdateDate() {
      if (!this.dateModel || !this.timeModel) return false;
      this.displayDate = `${this.dateModel} ${this.timeModel}`;
      this.$emit("input", parseISO(this.displayDate));
    },

    timeChange(newTimeStr) {
      const newTime = parse(newTimeStr, "HH:mm", new Date());
      const minutes = zeropad(Math.round(getMinutes(newTime) / 15) * 15);
      this.timeModel = `${getHours(newTime)}:${minutes}`;
    },

    cancel() {
      this.displayDate = format(this.value, "yyyy-MM-dd hh:mm");
      this.timeModel = format(this.value, "hh:mm");
      this.dateModel = formatISO(this.value, { representation: "date" });
      this.dropdownOpen = false;
    }
  },
  created() {
    this.displayDate = format(this.value, "yyyy-MM-dd hh:mm");
    this.timeModel = format(this.value, "hh:mm");
    this.dateModel = formatISO(this.value, { representation: "date" });
  },
  updated() {
    if (this.previousValue !== this.value) {
      this.previousValue = this.value;
      this.displayDate = format(this.value, "yyyy/MM/dd hh:mm");
      this.timeModel = format(this.value, "hh:mm");
      this.dateModel = formatISO(this.value, { representation: "date" });
    }
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

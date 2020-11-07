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
            v-model="timeModel"
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
export default {
  data() {
    return {
      dropdownOpen: false,
      displayDate: "",
      dateModel: "",
      timeModel: ""
    };
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
      let selectedTime = this.timeModel;
      return this.formatDate(this.dateModel) + " " + selectedTime;
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

  mounted() {
    // Set the current date and time as default value
    var d = new Date();
    var currentHour = d.getHours();
    var minutes = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
    var currentTime = currentHour + ":" + minutes;
    this.timeModel = currentTime;
    this.dateModel = d.toISOString().substr(0, 10);
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

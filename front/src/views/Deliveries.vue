<template>
  <Panel icon="mdi-moped" title="Deliveries">
    <template slot="content">
      <v-container>
        <DeliveriesList v-if="this.user.type === 'deliverer'" />
        <RecipientDeliveriesList v-else />
      </v-container>
    </template>
  </Panel>
</template>

<script>
import Panel from "../components/layouts/Panel";
import { sync } from "vuex-pathify";

export default {
  components: {
    Panel,
    DeliveriesList: () => import("../components/DeliveriesList"),
    RecipientDeliveriesList: () =>
      import("../components/RecipientDeliveriesList")
  },
  computed: {
    ...sync("authentication", ["user"])
  }
};
</script>

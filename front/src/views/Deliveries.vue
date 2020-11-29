<template>
  <Panel icon="mdi-moped" title="Deliveries">
    <template slot="content">
      <v-container>
        <DeliveriesList />
      </v-container>
    </template>
  </Panel>
</template>

<script>
import Panel from "../components/layouts/Panel";

export default {
  components: {
    Panel,
    DeliveriesList: () => import("../components/DeliveriesList")
  }
};
</script>

<template>
  <Panel icon="mdi-moped" title="Deliveries">
    <template slot="content">
      <v-container>
        <ServiceReqList />
      </v-container>
    </template>
  </Panel>
</template>

<script>
import Panel from "../components/layouts/Panel";

export default {
  components: {
    Panel,
    ServiceReqList: () => import("../components/ServiceReqList")
  }
};
</script>

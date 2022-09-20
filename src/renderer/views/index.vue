<template>
  <div>
    <Title></Title>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <Upgrade />
  </div>
</template>
<script>
import Title from "../components/title";

import Upgrade from "../components/upgrade";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      drawer: true,
    };
  },

  components: {
    Title,
    Upgrade,
  },
  computed: {
    ...mapGetters(["orderedMeal"]),
  },

  beforeDestroy() {},
  methods: {},
};
</script> 
<style scoped>
</style>
<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!--缓存路由-->
      <keep-alive v-if="tagsView" :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
      <router-view v-else :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    tagsView() {
      return this.$store.state.settings.tagsView
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 45px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 45px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 80px);
  }

  .fixed-header+.app-main {
    padding-top: 80px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>

<template>
  <div>视频监控</div>
</template>
<script>
import { login } from '@/api/videoApi'
import { setToken } from '@/utils/videoAuth'
export default {
  name: 'VideoRealtime',
  components: {},
  data() {
    return {
      loginData: {
        uid: 'admin',
        pwd: '12345',
        digest: 'none'
      }
    }
  },
  mounted() {
    this.login()
  },
  methods: {
    async login() {
      const { Token } = await login(this.loginData)
      setToken(Token)
    }
  }
}
</script>
<style scoped lang="scss">

</style>

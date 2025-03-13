<script setup>
// import { RouterLink, RouterView } from 'vue-router'
const env = import.meta.env.VITE_API_URL
</script>

<template>
  <div>
    <h1>Hello World</h1>
    <p>{{ env }}</p>
    <el-button type="primary">Primary</el-button>
  </div>
</template>

<style scoped></style>

<template>
  <div class="mb-5">
    <h2>{{ name }}</h2>
  </div>
</template>
<script>
export default {
  name: 'TitlePage',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
}
</script>

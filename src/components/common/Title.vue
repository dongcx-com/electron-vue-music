<template>
    <div class="text-xl py-3 mt-2 flex items-center">
        <div>{{ title }}</div>
        <icon-park type="Right" size="25" :stroke-width="2"></icon-park>
    </div>
</template>

<script>
export default {
    name: "Title",
    props: {
        title: String,
    },
};
</script>

<style>
</style>
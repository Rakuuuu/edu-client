<template>
  <div class="post-search">
    <el-input
      :model-value="modelValue"
      @input="onInput"
      :placeholder="placeholder"
    />
    <el-button
      type="primary"
      :icon="Search()"
      @click="onSearch"
    />
  </div>
</template>

<script>
import { Search } from '@element-plus/icons-vue'
export default {
  name: "searchBar",
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'onSearch'],
  methods: {
    Search() {
      return Search
    },
    onInput (val) {
      console.log(val)
      this.$emit('update:modelValue', val);
    },
    onSearch () {
      this.$emit('onSearch', this.modelValue)
    }
  },
}
</script>

<style scoped lang="scss">
.post-search{
  display: flex;
  align-items: center;
  height: 40px !important;
  margin-top: 12px;
  margin-bottom: 12px;
  :deep(.el-input) {
    height: 100% !important;
  }
  :deep(.el-button) {
    height: 40px !important;
    width: 60px;
    margin: 3px 0 3px 8px;
  }
}
</style>

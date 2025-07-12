<template>
  <div></div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  /**
   * @description 是否禁用
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * @description 当前选中的值
   */
  value: {
    type: [String, Number],
    required: true,
  },
  /**
   * @description 选项列表，默认为空数组
   */
   emptyOptions: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  /**
   * @description 关闭后的回调
   * @default () => {}
   */
  afterClose: {
    type: Function as PropType<() => void>,
  },
  /**
   * @description 数据对象，默认为空对象
   */
  emptyRecord: {
    type: Object as PropType<Record<string, unknown>>,
    default: () => ({}),
  },
  /**
   * @description 选项列表
   * @default ['1', '2']
   */
  options: {
    type: Array as PropType<string[]>,
    default: () => ['1', '2'],
  },
  /**
   * @description 数量
   */
  count: {
    type: Number,
    default: 1,
  },
  /**
   * @description 名称
   * @version 1.2.1
   */
  name: {
    type: String,
    default: 'xiaoming'
  },
  /**
   * @description 标签文本
   */
  label: String,
  /**
   * @description 当前选中的值简写
   */
  val: [String, Number],
  /**
   * @description 选中条目更新的事件函数
   */
  onChange: {
    type: Function as PropType<(value: string) => void>,
  },
})
</script>

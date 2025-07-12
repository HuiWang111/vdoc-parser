<template>
  <div></div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

interface Book {
  title: string
  author: string
  year: number
}

const {
  disabled = false,
  value,
  emptyOptions = [],
  emptyRecord = {},
  options = ['1', '2'],
  count = 1,
  name = 'xiaoming',
} = defineProps<{
  /**
   * @description 是否禁用
   */
  disabled?: boolean,
  /**
   * @description 当前选中的值
   */
  value: string | number,
  /**
   * @description 选项列表，默认为空数组
   */
  emptyOptions?: string[],
  /**
   * @description 关闭后的回调
   */
  afterClose?: () => void,
  /**
   * @description 数据对象，默认为空对象
   */
  emptyRecord?: Record<string, unknown>,
  /**
   * @description 选项列表
   */
  options?: string[],
  /**
   * @description 数量
   */
  count?: number,
  /**
   * @description 名称
   * @version 1.2.1
   */
  name?: string,
  /**
   * @description 标签文本
   */
  label?: string,
  /**
   * @description 当前选中的值简写
   */
  val?: string | number,
  /**
   * @description 书本
   */
  book?: Book,
}>()
</script>

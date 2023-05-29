import { defineComponent } from 'vue'

export const Test = defineComponent({
  name: 'Test',
  props: {
    /**
     * @description 是否禁用
     * @default false
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
    },
    /**
     * @description 当前选中的值
     * @default []
     */
    options: {
      type: Array,
      default: () => []
    },
  },
})

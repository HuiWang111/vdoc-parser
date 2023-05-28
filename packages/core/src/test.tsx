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
  },
})

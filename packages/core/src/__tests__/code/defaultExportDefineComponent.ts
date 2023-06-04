export const defaultExportDefineComponent = `
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
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
     * @type {{key: 'string[]'}}
     */
    options: {
      type: Array,
      default: () => []
    },
    /**
     * @description 关闭后的回调
     * @type {{key: '() => void'}}
     */
    afterClose: {
      type: Function as PropType<() => void>,
    },
  },
})
`
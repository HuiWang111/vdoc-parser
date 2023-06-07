import { propsCode } from './propsCode'

export const namedExportDefineComponent = `
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

export const Test = defineComponent({
  name: 'Test',
  props: {
    ${propsCode}
  },
})
`
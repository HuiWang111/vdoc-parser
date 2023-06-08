import { propsCode } from './propsCode'

export const defaultExportDefineComponent = `
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'Test',
  props: {
    ${propsCode}
  },
  setup() {
    return () => {
      return <div></div>
    }
  },
})
`
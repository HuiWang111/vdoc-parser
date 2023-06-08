import { propsCode } from './propsCode'

export const defaultExportOptions = `
export default {
  name: 'Test',
  props: {
    ${propsCode}
  },
  setup() {
    return () => {
      return <div></div>
    }
  },
}`
import { propsCode } from './propsCode'

export const defaultExportVariableOptions = `
const Test = {
  name: 'Test',
  props: {
    ${propsCode}
  },
  setup() {
    return () => {
      return <div></div>
    }
  },
}

export default Test`

export const defaultExportVariableDefineComponent = `
const Test = defineComponent({
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

export default Test`

import { propsCode } from './propsCode'

export const defaultExportVariableOptions = `
const Test = {
  name: 'Test',
  props: {
    ${propsCode}
  },
}

export default Test`

export const defaultExportVariableDefineComponent = `
const Test = defineComponent({
  name: 'Test',
  props: {
    ${propsCode}
  },
})

export default Test`

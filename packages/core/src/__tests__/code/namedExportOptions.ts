import { propsCode } from './propsCode'

export const namedExportOptions = `
export const Test = {
  name: 'Test',
  props: {
    ${propsCode}
  },
}`
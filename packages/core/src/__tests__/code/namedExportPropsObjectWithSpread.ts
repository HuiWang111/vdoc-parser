import { propsCode } from './propsCode'

export const namedExportPropsObjectWithSpread = `
const spreadProps = {
  /**
   * @description 测试展开运算符
   */
  spreadKey: {
    type: String,
  }
}

export const someProps = {
  ...spreadProps,
  ${propsCode}
}`

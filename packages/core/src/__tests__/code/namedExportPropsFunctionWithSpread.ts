import { propsCode } from './propsCode'

export const namedExportPropsFunctionWithSpread = `
export enum A {
  C,
  D,
}

export const a = 1;

export const otherProps = () => ({
  /**
   * @description 用户id
   */
  userId: {
    type: number,
  },
})

export const someProps = () => ({
  ...otherProps(),
  ${propsCode}
})`

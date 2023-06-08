import { propsCode } from './propsCode'

export const namedExportPropsFunction = `
export enum A {
  C,
  D,
}

export const a = 1;

export const otherProps = () => ({
  userId: {
    type: number,
  },
})

export const someProps = () => ({
  ${propsCode}
})`

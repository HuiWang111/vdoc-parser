import {
  namedExportDefineComponent
} from './code'
import { parse } from '..'

describe('test parse method', () => {
  it('test named export defineComponent', () => {
    expect(parse(namedExportDefineComponent)).toEqual([
      {
        name: 'disabled',
        type: 'boolean',
        description: '是否禁用',
        default: 'false',
      },
      {
        name: 'value',
        type: 'string | number',
        description: '当前选中的值',
        default: undefined,
      },
      {
        name: 'options',
        type: 'string[]',
        description: '当前选中的值',
        default: '[]',
      },
      {
        name: 'afterClose',
        type: '() => void',
        description: '关闭后的回调',
        default: undefined,
      },
    ])
  })
})

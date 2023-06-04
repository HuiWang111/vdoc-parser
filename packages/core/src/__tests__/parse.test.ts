import { join } from 'path'
import {
  namedExportDefineComponent,
  namedExportOptions,
  defaultExportDefineComponent,
  defaultExportOptions,
  defaultExportVariableOptions,
  defaultExportVariableDefineComponent,
} from './code'
import { parse, parseFile } from '..'

const parsedResult = [
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
]

describe('test parse method', () => {
  it('test named export defineComponent', () => {
    expect(parse(namedExportDefineComponent, { exportType: 'named' })).toEqual(parsedResult)
  })

  it('test default export defineComponent', () => {
    expect(parse(defaultExportDefineComponent)).toEqual(parsedResult)
  })

  it('test named export options', () => {
    expect(parse(namedExportOptions, { exportType: 'named' })).toEqual(parsedResult)
  })

  it('test default export options', () => {
    expect(parse(defaultExportOptions)).toEqual(parsedResult)
  })

  it('test default export variable options', () => {
    expect(parse(defaultExportVariableOptions)).toEqual(parsedResult)
  })

  it('test default export variable defineComponent', () => {
    expect(parse(defaultExportVariableDefineComponent)).toEqual(parsedResult)
  })
})

describe('test parseFile method', () => {
  it('test parse vue file with defineComponent', async () => {
    expect(await parseFile(join(__dirname, 'file/defineComponent.vue'))).toEqual(parsedResult)
  })
})

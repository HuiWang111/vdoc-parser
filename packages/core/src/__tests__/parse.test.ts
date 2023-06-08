import { join } from 'path'
import {
  namedExportDefineComponent,
  namedExportOptions,
  namedExportPropsObject,
  namedExportPropsFunction,
  defaultExportDefineComponent,
  defaultExportOptions,
  defaultExportVariableOptions,
  defaultExportVariableDefineComponent,
} from './code'
import { parse, parseFile, parseFileSync } from '..'

const parsedResult = [
  {
    name: 'disabled',
    type: 'boolean',
    description: '是否禁用',
    default: 'false',
    version: '',
  },
  {
    name: 'value',
    type: 'string | number',
    description: '当前选中的值',
    default: '',
    version: '',
  },
  {
    name: 'emptyOptions',
    type: 'string[]',
    description: '选项列表，默认为空数组',
    default: '[]',
    version: '',
  },
  {
    name: 'afterClose',
    type: '() => void',
    description: '关闭后的回调',
    default: '() => {}',
    version: '',
  },
  {
    name: 'emptyRecord',
    type: 'Record<string, unknow>',
    description: '数据对象，默认为空对象',
    default: '{}',
    version: '',
  },
  {
    name: 'options',
    type: 'string[]',
    description: '选项列表',
    default: `['1', '2']`,
    version: '',
  },
  {
    name: 'count',
    type: 'number',
    description: '数量',
    default: '1',
    version: '',
  },
  {
    name: 'name',
    type: 'string',
    description: '名称',
    default: "'xiaoming'",
    version: '1.2.1',
  },
]

describe('test parse method', () => {
  it('test named export defineComponent', () => {
    expect(parse(namedExportDefineComponent, { exportType: 'named' })).toEqual(parsedResult)
  })

  it('test named export options', () => {
    expect(parse(namedExportOptions, { exportType: 'named' })).toEqual(parsedResult)
  })

  // it('test named export props object', () => {
  //   expect(parse(namedExportPropsObject, {
  //     exportType: 'named',
  //     exportName: 'someProps',
  //     type: 'props',
  //   })).toEqual(parsedResult)
  // })

  it('test named export props function', () => {
    expect(parse(namedExportPropsFunction, {
      exportType: 'named',
      exportName: 'someProps',
      type: 'props',
    })).toEqual(parsedResult)
  })

  it('test default export defineComponent', () => {
    expect(parse(defaultExportDefineComponent)).toEqual(parsedResult)
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

  it('test parse vue file with defineProps', async () => {
    expect(await parseFile(join(__dirname, 'file/defineProps.vue'))).toEqual(parsedResult)
  })

  it('test parse vue file with defineProps variable', async () => {
    expect(await parseFile(join(__dirname, 'file/definePropsWithVariable.vue'))).toEqual(parsedResult)
  })
})

describe('test parseFileSync method', () => {
  it('test parse vue file with defineComponent', async () => {
    expect(parseFileSync(join(__dirname, 'file/defineComponent.vue'))).toEqual(parsedResult)
  })

  it('test parse vue file with defineProps', async () => {
    expect(parseFileSync(join(__dirname, 'file/defineProps.vue'))).toEqual(parsedResult)
  })

  it('test parse vue file with defineProps variable', async () => {
    expect(parseFileSync(join(__dirname, 'file/definePropsWithVariable.vue'))).toEqual(parsedResult)
  })
})

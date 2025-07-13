import { join } from 'path'
import {
  namedExportDefineComponent,
  namedExportOptions,
  namedExportPropsObject,
  namedExportPropsObjectWithSpread,
  namedExportPropsFunction,
  namedExportPropsFunctionWithSpread,
  defaultExportDefineComponent,
  defaultExportOptions,
  defaultExportVariableOptions,
  defaultExportVariableDefineComponent,
  typesCode,
} from './code'
import {
  parseCode,
  parseFile,
  parseFileSync,
  parseTypes,
  parseTypesFileSync,
  parseTypesFile,
} from '../parsers'

const parsedResult = [
  {
    name: 'disabled',
    type: 'boolean',
    description: '是否禁用',
    default: 'false',
    version: '',
    required: 'false',
    isEvent: false,
  },
  {
    name: 'value',
    type: 'string | number',
    description: '当前选中的值',
    default: '',
    version: '',
    required: 'true',
    isEvent: false,
  },
  {
    name: 'emptyOptions',
    type: 'string[]',
    description: '选项列表，默认为空数组',
    default: '[]',
    version: '',
    required: 'false',
    isEvent: false,
  },
  {
    name: 'afterClose',
    type: '() => void',
    description: '关闭后的回调',
    default: '',
    version: '',
    required: 'false',
    isEvent: false,
  },
  {
    name: 'emptyRecord',
    type: 'Record<string, unknown>',
    description: '数据对象，默认为空对象',
    default: '{}',
    version: '',
    required: 'false',
    isEvent: false,
  },
  {
    name: 'options',
    type: 'string[]',
    description: '选项列表',
    default: `['1', '2']`,
    version: '',
    required: 'false',
    isEvent: false,
  },
  {
    name: 'count',
    type: 'number',
    description: '数量',
    default: '1',
    version: '',
    required: 'false',
    isEvent: false,
  },
  {
    name: 'name',
    type: 'string',
    description: '名称',
    default: "\"xiaoming\"",
    version: '1.2.1',
    required: 'false',
    isEvent: false,
  },
  {
    name: 'label',
    type: 'string',
    description: '标签文本',
    default: '',
    version: '',
    required: 'false',
    isEvent: false,
  },
  {
    name: 'val',
    type: 'string | number',
    description: '当前选中的值简写',
    default: '',
    version: '',
    required: 'false',
    isEvent: false,
  },
  {
    name: 'change',
    type: '(value: string) => void',
    description: '选中条目更新的事件函数',
    default: '',
    version: '',
    required: 'false',
    isEvent: true,
  },
]

describe('test parse method', () => {
  it('test named export defineComponent', () => {
    expect(parseCode(namedExportDefineComponent, { exportType: 'named' })).toEqual(parsedResult)
  })

  it('test named export options', () => {
    expect(parseCode(namedExportOptions, { exportType: 'named' })).toEqual(parsedResult)
  })

  it('test named export props object', () => {
    expect(parseCode(namedExportPropsObject, {
      exportType: 'named',
      exportName: 'someProps',
      type: 'props',
    })).toEqual(parsedResult)
  })

  it('test named export props object with spread', () => {
    expect(parseCode(namedExportPropsObjectWithSpread, {
      exportType: 'named',
      exportName: 'someProps',
      type: 'props',
    })).toEqual([
      {
        name: 'spreadKey',
        type: 'string',
        description: '测试展开运算符',
        default: '',
        version: '',
        required: 'false',
        isEvent: false,
      },
      ...parsedResult,
    ])
  })

  it('test named export props function', () => {
    expect(parseCode(namedExportPropsFunction, {
      exportType: 'named',
      exportName: 'someProps',
      type: 'props',
    })).toEqual(parsedResult)
  })

  it('test named export props function with spread', () => {
    expect(parseCode(namedExportPropsFunctionWithSpread, {
      exportType: 'named',
      exportName: 'someProps',
      type: 'props',
    })).toEqual([
      {
        name: 'userId',
        type: 'number',
        description: '用户id',
        default: '',
        version: '',
        required: 'false',
        isEvent: false,
      },
      ...parsedResult,
    ])
  })

  it('test default export defineComponent', () => {
    expect(parseCode(defaultExportDefineComponent)).toEqual(parsedResult)
  })

  it('test default export options', () => {
    expect(parseCode(defaultExportOptions)).toEqual(parsedResult)
  })

  it('test default export variable options', () => {
    expect(parseCode(defaultExportVariableOptions)).toEqual(parsedResult)
  })

  it('test default export variable defineComponent', () => {
    expect(parseCode(defaultExportVariableDefineComponent)).toEqual(parsedResult)
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

  it('test parse vue file with defineProps inline generics', async () => {
    expect(await parseFile(join(__dirname, 'file/definePropsWithTypeLiteral.vue'))).toEqual(
      [
        ...parsedResult.filter(i => i.name !== 'change'),
        {
          name: 'book',
          type: 'Book',
          description: '书本',
          default: '',
          version: '',
          required: 'false',
          isEvent: false,
        },
      ]
    )    
  })

  it('test parse vue file with defineProps inline generics 1', async () => {
    expect(await parseFile(join(__dirname, 'file/definePropsWithTypeReference.vue'))).toEqual(
      [
        ...parsedResult.filter(i => i.name !== 'change'),
        {
          name: 'book',
          type: 'Book',
          description: '书本',
          default: '',
          version: '',
          required: 'false',
          isEvent: false,
        },
      ]
    )    
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

describe('test parseTypes method', () => {
  it('parseTypes method should work', () => {
    expect(parseTypes(typesCode)).toMatchSnapshot()

    expect(parseTypes(typesCode, {
      names: ['VNode', 'A', 'D']
    })).toMatchSnapshot()

    expect(parseTypes(typesCode, {
      excludeNames: ['VNode', 'D']
    })).toMatchSnapshot()
  })
})

describe('test parseTypesFileSync method', () => {
  it('parseTypesFileSync should work with .vue file', () => {
    expect(parseTypesFileSync(join(__dirname, 'file/typesInSfc.vue'))).toMatchSnapshot()
  })

  it('parseTypesFileSync should work with .vue file by names', () => {
    expect(parseTypesFileSync(join(__dirname, 'file/typesInSfc.vue'), { names: ['Xiaoming'] })).toMatchSnapshot()
  })
})

describe('test parseTypesFile method', () => {
  it('parseTypesFile should work with .vue file', async () => {
    expect(await parseTypesFile(join(__dirname, 'file/typesInSfc.vue'))).toMatchSnapshot()
  })

  it('parseTypesFile should work with .vue file by names', async () => {
    expect(await parseTypesFile(join(__dirname, 'file/typesInSfc.vue'), { names: ['Xiaoming'] })).toMatchSnapshot()
  })
})

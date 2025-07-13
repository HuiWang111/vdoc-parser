# vdoc-parser

Vue props 解析工具，用于解析 props 对象及其注释，常用于自动生成 markdown 表格。支持解析 Vue 2.x 和 Vue 3.x 的组件定义。

## 安装

```bash
npm install vdoc-parser -D
```

## 功能特点

- 支持解析 Vue 2.x 的选项式 API
- 支持解析 Vue 3.x 的组合式 API 和 setup 语法
- 支持解析具名导出和默认导出的组件
- 支持解析 TypeScript 类型定义
- 支持同步和异步解析方法
- 支持解析 SFC（单文件组件）
- 支持解析 `vue`、`js`、`jsx`、`ts`、`tsx` 格式的文件
- 支持从 `defineProps`、`defineComponent`、`ComponentOptions` 解析 props
- 支持直接解析 props 对象或返回 props 对象的函数

## 使用场景

### 1. 默认导出 ComponentOptions

直接默认导出 `ComponentOptions` 的情况，直接传入文件路径即可：

```typescript
import { parseFile } from 'vdoc-parser'

// 支持 .vue 文件
await parseFile('./component.vue')
// 支持 .tsx 文件
await parseFile('./component.tsx')
```

### 2. 默认导出 defineComponent

直接默认导出 `defineComponent` 的情况，直接传入文件路径即可：

```typescript
import { parseFile } from 'vdoc-parser'

await parseFile('./component.vue')
await parseFile('./component.tsx')
```

### 3. 具名导出 defineComponent

具名导出 `defineComponent` 的情况，需要指定 `exportType` 为 `'named'`：

```typescript
import { parseFile } from 'vdoc-parser'

await parseFile('./component.vue', {
  exportType: 'named'
})
```

注意：这种情况不支持通过 `exportName` 配置指定解析哪个变量，因为组件需要遵循一个文件一个组件的原则。

### 4. Setup Script

使用 `setup script` 的情况，直接传入文件路径即可：

```typescript
import { parseFile } from 'vdoc-parser'

await parseFile('./component.vue')
```

### 5. 具名导出 Props 对象

具名导出 props 对象的情况，需要配置 `exportType`、`exportName` 和 `type`：

```typescript
import { parseFile } from 'vdoc-parser'

await parseFile('./props.ts', {
  exportType: 'named',
  exportName: 'someProps', // 可选，默认解析第一个 named export 变量
  type: 'props'
})
```

### 6. 具名导出 Props 函数

具名导出返回 props 对象的函数，配置同上：

```typescript
import { parseFile } from 'vdoc-parser'

await parseFile('./props.ts', {
  exportType: 'named',
  exportName: 'someProps',
  type: 'props'
})
```

## 注释规范

`vdoc-parser` 通过解析 props 及其注释来生成包含属性信息的对象。支持以下注释格式：

### 1. 基础注释

最简单的情况，只需要写 `description` 注释：

```typescript
{
  props: {
    /**
     * @description 姓名
     */
    name: {
      type: String,
      default: 'xiaoming'
    }
  }
}
```

将生成：

```typescript
{
  name: 'name',
  type: 'string',
  description: '姓名',
  default: 'xiaoming',
  version: '',
  required: 'false',
  isEvent: false,
}
```

### 2. 复合类型注释

支持添加版本信息：

```typescript
{
  props: {
    /**
     * @description 当前选中条目
     * @version 1.2.3
     */
    value: {
      type: [String, Number]
    }
  }
}
```

将生成：

```typescript
{
  name: 'value',
  type: 'string | number',
  description: '当前选中条目',
  default: '',
  version: '1.2.3',
  required: 'false',
  isEvent: false,
}
```

### 3. 复杂类型注释

支持自动解析 PropType 的泛型参数

```typescript
{
  props: {
    /**
     * @description 列表
     */
    list: {
      type: Array as PropType<Record<string, string>[]>,
      default: () => []
    }
  }
}
```

将生成：

```typescript
{
  name: 'list',
  type: 'Record<string, string>[]',
  description: '列表',
  default: '[]',
  version: '',
  required: 'false',
  isEvent: false,
}
```

### 4. defineProps TypeLiteral

```typescript
defineProps<{
  /**
   * @description 列表
   */
  list?: Record<string, string>[]
}>()
```

将生成：

```typescript
{
  name: 'list',
  type: 'Record<string, string>[]',
  description: '列表',
  default: '',
  version: '',
  required: 'false',
  isEvent: false,
}
```

### 4. defineProps TypeReference

```typescript
interface Props {
  /**
   * @description 列表
   */
  list?: Record<string, string>[]
}

const { list = [] } = defineProps<Props>()
```

将生成：

```typescript
{
  name: 'list',
  type: 'Record<string, string>[]',
  description: '列表',
  default: '[]',
  version: '',
  required: 'false',
  isEvent: false,
}
```

## API 参考

### parseCode(code: string, options?: Options)

解析代码字符串中的 Props 定义。

### parseFile(filePath: string, options?: Options)

异步解析文件中的 Props 定义。

### parseFileSync(filePath: string, options?: Options)

同步解析文件中的 Props 定义。

### parseTypes(code: string, options?: ParseTypesOptions)

解析 TypeScript 类型定义字符串。

### parseTypesFile(filePath: string, options?: ParseTypesOptions)

解析 TypeScript 类型定义文件。当你需要向用户展示组件的某些类型，但又不想把文件中的所有类型暴露到文档中时，可以使用此 API。

## 配置选项

### Options

```typescript
interface Options {
  // 导出类型：'named' | 'default'
  exportType?: ExportType;
  // 具名导出时的导出名称
  exportName?: string;
  // 解析类型：'component' | 'props'
  type?: ParseType;
}
```

### ParseTypesOptions

```typescript
interface ParseTypesOptions {
  // 指定要解析的类型名称
  names?: string[];
  // 指定要排除的类型名称
  excludeNames?: string[];
}
```

## 返回结果类型

```typescript
interface ParsedResult {
  name: string;        // 属性名称
  type: string;        // 属性类型
  description: string; // 属性描述
  default: string;     // 默认值
  version: string;     // 版本信息（可选，用于标注属性的新增版本）
  required: 'true' | 'false'; // 是否必需
  isEvent: boolean;    // 是否为事件
}
```

## 注意事项

1. 解析 Vue 文件时，会自动识别文件中的 `setup` 语法和普通组件语法
2. 使用 TypeScript 类型定义时，建议使用 JSDoc 注释来提供属性描述
3. 具名导出组件时不支持通过 `exportName` 指定解析目标（遵循一个文件一个组件原则）
4. 支持解析展开运算符（spread operator）的 Props 定义
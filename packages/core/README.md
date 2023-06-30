# vdoc-parser
vue props 解析工具（会解析 props 对象及其注释），常见用于自动生成 markdown 表格。

## Install
```bash
npm install vdoc-parser -D
```

## Usage
vdoc-parser 支持解析 `vue` `js` `jsx` `ts` `tsx` 格式的文件；支持从 `defineProps` `defineComponent` `ComponentOptions`(即直接导出ComponentOptions) 解析 props，同时也支持直接解析 props 对象或者返回 props 对象的函数。

### 1. `export default {}`
针对直接**默认**导出 `ComponentOptions` 的情况直接传入文件路径即可

```ts
import { join } from 'path'
import { parseFile } from 'vdoc-parser'

parseFile(join(__dirname, 'component.vue'))
parseFile(join(__dirname, 'component.tsx'))
```

### 2. `export default defineComponent({})`
针对直接**默认**导出 `defineComponent` 的情况直接传入文件路径即可

```ts
import { join } from 'path'
import { parseFile } from 'vdoc-parser'

parseFile(join(__dirname, 'component.vue'))
parseFile(join(__dirname, 'component.tsx'))
```

### 4. `export const Comp = defineComponent({})`
针对直接**具名**导出 `defineComponent` 的情况传入文件路径的同时需要指定是具名导出，

> 需要注意的是：这种情况不支持通过 exportName 配置指定解析哪个变量，因为组件需要遵循一个文件一个组件的原则。

```ts
import { join } from 'path'
import { parseFile } from 'vdoc-parser'

parseFile(join(__dirname, 'component.vue'), {
  exportType: 'named',
})
parseFile(join(__dirname, 'component.tsx'), {
  exportType: 'named',
})
```

### 4. `setup script`
针对直接使用 `setup script` 的情况直接传入文件路径即可

```ts
import { join } from 'path'
import { parseFile } from 'vdoc-parser'

parseFile(join(__dirname, 'component.vue'))
```

### 5. `export const someProps = {}`
针对**具名**导出 props 对象这种情况，需要配置 exportType、exportName 及 type

```ts
import { join } from 'path'
import { parseFile } from 'vdoc-parser'

parseFile(join(__dirname, 'props.ts'), {
  exportType: 'named',
  exportName: 'someProps', // 也可以不配置这个，默认会解析第一个 named export 变量
  type: 'props',
})
```

### 5. `export const someProps = () => ({})`
针对**具名**导出 props 函数这种情况，需要配置 exportType、exportName 及 type

```ts
import { join } from 'path'
import { parseFile } from 'vdoc-parser'

parseFile(join(__dirname, 'props.ts'), {
  exportType: 'named',
  exportName: 'someProps', // 也可以不配置这个，默认会解析第一个 named export 变量
  type: 'props',
})
```

## Source Comment
`vdoc-parser` 主要通过解析 props 及 props 对应的注释来生成包含属性名、属性描述、属性类型、属性默认值以及版本号（可以标注该属性是某个版本新增属性）的对象。下面主要介绍注释的写法：

### 1. 最基础的写法
对于简单的 prop 只需要写一个 description 注释就可以了，其他信息可以从 props 对象中获取。
```ts
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
生成的对象为：
```ts
{
  name: 'name',
  type: 'string',
  description: '姓名',
  default: 'xiaoming',
  version: ''
}
```

### 2. 复合类型的 prop：
```ts
{
  props: {
    /**
     * @description 当前选中条目
     * @version 1.2.3
     */
    value: {
      type: [String, Number],
    }
  }
}
```
生成的对象为：
```ts
{
  name: 'value',
  type: 'string | number',
  description: '当前选中条目',
  default: '',
  version: '1.2.3',
}
```

### 3. 当类型较为复杂，需要用 PropType 来表明时，就无法通过解析 props 对象来获取属性的类型了，需要通过注释声明类型：
```ts
{
  props: {
    /**
     * @description 列表
     * @type {{key: 'Record<string, string>[]'}}
     */
    list: {
      type: Arrray as PropType<Record<string, string>[]>,
      default: () => []
    }
  }
}
```
生成的对象为：
```ts
{
  name: 'list',
  type: 'Record<string, string>[]',
  description: '列表',
  default: '[]',
  version: '',
}
```

**注**：当默认值是对象或数组时，仅空数组或者空对象可以通过分析 props 对象获得，如果是非空的，那么就需要通过类似 `@default [1, 2, 3]` 的注释来声明默认值。
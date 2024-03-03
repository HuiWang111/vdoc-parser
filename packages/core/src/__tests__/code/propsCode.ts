export const propsCode = `
/**
 * @description 是否禁用
 */
disabled: {
 type: Boolean,
 default: false,
},
/**
 * @description 当前选中的值
 */
value: {
 type: [String, Number],
 required: true,
},
/**
 * @description 选项列表，默认为空数组
 * @type {{key: 'string[]'}}
 */
emptyOptions: {
 type: Array,
 default: () => []
},
/**
 * @description 关闭后的回调
 * @type {{key: '() => void'}}
 * @default () => {}
 */
afterClose: {
 type: Function as PropType<() => void>,
},
/**
 * @description 数据对象，默认为空对象
 * @type {{key: 'Record<string, unknow>'}}
 */
emptyRecord: {
 type: Object,
 default: () => ({}),
},
/**
 * @description 选项列表
 * @type {{key: 'string[]'}}
 * @default ['1', '2']
 */
options: {
 type: Array,
 default: () => ['1', '2'],
},
/**
 * @description 数量
 */
count: {
 type: Number,
 default: 1,
},
/**
 * @description 名称
 * @version 1.2.1
 */
name: {
 type: String,
 default: 'xiaoming'
},
/**
 * @description 标签文本
 */
label: String,
/**
 * @description 当前选中的值简写
 */
val: [String, Number],`.trim()
import {
  isArrowFunctionExpression,
  isBooleanLiteral,
  isArrayExpression,
  isObjectExpression,
  isNumericLiteral,
  isStringLiteral,
} from '@babel/types'
import type { ObjectProperty } from '@babel/types'

export function parseDefaultValue(defaultValue: ObjectProperty) {
  if (isArrowFunctionExpression(defaultValue.value)) {
    if (isArrayExpression(defaultValue.value.body)) {
      if (!defaultValue.value.body.elements.length) {
        return '[]'
      }
      // 大部分情况下默认值都是空数组
      // 对子元素处理过于复杂，这里不做解析，如需要非空数组默认值可以通过注释实现
    } else if (isObjectExpression(defaultValue.value.body)) {
      if (!defaultValue.value.body.properties.length) {
        return '{}'
      }

      // 大部分情况下默认值都是空对象
      // 对属性处理过于复杂，这里不做解析，如需要非空对象默认值可以通过注释实现
    }
  } else if (
    isBooleanLiteral(defaultValue.value)
    || isNumericLiteral(defaultValue.value)
  ) {
    return String(defaultValue.value.value)
  } else if (isStringLiteral(defaultValue.value)) {
    return `'${defaultValue.value.value}'`
  }
}
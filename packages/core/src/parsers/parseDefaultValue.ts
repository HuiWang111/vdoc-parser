import {
  isArrowFunctionExpression,
  isBooleanLiteral,
  isNumericLiteral,
  isStringLiteral,
} from '@babel/types'
import generate from '@babel/generator'
import type { ObjectProperty } from '@babel/types'

export function parseDefaultValue(defaultValue: ObjectProperty) {
  if (isArrowFunctionExpression(defaultValue.value)) {
    try {
      const { code } = generate(defaultValue.value.body as any)
      return code
    } catch {}
  }
  if (
    isBooleanLiteral(defaultValue.value)
    || isNumericLiteral(defaultValue.value)
  ) {
    return String(defaultValue.value.value)
  }
  if (isStringLiteral(defaultValue.value)) {
    return `'${defaultValue.value.value}'`
  }
}
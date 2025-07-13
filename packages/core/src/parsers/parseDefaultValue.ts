import {
  isArrowFunctionExpression,
  isBooleanLiteral,
  isNumericLiteral,
  isStringLiteral,
  isObjectPattern,
  isObjectProperty,
  isAssignmentPattern,
  isIdentifier,
  isArrayExpression,
  isObjectExpression,
  isLiteral,
  isTemplateLiteral,
  isRegExpLiteral,
  isNullLiteral,
} from '@babel/types'
import generate from '@babel/generator'
import type { ObjectProperty, LVal } from '@babel/types'

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
    return `"${defaultValue.value.value}"`
  }
}

/**
 * 解析解构赋值语句获取默认值
 */
export function parseDefaultValuesFromObjectPattern(id: LVal): Record<string, string> | undefined {
  if (!isObjectPattern(id)) {
    return
  }

  return id.properties.reduce<Record<string, string>>((acc, prop) => {
    if (isObjectProperty(prop) && isAssignmentPattern(prop.value)) {
      if (isIdentifier(prop.value.left)) {
        if (isArrayExpression(prop.value.right) || isObjectExpression(prop.value.right)) {
          try {
            const { code } = generate(prop.value.right as any)
            acc[prop.value.left.name] = code
          } catch {}
        } else if (isLiteral(prop.value.right)) {
          if (isTemplateLiteral(prop.value.right)) {
            // do nothing
          } else if (isRegExpLiteral(prop.value.right)) {
            // do nothing
          } else if (isNullLiteral(prop.value.right)) {
            acc[prop.value.left.name] = 'null'
          } else {
            acc[prop.value.left.name] = JSON.stringify(prop.value.right.value)
          }
        }
      }
    }
    return acc
  }, {})
}

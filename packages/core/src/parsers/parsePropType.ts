import {
  isArrayExpression,
  isIdentifier,
  isTSAsExpression,
  isTSTypeReference,
} from '@babel/types'
import generate from '@babel/generator'
import type { ObjectProperty } from '@babel/types'

export function parsePropType(node: ObjectProperty): string | undefined {
  if (isArrayExpression(node.value)) {
    return node.value.elements.reduce<string[]>((acc, el) => {
      if (el?.type === 'Identifier') {
        acc.push(el.name.toLowerCase())
      }
      return acc
    }, []).join(' | ')
  } else if (isIdentifier(node.value)) {
    return node.value.name.toLowerCase()
  } else if (isTSAsExpression(node.value)) {
    if (isTSTypeReference(node.value.typeAnnotation)) {
      if (node.value.typeAnnotation.typeParameters) {
        const typeParam = node.value.typeAnnotation.typeParameters.params[0]

        if (typeParam) {
          try {
            const { code } = generate(typeParam as any)
            return code
          } catch {
            // 无法解析
          }
        }
      }
    }
  }
}
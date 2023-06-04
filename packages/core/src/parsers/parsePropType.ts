import {
  isArrayExpression,
  isIdentifier,
} from '@babel/types'
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
  }

  // TODO: 暂时无法实现读取 PropType 类型参数
  // else if (isTSAsExpression(node.value)) {
  //   if (isTSTypeReference(node.value.typeAnnotation)) {
  //     if (node.value.typeAnnotation.typeParameters) {

  //     }
  //   }
  // }
}
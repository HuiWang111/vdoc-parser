import generate from '@babel/generator'
import { isIdentifier, isTSPropertySignature, LVal, TSTypeElement } from '@babel/types'
import { parseCommentBlock } from './parseCommentBlock'
import { parseDefaultValuesFromObjectPattern } from './parseDefaultValue'
import type { BuiltinResult } from '../types'

export function parseTSTypeLiteral(
  elements: TSTypeElement[],
  id?: LVal,
): BuiltinResult[] {
  const defaultValues = id
    ? parseDefaultValuesFromObjectPattern(id)
    : null
  
  return elements.reduce<BuiltinResult[]>((acc, member) => {
    if (!member.leadingComments || !member.leadingComments.length) {
      return acc
    }
    if (!isTSPropertySignature(member)) {
      return acc
    }

    const lastComment = member.leadingComments[member.leadingComments.length - 1]
    if (lastComment.type !== 'CommentBlock') {
      return acc
    }

    const commentInfo = parseCommentBlock(lastComment)
    let type = ''
    try {
      if (member.typeAnnotation?.typeAnnotation) {
        const { code } = generate(member.typeAnnotation.typeAnnotation as any)
        type = code
      }
    } catch {}

    const name = isIdentifier(member.key)
        ? member.key.name
        : ''

    acc.push({
      name,
      type,
      description: commentInfo.description,
      default: defaultValues?.[name] || '',
      version: commentInfo.version || '',
      required: member.optional
        ? 'false'
        : 'true',
      isEvent: false,
    })

    return acc
  }, [])
}
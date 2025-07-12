import doctrine from 'doctrine'
import generate from '@babel/generator'
import { isIdentifier, isTSPropertySignature, LVal, type TSTypeLiteral } from '@babel/types'
import type { BuiltinResult } from '../types'
import { parseCommentTags } from './parseCommentTags'
import { parseObjectPattern } from './parseObjectPattern'

export function parseTSTypeLiteral(
  typeParam: TSTypeLiteral,
  id: LVal,
): BuiltinResult[] {
  const defaultValues = parseObjectPattern(id)
  
  return typeParam.members.reduce<BuiltinResult[]>((acc, member) => {
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

    const { tags } = doctrine.parse(`/*${lastComment.value}*/`, { unwrap: true })
    const commentInfo = parseCommentTags(tags)
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
import doctrine from 'doctrine'
import {
  isObjectProperty,
  isIdentifier,
  isObjectExpression,
  isArrayExpression,
  isBooleanLiteral,
} from '@babel/types'
import { getPropertyByExpression, isEventProp, lowerFirst } from '../utils'
import { parsePropType } from './parsePropType'
import { parseDefaultValue } from './parseDefaultValue'
import type { ObjectExpression } from '@babel/types'
import type { BuiltinResult } from '../types'
import { parseCommentTags } from './parseCommentTags'

export function parseProps(
  props: ObjectExpression,
): BuiltinResult[] {
  return props.properties.reduce<BuiltinResult[]>((acc, prop) => {
    if (
      !isObjectProperty(prop)
      || !isIdentifier(prop.key)
      || !prop.leadingComments
      || !prop.leadingComments.length
    ) {
      return acc
    }

    const lastComment = prop.leadingComments[prop.leadingComments.length - 1]
    if (lastComment.type !== 'CommentBlock') {
      return acc
    }
    const { tags } = doctrine.parse(`/*${lastComment.value}*/`, { unwrap: true })
    const commentInfo = parseCommentTags(tags)

    if (isObjectExpression(prop.value)) {
      const propType = getPropertyByExpression(prop.value, 'type')
      const defaultProperty = getPropertyByExpression(prop.value, 'default')
      const isRequired = getPropertyByExpression(prop.value, 'required')
      const parsedType = propType
        ? parsePropType(propType)
        : undefined
      const defaultValue = defaultProperty
        ? parseDefaultValue(defaultProperty)
        : undefined
      const name = isIdentifier(prop.key)
        ? prop.key.name
        : ''
      const isEvent = isEventProp(name)
      
      acc.push({
        name: isEvent
          ? lowerFirst(name.replace(/^on/, ''))
          : name,
        type: parsedType || '',
        description: commentInfo.description,
        default: defaultValue || '',
        version: commentInfo.version || '',
        required: isRequired && isBooleanLiteral(isRequired.value) && isRequired.value.value
          ? 'true'
          : 'false',
        isEvent,
      })
    } else if (isIdentifier(prop.value)) {
      const name = isIdentifier(prop.key)
        ? prop.key.name
        : ''
      const isEvent = isEventProp(name)

      acc.push({
        name: isEvent
          ? lowerFirst(name.replace(/^on/, ''))
          : name,
        type: prop.value.name.toLowerCase(),
        description: commentInfo.description,
        default: commentInfo.default || '',
        version: commentInfo.version || '',
        required: 'false',
        isEvent,
      })
    } else if (isArrayExpression(prop.value)) {
      const type = prop.value.elements.reduce<string[]>((acc, el) => {
        if (el?.type === 'Identifier') {
          acc.push(el.name.toLowerCase())
        }
        return acc
      }, []).join(' | ')
      const name = isIdentifier(prop.key)
        ? prop.key.name
        : ''
      const isEvent = isEventProp(name)

      acc.push({
        name: isEvent
          ? lowerFirst(name.replace(/^on/, ''))
          : name,
        type,
        description: commentInfo.description,
        default: commentInfo.default || '',
        version: commentInfo.version || '',
        required: 'false',
        isEvent,
      })
    }

    return acc
  }, [])
}
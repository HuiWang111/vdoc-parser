import {
  isObjectProperty,
  isIdentifier,
  isObjectExpression,
  isArrayExpression,
} from '@babel/types'
import { getPropertyByExpression } from '../utils'
import { parsePropType } from './parsePropType'
import { parseDefaultValue } from './parseDefaultValue'
import type { ObjectExpression } from '@babel/types'
import type { BuiltinResult } from '../types'

export function parseProps(
  props: ObjectExpression,
  commentEndLine: number,
): Pick<BuiltinResult, 'name' | 'type' | 'default'> | undefined {
  const prop = props.properties.find(p => {
    return isObjectProperty(p)
      && p.loc?.start.line === commentEndLine + 1
      && isIdentifier(p.key)
  })

  if (prop && isObjectProperty(prop)) {
    if (isObjectExpression(prop.value)) {
      const propType = getPropertyByExpression(prop.value, 'type')
      const defaultProperty = getPropertyByExpression(prop.value, 'default')
      const parsedType = propType
        ? parsePropType(propType)
        : undefined
      const defaultValue = defaultProperty
        ? parseDefaultValue(defaultProperty)
        : undefined
      
      return {
        name: isIdentifier(prop.key)
          ? prop.key.name
          : '',
        type: parsedType || '',
        default: defaultValue || '',
      }
    } else if (isIdentifier(prop.value)) {
      return {
        name: isIdentifier(prop.key)
          ? prop.key.name
          : '',
        type: prop.value.name.toLowerCase(),
        default: '',
      }
    } else if (isArrayExpression(prop.value)) {
      const type = prop.value.elements.reduce<string[]>((acc, el) => {
        if (el?.type === 'Identifier') {
          acc.push(el.name.toLowerCase())
        }
        return acc
      }, []).join(' | ')

      return {
        name: isIdentifier(prop.key)
          ? prop.key.name
          : '',
        type,
        default: '',
      }
    }
  }
}
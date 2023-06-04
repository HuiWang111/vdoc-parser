import { getPropertyByExpression } from '../utils'
import { parsePropType } from './parsePropType'
import {
  isObjectExpression,
  isObjectProperty,
  isIdentifier,
} from '@babel/types'
import type { BuiltinResult } from '../types'
import type { ObjectExpression } from '@babel/types'

export function parseComponentOptions(
  options: ObjectExpression,
  commentEndLine: number,
): Pick<BuiltinResult, 'name' | 'type'> | undefined {
  const props = getPropertyByExpression(options, 'props')

  if (!props) return

  if (isObjectExpression(props.value)) {
    const prop = props.value.properties.find(p => {
      return isObjectProperty(p)
        && p.loc?.start.line === commentEndLine + 1
        && isIdentifier(p.key)
    })

    if (prop && isObjectProperty(prop) && isObjectExpression(prop.value)) {
      const propType = getPropertyByExpression(prop.value, 'type')
      const parsedType = propType
        ? parsePropType(propType)
        : undefined
      
      return {
        name: isIdentifier(prop.key)
          ? prop.key.name
          : '',
        type: parsedType || ''
      }
    }
  }
}
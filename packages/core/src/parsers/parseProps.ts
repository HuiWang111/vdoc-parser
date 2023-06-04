import {
  isObjectProperty,
  isIdentifier,
  isObjectExpression,
} from '@babel/types'
import { getPropertyByExpression } from '../utils'
import { parsePropType } from './parsePropType'
import type { ObjectExpression } from '@babel/types'
import type { BuiltinResult } from '../types'

export function parseProps(
  props: ObjectExpression,
  commentEndLine: number,
): Pick<BuiltinResult, 'name' | 'type'> | undefined {
  const prop = props.properties.find(p => {
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
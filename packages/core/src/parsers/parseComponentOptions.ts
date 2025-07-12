import {
  isObjectExpression,
} from '@babel/types'
import { getPropertyByExpression } from '../utils'
import { parseProps } from './parseProps'
import type { BuiltinResult } from '../types'
import type { ObjectExpression } from '@babel/types'

export function parseComponentOptions(
  options: ObjectExpression,
): Array<BuiltinResult> | undefined {
  const props = getPropertyByExpression(options, 'props')

  if (!props) return

  if (isObjectExpression(props.value)) {
    return parseProps(props.value)
  }
}
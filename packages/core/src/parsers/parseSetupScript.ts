import {
  isExpressionStatement,
  isObjectExpression,
  isVariableDeclaration,
} from '@babel/types'
import { getCallExpressionArguments } from '../utils'
import type { BuiltinResult } from '../types'
import { parseProps } from './parseProps'
import type { Statement } from '@babel/types'

export function parseSetupScript(
  statements: Statement[],
  commentEndLine: number,
): Pick<BuiltinResult, 'name' | 'type'> | undefined {
  for (const statement of statements) {
    if (isExpressionStatement(statement)) {
      const args = getCallExpressionArguments(statement.expression, 'defineProps')
      
      if (args.length && isObjectExpression(args[0])) {
        return parseProps(args[0], commentEndLine)
      }
    } else if (isVariableDeclaration(statement) && statement.declarations.length) {
      const args = getCallExpressionArguments(statement.declarations[0].init, 'defineProps')
      
      if (args.length && isObjectExpression(args[0])) {
        return parseProps(args[0], commentEndLine)
      }
    }
  }
}
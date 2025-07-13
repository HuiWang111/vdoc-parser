import {
  isExpressionStatement,
  isVariableDeclaration,
} from '@babel/types'
import type { BuiltinResult } from '../types'
import type { Statement } from '@babel/types'
import { parseDefineProps } from './parseDefineProps'

export function parseSetupScript(
  statements: Statement[],
): Array<BuiltinResult> | undefined {
  for (const statement of statements) {
    if (isExpressionStatement(statement)) {
      return parseDefineProps(statement.expression, statements)
    }
    
    if (isVariableDeclaration(statement) && statement.declarations.length) {
      const expression = statement.declarations[0].init
      return parseDefineProps(expression, statements, statement.declarations[0].id)
    }
  }
}
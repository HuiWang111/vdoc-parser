import {
  isCallExpression,
  isIdentifier,
  isObjectProperty,
  isNode,
  isObjectExpression,
} from '@babel/types'
import type {
  Statement,
  ObjectExpression,
  VariableDeclarator,
  CallExpression,
  ObjectProperty,
  Node,
} from '@babel/types'
import type {
  StatementExportType,
  ExportType,
  StatementExportDeclaration,
} from './types'

export function getStatementExportType(type: ExportType): StatementExportType {
  return type === 'named'
    ? 'ExportNamedDeclaration'
    : 'ExportDefaultDeclaration'
}

export function getExportDeclaration(statements: Statement[], statementExportType: StatementExportType) {
  return statements.filter(s => s.type === statementExportType) as StatementExportDeclaration[]
}

export function getCallExpressionArguments(callExpression: any, calleeName?: string) {
  if (!isNode(callExpression) || !isCallExpression(callExpression)) return []

  if (calleeName) {
    return isIdentifier(callExpression.callee) && callExpression.callee.name === calleeName
      ? callExpression.arguments
      : []
  }
  return isIdentifier(callExpression.callee)
    ? callExpression.arguments
    : []
}

export function getComponentOptions(
  declarations: VariableDeclarator[],
): CallExpression['arguments'][0] | undefined {
  let args: CallExpression['arguments'] | undefined
  
  for (const d of declarations) {
    if (isCallExpression(d.init)) {
      args = getCallExpressionArguments(d.init)
    } else if (isObjectExpression(d.init)) {
      args = [d.init]
    }

    if (args?.length) {
      return args[0]
    }
  }
}

export function getPropertyByExpression(expression: ObjectExpression | null, propName: string) {
  if (!expression) return null

  return expression.properties
    .find(p => isObjectProperty(p)
      && isIdentifier(p.key)
      && p.key.name === propName) as ObjectProperty | null
}

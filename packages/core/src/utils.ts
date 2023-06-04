import { isCallExpression, isIdentifier, isObjectProperty } from '@babel/types'
import type {
  Statement,
  ObjectExpression,
  VariableDeclarator,
  CallExpression,
  ObjectProperty,
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
  return statements.find(s => s.type === statementExportType) as (
    StatementExportDeclaration | undefined
  )
}

export function getComponentOptions(
  declarations: VariableDeclarator[],
): CallExpression['arguments'][0] | undefined {
  let args: CallExpression['arguments'] | undefined

  declarations.forEach(d => {
    const { init } = d

    if (isCallExpression(init) && isIdentifier(init.callee) && init.callee.name === 'defineComponent') {
      args = init.arguments
    }
  })

  return args?.[0]
}

export function getPropertyByExpression(expression: ObjectExpression | null, propName: string) {
  if (!expression) return null

  const { properties } = expression

  return properties.find(p => isObjectProperty(p) && isIdentifier(p.key) && p.key.name === propName) as ObjectProperty | null
}

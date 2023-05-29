import type {
  Statement,
  ExportDefaultDeclaration,
  ExportNamedDeclaration,
  ObjectExpression,
  VariableDeclarator,
  CallExpression,
  ObjectProperty,
} from '@babel/types'
import type {
  StatementExportType,
  ExportType
} from './types'

function getExportType(type: ExportType): StatementExportType {
  return type === 'named'
    ? 'ExportNamedDeclaration'
    : 'ExportDefaultDeclaration'
}

function getDefineComponentArgment(declarations: VariableDeclarator[]) {
  let args: CallExpression['arguments'] | undefined

  declarations.forEach(d => {
    const { init } = d

    if (init?.type === 'CallExpression' && (init.callee as any).name === 'defineComponent') {
      args = init.arguments
    }
  })

  return args
}

function getPropertyByExpression(expression: ObjectExpression | null, propName: string) {
  if (!expression) return null

  const { properties } = expression

  return properties.find(p => p.type === 'ObjectProperty' && (p.key as any).name === propName) as ObjectProperty | null
}

export function getPropNameByCommentEndLine(
  statements: Statement[],
  endLine: number,
  type: ExportType = 'named'
) {
  const statementExportType = getExportType(type)
  const exportDeclaration = statements.find(s => s.type === statementExportType) as (
    ExportNamedDeclaration | ExportDefaultDeclaration | undefined
  )

  if (!exportDeclaration) {
    return
  }
  
  if (exportDeclaration.declaration?.type === 'VariableDeclaration') {
    const args = getDefineComponentArgment(exportDeclaration.declaration.declarations)
    const property = args?.find(arg => arg.type === 'ObjectExpression') as ObjectExpression | null
    const prop = getPropertyByExpression(property, 'props')

    if (prop) {
      if (typeof prop.value === 'object') {
        const { properties } = prop.value as ObjectExpression
        const found = properties.find(p => p.type === 'ObjectProperty' && p.loc?.start.line === endLine + 1) as ObjectProperty

        return (found?.key as any).name
      }
    }
  }
}
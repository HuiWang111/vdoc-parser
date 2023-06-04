import {
  getStatementExportType,
  getExportDeclaration,
  getComponentOptions,
} from '../utils'
import {
  isVariableDeclaration,
  isObjectExpression,
  ObjectExpression,
} from '@babel/types'
import type {
  Statement,
} from '@babel/types'
import type {
  ExportType,
} from '../types'

export function parseExport(
  statements: Statement[],
  exportType: ExportType,
): ObjectExpression | undefined {
  const statementExportType = getStatementExportType(exportType)
  const exportDeclaration = getExportDeclaration(statements, statementExportType)

  if (!exportDeclaration) return

  if (isVariableDeclaration(exportDeclaration.declaration)) {
    const options = getComponentOptions(exportDeclaration.declaration.declarations)

    return isObjectExpression(options)
      ? options
      : undefined
  }
}
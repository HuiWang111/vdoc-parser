import {
  getStatementExportType,
  getExportDeclaration,
  getComponentOptions,
  getCallExpressionArguments,
} from '../utils'
import {
  isVariableDeclaration,
  isObjectExpression,
  ObjectExpression,
  isCallExpression,
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
  
  /** export const Comp = defineComponent({}) */
  if (isVariableDeclaration(exportDeclaration.declaration)) {
    const options = getComponentOptions(exportDeclaration.declaration.declarations)

    return isObjectExpression(options)
      ? options
      : undefined
  /** export default defineComponent({}) */
  } else if (isCallExpression(exportDeclaration.declaration)) {
    const args = getCallExpressionArguments(exportDeclaration.declaration)
    const options = args[0]

    return isObjectExpression(options)
      ? options
      : undefined
  }
}
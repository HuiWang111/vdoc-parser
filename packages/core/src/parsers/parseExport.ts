import {
  getStatementExportType,
  getExportDeclaration,
  getComponentOptions,
  getCallExpressionArguments,
} from '../utils'
import {
  isVariableDeclaration,
  isObjectExpression,
  isCallExpression,
  isIdentifier,
} from '@babel/types'
import type {
  Statement,
  ObjectExpression,
  VariableDeclaration,
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
  
  /** export const Comp = defineComponent({}) or export const Comp = {} */
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
  /** export default {} */
  } else if (isObjectExpression(exportDeclaration.declaration)) {
    return exportDeclaration.declaration
  /**
   * const Comp = {} or const Comp = defineComponent({})
   * export default Comp
   **/
  } else if (isIdentifier(exportDeclaration.declaration)) {
    const { name } = exportDeclaration.declaration
    const variableDeclaration = statements.find(s => isVariableDeclaration(s)) as VariableDeclaration | undefined

    if (!variableDeclaration) return

    const variableDeclarator = variableDeclaration.declarations.find(d => {
      return isIdentifier(d.id) && d.id.name === name
    })

    if (!variableDeclarator) return

    if (isObjectExpression(variableDeclarator.init)) {
      return variableDeclarator.init
    } else if (isCallExpression(variableDeclarator.init)) {
      const args = getCallExpressionArguments(variableDeclarator.init)
      const options = args[0]

      return isObjectExpression(options)
        ? options
        : undefined
    }
  }
}
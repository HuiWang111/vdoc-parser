import {
  getStatementExportType,
  getExportDeclaration,
  getComponentOptions,
  getCallExpressionArguments,
} from '../utils'
import { resolveSpreadElements } from '../resolvers'
import {
  isVariableDeclaration,
  isObjectExpression,
  isCallExpression,
  isIdentifier,
  isArrowFunctionExpression,
  isSpreadElement,
} from '@babel/types'
import type {
  Statement,
  ObjectExpression,
  VariableDeclaration,
  SpreadElement,
  ObjectProperty,
} from '@babel/types'
import type {
  ExportType,
  ParseType,
} from '../types'

export function parseExport(
  statements: Statement[],
  exportType: ExportType,
  type: ParseType,
  exportName?: string,
): ObjectExpression | undefined {
  const statementExportType = getStatementExportType(exportType)
  const declarations = getExportDeclaration(statements, statementExportType)
  
  for (const exportDeclaration of declarations) {
    if (isVariableDeclaration(exportDeclaration.declaration)) {
      /** export const Comp = defineComponent({}) or export const Comp = {} */
      if (type === 'component') {
        const options = getComponentOptions(exportDeclaration.declaration.declarations)
    
        return isObjectExpression(options)
          ? options
          : undefined
      }
      
      const declarator = exportName
        ? exportDeclaration.declaration.declarations.find(d => {
          return isIdentifier(d.id) && d.id.name === exportName
        })
        : exportDeclaration.declaration.declarations[0]
  
      if (declarator) {
        /**export const props = {} */
        if (isObjectExpression(declarator.init)) {
          const spreadElements = declarator.init.properties.filter(p => isSpreadElement(p)) as SpreadElement[]
          const spreadInits = resolveSpreadElements(spreadElements, statements)

          if (spreadInits.length) {
            declarator.init.properties = [
              ...spreadInits.reduce<ObjectProperty[]>((acc, init) => {
                acc = [...acc, ...init.properties as ObjectProperty[]]
                return acc
              }, []),
              ...declarator.init.properties,
            ]
          }
          
          return declarator.init
        /**export const props = () => ({}) */
        } else if (isArrowFunctionExpression(declarator.init) && isObjectExpression(declarator.init.body)) {
          const spreadElements = declarator.init.body.properties.filter(p => isSpreadElement(p)) as SpreadElement[]
          const spreadInits = resolveSpreadElements(spreadElements, statements)

          if (spreadInits.length) {
            declarator.init.body.properties = [
              ...spreadInits.reduce<ObjectProperty[]>((acc, init) => {
                acc = [...acc, ...init.properties as ObjectProperty[]]
                return acc
              }, []),
              ...declarator.init.body.properties,
            ]
          }

          return declarator.init.body
        }
      }
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
}
import { 
  isIdentifier,
  isExportNamedDeclaration,
  isVariableDeclaration,
  isObjectExpression,
  isCallExpression,
  isArrowFunctionExpression,
} from '@babel/types'
import type { SpreadElement, Statement, ObjectExpression } from '@babel/types'

export function resolveSpreadElements(spreadElements: SpreadElement[], statements: Statement[]): ObjectExpression[] {
  const inits: ObjectExpression[] = []

  if (!spreadElements.length) {
    return inits
  }

  const spreadNames: string[] = []
  const spreadCalleeNames: string[] = []

  for (const el of spreadElements) {
    if (isIdentifier(el.argument)) {
      spreadNames.push(el.argument.name)
    } else if (isCallExpression(el.argument) && isIdentifier(el.argument.callee)) {
      spreadCalleeNames.push(el.argument.callee.name)
    }
  }

  statements.forEach(statement => {
    if (isExportNamedDeclaration(statement) && isVariableDeclaration(statement.declaration)) {
      if (isVariableDeclaration(statement.declaration)) {
        for (const d of statement.declaration.declarations) {
          if (isIdentifier(d.id)) {
            if (spreadNames.includes(d.id.name) && isObjectExpression(d.init)) {
              inits.push(d.init)
            } else if (
              spreadCalleeNames.includes(d.id.name)
              && isArrowFunctionExpression(d.init)
              && isObjectExpression(d.init.body)
            ) {
              inits.push(d.init.body)
            }
          }
        }
      }
    } else if (isVariableDeclaration(statement)) {
      for (const d of statement.declarations) {
        if (isIdentifier(d.id)) {
          if (spreadNames.includes(d.id.name) && isObjectExpression(d.init)) {
            inits.push(d.init)
          } else if (
            spreadCalleeNames.includes(d.id.name)
            && isArrowFunctionExpression(d.init)
            && isObjectExpression(d.init.body)
          ) {
            inits.push(d.init.body)
          }
        }
      }
    }
  })

  return inits
}

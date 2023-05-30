import type {
  Statement,
  ExportDefaultDeclaration,
  ExportNamedDeclaration,
  ObjectExpression,
  VariableDeclarator,
  CallExpression,
  ObjectProperty,
  Identifier,
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

function getPropertyTypeExpression(node: ObjectProperty | null) {
  if (!node) {
    return
  }
  
  if (node.value.type === 'ArrayExpression') {
    return node.value.elements.reduce<string[]>((acc, el) => {
      if (el?.type === 'Identifier') {
        acc.push(el.name.toLowerCase())
      }
      return acc
    }, []).join(' | ')
  } else if (node.value.type === 'Identifier') {
    return node.value.name.toLowerCase()
  }
  
  // TODO: 暂时无法实现读取 PropType 类型参数
  // else if (node.value.type === 'TSAsExpression') {
  //   if (node.value.typeAnnotation.type === 'TSTypeReference') {
  //     if (node.value.typeAnnotation.typeParameters) {
  //       const typeExpressionAst = node.value.typeAnnotation.typeParameters.params[0]
  //       if (typeExpressionAst.type === 'TSFunctionType') {
  //         console.log(node.value)
  //       }
  //     }
  //   }
  // }
}

export function getPropInfoByCommentEndLine(
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
        const found = properties.find(p => p.type === 'ObjectProperty' && p.loc?.start.line === endLine + 1 && p.key.type === 'Identifier') as ObjectProperty
        const type = getPropertyByExpression(found?.value as ObjectExpression, 'type')
        
        if (found) {
          return {
            name: ((found.key as Identifier).name as string) || '',
            type: getPropertyTypeExpression(type) || '',
          }
        }
      }
    }
  }
}
import { getCallExpressionArguments } from '../utils'
import {
  isCallExpression,
  isIdentifier,
  isObjectExpression,
  isTSInterfaceDeclaration,
  isTSTypeLiteral,
  isTSTypeReference,
} from '@babel/types'
import type { Expression, LVal, Statement, TSInterfaceDeclaration } from '@babel/types'
import { parseProps } from './parseProps'
import { parseTSTypeLiteral } from './parseTSTypeLiteral'

export function parseDefineProps (
  expression: Expression | null | undefined,
  statements: Statement[],
  id?: LVal,
) {
  const args = getCallExpressionArguments(expression, 'defineProps')
  
  /**
   * 解析 defineProps 运行时参数
   */
  if (args.length && isObjectExpression(args[0])) {
    return parseProps(args[0])
  }
  
  /**
   * 解析 defineProps 泛型参数
   */
  if (isCallExpression(expression) && expression.typeParameters) {
    const { params } = expression.typeParameters
    const typeParam = params[0]

    if (isTSTypeLiteral(typeParam)) {
      return parseTSTypeLiteral(typeParam.members, id)
    } else if (isTSTypeReference(typeParam) && isIdentifier(typeParam.typeName)) {
      const typeName = typeParam.typeName.name
      const typeDeclaration = statements.find(s => {
        return isTSInterfaceDeclaration(s) && isIdentifier(s.id) && s.id.name === typeName
      }) as TSInterfaceDeclaration

      if (typeDeclaration) {
        return parseTSTypeLiteral(typeDeclaration.body.body, id)
      }
    }
  }
}
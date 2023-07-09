import { parse as babelParse } from '@babel/parser'
import { transformFromAstSync } from '@babel/core'
import {
  isTSInterfaceDeclaration,
  isTSTypeAliasDeclaration,
  isExportNamedDeclaration,
  isIdentifier,
} from '@babel/types'
import type { ParseTypesOptions } from '../types'

export function parseTypes(code: string, options?: ParseTypesOptions) {
  const res = babelParse(code, {
    sourceType: 'module',
    plugins: [
      'typescript',
    ]
  })

  const filteredBody = res.program.body.filter(node => {
    if (isTSInterfaceDeclaration(node) || isTSTypeAliasDeclaration(node)) {
      if (!options || !options.names) {
        return true
      }

      return isIdentifier(node.id) && options.names.includes(node.id.name)
    }

    if (isExportNamedDeclaration(node)) {
      if (isTSInterfaceDeclaration(node.declaration) || isTSTypeAliasDeclaration(node.declaration)) {
        if (!options || !options.names) {
          return true
        }

        return isIdentifier(node.declaration.id) && options.names.includes(node.declaration.id.name)
      }
      return false
    }
    return false
  })

  res.program.body = filteredBody

  return transformFromAstSync(res)?.code
}

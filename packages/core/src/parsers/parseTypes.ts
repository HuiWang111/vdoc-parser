import { parse as babelParse } from '@babel/parser'
import { transformFromAstSync } from '@babel/core'
import {
  isTSInterfaceDeclaration,
  isTSTypeAliasDeclaration,
  isExportNamedDeclaration,
  isIdentifier,
  isImportDeclaration,
  isImportSpecifier,
} from '@babel/types'
import type { ParseTypesOptions } from '../types'

export function parseTypes(code: string, options?: ParseTypesOptions) {
  const res = babelParse(code, {
    sourceType: 'module',
    plugins: [
      'typescript',
    ]
  })

  if (!options || !options.names) {
    return code
  }

  const { names } = options

  const filteredBody = res.program.body.filter(node => {
    if (isTSInterfaceDeclaration(node) || isTSTypeAliasDeclaration(node)) {
      return isIdentifier(node.id) && names.includes(node.id.name)
    }
    if (isImportDeclaration(node)) {
      node.specifiers = node.specifiers.filter(s => {
        return isImportSpecifier(s) && isIdentifier(s.imported) && names.includes(s.imported.name)
      })

      if (node.specifiers.length === 0) {
        return false
      }

      return true
    }

    if (isExportNamedDeclaration(node)) {
      if (isTSInterfaceDeclaration(node.declaration) || isTSTypeAliasDeclaration(node.declaration)) {
        return isIdentifier(node.declaration.id) && names.includes(node.declaration.id.name)
      }
      return false
    }
    return false
  })

  res.program.body = filteredBody

  return transformFromAstSync(res, code, {
    configFile: false,
  })?.code
}

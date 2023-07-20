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

  if (!options) {
    return code
  }

  const { names, excludeNames } = options

  if (!names && !excludeNames) {
    return code
  }

  const shouldInclude = (identifierName: string) => {
    if (names) {
      return names.includes(identifierName)
    } else if (excludeNames) {
      return !excludeNames.includes(identifierName)
    }
    return true
  }

  const filteredBody = res.program.body.filter(node => {
    if (isTSInterfaceDeclaration(node) || isTSTypeAliasDeclaration(node)) {
      return isIdentifier(node.id) && shouldInclude(node.id.name)
    }
    if (isImportDeclaration(node)) {
      node.specifiers = node.specifiers.filter(s => {
        return isImportSpecifier(s) && isIdentifier(s.imported) && shouldInclude(s.imported.name)
      })

      if (node.specifiers.length === 0) {
        return false
      }

      return true
    }

    if (isExportNamedDeclaration(node)) {
      if (isTSInterfaceDeclaration(node.declaration) || isTSTypeAliasDeclaration(node.declaration)) {
        return isIdentifier(node.declaration.id) && shouldInclude(node.declaration.id.name)
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

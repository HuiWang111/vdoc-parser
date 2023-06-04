import { readFile } from 'fs/promises'
import { parse as babelParse } from '@babel/parser'
import doctrine from 'doctrine'
import {
  parseCommentTags,
  parseExport,
  parseComponentOptions,
} from './parsers'
import type { ParsedResult, Options } from './types'

export function parse(code: string, {
  exportType = 'named'
}: Options = {
  exportType: 'named'
}) {
  const res = babelParse(code, {
    sourceType: 'module',
    plugins: [
      'typescript'
    ]
  })
  
  const parsed: ParsedResult[] = []
  res.comments?.forEach(c => {
    const endLine = c.loc?.end.line
    if (endLine) {
      const ast = doctrine.parse(`/*${c.value}\n*/`, { unwrap: true })
      const options = parseExport(res.program.body, exportType)
      const propInfo = options
        ? parseComponentOptions(options, endLine)
        : undefined
      const commentInfo = parseCommentTags(ast.tags)
      
      if (propInfo) {
        parsed.push({
          name: propInfo.name,
          type: commentInfo.type || propInfo.type,
          description: commentInfo.description,
          default: commentInfo.default,
        })
      }
    }
  })
  
  return parsed
}

export async function parseFile(filePath: string, options: Options) {
  return parse(await readFile(filePath, 'utf8'), options)
}

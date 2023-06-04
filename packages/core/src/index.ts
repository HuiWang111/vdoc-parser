import { readFile } from 'fs/promises'
import { extname } from 'path'
import { parse as babelParse } from '@babel/parser'
import doctrine from 'doctrine'
import {
  parseCommentTags,
  parseExport,
  parseComponentOptions,
  parseSfcContent,
} from './parsers'
import type { ParsedResult, Options } from './types'

const legalExtsReg = /\.(vue|ts|tsx|js|jsx)$/
const vueExtReg = /\.vue$/

export function parse(code: string, {
  exportType = 'default'
}: Options = {
  exportType: 'default'
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

export async function parseFile(filePath: string, options?: Options) {
  if (!legalExtsReg.test(filePath)) {
    return Promise.reject(new Error(`Unexcept file extension: ${extname(filePath)}`))
  }

  const source = await readFile(filePath, 'utf8')

  if (vueExtReg.test(filePath)) {
    const script = parseSfcContent(source)
    console.log(script)
    if (script) {
      return parse(script, options)
    }
  }

  return parse(source, options)
}

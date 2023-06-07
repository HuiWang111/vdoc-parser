import { readFile } from 'fs/promises'
import fs from 'fs'
import { extname } from 'path'
import { parse as babelParse } from '@babel/parser'
import doctrine from 'doctrine'
import {
  parseCommentTags,
  parseExport,
  parseComponentOptions,
  parseSfc,
  parseSetupScript,
  parseProps,
} from './parsers'
import type { ParsedResult, Options, InternalOptions, BuiltinResult } from './types'

const legalExtsReg = /\.(vue|ts|tsx|js|jsx)$/
const vueExtReg = /\.vue$/

export function parse(code: string, {
  exportType = 'default',
  exportName,
  type = 'component',
  setup = false,
}: InternalOptions = {
  exportType: 'default',
  type: 'component',
  setup: false,
}) {
  const res = babelParse(code, {
    sourceType: 'module',
    plugins: [
      'typescript',
    ]
  })
  
  const parsed: ParsedResult[] = []
  res.comments?.forEach(c => {
    const endLine = c.loc?.end.line
    if (endLine) {
      const ast = doctrine.parse(`/*${c.value}\n*/`, { unwrap: true })
      let propInfo: Pick<BuiltinResult, 'name' | 'type' | 'default'> | undefined
      
      if (setup) {
        propInfo = parseSetupScript(res.program.body, endLine)
      } else {
        if (type === 'props') {
          const props = parseExport(res.program.body, exportType, type, exportName)
          
          if (props) {
            propInfo = parseProps(props, endLine)
          }
        } else if (type === 'component') {
          // 这里遵循一个文件只写一个组件的原则，不支持通过 exportName 查找导出的组件
          const options = parseExport(res.program.body, exportType, type)
          propInfo = options
            ? parseComponentOptions(options, endLine)
            : undefined
        } else {
          throw new Error('Unknow parseType:' + type)
        }
      }

      const commentInfo = parseCommentTags(ast.tags)
      
      if (propInfo) {
        parsed.push({
          name: propInfo.name,
          type: commentInfo.type || propInfo.type,
          description: commentInfo.description,
          default: commentInfo.default || propInfo.default,
          version: commentInfo.version || '',
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
    const script = parseSfc(source)
    
    if (script) {
      return parse(script.content, {
        ...options,
        setup: script.setup,
      })
    }
  }

  return parse(source, options)
}

export function parseFileSync(filePath: string, options?: Options) {
  if (!legalExtsReg.test(filePath)) {
    return Promise.reject(new Error(`Unexcept file extension: ${extname(filePath)}`))
  }

  const source = fs.readFileSync(filePath, 'utf8')

  if (vueExtReg.test(filePath)) {
    const script = parseSfc(source)
    
    if (script) {
      return parse(script.content, {
        ...options,
        setup: script.setup,
      })
    }
  }

  return parse(source, options)
}

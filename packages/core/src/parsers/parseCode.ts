import { parse as babelParse } from '@babel/parser'
import doctrine from 'doctrine'
import { isEventProp, lowerFirst } from '../utils'
import { parseCommentTags } from './parseCommentTags'
import { parseExport } from './parseExport'
import { parseComponentOptions } from './parseComponentOptions'
import { parseSetupScript } from './parseSetupScript'
import { parseProps } from './parseProps'
import type { ParsedResult, InternalOptions, BuiltinResult } from '../types'

export function parseCode(code: string, {
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
      'jsx',
    ]
  })
  
  const parsed: ParsedResult[] = []
  res.comments?.forEach(c => {
    const endLine = c.loc?.end.line
    if (endLine) {
      const ast = doctrine.parse(`/*${c.value}\n*/`, { unwrap: true })
      let propInfo: Pick<BuiltinResult, 'name' | 'type' | 'default' | 'required'> | undefined
      
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
      
      if (propInfo) {
        const commentInfo = parseCommentTags(ast.tags)
        const isEvent = isEventProp(propInfo)

        parsed.push({
          name: isEvent
            ? lowerFirst(propInfo.name.replace(/^on/, ''))
            : propInfo.name,
          type: commentInfo.type || propInfo.type,
          description: commentInfo.description,
          default: commentInfo.default || propInfo.default,
          version: commentInfo.version || '',
          required: propInfo.required,
          isEvent,
        })
      }
    }
  })
  
  return parsed
}
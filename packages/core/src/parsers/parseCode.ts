import { parse as babelParse } from '@babel/parser'
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
}): ParsedResult[] {
  const res = babelParse(code, {
    sourceType: 'module',
    plugins: [
      'typescript',
      'jsx',
    ]
  })
  
  let propInfo: Array<BuiltinResult> | undefined
  
  if (setup) {
    propInfo = parseSetupScript(res.program.body)
  } else {
    if (type === 'props') {
      const props = parseExport(res.program.body, exportType, type, exportName)
      
      if (props) {
        propInfo = parseProps(props)
      }
    } else if (type === 'component') {
      // 这里遵循一个文件只写一个组件的原则，不支持通过 exportName 查找导出的组件
      const options = parseExport(res.program.body, exportType, type)
      propInfo = options
        ? parseComponentOptions(options)
        : undefined
    } else {
      throw new Error('Unknow parseType:' + type)
    }
  }
  

  return propInfo || []
}
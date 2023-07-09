import { readFile } from 'fs/promises'
import { extname } from 'path'
import { legalExtsReg, vueExtReg } from '../constants'
import { parseSfc } from './parseSfc'
import { parseTypes } from './parseTypes'
import type { ParseTypesOptions } from '../types'

export async function parseTypesFile(filePath: string, options?: ParseTypesOptions) {
  if (!legalExtsReg.test(filePath)) {
    return Promise.reject(new Error(`[parseTypesFile] Unexcept file extension: ${extname(filePath)}`))
  }

  const source = await readFile(filePath, 'utf8')

  if (vueExtReg.test(filePath)) {
    const script = parseSfc(source)

    if (script?.lang !== 'ts') {
      return Promise.reject(new Error(`[parseTypesFile] script lang should be 'ts' in vue file`))
    }
    
    if (script) {
      return parseTypes(script.content, options)
    }
  }

  return parseTypes(source, options)
}

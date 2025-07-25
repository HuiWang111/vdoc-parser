import { readFileSync } from 'fs'
import { extname } from 'path'
import { legalExtsReg, vueExtReg } from '../constants'
import { parseSfc } from './parseSfc'
import { parseTypes } from './parseTypes'
import type { ParseTypesOptions } from '../types'

export function parseTypesFileSync(filePath: string, options?: ParseTypesOptions) {
  if (!legalExtsReg.test(filePath)) {
    throw new Error(`[parseTypesFileSync] Unexcept file extension: ${extname(filePath)}`)
  }

  const source = readFileSync(filePath, 'utf8')

  if (vueExtReg.test(filePath)) {
    const script = parseSfc(source)

    if (script?.lang !== 'ts') {
      throw new Error(`[parseTypesFileSync] script lang should be 'ts' in vue file`)
    }
    
    if (script) {
      return parseTypes(script.content, options)
    }
  }

  return parseTypes(source, options)
}

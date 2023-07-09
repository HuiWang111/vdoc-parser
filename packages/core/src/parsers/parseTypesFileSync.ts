import { readFileSync } from 'fs'
import { extname } from 'path'
import { parseTypes } from './parseTypes'
import { tsExtReg } from '../constants'
import type { ParseTypesOptions } from '../types'

export function parseTypesFileSync(filePath: string, options?: ParseTypesOptions) {
  if (!tsExtReg.test(filePath)) {
    throw new Error(`[parseTypesFile] Unexcept file extension: ${extname(filePath)}`)
  }

  const source = readFileSync(filePath, 'utf8')

  return parseTypes(source, options)
}

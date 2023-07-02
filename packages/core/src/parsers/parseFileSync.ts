import { readFileSync } from 'fs'
import { extname } from 'path'
import { legalExtsReg, vueExtReg } from '../constants'
import { parseSfc } from './parseSfc'
import { parseCode } from './parseCode'
import type { Options } from '../types'

export function parseFileSync(filePath: string, options?: Options) {
  if (!legalExtsReg.test(filePath)) {
    throw new Error(`Unexcept file extension: ${extname(filePath)}`)
  }

  const source = readFileSync(filePath, 'utf8')

  if (vueExtReg.test(filePath)) {
    const script = parseSfc(source)
    
    if (script) {
      return parseCode(script.content, {
        ...options,
        setup: script.setup,
      })
    }
  }

  return parseCode(source, options)
}
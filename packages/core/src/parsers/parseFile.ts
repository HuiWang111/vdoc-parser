import { readFile } from 'fs/promises'
import { extname } from 'path'
import { legalExtsReg, vueExtReg } from '../constants'
import { parseSfc } from './parseSfc'
import { parseCode } from './parseCode'
import type { Options } from '../types'

export async function parseFile(filePath: string, options?: Options) {
  if (!legalExtsReg.test(filePath)) {
    return Promise.reject(new Error(`[parseFile] Unexcept file extension: ${extname(filePath)}`))
  }

  const source = await readFile(filePath, 'utf8')

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
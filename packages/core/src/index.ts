import { readFile } from 'fs/promises'
import { join } from 'path'
import { parse as babelParse } from '@babel/parser'
import doctrine from 'doctrine'
import { getPropInfoByCommentEndLine } from './utils'
import type { ParsedResult } from './types'

parseByFile(join(process.cwd(), 'src/test.tsx')).then(parsed => {
  console.log(parsed)
})

export function parse(code: string) {
  const res = babelParse(code, {
    sourceType: 'module',
  })
  
  const parsed: ParsedResult[] = []
  res.comments?.forEach(c => {
    const endLine = c.loc?.end.line
    if (endLine) {
      const ast = doctrine.parse(`/*${c.value}\n*/`, { unwrap: true })
      const info = getPropInfoByCommentEndLine(res.program.body, endLine)
      const parsedProperties = ast.tags.reduce<Record<string, string>>((acc, tag) => {
        if (tag.title === 'type' && tag.type?.type === 'RecordType') {
          for (const field of tag.type.fields) {
            // @ts-expect-error
            if (field.type === 'FieldType' && field.value?.type === 'StringLiteralType') {
              acc[tag.title] = (field.value as any).value
              break;
            }
          }
        } else {
          acc[tag.title] = tag.description || ''
        }
        return acc
      }, {})
      
      if (info) {
        parsed.push({
          name: info.name,
          type: parsedProperties.type || info.type,
          description: parsedProperties.description,
          default: parsedProperties.default,
        })
      }
    }
  })

  return parsed
}

export async function parseByFile(filePath: string) {
  const code = await readFile(filePath, 'utf8')

  return parse(code)
}

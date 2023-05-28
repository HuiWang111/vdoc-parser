import { readFile } from 'fs/promises'
import { join } from 'path'
import { parse } from '@babel/parser'
import doctrine from 'doctrine'
import { getPropNameByCommentEndLine } from './utils'
import type { ParseResult } from './types'

main()
async function main() {
  const code = await readFile(join(process.cwd(), 'src/test.tsx'), 'utf8')

  const res = parse(code, {
    sourceType: 'module'
  })
  
  const parsed: ParseResult[] = []
  res.comments?.forEach(c => {
    const endLine = c.loc?.end.line
    if (endLine) {
      const ast = doctrine.parse(`/*${c.value}\n*/`, { unwrap: true })
      const name = getPropNameByCommentEndLine(res.program.body, endLine)
      const parsedProperties = ast.tags.reduce<Record<string, string>>((acc, tag) => {
        acc[tag.title] = tag.description || ''
        return acc
      }, {})

      if (name) {
        parsed.push({
          name,
          properties: {
            description: parsedProperties['description'],
            default: parsedProperties['default'],
          }
        })
      }
    }
  })

  console.log(parsed)
}

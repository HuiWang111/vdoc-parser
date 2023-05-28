import type { Statement, ExportDefaultDeclaration, ExportNamedDeclaration, ObjectExpression } from '@babel/types'

export function getPropNameByCommentEndLine(
  statements: Statement[],
  endLine: number,
) {
  const component = statements.find(s => ['ExportNamedDeclaration', 'ExportDefaultDeclaration'].includes(s.type)) as (
    ExportNamedDeclaration | ExportDefaultDeclaration
  )
  let propName: string | undefined

  if (component.declaration?.type === 'VariableDeclaration') {
    component.declaration.declarations.forEach(d => {
      const { init } = d

      if (init?.type === 'CallExpression') {
        if ((init.callee as any).name === 'defineComponent') {
          const { arguments: args } = init

          args.forEach(arg => {
            if (arg.type === 'ObjectExpression') {
              const { properties } = arg

              properties.forEach(prop => {
                if (prop.type === 'ObjectProperty' && (prop.key as any).name === 'props') {
                  const { properties: props } = prop.value as ObjectExpression

                  props.forEach(p => {
                    if (p.type === 'ObjectProperty' && p.loc?.start.line === endLine + 1) {
                      propName = (p.key as any).name
                    }
                  })
                }
              })
            }
          })
        }
      }
    })
  }

  return propName
}
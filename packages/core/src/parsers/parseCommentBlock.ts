import doctrine from 'doctrine'
import type { CommentBlock } from '@babel/types'

export function parseCommentBlock(comment: CommentBlock) {
  const { tags } = doctrine.parse(`/*${comment.value}*/`, { unwrap: true })
  
  return tags.reduce<Record<string, string>>((acc, tag) => {
    acc[tag.title] = tag.description || ''
    return acc
  }, {})
}
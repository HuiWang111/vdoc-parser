import type { Tag } from 'doctrine'

export function parseCommentTags(tags: Tag[]): Record<string, string> {
  return tags.reduce<Record<string, string>>((acc, tag) => {
    acc[tag.title] = tag.description || ''
    return acc
  }, {})
}
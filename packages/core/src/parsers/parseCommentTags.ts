import type { Tag } from 'doctrine'

export function parseCommentTags(tags: Tag[]): Record<string, string> {
  return tags.reduce<Record<string, string>>((acc, tag) => {
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
}
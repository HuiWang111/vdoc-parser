import { parse } from '@vue/compiler-sfc'

export function parseSfcContent(source: string) {
  const sfcDescriptor = parse({
    source,
  })

  if (sfcDescriptor.scriptSetup) {
    // TODO
  }
  if (sfcDescriptor.script) {
    return sfcDescriptor.script.content
  }
}
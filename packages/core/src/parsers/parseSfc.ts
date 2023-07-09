import { parse } from '@vue/compiler-sfc'
import type { SfcResult } from '../types'

export function parseSfc(source: string): SfcResult | undefined {
  const sfcDescriptor = parse({
    source,
  })

  if (sfcDescriptor.scriptSetup) {
    return {
      content: sfcDescriptor.scriptSetup.content,
      setup: true,
      lang: sfcDescriptor.scriptSetup.lang,
    }
  }
  if (sfcDescriptor.script) {
    return {
      content: sfcDescriptor.script.content,
      setup: false,
      lang: sfcDescriptor.script.lang
    }
  }
}
export const typesCode = `
import type { VNode, VNodeData } from 'vue'

interface A {
  name: string;
  node: VNode;
}

export interface B {
  age: number;
}

type C = string | number

export type D = C & number;`.trim()

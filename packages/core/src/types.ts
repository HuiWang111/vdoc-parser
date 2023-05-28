export interface ParseResult<T extends Record<string, string> = {}> {
  name: string;
  properties: {
    description: string;
    default: string;
  } & T
}
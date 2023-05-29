export interface ParseResult<T extends Record<string, string> = {}> {
  name: string;
  type: string;
  properties: {
    description: string;
    default: string;
  } & T
}

export type StatementExportType = 'ExportNamedDeclaration' | 'ExportDefaultDeclaration';

export type ExportType = 'named' | 'default';

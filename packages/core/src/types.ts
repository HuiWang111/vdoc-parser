export interface BuiltinResult {
  name: string;
  type: string;
  description: string;
  default: string;
}

export type ParsedResult<T extends Record<string, string> = {}> = BuiltinResult & T

export type StatementExportType = 'ExportNamedDeclaration' | 'ExportDefaultDeclaration';

export type ExportType = 'named' | 'default';

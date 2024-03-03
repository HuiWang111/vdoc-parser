import type {
  ExportDefaultDeclaration,
  ExportNamedDeclaration,
} from '@babel/types'

export interface BuiltinResult {
  name: string;
  type: string;
  description: string;
  default: string;
  version: string;
  required: 'true' | 'false';
}

export type ParsedResult<T extends Record<string, string> = {}> = BuiltinResult & T

export type StatementExportType = 'ExportNamedDeclaration' | 'ExportDefaultDeclaration';

export type ExportType = 'named' | 'default';

export type ParseType = 'component' | 'props';

export type StatementExportDeclaration = ExportNamedDeclaration | ExportDefaultDeclaration;

export interface Options {
  exportType?: ExportType;
  exportName?: string;
  type?: ParseType;
}

export interface InternalOptions extends Options {
  setup?: boolean;
}

export interface SfcResult {
  content: string;
  setup: boolean;
  lang?: string;
}

export interface ParseTypesOptions {
  names?: string[];
  excludeNames?: string[];
}

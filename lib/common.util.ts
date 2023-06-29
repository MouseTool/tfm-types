import {
  anyExportable,
  booleanExportable,
  ExportableType,
  FunctionExportable,
  integerExportable,
  LiteralExportable,
  nullExportable,
  numberExportable,
  stringExportable,
  tableExportable,
} from "./export-types";

/**
 * Mappings from known LuaHelp types to corresponding Exportable.
 */
export const luaHelpTypeToExportable: Record<string, ExportableType> = {
  String: stringExportable,
  Int: integerExportable,
  Number: numberExportable,
  Boolean: booleanExportable,
  Table: tableExportable,
  // Blank anonymous function
  Function: new FunctionExportable(),
  Object: anyExportable,
};

/**
 * Describes a generic type which has a documented description.
 */
export interface IDocFuncType {
  type: ExportableType;
  description: string;
  additionalDescription: string[];

  setDescription(description: string): void;
  addDescription(desc: string): void;
  setType(type: ExportableType): void;
}

/**
 * Describes a parameter which has a documented description.
 */
export interface IDocFuncParam extends IDocFuncType {
  name: string;
  /**
   * The overriden name to export instead of `name`
   */
  overrideName?: string;
  get displayName(): string;

  setOverrideName(name: string): void;
}

/**
 * Describes a doc function that can be altered.
 */
export interface IDocFunc {
  params: Map<string, IDocFuncParam>;

  addParam(param: IDocFuncParam): this;
  setDescription(description: string | string[]): void;
  pushDescription(description: string): this;
}

/**
 * Batch utility function for param quick fixups.
 */
export function fixParam<T extends IDocFunc>(
  lfnc: T,
  replace: [name: string, desc?: string, overrideName?: string][]
) {
  for (const [name, desc, overrideName] of replace) {
    const par = lfnc.params.get(name);
    if (desc) par.setDescription(desc);
    if (overrideName) par.setOverrideName(overrideName);
  }
}

/**
 * Batch utility function for param fixups.
 */
export function forParams<
  T extends IDocFunc,
  S = T["params"] extends Map<infer _, infer V extends IDocFuncParam>
    ? V
    : never
>(lfunc: T, handlers: [paramName: string, callback: (par: S) => void][]) {
  for (const [name, cb] of handlers) {
    cb(lfunc.params.get(name) as S);
  }
}

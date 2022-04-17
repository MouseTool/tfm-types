import { DocFunc, DocFuncParam, DocFuncType } from "./doc-helpers";

/**
 * Represents a LuaDoc (sumneko) type or a TypeScript type.
 */
export interface ExportableType {
  asLua: () => string;
  asTs: () => string;
}

/**
 * Represents literal type strings across Lua and TS that are the same !
 */
export class LiteralExportable implements ExportableType {
  constructor(private literal: string) {}
  asLua() {
    return this.literal;
  }
  asTs() {
    return this.literal;
  }
}

/**
 * Represents a type that exports Lua and TS independently of each other
 */
export class IndependentLiteralExportable implements ExportableType {
  constructor(private op: { lua: string; ts: string }) {}
  asLua() {
    return this.op.lua;
  }
  asTs() {
    return this.op.ts;
  }
}

export class FunctionExportable extends DocFunc implements ExportableType {
  constructor(parameters?: DocFuncParam[], returnType?: DocFuncType) {
    super(null, null, parameters, returnType);
  }
  asLua() {
    return this.exportLuaFuncType();
  }
  asTs() {
    return this.exportTsFuncType();
  }
}

export class InterfaceExportable implements ExportableType {
  constructor(private intf: { key: string; valueType: ExportableType }[]) {}

  asLua() {
    return `{ ${this.intf
      .map(({ key, valueType }) => `${key}: ${valueType.asLua()}`)
      .join(", ")} }`;
  }

  asTs() {
    return `{ ${this.intf
      .map(({ key, valueType }) => `${key}: ${valueType.asTs()}`)
      .join(", ")} }`;
  }
}

export class RecordExportable implements ExportableType {
  constructor(
    private keyType: ExportableType,
    private valueType: ExportableType
  ) {}
  asLua() {
    return `table<${this.keyType.asLua()}, ${this.valueType.asLua()}>`;
  }
  asTs() {
    return `Record<${this.keyType.asTs()}, ${this.valueType.asTs()}>`;
  }
}

export const stringExportable = new LiteralExportable("string");
export const numberExportable = new LiteralExportable("number");
export const booleanExportable = new LiteralExportable("boolean");
export const anyExportable = new LiteralExportable("any");
export const nullExportable = new IndependentLiteralExportable({
  lua: "nil",
  ts: "null",
});
export const integerExportable = new IndependentLiteralExportable({
  lua: "integer",
  ts: "tfm.integer",
});
export const tableExportable = new IndependentLiteralExportable({
  lua: "table",
  ts: "object",
});

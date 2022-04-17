import {
  LuaHelpFunction,
  LuaHelpFunctionParameter,
  LuaHelpFunctionReturn,
} from "./functions.interfaces";

class LuaHelpFunctionParameterExporter {
  public description: string;
  public additionalDescription: string[];
  public defaultValue?: string;

  constructor(
    public name: string,
    public type: string,
    description: string = ""
  ) {
    this.additionalDescription = [];

    // Strip away the default value
    const m = description.match(/(.*?)\s*\(default (.*?)\)\s*$/m);
    if (m != null) {
      const [_, strippedDesc, defaultVal] = m;
      this.description = strippedDesc;
      this.defaultValue = defaultVal;
    } else {
      this.description = description;
    }
  }

  get isOptional() {
    return this.defaultValue != null;
  }

  addDescription(desc: string) {
    this.additionalDescription.push(desc);
  }

  export() {
    return {
      name: this.name,
      type: this.type,
      description: this.description,
      additionalDescriptions: this.additionalDescription,
      default: this.defaultValue,
    } as LuaHelpFunctionParameter;
  }
}

class LuaHelpFunctionExporter {
  public description: string[];
  public params: Map<string, LuaHelpFunctionParameterExporter>;
  public returnType?: LuaHelpFunctionReturn;

  constructor(public name: string) {
    this.description = [];
    this.params = new Map<string, LuaHelpFunctionParameterExporter>();
    this.returnType = null;
  }

  addParam(param: LuaHelpFunctionParameterExporter) {
    this.params.set(param.name, param);
  }

  pushDescription(description: string) {
    this.description.push(description);
  }

  setReturnType(type: LuaHelpFunctionReturn) {
    this.returnType = type;
  }

  export() {
    return {
      name: this.name,
      description: this.description,
      parameters: (() => Array.from(this.params.values(), (p) => p.export()))(),
      return: this.returnType,
    } as LuaHelpFunction;
  }
}

const FUNC_START_REGEX = /^([a-zA-Z0-9.]+?)\(.*\)$/m;
const FUNC_PARAM_REGEX = /^ {2}([a-zA-Z0-9]+) \(([a-zA-Z0-9]+)\) ([^\n]+)$/;
const FUNC_RETURNS_REGEX = /^Returns \(([a-zA-Z0-9]+)\) ([^\n]+)$/;

export default function functionsParser(lines: string[]) {
  const funcs: LuaHelpFunctionExporter[] = [];
  let currentFunc: LuaHelpFunctionExporter | null = null;
  let currentParam: LuaHelpFunctionParameterExporter | null = null;

  const endParam = () => {
    if (currentParam) {
      currentFunc.addParam(currentParam);
    }
    currentParam = null;
  };

  const endFunc = () => {
    if (currentFunc) {
      funcs.push(currentFunc);
    }
    currentFunc = null;
  };

  for (const line of lines) {
    if (line.length == 0) continue;
    let m = FUNC_START_REGEX.exec(line);
    if (m !== null) {
      // save curr
      endParam();
      endFunc();
      currentFunc = new LuaHelpFunctionExporter(m[1]);
    } else if (currentFunc !== null) {
      if (line.startsWith(" ".repeat(4))) {
        // param desc cont
        currentParam.addDescription(line);
      } else if ((m = FUNC_PARAM_REGEX.exec(line))) {
        endParam();
        currentParam = new LuaHelpFunctionParameterExporter(m[1], m[2], m[3]);
      } else if ((m = FUNC_RETURNS_REGEX.exec(line))) {
        currentFunc.setReturnType({
          description: m[2],
          type: m[1],
        });
      } else {
        currentFunc.pushDescription(line);
      }
    }
  }

  endParam();
  endFunc();

  return (() => Array.from(funcs, (p) => p.export()))();
}

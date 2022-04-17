import { LuaHelpEvent, LuaHelpEventParameter } from "./events.interfaces";

class LuaHelpEventParameterExporter {
  public additionalDescription: string[];

  constructor(
    public name: string,
    public type: string,
    public description: string = ""
  ) {
    this.additionalDescription = [];
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
    } as LuaHelpEventParameter;
  }
}

class LuaHelpEventExporter {
  public description: string[];
  public additionalDescription: string[];
  public params: Map<string, LuaHelpEventParameterExporter>;

  constructor(public name: string) {
    this.description = [];
    this.params = new Map<string, LuaHelpEventParameterExporter>();
  }

  addParam(param: LuaHelpEventParameterExporter) {
    this.params.set(param.name, param);
  }

  pushDescription(description: string) {
    this.description.push(description);
  }

  export() {
    return {
      name: this.name,
      description: this.description,
      parameters: (() => Array.from(this.params.values(), (p) => p.export()))(),
    } as LuaHelpEvent;
  }
}

const FUNC_START_REGEX = /^([a-zA-Z0-9.]+?)\(.*\)$/m;
const FUNC_PARAM_REGEX = /^ {2}([a-zA-Z0-9]+) \(([a-zA-Z0-9]+)\) ([^\n]+)$/;

export default function eventsParser(lines: string[]) {
  const events: LuaHelpEventExporter[] = [];
  let currentEvent: LuaHelpEventExporter | null = null;
  let currentParam: LuaHelpEventParameterExporter | null = null;

  const endParam = () => {
    if (currentParam) {
      currentEvent.addParam(currentParam);
    }
    currentParam = null;
  };

  const endFunc = () => {
    if (currentEvent) {
      events.push(currentEvent);
    }
    currentEvent = null;
  };

  for (const line of lines) {
    if (line.length == 0) continue;
    let m = FUNC_START_REGEX.exec(line);
    if (m !== null) {
      // save curr
      endParam();
      endFunc();
      currentEvent = new LuaHelpEventExporter(m[1]);
    } else if (currentEvent !== null) {
      if (line.startsWith(" ".repeat(4))) {
        // param desc cont
        currentParam.addDescription(line);
      } else if ((m = FUNC_PARAM_REGEX.exec(line))) {
        endParam();
        currentParam = new LuaHelpEventParameterExporter(m[1], m[2], m[3]);
      } else {
        currentEvent.pushDescription(line);
      }
    }
  }

  endParam();
  endFunc();

  return (() => Array.from(events, (p) => p.export()))();
}

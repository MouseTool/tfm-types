export interface LuaHelpFunctionParameter {
  name: string;
  description: string;
  /**
   * Additional descriptions, each being defined as texts per line, after `description`.
   */
  // TODO: Seems that all additional descriptions have "-" before them in each line... should we strip that away?
  additionalDescriptions?: string[];
  type: string;
  default?: string;
}

export interface LuaHelpFunctionReturn {
  description: string;
  type: string;
}

export interface LuaHelpFunction {
  name: string;
  /**
   * The description of the event, each string representing a line of description.
   */
  description: string[];
  parameters: LuaHelpFunctionParameter[];
  return?: LuaHelpFunctionReturn;
}

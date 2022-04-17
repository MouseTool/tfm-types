/** @noSelfInFile */

// Extra function overrides aside the generated ones.

declare namespace tfm {
  namespace exec {
    /**
     * @deprecated Use {@link ui.setMapName}.
     */
    const setUIMapName: typeof ui.setMapName;
    /**
     * @deprecated Use {@link ui.setShamanName}.
     */
    const setUIShamanName: typeof ui.setShamanName;
    /**
     * @deprecated Use {@link system.bindKeyboard}.
     */
    const bindKeyboard: typeof system.bindKeyboard;
  }
}

declare namespace system {
  // Generic typing for args
  function newTimer<TArg1, TArg2, TArg3, TArg4>(
    callback: (
      this: void,
      timerId: tfm.integer,
      arg1?: TArg1,
      arg2?: TArg2,
      arg3?: TArg3,
      arg4?: TArg4
    ) => void,
    time: tfm.integer,
    loop?: boolean,
    arg1?: TArg1,
    arg2?: TArg2,
    arg3?: TArg3,
    arg4?: TArg4
  ): tfm.integer;
}

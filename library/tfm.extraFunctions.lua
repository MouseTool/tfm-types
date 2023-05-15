--- @meta

--- Returns a string with a traceback of the call stack. The optional message string is appended at the beginning of the traceback.
---
--- [View documents](command:extension.lua.doc?["en-US/52/manual.html/pdf-debug.traceback"])
--- @param message? any
--- @param level?   integer
--- @return string  message
function debug.traceback(message, level) end

--- Sets the map name.
--- @param text string the text to display as the map name
--- @deprecated
--- @see ui.setMapName
function tfm.exec.setUIMapName(text) end

--- Sets the shaman name. This function is **deprecated**, see `ui.setShamanName`.
--- @param text string the text to display as the shaman name
--- @deprecated
--- @see ui.setShamanName
function tfm.exec.setUIShamanName(text) end

--- Listens to the player's keyboard events. This function is **deprecated**, see `system.bindKeyboard`.
--- @param playerName string the player you want to listen keyboard events from
--- @param keyCode integer the code of the key you want to listen
---     - to accurately listen for player movement (both arrows and wasd/zqsd keys), you can use 0 (left), 1 (up), 2 (right) or 3 (down)
---     - regular AS3 keycodes can be found on http://help.adobe.com/fr_FR/FlashPlatform/reference/actionscript/3/flash/ui/Keyboard.html
--- @param down boolean whether it should listen for the press event, or the release one
--- @param activate boolean whether it should be active (default true)
--- @deprecated
--- @see system.bindKeyboard
function tfm.exec.bindKeyboard(playerName, keyCode, down, activate) end

--- Returns a string or a table containing date and time, formatted according to the given string `format`.
--- [View documents](command:extension.lua.doc?["en-us/52/manual.html/pdf-os.date"])
--- @param format? string
--- @param time? integer time in milliseconds
--- @return string|tfm.osdate
function os.date(format, time) end

--- Returns the difference, in milliseconds, from time `t1` to time `t2`.
--- [View documents](command:extension.lua.doc?["en-us/52/manual.html/pdf-os.difftime"])
--- @param t2 integer time in milliseconds
--- @param t1 integer time in milliseconds
--- @return integer @time in milliseconds
function os.difftime(t2, t1) end

--- Returns the current time when called without arguments, or a time representing the local date and time specified by the given table.
--- [View documents](command:extension.lua.doc?["en-us/52/manual.html/pdf-os.time"])
--- @param date? tfm.osdate
--- @return integer @time in milliseconds
function os.time(date) end

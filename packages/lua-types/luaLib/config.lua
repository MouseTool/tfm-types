
name    = 'Transformice'

-- Suggest this library when it matches "tfm.x"
words   = {'tfm%.%w+'}

configs = {
    {
        key    = 'Lua.runtime.version',
        action = 'set',
        value  = 'Lua 5.2',
    },

    -- We need to allow reading through node_modules
    {
        key    = 'Lua.workspace.useGitIgnore',
        action = 'set',
        value  = false,
    },
}

-- Disable the following builtins
for _, builtin in ipairs({
    "io",
    "debug",
    "os",
}) do
    configs[#configs+1] = {
        key    = 'Lua.runtime.builtin',
        action = 'prop',
        prop   = builtin,
        value  = 'disable',
    }
end

-- Add the following runtime paths
for _, path in ipairs({
    "node_modules/?.lua",
    "node_modules/?/init.lua",
    "node_modules/?/?.lua"
}) do
    configs[#configs+1] = {
        key    = 'Lua.runtime.path',
        action = 'add',
        value  = path,
    }
end

-- Add the following globals
for _, global in ipairs({
    "tfm",
    "ui",
    "system"
}) do
    configs[#configs+1] = {
        key    = 'Lua.diagnostics.globals',
        action = 'add',
        value  = global,
    }
end

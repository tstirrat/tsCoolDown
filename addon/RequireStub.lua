local preloadFns = {}
local modules = {}
local function ends_with(str, ending)
  return ending == "" or str:sub(-#ending) == ending
end

function tstl_register_module(name, exportFn)
  preloadFns[name] = exportFn
end

function require(name)
  if ends_with(name, "@wartoshika.wow-declarations") then
    return _G
  end
  if (modules[name]) then
    return modules[name]
  end

  if (preloadFns[name]) then
    modules[name] = preloadFns[name]()
    return modules[name]
  else
    error('Module not preloaded: ' .. name)
  end
end

tstl_register_module(
  'lualib_bundle',
  function()
    return {}
  end
)

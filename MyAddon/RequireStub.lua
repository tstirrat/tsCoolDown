local preloadFns = {}
local modules = {}

function tstl_register_module(name, exportFn)
  preloadFns[name] = exportFn
end

function require(name)
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

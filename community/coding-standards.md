---
id: coding-standards
title: Coding Standards and Style Guide
sidebar_position: 8
---

# Coding Standards and Style Guide

This document outlines the coding standards and style guidelines for code examples in the Don't Starve Together API Documentation. Following these standards ensures consistency and readability across all code examples.

## Lua Coding Standards

### Naming Conventions

- **Variables**: Use `snake_case` for variable names
  ```lua title="variable_naming.lua"
  local player_position = Vector3(0, 0, 0)
  local health_component = inst.components.health
  ```

- **Functions**: Use `snake_case` for function names
  ```lua title="function_naming.lua"
  local function update_player_position()
      -- Function body
  end
  ```

- **Constants**: Use `UPPER_SNAKE_CASE` for constants
  ```lua title="constants.lua"
  local MAX_HEALTH = 100
  local DEFAULT_DAMAGE = TUNING.SPEAR_DAMAGE
  ```

- **Component References**: Use full names, not abbreviations
  ```lua title="component_references.lua"
  -- Good
  local health = inst.components.health
  
  -- Avoid
  local hlth = inst.components.health
  ```

### Formatting

- **Indentation**: Use 4 spaces for indentation (not tabs)
  ```lua title="indentation.lua"
  function SomeFunction()
      if condition then
          DoSomething()
      end
  end
  ```

- **Line Length**: Keep lines under 80 characters when possible
  ```lua title="line_length.lua"
  -- Break long lines
  local very_long_function_call = SomeFunctionWithManyParameters(
      parameter1,
      parameter2,
      parameter3
  )
  ```

- **Spacing**: Use spaces around operators and after commas
  ```lua title="spacing.lua"
  local x = 1 + 2
  local items = {1, 2, 3}
  ```

### Comments

- **Function Documentation**: Document parameters and return values
  ```lua title="function_docs.lua"
  -- Calculates damage with modifiers
  -- @param base_damage: Base damage amount
  -- @param target: Target entity
  -- @return Modified damage value
  local function calculate_damage(base_damage, target)
      -- Function body
  end
  ```

- **Inline Comments**: Use for explaining non-obvious code
  ```lua title="inline_comments.lua"
  local value = x * 2 -- Double the value for scaling
  ```

- **TODO Comments**: Mark incomplete or future work
  ```lua title="todo_comments.lua"
  -- TODO: Add support for custom damage types
  ```

### Best Practices

- **Local Variables**: Prefer local variables over global ones
  ```lua title="local_variables.lua"
  -- Good
  local function MyFunction()
      local counter = 0
  end
  
  -- Avoid
  function MyFunction()
      counter = 0  -- Global variable!
  end
  ```

- **Error Handling**: Include error handling in examples
  ```lua title="error_handling.lua"
  if inst.components.health ~= nil then
      inst.components.health:SetMaxHealth(100)
  else
      print("Entity missing health component")
  end
  ```

- **Performance**: Demonstrate efficient coding practices
  ```lua title="performance.lua"
  -- Good - cache component reference
  local health = inst.components.health
  health:SetMaxHealth(100)
  health:SetInvincible(true)
  
  -- Avoid - repeated lookups
  inst.components.health:SetMaxHealth(100)
  inst.components.health:SetInvincible(true)
  ```

## DST-Specific Conventions

### Component Usage

- **Component Access**: Always check if a component exists before using it
  ```lua title="component_access.lua"
  if inst.components.health ~= nil then
      inst.components.health:DoDelta(-10)
  end
  ```

- **Component Addition**: Show proper component initialization
  ```lua title="component_init.lua"
  inst:AddComponent("health")
  inst.components.health:SetMaxHealth(100)
  inst.components.health:SetPercent(1)
  ```

### Event Handling

- **Event Listeners**: Use consistent event handling patterns
  ```lua title="event_listeners.lua"
  inst:ListenForEvent("death", function(inst)
      -- Handle death event
  end)
  ```

- **Event Triggers**: Show proper event triggering
  ```lua title="event_triggers.lua"
  inst:PushEvent("customevent", {data = value})
  ```

### Network Code

- **Client/Server Distinction**: Clearly mark client and server code
  ```lua title="client_server_code.lua"
  -- Server-only code
  if TheWorld.ismastersim then
      inst:AddComponent("health")
  end
  
  -- Client-side code
  if not TheWorld.ismastersim then
      -- Handle client-side effects
  end
  ```

- **RPC Handling**: Show proper RPC usage
  ```lua title="rpc_handling.lua"
  -- Sending an RPC
  SendModRPCToServer(MOD_RPC.MyMod.MyAction, target_entity)
  
  -- Receiving an RPC
  AddModRPCHandler(MOD_RPC.MyMod.MyAction, function(player, target)
      -- Handle the RPC
  end)
  ```

## Example Formats

### Basic Component Example

```lua title="basic_component.lua"
-- Adding and configuring a component
local function SetupHealthComponent(inst)
    -- Add the component
    inst:AddComponent("health")
    
    -- Configure basic properties
    local health = inst.components.health
    health:SetMaxHealth(100)
    health:SetPercent(1)
    
    -- Configure advanced properties
    health:SetAbsorptionAmount(0.2) -- 20% damage absorption
    health:SetInvincible(false)
    
    -- Set up event handling
    inst:ListenForEvent("death", function(inst)
        -- Handle death
        print("Entity has died")
    end)
    
    return health
end
```

### Full Entity Example

```lua title="full_entity.lua"
-- Create a custom entity with multiple components
local function CreateCustomEntity()
    -- Create the base entity
    local inst = CreateEntity()
    
    -- Add required engine components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Set up animations
    inst.AnimState:SetBank("customentity")
    inst.AnimState:SetBuild("customentity")
    inst.AnimState:PlayAnimation("idle")
    
    -- Add network components
    inst:AddTag("custom_entity")
    
    -- Finalize network setup
    inst.entity:SetPristine()
    
    -- Server-only components
    if TheWorld.ismastersim then
        -- Add components
        inst:AddComponent("inspectable")
        inst:AddComponent("health")
        inst:AddComponent("combat")
        
        -- Configure components
        inst.components.health:SetMaxHealth(100)
        inst.components.combat:SetDefaultDamage(10)
        
        -- Set up event handlers
        inst:ListenForEvent("death", OnDeath)
    end
    
    return inst
end
```

## Common Mistakes to Avoid

- **Missing nil checks** for components
- **Hardcoded values** instead of using `TUNING` constants
- **Inconsistent naming** across examples
- **Insufficient comments** for complex code
- **No error handling** in examples
- **Missing network code** distinctions (client vs. server)

## Additional Resources

For more information on Lua and Don't Starve Together coding conventions:

- [Lua Style Guide](http://lua-users.org/wiki/LuaStyleGuide)
- [Klei Entertainment Modding Forum](https://forums.kleientertainment.com/forums/forum/79-dont-starve-together-beta-modding/)

By following these coding standards, we ensure that code examples in the documentation are consistent, readable, and demonstrate best practices for Don't Starve Together modding. 
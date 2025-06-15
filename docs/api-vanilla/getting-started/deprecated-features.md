---
id: deprecated-features
title: Deprecated Features and Alternatives
sidebar_position: 8
last_updated: 2023-07-06
---

# Deprecated Features and Alternatives

This document catalogs deprecated features in the Don't Starve Together API and provides recommended alternatives. Using these alternatives will help ensure your mods remain compatible with future game updates.

## What is Deprecation?

When a feature is marked as "deprecated," it means:

1. The feature still works in the current version
2. The feature may be removed or significantly changed in future versions
3. There is usually a newer, preferred alternative

Using deprecated features in your mods may cause them to break when the game updates.

## Global Functions

### GetPlayer()

**Status**: Deprecated since the introduction of multiplayer

**Alternative**: Use `ThePlayer` global variable or iterate through `AllPlayers`

```lua
-- Deprecated
local player = GetPlayer()

-- Preferred (for local client's player)
local player = ThePlayer

-- Preferred (for all players)
for i, player in ipairs(AllPlayers) do
    -- Do something with each player
end
```

### GetWorld()

**Status**: Deprecated since the introduction of sharded worlds

**Alternative**: Use `TheWorld` global variable

```lua
-- Deprecated
local world = GetWorld()

-- Preferred
local world = TheWorld
```

### GetClock()

**Status**: Deprecated since the state system was introduced

**Alternative**: Use `TheWorld.state` properties

```lua
-- Deprecated
local time = GetClock():GetTotalTime()

-- Preferred
local time = TheWorld.state.time
local phase = TheWorld.state.phase -- "day", "dusk", or "night"
local cycles = TheWorld.state.cycles -- day count
```

## Component Properties

### health.maxhealth (direct access)

**Status**: Deprecated in favor of getter/setter methods

**Alternative**: Use `GetMaxHealth()` and `SetMaxHealth()`

```lua
-- Deprecated
local max_health = inst.components.health.maxhealth
inst.components.health.maxhealth = 150

-- Preferred
local max_health = inst.components.health:GetMaxHealth()
inst.components.health:SetMaxHealth(150)
```

### combat.damage (direct access)

**Status**: Deprecated in favor of getter/setter methods

**Alternative**: Use `GetDefaultDamage()` and `SetDefaultDamage()`

```lua
-- Deprecated
local damage = inst.components.combat.damage
inst.components.combat.damage = 20

-- Preferred
local damage = inst.components.combat:GetDefaultDamage()
inst.components.combat:SetDefaultDamage(20)
```

### sleeper.hibernate

**Status**: Removed in recent versions

**Alternative**: Use `SetHibernate()` method

```lua
-- Deprecated
inst.components.sleeper.hibernate = true

-- Preferred
inst.components.sleeper:SetHibernate(true)
```

## Component Methods

### container:Open() (without parameters)

**Status**: Deprecated in favor of specifying the opener

**Alternative**: Use `container:Open(opener)` with the opener entity

```lua
-- Deprecated
inst.components.container:Open()

-- Preferred
inst.components.container:Open(doer)
```

### inventory:GiveItem() (without slot parameter)

**Status**: Deprecated in favor of specifying slot or drop position

**Alternative**: Use `inventory:GiveItem(item, slot, pos)`

```lua
-- Deprecated
inst.components.inventory:GiveItem(item)

-- Preferred (specific slot)
inst.components.inventory:GiveItem(item, nil) -- nil means any slot

-- Preferred (with drop position if inventory is full)
inst.components.inventory:GiveItem(item, nil, inst:GetPosition())
```

## Events

### "daycomplete"

**Status**: Deprecated in favor of more specific events

**Alternative**: Use "cycleschanged" or "phasechanged" events

```lua
-- Deprecated
inst:ListenForEvent("daycomplete", OnDayComplete)

-- Preferred
inst:ListenForEvent("cycleschanged", OnNewDay)
inst:ListenForEvent("phasechanged", OnPhaseChanged)
```

## Network Variables

### net_string:value (direct access)

**Status**: Deprecated in favor of getter/setter methods

**Alternative**: Use `Get()` and `Set()` methods

```lua
-- Deprecated
local value = net_var:value
net_var:value = "new_value"

-- Preferred
local value = net_var:Get()
net_var:Set("new_value")
```

## Animation Functions

### AnimState:SetBank() and AnimState:SetBuild() (separate calls)

**Status**: Not officially deprecated, but less efficient

**Alternative**: Use `AnimState:SetBankAndBuild()`

```lua
-- Less efficient
inst.AnimState:SetBank("wilson")
inst.AnimState:SetBuild("wilson")

-- More efficient
inst.AnimState:SetBankAndBuild("wilson", "wilson")
```

## Prefab Functions

### MakePlacer (old signature)

**Status**: Deprecated in favor of new signature with more options

**Alternative**: Use updated MakePlacer with additional parameters

```lua
-- Deprecated
MakePlacer("placer_name", "bank", "build", "anim")

-- Preferred
MakePlacer("placer_name", "bank", "build", "anim", nil, nil, nil, nil, nil, nil, nil, nil, nil)
```

## Minimap Icons

### minimap.MiniMapEntity:SetIcon()

**Status**: Deprecated in favor of atlas-based system

**Alternative**: Use `minimap.MiniMapEntity:SetPriority()` and atlas system

```lua
-- Deprecated
inst.MiniMapEntity:SetIcon("mini_icon.tex")

-- Preferred
inst.MiniMapEntity:SetIcon("mini_icon.tex")
inst.MiniMapEntity:SetPriority(5)
AddMinimapAtlas("images/map_icons/mini_icon.xml")
```

## UI Functions

### Widget:SetPosition() with separate x,y,z

**Status**: Deprecated in favor of Vector3

**Alternative**: Use `Widget:SetPosition()` with Vector3

```lua
-- Deprecated
widget:SetPosition(100, 200, 0)

-- Preferred
widget:SetPosition(Vector3(100, 200, 0))
```

## Migration Strategies

When dealing with deprecated features, consider these strategies:

### Feature Detection

Check if the newer alternative exists before using it:

```lua
if inst.components.sleeper.SetHibernate ~= nil then
    -- New method exists
    inst.components.sleeper:SetHibernate(true)
else
    -- Fall back to old property
    inst.components.sleeper.hibernate = true
end
```

### Wrapper Functions

Create functions that abstract away API differences:

```lua
local function SetHibernate(sleeper, value)
    if sleeper.SetHibernate ~= nil then
        sleeper:SetHibernate(value)
    else
        sleeper.hibernate = value
    end
end

-- Usage
SetHibernate(inst.components.sleeper, true)
```

### Conditional Execution

Only use certain features if they're available:

```lua
-- Check if feature exists before using
if TheWorld.state ~= nil then
    -- Use new state system
    local is_day = TheWorld.state.isday
else
    -- Use old clock system
    local is_day = GetClock():IsDay()
end
```

## Testing for Deprecated Features

To identify deprecated features in your mod:

1. **Check Console Warnings**: The game often logs warnings when deprecated features are used
2. **Review Release Notes**: Klei sometimes mentions deprecations in update notes
3. **Test on Beta Branches**: Test your mod on beta branches to catch deprecations early
4. **Community Resources**: Check forums and Discord for community-identified deprecations

## Conclusion

Staying aware of deprecated features and updating your mods to use the recommended alternatives will help ensure your mods remain compatible with future game updates. When in doubt, prefer newer API methods and always implement fallback behavior when possible. 

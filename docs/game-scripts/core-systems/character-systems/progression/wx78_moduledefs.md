---
id: wx78-moduledefs
title: WX78 Module Definitions
description: System for defining and managing WX-78 character upgrade modules including health, sanity, speed, and special ability modules
sidebar_position: 3

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# WX78 Module Definitions

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `wx78_moduledefs` module provides a comprehensive system for defining and managing upgrade modules for the WX-78 character. It includes module definitions, creature scan data, and the infrastructure for adding new modules to extend WX-78's capabilities.

## Usage Example

```lua
-- Get all module definitions
local wx78_moduledefs = require("wx78_moduledefs")
local modules = wx78_moduledefs.module_definitions

-- Add a custom module
local custom_module = {
    name = "custom_module",
    slots = 2,
    activatefn = function(inst, wx, isloading)
        -- Module activation logic
    end,
    deactivatefn = function(inst, wx)
        -- Module deactivation logic
    end
}
local netid = wx78_moduledefs.AddNewModuleDefinition(custom_module)
```

## Functions

### AddNewModuleDefinition(module_definition) {#add-new-module-definition}

**Status:** `stable`

**Description:**
Adds a new module definition to the system and assigns it a network ID for UI purposes.

**Parameters:**
- `module_definition` (table): Module definition table containing:
  - `name` (string): Module type name (without "wx78module_" prefix)
  - `slots` (number): Energy slots required for activation (1-6)
  - `activatefn` (function): Activation function with signature `(module_instance, owner_instance, isloading)`
  - `deactivatefn` (function): Deactivation function with signature `(module_instance, owner_instance)`
  - `extra_prefabs` (table, optional): Additional prefabs to import alongside the module

**Returns:**
- (number): Network ID for the module (used for UI purposes)

**Example:**
```lua
local heat_module = {
    name = "heat",
    slots = 3,
    activatefn = function(inst, wx, isloading)
        wx.components.temperature.mintemp = wx.components.temperature.mintemp + TUNING.WX78_MINTEMPCHANGEPERMODULE
        wx.components.temperature.maxtemp = wx.components.temperature.maxtemp + TUNING.WX78_MINTEMPCHANGEPERMODULE
    end,
    deactivatefn = function(inst, wx)
        wx.components.temperature.mintemp = wx.components.temperature.mintemp - TUNING.WX78_MINTEMPCHANGEPERMODULE
        wx.components.temperature.maxtemp = wx.components.temperature.maxtemp - TUNING.WX78_MINTEMPCHANGEPERMODULE
    end
}
local netid = AddNewModuleDefinition(heat_module)
```

### GetModuleDefinitionFromNetID(netid) {#get-module-definition-from-netid}

**Status:** `stable`

**Description:**
Retrieves a module definition table by its network ID.

**Parameters:**
- `netid` (number): The network ID of the module

**Returns:**
- (table|nil): Module definition table, or nil if not found

**Example:**
```lua
local module_def = GetModuleDefinitionFromNetID(5)
if module_def then
    print("Module name:", module_def.name)
    print("Slots required:", module_def.slots)
end
```

### AddCreatureScanDataDefinition(prefab_name, module_name, maxdata) {#add-creature-scan-data-definition}

**Status:** `stable`

**Description:**
Associates a creature prefab with a module type and scan data for the WX-78 scanner functionality.

**Parameters:**
- `prefab_name` (string): The prefab name of the scannable creature
- `module_name` (string): The module type produced by scanning (without "wx78module_" prefix)
- `maxdata` (number, optional): Maximum scan data that builds up on the prefab (default: 1)

**Example:**
```lua
-- Spider creatures provide maxhealth module data
AddCreatureScanDataDefinition("spider", "maxhealth", 2)

-- Lightning goats provide taser module data  
AddCreatureScanDataDefinition("lightninggoat", "taser", 5)
```

### GetCreatureScanDataDefinition(prefab_name) {#get-creature-scan-data-definition}

**Status:** `stable`

**Description:**
Retrieves scan data information for a creature prefab.

**Parameters:**
- `prefab_name` (string): The prefab name to look up

**Returns:**
- (table|nil): Table with `maxdata` and `module` fields, or nil if not found

**Example:**
```lua
local scan_data = GetCreatureScanDataDefinition("spider")
if scan_data then
    print("Max data:", scan_data.maxdata)  -- 2
    print("Module:", scan_data.module)     -- "maxhealth"
end
```

## Built-in Module Definitions

### Health Modules

#### maxhealth
- **Slots:** 1
- **Effect:** Increases maximum health by `TUNING.WX78_MAXHEALTH_BOOST`
- **Scan Sources:** spider (2 data)

#### maxhealth2  
- **Slots:** 2
- **Effect:** Increases maximum health by `TUNING.WX78_MAXHEALTH_BOOST * TUNING.WX78_MAXHEALTH2_MULT`
- **Scan Sources:** spider_healer (4 data)

### Sanity Modules

#### maxsanity1
- **Slots:** 1
- **Effect:** Increases maximum sanity by `TUNING.WX78_MAXSANITY1_BOOST`
- **Scan Sources:** butterfly (1 data), moonbutterfly (1 data)

#### maxsanity
- **Slots:** 2
- **Effect:** Increases maximum sanity and adds dapperness bonus
- **Scan Sources:** crawlinghorror (3 data), terrorbeak (3 data), nightmarebeak (6 data), oceanhorror (3 data), ruinsnightmare (8 data)

### Movement Modules

#### movespeed
- **Slots:** 6
- **Effect:** Stacking movement speed increase
- **Scan Sources:** rabbit (2 data)

#### movespeed2
- **Slots:** 2
- **Effect:** Alternative movement speed increase
- **Scan Sources:** minotaur (6 data), rook (3 data), rook_nightmare (3 data)

### Temperature Modules

#### heat
- **Slots:** 3
- **Effect:** Increases temperature tolerance, improves drying rate
- **Scan Sources:** firehound (4 data), dragonfly (10 data)

#### cold
- **Slots:** 3
- **Effect:** Decreases temperature sensitivity to heat
- **Scan Sources:** icehound (4 data), deerclops (10 data)

### Utility Modules

#### nightvision
- **Slots:** 4
- **Effect:** Provides night vision (caves: always, surface: night only, not full moon)
- **Scan Sources:** mole (4 data)

#### taser
- **Slots:** 2
- **Effect:** Electric retaliation damage when attacked, insulation from electricity
- **Scan Sources:** lightninggoat (5 data)

#### light
- **Slots:** 3
- **Effect:** Provides light source, stacks for increased radius
- **Scan Sources:** squid (6 data), worm (6 data), lightflier (6 data)

### Hunger Modules

#### maxhunger1
- **Slots:** 1
- **Effect:** Increases maximum hunger by `TUNING.WX78_MAXHUNGER1_BOOST`
- **Scan Sources:** hound (2 data)

#### maxhunger
- **Slots:** 2
- **Effect:** Increases maximum hunger and reduces hunger drain rate
- **Scan Sources:** bearger (6 data), slurper (3 data)

### Special Modules

#### music
- **Slots:** 3
- **Effect:** Provides sanity aura, tends nearby farm plants, plays music
- **Scan Sources:** crabking (8 data), hermitcrab (4 data)

#### bee
- **Slots:** 3
- **Effect:** Passive health regeneration plus maxsanity benefits
- **Scan Sources:** beequeen (10 data)

## Module System Architecture

### Module Lifecycle

1. **Definition**: Modules are defined with activation/deactivation functions
2. **Registration**: `AddNewModuleDefinition()` assigns network IDs
3. **Scanning**: Creatures can be scanned to acquire module data
4. **Activation**: Modules activate when installed and powered
5. **Deactivation**: Modules deactivate when removed or unpowered

### Network ID System

- Network IDs range from 1 to 63 (limited by `player_classified.upgrademodules`)
- Each module gets a unique ID for client-server communication
- IDs are assigned sequentially during registration

### Scan Data System

The scan data system links creatures to modules:

```lua
-- Example scan data entry
scandata_definitions["spider"] = {
    maxdata = 2,        -- Maximum data points from this creature
    module = "maxhealth" -- Module type produced
}
```

## Common Usage Patterns

### Creating Custom Modules

```lua
-- Define the module
local custom_module = {
    name = "my_custom_module",
    slots = 2,
    activatefn = function(inst, wx, isloading)
        -- Add effects when activated
        if wx.components.hunger ~= nil then
            wx.components.hunger.burnratemodifiers:SetModifier(inst, 0.5)
        end
    end,
    deactivatefn = function(inst, wx)
        -- Remove effects when deactivated
        if wx.components.hunger ~= nil then
            wx.components.hunger.burnratemodifiers:RemoveModifier(inst)
        end
    end,
    extra_prefabs = { "custom_fx" }
}

-- Register the module
local netid = AddNewModuleDefinition(custom_module)

-- Add scan sources
AddCreatureScanDataDefinition("my_creature", "my_custom_module", 3)
```

### Stacking Modules

Some modules like `movespeed` and `light` support stacking:

```lua
-- Movement speed modules track count
local function movespeed_activate(inst, wx)
    wx._movespeed_chips = (wx._movespeed_chips or 0) + 1
    wx.components.locomotor.runspeed = TUNING.WILSON_RUN_SPEED * 
        (1 + TUNING.WX78_MOVESPEED_CHIPBOOSTS[wx._movespeed_chips + 1])
end
```

### Loading Considerations

Module activation functions receive an `isloading` parameter:

```lua
local function maxhealth_activate(inst, wx, isloading)
    if wx.components.health ~= nil then
        local current_health_percent = wx.components.health:GetPercent()
        wx.components.health.maxhealth = wx.components.health.maxhealth + amount
        
        if not isloading then
            -- Only update UI/effects when not loading from save
            wx.components.health:SetPercent(current_health_percent)
        end
    end
end
```

## Related Modules

- [Components System](./components.md): Module effects often modify character components
- [Tuning](./tuning.md): Configuration values for module effects
- [Prefabs](../prefabs/index.md): WX-78 prefab implementation

---
id: wx78_moduledefs
title: Wx78 Moduledefs
description: Registers and manages WX-78 modules and their associated scan definitions, defining activation/deactivation behavior for gameplay buffs and effects.
tags: [wx78, module, system]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: cf27888c
system_scope: entity
---

# Wx78 Moduledefs

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`wx78_moduledefs` serves as the central registry for WX-78 modules and their corresponding scanable creature definitions in Don't Starve Together. It defines how modules alter the behavior of the WX-78 character (via activation and deactivation callbacks) and maps scanable creatures to module types and required scan data amounts. This file is responsible for bootstrapping all module behaviors that are later applied when modules are installed in WX-78's interface.

## Usage example
```lua
-- Define a custom module with activation and deactivation effects
local my_module = {
    name = "custommod",
    slots = 2,
    activatefn = function(inst, wx, isloading)
        wx.components.health.maxhealth = wx.components.health.maxhealth + 20
        wx.components.health:SetPercent(wx.components.health:GetPercent())
    end,
    deactivatefn = function(inst, wx)
        wx.components.health.maxhealth = wx.components.health.maxhealth - 20
        wx.components.health:SetPercent(wx.components.health:GetPercent())
    end
}

-- Register the module and obtain its network ID
local netid = AddNewModuleDefinition(my_module)

-- Register scan data for a creature (e.g., "mymonster")
AddCreatureScanDataDefinition("mymonster", "custommod", 5)
```

## Dependencies & tags
**Components used:** `health`, `hunger`, `sanity`, `sanityaura`, `temperature`, `moisture`, `playerspeedmult`, `inventory`, `farmplanttendable`, `combat`, `health`, `weapon`, `projectile`  
**Tags:** None identified (does not modify entity tags directly).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `module_definitions` | table | Empty table | Internal list of all module definition tables. Populated at load time. |
| `scandata_definitions` | table | Empty table | Maps prefab names to `{maxdata, module}` entries for scanner UI. |
| `module_netid` | number | `1` | Auto-incrementing network ID counter for module definitions. |
| `module_netid_lookup` | table | Empty table | Maps `module_netid` (number) to module definition table. |

## Main functions
### `AddCreatureScanDataDefinition(prefab_name, module_name, maxdata)`
*   **Description:** Registers a creature prefab as scannable for a specific module type. Calling this with a repeated `prefab_name` overwrites the prior entry.
*   **Parameters:** 
    *   `prefab_name` (string) - Name of the prefab (e.g., `"spider"`) to scan.
    *   `module_name` (string) - Module type name (without `"wx78module_"` prefix, e.g., `"maxhealth"`).
    *   `maxdata` (number?) - Maximum data amount required for scanning; defaults to `1`.
*   **Returns:** Nothing.

### `GetCreatureScanDataDefinition(prefab_name)`
*   **Description:** Retrieves scan data configuration for a given creature prefab, if registered.
*   **Parameters:** `prefab_name` (string) - Prefab name to look up.
*   **Returns:** `{maxdata = number, module = string}` or `nil` if not registered.

### `AddNewModuleDefinition(module_definition)`
*   **Description:** Registers a module definition, assigning it a unique network ID (`module_netid`) and storing it in the lookup table. Called automatically for all entries in `module_definitions` at the end of the file.
*   **Parameters:** 
    *   `module_definition` (table) - Must contain `name`, `slots`, `activatefn`, and `deactivatefn`. May include `extra_prefabs`.
    *   *Signature for `activatefn`:* `(module_instance, owner_instance, isloading: boolean)`
    *   *Signature for `deactivatefn`:* `(module_instance, owner_instance)`
*   **Returns:** `module_netid` (number) - Unique network identifier for UI communication.
*   **Error states:** Asserts if `module_netid >= 64`, indicating a limit must be lifted in network sync.

### `GetModuleDefinitionFromNetID(netid)`
*   **Description:** Looks up a module definition by its network ID.
*   **Parameters:** `netid` (number?) - The network ID previously returned by `AddNewModuleDefinition`.
*   **Returns:** Module definition table or `nil` if `netid` is invalid/unregistered.

## Events & listeners
*   **Listens to:** 
    * `blocked` — Taser module listens for blocked attacks to trigger electric反弹.
    * `attacked` — Taser module listens for direct attacks to trigger electric反弹.
    * World state changes: `isnight`, `isfullmoon` — Nightvision module watches to toggle forced night vision.
*   **Pushes:** None directly. Module activation/deactivation may trigger side effects via component callbacks (e.g., `healthdelta`, `health` updates), but this file itself does not fire events via `inst:PushEvent`.
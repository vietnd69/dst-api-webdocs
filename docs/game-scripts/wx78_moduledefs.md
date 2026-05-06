---
id: wx78_moduledefs
title: Wx78 Moduledefs
description: Defines WX78 character upgrade module configurations, scan data mappings, and registration functions for circuit-based character progression.
tags: [wx78, modules, character, progression]
sidebar_position: 10
last_updated: 2026-04-22
build_version: 722832
change_status: stable
category_type: root
source_hash: b996145b
system_scope: player
---

# Wx78 Moduledefs

> Based on game build **722832** | Last updated: 2026-04-22

## Overview
`wx78_moduledefs.lua` is a data configuration file that defines all WX78 character upgrade modules and their associated behaviors. It establishes module definitions with activation/deactivation callbacks, maps creature prefabs to scannable module types, and provides registration functions for adding new modules. This file does not attach to entities as a component; instead, it is required by other systems to resolve module configurations and scan data during WX78 character progression.

## Usage example
```lua
local WX78ModuleDefs = require("prefabs/wx78_moduledefs")

-- Access module definitions array
local modules = WX78ModuleDefs.module_definitions
print(#modules) -- Total number of registered modules

-- Get module definition by net ID
local def = WX78ModuleDefs:GetModuleDefinitionFromNetID(1)
print(def.name) -- Module type name

-- Add custom scan data definition
WX78ModuleDefs:AddCreatureScanDataDefinition("custom_creature", "maxhealth", 5)
```

## Dependencies & tags
**External dependencies:**
- `prefabs/wx78_common` -- Required for shared WX78 utility functions (e.g., `CanSpinUsingItem`)

**Components used:**
None identified (this is a data config file, not a component)

**Tags:**
None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `module_definitions` | table | `[]` | Array of module definition tables. Each entry is a module definition record with the following fields: |
| `module_definitions.name` | string | `---` | Module type name without "wx78module_" prefix |
| `module_definitions.type` | CIRCUIT_BARS enum | `---` | Circuit bar type: ALPHA/BETA/GAMMA |
| `module_definitions.slots` | number | `---` | Energy slots required to activate the module |
| `module_definitions.activatefn` | function | `---` | Callback when module activates: `function(module_inst, owner_inst, isloading)` |
| `module_definitions.deactivatefn` | function | `---` | Callback when module deactivates: `function(module_inst, owner_inst)` |
| `module_definitions.extra_prefabs` | table | `---` | Optional list of additional prefabs to import (e.g., fx prefabs) |
| `module_definitions.scannable_prefabs` | table | `---` | Optional list of creature prefabs that can be scanned for this module |
| `module_definitions.client_activatefn` | function | `---` | Optional client-side activation callback |
| `module_definitions.client_deactivatefn` | function | `---` | Optional client-side deactivation callback |
| `module_definitions.addedtoownerfn` | function | `---` | Optional callback when module is added to owner |
| `module_definitions.removedfromownerfn` | function | `---` | Optional callback when module is removed from owner |
| `module_definitions.overridebank` | string | `---` | Optional override bank for the chip in-world |
| `module_definitions.overridebuild` | string | `---` | Optional override build for the chip in-world |
| `module_definitions.overrideminiuibuild` | string | `---` | Optional override build for the ui mini chip on the status |
| `module_definitions.overrideuibuild` | string | `---` | Optional override build for the ui chip when inspecting chips |

## Main functions
### `AddCreatureScanDataDefinition(prefab_name, module_name, maxdata, recipename)`
* **Description:** Registers a creature prefab to produce a specific module type when scanned. Calling with an existing prefab name overwrites the prior entry.
* **Parameters:**
  - `prefab_name` -- string prefab name of the scannable object in the world
  - `module_name` -- string module type name (without "wx78module_" prefix)
  - `maxdata` -- number maximum data buildup on the scannable prefab (default `1`)
  - `recipename` -- string optional recipe name association
* **Returns:** None
* **Error states:** None

### `AddSpecialCreatureScanDataDefinition(id, checkfn, module_name, maxdata)`
* **Description:** Registers a special scan instance that uses a custom function to determine if the scan applies (e.g., creatures with specific masks or conditions).
* **Parameters:**
  - `id` -- string unique identifier for this special scan type
  - `checkfn` -- function that receives entity and returns boolean to validate scan applicability
  - `module_name` -- string module type name produced by the scan
  - `maxdata` -- number maximum data buildup (default `1`)
* **Returns:** None
* **Error states:** None

### `GetCreatureScanDataDefinition(ent_or_id)`
* **Description:** Retrieves module and data information for a given creature prefab or entity. Supports string prefab names or entity instances.
* **Parameters:**
  - `ent_or_id` -- string prefab name or entity instance to look up
* **Returns:** `{ maxdata, module, recipename }` table and the resolved prefab ID string, or `nil` if not found
* **Error states:** None

### `AddNewModuleDefinition(module_definition)`
* **Description:** Registers a new module definition table and assigns it a unique net ID for UI and network synchronization. Maximum 64 modules supported.
* **Parameters:**
  - `module_definition` -- table containing name, type, slots, activatefn, deactivatefn, and optional fields (extra_prefabs, overridebank, etc.)
* **Returns:** number assigned net ID for the module
* **Error states:** Errors if `module_netid >= 64` (assertion failure — requires updating `player_classified.upgrademodulebars`)

### `GetModuleDefinitionFromNetID(netid)`
* **Description:** Retrieves the module definition table associated with a given net ID.
* **Parameters:**
  - `netid` -- number module net ID to look up
* **Returns:** Module definition table or `nil` if not found
* **Error states:** None

## Events & listeners
**Listens to:**
None (this file defines callbacks that other systems listen to; it does not register listeners itself)

**Pushes:**
None (events are pushed by module activation callbacks, not by this configuration file directly)
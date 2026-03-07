---
id: wx78_modules
title: Wx78 Modules
description: Creates and configures Wx78 modular components for the DST game, including animation, inventory, network, and usage management.
tags: [modular, inventory, network, combat, prefab]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 492b4dd3
system_scope: entity
---

# Wx78 Modules

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wx78_modules.lua` is a prefab generator that defines and returns Wx78 upgrade modules as configurable Prefab instances. It uses module definitions from `wx78_moduledefs.lua` to instantiate entities with appropriate animations, inventory physics, and component behaviors. Key components include `inventoryitem`, `upgrademodule`, and `finiteuses`, with custom activation/deactivation/removal callbacks. The module enforces client-server separation: server-side logic (including component setup) only runs on the master simulation.

## Usage example
```lua
local module_prefabs = require("prefabs/wx78_modules")
-- Assumes module_definitions have been loaded from wx78_moduledefs.lua
-- Prefabs are returned as unpacked values:
--   local module1 = module_prefabs[1]
--   local module2 = module_prefabs[2]
```

## Dependencies & tags
**Components used:** `finiteuses`, `upgrademodule`, `inventoryitem`, `inspectable`  
**Tags:** None identified.

## Properties
No public properties. Module data is encapsulated in the closure of `MakeModule` and passed via `data` parameter.

## Main functions
### `MakeModule(data)`
*   **Description:** Constructs and returns a Prefab for a single Wx78 module based on `data`. It configures the entity's animation state, physics, and components including network sync, inventory, and usage tracking.
*   **Parameters:** `data` (table) - Contains module configuration:
    * `name` (string) — Animation name and part of prefab name (`wx78module_` + `name`)
    * `slots` (number) — Number of module slots required (affects floating behavior)
    * `extra_prefabs` (table, optional) — List of additional prefabs to include
    * `activatefn`, `deactivatefn` (functions) — Callbacks for `upgrademodule` lifecycle events
    * `module_netid` (string) — Client-side identifier stored as `_netid`
*   **Returns:** `Prefab` — The constructed prefab.
*   **Error states:** None identified.

### `on_module_removed(inst)`
*   **Description:** Callback executed when a module is removed from its owner. Decrements finite uses and triggers depletion logic.
*   **Parameters:** `inst` (Entity instance) — The module instance being removed.
*   **Returns:** Nothing.
*   **Error states:** If `finiteuses` component is missing, the function does nothing.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.
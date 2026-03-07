---
id: armor_lavaarena
title: Armor Lavaarena
description: Defines and registers multiple armor prefabs for the Lava Arena event with specific builds, tags, and footstep sounds.
tags: [loot, event, armor, prefabs, lavaarena]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 91ce92e7
system_scope: entity
---

# Armor Lavaarena

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`armor_lavaarena` is a prefab factory script that generates multiple armor item prefabs for the Lava Arena seasonal event. It defines a helper function `MakeArmour` that creates individual armor prefabs with configurable build names, tags, and foley sound assets. The script registers ten armor variants across different tiers (light, medium, heavy, and Season 2 variants), each with associated asset definitions and initialization logic. This script does not define a runtime component; instead, it returns prefab constructors suitable for registration in the game's prefabs system.

## Usage example
```lua
-- This script is loaded by the game engine and should not be manually invoked.
-- Example of how armor prefabs are referenced internally:
local armor = "lavaarena_armorheavy"
if TheWorld:HasPrefab(armor) then
    local entity = SpawnPrefab(armor)
    if entity ~= nil then
        -- Entity is a fully initialized armor prefab
        print(entity.prefab .. " spawned successfully")
    end
end
```

## Dependencies & tags
**Components used:** None (uses core engine services `CreateEntity`, `MakeInventoryPhysics`, `AnimState`, `Transform`, `Network`; no DST components are added)
**Tags:** Adds `"hide_percentage"` to every armor; additionally adds per-armor tags like `"grass"`, `"wood"`, `"marble"`, `"heavyarmor"`, `"ruins"`, `"metal"` depending on variant.

## Properties
No public properties — this is a prefab factory script returning prefabs, not an instance-based component.

## Main functions
### `MakeArmour(name, data)`
* **Description:** Constructs and returns a prefab definition for a specific armor variant using provided configuration data.
* **Parameters:**
  * `name` (string) — Unique prefab name (e.g., `"lavaarena_armorheavy"`).
  * `data` (table) — Configuration table containing:
    * `build` (string) — Animation bank/build name (e.g., `"armor_heavy"`).
    * `tags` (table of strings) — Tags to apply to the entity.
    * `foleysound` (string) — Path to footstep sound asset.
    * `prefabs` (table) — Optional list of dependencies passed to `Prefab()`.
* **Returns:** A `Prefab` instance ready for registration or spawning.
* **Error states:** Returns early on clients in non-master simulation mode without calling `master_postinit`.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None directly; delegates server-side post-initialization to `event_server_data("lavaarena", "prefabs/armor_lavaarena").master_postinit(inst, name, data.build)` when running on the master simulation.
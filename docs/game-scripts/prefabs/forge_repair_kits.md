---
id: forge_repair_kits
title: Forge Repair Kits
description: Creates consumable item prefabs that provide repair materials for the Forge component when used.
tags: [crafting, repair, item]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 714e5eaa
system_scope: crafting
---

# Forge Repair Kits

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`forge_repair_kits.lua` defines prefabs for consumable repair kits (`lunarplant_kit`, `voidcloth_kit`, `wagpunkbits_kit`) used in the Forge. Each kit acts as a stackable item that supplies a specific repair material when applied to a broken object via the `forgerepair` component. It integrates with the `stackable`, `forgerepair`, `inspectable`, and `inventoryitem` components to support storage, usage, and repair functionality.

## Usage example
```lua
-- Example of creating and using a repair kit
local lunar_kit = "lunarplant_kit"
local entity = SpawnPrefab(lunar_kit)

-- Kit is stackable and usable with the Forge
if entity.components.forgerepair then
    local material = entity.components.forgerepair.repairmaterial
    -- material is FORGEMATERIALS.LUNARPLANT
end
```

## Dependencies & tags
**Components used:** `stackable`, `forgerepair`, `inspectable`, `inventoryitem`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_specialinfo` | string or `nil` | `"LUNARPLANTKIT"` or `"VOIDCLOTHKIT"` | Optional identifier used for special scrapbook entry display (only for lunarplant_kit and voidcloth_kit). |

## Main functions
### `OnRepaired(inst, target, doer)`
* **Description:** Callback function executed when the kit is used to repair an object. Notifies the user (`doer`) that a repair action occurred.
* **Parameters:**
  * `inst` (Entity) — the repair kit entity itself.
  * `target` (Entity) — the object being repaired.
  * `doer` (Entity) — the entity performing the repair (typically a player).
* **Returns:** Nothing.
* **Error states:** None.

### `MakeKit(name, material)`
* **Description:** Factory function that constructs and returns a prefab for a repair kit with specified name and material.
* **Parameters:**
  * `name` (string) — the prefab name (e.g., `"lunarplant_kit"`), used for assets and tags.
  * `material` (table) — the repair material constant (e.g., `FORGEMATERIALS.LUNARPLANT`) to assign to the `forgerepair` component.
* **Returns:** A `Prefab` instance configured for use in the Forge.
* **Error states:** None.

## Events & listeners
- **Pushes:** `repair` — fired via `doer:PushEvent("repair")` when the kit successfully repairs an object.
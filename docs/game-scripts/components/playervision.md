---
id: playervision
title: Playervision
description: Manages visual effects and colour cube overrides for player vision modes including ghost, nightmare, night vision, and various equipment-based vision types.
tags: [vision, player, rendering, effects]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: components
source_hash: d3fe759c
system_scope: player
---

# Playervision

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`PlayerVision` manages visual rendering overrides for player entities, controlling colour cube transitions for different vision modes such as ghost vision, nightmare vision, and equipment-based vision effects. It tracks multiple vision states and pushes events when vision modes change, allowing other systems to respond to visual state changes. This component is essential for player entities and integrates with the inventory system to detect equipped items that grant vision abilities.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("playervision")

-- Enable ghost vision for a ghost player
inst.components.playervision:SetGhostVision(true)

-- Force night vision regardless of equipment
inst.components.playervision:ForceNightVision(true)

-- Check current vision state
if inst.components.playervision:HasNightmareVision() then
    -- Apply nightmare-specific logic
end
```

## Dependencies & tags
**External dependencies:**
- `TheWorld` -- accesses `TheWorld.state.nightmarephase` and `TheWorld.ismastersim`
- `ThePlayer` -- referenced for nutrients vision event pushing

**Components used:**
- `inventory` (replica) -- checks equipped item tags via `inst.replica.inventory:EquipHasTag()`

**Tags:**
- None identified (component checks equip tags but does not add/remove entity tags)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `ghostvision` | boolean | `false` | Whether ghost vision colour cubes are active. |
| `nightmarevision` | boolean | `false` | Whether nightmare vision colour cubes are active. |
| `nightvision` | boolean | `false` | Whether night vision is enabled via equipment. |
| `forcenightvision` | boolean | `false` | Whether night vision is forcibly enabled regardless of equipment. |
| `nonightvisioncc` | boolean | `false` | Whether to suppress night vision colour cube overrides. |
| `gogglevision` | boolean | `false` | Whether goggle vision is enabled via equipment. |
| `forcegogglevision` | boolean | `false` | Whether goggle vision is forcibly enabled. |
| `nutrientsvision` | boolean | `false` | Whether nutrients vision is enabled via equipment. |
| `forcenutrientsvision` | boolean | `false` | Whether nutrients vision is forcibly enabled. |
| `scrapmonolevision` | boolean | `false` | Whether scrap monole vision is enabled via equipment. |
| `forcescrapmonolevision` | boolean | `false` | Whether scrap monole vision is forcibly enabled. |
| `inspectaclesvision` | boolean | `false` | whether inspectacles vision is enabled via equipment. |
| `forceinspectaclesvision` | boolean | `false` | Whether inspectacles vision is forcibly enabled. |
| `roseglassesvision` | boolean | `false` | Whether rose glasses vision is enabled via equipment. |
| `forceroseglassesvision` | boolean | `false` | Whether rose glasses vision is forcibly enabled. |
| `overridecctable` | table | `nil` | Custom colour cube table override. |
| `currentcctable` | table | `nil` | Currently active colour cube table. |
| `currentccphasefn` | function | `nil` | Current colour cube phase function. |
| `blendcctable` | table | `nil` | Blend state for colour cube transitions. |
| `forcednightvisionstack` | table | `{}` | Stack of forced night vision sources with priorities. |
| `forcednightvisionambienttable` | table | `nil` | Ambient override table for forced night vision. |

## Main functions
### `HasGhostVision()`
* **Description:** Returns whether ghost vision is currently active.
* **Parameters:** None
* **Returns:** `boolean` -- true if ghost vision is enabled.
* **Error states:** None

### `HasNightmareVision()`
* **Description:** Returns whether nightmare vision is currently active.
* **Parameters:** None
* **Returns:** `boolean` -- true if nightmare vision is enabled.
* **Error states:** None

### `HasNightVision()`
* **Description:** Returns whether night vision is active, checking both equipment-based and forced states.
* **Parameters:** None
* **Returns:** `boolean` -- true if night vision or forced night vision is enabled.
* **Error states:** None

### `HasGoggleVision()`
* **Description:** Returns whether goggle vision is active, checking both equipment-based and forced states.
* **Parameters:** None
* **Returns:** `boolean` -- true if goggle vision or forced goggle vision is enabled.
* **Error states:** None

### `HasNutrientsVision()`
* **Description:** Returns whether nutrients vision is active, checking both equipment-based and forced states.
* **Parameters:** None
* **Returns:** `boolean` -- true if nutrients vision or forced nutrients vision is enabled.
* **Error states:** None

### `HasScrapMonoleVision()`
* **Description:** Returns whether scrap monole vision is active, checking both equipment-based and forced states.
* **Parameters:** None
* **Returns:** `boolean` -- true if scrap monole vision or forced scrap monole vision is enabled.
* **Error states:** None

### `HasInspectaclesVision()`
* **Description:** Returns whether inspectacles vision is active, checking both equipment-based and forced states.
* **Parameters:** None
* **Returns:** `boolean` -- true if inspectacles vision or forced inspectacles vision is enabled.
* **Error states:** None

### `HasRoseGlassesVision()`
* **Description:** Returns whether rose glasses vision is active, checking both equipment-based and forced states.
* **Parameters:** None
* **Returns:** `boolean` -- true if rose glasses vision or forced rose glasses vision is enabled.
* **Error states:** None

### `GetCCPhaseFn()`
* **Description:** Returns the current colour cube phase function.
* **Parameters:** None
* **Returns:** `function` or `nil` -- the phase function or nil if none active.
* **Error states:** None

### `GetCCTable()`
* **Description:** Returns the currently active colour cube table.
* **Parameters:** None
* **Returns:** `table` or `nil` -- the colour cube table or nil if none active.
* **Error states:** None

### `UpdateCCTable()`
* **Description:** Recalculates and updates the active colour cube table based on current vision states. Pushes `ccoverrides` and `ccphasefn` events if the table changes.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SetGhostVision(enabled)`
* **Description:** Enables or disables ghost vision. Updates colour cube table and pushes `ghostvision` event if state changes.
* **Parameters:** `enabled` -- boolean to enable or disable ghost vision.
* **Returns:** None
* **Error states:** None

### `SetNightmareVision(enabled)`
* **Description:** Enables or disables nightmare vision. Updates colour cube table and pushes `nightmarevision` event if state changes.
* **Parameters:** `enabled` -- boolean to enable or disable nightmare vision.
* **Returns:** None
* **Error states:** None

### `ForceNightVision(force)`
* **Description:** Forces night vision on or off regardless of equipment state. Only pushes `nightvision` event if not already enabled by equipment.
* **Parameters:** `force` -- boolean to force night vision on or off.
* **Returns:** None
* **Error states:** None

### `ForceNoNightVisionCC(force)`
* **Description:** Forces suppression of night vision colour cube overrides.
* **Parameters:** `force` -- boolean to enable or suppress night vision colour cubes.
* **Returns:** None
* **Error states:** None

### `PushForcedNightVision(source, priority, customcctable, blend, customambienttable, nonightvisioncc)`
* **Description:** Adds a forced night vision entry to the priority stack. Removes existing entry from same source before inserting. Updates vision state based on highest priority entry.
* **Parameters:**
  - `source` -- identifier for the force source (for removal tracking)
  - `priority` -- number priority for stack ordering (higher = more priority)
  - `customcctable` -- optional custom colour cube table
  - `blend` -- optional blend state for transitions
  - `customambienttable` -- optional ambient override table
  - `nonightvisioncc` -- optional boolean to suppress colour cubes
* **Returns:** None
* **Error states:** None

### `PopForcedNightVision(source)`
* **Description:** Removes a forced night vision entry from the stack by source. Updates vision state based on new highest priority entry or clears forced vision if stack becomes empty.
* **Parameters:** `source` -- identifier for the force source to remove.
* **Returns:** None
* **Error states:** None

### `SetForcedNightVisionAmbientOverrides(ambienttable)`
* **Description:** Sets ambient override table for forced night vision. Pushes `nightvisionambientoverrides` event if table changes.
* **Parameters:** `ambienttable` -- table of ambient overrides or nil to clear.
* **Returns:** None
* **Error states:** None

### `GetNightVisionAmbientOverrides()`
* **Description:** Returns the current forced night vision ambient override table.
* **Parameters:** None
* **Returns:** `table` or `nil` -- the ambient override table.
* **Error states:** None

### `ForceGoggleVision(force)`
* **Description:** Forces goggle vision on or off regardless of equipment state. Only pushes `gogglevision` event if not already enabled by equipment.
* **Parameters:** `force` -- boolean to force goggle vision on or off.
* **Returns:** None
* **Error states:** None

### `ForceNutrientsVision(force)`
* **Description:** Forces nutrients vision on or off regardless of equipment state. Only pushes world-level `nutrientsvision` event if inst is ThePlayer and not already enabled by equipment.
* **Parameters:** `force` -- boolean to force nutrients vision on or off.
* **Returns:** None
* **Error states:** None

### `ForceScrapMonoleVision(force)`
* **Description:** Forces scrap monole vision on or off regardless of equipment state. Only pushes `scrapmonolevision` event if not already enabled by equipment.
* **Parameters:** `force` -- boolean to force scrap monole vision on or off.
* **Returns:** None
* **Error states:** None

### `ForceInspectaclesVision(force)`
* **Description:** Forces inspectacles vision on or off regardless of equipment state. Only pushes `inspectaclesvision` event if not already enabled by equipment.
* **Parameters:** `force` -- boolean to force inspectacles vision on or off.
* **Returns:** None
* **Error states:** None

### `ForceRoseGlassesVision(force)`
* **Description:** Forces rose glasses vision on or off regardless of equipment state. Only pushes `roseglassesvision` event if not already enabled by equipment.
* **Parameters:** `force` -- boolean to force rose glasses vision on or off.
* **Returns:** None
* **Error states:** None

### `SetCustomCCTable(cctable, blend)`
* **Description:** Sets a custom colour cube table override. Updates internal state and calls `UpdateCCTable()` if table changes.
* **Parameters:**
  - `cctable` -- colour cube table or nil to clear override
  - `blend` -- optional blend state for transitions
* **Returns:** None
* **Error states:** None

## Events & listeners
- **Listens to:** `equip` -- triggers vision state update on equipment change.
- **Listens to:** `unequip` -- triggers vision state update on equipment removal.
- **Listens to:** `inventoryclosed` (client only) -- triggers vision state update when inventory closes.
- **Listens to:** `changearea` -- updates nightmare vision based on area tags.
- **Pushes:** `nightmarevision` -- fired when nightmare vision state changes.
- **Pushes:** `nightvision` -- fired when night vision state changes.
- **Pushes:** `gogglevision` -- fired when goggle vision state changes (data: `{ enabled = boolean }`).
- **Pushes:** `nutrientsvision` -- fired when nutrients vision state changes (world-level event).
- **Pushes:** `scrapmonolevision` -- fired when scrap monole vision state changes (data: `{ enabled = boolean }`).
- **Pushes:** `inspectaclesvision` -- fired when inspectacles vision state changes (data: `{ enabled = boolean }`).
- **Pushes:** `roseglassesvision` -- fired when rose glasses vision state changes (data: `{ enabled = boolean }`).
- **Pushes:** `ghostvision` -- fired when ghost vision state changes.
- **Pushes:** `ccoverrides` -- fired when colour cube table changes.
- **Pushes:** `ccphasefn` -- fired when colour cube phase function changes.
- **Pushes:** `nightvisionambientoverrides` -- fired when ambient override table changes.
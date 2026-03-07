---
id: playervision
title: Playervision
description: Manages player visual modifiers (e.g., night vision, ghost vision, nightmare vision) by controlling colour cube overrides and related events.
tags: [vision, player, lighting]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: ac22089d
system_scope: player
---

# Playervision

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Playervision` is a client-side component that manages visual states and colour-corrected lighting for the player entity. It dynamically switches between multiple vision modes (e.g., `ghostvision`, `nightvision`, `nightmarevision`, `gogglevision`) based on equipped items and world area tags, and pushes colour cube (`ccoverrides`) and phase function (`ccphasefn`) events for visual rendering.

## Usage example
```lua
local inst = ThePlayer
inst:AddComponent("playervision")

-- Activate night vision temporarily via equipment
inst:PushEvent("equip", { item = { prefabs = { "nightvision_goggles" } } })

-- Manually force night vision (e.g., from an item buff)
inst.components.playervision:ForceNightVision(true)

-- Trigger nightmare vision in ruins
inst.components.playervision:SetNightmareVision(true)

-- Clean up forced states
inst.components.playervision:ForceNightVision(false)
```

## Dependencies & tags
**Components used:** `inventory` (via `inst.replica.inventory:EquipHasTag(...)`)
**Tags:** Checks tags `nightvision`, `goggles`, `nutrientsvision`, `scrapmonolevision`, `inspectaclesvision`, `roseglassesvision`, and `Nightmare` (area tag).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `ghostvision` | boolean | `false` | Whether ghost vision is active via equipped items. |
| `nightmarevision` | boolean | `false` | Whether nightmare vision (ruins lighting) is active. |
| `nightvision` | boolean | `false` | Whether standard night vision is active via equipped items. |
| `forcenightvision` | boolean | `false` | Whether night vision is forced (e.g., via buffs). Takes precedence over `nightvision`. |
| `gogglevision` | boolean | `false` | Whether goggle vision is active via equipped items. |
| `forcegogglevision` | boolean | `false` | Whether goggle vision is forced. |
| `nutrientsvision` | boolean | `false` | Whether nutrient vision is active (ThePlayer only). |
| `forcenutrientsvision` | boolean | `false` | Whether nutrient vision is forced. |
| `scrapmonolevision` | boolean | `false` | Whether scrap monole vision is active. |
| `forcescrapmonolevision` | boolean | `false` | Whether scrap monole vision is forced. |
| `inspectaclesvision` | boolean | `false` | Whether inspectacles vision is active. |
| `forceinspectaclesvision` | boolean | `false` | Whether inspectacles vision is forced. |
| `roseglassesvision` | boolean | `false` | Whether rose glasses vision is active. |
| `forceroseglassesvision` | boolean | `false` | Whether rose glasses vision is forced. |
| `overridecctable` | table or `nil` | `nil` | Custom colour cube overrides (e.g., from stacking vision sources). |
| `currentcctable` | table or `nil` | `nil` | Current effective colour cube table (derived from active vision states). |
| `currentccphasefn` | table or `nil` | `nil` | Current phase function used for dynamic colour transitions. |
| `blendcctable` | boolean | `false` | Whether to apply blending transitions for the colour cubes. |
| `forcednightvisionstack` | array of tables | `{}` | Stack of forced night vision sources with priorities. |
| `forcednightvisionambienttable` | table or `nil` | `nil` | Ambient overrides for forced night vision (lighting adjustment). |

## Main functions
### `HasGhostVision()`
*   **Description:** Returns whether ghost vision is currently active (unforced).
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if ghost vision is active.

### `HasNightmareVision()`
*   **Description:** Returns whether nightmare vision is currently active.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if nightmare vision is active.

### `HasNightVision()`
*   **Description:** Returns whether night vision is active either normally or via force.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if either `nightvision` or `forcenightvision` is `true`.

### `HasGoggleVision()`
*   **Description:** Returns whether goggle vision is active either normally or via force.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if either `gogglevision` or `forcegogglevision` is `true`.

### `HasNutrientsVision()`
*   **Description:** Returns whether nutrient vision is active either normally or via force.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if either `nutrientsvision` or `forcenutrientsvision` is `true`.

### `HasScrapMonoleVision()`
*   **Description:** Returns whether scrap monole vision is active either normally or via force.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if either `scrapmonolevision` or `forcescrapmonolevision` is `true`.

### `HasInspectaclesVision()`
*   **Description:** Returns whether inspectacles vision is active either normally or via force.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if either `inspectaclesvision` or `forceinspectaclesvision` is `true`.

### `HasRoseGlassesVision()`
*   **Description:** Returns whether rose glasses vision is active either normally or via force.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if either `roseglassesvision` or `forceroseglassesvision` is `true`.

### `GetCCPhaseFn()`
*   **Description:** Returns the current phase function for colour cube transitions.
*   **Parameters:** None.
*   **Returns:** `table` or `nil` — The phase function table (e.g., `NIGHTVISION_PHASEFN`), or `nil` if no transition is active.

### `GetCCTable()`
*   **Description:** Returns the current effective colour cube table.
*   **Parameters:** None.
*   **Returns:** `table` or `nil` — The current `cctable`, or `nil` if no overrides are active.

### `UpdateCCTable()`
*   **Description:** Recalculates and applies the active colour cube table and phase function based on the current set of enabled vision modes. Pushes `ccoverrides` and `ccphasefn` events if changed.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetGhostVision(enabled)`
*   **Description:** Enables or disables ghost vision (unforced).
*   **Parameters:** `enabled` (boolean) — Whether to enable ghost vision.
*   **Returns:** Nothing.
*   **Error states:** No-op if `enabled` matches current state.

### `SetNightmareVision(enabled)`
*   **Description:** Enables or disables nightmare vision (used for ruins lighting).
*   **Parameters:** `enabled` (boolean) — Whether to enable nightmare vision.
*   **Returns:** Nothing.
*   **Error states:** No-op if `enabled` matches current state.

### `ForceNightVision(force)`
*   **Description:** Forces night vision state, overriding item-based `nightvision`. Typically used by temporary buffs or item abilities.
*   **Parameters:** `force` (boolean) — Whether to force night vision on.
*   **Returns:** Nothing.
*   **Error states:** No-op if `force` matches current `forcenightvision`.

### `PushForcedNightVision(source, priority, customcctable, blend, customambienttable)`
*   **Description:** Adds a forced night vision source with priority-based stacking. Replaces existing sources with the same `source` key. Applies highest-priority entry.
*   **Parameters:**  
    - `source` (string or any hashable identifier) — Unique identifier for the force source.  
    - `priority` (number) — Priority level; higher values override lower ones. Defaults to `0`.  
    - `customcctable` (table) — Optional custom colour cube overrides for this source.  
    - `blend` (boolean) — Whether to blend transitions for this source.  
    - `customambienttable` (table) — Optional ambient lighting overrides.
*   **Returns:** Nothing.

### `PopForcedNightVision(source)`
*   **Description:** Removes a specific forced night vision source. If removed source was highest priority, updates to next-highest priority or disables forced vision.
*   **Parameters:** `source` (string or any hashable identifier) — The source to remove.
*   **Returns:** Nothing.

### `SetForcedNightVisionAmbientOverrides(ambienttable)`
*   **Description:** Updates ambient lighting overrides applied when forced night vision is active.
*   **Parameters:** `ambienttable` (table or `nil`) — Ambient overrides to apply, or `nil` to clear.
*   **Returns:** Nothing.
*   **Error states:** No-op if `ambienttable` matches current ambient overrides.

### `GetNightVisionAmbientOverrides()`
*   **Description:** Returns the currently set ambient overrides for forced night vision.
*   **Parameters:** None.
*   **Returns:** `table` or `nil` — The ambient overrides table.

### `ForceGoggleVision(force)`
*   **Description:** Forces goggle vision state.
*   **Parameters:** `force` (boolean) — Whether to force goggle vision on.
*   **Returns:** Nothing.
*   **Error states:** No-op if `force` matches current `forcegogglevision`.

### `ForceNutrientVision(force)`
*   **Description:** Forces nutrient vision state (ThePlayer only).
*   **Parameters:** `force` (boolean) — Whether to force nutrient vision on.
*   **Returns:** Nothing.
*   **Error states:** No-op if `force` matches current `forcenutrientsvision`. For non-player entities, no event is pushed.

### `ForceScrapMonoleVision(force)`
*   **Description:** Forces scrap monole vision state.
*   **Parameters:** `force` (boolean) — Whether to force scrap monole vision on.
*   **Returns:** Nothing.
*   **Error states:** No-op if `force` matches current `forcescrapmonolevision`.

### `ForceInspectaclesVision(force)`
*   **Description:** Forces inspectacles vision state.
*   **Parameters:** `force` (boolean) — Whether to force inspectacles vision on.
*   **Returns:** Nothing.
*   **Error states:** No-op if `force` matches current `forceinspectaclesvision`.

### `ForceRoseGlassesVision(force)`
*   **Description:** Forces rose glasses vision state.
*   **Parameters:** `force` (boolean) — Whether to force rose glasses vision on.
*   **Returns:** Nothing.
*   **Error states:** No-op if `force` matches current `forceroseglassesvision`.

### `SetCustomCCTable(cctable, blend)`
*   **Description:** Sets a custom colour cube override table, replacing previous overrides. Updates the active cctable immediately.
*   **Parameters:**  
    - `cctable` (table or `nil`) — Custom colour cube table or `nil` to clear.  
    - `blend` (boolean) — Whether to use blending transitions.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `equip` — Updates vision states on equipment changes.  
  - `unequip` — Updates vision states on equipment removal.  
  - `inventoryclosed` — Client-only; resets vision states if inventory is closed (client-side safeguard).  
  - `changearea` — Triggers nightmare vision based on area tags (see `OnAreaChanged`).
- **Pushes:**  
  - `ccoverrides` — Sent when the active colour cube table changes.  
  - `ccphasefn` — Sent when the colour cube phase function changes.  
  - `ghostvision` — Sent when ghost vision state changes.  
  - `nightvision` — Sent when night vision state (normal or forced) changes.  
  - `gogglevision` — Sent when goggle vision state (normal or forced) changes.  
  - `nutrientsvision` — Sent when nutrient vision state changes (client-side for ThePlayer only).  
  - `scrapmonolevision` — Sent when scrap monole vision state changes.  
  - `inspectaclesvision` — Sent when inspectacles vision state changes.  
  - `roseglassesvision` — Sent when rose glasses vision state changes.  
  - `nightmarevision` — Sent when nightmare vision state changes.  
  - `nightvisionambientoverrides` — Sent when ambient overrides for forced night vision change.

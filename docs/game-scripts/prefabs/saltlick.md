---
id: saltlick
title: Saltlick
description: A durable structure that provides salt-based sustenance for creatures and players over time, supporting improved construction and repair mechanics.
tags: [structure, crafting, loot, repair]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 91f8d4f6
system_scope: entity
---

# Saltlick

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `saltlick` is a deployable structure prefab that serves as a renewable source of salt for nearby creatures and players. It supports two variants—regular and improved—and integrates with core systems including finite usage, burning, repair, and workable interactions. The component manages animations, sound effects, loot drops, and inter-entity communication when placed.

The regular variant is burnable and affected by environmental hazards, while the improved variant includes repair functionality. It primarily works with `finiteuses`, `workable`, `burnable`, `lootdropper`, and `repairable` components to handle consumption, hammering, extinguishing, and reuse.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("inspectable")
inst:AddComponent("lootdropper")
inst:AddComponent("finiteuses")
inst.components.finiteuses:SetMaxUses(5)
inst.components.finiteuses:SetUses(5)

inst:AddComponent("workable")
inst.components.workable:SetWorkAction(ACTIONS.HAMMER)
inst.components.workable:SetWorkLeft(3)

inst:ListenForEvent("percentusedchange", function(inst) print("Saltlick usage updated") end)
```

## Dependencies & tags
**Components used:** `inspectable`, `lootdropper`, `finiteuses`, `workable`, `burnable`, `repairable`, `transform`, `animstate`, `soundemitter`, `minimapentity`, `network`, `habitable`, `hauntable`
**Tags:** Adds `structure`, `saltlick`, `burnt`, `INLIMBO`; checks `saltlicker`, `INLIMBO`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `OnUsed` | function | `OnUsed` | Callback triggered on usage or usage change events. |
| `PlayIdle` | function | `PlayIdle` | Plays an idle animation based on remaining uses. |
| `GetImageNum` | function | `GetImageNum` | Computes the appropriate animation frame number. |
| `AlertNearbyCritters` | function | `AlertNearbyCritters` | Notifies nearby creatures with the `saltlicker` tag of placement. |
| `OnBuiltFn` | function | `OnBuiltFn` | Called after placement/building completes. |
| `OnFinished` | function | `OnFinished` | Triggered when uses are depleted. |
| `OnHammered` | function | `OnHammered` | Handles destruction via hammering. |
| `OnHit` | function | `OnHit` | Handles partial hits (e.g., from mining). |
| `OnBurnt` | function | `Regular_OnBurnt` | Logic for regular variant when burnt. |
| `OnSave` | function | `Regular_OnSave` | Serializes burn state. |
| `OnLoad` | function | `Regular_OnLoad` | Restores burnt state on load. |
| `repairmaterial` | string | `"SALT"` | Material required to repair the improved saltlick. |

## Main functions
### `GetImageNum(inst)`
*   **Description:** Returns the current animation frame index (`1` to `6`) based on remaining uses.
*   **Parameters:** `inst` (Entity) — the saltlick entity instance.
*   **Returns:** `string` — frame suffix (e.g., `"3"`), corresponding to animation like `"idle3"`.
*   **Error states:** None.

### `PlayIdle(inst, push)`
*   **Description:** Plays an idle animation appropriate for current use level. Skips if entity is `burnt`.
*   **Parameters:**  
    * `inst` (Entity) — the saltlick entity.  
    * `push` (boolean) — if `true`, pushes the animation onto the queue; otherwise plays immediately.
*   **Returns:** Nothing.
*   **Error states:** No effect if `burnt` tag is present.

### `AlertNearbyCritters(inst)`
*   **Description:** Scans for and notifies entities with the `saltlicker` tag that a saltlick has been placed.
*   **Parameters:** `inst` (Entity) — the saltlick entity.
*   **Returns:** Nothing.
*   **Error states:** None.

### `OnFinished(inst)`
*   **Description:** Handles finalization when all uses are depleted—resets animation to `"idle6"` and removes the `saltlick` tag.
*   **Parameters:** `inst` (Entity) — the saltlick entity.
*   **Returns:** Nothing.

### `OnHammered(inst, worker)`
*   **Description:** Destroys the saltlick upon full hammering. Extinguishes burning, drops loot, spawns debris FX, and removes the entity.
*   **Parameters:**  
    * `inst` (Entity) — the saltlick entity.  
    * `worker` (Entity) — the hammering entity.
*   **Returns:** Nothing.

### `OnHit(inst)`
*   **Description:** Handles partial hammer hits—plays hit sound and animation, then resumes idle animation.
*   **Parameters:** `inst` (Entity) — the saltlick entity.
*   **Returns:** Nothing.
*   **Error states:** Returns immediately if `burnt` tag is present.

### `Improved_OnRepaired(inst, doer)`
*   **Description:** Callback for improved saltlick repair—restores usage state, adds `saltlick` tag back, plays sound and animation.
*   **Parameters:**  
    * `inst` (Entity) — the saltlick entity.  
    * `doer` (Entity) — the repairing entity.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  * `percentusedchange` — triggers `OnUsed` callback when usage percentage changes.  
  * `burntup` (regular variant only) — triggers `OnBurnt` when burnt.
- **Pushes:**  
  * `"saltlick_placed"` — sent to all nearby entities with `saltlicker` tag.  
  * `"percentusedchange"` — pushed internally via `finiteuses` when usage changes (not directly added, but propagated).
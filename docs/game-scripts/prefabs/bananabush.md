---
id: bananabush
title: Bananabush
description: A plantable ground entity that grows through visual stages and yields cave bananas when picked, then regrows over time or resets after being dug up.
tags: [plant, growth, crop, agriculture]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ad4841c0
system_scope: world
---

# Bananabush

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`bananabush` is a static, plantable entity that models a banana plant growing in stages: empty → small → medium → tall (full). It implements growth, picking, regeneration, and digging behaviors using core DST components. It is primarily used in world generation (especially in_forest and cave entrance areas) and player gardening.

Key interactions include:
- Picking yields `cave_banana` and advances the plant toward barrenness after a set number of harvest cycles.
- Regrowth occurs automatically or manually via growth components after picking or regeneration triggers.
- Digging (via `ACTIONS.DIG`) harvests the entire plant, producing a `dug_bananabush` replantable item.
- It supports seasonal growth modifiers (`springgrowth`), withering (via `witherable`), and burns as a plant.

The component interactions rely heavily on the `growable`, `pickable`, `lootdropper`, and `witherable` components.

## Usage example
```lua
local inst = SpawnPrefab("bananabush")
-- Ensure it’s placed in world and not pristine
inst.Transform:SetPosition(x, y, z)

-- Manually start full growth if needed (e.g., after transplanting)
if inst.components.growable then
    inst.components.growable:SetStage(4)
    inst.components.growable:StartGrowing()
end
```

## Dependencies & tags
**Components used:**
- `pickable`
- `growable`
- `lootdropper`
- `workable` (if transplanting enabled)
- `inspectable`
- `witherable`
- `simplemagicgrower`

**Tags:** `bananabush`, `plant`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.components.pickable.product` | string | `"cave_banana"` | The prefab name produced when picked. |
| `inst.components.pickable.max_cycles` | number | `BANANABUSH_CYCLES + variance` | Total harvestable cycles before barrenness. |
| `inst.components.pickable.cycles_left` | number | `max_cycles` | Remaining harvest cycles. |
| `inst.components.pickable.canbepicked` | boolean | `false` | Initially `false`; set to `true` by growth state. |
| `inst.components.growable.stages` | table | `BANANABUSH_GROWTH_STAGES` | Array of growth stage definitions. |
| `inst.components.growable.stage` | number | `1` | Current stage index (1 = empty). |
| `inst.components.growable.magicgrowable` | boolean | `true` | Enables magic-based growth logic. |
| `inst.components.growable.springgrowth` | boolean | `true` | Applies spring growth speed modifiers. |
| `inst.components.growable.loopstages` | boolean | `false` | Disables looping back to stage 1 after max stage. |
| `inst.components.witherable.withered` | boolean | `false` | Whether the plant is withered. |
| `inst.components.simplemagicgrower.last_stage` | number | `4` | Last allowed stage index. |

## Main functions
### `OnDig(inst, worker)`
*   **Description:** Called when the bananabush is dug. Drops appropriate loot based on barren/withered state (twigs if barren/withered, otherwise one banana and `dug_bananabush`). Destroys the entity.
*   **Parameters:** `inst` (Entity), `worker` (Entity performing the dig).
*   **Returns:** Nothing.
*   **Error states:** Uses nil-safe checks for `pickable` and `lootdropper` components.

### `OnPicked(inst, picker)`
*   **Description:** Called when the plant is picked. Advances animation and growth state (to `empty`), and decrements harvest cycles.
*   **Parameters:** `inst` (Entity), `picker` (Entity doing the picking).
*   **Returns:** Nothing.
*   **Error states:** If barren, triggers `dead` animation and stops growth.

### `OnTransplant(inst)`
*   **Description:** Called when the bananabush is planted from an item. Immediately makes the plant barren.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `MakeEmpty(inst)`
*   **Description:** Initializes the empty growth stage for new or transplanted plants. Starts growth timer (unless `POPULATING`).
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `MakeBarren(inst, wasempty)`
*   **Description:** Marks the plant as barren. Resets to stage 1, stops growth, sets `magicgrowable = false`, and plays `dead` animation.
*   **Parameters:** `inst` (Entity), `wasempty` (boolean) — whether it was empty before becoming barren.
*   **Returns:** Nothing.

### `OnRegen(inst)`
*   **Description:** Regrowth trigger after regeneration. Resumes growth and jumps directly to stage 4 (tall/full).
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `on_load(inst, data)`
*   **Description:** Ensures withering state persists correctly on save/load. Reapplies `ForceWither` if needed.
*   **Parameters:** `inst` (Entity), `data` (table, optional) — load data from save.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None explicitly — behavior hooks are assigned via component callbacks (`onpickedfn`, `ontransplantfn`, `SetMakeEmptyFn`, etc.).
- **Pushes:** `loot_prefab_spawned` (via `lootdropper:SpawnLootPrefab`), `on_loot_dropped` (triggered on spawned loot).
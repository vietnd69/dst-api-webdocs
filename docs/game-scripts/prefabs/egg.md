---
id: egg
title: Egg
description: Prefab file defining three bird egg variants (raw, cooked, rotten) with edible, perishable, fertilizer, and tradable components for inventory and world interactions.
tags: [prefab, food, fertilizer, inventory]
sidebar_position: 10
last_updated: 2026-04-27
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 0d1dd2e3
system_scope: inventory
---

# Egg

> Based on game build **722832** | Last updated: 2026-04-27

## Overview
`egg.lua` registers three spawnable egg entity prefabs: `bird_egg` (raw), `bird_egg_cooked` (cooked), and `rottenegg` (spoiled). The `commonfn()` helper builds shared entity structure and client-side components; each variant function applies server-side gameplay components with different stats. Raw eggs can be cooked into `bird_egg_cooked` or perish directly into `rottenegg`, which functions as fertilizer and fuel. The prefab is referenced by name and instantiated with `SpawnPrefab("bird_egg")`, `SpawnPrefab("bird_egg_cooked")`, or `SpawnPrefab("rottenegg")`.

## Usage example
```lua
-- Spawn raw egg at player position:
local egg = SpawnPrefab("bird_egg")
egg.Transform:SetPosition(player.Transform:GetWorldPosition())

-- Spawn cooked egg:
local cooked = SpawnPrefab("bird_egg_cooked")

-- Spawn rotten egg (fertilizer):
local rotten = SpawnPrefab("rottenegg")

-- Prefab assets (informational only - loaded automatically, not user code):
local assets = {
    Asset("ANIM", "anim/bird_eggs.zip"),
    Asset("SCRIPT", "scripts/prefabs/fertilizer_nutrient_defs.lua"),
}
```

## Dependencies & tags
**External dependencies:**
- `prefabs/fertilizer_nutrient_defs` -- provides `FERTILIZER_DEFS` table for nutrient values on rotten eggs

**Components used:**
- `edible` -- food consumption stats (health, hunger, sanity)
- `cookable` -- enables cooking transformation (raw egg only)
- `perishable` -- spoilage timing and replacement prefab on decay
- `stackable` -- inventory stacking limit
- `bait` -- enables use as fishing bait (raw egg only)
- `inspectable` -- enables player inspection with status text
- `inventoryitem` -- enables pickup and inventory storage
- `tradable` -- enables trading with Pig King (gold/rock value)
- `floater` -- visual floating animation in water (added via `MakeInventoryFloatable` helper)
- `fertilizerresearchable` -- enables fertilizer research tracking (rotten egg only)
- `fertilizer` -- soil nutrient application (rotten egg only)
- `fuel` -- enables burning as campfire fuel (rotten egg only)

**Tags:**
- `catfood` -- added to raw and cooked eggs (Wurt can eat)
- `cookable` -- added to raw egg (enables cooking action)
- `icebox_valid` -- added to rotten egg (can be stored in icebox)
- `show_spoiled` -- added to rotten egg (displays spoiled indicator)
- `cattoy` -- added to rotten egg (Kitcoyote interaction)
- `fertilizerresearchable` -- added to rotten egg (research tracking)
- `spoiledfood` -- added to rotten egg (marks as spoiled for eater component)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | `{ANIM, SCRIPT}` | Array of asset definitions loaded with all three egg prefabs. |
| `prefabs` | table | `{"bird_egg_cooked", "rottenegg"}` | Dependent prefabs for raw egg (cooked product and rotten replacement). |
| `cooked_prefabs` | table | `{"spoiled_food"}` | Dependent prefabs for cooked egg (spoilage replacement). |
| `rotten_prefabs` | table | `{"gridplacer_farmablesoil"}` | Dependent prefabs for rotten egg (fertilizer deployment). |
| `FERTILIZER_DEFS` | table | --- | Loaded from `fertilizer_nutrient_defs`; provides nutrient values for `rottenegg`. |

## Main functions
### `commonfn(anim, cookable)`
* **Description:** Shared constructor helper for raw and cooked eggs. Creates entity, builds physics and AnimState, adds client-side tags, and returns early on clients. On master, attaches edible, perishable, stackable, bait, inspectable, inventoryitem, and tradable components. Raw egg sets `cookable` product to `bird_egg_cooked`; cooked egg skips cookable component. Floater component is added via `MakeInventoryFloatable()` helper called within this function.
* **Parameters:**
  - `anim` -- animation name to play ("idle" for raw, "cooked" for cooked)
  - `cookable` -- boolean; if true, adds cookable component and "cookable" tag
* **Returns:** entity instance
* **Error states:** None

### `defaultfn()`
* **Description:** Constructor for raw `bird_egg` prefab. Calls `commonfn("idle", true)`, then on master sets edible stats (zero health/sanity, `TUNING.CALORIES_TINY` hunger), perish time to `TUNING.PERISH_MED`, tradable rock tribute to 1. Accesses floater component (added by commonfn() via `MakeInventoryFloatable` helper) to set scale and vertical offset for visual positioning. Perish replacement is `rottenegg`.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None

### `cookedfn()`
* **Description:** Constructor for `bird_egg_cooked` prefab. Calls `commonfn("cooked")` without cookable flag, then on master sets edible stats (zero health, `TUNING.CALORIES_SMALL` hunger), perish time to `TUNING.PERISH_FAST`, and perish replacement to `spoiled_food`. Accesses floater component (added by commonfn() via `MakeInventoryFloatable` helper) to set size to "med" and scale to 0.65.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None

### `rottenfn()`
* **Description:** Constructor for `rottenegg` prefab. Creates entity from scratch (does not use `commonfn()`), adds fertilizer-specific tags (`icebox_valid`, `show_spoiled`, `cattoy`, `fertilizerresearchable`, `spoiledfood`), and on master attaches fertilizerresearchable, fertilizer, fuel, and edible components. Fertilizer nutrients loaded from `FERTILIZER_DEFS.rottenegg.nutrients`. Edible is forced to spoiled food with negative health/hunger values. Enables burning and hauntable ignition.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** Errors if `FERTILIZER_DEFS.rottenegg` is nil (no nil guard before `.nutrients` access).

### `GetFertilizerKey(inst)` (local)
* **Description:** Returns the prefab name of the inst as the fertilizer research key. Used by `fertilizerresearchable` component to identify this fertilizer type in research tracking.
* **Parameters:** `inst` -- entity instance
* **Returns:** string prefab name
* **Error states:** None.

### `fertilizerresearchfn(inst)` (local)
* **Description:** Wrapper function passed to `fertilizerresearchable:SetResearchFn()`. Calls `GetFertilizerKey(inst)` to return the research identifier.
* **Parameters:** `inst` -- entity instance
* **Returns:** string prefab name
* **Error states:** None.

### `GetStatus(inst, viewer)` (local)
* **Description:** Returns inspection status string for rotten egg. Checks if viewer has `eater` component and can process spoiled food via `IsSpoiledProcessor()`. Returns "CAN_PROCESS" if true, otherwise nil (no special status).
* **Parameters:**
  - `inst` -- rotten egg entity
  - `viewer` -- inspecting player entity
* **Returns:** "CAN_PROCESS" string or `nil`
* **Error states:** None — nil-checked access to `viewer.components.eater`.

## Events & listeners
None
---
id: shellweaver
title: Shellweaver
description: A science station that requires heat and proximity to function, unlocks craftable recipes via prototyping, and upgrades its tech tree based on pearl decoration score.
tags: [crafting, science, structure]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7ed2bfda
system_scope: crafting
---

# Shellweaver

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `shellweaver` is a crafting station prefab that functions as a science-based prototype station with special mechanics: it requires proximity to a player to stay active (via the `prototyper` component), supports multi-stage cooking/processing via the `madsciencelab` component, and dynamically upgrades its available tech tree based on the `pearldecorationscore` at the nearest hermit crab home. It interacts with `workable`, `lootdropper`, and `hauntable` components for building, hammering, loot dropping, and hauntable behavior.

## Usage example
```lua
-- Typical usage within the prefab definition:
local inst = CreateEntity()
inst:AddTag("structure")
inst:AddTag("prototyper")
inst:AddComponent("madsciencelab")
inst.components.madsciencelab.OnStageStarted = OnStageStarted
inst.components.madsciencelab.OnScienceWasMade = OnScienceWasMade
inst.components.madsciencelab.stages = SCIENCE_STAGES
inst:AddComponent("workable")
inst.components.workable:SetWorkAction(ACTIONS.HAMMER)
inst.components.workable:SetWorkLeft(3)
inst:AddComponent("lootdropper")
inst:AddComponent("hauntable")
inst.components.hauntable:SetHauntValue(TUNING.HAUNT_TINY)
```

## Dependencies & tags
**Components used:** `inspectable`, `prototyper`, `madsciencelab`, `workable`, `lootdropper`, `hauntable`, `soundemitter`, `animstate`, `minimapentity`, `transform`, `network`, `hermitcrab_relocation_manager` (via `MakeHermitCrabAreaListener`), `pearldecorationscore` (indirect via hermit crab home)
**Tags:** Adds `structure`, `prototyper`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `shellweaver_withinarea` | boolean | `nil` | Internal flag indicating whether the structure is within hermit crab's deployed area. |
| `istier2` | boolean | `nil` | Internal flag indicating whether the second-tier tech tree is unlocked. |
| `SCIENCE_STAGES` | table | `{ {time = ..., anim = ..., pre_anim = ..., sound = ...} }` | Stage definitions for science cooking process (duration, animations, sounds). |

## Main functions
### `AddPrototyper(inst)`
*   **Description:** Attaches the `prototyper` component and registers its callbacks (`OnTurnOn`, `OnTurnOff`, `StartMakingScience`), then updates the tech tree based on current decor score and area status.
*   **Parameters:** `inst` (Entity) - the shellweaver instance.
*   **Returns:** Nothing.

### `StartMakingScience(inst, doer, recipe)`
*   **Description:** Initiates a science stage using the `madsciencelab` component with the given recipe's product and name.
*   **Parameters:** `inst` (Entity), `doer` (Entity, unused), `recipe` (Recipe) - the selected crafting recipe.
*   **Returns:** Nothing.

### `OnStageStarted(inst, stage)`
*   **Description:** Called when a science stage begins; transitions animations, plays stage sounds, and stops proximity loop.
*   **Parameters:** `inst` (Entity), `stage` (number) - the current stage index (1-based).
*   **Returns:** Nothing.

### `OnScienceWasMade(inst, product)`
*   **Description:** Executes after science production completes; launches the product item toward the nearest player, plays completion animation/sound, and schedules return to idle.
*   **Parameters:** `inst` (Entity), `product` (string or nil) - the prefab name of the produced item.
*   **Returns:** Nothing.

### `OnHammered(inst, worker)`
*   **Description:** Called when the structure is hammered while actively making science; adjusts loot to reflect ingredients if a recipe is in progress, then drops loot and destroys the instance.
*   **Parameters:** `inst` (Entity), `worker` (Entity) - the entity doing the hammering.
*   **Returns:** Nothing.

### `OnWorked(inst, worker)`
*   **Description:** Handles animation/sound feedback on each hammer strike. Varies behavior depending on whether science is in progress, prototyper is on, or neither.
*   **Parameters:** `inst` (Entity), `worker` (Entity).
*   **Returns:** Nothing.

### `UpdateScore(inst)`
*   **Description:** Determines if the second-tier tech tree should be unlocked based on pearl decoration score and current structure state, then updates the prototyper tree accordingly.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `UpdatePrototyperTree(inst)`
*   **Description:** Sets the prototyper tech tree to either `SHELLWEAVER_L1` or `SHELLWEAVER_L2` depending on `shellweaver_withinarea` and `istier2`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `UpdateAbandonedStatus(inst, within_area)`
*   **Description:** Updates the `shellweaver_withinarea` flag and recalculates tech tree based on hermit crab relocation area status.
*   **Parameters:** `inst` (Entity), `within_area` (boolean).
*   **Returns:** Nothing.

### `GetDecorScore()`
*   **Description:** Returns the current pearl decoration score from the nearest hermit crab home, or `nil` if unavailable.
*   **Parameters:** None.
*   **Returns:** number or nil.

## Events & listeners
- **Listens to:** `onbuilt` - triggers `OnBuilt` on placement.
- **Listens to:** `pearldecorationscore_updatescore` (global event) - triggers `UpdateScore_Bridge` to refresh tech tree.
- **Pushes:** `entity_droploot` - via `lootdropper:DropLoot()`.

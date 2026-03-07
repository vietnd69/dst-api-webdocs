---
id: winter_tree
title: Winter Tree
description: Manages growth stages, decoration, lighting, and gift-giving behavior for seasonal winter trees during the Winters Feast event.
tags: [seasonal, decoration, loot, growth, entity]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8d1524ef
system_scope: entity
---

# Winter Tree

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `winter_tree` prefab implements a dynamic tree entity that grows through five distinct stages, supports ornament decoration via container slots, emits seasonal lighting when batteries are inserted, and randomly gifts players during the Winters Feast event when the tree is fully decorated and players are sleeping nearby. It integrates closely with the `growable`, `container`, `lootdropper`, `workable`, `burnable`, and `wintertreegiftable` components to manage growth, decoration, loot drops, harvest, burning, and gift logic respectively.

## Usage example
```lua
local tree = SpawnPrefab("winter_tree")
tree.Transform:SetPosition(x, y, z)
tree.components.growable:SetStage(3) -- Set to "short" stage
tree.components.container:AddItem(ornament_item) -- Attach a decoration
tree.components.container:AddItem(light_battery) -- Attach a battery for lights
-- Gifts are automatically queued at night when players are nearby and sleeping
```

## Dependencies & tags
**Components used:** `burnable`, `combat`, `container`, `growable`, `inspectable`, `lootdropper`, `simplemagicgrower`, `stackable`, `unwrappable`, `wintertreegiftable`, `workable`  
**Tags added:** `winter_tree`, `decoratable`, `structure`, `event_trigger`  
**Tags conditionally added/removed:** `shelter`, `burnt`, `fire`, `NOCLICK`, `FX`  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `statedata` | table | — | Current stage metadata (anim, loot, work settings) |
| `seedprefab` | string | — | Prefab name of the seed dropped as loot (e.g., `"pinecone"`) |
| `canshelter` | boolean | — | Whether the tree provides shelter (depends on stage and type) |
| `maxseeds` | number | `1` | Maximum number of seeds dropped per harvest |
| `previousgiftday` | number | `0` | World cycle number of last gift (for gifting cooldown) |
| `forceoff` | boolean | `false` | Temporary flag used during gift animation to disable lights |
| `ornamentfx` | table | `{}` | Map of slot index → FX entity for ornament particles/wind |
| `leaf_build` | string | — | Decorative leaf build symbol used by deciduous trees |
| `leaf_id` | number | — | Index of current leaf color for deciduous trees |

## Main functions
### `TransformIntoLeif()`
* **Description:** Transforms the winter tree into the `leif` character entity, scattering its contents as physics objects and removing shelter properties. Used exclusively for deciduous trees (e.g., `winter_deciduoustree`) as a special event behavior.
* **Parameters:** None.
* **Returns:** The new `leif` entity instance.
* **Error states:** Only called for deciduous trees where `TransformIntoLeif` is assigned.

### `GetNiceWinterTreeGiftLoot(fully_decorated)`
* **Description:** Generates a randomized gift set for players who qualify for a *nice* gift (4+ day cooldown met). Loot composition depends on whether the tree is fully decorated.
* **Parameters:** `fully_decorated` (boolean) — true if container is full of decorations.
* **Returns:** A table of loot entries, each with `prefab` (string) and `stack` (number).
* **Example return:**  
  ```lua
  {
    {prefab="winter_food1", stack=5},  
    {prefab="winter_ornament_fancy1", stack=1},  
    {prefab="gears", stack=1},  
    {prefab="winterhat", stack=1}  
  }
  ```

### `GetNaughtyWinterTreeGiftLoot()`
* **Description:** Generates a minimal penalty loot set for players who do not meet the gift cooldown or eligibility.
* **Parameters:** None.
* **Returns:** Table of loot: `{ {prefab="winter_food1", stack=3}, {prefab="charcoal", stack=1} }`.

### `onworked(inst, worker, workleft)`
* **Description:** Handles work actions (chop, hammer). Triggers fall animations, loot drops, container clearing, and sound effects based on the tree’s stage and burn state.
* **Parameters:**  
  `inst` (entity) — the tree instance.  
  `worker` (entity) — the entity performing the work.  
  `workleft` (number) — remaining work units (0 = completed).  
* **Returns:** Nothing.

### `SetGrowth(inst)`
* **Description:** Updates the tree’s state after growing to a new stage. Applies new animations, loot, work settings, shelter tags, and burning behavior. Ends growth when reaching the final stage and begins gift processing.
* **Parameters:** `inst` (entity) — the tree instance.  
* **Returns:** Nothing.

### `AddDecor(inst, data)`
* **Description:** Attaches a decorative item to a container slot, updating its visual representation (symbol override or FX). Manages lighting and wind FX for hermit-style ornaments.
* **Parameters:**  
  `inst` (entity) — the tree instance.  
  `data` (table) — must contain `slot` (number) and `item` (entity).  
* **Returns:** Nothing.

### `RemoveDecor(inst, data)`
* **Description:** Removes decoration data and associated FX/symbol override from a slot and updates lights/wind logic.
* **Parameters:**  
  `inst` (entity) — the tree instance.  
  `data` (table) — must contain `slot` (number) and `item` (entity).  
* **Returns:** Nothing.

### `UpdateLights(inst, light)`
* **Description:** Recalculates and updates tree lighting based on installed `lightbattery` items and their `ornamentlighton` state. Enables/bypasses bloom and adjusts color/intensity.
* **Parameters:**  
  `inst` (entity) — the tree instance.  
  `light` (entity, optional) — specific battery item to override for.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `itemget` — triggers `AddDecor` when a decoration is inserted into the container.  
  - `itemlose` — triggers `RemoveDecor` when a decoration is removed.  
  - `updatelight` — triggers `UpdateLights` when battery state changes.  
  - `animover` — fires `DoErode` to remove eroded burnt stump after delay.  
  - `onignite`, `onextinguish`, `burntup` — track deciduous leaf state changes.  
  - `stacksizechange` — used indirectly via `stackable` component during gift wrapping.  
- **Pushes:**  
  - `wrappeditem` — sent to items before they are wrapped into a gift.  
  - `dropitem` — sent by `container:DropItemBySlot` when dropping items during harvest.  
  - `onclose` — sent by `container:Close` when closing the decoration container.  
  - `entity_droploot` — fires when `lootdropper:DropLoot` completes.
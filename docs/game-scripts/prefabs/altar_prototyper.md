---
id: altar_prototyper
title: Altar Prototyper
description: Implements a reusable crafting station with dynamic lighting and state-dependent behavior (intact or broken), supporting research tree activation, repair, and combat-triggered creature spawns.
tags: [crafting, structure, combat, lighting]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0a02333c
system_scope: crafting
---

# Altar Prototyper

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`altar_prototyper.lua` defines two prefabs—`ancient_altar` (intact) and `ancient_altar_broken` (damaged)—which function as high-tier prototyping tables in DST. These prefabs integrate multiple components to provide research capabilities (`prototyper`), crafting feedback (`workable`), durability and repair (`repairable`), dynamic lighting, and randomized creature spawning on interaction or destruction. It also integrates with the ruins respawn system to support world-generation-based resurrection mechanics.

The intact version uses a high-tier tech tree (`TUNING.PROTOTYPER_TREES.ANCIENTALTAR_HIGH`) and supports full prototyping; the broken version uses a lower-tier tree (`TUNING.PROTOTYPER_TREES.ANCIENTALTAR_LOW`) and can be repaired to full integrity to revert to the intact variant.

## Usage example
```lua
-- Create an intact ancient altar
local altar = SpawnPrefab("ancient_altar")
altar.Transform:SetPosition(pos:Get())
altar.Transform:SetScale(1.5, 1.5, 1.5)

-- Access its prototyper component for research tree
local tree = altar.components.prototyper.trees

-- Manually trigger crafting (typically done via action handler)
altar.components.prototyper:onactivate()

-- Repair a broken altar (assuming a player `player` has thulecite)
local broken_altar = SpawnPrefab("ancient_altar_broken")
broken_altar.components.repairable:DoRepair(player, "thulecite")
```

## Dependencies & tags
**Components used:**  
- `prototyper` (for research tree and onactivate/onturnon/onturnoff hooks)  
- `workable` (for hammering/repair progress)  
- `repairable` (only on `ancient_altar_broken`)  
- `lootdropper` (only on `ancient_altar_broken`)  
- `inspectable` (on both prefabs, via `common_fn`)  

**Tags added:**  
- `altar`, `structure`, `stone`, `ancient_station`, `prototyper` (added in `common_fn`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_lightframe` | `net_smallbyte` | `0` (client-simulated frame counter) | Tracks animation frame for light intensity interpolation; synced via `"lightdirty"` event. |
| `_islighton` | `net_bool` | `false` | Boolean flag indicating whether the altar’s light is on; controls radius and sound state. |
| `_lightmaxframe` | number | `MAX_LIGHT_OFF_FRAME` (30) | Maximum frame count for the current light state transition. |
| `_activecount` | number | `0` | Counts active crafting sessions; ensures sound and animation persist while in use. |
| `scrapbook_specialinfo` | string | `"CRAFTINGSTATION"` | Metadata for scrapbook categorization (only on intact altar). |

## Main functions
### `complete_onactivate(inst)`
*   **Description:** Called when the intact altar is activated (e.g., via crafting). Plays animation, starts looping proximity sound, and lights the altar if off. Increments `_activecount` and schedules completion sound after 1.5 seconds.
*   **Parameters:** `inst` (Entity) — the altar entity.
*   **Returns:** Nothing.

### `complete_onturnon(inst)`
*   **Description:** Turns the light on smoothly for the intact altar. Initiates light frame interpolation if needed, sets `_islighton` to `true`, and begins looping proximity animation.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `complete_onturnoff(inst)`
*   **Description:** Turns the light off smoothly for the intact altar. Resets light frame and sets `_islighton` to `false`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `broken_onactivate(inst)`
*   **Description:** Similar to `complete_onactivate`, but for the broken variant. Plays `hit_broken` animation and switches to `idle_broken` loop.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `broken_onrepaired(inst, doer, repair_item)`
*   **Description:** Handles repair progress. If incomplete, plays repair sound and animation. When work reaches full (`workleft == maxwork`), replaces itself with an `ancient_altar` (intact) prefab and spawns FX.
*   **Parameters:**  
  - `inst` (Entity) — the broken altar.  
  - `doer` (Entity) — the entity performing repair.  
  - `repair_item` (string or nil) — the repair material used (ignored; repair is driven by `workable` callbacks).  
*   **Returns:** Nothing.

### `DoRandomThing(inst, pos, count, target)`
*   **Description:** Triggers random creature or item spawns at a position using weighted probabilities (`spawns` table) and action parameters (`actions` table). Supports trinket variants and sanity/health modifiers. Primarily called on hammering or activation.
*   **Parameters:**  
  - `inst` (Entity) — the altar instance.  
  - `pos` (Vector) — base position for spawns.  
  - `count` (number, optional) — number of spawn attempts.  
  - `target` (Entity, optional) — player to assign as combat target for spawned creatures.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"lightdirty"` (client-side only) — triggers `OnLightDirty`, which initiates light frame interpolation for local light animation.  
  - `"ms_sendlightningstrike"` — pushed during spawn/repair/hammer events to trigger visual FX.  

- **Pushes:**  
  - `"onprefabswaped"` — fired when `ancient_altar_broken` repairs to full or is hammered into `ancient_altar_broken`, carrying `{newobj = prefab}`.  
  - `"entity_droploot"` — indirectly via `LootDropper:DropLoot()` (see connected `lootdropper.lua`).  

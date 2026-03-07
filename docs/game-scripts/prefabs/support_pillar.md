---
id: support_pillar
title: Support Pillar
description: Manages the lifecycle, reinforcement states, construction, andquake-detection behavior of the support pillar structure in DST.
tags: [construction, structural, quake, terrain]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: fce706b7
system_scope: environment
---

# Support Pillar

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `support_pillar` prefab implements a multi-stage structural entity that supports terrain and can be upgraded using construction materials or reinforced. It serves as a durable obstacle in the world, capable of resisting certain environmental hazards like sinkholes and quakes. When damaged or deconstructed, it produces debris and loot, and in the case of dreadstone variants, it actively repairs itself while applying a sanity aura to nearby entities. The component integrates deeply with the `constructionsite`, `workable`, `lootdropper`, and `placer` systems.

## Usage example
This is a prefab definition, not a reusable component, and is instantiated via `MakePillar()` and `MakeScaffold()` factory functions. A modder would typically use its exported prefabs:
```lua
local pillar = SpawnPrefab("support_pillar")
local dreadstone_pillar = SpawnPrefab("support_pillar_dreadstone")

-- Reinforce an existing pillar to max durability instantly
pillar:MakeReinforced("idle")

-- Access construction state
local materials_needed = pillar.components.constructionsite:GetSlotCount(1)
```

## Dependencies & tags
**Components used:** `constructionsite`, `deployhelper`, `inspectable`, `lootdropper`, `placer`, `sanityaura`, `workable`
**Tags added by prefabs:** `structure`, `antlion_sinkhole_blocker`, `constructionsite`, `repairconstructionsite`, `quake_blocker`, `CLASSIFIED`, `NOCLICK`, `placer`
**Tags added to helper entities:** `FX`, `NOCLICK`, `CLASSIFIED`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_level` | `net_tinybyte` | `4` | Networked representation of current degradation level (0=complete, 4=busted). |
| `_debrisfx` | `net_tinybyte` | `0` | Networked flag for triggering debris FX (0=none, 1=hit, 2=quake, 3=collapse). |
| `suffix` | string | `"_4"` | Animation suffix (`"_1"` through `"_4"`, `""` for complete). Controls visual state and material cost. |
| `reinforced` | number | `0` | Counter tracking how many times dreadstone pillar has been reinforced (max = `TUNING.SUPPORT_PILLAR_REINFORCED_LEVELS`). |
| `debrisbank` | string | — | Bank name for debris FX animation (e.g., `"support_pillar_dreadstone"`). |
| `debrisbuild` | string | — | Build name for debris FX animation. |
| `helper` | Entity | `nil` | Visual radius helper (circular guide) shown during placement; only present on non-dedicated servers. |
| `_regentask` | Task | `nil` | Periodic regen task for dreadstone pillars during repair. |

## Main functions
### `MakeReinforced(anim)`
* **Description:** Instantly upgrades the pillar to its fully reinforced state (max durability) by adding 40 units of material and disabling construction. Prevents further regen and applies a permanent reinforced state. Optionally plays an animation (e.g., `"build"`).
* **Parameters:** `anim` (string or `nil`) – if `"build"`, plays build sequence and overrides scaffold symbols; otherwise plays `anim` or `"idle"` if `nil`.
* **Returns:** Nothing.
* **Error states:** No errors, but has no effect if `anim` is invalid and may produce no animation change.

### `OnConstructed(inst)`
* **Description:** Called automatically when construction finishes (via `constructionsite`).
* **Parameters:** `inst` (Entity) – the pillar instance.
* **Returns:** Nothing.
* **Error states:** May update animation sequence and re-enable construction if repair was interrupted.

### `Increment(inst)`
* **Description:** Adds one unit of material to the construction site. If successful, updates the degradation level and suffix; if pillar is below max reinforced count, increments `reinforced` counter.
* **Parameters:** `inst` (Entity) – the pillar instance.
* **Returns:** `true` if material was added or reinforced incremented; `false` otherwise.
* **Error states:** Returns `false` if no material can be added and reinforcement is already at max.

### `Decrement(inst, worker, numworks)`
* **Description:** Removes one unit of material (or all if `numworks` ≥ 1000). If pillar is reinforced, decrements `reinforced`. Otherwise, calculates and drops partial loot for the removed material.
* **Parameters:** `inst` (Entity), `worker` (Entity or `nil`), `numworks` (number) – damage amount.
* **Returns:** `true` if material was removed or reinforced decremented; `false` otherwise.
* **Error states:** If `worker` is `nil`, loot is dropped at pillar’s current position with no velocity.

### `PushDebrisFX(inst, fxlevel)`
* **Description:** Triggers local debris FX (e.g., quaking, hitting, collapse) on non-dedicated servers only.
* **Parameters:** `inst` (Entity), `fxlevel` (number) – one of `DEBRIS_FX.HIT` (`1`), `DEBRIS_FX.QUAKE` (`2`), or `DEBRIS_FX.COLLAPSE` (`3`).
* **Returns:** Nothing.

### `ToggleOrRestartRegen(inst, delay)`
* **Description:** Starts, restarts, or cancels dreadstone-specific regen task based on pillar state. Also manages sanity aura when repairing non-full levels.
* **Parameters:** `inst` (Entity), `delay` (number or `nil`) – optional initial delay for regen.
* **Returns:** Nothing.
* **Error states:** No effect if material is not dreadstone or pillar is fully reinforced (`suffix == ""`).

### `SetEnableWatchQuake(inst, enable, keeptask)`
* **Description:** Enables/disables listening to `startquake` events from `TheWorld`. When enabled, delays quaking by `data.debrisperiod` before triggering quake anim and debris.
* **Parameters:** `inst` (Entity), `enable` (boolean), `keeptask` (boolean) – if `true`, retains pending `_quaketask`.
* **Returns:** Nothing.

### `UpdateLevel(inst)`
* **Description:** Maps current material count (slot 1) to a discrete level (0–4), sets `suffix`, and updates prefab override and `quake_blocker` tag.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.
* **Error states:** Always succeeds. Sets `suffix = ""` for level 0 (complete), `"_4"` for level 4 (broken).

## Events & listeners
- **Listens to:** `animover` – triggers `OnAnimOver()` to resume idle animation and re-enable construction/workable.
- **Listens to:** `onsink` – triggers `onhammered()` to destroy pillar and drop all loot/debris.
- **Listens to:** `startquake` (from `TheWorld.net`) – delayed trigger for quake anim/anim via `_onquake`.
- **Listens to:** `leveldirty` (client-only) – invokes `OnLevelDirty()` to update prefix and visuals.
- **Listens to:** `debrisfxdirty` (client-only) – invokes `OnDebrisFXDirty()` to spawn debris FX.
- **Pushes:** `on_loot_dropped`, `loot_prefab_spawned` (via `lootdropper`).
- **Networked events:** `leveldirty`, `debrisfxdirty` (via `net_tinybyte` dirtying).
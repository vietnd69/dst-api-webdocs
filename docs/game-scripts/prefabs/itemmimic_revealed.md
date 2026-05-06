---
id: itemmimic_revealed
title: Itemmimic Revealed
description: Defines the revealed form of the Item Mimic enemy with combat, loot, and shadow VFX components.
tags: [enemy, shadow, mimic, combat, vfx]
sidebar_position: 10
last_updated: 2026-04-18
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: bf721f70
system_scope: entity
---

# Itemmimic Revealed

> Based on game build **722832** | Last updated: 2026-04-18

## Overview
`itemmimic_revealed` is a prefab that spawns the revealed combat form of the Item Mimic enemy. It includes health, locomotion, loot dropping, player proximity detection, sanity aura, and timer components. The prefab also spawns a shadow VFX child entity (`itemmimic_revealed_shadow`) that renders particle effects. This prefab is server-authoritative for combat logic while the shadow effect is client-side only.

## Usage example
```lua
-- Spawn the revealed mimic
local inst = SpawnPrefab("itemmimic_revealed")

-- Configure loot behavior
inst.SetNoLoot(inst, true)  -- Disable loot drop
local hasNoLoot = inst.GetNoLoot(inst)

-- Save/Load support
local saveData = {}
inst.OnSave(inst, saveData)
inst.OnLoad(inst, saveData)
```

## Dependencies & tags
**External dependencies:**
- `brains/itemmimic_revealedbrain` -- AI behavior tree attached to the entity

**Components used:**
- `health` -- manages entity health and death state
- `locomotor` -- controls movement speed and creep behavior
- `lootdropper` -- manages loot table on death
- `playerprox` -- detects nearby players for step-on dispersal
- `sanityaura` -- applies sanity drain to nearby players
- `timer` -- manages mimic blocker and stepping delay timers
- `knownlocations` -- tracks entity location knowledge

**Tags:**
- `shadowcreature` -- added on creation
- `monster` -- added on creation
- `hostile` -- added on creation
- `shadow` -- added on creation
- `notraptrigger` -- added on creation
- `shadow_aligned` -- added on creation
- `itemmimic_revealed` -- added on creation

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `noloot` | boolean | `nil` | Whether the entity drops loot on death. |
| `_shadow_tail` | entity | `nil` | Reference to the shadow VFX child entity (client-only). |
| `_toggle_tail_event` | net_event | `nil` | Network event for toggling shadow tail visibility. |
| `scrapbook_anim` | string | `"eye_idle"` | Animation name for scrapbook display. |
| `scrapbook_hidehealth` | boolean | `true` | Whether to hide health in scrapbook UI. |

## Main functions
### `SetNoLoot(inst, noloot)`
* **Description:** Configures whether the entity drops loot on death. Sets the loot table to empty or default based on the flag.
* **Parameters:**
  - `inst` -- entity instance
  - `noloot` -- boolean to enable/disable loot dropping
* **Returns:** None
* **Error states:** Errors if `inst` has no `lootdropper` component (nil dereference on `inst.components.lootdropper` -- no guard present).

### `GetNoLoot(inst)`
* **Description:** Returns the current loot drop configuration state.
* **Parameters:** `inst` -- entity instance
* **Returns:** Boolean value of `inst.noloot`
* **Error states:** None

### `OnLoad(inst, data)`
* **Description:** Restores saved state when the entity is loaded from a save file. Applies the `noloot` setting if present in save data.
* **Parameters:**
  - `inst` -- entity instance
  - `data` -- table containing saved state
* **Returns:** None
* **Error states:** None (handles nil `data` gracefully)

### `OnSave(inst, data)`
* **Description:** Saves current state to a table for persistence. Stores the `noloot` flag.
* **Parameters:**
  - `inst` -- entity instance
  - `data` -- table to populate with save data
* **Returns:** None
* **Error states:** None

### `on_eye_up(inst)`
* **Description:** Plays eye appearance animation and sound when the `eye_up` event fires. Only activates if the entity is not dead.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None (checks `IsDead()` before playing animation)

### `on_eye_down(inst)`
* **Description:** Plays eye disappearance animation when the `eye_down` event fires.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None

### `DisperseFromBeingSteppedOn(inst, player)`
* **Description:** Kills the entity when a player steps on it. Pushes a `killed` event to the player if present.
* **Parameters:**
  - `inst` -- entity instance
  - `player` -- player entity that stepped on it (can be nil)
* **Returns:** None
* **Error states:** Errors if `inst` has no `health` component (nil dereference on `inst.components.health:Kill()` -- no guard present).

### `toggle_tail(inst)`
* **Description:** Toggles the disabled state of the shadow tail VFX entity.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None (checks `inst._shadow_tail` before accessing)

### `on_death(inst, data)`
* **Description:** Pushes the toggle tail event when the entity dies.
* **Parameters:**
  - `inst` -- entity instance
  - `data` -- event data (unused)
* **Returns:** None
* **Error states:** None

### `on_jump_spawn(inst)`
* **Description:** Starts the `recently_spawned` timer if it does not already exist when the `jump` event fires.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** Errors if `inst` has no `timer` component (nil dereference on `inst.components.timer` -- no guard present).

### `on_timer_done(inst, data)`
* **Description:** Sets up player proximity detection when the `stepping_delay` timer completes.
* **Parameters:**
  - `inst` -- entity instance
  - `data` -- table containing `name` field with timer name
* **Returns:** None
* **Error states:** Errors if `inst` has no `playerprox` component (nil dereference on `inst.components.playerprox` -- no guard present).

## Events & listeners
- **Listens to:** `eye_up` -- triggers eye appearance animation
- **Listens to:** `eye_down` -- triggers eye disappearance animation
- **Listens to:** `death` -- triggers shadow tail event push
- **Listens to:** `timerdone` -- sets up player proximity detection on stepping_delay completion
- **Listens to:** `jump` -- starts recently_spawned timer
- **Listens to:** `itemmimic_revealed.toggle_tail_event` -- toggles shadow tail visibility (client-only)
- **Pushes:** `killed` -- pushed to player entity when stepped on (via `player:PushEvent`)
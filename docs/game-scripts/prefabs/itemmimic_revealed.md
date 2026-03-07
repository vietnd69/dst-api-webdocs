---
id: itemmimic_revealed
title: Itemmimic Revealed
description: Manages the revealed form of an item mimic, handling state transitions, player interaction, and shadow VFX synchronization during combat.
tags: [combat, ai, boss, fx, ambient]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d12e48ec
system_scope: entity
---

# Itemmimic Revealed

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `itemmimic_revealed` prefab defines the combat-active form of an item mimic after it has been exposed. It operates as a hostile shadow creature with specific behaviors: it spawns a companion shadow entity for visual effects, monitors player proximity to trigger a lethaldispersion effect, and coordinates animations and sound cues (e.g., eye appearance/disappearance) via state graph events. It is tightly integrated with the `itemmimic_revealedbrain` AI and uses several core components (`health`, `playerprox`, `timer`) to manage its lifecycle and interactions.

## Usage example
```lua
-- This prefab is instantiated internally by the game when an item mimic is triggered.
-- Custom usage is not recommended; it is intended to be created via the state graph
-- and brain logic of the parent item mimic prefab.
local inst = require("prefabs/itemmimic_revealed")()
inst.components.health:SetHealth(100)
```

## Dependencies & tags
**Components used:** `health`, `locomotor`, `lootdropper`, `playerprox`, `sanityaura`, `timer`  
**Tags added:** `shadowcreature`, `monster`, `hostile`, `shadow`, `notraptrigger`, `shadow_aligned`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_anim` | string | `"eye_idle"` | Animation used when the creature is viewed in the scrapbook. |
| `scrapbook_hidehealth` | boolean | `true` | Hides health in scrapbook UI. |
| `anim_bank` | string | `"item_mimic_reveal"` | Animation bank for the entity. |
| `anim_build` | string | `"item_mimic_reveal"` | Build used for the animation state. |
| `_shadow_tail` | Entity or `nil` | `nil` | Reference to the associated shadow FX entity (client-only). |
| `_toggle_tail_event` | NetEvent | `nil` | Network event used to synchronize tail animation toggle. |

## Main functions
### `on_eye_up(inst)`
* **Description:** Handles the `eye_up` event by playing the eye appearance animation and emitting a sound, but only if the entity is not dead.
* **Parameters:** `inst` (Entity) — the item mimic revealed instance.
* **Returns:** Nothing.
* **Error states:** Early exit if `inst.components.health:IsDead()` returns `true`.

### `on_eye_down(inst)`
* **Description:** Plays the eye disappearance animation and switches to the `"empty"` idle animation.
* **Parameters:** `inst` (Entity) — the item mimic revealed instance.
* **Returns:** Nothing.

### `DisperseFromBeingSteppedOn(inst, player)`
* **Description:** Kills the entity and notifies the player if they stepped on it.
* **Parameters:**  
  - `inst` (Entity) — the item mimic revealed instance.  
  - `player` (Entity or `nil`) — the player who triggered the effect.
* **Returns:** Nothing.

### `toggle_tail(inst)`
* **Description:** Toggles the `_disabled` state of the shadow tail FX entity, enabling/disabling its particle emission.
* **Parameters:** `inst` (Entity) — the item mimic revealed instance.
* **Returns:** Nothing.

### `on_death(inst, data)`
* **Description:** Fires the `itemmimic_revealed.toggle_tail_event` net event upon death to signal the shadow tail should disappear.
* **Parameters:**  
  - `inst` (Entity) — the item mimic revealed instance.  
  - `data` (table) — event payload (unused).
* **Returns:** Nothing.

### `on_jump_spawn(inst)`
* **Description:** Ensures a `"recently_spawned"` timer is running (5s) after a jump behavior occurs, likely to prevent immediate aggro.
* **Parameters:** `inst` (Entity) — the item mimic revealed instance.
* **Returns:** Nothing.

### `on_timer_done(inst, data)`
* **Description:** Handles timer completion for `"stepping_delay"`; activates player proximity detection after the delay.
* **Parameters:**  
  - `inst` (Entity) — the item mimic revealed instance.  
  - `data` (table) — timer completion data; expects `name` field.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `eye_up` — triggers eye appearance animation and sound.  
  - `eye_down` — triggers eye disappearance animation.  
  - `death` — fires `toggle_tail_event` net event.  
  - `timerdone` — triggers post-delay player proximity activation.  
  - `jump` — ensures `"recently_spawned"` timer is started.  
  - `itemmimic_revealed.toggle_tail_event` — calls `toggle_tail` (client-only).
- **Pushes:**  
  - `itemmimic_revealed.toggle_tail_event` — via `net_event` (server → client sync for shadow tail toggle).
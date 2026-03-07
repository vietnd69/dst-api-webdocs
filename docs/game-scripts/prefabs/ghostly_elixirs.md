---
id: ghostly_elixirs
title: Ghostly Elixirs
description: Creates consumable ghostly elixir items and their associated debuff components that apply temporary buffs to targets upon use.
tags: [consumable, debuff, elixir, player, ghost]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f6a868ae
system_scope: inventory
---

# Ghostly Elixirs

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`ghostly_elixirs.lua` defines the prefabs and logic for consumable ghostly elixirs (e.g., slow regen, fast regen, shield, speed, retaliation) used in the game. Each elixir is an inventory item that, when applied, attaches a unique debuff component to the target. The debuff handles periodic effects (like healing or movement modification), applies and removes gameplay modifiers, and supports player- and non-player-specific behaviors (e.g., via `ONAPPLY_PLAYER`/`ONAPPLY`). The script also enables special interactions, such as ghosts haunting a speed elixir to gain a temporary speed boost.

This file orchestrates the creation of both elixir prefabs (the usable item) and buff prefabs (the debuff entity), wiring them together via tunings and hooks.

## Usage example
```lua
--Typical usage in another prefab's constructor to add an elixir:
local ghostly_elixirs = require "prefabs/ghostly_elixirs"
-- The following returns multiple prefabs (elixirs and their buffs), unpacked:
return table.unpack(ghostly_elixirs)
```
This file itself is not directly instantiated per entity; instead, its return value populates the list of available elixir prefabs for use in-game.

## Dependencies & tags
**Components used:** `inventoryitem`, `stackable`, `inspectable`, `ghostlyelixir`, `hauntable`, `fuel`, `debuff`, `timer`, `health`, `hunger`, `sanity`, `locomotor`, `combat`, `follower`, `skilltreeupdater`, `sisturnregistry`, `planardamage`, `talker`, `inventory`.

**Tags added on elixir item:** `ghostlyelixir`, `super_elixir` (for shadow/lunar elixirs).

**Tags added/removed on target (player) during debuff:** `vigorbuff` (added on speed elixir apply, removed on detach).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `potion_tunings` | table | *nil* (set per elixir) | Contains all tunings and callbacks specific to the elixir type (duration, effect functions, fx paths). |
| `buff_prefab` | string | *nil* (set at creation) | Prefab name of the associated debuff entity. |
| `elixir_buff_type` | string | *nil* (set from anim) | Animation name (e.g., `"speed"`) used to identify the elixir type. |
| `duration_extended_by_skill` | number | *nil* | Temporary multiplier applied when player uses the "potion_duration" skill upgrade. |

## Main functions
### `DoApplyElixir(inst, giver, target)`
* **Description:** Creates and applies a debuff to the target when the elixir is used. Handles buff type selection (standard vs super) and ensures only one active debuff of the same type exists. Triggers debuff skill modifiers.
* **Parameters:** `inst` (entity, the elixir), `giver` (entity, the user), `target` (entity, recipient of the effect).
* **Returns:** The debuff instance if successfully added; otherwise `nil`.
* **Error states:** Returns early if debuff creation fails or if the target already has a conflicting debuff of the same name.

### `buff_fn(tunings, dodelta_fn)`
* **Description:** Constructor for the debuff entity that represents an active elixir effect. Sets up the component hooks (`OnAttached`, `OnDetached`, `OnExtended`) and initializes a decay timer.
* **Parameters:** `tunings` (table, a `potion_tunings` entry), `dodelta_fn` (function, unused/legacy, ignored).
* **Returns:** The debuff entity.
* **Note:** Not intended for client-side use; it cancels itself on client (non-mastersim).

### `potion_fn(anim, potion_tunings, buff_prefab)`
* **Description:** Constructor for the elixir inventory item (usable prefab). Sets up animations, physics, tags, and components like `ghostlyelixir`, `hauntable` (for speed elixir), and `fuel`.
* **Parameters:** `anim` (string, animation bank name), `potion_tunings` (table, the associated tuning set), `buff_prefab` (string, name of the debuff prefab).
* **Returns:** The elixir entity.
* **Special behavior:** If `speed_hauntable` is true in `potion_tunings`, sets `hauntable` to allow ghost haunting for speed boost.

### `speed_potion_haunt(inst, haunter)`
* **Description:** Custom haunt function used for the speed elixir. Launches the haunter briefly and grants a temporary speed multiplier to the player ghost. Sets up a timer to remove the modifier upon respawn or duration expiry.
* **Parameters:** `inst` (the speed elixir), `haunter` (the player ghost).
* **Returns:** `true` (indicates successful haunt).
* **Error states:** Modifies only valid ghosts (`HasTag("playerghost")`).

### `AddPotion(potions, name, anim, extra_assets)`
* **Description:** Helper to define a single elixir pair (item + debuff) with appropriate assets and prefabs, then inserts them into the `potions` table.
* **Parameters:** `potions` (table, output array), `name` (string, suffix for prefab name), `anim` (string, animation name), `extra_assets` (table, optional additional assets).
* **Returns:** Nothing; mutates `potions`.

### `buff_OnAttached(inst, target)`
* **Description:** Called when a debuff is applied to a target. Invokes the correct `ONAPPLY`/`ONAPPLY_PLAYER` callback, starts periodic tasks (tick and drip FX), and spawns associated FX.
* **Parameters:** `inst` (the debuff), `target` (the target entity).
* **Returns:** Nothing.

### `buff_OnDetached(inst, target)`
* **Description:** Called when a debuff is removed. Cancels tasks, invokes `ONDETACH`/`ONDETACH_PLAYER`, and cleans up modifiers.
* **Parameters:** `inst` (the debuff), `target` (the target entity).
* **Returns:** Nothing; destroys the debuff entity afterward.

## Events & listeners
- **Listens to:**  
  - `"attacked"` (on player) – triggers shield/retaliation elixir effect when the player is struck.  
  - `"timerdone"` (on debuff) – triggers `buff_OnTimerDone` to stop the debuff when decay timer ends.  
  - `"death"` (on debuff, attached to target) – stops the debuff if the target dies.  
  - `"ms_respawnedfromghost"` (on haunter for speed elixir) – cancels speed multiplier on respawn.

- **Pushes:**  
  - `"ghostlyelixir_retaliation_fx"`, `"ghostlyelixir_lunar_fx"` etc. – via `SpawnPrefab()` (not directly pushed as events).  
  - `"startsmallhealthregen"`/`"starthealthregen"` (via `PushEvent`) when regen begins.  
  - `"healthdelta"` (indirectly via `Health:DoDelta`).  
  - `"sanitydelta"`/`"hungerdelta"` (indirectly via component methods).  
  - `"goinsane"`/`"goenlightened"`/`"gosane"` (indirectly via `Sanity:DoDelta` state changes).
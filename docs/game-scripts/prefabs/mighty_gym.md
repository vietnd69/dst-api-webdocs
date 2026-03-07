---
id: mighty_gym
title: Mighty Gym
description: Manages the structure and behavior of the Mighty Gym, a gymnasium-style structure that allows players to gain mightiness by loading weights and working out.
tags: [gym, player, structure, inventory, combat]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6ebe194e
system_scope: entity
---

# Mighty Gym

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `mighty_gym` is a player-interactive structure component that supports workout mechanics. It allows players to load weighted items (e.g., potato sacks) into its inventory to increase their mightiness level. It integrates with several core systems: `mightygym` (core logic), `inventory` (weight storage), `workable` (hammer-to-unload behavior), `heavyobstacleusetarget` (item-loading via right-click), and `burnable` (fire resistance and burning state handling). It also supports special interactions when burnt or removed, including automatically ejecting any currently working player.

## Usage example
```lua
local inst = SpawnPrefab("mighty_gym")
inst.Transform:SetPosition(x, y, z)
inst.components.mightygym:LoadWeight(SpawnPrefab("potatosack"))
-- Later, hammering will unload the weight and drop loot
inst.components.workable:SetWorkLeft(4)
```

## Dependencies & tags
**Components used:** `inspectable`, `lootdropper`, `workable`, `mightygym`, `heavyobstacleusetarget`, `inventory`, `burnable`, `fueled`, `propagator`, `hauntable`, `health`, `freezable`, `sleeper`, `grogginess`, `inventoryitem`, `finiteuses`, `stackable`, `propagator`, `propagator`, `propagator`, `animstate`, `soundemitter`, `transform`, `minimapentity`, `network`.

**Tags:** Adds `structure`, `gym`. Checks `burnt`, `fireimmune`. May receive or remove `loaded` depending on weight state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `strongman` | entity | `nil` | Reference to the player currently using the gym. |
| `full_drop_slot` | number | `1` | The inventory slot from which the first item is dropped when unloading. |
| `pumpkincarving_fx1`, `pumpkincarving_fx2` | entity | `nil` | Optional visual effect entities used during specific animations. |
| `enterdirection` | number | `nil` | Direction the player entered the gym (in degrees), used for teleporting out. |
| `ignorescangoincontainer` | boolean | `true` | Inventory flag to prevent scanning into this container during crafting. |
| `maxslots` | number | `2` | Maximum number of weight items the gym can hold. |

## Main functions
### `CharacterExitGym(player)`
*   **Description:** Handles the full ejection of a player from the gym, resetting their physics, animations, and removing gym-specific overrides. Restores the real gym if it's a projection, and schedules the player to jump out or teleport depending on state (e.g., dead/frozen).
*   **Parameters:** `player` (entity) — the player entity currently inside the gym.
*   **Returns:** Nothing.
*   **Error states:** None documented; assumes `player` is valid and inside the gym.

### `UnloadWeight()`
*   **Description:** Drops all items currently stored in the gym’s inventory, clears override symbols, removes any effect entities, updates the `full_drop_slot` counter, removes the `loaded` tag, plays a sound, and regenerates level art based on remaining weight.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `LoadWeight(item)`
*   **Description:** Adds the provided `item` to the gym’s inventory as a weight. Typically called when a player right-clicks the gym with a valid weight item.
*   **Parameters:** `item` (entity) — the item to load (e.g., `potatosack`).
*   **Returns:** Nothing (implicitly handled by `inventory:AddItem`).
*   **Error states:** No explicit error handling — relies on inventory capacity and item type.

### `CalcWeight()`
*   **Description:** Computes the current total weight level based on loaded items. Used to determine visual and gameplay state.
*   **Parameters:** None.
*   **Returns:** number — the computed weight level, used to set level art.

### `SetLevelArt(weight, strongman)`
*   **Description:** Updates the gym’s visual appearance (animation/symbol state) to match the current weight level and strongman presence.
*   **Parameters:** `weight` (number) — result from `CalcWeight()`; `strongman` (entity or `nil`) — current user if present.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `onbuilt` — spawns two `potatosack` prefabs and loads them into the gym’s inventory upon construction.
  - `onburnt` — unloads all weights and removes the `heavyobstacleusetarget` component when fully burnt.
  - `onremove` — forces the current `strongman` (if any) to exit the gym cleanly before removal.
- **Pushes:** None directly (relies on component-level event firing, e.g., via `mightygym` component).
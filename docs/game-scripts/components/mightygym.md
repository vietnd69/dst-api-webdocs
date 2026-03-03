---
id: mightygym
title: Mightygym
description: Manages weight loading, workout state, and visual/sound feedback for the Mighty Gym structure in the game.
tags: [gym, player, combat, ui, inventory]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 89b9c793
system_scope: entity
---

# Mightygym

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Mightygym` manages the state, item handling, and animation synchronization for the *Mighty Gym* structure. It supports loading/unloading heavy items, enabling players with the `strongman` component to enter, exercise, and exit the gym while synchronizing visual and gameplay effects (e.g., weight art, hunger burn rate, skin swapping). It integrates closely with the `inventory`, `mightiness`, `strongman`, `burnable`, `freezable`, `sleeper`, `grogginess`, `hunger`, `skinner`, `symbolswapdata`, `pumpkincarvable`, and `talker` components.

## Usage example
```lua
local gym = Prefabs["mighty_gym"]()
gym:AddComponent("mightygym")

-- Load two heavy items into the gym
local item1 = SpawnPrefab("cavein_boulder")
local item2 = SpawnPrefab("moon_altar_glass")
gym.components.mightygym:LoadWeight(item1, 1)
gym.components.mightygym:LoadWeight(item2, 2)

-- Start a workout with a player
gym.components.mightygym:CharacterEnterGym(player)
```

## Dependencies & tags
**Components used:** `inventory`, `burnable`, `freezable`, `sleeper`, `grogginess`, `health`, `hunger`, `strongman`, `mightiness`, `skinner`, `symbolswapdata`, `pumpkincarvable`, `talker`, `inventoryitem`.  
**Tags added/removed:** `loaded`, `hasstrongman`, `fireimmune`, `ingym`.  
**Tags checked:** `burnt`, `strongman`, `debuffed`, `ignoretalking`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Owner entity (the gym structure). |
| `strongman` | `Entity` or `nil` | `nil` | Player currently using the gym. |
| `weight` | number | `0` | Total calculated weight of loaded items. |
| `full_drop_slot` | number | `1` | Slot used for overflow when inventory is full during `LoadWeight`. |
| `skins` | table | `nil` | Clothing data of the `strongman` during workout. |
| `monkey_curse` | boolean | `nil` | Monkey curse state of the `strongman`. |
| `skin_base_data` | table | `nil` | Skin definitions for the `strongman`'s base prefab. |

## Main functions
### `SetLevelArt(level, target)`
* **Description:** Sets the visual level indicators (`meter_color2`) on the gym (and optionally a target, e.g., the `strongman`). Shows/hides symbols and applies skin overrides if present.  
* **Parameters:**  
  - `level` (number) — Current weight level used to determine which color symbol to show (`meter_color2`).  
  - `target` (`Entity` or `nil`) — Entity to apply art to; defaults to `self.inst`.  
* **Returns:** Nothing.  
* **Error states:** Does nothing if `target` lacks `AnimState` or `gym_skin`/`prefab` data.

### `CalcWeight()`
* **Description:** Calculates total weight by scanning the gym’s inventory for items tagged `"heavy"` and summing their `gymweight` (default `2`). Updates `self.weight`.  
* **Parameters:** None.  
* **Returns:** number — Total weight value.  
* **Error states:** Does not count items if fewer than 2 heavy items are loaded.

### `CheckForWeight()`
* **Description:** Scans inventory slots 1 and 2; if occupied by heavy items, calls `SetWeightSymbol` and adds the `"loaded"` tag. Skips if gym is `"burnt"`.  
* **Parameters:** None.  
* **Returns:** Nothing.  

### `SwapWeight(item, swapitem)`
* **Description:** Swaps an existing item at its current slot for a new `swapitem` using `LoadWeight`.  
* **Parameters:**  
  - `item` (`Entity`) — Existing item to remove.  
  - `swapitem` (`Entity`) — New item to insert.  
* **Returns:** Nothing.  

### `SetWeightSymbol(weight, slot)`
* **Description:** Sets override symbols for the gym and `strongman` based on the item’s `symbolswapdata`. Handles skinned and non-skinned items, and spawns a `pumpkincarving_swap_fx` for pumpkins. Clears existing FX IDs.  
* **Parameters:**  
  - `weight` (`Entity`) — Item with `symbolswapdata` component.  
  - `slot` (number) — Slot index (`1` or `2`) corresponding to `"swap_item"` or `"swap_item2"`.  
* **Returns:** Nothing.  
* **Error states:** Early return if `weight` lacks `symbolswapdata`. Does nothing if `is_skinned` data is invalid.

### `LoadWeight(weight, slot)`
* **Description:** Adds `weight` to the gym’s inventory (auto-drop if full), updates weight symbols, plays material-specific sound, sets `"loaded"` tag, and updates visual level art. If `strongman` is present, updates `strongman`’s art and `inmightygym` replica.  
* **Parameters:**  
  - `weight` (`Entity`) — Heavy item to load.  
  - `slot` (number or `nil`) — Desired inventory slot (`1` or `2`). If omitted or inventory full, auto-selects slot.  
* **Returns:** Nothing.  

### `UnloadWeight()`
* **Description:** Drops all items from the gym, clears override symbols and FX, resets `full_drop_slot`, removes `"loaded"` tag, updates level art (including `strongman`), and plays `"item_removed"` sound.  
* **Parameters:** None.  
* **Returns:** Nothing.  

### `CanWorkout(doer)`
* **Description:** Validates whether `doer` (typically a player) can start a workout. Checks tags, fire state, gym usage, hunger, and item load (requires exactly 2 heavy items).  
* **Parameters:**  
  - `doer` (`Entity`) — Entity attempting to use the gym.  
* **Returns:**  
  - `true` — If workout is allowed.  
  - `false, "ONFIRE"` / `"SMOULDER"` / `"FULL"` / `"HUNGRY"` / `"NOWEIGHT"` / `"UNBALANCED"` — On failure with reason.  

### `CalculateMightiness(perfect)`
* **Description:** Calculates the mightiness gain rate based on total weight and whether the workout was *perfect*. Uses `TUNING.GYM_RATE.*` constants.  
* **Parameters:**  
  - `perfect` (boolean) — `true` if the workout met quality criteria (e.g., perfect form).  
* **Returns:** number — The may amount to apply (e.g., `TUNING.GYM_RATE.LOW`, `MED`, or `HIGH`).  

### `SetSkinModeOnGym(doer, skin_mode)`
* **Description:** Applies the appropriate skin variant (e.g., `normal`, `winter`, `monkey`) to the gym’s anim state using `SetSkinsOnAnim`.  
* **Parameters:**  
  - `doer` (`Entity`) — The `strongman` entity.  
  - `skin_mode` (string) — Skin mode (e.g., `"normal"`, `"wrestler"`).  
* **Returns:** Nothing.  

### `StartWorkout(doer)`
* **Description:** Initializes workout state for `doer`: sets `self.strongman`, updates hunger burn rate, caches clothing/skins, applies item skins to the gym, and adds `"hasstrongman"` tag.  
* **Parameters:**  
  - `doer` (`Entity`) — Player with `strongman` tag and `mightiness` component.  
* **Returns:** Nothing.  

### `StopWorkout()`
* **Description:** Ends workout: resets gym build, clears `strongman`, removes hunger modifier, clears skin data, and removes `"hasstrongman"` tag.  
* **Parameters:** None.  
* **Returns:** Nothing.  

### `InUse()`
* **Description:** Checks if a `strongman` is currently in the gym.  
* **Parameters:** None.  
* **Returns:** boolean — `true` if `self.strongman ~= nil`.  

### `CharacterEnterGym(player)`
* **Description:** Transitions a player into the gym: hides the physical gym, overlays gym art on the player, applies physics/scale overrides, syncs weight art, starts workout, and sets up event listeners for exit conditions.  
* **Parameters:**  
  - `player` (`Entity`) — The `strongman` entering the gym.  
* **Returns:** Nothing.  

### `CharacterExitGym(player)`
* **Description:** Exits the player from the gym: restores the gym, reapplies the gym’s original build/skin, teleports the player, plays `"jumpout"` state (or teleports on state-incompatible condition), clears overrides, kills workout sound, resets state, and stops workout.  
* **Parameters:**  
  - `player` (`Entity`) — The `strongman` exiting the gym.  
* **Returns:** Nothing.  

## Events & listeners
- **Listens to:**  
  - `"onremove"` (on `self.inst`) — Calls `trytoexitgym` to force exit if gym is removed.  
  - `"attacked"` (on `self.inst`) — Calls `trytoexitgym` on damage to prevent unsafe gym usage.  
  - `"stopworkout"` (on `player`) — Calls `onstopworkout` to transition gym state to `"workout_pst"`.  
- **Pushes:** None. (Note: Events like `"buff_expired"` or `"onremove"` are *handled*, not pushed, by this component.)

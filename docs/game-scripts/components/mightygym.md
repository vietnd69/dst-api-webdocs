---
id: mightygym
title: Mightygym
description: Manages weight loading, workout states, and visual/audio feedback for the Mighty Gym structure in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 89b9c793
---

# Mightygym

## Overview
The `Mightygym` component governs the behavior of the `mighty_gym` structure, including weight detection, workout initiation/termination, dynamic visual overlays (e.g., loaded weight symbols, level-specific coloring), and synchronization with a Strongman player during workouts. It interfaces with the inventory, animation, sound, and mightiness systems to provide the core gym simulation experience.

## Dependencies & Tags
**Dependencies:**
- `inventory` component (to check/load/unload items, manage slots)
- `burnable` component (to detect fire state)
- `strongman` component (to coordinate workout state)
- `mightiness` component (for workout calculation and skin mode)
- `skinner` component (to retrieve outfit/skin data for animation overrides)
- `health`, `hunger`, `freezable`, `sleeper`, `grogginess`, `talker`, `classified` (used indirectly during workout lifecycle)
- `symbolswapdata` and `pumpkincarvable` components on loaded items (used conditionally for symbol handling)

**Tags Added/Removed:**
- `loaded` (added when one or two items are present; removed on unloading)
- `hasstrongman` (added when a Strongman enters for a workout; removed when exiting)
- `fireimmune` (added while a Strongman is inside the gym)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the `mighty_gym` entity the component is attached to. |
| `strongman` | `Entity` (player) | `nil` | The Strongman player currently using the gym; `nil` when idle. |
| `weight` | `number` | `0` | Total calculated weight (sum of "heavy" items in inventory slots 1 and 2). |
| `full_drop_slot` | `number` | `1` | Inventory slot (1 or 2) used when dropping items due to full inventory during `LoadWeight`. Alternates after each drop. |
| `pumpkincarving_fx1`, `pumpkincarving_fx2` | `Prefab` or `nil` | `nil` | FX instance for pumpkin carver carving visuals on loaded items (if applicable). |
| `skin_base_data` | `table` | `{}` | Skin configuration data from the Strongman’s base prefab. Populated at workout start. |
| `skins`, `monkey_curse` | `table` / `boolean` | `nil` | Clothing and monkey curse state captured from the Strongman at workout start. |

## Main Functions

### `SetLevelArt(level, target)`
* **Description:** Updates the gym’s visual meter art to reflect the current `level`. Shows/hides `meter_color2` and applies color overrides based on `meter_color2`, `meter_color3`, or `meter_color4` skins. Can update either the gym itself or an external target (e.g., the Strongman).
* **Parameters:**
  - `level` (`number`): The weight level used to determine which color symbol to show (e.g., 2 → `meter_color2`, 7+ → higher).
  - `target` (`Entity`, optional): Entity whose `AnimState` to update; defaults to `self.inst`.

### `CalcWeight()`
* **Description:** Recalculates the total weight by summing `gymweight` (default 2) for every "heavy" item currently in the gym’s inventory. Updates `self.weight` and returns the total.
* **Parameters:** None.

### `CheckForWeight()`
* **Description:** Scans inventory slots 1 and 2. For each occupied slot, sets the appropriate weight symbol via `SetWeightSymbol` and adds the `"loaded"` tag. Skips if the gym is burning.
* **Parameters:** None.

### `SetWeightSymbol(weight, slot)`
* **Description:** Configures the gym’s animation symbols for a loaded weight item in the given slot. Handles both skinned and non-skinned items, including optional pumpkin carving FX. Also updates the `strongman`’s visuals if present.
* **Parameters:**
  - `weight` (`Entity`): The item to display (must have `symbolswapdata`).
  - `slot` (`number`): Inventory slot index (1 or 2). Used to pick `slot_ids[slot]` and create FX IDs.

### `LoadWeight(weight, slot)`
* **Description:** Adds a weight item to the gym’s inventory, updating visuals, sound, and weight level. Handles full inventory by dropping an item from `full_drop_slot`. Plays material-specific sounds (rock, glass, veggie, sack). Updates `strongman` if active.
* **Parameters:**
  - `weight` (`Entity`): The item to load.
  - `slot` (`number`, optional): Target inventory slot. If omitted or full, auto-selects a slot.

### `UnloadWeight()`
* **Description:** Removes all items from the gym, clears weight symbols, resets `full_drop_slot`, removes the `"loaded"` tag, and updates visuals/sounds. Adjusts `strongman`’s weight display if active.
* **Parameters:** None.

### `CanWorkout(doer)`
* **Description:** Validates whether the given player (`doer`) may begin a workout. Returns `true` or `false, reason`. Checks: is Strongman + `mightiness`? Not on fire/smoldering? Gym not in use? Player sufficiently hungry? Both inventory slots occupied? Balanced?
* **Parameters:**
  - `doer` (`Entity`): The player attempting to start a workout.

### `CalculateMightiness(perfect)`
* **Description:** Computes the mightiness gain multiplier based on current weight and whether the workout was “perfect” (balanced). Uses `TUNING.GYM_RATE` constants for LOW/MED/HIGH.
* **Parameters:**
  - `perfect` (`boolean`): Whether the workout was perfectly balanced.

### `StartWorkout(doer)`
* **Description:** Finalizes gym state entry for a Strongman: sets `strongman`, unlocks skin overrides, updates weight art on the player, burns hunger, and hands control to the `strongman` component’s `DoWorkout`.
* **Parameters:**
  - `doer` (`Entity`): The Strongman entering the gym.

### `StopWorkout()`
* **Description:** Ends the current workout: resets gym appearance, stops `strongman` activity, removes hunger modifier, clears references, and removes `"hasstrongman"` tag.
* **Parameters:** None.

### `InUse()`
* **Description:** Returns `true` if the gym is currently occupied by a Strongman (`strongman ~= nil`).
* **Parameters:** None.

### `CharacterEnterGym(player)`
* **Description:** Handles full pre-entry sequence: hides real gym, teleports player inside, overrides player animation/skins, plays workout loop, sets up listeners, updates weight visuals on the player, and initiates workout via `StartWorkout`.
* **Parameters:**
  - `player` (`Entity`): The Strongman entering the gym.

### `CharacterExitGym(player)`
* **Description:** Handles full exit sequence: restores gym visibility, resets player’s animations/skins, jumps player out, teleports on death/freeze, kills workout loop, resets internal state, and calls `StopWorkout`.
* **Parameters:**
  - `player` (`Entity`): The Strongman exiting the gym.

## Events & Listeners
- Listens to `"onremove"` event on `self.inst` → triggers `trytoexitgym(player)` (force-exits player if gym is destroyed).
- Listens to `"attacked"` event on `self.inst` → triggers `trytoexitgym(player)` (force-exits player if gym is attacked).
- Listens to `"stopworkout"` event on the `strongman` player → calls `onstopworkout(inst, data)`, which sets the gym’s post-workout state.
- Listens to `"onremove"` and `"attacked"` events on `self.inst`, bound to `player`, for cleanup when `player` leaves/exits.
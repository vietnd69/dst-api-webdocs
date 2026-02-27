---
id: beard
title: Beard
description: Manages the growth, shaving, insulation, and special properties of an entity's beard over time.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: player
source_hash: e56c7fff
---

# Beard

## Overview
The Beard component simulates the growth of a beard on an entity, typically a player character like Wilson. It tracks growth in days, triggers visual changes at different stages, provides thermal insulation, and handles the shaving process. It also integrates with Wilson's skill tree to provide accelerated growth and a unique beard-based inventory slot.

## Dependencies & Tags

**Dependencies:**
*   `skilltreeupdater`: Checked for skills that modify beard growth rate, insulation, and enable the beard inventory.
*   `inventory`: Used to equip or unequip the beard inventory item ("beard sack").
*   `sanity`: Used to grant a sanity bonus when a player shaves themself.

**Tags:**
*   `bearded`: Added to the entity when this component is attached.

## Properties

| Property | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `daysgrowth` | `number` | `0` | The number of days the beard has been growing. |
| `daysgrowthaccumulator` | `number` | `0` | Accumulates fractional growth from skills before adding full days. |
| `callbacks` | `table` | `{}` | A table mapping growth days to callback functions for visual updates. |
| `prize` | `string` | `nil` | The prefab name of the item to spawn when the beard is shaved (e.g., "beardhair"). |
| `bits` | `number` | `0` | Represents the current "amount" or "length" of the beard, used for insulation and shaving logic. |
| `insulation_factor` | `number` | `1` | A multiplier for the insulation value calculated from `bits`. |
| `pause` | `boolean` | `nil` | If true, beard growth is paused. |
| `onreset` | `function` | `nil` | A callback function that is triggered when `Reset()` is called. |
| `skinname` | `string` | `nil` | The name of the currently applied beard skin. |
| `canshavetest` | `function` | `nil` | An optional function that can be set to perform additional checks before allowing a shave. |

## Main Functions

### `EnableGrowth(enable)`
*   **Description:** Starts or stops the beard growth process. When enabled, it begins listening for the end of each day to increment growth. When disabled, it stops listening.
*   **Parameters:**
    *   `enable` (`boolean`): `true` to start growth, `false` to stop it.

### `GetInsulation()`
*   **Description:** Calculates the total thermal insulation provided by the beard. The value is based on the number of `bits`, a base insulation value from `TUNING`, and any applicable multipliers from the entity's skill tree.
*   **Parameters:** None. Returns a number representing the insulation value.

### `ShouldTryToShave(who, whithwhat)`
*   **Description:** Checks if the entity is in a state where it can be shaved. It fails if the beard has no `bits` or if a custom `canshavetest` function is defined and returns false.
*   **Parameters:**
    *   `who` (`Entity`): The entity attempting to perform the shave.
    *   `whithwhat` (`Entity`): The tool being used for shaving.

### `Shave(who, withwhat)`
*   **Description:** Executes the shaving action. This reverts the beard's growth to the previous stage, spawns the defined `prize` item, grants a small sanity boost if the entity shaves itself, and pushes a "shaved" event.
*   **Parameters:**
    *   `who` (`Entity`): The entity performing the shave.
    *   `withwhat` (`Entity`): The tool used for shaving.

### `AddCallback(day, cb)`
*   **Description:** Registers a callback function to be executed when the beard reaches a specific number of growth days. This is typically used to change the entity's appearance to match the beard length.
*   **Parameters:**
    *   `day` (`number`): The day of growth on which to trigger the callback.
    *   `cb` (`function`): The function to execute. It receives the entity instance and the current `skinname` as arguments.

### `Reset()`
*   **Description:** Resets the beard's growth state to zero. It sets `daysgrowth` and `bits` to 0 and triggers the `onreset` callback if one is defined.
*   **Parameters:** None.

### `SetSkin(skinname)`
*   **Description:** Applies a new skin to the beard. After setting the new skin name, it re-runs all callbacks for the current growth level to apply the new visuals.
*   **Parameters:**
    *   `skinname` (`string`): The name of the skin to apply.

### `UpdateBeardInventory()`
*   **Description:** This function manages Wilson's "beard sack" inventory. Based on the number of beard `bits` and whether the appropriate skill is unlocked, it will automatically equip, upgrade, or remove a special container item from the entity's `BEARD` equip slot.
*   **Parameters:** None.

## Events & Listeners

*   **Listens For `ms_respawnedfromghost` on `inst`:** When the entity respawns from a ghost, this listener triggers `Reset()` to remove the beard.
*   **Listens For `cycles` on `TheWorld`:** When growth is enabled, the component listens for the world's day-night cycle changes to advance `daysgrowth`.
*   **Pushes `shaved` on `inst`:** This event is pushed to the entity after it has been successfully shaved.
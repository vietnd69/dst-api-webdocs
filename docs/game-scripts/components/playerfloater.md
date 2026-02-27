---
id: playerfloater
title: Playerfloater
description: A component that manages the equippable state and deployment behavior of player-held items, ensuring they can be temporarily equipped and later released or reset.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 4675dcd6
---

# Playerfloater

## Overview
The `PlayerFloater` component is attached to entities (typically items) that are intended to be temporarily equipped by a player—most commonly used for tools or items that behave like "floating" accessories (e.g., flippers, umbrellas). It coordinates with the `equippable` component to manage equip/unequip logic, enforces that the item cannot be unequipped by normal means, and provides helper functions to deploy, release, and reset the item on a player.

## Dependencies & Tags
- Adds the tag `"playerfloater"` to the entity in the constructor and removes it upon removal from the entity.
- Internally depends on the `equippable` component (added/removed dynamically).
- Requires the `inventory` component to be present on the player entity for its deployment and reset functions.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `onequipfn` | `function?` | `nil` | Callback function invoked when the item is equipped. |
| `onunequipfn` | `function?` | `nil` | Callback function invoked when the item is unequipped (via internal logic only). |

## Main Functions

### `OnRemoveFromEntity()`
* **Description:** Removes the `"playerfloater"` tag from the entity when the component is removed.
* **Parameters:** None.

### `SetOnEquip(fn)`
* **Description:** Sets the callback function to be invoked upon equip, and (if the `equippable` component exists) immediately registers it.
* **Parameters:**  
  - `fn` (`function`): A callback function with signature `fn(inst, owner)`.

### `SetOnUnequip(fn)`
* **Description:** Stores a callback function for later use when the item is unequipped via internal logic (e.g., in `OnUnequip` handler).
* **Parameters:**  
  - `fn` (`function`): A callback function with signature `fn(inst, owner)`.

### `MakeEquippable_Internal()`
* **Description:** Adds the `equippable` component (if not already present) and configures it with the equip/unequip callbacks and prevents unequipping by default (via `SetPreventUnequipping(true)`).
* **Parameters:** None.

### `AutoDeploy(player)`
* **Description:** Equips the item on the given player, clearing their hands and closing any equipped containers (e.g., backpacks) in the body slot first.
* **Parameters:**  
  - `player` (`Entity`): The player entity to which the item is deployed.

### `LetGo(player, randomdir, pos)`
* **Description:** Allows the item to be unequipped by disabling protection and dropping it at the specified position/direction.
* **Parameters:**  
  - `player` (`Entity`): The player holding the item.  
  - `randomdir` (`boolean`): Whether to drop the item with random direction.  
  - `pos` (`Vector3?`): The position to drop the item at (`nil` defaults to player position).

### `Reset(player)`
* **Description:** Unequips the item (temporarily disabling protection), returns it to the player’s inventory without dropping it, and keeps it available for future equip attempts.
* **Parameters:**  
  - `player` (`Entity`): The player currently holding the item.

### `OnSave()`
* **Description:** Returns a save data table indicating whether the item is currently equipped.
* **Parameters:** None.  
* **Returns:** `{ equipped = true }` if `equippable` is present; otherwise `nil`.

### `OnLoad(data, ents)`
* **Description:** Restores the `equippable` component if the item was equipped at save time.
* **Parameters:**  
  - `data` (`table`): The saved data, expected to have `equipped = true`.  
  - `ents`: (Unused) Reference to entity map (retained for compatibility).

### `LoadPostPass(ents, data)`
* **Description:** Ensures that if the item was *not* equipped during load (e.g., loaded via inventory path), the `equippable` component is removed to avoid stale state.
* **Parameters:**  
  - `ents`: Reference to loaded entities (unused).  
  - `data`: Loaded save data.

## Events & Listeners
- Listens for `"unequip"` event via the `equippable` component’s internal setup: triggers the stored `onunequipfn`, then removes the `equippable` component.  
- (No direct `inst:ListenForEvent` calls; event handling occurs indirectly through the `equippable` component’s callbacks.)
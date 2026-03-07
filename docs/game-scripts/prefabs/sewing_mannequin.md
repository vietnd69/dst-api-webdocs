---
id: sewing_mannequin
title: Sewing Mannequin
description: Acts as a wearable equipment storage and equipment-swap target for players using the Stageplay Set crafting recipe.
tags: [crafting, inventory, equipment, interactive]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: cedb06da
system_scope: crafting
---

# Sewing Mannequin

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `sewing_mannequin` prefab functions as a stationary, interactive structure used in the Stageplay Set mod. It stores equipped items (Hands, Head, Body slots) and enables player-to-mannequin equipment swapping when activated. It integrates with components like `inventory`, `trader`, `activatable`, `burnable`, and `workable` to manage item storage, durability, and interaction states. It supports saving/loading, sound and animation feedback, and special burn behavior.

## Usage example
```lua
local inst = CreateEntity()
-- After building via the Sewing Mannequin recipe (handled automatically):
-- The prefab already includes all components and configuration.
-- To interact programmatically:
inst.components.inventory:Equip(some_item)  -- manually equip an item
inst.components.activatable:Activate(player) -- trigger an equipment swap
```

## Dependencies & tags
**Components used:** `talker`, `inspectable`, `lootdropper`, `stageactor`, `inventory`, `trader`, `workable`, `activatable`, `savedrotation`, `colouradder`, `bloomer`, `burnable`, `hauntable`, `fueled`, `burner`, `smouldering`, `shadow`, `light`, `minimap`, `network`  
**Tags added:** `structure`, `equipmentmodel`, `rotatableobject`, `stageactor`  

## Properties
No public properties are defined or exposed directly on the prefab instance itself. The component behaviors are configured via internal functions and component property assignments (e.g., `inst.components.talker.colour`).

## Main functions
### `OnActivate(inst, doer)`
*   **Description:** Handles the activation (e.g., right-click) of the mannequin to perform an equipment swap between the mannequin and the player. Resets its inactivity timer and plays the swap animation/sound.
*   **Parameters:**  
    `doer` (Entity) – The entity activating the mannequin (typically a player).
*   **Returns:** `true` on successful swap; `false, "MANNEQUIN_EQUIPSWAPFAILED"` on failure.
*   **Error states:** Returns `false` if no equipment is available on either side to swap (though activation should only be possible when swaps are available).

### `become_inactive(inst)`
*   **Description:** Sets the `activatable` component's `inactive` state to `true` after a 5-frame delay. Prevents further activations until reactivated.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `onhammered(inst)`
*   **Description:** Called when the mannequin is fully hammered (workable work left reaches zero). Drops loot (including smoldered variants if burning), spawns a `collapse_small` fx entity, and removes the mannequin instance.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `onhit(inst)`
*   **Description:** Called on each hammer strike. Plays the "hit" animation and sound, resets to "idle", and drops all equipped and inventory items if not already burnt.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `has_any_equipment(inst)`
*   **Description:** Helper that checks whether the mannequin has any items equipped in its Hands, Head, or Body slots.
*   **Parameters:** None.
*   **Returns:** `boolean` – `true` if at least one equipment slot contains an item.
*   **Error states:** None.

### `CanSwap(inst, doer)`
*   **Description:** Determines whether an equipment swap is possible between the mannequin and the doer. Returns true if either side has items in Hands, Head, or Body slots.
*   **Parameters:**  
    `doer` (Entity) – The entity attempting to swap (typically a player).
*   **Returns:** `boolean` – Whether a swap is possible.
*   **Error states:** None.

### `mannequin_onburnt(inst)`
*   **Description:** Burnt-state handler. Removes `trader` and `activatable` components if present, drops all items from the inventory, and calls the default burnt-structure function.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnActivate(inst, doer)`
*   **Description:** Handles the activation (e.g., right-click) of the mannequin to perform an equipment swap between the mannequin and the player. Resets its inactivity timer and plays the swap animation/sound.
*   **Parameters:**  
    `doer` (Entity) – The entity activating the mannequin (typically a player).
*   **Returns:** `true` on successful swap; `false, "MANNEQUIN_EQUIPSWAPFAILED"` on failure.
*   **Error states:** Returns `false` if no equipment is available on either side to swap (though activation should only be possible when swaps are available).

### `should_accept_item(inst, item, doer)`
*   **Description:** Predicate used by the `trader` component to determine if an item may be accepted for equipment slot placement.
*   **Parameters:**  
    `item` (Entity) – The item being offered.  
    `doer` (Entity) – The entity offering the item.
*   **Returns:** `boolean, string` – `true, "GENERIC"` if the item is equippable and targets Hands, Head, or Body slots; otherwise `false, "GENERIC"`.

### `on_get_item(inst, giver, item)`
*   **Description:** Handler called when the `trader` component successfully accepts an item. Equips the item into the appropriate slot, dropping any existing item in that slot first.
*   **Parameters:**  
    `giver` (Entity) – The entity giving the item.  
    `item` (Entity) – The item being accepted.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `onbuilt` – Plays "place" animation and sound, sets idle animation.  
  `equip` – Plays "swap" sound (excluding during load).  
  `acting` – Plays and reverts to "swap"/"idle" animations.  
  `ontalk` – Plays the speaking sound.  
- **Pushes:** None directly; relies on components (`activatable`, `inventory`, `burnable`, `workable`, `lootdropper`) to fire standard events.
- **Save/Load hooks:**  
  `OnSave` – Sets `data.burnt = true` if the entity is burning or has the `burnt` tag.  
  `OnLoad` – Calls `burnable.onburnt` if `data.burnt` is present, restoring the burnt state.
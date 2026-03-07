---
id: bookstation
title: Bookstation
description: A crafting station that restores partially consumed books and displays visual indicators of its contents based on book count.
tags: [crafting, inventory, ui]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ffc29448
system_scope: crafting
---

# Bookstation

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `bookstation` is a structure prefab that serves as a dedicated crafting and restoration device for books in DST. It integrates with the `container`, `prototyper`, `workable`, `burnable`, and `lootdropper` components to provide interactive functionality: players can craft books using its tech tree, open/close its inventory, and repair partially used books by filling it with books (restoring their remaining uses). It dynamically updates its visual appearance to reflect how full it is with books (empty, some, more, or full).

## Usage example
```lua
local inst = SpawnPrefab("bookstation")
inst.Transform:SetPosition(x, y, z)
inst.components.prototyper:onactivate() -- triggers crafting animation
inst.components.container:AddItem(prefab_with_book_tag)
inst.components.container:DropEverything() -- empties container on hammer
```

## Dependencies & tags
**Components used:** `inspectable`, `prototyper`, `container`, `lootdropper`, `workable`, `hauntable`, `burnable`, `propagator`, `fueled`, `finiteuses`, `stackable`, `lootdropper`.  
**Tags:** Adds `structure`, `giftmachine`, `prototyper`. Checks `burnt`, `book`, `bookbuilder`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_activecount` | number | `0` | Tracks active crafting/activation operations to manage sound and animation state. |
| `_activetask` | FutureTask or `nil` | `nil` | Reference to the task handling the post-crafting delay; used to cancel overlapping activations. |
| `RestoreTask` | PeriodicTask or `nil` | `nil` | Task that periodically restores books while at least one book remains in the container. |

## Main functions
### `onhammered(inst, worker)`
*   **Description:** Handles hammering the bookstation. Extinguishes fires, drops all container contents, drops loot (with burnt override logic), spawns a collapse effect, and removes the entity.
*   **Parameters:** `inst` (Entity) – the bookstation instance; `worker` (Entity) – the player performing the action (unused).
*   **Returns:** Nothing.

### `onactivate(inst)`
*   **Description:** Initiates the crafting animation and sound when the bookstation is used (via recipe selection or gift opening). Sets up a delayed callback (`doonact`) and a timer task (`doneact`) to reset animation state.
*   **Parameters:** `inst` (Entity) – the bookstation instance.
*   **Returns:** Nothing.
*   **Error states:** Exits early if the entity has the `burnt` tag.

### `RestoreBooks(inst)`
*   **Description:** Iterates over all items in the container and restores partially used books up to 100% charge, applying a bonus multiplier if any player in range has the `bookbuilder` tag.
*   **Parameters:** `inst` (Entity) – the bookstation instance.
*   **Returns:** Nothing.

### `UpdateBookAesthetics(inst, countoverride)`
*   **Description:** Controls the visual state of the bookstation (via `AnimState`) to show different levels of book content: none, some, more, or full. Uses named layers `empty`, `mid`, `full`.
*   **Parameters:** `inst` (Entity) – the bookstation instance; `countoverride` (number or `nil`) – if provided, skips `CountBooks()` and uses this value directly.
*   **Returns:** Nothing.

### `ItemGet(inst)`
*   **Description:** Callback triggered when an item is added to the container. Starts the periodic `RestoreBooks` task if at least one `book` tag item is present, and updates aesthetics.
*   **Parameters:** `inst` (Entity) – the bookstation instance.
*   **Returns:** Nothing.

### `ItemLose(inst)`
*   **Description:** Callback triggered when an item is removed from the container. Cancels the restore task if no books remain, and updates aesthetics.
*   **Parameters:** `inst` (Entity) – the bookstation instance.
*   **Returns:** Nothing.

### `CountBooks(inst)`
*   **Description:** Helper that calculates the fraction of book items (tag `book`) in the container relative to total slots.
*   **Parameters:** `inst` (Entity) – the bookstation instance.
*   **Returns:** number – ratio of book items (0 to 1).
*   **Error states:** Returns `0` if `container` component is missing.

### `onbuilt(inst, data)`
*   **Description:** Runs after placement. Plays the `place` animation sequence and emits a placement sound.
*   **Parameters:** `inst` (Entity) – the bookstation instance.
*   **Returns:** Nothing.

### `onsave(inst, data)`
*   **Description:** Saves the burnt state of the bookstation to the save data.
*   **Parameters:** `inst` (Entity) – the bookstation instance; `data` (table) – the save table.
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Loads burnt state from save data. Calls `onburnt` callback if the burnt flag was persisted.
*   **Parameters:** `inst` (Entity) – the bookstation instance; `data` (table or `nil`) – the loaded save data.
*   **Returns:** Nothing.

### `onturnon(inst)`
*   **Description:** Starts the proximity loop animation (e.g., `proximity_loop`) and kills idle sound when activated and not burnt.
*   **Parameters:** `inst` (Entity) – the bookstation instance.
*   **Returns:** Nothing.

### `onturnoff(inst)`
*   **Description:** Restarts the idle animation and kills proximity loop sound when deactivated and not burnt.
*   **Parameters:** `inst` (Entity) – the bookstation instance.
*   **Returns:** Nothing.

### `doneact(inst)`
*   **Description:** Clears the `_activetask` reference and resets animation/sound based on current prototyper `on` state.
*   **Parameters:** `inst` (Entity) – the bookstation instance.
*   **Returns:** Nothing.

### `doonact(inst)`
*   **Description:** Decrements `_activecount` and kills the active sound if the count reaches `0`.
*   **Parameters:** `inst` (Entity) – the bookstation instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onbuilt` – triggers `onbuilt` handler after placement. `itemget` – triggers `ItemGet` when an item is added to the container. `itemlose` – triggers `ItemLose` when an item is removed. `ms_giftopened` – triggers `onactivate` when opened as a gift. `death` (via `burnable` component) – handled by `burnable` internally.
- **Pushes:** `onextinguish` (via `burnable:Extinguish`); entity removal (`inst:Remove()`) after hammering; loot drop events (`entity_droploot`, via `lootdropper`).

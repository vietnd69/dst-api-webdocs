---
id: playbill_lecturn
title: Playbill Lecturn
description: Manages the interactive lecturn that displays and tracks the current playbill, synchronizes with the stage performance, and handles playbill item swapping.
tags: [inventory, performance, stage]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: dd843f39
system_scope: entity
---

# Playbill Lecturn

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Playbill_Lecturn` manages the lecturn entity that holds and displays a `playbill_item`, which drives the active play performance. It integrates with the `playbill`, `writeable`, `lootdropper`, and `stageactingprop` components to synchronize script content, cast lists, and visual presentation. When a new playbill is inserted, it updates the lecturn’s displayed text, replaces the current stage performance data, and handles serialization for save/load.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("playbill_lecturn")
inst:AddComponent("writeable")
inst:AddComponent("lootdropper")
inst.components.playbill_lecturn:SetStage(stage_entity)
local playbill = MakeItem("playbill")
inst.components.playbill_lecturn:SwapPlayBill(playbill, doer)
```

## Dependencies & tags
**Components used:** `playbill`, `writeable`, `lootdropper`, `stageactingprop`, `inventory`  
**Tags:** Adds `playbill_lecturn` on entity creation; removes `playbill_lecturn` on removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the owning entity. Set in constructor. |
| `playbill_item` | `Entity?` | `nil` | The current playbill item held by the lecturn. `nil` if empty. |
| `stage` | `Entity?` | `nil` | Reference to the associated stage entity, used to propagate performance data. |
| `onstageset` | `function?` | `nil` | Optional callback invoked when `SetStage` is called. |

## Main functions
### `OnRemoveEntity()`
* **Description:** Removes the `playbill_lecturn` tag from the entity. Also aliased as `OnRemoveFromEntity`.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetStage(stage)`
* **Description:** Assigns the stage entity this lecturn should interact with. Optionally invokes the `onstageset` callback.
* **Parameters:** `stage` (`Entity?`) — the stage entity to link.
* **Returns:** Nothing.

### `ChangeAct(next_act)`
* **Description:** Updates the current act on the held playbill and refreshes the displayed text.
* **Parameters:** `next_act` (`string`) — key identifying the new act in `playbill.scripts`.
* **Returns:** Nothing.
* **Error states:** No effect if `playbill_item` is `nil`.

### `UpdateText()`
* **Description:** Builds and displays the current playbill’s script and cast list in the lecturn’s `writeable` component. Fires `text_changed` event.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No effect if `playbill_item` is `nil`.

### `SwapPlayBill(playbill, doer)`
* **Description:** Replaces the current playbill item with a new one, handling cleanup of the old item, updating visual overrides, and synchronizing with the stage. If `doer` is provided, it removes the new playbill from the doer’s inventory and resets its act to the starting act.
* **Parameters:**  
  - `playbill` (`Entity`) — new playbill item to insert.  
  - `doer` (`Entity?`) — entity performing the swap (e.g., player), used to deduct the item.
* **Returns:** Nothing.
* **Error states:** If `playbill_item` is present and has a `book_build`, the override is cleared before applying the new one.

### `OnSave()`
* **Description:** Serializes the GUID of the held `playbill_item` for save-game persistence.
* **Parameters:** None.
* **Returns:** `data` (`table`) containing `playbill_item_id` (GUID string or `nil`), and `refs` (`table`) containing GUID references.

### `LoadPostPass(newents, data)`
* **Description:** Restores the `playbill_item` after entity loading by referencing the stored GUID and scheduling `SwapPlayBill` via a zero-delay task.
* **Parameters:**  
  - `newents` (`table`) — mapping of GUIDs to loaded entities.  
  - `data` (`table`) — saved component data containing `playbill_item_id`.
* **Returns:** Nothing.
* **Error states:** No effect if `playbill_item_id` is missing or not found in `newents`.

## Events & listeners
- **Listens to:** None.
- **Pushes:** `text_changed` — fired after `UpdateText()` modifies the displayed text.

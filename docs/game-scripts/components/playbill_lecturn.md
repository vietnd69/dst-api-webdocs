---
id: playbill_lecturn
title: Playbill Lecturn
description: This component manages the display, swapping, and text rendering of a playbill item on alecturn entity in DST.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: dd843f39
---

# Playbill Lecturn

## Overview
The `Playbill_Lecturn` component is responsible for attaching a playbill item to a lecturn entity, updating the lecturn's visible text (based on the playbill's script and cast), and managing transitions—including swapping in a new playbill, updating animations, registering the playbill with a stage (if attached), and persisting the playbill across saves via GUID references.

## Dependencies & Tags
- **Tags Added:** `"playbill_lecturn"` (added in constructor, removed on entity removal).
- **Component Assumptions (not directly added by this script, but required on `self.inst`):**
  - `writeable` (used in `UpdateText()` for setting displayed text)
  - `lootdropper` (used in `SwapPlayBill()` to fling removed playbills)
  - `animstate` (used for animation playback)
- **Component Assumptions (on the `playbill_item` passed to `SwapPlayBill`):**
  - `playbill` (provides `SetCurrentAct`, `starting_act`, `scripts`, `cast`, `costumes`, `book_build`)
  - `inventory` (if `doer` is provided, used to remove the item)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity the component is attached to. Assigned in `_ctor`. |
| `playbill_item` | `Entity?` | `nil` | Reference to the currently inserted playbill item. `nil` if empty. |
| `stage` | `Entity?` | `nil` | Reference to an optional stage entity this lecturn is associated with. Set via `SetStage()`. |
| `onstageset` | `function?` | `nil` | Optional callback invoked when `SetStage()` is called. Not used internally except in `SetStage`. |

## Main Functions

### `SetStage(stage)`
* **Description:** Stores the given stage entity and invokes the optional `onstageset` callback. Does *not* automatically register the current playbill with the stage; `SwapPlayBill` handles registration when a playbill is inserted.
* **Parameters:**  
  `stage` (*Entity?*): The stage entity to associate with this lecturn.

### `ChangeAct(next_act)`
* **Description:** Changes the active act of the current playbill and updates the lecturn’s displayed text accordingly. Does *not* change animations or interact with the stage.
* **Parameters:**  
  `next_act` (*string*): The name of the act to switch to.

### `UpdateText()`
* **Description:** Reads the current act’s script from the playbill, constructs a formatted string containing the script title followed by the cast list, and writes it to the lecturn’s `writeable` component. Pushes the `"text_changed"` event afterward.
* **Parameters:** None.

### `SwapPlayBill(playbill, doer)`
* **Description:** Replaces the current playbill with a new one. Handles returning the old playbill to the scene (flinging it), updating the lecturn’s visual representation (animation, override build), associating the new playbill with the stage (if present), updating displayed text, and managing inventory (if `doer` is provided).
* **Parameters:**  
  `playbill` (*Entity*): The new playbill item to insert.  
  `doer` (*Entity?*): Optional entity performing the swap; its inventory will have the playbill removed, and its new act will be reset to `starting_act`.

### `OnSave()`
* **Description:** Returns serializable data for persistence, specifically the GUID of the currently inserted playbill (if any). Returns both the data table and a list of referenced entity GUIDs for world load post-processing.
* **Parameters:** None.

### `LoadPostPass(newents, data)`
* **Description:** Loads and reconnects the saved playbill item after entity reconstruction. Delegates actual reattachment to `SwapPlayBill` via a deferred task (via `loadplaybill_postpass`).
* **Parameters:**  
  `newents` (*table*): Map of GUID → entity data for newly reconstructed entities.  
  `data` (*table*): The saved data from `OnSave()`.

## Events & Listeners
- **Listens to:** *None*  
- **Triggers/Pushes:**  
  - `"text_changed"` (emitted in `UpdateText()` after text is updated)
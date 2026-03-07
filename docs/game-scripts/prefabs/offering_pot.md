---
id: offering_pot
title: Offering Pot
description: Manages a structure that collects kelp to summon and hire merms, including support for upgraded variants and merm-calling mechanics.
tags: [crafting, entity, npc, inventory, structure]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f8649a6a
system_scope: entity
---

# Offering Pot

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `offering_pot` prefab defines a structure that accepts kelp as decoration, provides visual feedback via kelp layers, and enables merms to gather from it to be hired. It integrates with several core systems: `container` for item storage, `workable` for hammer interactions, `burnable` for fire mechanics, `activatable` for merm interaction, and `placer` for placement preview. The prefab supports two variants—standard and upgraded—and includes logic for networked state, saving/loading, and merm recruitment.

## Usage example
```lua
-- Create a standard offering pot
local pot = Prefabs.offering_pot and Prefabs.offering_pot()

-- Create an upgraded offering pot
local pot_upgraded = Prefabs.offering_pot_upgraded and Prefabs.offering_pot_upgraded()

-- Add kelp to trigger merm summoning
if pot and pot.components.container then
    local kelp = SpawnPrefab("kelp")
    pot.components.container:InsertItem(kelp)
end
```

## Dependencies & tags
**Components used:** `lootdropper`, `inspectable`, `container`, `workable`, `activatable`, `placer`, `deployhelper`, `burnable`, `fueled`, `hauntable`, `soundemitter`, `animstate`, `transform`, `minimapentity`, `network`, `buoyant`
**Tags added:** `structure`, `offering_pot`, `placer`
**Tags checked:** `merm_builder`, `burnt`

## Properties
No public properties are initialized directly in the constructor. State is managed via component properties (e.g., `container.numslots`, `burnable.burning`) and internal fields stored on `inst` (e.g., `inst._upgraded`, `inst.merm_caller`, `inst.caller_task`).

## Main functions
### `OnBuiltFn(inst)`
*   **Description:** Executed upon successful placement of the structure. Plays the `place` animation and associated sound.
*   **Parameters:** `inst` (entity instance) - the offering pot instance.
*   **Returns:** Nothing.
*   **Error states:** None; ensures correct sound and animation for standard or upgraded variants.

### `UpdateDecor(inst, data)`
*   **Description:** Updates visual kelp layers and plays a sound when kelp items are added or removed. Triggers a world event to notify clients of state changes.
*   **Parameters:** `inst` (entity instance), `data` (unused) - event payload.
*   **Returns:** Nothing.

### `GetStatus(inst)`
*   **Description:** Returns a localization key string representing kelp count status: `"LOTS_OF_KELP"`, `"SOME_KELP"`, or `nil`.
*   **Parameters:** `inst` (entity instance).
*   **Returns:** string or `nil`.

### `OnActivate(inst, doer)`
*   **Description:** Activates merm recruitment when a merm builder (with tag `merm_builder`) interacts with the pot. Sets `merm_caller`, starts a periodic task to validate the merm’s proximity, and sends an announcement.
*   **Parameters:** `inst` (entity instance), `doer` (entity instance) - the interacting merm.
*   **Returns:** `true` if successful; `false` otherwise.

### `CanActivateFn(inst, doer)`
*   **Description:** Validates if a merm can activate the offering pot. Checks for burnt state, container presence, merm builder tag, existing caller conflict, and non-empty container.
*   **Parameters:** `inst` (entity instance), `doer` (entity instance).
*   **Returns:** `true` and optional error message (`"NOTMERM"`, `"HASMERMLEADER"`, `"NOKELP"`).

### `AnswerCall(inst, merm)`
*   **Description:** Gives a kelp item to the recruiting merm, triggers merm hiring logic, and attempts to make the merm eat the kelp.
*   **Parameters:** `inst` (entity instance), `merm` (entity instance) - the merm responding to the call.
*   **Returns:** Nothing.

### `OnHammered(inst)`
*   **Description:** Called when the offering pot is fully hammered. Drops all loot, empties the container, spawns a collapse effect, and removes the entity.
*   **Parameters:** `inst` (entity instance).
*   **Returns:** Nothing.

### `OnBurnt(inst, ...)`
*   **Description:** Handles burnt state transitions. Calls default burnt behavior, removes merm caller associations, and removes the `activatable` component.
*   **Parameters:** `inst` (entity instance), `...` - additional arguments from burn chain.
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Saves burnt state to the save data.
*   **Parameters:** `inst` (entity instance), `data` (table) - save data table.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Loads burnt state and triggers burnt logic if applicable.
*   **Parameters:** `inst` (entity instance), `data` (table) - loaded save data.
*   **Returns:** Nothing.

### `RemoveMermCaller(inst)`
*   **Description:** Clears `merm_caller`, cancels the periodic gathering task, and deactivates the activatable component.
*   **Parameters:** `inst` (entity instance).
*   **Returns:** Nothing.

### `ValidateMermGathering(inst)`
*   **Description:** Periodically checks if the merm caller is still valid (nearby, alive, and within 20 units). Clears the caller if invalid.
*   **Parameters:** `inst` (entity instance).
*   **Returns:** Nothing.

### `_IsKelp(item)`
*   **Description:** Helper predicate to check if an item prefab is `"kelp"`.
*   **Parameters:** `item` (entity or item instance).
*   **Returns:** boolean.

## Events & listeners
- **Listens to:**
  - `itemget` - triggers `UpdateDecor` when an item is added.
  - `itemlose` - triggers `UpdateDecor` when an item is removed.
- **Pushes:**
  - `ms_updateofferingpotstate` - sent when kelp count changes or the pot is removed to synchronize state with clients. Data includes `inst` and `count`.

---
id: ghostbabysitter
title: Ghostbabysitter
description: Manages which ghost entities a player is currently babysitting and handles associated tags and lifecycle events.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: e3f27c81
---

# Ghostbabysitter

## Overview
The `Ghostbabysitter` component tracks which ghost entities a player is currently babysitting, manages associated entity tags (`inactive`, `activatable_forceright`), and synchronizes state during save/load operations. It ensures proper updates only when actively babysitting at least one ghost.

## Dependencies & Tags
- **Tags Added/Removed:** `inactive`, `activatable_forceright`
- **No other components are added or depended upon.**

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity the component is attached to (typically a player). |
| `inactive` | `boolean` | `true` | Whether the entity is currently considered inactive (used to toggle the `inactive` tag). |
| `forcerightclickaction` | `boolean` | `false` | Indicates if the entity should gain the `activatable_forceright` tag. |
| `babysitting` | `table (set)` | `{}` | Dictionary of ghost entities being babysitted; key is ghost entity, value is `true`. |
| `updatefn` | `function?` | `nil` | Optional callback function invoked on each `OnUpdate` call with signature `(inst, self, dt)`. |

## Main Functions

### `OnRemoveFromEntity()`
* **Description:** Cleans up tags when the component is removed from its entity.
* **Parameters:** None.

### `IsBabysittingGhost(ghost)`
* **Description:** Returns `true` if the given ghost entity is currently being babysitted; otherwise returns `nil`.
* **Parameters:**
  - `ghost` (`Entity`): The ghost entity to check.

### `AddGhost(ghost)`
* **Description:** Registers a ghost as being babysitted and starts component updates.
* **Parameters:**
  - `ghost` (`Entity`): The ghost entity to begin babysitting.

### `RemoveGhost(ghost)`
* **Description:** Removes a ghost from the babysitting list and stops component updates if no ghosts remain.
* **Parameters:**
  - `ghost` (`Entity`): The ghost entity to stop babysitting.

### `GetDebugString()`
* **Description:** Returns a string representation of the `inactive` state for debugging purposes.
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** Invokes the optional `updatefn` callback (if set), passing the entity, component instance, and delta time.
* **Parameters:**
  - `dt` (`number`): Time since last update.

### `LoadPostPass(newents, savedata)`
* **Description:** Called after loading; re-establishes babysitting relationships by assigning babysitter references on loaded ghosts.
* **Parameters:**
  - `newents` (`table`): Mapping of GUIDs to loaded entity data.
  - `savedata` (`table`): Saved data containing GUIDs of babysat ghosts under `savedata.babysitting`.

### `OnSave()`
* **Description:** serializes current babysitting state for saving, returning GUIDs of all babysat ghosts.
* **Parameters:** None.
* **Returns:**
  - `data` (`table`): Contains `babysitting` array of ghost GUIDs.
  - `ents` (`table`): List of ghost GUIDs being saved (for dependency tracking).

### `OnLoad(data)`
* **Description:** No-op placeholder; currently unused as all loading logic resides in `LoadPostPass`.
* **Parameters:**
  - `data` (`table?`): Raw saved data (unused in this implementation).

## Events & Listeners
- Listens for internal tag updates via `inactive` setter:
  - `inst:AddOrRemoveTag("inactive", inactive)`
  - `inst:AddOrRemoveTag("activatable_forceright", forcerightclickaction)`
- Pushes the event `"set_babysitter"` on each ghost entity during `LoadPostPass` to notify it of its babysitter.
- Listens for external changes via `inactive` and `forcerightclickaction` functions (assigned in class static methods).
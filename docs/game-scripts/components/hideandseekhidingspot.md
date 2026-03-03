---
id: hideandseekhidingspot
title: Hideandseekhidingspot
description: Manages the logic for a location where a Hider entity can be concealed, including spawn, eviction, and cleanup.
tags: [hiding, gameplay, entity, persistence]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f0299efe
system_scope: entity
---

# Hideandseekhidingspot

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Hideandseekhidingspot` is a component attached to a static entity to act as a designated hiding location in Hide-and-Seek gameplay. It stores a reference to a `hider` entity (typically a Kitcoon), positions a temporary visual prop to represent the hidden state, and handles eviction when the spot is disturbed (e.g., picked, opened, or damaged). It interacts closely with the `hideandseekhider` component, which represents the hidden entity itself.

## Usage example
```lua
local spot = CreateEntity()
spot:AddComponent("hideandseekhidingspot")
-- Later, when a hider arrives:
spot.components.hideandseekhidingspot:HideInSpot(hider_entity)
-- To reveal or remove the hider early:
spot.components.hideandseekhidingspot:SearchHidingSpot(doer)
-- To abort hiding without revealing:
spot.components.hideandseekhidingspot:Abort()
```

## Dependencies & tags
**Components used:** `hideandseekhider`, `Transform`, `AnimState`, `Follower`
**Tags:** Listens for `"ms_collecthiddenkitcoons"` on `TheWorld` to report itself as a valid hiding spot.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance the component is attached to. |
| `hider` | `Entity` | `nil` | The hidden entity (e.g., Kitcoon) currently occupying this spot. |
| `hiding_prop` | `Prefab` | `nil` | A temporary visual prop (e.g., a bush, crate) that represents the hidden entity visually. |
| `finder` | `Entity` | `nil` | The entity that triggered eviction/reveal of the hider. |

## Main functions
### `SetHider(hider)`
*   **Description:** Assigns a `hider` entity to this spot without immediately hiding it (allows time for the hider to arrive). Registers an `"onremove"` callback to clean up if the hider is removed prematurely.
*   **Parameters:** `hider` (`Entity`) — the entity that will hide in this spot.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if a hider is already assigned (`self.hider ~= nil`).

### `HideInSpot(hider)`
*   **Description:** Places the `hider` into a hidden state: attaches its entity to the spot, removes its world scene, spawns and configures a `hiding_prop` visual, and registers eviction callbacks on the prop.
*   **Parameters:** `hider` (`Entity`) — the entity to hide; also calls `SetHider(hider)`.
*   **Returns:** Nothing.
*   **Error states:** Relies on `hider._hiding_prop` being defined and valid; no explicit error handling if missing.

### `SearchHidingSpot(doer)`
*   **Description:** Releases the hider (if any) from the hiding spot, effectively revealing them. Removes the component from the spot entity afterward.
*   **Parameters:** `doer` (`Entity?`) — the entity performing the search/reveal. Passed to `hider.components.hideandseekhider:Found(doer)`.
*   **Returns:** Nothing.

### `Abort()`
*   **Description:** Aborts hiding without revealing the hider. Releases the hider (if any), but does *not* call `hider.components.hideandseekhider:Found()`. Removes the component from the spot.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnRemoveEntity()`
*   **Description:** Cleanup method called when the spot entity is removed from the world. Releases any active hider but does *not* fire `"onhidingspotremoved"` or remove the `hiding_prop`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnRemoveFromEntity()`
*   **Description:** Full cleanup method called when the component is removed from the spot entity. Releases hider, removes event listeners, fires `"onhidingspotremoved"`, and destroys `hiding_prop`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Serializes the state for persistence: includes a save record of the hidden `hider` (if any), or an empty record if empty.
*   **Parameters:** None.
*   **Returns:** `data`, `refs` — where `data.hider_saverecord` contains the hider’s save data if hidden.

### `OnLoad(data, newents)`
*   **Description:** Restores hidden state after loading. If `data.hider_saverecord` exists, it spawns the hider and calls `HideInSpot`.
*   **Parameters:**  
    `data` (table) — save data containing optional `hider_saverecord`.  
    `newents` (table) — mapping from old to new entity IDs for save/restore cross-referencing.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a debug-friendly string identifying the current hider prefab (or `"This component should not be here!"` if `hider` is `nil`).
*   **Parameters:** None.
*   **Returns:** `string` — debug description.

## Events & listeners
- **Listens to:**  
  - `"ms_collecthiddenkitcoons"` on `TheWorld` — adds `self.inst` to `data.hidingspots`.  
  - `"onremove"` on `self.hider` — triggers `onremove_hider` cleanup.  
  - `"picked"`, `"worked"`, `"onignite"`, `"onopen"`, `"onactivated"`, `"onpickup"` on `self.hiding_prop` — triggers `evict_fn`, which calls `SearchHidingSpot`.
- **Pushes:**  
  - `"onhidingspotremoved"` — fired during `OnRemoveFromEntity`, with `{finder = self.finder}`.

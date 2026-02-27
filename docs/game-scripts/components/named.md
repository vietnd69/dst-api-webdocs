---
id: named
title: Named
description: Manages custom naming logic for entities, including name generation, persistence, and network synchronization.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 96e9e92b
---

# Named

## Overview
The `Named` component provides functionality for assigning, storing, and synchronating custom names to entities. It handles name selection from a pool of possible names, name assignment (with optional authorship tracking), and persistence across saves. When a name is set, it updates both the local entity state and the network replica for synchronization in multiplayer.

## Dependencies & Tags
- **Component Dependencies:**  
  - `replica.named` — Required for network replication of the name and author (via `self.inst.replica.named:SetName(...)`).
- **No explicit tag additions or removals.**

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(inherited from constructor)* | Reference to the owning entity instance. |
| `possiblenames` | `table (array of strings)` | `nil` | Optional list of candidate names; used by `PickNewName()`. |
| `nameformat` | `string?` | `nil` | Optional format string for processing `self.name` (e.g., `"Mr. %s"`). |
| `name` | `string?` | `nil` | The resolved/custom name string. |
| `name_author_netid` | `number?` | `nil` | The network user ID of the player who assigned the name (platform ID, not Kunai ID). |

## Main Functions

### `DoSetName(self)`
* **Description:** Applies the current name and author info to the entity and synchronizes it via the `replica.named` interface. Handles optional string formatting via `self.nameformat`.
* **Parameters:**  
  - `self` — The `Named` component instance.

### `PickNewName(self)`
* **Description:** Randomly selects a name from the `possiblenames` list (if defined and non-empty), then sets it via `DoSetName`.
* **Parameters:**  
  - `self` — The `Named` component instance.

### `SetName(self, name, author)`
* **Description:** Explicitly sets the entity's name and optional author. If `name` is `nil`, reverts to the default name (e.g., `STRINGS.NAMES["PIGKING"]`). Updates local state and replicates changes.
* **Parameters:**  
  - `name` (`string?`) — The desired name, or `nil` to reset to the default.  
  - `author` (`Player?`) — Optional player entity/string reference used to resolve the author's network ID via `TheNet:GetNetIdForUser()`.

### `OnSave(self)`
* **Description:** Returns a serialization table containing name-related fields if a custom name exists; otherwise, returns `nil`.
* **Parameters:**  
  - `self` — The `Named` component instance.  
* **Returns:** `table?` — Table with keys `name`, `nameformat`, `name_author_netid`, or `nil`.

### `OnLoad(self, data)`
* **Description:** Restores name-related state from saved data (e.g., after load), then applies the loaded name via `DoSetName`.
* **Parameters:**  
  - `data` (`table?`) — Saved state object, expected to contain `name`, `nameformat`, and/or `name_author_netid`.

## Events & Listeners
None.
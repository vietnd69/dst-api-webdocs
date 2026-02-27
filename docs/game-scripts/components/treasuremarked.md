---
id: treasuremarked
title: Treasuremarked
description: Manages the spawning and lifecycle of a treasure-message-marker prefab attached to an entity, such as a treasure chest.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: c80d07f4
---

# Treasuremarked

## Overview
This component handles the attachment and removal of a "message bottle treasure marker" prefab to its parent entity (typically a treasure chest). It ensures the marker is spawned when active (`TurnOn`), properly cleaned up when disabled (`TurnOff`), saved across sessions, and reloaded correctly.

## Dependencies & Tags
- **Components used:** None explicitly added or required via `AddComponent`.
- **Tags added/removed:** None identified.

## Properties

| Property | Type   | Default Value | Description |
|----------|--------|---------------|-------------|
| `inst`   | `Entity` | `nil`         | Reference to the owning entity, set in constructor. |
| `marker` | `Entity?` | `nil`         | Reference to the spawned marker prefab (`messagebottletreasure_marker`), or `nil` if not active. |

> **Note:** No `_ctor`-initialized public properties beyond `inst` and `marker` are present.

## Main Functions

### `TurnOn()`
* **Description:** Spawns the `messagebottletreasure_marker` prefab and attaches it as a child to the owner entity.
* **Parameters:** None.

### `TurnOff()`
* **Description:** Safely removes the marker entity if it exists and is still valid.
* **Parameters:** None.

### `OnRemoveFromEntity()`
* **Description:** Cleanup hook called when the component is removed from its entity. Invokes `TurnOff()` to ensure the marker is cleaned up.
* **Parameters:** None.

### `OnSave()`
* **Description:** Returns save data indicating whether the marker is currently active.
* **Parameters:** None.  
* **Returns:** `{ on = true }` if marker is present, otherwise `nil`.

### `LoadPostPass(ents, data)`
* **Description:** Restores the marker state during loading. If saved data indicates `on = true`, it calls `TurnOn()` to respawn the marker.
* **Parameters:**  
  - `ents`: Table of entities (unused in this implementation).  
  - `data`: Saved data table containing the component's state.

## Events & Listeners
None.
---
id: toadstoolspawner
title: Toadstoolspawner
description: Manages the global state and respawn logic for Toadstool Spawners in the world, including timer-based spawning and event coordination.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 70f5902d
---

# Toadstoolspawner

## Overview
This component acts as a central manager for Toadstool Spawners in the world, tracking registered spawners, maintaining a respawn timer, and triggering toadstool spawns or cancellations based on spawner state changes. It operates exclusively on the master server and orchestrates synchronization between spawner events and global spawn timing.

## Dependencies & Tags
- **Component Dependencies**: `inst` must have `TheWorld.components.worldsettingstimer` available.
- **Entity Tags**: None directly assigned to `inst`; however, it listens for and responds to events from registered spawner entities.
- **Event Listeners Registered**:
  - `"ms_registertoadstoolspawner"` on `TheWorld`
  - `"toadstoolstatechanged"`, `"toadstoolkilled"`, `"onremove"` per registered spawner

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (passed to constructor) | The owning entity instance (typically `TheWorld`), stored for reference. |
| `_spawners` | `table` | `{}` | Internal list of registered Toadstool Spawner entities. |
| `_respawntask` | `TimerTask?` | `nil` | Internal reference to the active respawn timer (managed via `_worldsettingstimer`). |

*Note: No public instance properties beyond `inst` are exposed directly.*

## Main Functions

### `IsEmittingGas()`
* **Description:** Returns whether a toadstool is currently active/spawned (i.e., no respawn timer is running). This is a performance-optimized approximation of `GetSpawnedToadstool() ~= nil`.
* **Parameters:** None.

### `OnPostInit()`
* **Description:** Called after the component’s initialization is complete. Checks if a toadstool is currently spawned and stops or restarts the respawn timer accordingly.
* **Parameters:** None.

### `OnSave()`
* **Description:** Serializes the component’s state for saving to disk. Specifically indicates whether a toadstool spawn is queued (i.e., no active respawn timer).
* **Parameters:** None.
* **Returns:** `table` with key `toadstool_queued_spawn` (boolean).

### `OnLoad(data)`
* **Description:** Restores component state after loading. Handles legacy `timetorespawn` data and restores the respawn timer state based on `toadstool_queued_spawn`.
* **Parameters:** `data` — Table containing serialized data, possibly with `timetorespawn` (number) or `toadstool_queued_spawn` (boolean).

### `GetDebugString()`
* **Description:** Returns a formatted string for debugging, showing whether a toadstool is currently active and the remaining time on the respawn timer.
* **Parameters:** None.
* **Returns:** `string` — e.g., `"Active Toadstool: ent-0x123abc  Cooldown: 45.32"`.

## Events & Listeners

- **Events Listened For:**
  - `"ms_registertoadstoolspawner"` on `TheWorld` — triggers registration of a new spawner.
  - `"toadstoolstatechanged"` on each registered spawner — updates spawn state tracking.
  - `"toadstoolkilled"` on each registered spawner — handles respawn timer reset after killing.
  - `"onremove"` on each registered spawner — removes spawner from tracking and adjusts timer.

- **Events Pushed:**
  - `"toadstoolstatechanged"` on `TheWorld` — when a spawner’s toadstool state changes.
  - `"toadstoolkilled"` on `TheWorld` — when a toadstool is destroyed/killed.
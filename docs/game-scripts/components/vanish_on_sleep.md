---
id: vanish_on_sleep
title: Vanish On Sleep
description: Schedules an entity to be removed after a 10-second delay if it remains asleep, and cancels the removal if the entity wakes up.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 17fdaff1
---

# Vanish On Sleep

## Overview
This component schedules an entity to be removed from the world after a 10-second delay if the entity remains in the "sleeping" state. If the entity wakes up before the delay elapses, the scheduled removal is cancelled. It also ensures cleanup occurs if the component is removed from the entity.

## Dependencies & Tags
- **Listeners on entity:** No explicit components are required, but it expects the entity to emit `-onsleep` and `onwake` events (handled externally, e.g., by `sleep` or similar components).
- **No tags added or removed.**

## Properties
The component initializes with no public properties in the constructor. Public behavior is controlled via the optional `vanishfn` field, which is commented out and not initialized.

However, the following internal state properties are used dynamically during operation:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `vanish_task` | `Task` (or `nil`) | `nil` | A delayed task scheduled to call `vanish()` after 10 seconds. Set in `OnEntitySleep`, cleared in `OnEntityWake` and `OnRemoveFromEntity`. |
| `vanishfn` | `function` (or `nil`) | `nil` | An optional custom callback invoked before removal in `vanish()`. Not initialized or assigned in this component — intended for external override. |

## Main Functions

### `OnEntitySleep()`
* **Description:** Begins the vanish countdown by scheduling a 10-second delayed task to call `DoVanish`, which in turn invokes the `vanish()` method. If a task is already pending, it does nothing (prevents duplicate scheduling).
* **Parameters:** None.

### `OnEntityWake()`
* **Description:** Cancels any pending vanish task if one exists, effectively aborting the scheduled removal. Sets `vanish_task` to `nil`.
* **Parameters:** None.

### `OnRemoveFromEntity()`
* **Description:** Alias for `OnEntityWake()`. Ensures any pending vanish task is cancelled when the component itself is removed from the entity.
* **Parameters:** None.

### `vanish()`
* **Description:** Executes the entity removal. First, invokes the optional `vanishfn` callback (if assigned externally) with the entity instance as its argument. Then calls `Remove()` on the entity to delete it from the world.
* **Parameters:** None.

## Events & Listeners
- **Listens for external events:** This component does *not* register event listeners itself. Instead, its methods (`OnEntitySleep`, `OnEntityWake`) are *callbacks* that must be invoked externally (e.g., by the game’s sleep system when the entity’s sleep state changes).  
- **No `inst:ListenForEvent` calls are present in this component.**
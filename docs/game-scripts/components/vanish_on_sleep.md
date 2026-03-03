---
id: vanish_on_sleep
title: Vanish On Sleep
description: Automatically removes an entity after 10 seconds of sleep, optionally invoking a custom vanish callback.
tags: [sleep, entity_lifecycle, removal]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 17fdaff1
system_scope: entity
---

# Vanish On Sleep

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Vanish_on_sleep` manages delayed removal of an entity when it enters a sleep state. It schedules a vanish task upon sleep, which executes after a 10-second delay unless the entity wakes up earlier (in which case the task is cancelled). When the task executes, it optionally calls a custom vanish callback (`self.vanishfn`) before removing the entity entirely. This component is typically attached to temporary or state-sensitive entities that should not persist while the player or world is sleeping.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("vanish_on_sleep")
-- Optional: define a custom vanish behavior
inst.components.vanish_on_sleep.vanishfn = function(ent)
    print("Vanishing", ent.prefab)
end
-- Trigger sleep state manually for testing
inst:PushEvent("entitysleep")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `vanishfn` | function? | `nil` | Optional callback invoked before entity removal. Receives `inst` as its sole argument. |
| `vanish_task` | Task? | `nil` | Internal task reference for the scheduled vanish. Set only while the entity is sleeping. |

## Main functions
### `OnEntitySleep()`
*   **Description:** Starts a 10-second delay task to remove the entity. If a task is already scheduled (e.g., repeated sleep events), it does nothing.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnEntityWake()`
*   **Description:** Cancels any pending vanish task and clears the task reference. Called automatically when the entity wakes.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnRemoveFromEntity()`
*   **Description:** Alias for `OnEntityWake()`. Cancels the vanish task when the component is removed from the entity.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `vanish()`
*   **Description:** Executes the vanish logic — calls `vanishfn` (if set) and then removes the entity.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `entitysleep` (via `OnEntitySleep()` handler) — triggers scheduling of the vanish task.  
- **Listens to:** `entitywake` (via `OnEntityWake()` handler) — cancels the vanish task.  
- **Pushes:** None identified

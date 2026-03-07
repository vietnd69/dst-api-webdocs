---
id: walkingplankuser
title: Walkingplankuser
description: Manages a player's or entity's current mounting state on a walking plank.
tags: [locomotion, mounting, utility]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 4d0c2835
system_scope: locomotion
---
# Walkingplankuser

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`WalkingPlankUser` tracks and manages an entity's current mounting state on a walking plank. It holds a reference to the currently mounted plank, sets up an event listener to clear that reference when the plank is removed, and provides a method to safely dismount by calling `StopMounting()` on the plank.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("walkingplankuser")

-- Mount a walking plank
inst.components.walkingplankuser:SetCurrentPlank(plank_entity)

-- Later, dismount safely
inst.components.walkingplankuser:Dismount()
```

## Dependencies & tags
**Components used:** `walkingplank` (via `plank.components.walkingplank:StopMounting()`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `current_plank` | `Entity` or `nil` | `nil` | Reference to the walking plank entity currently mounted. |
| `_plank_remove_event` | `EventListener` or `nil` | `nil` | Internal listener for the `"onremove"` event on the current plank. |

## Main functions
### `SetCurrentPlank(plank)`
* **Description:** Sets the entity's current mounted plank and establishes a one-time listener to clear the reference if the plank is removed.
* **Parameters:** `plank` (`Entity` or `nil`) — the plank entity to mount, or `nil` to dismount.
* **Returns:** Nothing.
* **Error states:** If a previous plank was set, its `"onremove"` listener is cancelled before installing the new one.

### `Dismount()`
* **Description:** Safely dismounts by signaling the plank to stop mounting and cleaning up internal state.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** If no plank is mounted (`current_plank == nil`), the function returns early after cleaning up the event listener.

## Events & listeners
- **Listens to:** `onremove` (on the current plank) — triggers when the plank is removed from the world, automatically clearing `current_plank`.
- **Pushes:** None.

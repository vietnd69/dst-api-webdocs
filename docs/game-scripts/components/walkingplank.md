---
id: walkingplank
title: Walkingplank
description: Manages the state and lifecycle of a walking plank, including mounting, dismounting, extending, and retracting behaviors.
tags: [locomotion, interaction, entity]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 05715165
system_scope: locomotion
---
# Walkingplank

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`WalkingPlank` is a component that represents a deployable or retractable plank entity, typically used for traversal or rescue mechanics (e.g., boarding/offboarding boats). It manages player mounting/dismounting logic and plank state transitions (extending/retracting, mounting/abandoning). The component is attached to the plank entity itself and coordinates with the `walkingplankuser` component on the interacting entity (typically a player) to maintain synchronized state across client and server.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("walkingplank")
-- Later, to allow a player (doer) to mount the plank:
if not inst.components.walkingplank:MountPlank(doer) then
    -- Handle case where plank is already occupied
end
-- To retract the plank:
inst.components.walkingplank:Retract()
```

## Dependencies & tags
**Components used:** None (does not directly access other components via `inst.components.X` internally; relies on external call via `walkingplankuser` component methods).  
**Tags:** Adds `walkingplank` tag on construction; removes it on entity removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed in) | The entity instance the component is attached to. |
| `doer` | `Entity?` | `nil` | The entity currently mounted on the plank (e.g., player), or `nil` if unoccupied. |

## Main functions
### `Extend()`
* **Description:** Initiates plank extension. Typically called when the plank is activated for use (e.g., deploying from a boat). Fires the `start_extending` event immediately.
* **Parameters:** None.
* **Returns:** Nothing.

### `Retract()`
* **Description:** Initiates plank retraction. Typically called when the plank should be folded back (e.g., after use or to prevent further access). Fires the `start_retracting` event immediately.
* **Parameters:** None.
* **Returns:** Nothing.

### `MountPlank(doer)`
* **Description:** Attempts to mount the given entity (`doer`) onto the plank. If the plank is already occupied, mounting fails. On success, the entity is teleported to the plank’s position and the `walkingplankuser` component is informed. Fires the `start_mounting` event.
* **Parameters:** `doer` (`Entity`) — The entity attempting to mount the plank.
* **Returns:** `boolean` — `true` if mounting succeeds; `false` if the plank is already occupied.
* **Error states:** Returns `false` if `doer` is `nil` or if `self.doer ~= nil`.

### `StopMounting()`
* **Description:** Signals that mounting should be stopped or cancelled. Resets the `doer` reference and fires the `stop_mounting` event. Typically called when mounting is interrupted or aborted.
* **Parameters:** None.
* **Returns:** Nothing.

### `AbandonShip(doer)`
* **Description:** Allows the current `doer` to dismount (abandon) the plank. Delegates dismount logic to the `walkingplankuser` component attached to `doer`. Fires the `start_abandoning` event. Used specifically for boat-related dismounts (hence the "AbandonShip" naming).
* **Parameters:** `doer` (`Entity`) — The entity that mounted the plank and wishes to dismount.
* **Returns:** `boolean` — `true` if `doer` is valid and matches the current mount; `false` otherwise.
* **Error states:** Returns `false` if `doer` is `nil` or does not match `self.doer`.

## Events & listeners
- **Listens to:** None (does not register event listeners in this component).
- **Pushes:**
  - `start_extending` — Fired when plank extension begins.
  - `start_retracting` — Fired when plank retraction begins.
  - `start_mounting` — Fired when a player begins mounting the plank.
  - `stop_mounting` — Fired when mounting is cancelled or stopped.
  - `start_abandoning` — Fired when the current mount begins dismounting.

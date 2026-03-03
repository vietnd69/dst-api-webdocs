---
id: yoth_hecklermanager
title: Yoth Hecklermanager
description: Manages the availability and flight behavior of the Yoth heckler entity across Knight shrines in the Year of the Horse event.
tags: [event, boss, combat, world, ai]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 9fa1d0d0
system_scope: world
---

# Yoth Hecklermanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`yoth_hecklermanager` is a world-scoped component responsible for orchestrating the spawning, landing, and departure timing of the Yoth heckler—a special NPC that interacts with Knight shrines during the Year of the Horse event. It coordinates with the `yoth_knightmanager` component to ensure only one heckler occupies a shrine at a time, respects play-in-progress constraints (via `charlie_stage`), and schedules return timers. It also triggers dialogue and events on the heckler entity when it arrives or departs.

## Usage example
```lua
-- Example: Reserve and land the heckler on an active Knight shrine
local shrine = GetSomeKnightShrine()
if TheWorld.components.yoth_hecklermanager:CanHecklerLand() then
    TheWorld.components.yoth_hecklermanager:TryHecklerLand(shrine)
end

-- Example: Check heckler status
local isAvailable = TheWorld.components.yoth_hecklermanager:IsHecklerAvailable()
local hasGivenPlaybill = TheWorld.components.yoth_hecklermanager:HasGivenPlaybill()
```

## Dependencies & tags
**Components used:** `timer`, `burnable`, `prototyper`, `talker`, `yoth_knightmanager`  
**Tags:** No tags added, removed, or checked directly on the component owner (`inst`). The component operates at world scope and coordinates behavior on external entities (shrine, heckler).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity | — | The world entity (`TheWorld`) that owns this component. |
| `_charlie_stage` | Entity? | `nil` | Reference to the active `charlie_stage` entity, used to detect whether a play is in progress. |
| `_hecklerreservation` | Entity? | `nil` | Reference to the shrine currently occupied by the heckler. |
| `_playbillgiven` | boolean | `nil` | `true` if the heckler helper has been given the play bill (affects return timing). |

## Main functions
### `IsHecklerAvailable()`
* **Description:** Returns whether a heckler is currently available (i.e., not assigned to a shrine).
* **Parameters:** None.
* **Returns:** `true` if `_hecklerreservation` is `nil`; otherwise `false`.

### `CanHecklerLand()`
* **Description:** Determines if the heckler is allowed to land on a shrine at this time. Enforces that no play is in progress, knight shrines are active, and the heckler is both available and not already scheduled to return.
* **Parameters:** None.
* **Returns:** `true` if the heckler can land; otherwise `false`.

### `TryHecklerLand(shrine)`
* **Description:** Attempts to land the heckler on the given shrine. On success, reserves the shrine, starts the leave timer, and fires the `arrive` event on the heckler entity.
* **Parameters:** `shrine` (Entity) — the target shrine with an attached `heckler` child entity.
* **Returns:** `true` if landing succeeded; otherwise `false`.  
* **Error states:** Returns `false` if `CanHecklerLand()` fails or the shrine has no valid `heckler` entity.

### `TryHecklerFlyAway(shrine, overrideleaveline)`
* **Description:** Orders the heckler to fly away from the specified shrine. Triggers appropriate dialogue (based on context: burning, hammered, or normal), stops the leave timer, starts the return timer, fires the `leave` event, and unreserves the shrine.
* **Parameters:**  
  - `shrine` (Entity) — the shrine from which to dispatch the heckler.  
  - `overrideleaveline` (string?) — optional; if present, overrides the default line choice logic.
* **Returns:** `true` if the heckler was successfully dispatched from this shrine; otherwise `false`.  
* **Error states:** Returns `false` if the shrine is not currently reserved (i.e., `_hecklerreservation ~= shrine`).

### `HecklerReturnTimerExists()`
* **Description:** Checks whether the return timer (`HECKLER_TIMERS.RETURN`) is currently active on the world’s `timer` component.
* **Parameters:** None.
* **Returns:** `true` if the return timer is running; otherwise `false`.

### `SetPlaybillGiven()`
* **Description:** Marks that the play bill has been given to the heckler helper, which influences the return delay (shorter initially, then longer).
* **Parameters:** None.
* **Returns:** Nothing.

### `HasGivenPlaybill()`
* **Description:** Reports whether the play bill has been given.
* **Parameters:** None.
* **Returns:** `true` if `_playbillgiven` is `true`; otherwise `false` or `nil`.

### `GetDebugString()`
* **Description:** Returns a diagnostic string for debugging, showing whether the play bill has been given and which shrine (if any) holds the heckler.
* **Parameters:** None.
* **Returns:** `string` — formatted as `"has given playbill: <bool>, heckler shrine: <entity or nil>"`.

## Events & listeners
- **Listens to:**  
  - `"ms_register_charlie_stage"` — registers the new `charlie_stage` entity for play-in-progress checks.  
  - `"timerdone"` — triggers `OnTimerDone` logic for return/leave timer expiry.  
- **Pushes (via `inst:PushEventImmediate` on `shrine.heckler`):**  
  - `"arrive"` — fired when the heckler lands on a shrine.  
  - `"leave"` — fired when the heckler flies away.

## Save/Load support
- `OnSave()` returns a table with `{ playbillgiven = boolean }` for persistence.  
- `OnLoad(data)` restores `_playbillgiven` from the saved data if present.

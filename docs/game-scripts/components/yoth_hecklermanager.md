---
id: yoth_hecklermanager
title: Yoth Hecklermanager
description: Manages the lifecycle and behavior of a single seasonal heckler entity that lands on Knight shrines to interact with Charlie stage plays.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 9fa1d0d0
---

# Yoth Hecklermanager

## Overview
This component coordinates the flight, landing, and departure behavior of a single seasonal "heckler" entity in the Year of the Horse update. It manages the heckler’s availability, coordinates timing around Charlie stage plays (via the Charlie stage system), and handles interaction with Knight shrines—such as triggering arrival/leave events and setting timed intervals for return flights. It operates exclusively on the server (master simulation) and is attached to the world entity.

## Dependencies & Tags
- **World Dependencies:**  
  - `TheWorld.components.yoth_knightmanager` (checked at runtime for shrine data and stage availability)
  - `TheWorld.components.timer` (used to schedule and manage heckler timers)
  - `TheWorld` must be the **server** (`TheWorld.ismastersim` is enforced)
- **Events Listened:**  
  - `ms_register_charlie_stage` (to bind to the active Charlie stage)
  - `timerdone` (to trigger return/leave actions based on timer completion)
- **No tags are added or removed.**

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The world entity to which this component is attached (read-only). |
| `_world` | `World` | `TheWorld` | Local reference to `TheWorld` (private). |
| `_charlie_stage` | `Entity?` | `nil` | Reference to the currently registered Charlie stage (if any). |
| `_hecklerreservation` | `Entity?` | `nil` | Reference to the shrine currently occupied by the heckler (or `nil` if none). |
| `_playbillgiven` | `boolean` | `false` | Flag indicating whether the heckler helper has given the player the "playbill" item. |

## Main Functions

### `IsHecklerAvailable() → boolean`
* **Description:** Returns `true` if no shrine currently has the heckler reserved.  
* **Parameters:** None.

### `ShrineHasHeckler(shrine: Entity) → boolean`
* **Description:** Checks if the given shrine is currently assigned the heckler.  
* **Parameters:**  
  - `shrine`: The entity to check (expected to be a Knight shrine).

### `ReserveHecklerToShrine(shrine: Entity)`
* **Description:** Marks the given shrine as the current recipient of the heckler’s visit.  
* **Parameters:**  
  - `shrine`: The shrine entity to reserve.

### `UnreserveHecklerFromShrine(shrine: Entity)`
* **Description:** Clears the reservation for the given shrine (sets `_hecklerreservation` to `nil`).  
* **Parameters:**  
  - `shrine`: The shrine entity (currently unused in logic—reservation is cleared unconditionally).

### `HecklerReturnTimerExists() → boolean`
* **Description:** Checks if the `"heckler_return"` timer is active on the world timer.  
* **Parameters:** None.

### `CanHecklerLand() → boolean`
* **Description:** Determines if conditions are met for the heckler to land on a shrine. Returns `false` if:  
  - A play is currently in progress on the Charlie stage,  
  - No Knight shrines are active,  
  - The heckler is already reserved, or  
  - The return timer is already running.  
* **Parameters:** None.

### `TryHecklerLand(shrine: Entity) → boolean`
* **Description:** Attempts to land the heckler on the specified shrine. If successful:  
  - Reserves the shrine,  
  - Starts the `"heckler_leave"` timer,  
  - Immediately pushes `"arrive"` event on the heckler.  
* **Parameters:**  
  - `shrine`: The Knight shrine entity to land on.  
* **Returns:** `true` if the heckler landed; `false` otherwise.

### `TryHecklerFlyAway(shrine: Entity, overrideleaveline: string?) → boolean`
* **Description:** Makes the heckler fly away from the specified shrine. Actions include:  
  - Playing a line from `STRINGS.HECKLERS_YOTH` based on context (burning shrine, hammered shrine, etc.),  
  - Stopping the `"heckler_leave"` timer,  
  - Starting the `"heckler_return"` timer,  
  - Pushing `"leave"` on the heckler,  
  - Clearing the shrine reservation.  
* **Parameters:**  
  - `shrine`: The shrine the heckler is leaving.  
  - `overrideleaveline` *(optional)*: Force a specific line ID (e.g., `"SHRINE_LEAVE_PLAY"`).  
* **Returns:** `true` if the heckler was successfully flown away (i.e., shrine was reserved); `false` otherwise.

### `HasGivenPlaybill() → boolean`
* **Description:** Returns the state of the `_playbillgiven` flag.  
* **Parameters:** None.

### `SetPlaybillGiven()`
* **Description:** Sets `_playbillgiven` to `true`. Used to indicate the helper has given the playbill.  
* **Parameters:** None.

### `OnSave() → data: table, ents: table`
* **Description:** Serializes component state. Only `_playbillgiven` is saved.  
* **Parameters:** None.  
* **Returns:**  
  - `data`: Table with `playbillgiven` field.  
  - `ents`: Empty table (no entities referenced).

### `OnLoad(data: table)`
* **Description:** Restores `_playbillgiven` from saved data.  
* **Parameters:**  
  - `data`: Table containing `playbillgiven` (if present).

### `GetDebugString() → string`
* **Description:** Returns a human-readable debug summary: `"has given playbill: <bool>, heckler shrine: <shrine-entity-or-nil>"`.  
* **Parameters:** None.

## Events & Listeners
- **Listens to `ms_register_charlie_stage`** (on `_world`) → Calls `OnRegisterCharlieStage`.
- **Listens to `timerdone`** (on `_world`) → Calls `OnTimerDone`.
- **Internally registered callbacks on `_charlie_stage` (when registered):**  
  - `onremove` → Calls `UnregisterCharlieStage`.  
  - `play_begun` → Calls `OnCharlieStagePlayBegun`.  
  - `play_ended` → Calls `OnCharlieStagePlayEnded`.  
- **Events pushed:**  
  - `"arrive"` (immediate) on `shrine.heckler` after successful landing.  
  - `"leave"` (immediate) on `shrine.heckler` when flying away.
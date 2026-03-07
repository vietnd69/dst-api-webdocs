---
id: oceanwhirlportal
title: Oceanwhirlportal
description: A portal prefab that teleports boats and their contents between distant ocean locations while applying protective effects and generating wake waves.
tags: [portal, transportation, water, environment]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 02aa1787
system_scope: environment
---

# Oceanwhirlportal

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`oceanwhirlportal` is a static environmental entity that serves as a transportation mechanism for boats across the ocean. When a boat enters the portal's interaction radius, it triggers teleportation of the boat (and items carried on it) to a linked portal exit, as tracked by the `entitytracker` component. The component coordinates with `boatphysics`, `inventoryitem`, `walkableplatform`, and `wateryprotection` to ensure smooth teleportation, wake wave generation, and environmental protection application. It operates in two phases: an open loop phase (`open_loop`) and a closing phase triggered by a timer (`closewhirlportal`).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("oceanwhirlportal")
inst:SetExit(exit_portal) -- Links this portal to its exit destination
inst.CheckForBoatsTick(inst) -- Manually trigger boat check (typically handled by periodic task)
```

## Dependencies & tags
**Components used:** `inspectable`, `entitytracker`, `wateryprotection`, `timer`, `boatphysics`, `inventoryitem`, `walkableplatform`
**Tags:** Adds `birdblocker`, `ignorewalkableplatforms`, `oceanwhirlportal`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `CHECK_FOR_BOATS_PERIOD` | number | `0.5` | Interval in seconds between boat checks. |
| `BOAT_INTERACT_DISTANCE` | number | `6.0` | Max distance from portal center to detect boats. |
| `BOAT_MUST_TAGS` | table | `{"boat"}` | Tags a entity must have to be considered a valid boat. |
| `TELEPORTBOAT_BLOCKER_CANT_TAGS` | table | `{"FX", "NOCLICK", "DECOR", "INLIMBO", "_inventoryitem", "oceanwhirlportal"}` | Tags that prevent teleportation destination validity. |
| `_check_for_boats_task` | periodic task | `nil` | Periodic task ref that runs `CheckForBoatsTick` continuously. |

## Main functions
### `SetExit(exit)`
*   **Description:** Registers a destination portal instance to which boats will be teleported. Called by the game logic to pair this portal with an exit portal.
*   **Parameters:** `exit` (entity instance) - The destination `oceanwhirlportal` entity.
*   **Returns:** Nothing.
*   **Error states:** Uses `entitytracker:TrackEntity` internally; no error state is explicitly handled.

### `CheckForBoatsTick(inst)`
*   **Description:** The core logic function that scans for nearby boats, validates teleport destinations, and executes teleportation if conditions are met. Also handles boat wake generation, item landing state, and camera snapping for players.
*   **Parameters:** `inst` (entity instance) - The portal entity itself.
*   **Returns:** Nothing.
*   **Error states:** Returns early if:
    *   No valid exit portal is tracked.
    *   Exit portal is blocked by another entity.
    *   No unblocked boat is found within `BOAT_INTERACT_DISTANCE`.
    *   Teleport destination point is invalid (land, hole, or blocker entities).

## Events & listeners
- **Listens to:** `timerdone` - Triggers `ontimerdone` to close the portal after `OCEANWHIRLPORTAL_KEEPALIVE_DURATION`.
- **Listens to:** `animqueueover` - Triggers `inst.Remove` after closing animation (`open_pst`) completes.
- **Pushes:** `wormholetravel` - Sent to players on the boat with `WORMHOLETYPE.OCEANWHIRLPORTAL` to play travel sound.
- **Pushes:** `on_landed` / `on_no_longer_landed` - Via `inventoryitem:SetLanded()` for items teleported with the boat.
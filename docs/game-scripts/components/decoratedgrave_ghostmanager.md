---
id: decoratedgrave_ghostmanager
title: Decoratedgrave Ghostmanager
description: Manages the spawning, tracking, and despawning of grave guard ghosts for Wendy's skill-related grave mechanics.
tags: [wenda, ghost, grave, skill, map]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: d53bf7eb
system_scope: world
---

# Decoratedgrave Ghostmanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`DecoratedgraveGhostmanager` is a world-scoped component responsible for managing ghost spawns from decorated graves when a player with the `ghostlyfriend` tag (typically Wendy) has the `wendy_gravestone_1` skill activated. It tracks registered graves and active ghost friends, periodically spawning `graveguard_ghost` entities near active ghost friends if the configured ghost count threshold (`TUNING.WENDYSKILL_GRAVESTONE_GHOSTCOUNT`) is not yet met, and handles ghost despawning when players move too far away or the ghost is destroyed. This component only runs on the master simulation.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("decoratedgrave_ghostmanager")

-- Register a decorated grave prefab instance
inst.components.decoratedgrave_ghostmanager:RegisterDecoratedGrave(grave_inst)

-- Unregister when the grave is removed
inst.components.decoratedgrave_ghostmanager:UnregisterDecoratedGrave(grave_inst)
```

## Dependencies & tags
**Components used:** `skilltreeupdater` (via `ghostfriend.components.skilltreeupdater:IsActivated`), `health` (via `ghost.components.health:IsDead`)  
**Tags:** Checks for `ghostlyfriend` on players; manages entities tagged as graves and ghost prefabs; does not add/remove tags itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance that owns this component (the map/global entity). |

## Main functions
### `RegisterDecoratedGrave(grave)`
* **Description:** Registers a decorated grave prefab for ghost management. Initializes tracking but does not immediately spawn a ghost.
* **Parameters:** `grave` (`Entity` or `nil`) — The grave entity to track. If `nil` or already registered, the function returns early.
* **Returns:** Nothing.
* **Error states:** None. Internally enqueues ghost spawning logic on update if the grave is within range of an activated ghost friend.

### `UnregisterDecoratedGrave(grave)`
* **Description:** Stops tracking a grave, removes any associated ghost, and cancels pending ghost spawns for that grave.
* **Parameters:** `grave` (`Entity` or `nil`) — The grave entity to stop tracking. If `nil` or unregistered, the function returns early.
* **Returns:** Nothing.
* **Error states:** None.

### `OnUpdate(dt)`
* **Description:** The component's update loop, called approximately every `UPDATE_RATE` seconds (`1.0`). Manages ghost spawning (when skill is active and ghost count threshold is unmet), and despawning (when players are too far away).
* **Parameters:** `dt` (`number`) — Time elapsed since last frame.
* **Returns:** Nothing.
* **Error states:** None. Gracefully handles invalid ghosts or graves, and skips updates if player or skill conditions are not met.

### `GetDebugString()`
* **Description:** Returns a debug string summarizing the current state for debugging UI.
* **Parameters:** None.
* **Returns:** `string` — A formatted string containing total registered grave count and actual ghost count.

## Events & listeners
- **Listens to:**  
  - `ms_playerjoined` — Calls `OnPlayerJoined` to begin tracking new ghost-friend players.  
  - `ms_playerleft` — Calls `OnPlayerLeft` to stop tracking leaving ghost-friend players.  
  - `onremove` on registered graves and spawned ghosts — Triggers cleanup of internal state and ghost despawn queuing.  
- **Pushes:** None.

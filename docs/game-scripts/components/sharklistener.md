---
id: sharklistener
title: Sharklistener
description: Tracks nearby sharks and adjusts shark sound parameters for players based on proximity and shark state.
tags: [audio, world, environment]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 677a4395
system_scope: world
---

# Sharklistener

> Based on game build **7140014** | Last updated: 2026-03-03

## Overview
`Sharklistener` is a world-scoped component that monitors shark activity in the environment and dynamically adjusts audio parameters for players based on shark proximity. It listens for player join/leave events and shark spawn/remove events, then periodically evaluates the distance of sharks relative to each player to influence the `killtask` and `_sharksoundparam` values. This component only exists on the master simulation and is disabled on clients.

## Usage example
This component is automatically added and managed by the game world; modders typically do not manually instantiate it. It is initialized in world startup logic and integrates with player and shark entity lifecycles via events.

```lua
-- The component is managed internally by the game
-- Example of inspecting state (debug only):
if TheWorld.components.sharklistener then
    print(TheWorld.components.sharklistener:GetDebugString())
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Listens to `sharkspawned`, `ms_playerjoined`, `ms_playerleft`, and `onremove` events

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `TheWorld` or `GOBD` instance | `inst` passed to constructor | The entity instance this component is attached to (the world). |

## Main functions
### `GetDebugString()`
* **Description:** Returns a human-readable string indicating the number of tracked sharks for debugging purposes.
* **Parameters:** None.
* **Returns:** `string` — either `"1 shark"` or `"<N> sharks"` where `N` is the current count.
* **Error states:** None.

## Events & listeners
- **Listens to:**  
  - `ms_playerjoined` — triggers `OnPlayerJoined` to begin tracking a newly joined player.  
  - `ms_playerleft` — triggers `OnPlayerLeft` to stop tracking a player.  
  - `sharkspawned` — triggers `StartTrackingShark` to begin monitoring a newly spawned shark.  
  - `onremove` (on shark entity) — triggers `StopTrackingShark` to unregister the shark when it is removed.  
- **Pushes:** None.

---
id: followermemory
title: Followermemory
description: Remembers and tracks a follower's last known leader across sessions and entity state changes, enabling reunification when the leader returns.
tags: [ai, leader, persistence, tracking, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 73b6c308
system_scope: entity
---

# Followermemory

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Followermemory` persists and manages knowledge of a follower entity's most recent leader across game saves, entity wake/sleep cycles, and player disconnections/reconnections. It does not manage the active leadership relationship itself, but works alongside the `follower` component to restore or reestablish leadership when possible. The component stores the leader's user ID and character prefab name, and monitors the world for the leader's return using event listeners and periodic tasks.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("follower")
inst:AddComponent("followermemory")

-- Set a custom reunite range (default 40)
inst.components.followermemory:SetReuniteRange(50)

-- Define behavior when the follower reunites with its leader
inst.components.followermemory:SetOnReuniteLeaderFn(function(follower, leader)
    print("Reunited with leader!")
    follower.components.follower:SetLeader(leader)
end)

-- Remember the current leader
local player = ThePlayer
inst.components.followermemory:RememberAndSetLeader(player)
```

## Dependencies & tags
**Components used:** `follower`, `combat`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `reuniterange` | number | `40` | Maximum distance (in world units) to consider the follower "reunited" with its leader. |
| `onreuniteleaderfn` | function or `nil` | `nil` | Callback executed when the follower reunites with its remembered leader. |
| `onleaderlostfn` | function or `nil` | `nil` | Callback executed when the follower loses its leader (e.g., leader disconnects or dies). |
| `leaderid` | string or `nil` | `nil` | User ID of the remembered leader, if any. |
| `leaderchar` | string or `nil` | `nil` | Prefab name of the remembered leader character. |
| `watching` | function or `nil` | `nil` | Event handler registered to `ms_playerjoined` to detect leader reconnection. |
| `task` | task or `nil` | `nil` | Periodic task used to track the leader's presence and validity. |

## Main functions
### `SetReuniteRange(dist)`
*   **Description:** Sets the distance threshold within which the follower will trigger reunite logic if its remembered leader is nearby.
*   **Parameters:** `dist` (number) – the range in world units.
*   **Returns:** Nothing.

### `SetOnReuniteLeaderFn(fn)`
*   **Description:** Registers a callback function to execute when the follower successfully reunites with its remembered leader.
*   **Parameters:** `fn` (function or `nil`) – a function with signature `(follower, leader)`; may be `nil` to clear.
*   **Returns:** Nothing.

### `SetOnLeaderLostFn(fn)`
*   **Description:** Registers a callback function to execute when the follower's leader is lost (e.g., on save/load or during play if the leader disconnects or dies).
*   **Parameters:** `fn` (function or `nil`) – a function with signature `(follower)`; may be `nil` to clear.
*   **Returns:** Nothing.

### `RememberAndSetLeader(player)`
*   **Description:** Records the given player as the leader and, if a `follower` component exists, sets the active leader.
*   **Parameters:** `player` (entity) – a player entity with `userid` and `prefab` fields.
*   **Returns:** Nothing.
*   **Error states:** If the `follower` component is absent or the leader is invalid, only memory is updated; leadership may not be set.

### `RememberLeaderDetails(id, prefab)`
*   **Description:** Records leader details if no active leader exists, or if the current leader matches the provided `id` and `prefab`.
*   **Parameters:**  
  `id` (string) – user ID of the leader.  
  `prefab` (string) – character prefab name.
*   **Returns:** Nothing.

### `ForgetLeader()`
*   **Description:** Clears all stored leader information and stops watching for the leader.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `HasRememberedLeader()`
*   **Description:** Checks whether the component remembers any leader (even if the leader is currently unavailable).
*   **Parameters:** None.
*   **Returns:** `true` if a leader ID and character are stored; `false` otherwise.

### `IsRememberedLeader(target)`
*   **Description:** Checks whether the given entity matches the remembered leader's user ID and character.
*   **Parameters:** `target` (entity) – an entity with `userid` and `prefab` fields.
*   **Returns:** `true` if the target matches the remembered leader; `false` otherwise.

### `OnChangedLeader(leader)`
*   **Description:** Internal handler called by the `follower` component when the active leader changes. Manages memory and watch state accordingly.
*   **Parameters:** `leader` (entity or `nil`) – the new leader entity, or `nil` if leader was lost.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Serializes the leader memory for persistence.
*   **Parameters:** None.
*   **Returns:** Table `{ id = string?, char = string?, lost = boolean? }`, or `nil` if no leader is remembered.

### `OnLoad(data)`
*   **Description:** Restores leader memory after loading from save data.
*   **Parameters:** `data` (table) – the table returned by `OnSave()`.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a debug-friendly string representation of the internal leader memory.
*   **Parameters:** None.
*   **Returns:** `string` – e.g., `"leaderid=1234 leaderchar=warlain"`.

## Events & listeners
- **Listens to:**  
  - `attacked` – fires `OnAttacked` to forget the leader if attacked by the remembered leader.  
  - `ms_playerjoined` – fires internal watcher function when a player joins the world to detect leader return.  
- **Pushes:** None identified.

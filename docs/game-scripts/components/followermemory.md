---
id: followermemory
title: Followermemory
description: Tracks and persists leader information for follower entities across save/load cycles and shard transfers.
tags: [follower, persistence, leader]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: b9c198cc
system_scope: entity
---

# Followermemory

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`FollowerMemory` persists leader identity information for follower entities, enabling them to remember their leader across save/load cycles and shard transfers. It works alongside the `follower` component to restore leader relationships when the remembered leader player rejoins the world. The component tracks the leader's userid and prefab name, watches for player join events, and triggers callbacks when the leader is reunited or lost.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("followermemory")
inst:AddComponent("follower")

-- Set callbacks for leader events
inst.components.followermemory:SetOnReuniteLeaderFn(function(inst, player)
    print("Leader reunited:", player.name)
end)

inst.components.followermemory:SetOnLeaderLostFn(function(inst)
    print("Leader was lost")
end)

-- Remember a player as leader
inst.components.followermemory:RememberAndSetLeader(player)

-- Check if leader is remembered
if inst.components.followermemory:HasRememberedLeader() then
    print("Has remembered leader")
end
```

## Dependencies & tags
**External dependencies:**
- `Class` -- DST class system for component construction
- `TheWorld` -- global world entity for ms_playerjoined event listening
- `AllPlayers` -- global table of all connected player entities
- `POPULATING` -- global state variable for load-time leader loss detection

**Components used:**
- `follower` -- accessed to set/get current leader, cleared on load post-pass

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | --- | The entity instance that owns this component. |
| `reuniterange` | number | `40` | Distance threshold for triggering onreuniteleaderfn when leader is near. |
| `onreuniteleaderfn` | function | `nil` | Callback fired when remembered leader player comes within reuniterange. Signature: `fn(inst, player)`. Set by owning prefab. |
| `onleaderlostfn` | function | `nil` | Callback fired when leader is lost during play or on load. Signature: `fn(inst)`. Set by owning prefab. |
| `leaderid` | string | `nil` | The userid of the remembered leader player. Persists across saves. |
| `leaderchar` | string | `nil` | The prefab name of the remembered leader character. Persists across saves. |
| `watching` | function | `nil` | Internal event listener function for ms_playerjoined on TheWorld. |
| `task` | table | `nil` | Periodic task reference for tracking the leader player. `task.player` stores the tracked player entity. |
| `_loading_lost_leader` | boolean | `nil` | Internal flag set during OnLoad to track if leader was already lost when saving. |

## Main functions
### `SetReuniteRange(dist)`
*   **Description:** Sets the distance threshold for triggering the reunite callback when the remembered leader player comes near.
*   **Parameters:** `dist` -- number distance in world units.
*   **Returns:** nil
*   **Error states:** None

### `SetOnReuniteLeaderFn(fn)`
*   **Description:** Sets the callback function to fire when the remembered leader player comes within reuniterange. The callback is responsible for actually setting the leader on the follower component if desired.
*   **Parameters:** `fn` -- function with signature `fn(inst, player)`.
*   **Returns:** nil
*   **Error states:** None

### `SetOnLeaderLostFn(fn)`
*   **Description:** Sets the callback function to fire when the leader is lost during play or on load. Does not trigger on load if the leader was already lost when saving.
*   **Parameters:** `fn` -- function with signature `fn(inst)`.
*   **Returns:** nil
*   **Error states:** None

### `RememberAndSetLeader(player)`
*   **Description:** Stores the player's userid and prefab as the remembered leader, then sets them as the current leader on the follower component. If no follower component exists but a leaderid is set, starts watching for the leader player to join.
*   **Parameters:** `player` -- player entity with `userid` and `prefab` fields.
*   **Returns:** nil
*   **Error states:** Errors if `player` is nil when accessing `player.userid` or `player.prefab` — no nil guard present.

### `RememberLeaderDetails(id, prefab)`
*   **Description:** Stores leader identity if no current leader exists, or validates that the current leader matches the provided id and prefab before storing. Starts or stops watching based on whether a leaderid is set after the call.
*   **Parameters:**
    - `id` -- string userid or nil to clear
    - `prefab` -- string prefab name or nil to clear
*   **Returns:** nil
*   **Error states:** None

### `ForgetLeader()`
*   **Description:** Clears the remembered leader identity and stops watching for the leader player. Also registered as `OnRemoveFromEntity` for cleanup.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None

### `HasRememberedLeader()`
*   **Description:** Returns whether a leader userid is currently stored in memory.
*   **Parameters:** None
*   **Returns:** boolean `true` if leaderid is not nil, `false` otherwise.
*   **Error states:** None

### `IsRememberedLeader(target)`
*   **Description:** Checks if the provided target entity matches the stored remembered leader identity by comparing userid and prefab.
*   **Parameters:** `target` -- entity with `userid` and `prefab` fields.
*   **Returns:** boolean `true` if target matches stored leaderid and leaderchar, `false` otherwise.
*   **Error states:** Errors if `target` is nil or lacks `userid` or `prefab` fields — no nil guard present.

### `GetTrackingPlayer()`
*   **Description:** Returns the player entity currently being tracked by the periodic task, if any.
*   **Parameters:** None
*   **Returns:** player entity or `nil` if no task is active.
*   **Error states:** None

### `SetLeaderMem(id, prefab)` (internal)
*   **Description:** Internal function to store or clear leader identity. Registers or removes the `attacked` event listener when leaderid changes from nil to a value or vice versa. If the attacker's userid matches the remembered leaderid, the leader is forgotten.
*   **Parameters:**
    - `id` -- string userid or nil to clear
    - `prefab` -- string prefab name or nil to clear
*   **Returns:** nil
*   **Error states:** None

### `OnAttacked(inst, data)` (local)
*   **Description:** File-scope local function registered as event listener for `attacked` event. Forgets the leader if the attacker's userid matches the remembered leaderid.
*   **Parameters:**
    - `inst` -- entity instance with followermemory component
    - `data` -- event data table with `attacker` entity
*   **Returns:** nil
*   **Error states:** None

### `CheckPlayer(inst, self, player)` (local)
*   **Description:** File-scope local function passed to DoPeriodicTask as task callback. Checks if tracked player matches remembered leader identity, forgets leader if prefab mismatches, stops tracking if player invalid, and fires onreuniteleaderfn if player is within reuniterange.
*   **Parameters:**
    - `inst` -- entity instance with followermemory component
    - `self` -- followermemory component instance
    - `player` -- player entity being tracked
*   **Returns:** nil
*   **Error states:** None

### `StartTrackingPlayer(player)` (internal)
*   **Description:** Starts a periodic task that checks every 3 seconds if the tracked player still matches the remembered leader identity and is within reuniterange. Cancels any existing task first.
*   **Parameters:** `player` -- player entity to track.
*   **Returns:** nil
*   **Error states:** None

### `StopTrackingPlayer()` (internal)
*   **Description:** Cancels the periodic tracking task and clears the task reference. Also registered as `OnEntitySleep` for cleanup when entity goes idle.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None

### `StartWatchingForLeader()` (internal)
*   **Description:** Registers a listener for `ms_playerjoined` events on TheWorld to detect when the remembered leader player joins the shard. Also calls `OnEntityWake` to check for already-connected players.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None

### `StopWatchingForLeader()` (internal)
*   **Description:** Removes the `ms_playerjoined` event listener and stops tracking the player. Clears the watching function reference.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None

### `OnEntityWake()`
*   **Description:** Called when the entity becomes active. Iterates through AllPlayers to find the remembered leader and starts tracking if found, or forgets the leader if the prefab doesn't match.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** Errors if `AllPlayers` is nil or contains entities without `userid` or `prefab` fields — no nil guard present.

### `OnChangedLeader(leader)`
*   **Description:** Called by the follower component when the leader changes. Clears stored memory if the new leader doesn't match the remembered identity. Fires onleaderlostfn callback if leader becomes nil and a leader was previously remembered.
*   **Parameters:** `leader` -- entity or nil if leader was lost.
*   **Returns:** nil
*   **Error states:** Errors if `leader` is not nil but lacks `userid` or `prefab` fields — no nil guard present.

### `OnSave()`
*   **Description:** Returns a save table containing the remembered leader identity and whether the leader was lost at save time. The `lost` field is only included if the follower component exists and currently has a leader.
*   **Parameters:** None
*   **Returns:** Table with `id`, `char`, and optionally `lost` fields, or `nil` if no leaderid is stored.
*   **Error states:** None

### `OnLoad(data)`
*   **Description:** Restores the remembered leader identity from save data and calls OnChangedLeader to sync with the current follower component state. Sets internal flag to control whether onleaderlostfn fires.
*   **Parameters:** `data` -- table with `id`, `char`, and optionally `lost` fields from OnSave.
*   **Returns:** nil
*   **Error states:** Errors if `data` is nil when accessing `data.id`, `data.char`, or `data.lost` — no nil guard present.

### `LoadPostPass()`
*   **Description:** Called after load completion. Clears the cached player leader on the follower component to force a fresh leader resolution.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** Errors if `self.inst.components.follower` exists but lacks `ClearCachedPlayerLeader` method — no nil guard present.

### `GetDebugString()`
*   **Description:** Returns a debug string showing the current remembered leaderid and leaderchar values.
*   **Parameters:** None
*   **Returns:** String in format `"leaderid=X leaderchar=Y"`.
*   **Error states:** None

## Events & listeners
- **Listens to:** `attacked` — triggers OnAttacked local handler; forgets leader if attacker's userid matches remembered leaderid.
- **Listens to:** `ms_playerjoined` (on TheWorld) — triggers watching function; checks if joining player matches remembered leader identity and starts tracking if near.
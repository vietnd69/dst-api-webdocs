---
id: follower
title: Follower
description: Manages entity following behavior, including loyalty expiration, leader binding, and teleportation mechanics when distanced from the leader.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 18586916
---

# Follower

## Overview
This component enables an entity to follow a designated leader (typically a player or item owner), tracking loyalty over time and optionally teleporting to stay near the leader. It handles leader assignment, event callbacks for leader removal, loyalty time management, leashing behavior during sleep cycles, and serialization for save/load.

## Dependencies & Tags
- **Components used:**  
  `health`, `combat`, `locomotor`, `hitchable`, `inventoryitem`, `leader`, `followermemory` (conditional usage, not guaranteed)
- **Events listened to:**  
  `"attacked"`, `"onremove"`, `"entitysleep"`, `"entitywake"`, `"ms_playerjoined"`, `"ms_newplayerspawned"`
- **Tags involved (via `HasTag` checks):**  
  `"player"`, `"pocketdimension_container"`
- **Tags added:**  
  None directly. Interacts with existing leader/follower relations via `leader:AddFollower` / `leader:RemoveFollower`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity this component is attached to. |
| `leader` | `Entity?` | `nil` | The current leader (e.g., a player or item owner). |
| `itemowner` | `Entity?` | `nil` | The owner of an inventory item this entity is attached to (if any). |
| `targettime` | `number?` | `nil` | Absolute simulation time at which the entity stops following. |
| `maxfollowtime` | `number?` | `nil` | Maximum follow time duration (used for loyalty percentage calculations). |
| `canaccepttarget` | `boolean` | `true` | Controls whether the entity can accept a new target or follow assignment (currently unused in logic). |
| `noleashing` | `boolean?` | `nil` | Flag to disable leashing behavior (teleportation and event callbacks). |
| `keepleaderonattacked` | `boolean?` | `nil` | If true, prevents the entity from dropping the leader when attacked *by* that leader. |
| `hasitemsource` | `boolean?` | `nil` | Internal flag indicating if the leader is an inventory item source. |
| `porttask` | `Task?` | `nil` | Deferred task used to retry teleportation if no valid landing spot is found immediately. |
| `task` | `Task?` | `nil` | Task scheduled to trigger `StopFollowing` when loyalty time expires. |
| `cached_player_leader_userid` | `number?` | `nil` | User ID of the cached player leader for persistence across respawns. |
| `cached_player_leader_timeleft` | `number?` | `nil` | Absolute simulation time when a cached leader association should be cleared. |
| `cached_player_leader_task` | `Task?` | `nil` | Task to clear a cached player leader after expiry. |
| `_onleaderwake` | `function?` | `nil` | Callback registered on leader wake to trigger teleportation attempts. |
| `cached_player_join_fn` | `function` | — | Bound reference to `OnPlayerJoined` used as event listener. |
| `cached_new_player_spawned_fn` | `function` | — | Bound reference to `OnNewPlayerSpawned` used as event listener. |
| `OnLeaderRemoved` | `function` | — | Callback registered to remove the leader if the leader entity is removed. |

## Main Functions

### `Follower:GetLeader()`
* **Description:** Returns the effective leader: if `itemowner` is set, returns it; otherwise, returns `leader`.  
* **Parameters:** None.  
* **Returns:** `Entity?` — the current leader or `nil`.

### `Follower:SetLeader(new_leader)`
* **Description:** Assigns a new leader. Handles cleanup of old leader relationships, updates `itemowner`, registers/unregisters callbacks (e.g., `"onremove"`), starts/stops leashing, and triggers `"leaderchanged"` event.  
* **Parameters:**  
  - `new_leader` (`Entity?`) — The new leader entity to follow, or `nil` to stop following.

### `Follower:StartLeashing()`
* **Description:** Enables leashing behavior, including registering sleep/wake callbacks and triggering an initial teleportation attempt via `OnEntitySleep`. No-op if `noleashing` is set.  
* **Parameters:** None.

### `Follower:StopLeashing()`
* **Description:** Disables leashing by canceling tasks and removing sleep/wake event callbacks. Pushes `"stopleashing"` event (unless `noleashing`).  
* **Parameters:** None.

### `Follower:DisableLeashing()`
* **Description:** Permanently disables leashing (`noleashing = true`) and stops any active leashing.  
* **Parameters:** None.

### `Follower:EnableLeashing()`
* **Description:** Re-enables leashing if previously disabled (`noleashing = nil`) and the leader qualifies (player or inventory item). Triggers immediate teleportation if asleep.  
* **Parameters:** None.

### `Follower:AddLoyaltyTime(time)`
* **Description:** Extends the follow duration by `time` seconds (adjusted by leader loyalty multiplier if present). Updates `targettime`, schedules a `StopFollowing` task, and fires `"gainloyalty"` event.  
* **Parameters:**  
  - `time` (`number`) — Amount of time to add (in seconds).

### `Follower:CancelLoyaltyTask()`
* **Description:** Clears the loyalty expiration task and resets `targettime` to `nil`.  
* **Parameters:** None.

### `Follower:StopFollowing()`
* **Description:** Ends following behavior by clearing loyalty time, pushing `"loseloyalty"` event, and setting `leader` to `nil`. No-op if `neverexpire` is set.  
* **Parameters:** None.

### `Follower:IsNearLeader(dist)`
* **Description:** Checks if the entity is within `dist` units of its leader.  
* **Parameters:**  
  - `dist` (`number`) — Distance threshold.  
* **Returns:** `boolean` — `true` if leader exists and within range.

### `Follower:GetLoyaltyPercent()`
* **Description:** Computes the fraction of loyalty remaining: `(targettime - now) / maxfollowtime`. Returns `0` if loyalty is not tracked.  
* **Parameters:** None.  
* **Returns:** `number` — Loyalty percentage (0.0 to 1.0).

### `Follower:CachePlayerLeader(userid, timeleft)`
* **Description:** Caches a player leader by `userid` to allow refollowing after respawn or reconnect, if the entity is within distance and time hasn’t expired. Registers listeners for `"ms_playerjoined"` and `"ms_newplayerspawned"`.  
* **Parameters:**  
  - `userid` (`number?`) — The user ID of the leader player (defaults to current leader’s ID if omitted).  
  - `timeleft` (`number?`) — Duration (in seconds) before the cached association expires.

### `Follower:ClearCachedPlayerLeader()`
* **Description:** Clears all cached player leader data and unregisters associated listeners.  
* **Parameters:** None.

### `Follower:OnSave()`
* **Description:** Serializes loyalty and cached player leader state into a table for persistence. Returns `nil` if no data to save.  
* **Parameters:** None.  
* **Returns:** `table?` — Save data containing `time`, `cached_player_leader_userid`, and `cached_player_leader_timeleft` fields.

### `Follower:OnLoad(data)`
* **Description:** Restores loyalty and cached player leader state from save data.  
* **Parameters:**  
  - `data` (`table`) — The save data from `OnSave()`.

### `Follower:OnItemSourceNewOwner(owner)`
* **Description:** Updates `itemowner` when an inventory item owner changes and registers with the leader component if applicable.  
* **Parameters:**  
  - `owner` (`Entity`) — The new owner.

### `Follower:OnItemSourceRemoved(owner)`
* **Description:** Clears `itemowner` and unregisters from the former leader’s followers list.  
* **Parameters:**  
  - `owner` (`Entity`) — The former owner.

### `Follower:KeepLeaderOnAttacked()`
* **Description:** Disables the `"attacked"` handler that drops the leader upon being attacked *by* that leader. Allows retaining the leader in this scenario.  
* **Parameters:** None.

### `Follower:LoseLeaderOnAttacked()`
* **Description:** Re-enables the `"attacked"` handler to drop the leader if attacked by that leader.  
* **Parameters:** None.

### `Follower:LongUpdate(dt)`
* **Description:** Adjusts loyalty and cached player leader timers during world updates (dt seconds elapsed). Maintains correct timing without re-scheduling tasks.  
* **Parameters:**  
  - `dt` (`number`) — Delta time since last update.

### `Follower:GetDebugString()`
* **Description:** Generates a human-readable debug string showing leader, item owner, loyalty time left, and loyalty percentage.  
* **Parameters:** None.  
* **Returns:** `string` — Debug information.

## Events & Listeners
- **Listens for `"attacked"`** → Triggers `onattacked` callback, which removes leader if attacker equals leader.
- **Listens for `"onremove"` (on leader)** → Triggers `OnLeaderRemoved`, which calls `SetLeader(nil)`.
- **Listens for `"entitysleep"`** → Triggers `OnEntitySleep` to attempt teleportation.
- **Listens for `"entitywake"` (on leader)** → Triggers `OnEntitySleep` via `_onleaderwake` to attempt teleportation.
- **Listens for `"ms_playerjoined"` (on world)** → Triggers `OnPlayerJoined` to refollow cached player.
- **Listens for `"ms_newplayerspawned"` (on world)** → Triggers `OnNewPlayerSpawned` to clear stale cached leader.
- **Pushes `"startleashing"`** → When leashing is enabled.
- **Pushes `"stopleashing"`** → When leashing is disabled (if `noleashing` not set).
- **Pushes `"gainloyalty"`** → When loyalty time is added.
- **Pushes `"loseloyalty"`** → When loyalty is lost (on `StopFollowing`).
- **Pushes `"leaderchanged"`** → When the leader changes (includes `{ new, old }` payload).
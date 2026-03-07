---
id: follower
title: Follower
description: Manages an entity's relationship to a leader, including loyalty mechanics, teleportation on separation, and handling player reconnection or respawning.
tags: [ai, leader, loyalty, networking]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 18586916
system_scope: entity
---

# Follower

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Follower` coordinates how an entity follows and remains loyal to a designated leader, supporting dynamic behaviors such as teleportation when too far away, loyalty time decay, and robust handling of player disconnections and respawns. It integrates tightly with `combat` (to drop allies when leader changes), `locomotor` (to determine safe teleport destinations), `hitchable` (to respect hitching constraints), and `leader`/`followermemory` to manage entity relationships.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("follower")

-- Set a leader (e.g., a player or other entity)
inst.components.follower:SetLeader(player)

-- Add 30 seconds of loyalty time
inst.components.follower:AddLoyaltyTime(30)

-- Temporarily prevent teleportation and loyalty decay
inst.components.follower:DisableLeashing()
```

## Dependencies & tags
**Components used:** `combat`, `locomotor`, `hitchable`, `leader`, `followermemory`, `inventoryitem`
**Tags:** Checks `player`, `pocketdimension_container`, `debuffed`, `hiding`; no tags are added.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `leader` | `inst` or `nil` | `nil` | The current leader entity. May be `nil`. |
| `itemowner` | `inst` or `nil` | `nil` | The owner if this follower was derived from an inventory item. |
| `targettime` | number or `nil` | `nil` | World time at which loyalty expires. |
| `maxfollowtime` | number or `nil` | `nil` | Maximum possible follow/loyalty duration. |
| `canaccepttarget` | boolean | `true` | If `false`, prevents acquiring new combat targets while following. |
| `noleashing` | boolean | `nil` | If set, disables leashing and teleportation logic. |
| `keepleaderonattacked` | boolean | `nil` | If set, prevents losing leader on attack. |
| `neverexpire` | boolean | `nil` | If set, loyalty time cannot expire. |
| `hasitemsource` | boolean | `nil` | Internal flag used during leader changes when attached to an inventory item. |

## Main functions
### `SetLeader(new_leader)`
*   **Description:** Assigns a new leader, handling cleanup of the old leader’s data and updating network replicas. Automatically starts or stops leashing depending on leader type and leader settings.
*   **Parameters:** `new_leader` (`inst` or `nil`) — the entity to follow, or `nil` to stop following.
*   **Returns:** Nothing.
*   **Error states:** No explicit error cases; silently ignores calls that do not change the leader.

### `GetLeader()`
*   **Description:** Returns the effective leader: `itemowner` if present, otherwise `leader`. This prioritizes inventory-item-derived leadership.
*   **Parameters:** None.
*   **Returns:** `inst` or `nil` — the current leader or `nil`.

### `AddLoyaltyTime(time)`
*   **Description:** Extends loyalty duration by `time` seconds, subject to loyalty effectiveness multipliers from the leader. Enforces decay via internal timer.
*   **Parameters:** `time` (number) — seconds to add to loyalty. May be adjusted by leader settings.
*   **Returns:** Nothing.
*   **Error states:** If `neverexpire` is set, the function returns immediately with no effect.

### `StopFollowing()`
*   **Description:** Ends loyalty, fires `loseloyalty`, and clears the leader. Respects `neverexpire`.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early without effect if `neverexpire` is set or `inst` is invalid.

### `StartLeashing()`
*   **Description:** Enables teleportation behavior when separated from the leader. Registers listeners for leader sleep/wake events.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Silently returns if `noleashing` is set.

### `StopLeashing()`
*   **Description:** Disables teleportation and cancels pending teleportation tasks. Unsubscribes from leader sleep/wake events.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Silently returns if `noleashing` is set (does not fire `stopleashing` event in that case).

### `DisableLeashing()`
*   **Description:** Permanently disables leashing until re-enabled. Cancels any pending teleportation.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None.

### `EnableLeashing()`
*   **Description:** Re-enables leashing if it was previously disabled. Attempts immediate teleportation if asleep and near a leader.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early if leashing is already enabled.

### `GetLoyaltyPercent()`
*   **Description:** Returns the remaining loyalty as a fraction of `maxfollowtime`. Used for UI or AI decisions.
*   **Parameters:** None.
*   **Returns:** number — `0` if `targettime` or `maxfollowtime` is `nil`, otherwise `(targettime - now) / maxfollowtime`.

### `CachePlayerLeader(userid, timeleft)`
*   **Description:** Caches a player leader reference across disconnects, preserving loyalty time if the player re-joins within range. Required for persistent pet ownership.
*   **Parameters:**
    *   `userid` (string or `nil`) — user ID of the player leader.
    *   `timeleft` (number or `nil`) — seconds of loyalty remaining.
*   **Returns:** Nothing.

### `ClearCachedPlayerLeader()`
*   **Description:** Clears all cached player leader data and events. Called internally on leader change or on save/load.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnItemSourceNewOwner(owner)`
*   **Description:** Sets `itemowner` and registers this follower with the new owner’s `leader` component if applicable.
*   **Parameters:** `owner` (`inst`) — the new owner of the item this follower came from.
*   **Returns:** Nothing.

### `OnItemSourceRemoved(owner)`
*   **Description:** Clears `itemowner` and unregisters this follower from the old owner’s `leader` component.
*   **Parameters:** `owner` (`inst`) — the former owner.
*   **Returns:** Nothing.

### `IsLeaderSame(guy)`
*   **Description:** Checks whether this follower and another follower (`guy`) share the same effective leader.
*   **Parameters:** `guy` (`inst`) — the other entity to compare.
*   **Returns:** boolean — `true` if both have the same leader, `false` otherwise.

### `KeepLeaderOnAttacked()`
*   **Description:** Disables the default behavior that loses the leader on being attacked by them (e.g., to support pets defending owners).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `LoseLeaderOnAttacked()`
*   **Description:** Restores the default behavior of dropping leader when attacked by them.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Serializes loyalty and player leader cache state for persistence. Only includes data if non-empty.
*   **Parameters:** None.
*   **Returns:** `table` or `nil` — a compact table with `time` and/or `cached_player_leader_userid`/`timeleft` fields.

### `OnLoad(data)`
*   **Description:** Restores state from `OnSave()`. Adds loyalty time and re-registers player reconnection listeners if cached data is present.
*   **Parameters:** `data` (`table`) — deserialized save data.
*   **Returns:** Nothing.

### `LongUpdate(dt)`
*   **Description:** Advances loyalty and cached player leader timers during long simulation steps (e.g., pause/resume). Adjusts timers and reschedules tasks.
*   **Parameters:** `dt` (number) — delta time to subtract from timers.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a human-readable string summarizing follower state for debugging.
*   **Parameters:** None.
*   **Returns:** string — e.g., `"Following pigman Stop in 5.00s, 66.00%"`.

## Events & listeners
- **Listens to:**
    *   `attacked` — fired on `inst`; triggers `onattacked` handler to drop leader if attacked by leader.
    *   `entitysleep` / `entitywake` — fired on leader; triggers teleportation attempts when leader wakes.
    *   `onremove` — fired on leader; triggers leader cleanup if leader is removed.
    *   `ms_playerjoined` / `ms_newplayerspawned` — fired on `TheWorld`; handles player reconnection logic for cached leaders.
- **Pushes:**
    *   `leaderchanged` — fired when `leader` changes; includes `{new = new_leader, old = prev_leader}`.
    *   `gainloyalty` — fired when loyalty time is added; includes `{leader = self.leader}`.
    *   `loseloyalty` — fired when loyalty expires or is lost; includes `{leader = self.leader}`.
    *   `startleashing` — fired when leashing is started.
    *   `stopleashing` — fired when leashing is stopped (unless `noleashing` is set).

---
id: follower
title: Follower
description: Manages entity following behavior, leader relationships, loyalty timers, and leashing mechanics for AI companions and inventory items.
tags: [ai, companion, leadership, loyalty]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: bef5eaaa
system_scope: entity
---

# Follower

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`Follower` manages the relationship between an entity and its leader, handling following behavior, loyalty timers, and automatic leashing when the follower falls too far behind. It integrates with the `leader` component to maintain bidirectional tracking, supports item-based ownership through `inventoryitem`, and caches player leader state for reconnection after disconnects. The component pushes events for leader changes and loyalty state, and listens to entity lifecycle events to manage cleanup.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("follower")
inst:AddComponent("leader")

-- Set a leader entity
inst.components.follower:SetLeader(player)

-- Add loyalty time (in seconds)
inst.components.follower:AddLoyaltyTime(120)

-- Check loyalty percentage
local loyalty = inst.components.follower:GetLoyaltyPercent()

-- Enable automatic leashing when far from leader
inst.components.follower:StartLeashing()
```

## Dependencies & tags
**External dependencies:**
- `TUNING.FOLLOWER_REFOLLOW_DIST_SQ` -- distance threshold for player reconnection
- `FindWalkableOffset` -- finds valid teleport positions on land
- `FindSwimmableOffset` -- finds valid teleport positions on water
- `MakeComponentAnInventoryItemSource` -- links follower to inventory item owner
- `RemoveComponentInventoryItemSource` -- unlinks follower from inventory item owner

**Components used:**
- `combat` -- drops target when leader changes if target is an ally; clears target during teleport
- `followermemory` -- calls `OnChangedLeader` when leader changes
- `hitchable` -- checks `canbehitched` before allowing teleport
- `inventoryitem` -- checked on leader to enable item-based ownership
- `leader` -- adds/removes follower from leader's tracking; checks `loyaltyeffectiveness` and `forceleash`
- `leaderrollcall` -- checks `IsEnabled` for roll call eligibility
- `locomotor` -- checks `CanPathfindOnLand` and `CanPathfindOnWater` for teleport positioning

**Tags:**
- `pocketdimension_container` -- checked to prevent teleporting to leaders in pocket dimensions
- `player` -- checked to enable leashing for player leaders

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `leader` | entity | `nil` | Current leader entity. Assignment fires `onleader` property watcher to sync replica. |
| `itemowner` | entity | `nil` | Owner when follower is an inventory item. Assignment fires `onitemowner` property watcher to sync replica. |
| `targettime` | number | `nil` | Timestamp when loyalty expires. Used with `maxfollowtime` for loyalty percentage. |
| `maxfollowtime` | number | `nil` | Maximum loyalty duration in seconds. Caps loyalty time additions. |
| `canaccepttarget` | boolean | `true` | Whether follower can accept combat targets independently. |
| `noleashing` | boolean | `nil` | When truthy, disables automatic leashing behavior. |
| `keepleaderonattacked` | boolean | `nil` | When truthy, prevents leader loss when attacked by leader. |
| `neverexpire` | boolean | `nil` | When truthy, loyalty timer never expires (immune to `StopFollowing`). |
| `hasitemsource` | boolean | `nil` | Internal flag tracking if follower is linked as inventory item source. |
| `canberollcalledfn` | function | `nil` | Custom callback for roll call eligibility. Signature: `fn(inst, leader) → boolean`. |
| `OnChangedLeader` | function | `nil` | External hook called when leader changes. Signature: `fn(inst, new_leader, prev_leader)`. |
| `task` | task | `nil` | Scheduled loyalty expiry task. Cancelled on leader change or cleanup. |
| `porttask` | task | `nil` | Scheduled teleport retry task for leashing. Cancelled on sleep/wake. |
| `cached_player_leader_userid` | string | `nil` | Cached player user ID for reconnection after disconnect. |
| `cached_player_leader_timeleft` | number | `nil` | Cached remaining loyalty time for reconnection. |
| `cached_player_leader_task` | task | `nil` | Task to clear cached player leader on expiry. |
| `_onleaderwake` | function | `nil` | Internal listener for leader wake events during leashing. |

## Main functions
### `GetDebugString()`
* **Description:** Returns a debug string showing current leader, item owner, and loyalty timer status.
* **Parameters:** None
* **Returns:** String with follower state information.
* **Error states:** None

### `GetLeader()`
* **Description:** Returns the effective leader, prioritizing `itemowner` over `leader`. Used for inventory item followers.
* **Parameters:** None
* **Returns:** Entity instance or `nil` if no leader.
* **Error states:** None

### `StartLeashing()`
* **Description:** Enables automatic teleport when follower is too far from leader. Registers entity sleep/wake listeners on leader.
* **Parameters:** None
* **Returns:** None
* **Error states:** None. Returns early if `noleashing` is truthy or leader is nil.

### `StopLeashing()`
* **Description:** Disables automatic teleport and cancels pending port tasks. Removes sleep/wake event listeners.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `DisableLeashing()`
* **Description:** Permanently disables leashing by setting `noleashing` to true. Calls `StopLeashing()` to cleanup.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `EnableLeashing()`
* **Description:** Re-enables leashing by clearing `noleashing`. Restarts leashing if leader is a player or inventory item.
* **Parameters:** None
* **Returns:** None
* **Error states:** None. Returns early if `noleashing` is already nil.

### `SetCanBeRollCalledFn(fn)`
* **Description:** Sets custom callback for roll call eligibility checks.
* **Parameters:** `fn` -- function with signature `fn(inst, leader) → boolean`
* **Returns:** None
* **Error states:** None

### `CanBeRollCalled(leader)`
* **Description:** Checks if follower can be roll called by leader. Checks `leaderrollcall` component and custom callback.
* **Parameters:** `leader` -- entity instance to check against
* **Returns:** `true` if roll call is allowed, `false` otherwise.
* **Error states:** None

### `CachePlayerLeader(userid, timeleft)`
* **Description:** Caches player leader information for reconnection after disconnect. Registers world event listeners for player join/spawn.
* **Parameters:**
  - `userid` -- string player user ID, or nil to use current leader's userid
  - `timeleft` -- number seconds of loyalty remaining, or nil to calculate from `targettime`
* **Returns:** None
* **Error states:** None

### `ClearCachedPlayerLeader()`
* **Description:** Clears cached player leader data and removes world event listeners. Called on leader change or cache expiry.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OnItemSourceNewOwner(owner)`
* **Description:** Called when inventory item source gets a new owner. Updates `itemowner` and registers with owner's `leader` component.
* **Parameters:** `owner` -- entity instance of new owner
* **Returns:** None
* **Error states:** None

### `OnItemSourceRemoved(owner)`
* **Description:** Called when inventory item source is removed. Clears `itemowner` and unregisters from owner's `leader` component.
* **Parameters:** `owner` -- entity instance of previous owner
* **Returns:** None
* **Error states:** None

### `SetLeader(new_leader)`
* **Description:** Sets the follower's leader. Handles cleanup of previous leader, registers with new leader's `leader` component, and enables leashing for player/inventory leaders.
* **Parameters:** `new_leader` -- entity instance or `nil` to clear leader
* **Returns:** None
* **Error states:** None

### `GetLoyaltyPercent()`
* **Description:** Returns loyalty as a percentage (0-1). Calculated from remaining time vs `maxfollowtime`.
* **Parameters:** None
* **Returns:** Number between 0 and 1, or 0 if no loyalty timer active.
* **Error states:** None

### `AddLoyaltyTime(time)`
* **Description:** Adds time to the loyalty timer. Applies `loyaltyeffectiveness` multiplier from leader's `leader` component. Caps at `maxfollowtime`.
* **Parameters:** `time` -- number seconds to add
* **Returns:** None
* **Error states:** None. Returns early if `neverexpire` is truthy.

### `CancelLoyaltyTask()`
* **Description:** Cancels the loyalty expiry task and clears `targettime`. Called on leader change.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `StopFollowing()`
* **Description:** Ends following behavior by clearing loyalty timer and calling `SetLeader(nil)`. Pushes `loseloyalty` event.
* **Parameters:** None
* **Returns:** None
* **Error states:** None. Returns early if `neverexpire` is truthy.

### `IsNearLeader(dist)`
* **Description:** Checks if follower is within `dist` units of leader.
* **Parameters:** `dist` -- number distance threshold
* **Returns:** `true` if within range and leader exists, `false` otherwise.
* **Error states:** None

### `OnSave()`
* **Description:** Serializes loyalty timer and cached player leader data for world save.
* **Parameters:** None
* **Returns:** Table with `time`, `cached_player_leader_userid`, `cached_player_leader_timeleft` or `nil` if no data to save.
* **Error states:** None

### `OnLoad(data)`
* **Description:** Restores loyalty timer and cached player leader data from world save.
* **Parameters:** `data` -- table from `OnSave()`
* **Returns:** None
* **Error states:** None

### `IsLeaderSame(guy)`
* **Description:** Checks if another entity shares the same leader as this follower.
* **Parameters:** `guy` -- entity instance to compare
* **Returns:** `true` if both have same leader, `false` otherwise.
* **Error states:** Errors if `guy` has no `follower` component (nil dereference on `guy.components.follower` — no guard present).

### `KeepLeaderOnAttacked()`
* **Description:** Enables flag to prevent leader loss when attacked by leader. Removes the "attacked" event listener.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `LoseLeaderOnAttacked()`
* **Description:** Re-enables leader loss on attack. Restores the "attacked" event listener.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `LongUpdate(dt)`
* **Description:** Updates loyalty timers during long update cycles. Adjusts remaining time based on `dt` and reschedules expiry tasks.
* **Parameters:** `dt` -- number delta time since last update
* **Returns:** None
* **Error states:** None

### `OnRemoveFromEntity()`
* **Description:** Cleanup called when component is removed from entity. Cancels all tasks and removes all event listeners.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OnRemoveEntity()`
* **Description:** Cleanup called when entity is removed. Clears inventory item source linkage.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `onattacked(inst, data)` (local)
* **Description:** Event listener for "attacked". Removes leader if attacker is the current leader (unless `keepleaderonattacked` is set).
* **Parameters:**
  - `inst` -- entity instance
  - `data` -- table with `attacker` field
* **Returns:** None
* **Error states:** None

### `onleader(self, leader)` (local)
* **Description:** Property watcher callback fired when `self.leader` is assigned. Syncs state to replica component.
* **Parameters:**
  - `self` -- component instance
  - `leader` -- new leader entity or nil
* **Returns:** None
* **Error states:** None

### `onitemowner(self, owner)` (local)
* **Description:** Property watcher callback fired when `self.itemowner` is assigned. Syncs state to replica component.
* **Parameters:**
  - `self` -- component instance
  - `owner` -- new item owner entity or nil
* **Returns:** None
* **Error states:** None

### `OnPlayerJoined(self, player)` (local)
* **Description:** Event listener for "ms_playerjoined". Reconnects cached player leader if within refollow distance and loyalty time remains.
* **Parameters:**
  - `self` -- component instance
  - `player` -- player entity that joined
* **Returns:** None
* **Error states:** None

### `OnNewPlayerSpawned(self, player)` (local)
* **Description:** Event listener for "ms_newplayerspawned". Clears cached player leader if spawning player matches cached userid.
* **Parameters:**
  - `self` -- component instance
  - `player` -- player entity that spawned
* **Returns:** None
* **Error states:** None

### `clear_cached_player_leader(inst, self)` (local)
* **Description:** Task callback to clear cached player leader on expiry.
* **Parameters:**
  - `inst` -- entity instance
  - `self` -- component instance
* **Returns:** None
* **Error states:** None

### `stopfollow(inst, self)` (local)
* **Description:** Task callback to stop following when loyalty timer expires. Calls `StopFollowing()`.
* **Parameters:**
  - `inst` -- entity instance
  - `self` -- component instance
* **Returns:** None
* **Error states:** None

### `TryPorting(inst, self)` (local)
* **Description:** Task callback for leashing teleport. Finds valid position near leader and teleports follower. Retries after 3 seconds if teleport fails.
* **Parameters:**
  - `inst` -- entity instance
  - `self` -- component instance
* **Returns:** None
* **Error states:** None

### `OnEntitySleep(inst)` (local)
* **Description:** Event listener for "entitysleep". Cancels port task and schedules retry after 0 seconds.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None

## Events & listeners
**Listens to:**
- `attacked` -- triggers `onattacked`; removes leader if attacker is the leader
- `entitywake` -- triggers leashing restart when leader wakes (registered on leader entity)
- `entitysleep` -- triggers `OnEntitySleep`; schedules teleport retry
- `onremove` -- triggers `OnLeaderRemoved`; clears leader when leader entity is removed (registered on leader entity)
- `ms_playerjoined` -- triggers `OnPlayerJoined`; reconnects cached player leader
- `ms_newplayerspawned` -- triggers `OnNewPlayerSpawned`; clears cached player leader on spawn

**Pushes:**
- `startleashing` -- fired when leashing is enabled. Data: `none`
- `stopleashing` -- fired when leashing is disabled. Data: `none`
- `leaderchanged` -- fired when leader changes. Data: `{ new = entity, old = entity }`
- `gainloyalty` -- fired when loyalty time is added. Data: `{ leader = entity }`
- `loseloyalty` -- fired when loyalty is lost. Data: `{ leader = entity }`
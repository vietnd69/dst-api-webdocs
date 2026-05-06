---
id: leader
title: Leader
description: Manages follower relationships and combat target sharing for entities that lead other creatures.
tags: [ai, followers, combat, leadership]
sidebar_position: 10
last_updated: 2026-04-18
build_version: 722832
change_status: stable
category_type: components
source_hash: 0ea7be93
system_scope: entity
---

# Leader

> Based on game build **722832** | Last updated: 2026-04-18

## Overview
`Leader` manages follower relationships for entities that can lead other creatures (such as players leading pigs or rockies). It tracks both regular followers and item-based followers, handles combat target sharing among followers, and manages follower lifecycle events. This component works closely with the `follower` component to establish bidirectional leader-follower relationships.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("leader")
inst:AddComponent("combat")

-- Add a follower
local pig = SpawnPrefab("pig")
pig:AddComponent("follower")
inst.components.leader:AddFollower(pig)

-- Check follower count
local count = inst.components.leader:GetNumFollowers()

-- Force leash followers
inst.components.leader:SetForceLeash()
```

## Dependencies & tags
**External dependencies:**
- `util/sourcemodifierlist` -- used for roll call source tracking via `SourceModifierList`

**Components used:**
- `combat` -- accessed on followers to suggest targets via `SuggestTarget()`
- `follower` -- accessed on followers to set leader and check `canaccepttarget`, `keepdeadleader`
- `inventory` -- checked for equipped items that may be pets
- `petleash` -- checked to identify if a target is a pet being dismissed
- `leaderrollcall` -- checked to determine if roll calling is enabled
- `minigame_participator` -- checked to exclude minigame participants from target sharing

**Tags:**
- `player` -- checked to determine PVP eligibility and achievement tracking
- `pig` -- counted for achievement tracking
- `rocky` -- counted for achievement tracking

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `followers` | table | `{}` | Table mapping follower entities to `true`. |
| `numfollowers` | number | `0` | Count of regular followers. |
| `itemfollowers` | table | `{}` | Table for virtual followers that treat this leader as their leader for interaction logic. |
| `numitemfollowers` | number | `0` | Count of item-based followers. |
| `forceleash` | boolean | `nil` | When `true`, forces followers to leash to this leader. |
| `roll_call_sources` | SourceModifierList | `nil` | Tracks roll call modifier sources. |
| `onfolloweradded` | function | `nil` | Callback fired when a follower is added. |
| `onremovefollower` | function | `nil` | Callback fired when a follower is removed. |

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Cleans up event listeners and removes all followers when the component is removed from the entity. Resets roll call sources if present.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SetForceLeash()`
* **Description:** Enables forced leashing for all followers of this leader.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `IsFollower(guy)`
* **Description:** Checks if an entity is currently following this leader (either as regular or item follower).
* **Parameters:** `guy` -- entity instance to check
* **Returns:** `true` if the entity is a follower, `false` otherwise
* **Error states:** None

### `OnAttacked(attacker)`
* **Description:** Called when the leader is attacked. Suggests the attacker as a combat target to all eligible followers. Excludes followers, self, and minigame participants unless PVP is enabled.
* **Parameters:** `attacker` -- entity that attacked the leader
* **Returns:** None
* **Error states:** None

### `GetNumFollowers()`
* **Description:** Returns the total count of regular followers. Preferred over `CountFollowers(nil)`.
* **Parameters:** None
* **Returns:** Number of followers
* **Error states:** None

### `CountFollowers(tag)`
* **Description:** Counts followers optionally filtered by tag. Returns total count if tag is nil.
* **Parameters:** `tag` -- string tag to filter by, or `nil` for all followers
* **Returns:** Number of followers matching the tag
* **Error states:** None

### `GetFollowersByTag(tag)`
* **Description:** Returns a table of all followers matching a specific tag.
* **Parameters:** `tag` -- string tag to filter by
* **Returns:** Table of follower entities, empty table if tag is nil or no matches
* **Error states:** None

### `SetIsRollCaller(source, boolval)`
* **Description:** Sets whether a source is a roll caller. Initializes `roll_call_sources` if not present.
* **Parameters:**
  - `source` -- identifier for the roll call source
  - `boolval` -- boolean value to set
* **Returns:** None
* **Error states:** None

### `IsRollCalling()`
* **Description:** Checks if this leader is currently roll calling. Checks `leaderrollcall` component first, then roll call sources.
* **Parameters:** None
* **Returns:** `true` if roll calling is active, `false` otherwise
* **Error states:** None

### `IsTargetedByFollowers(target)`
* **Description:** Checks if any follower is currently targeting a specific entity.
* **Parameters:** `target` -- entity to check for as a combat target
* **Returns:** `true` if any follower targets this entity, `false` otherwise
* **Error states:** None

### `IsTargetPet(target)`
* **Description:** Determines if a target is a pet that should be dismissed (not shared as combat target). Checks `petleash` component on leader and equipped items.
* **Parameters:** `target` -- entity to check
* **Returns:** `true` if target is a pet being dismissed, `false` otherwise
* **Error states:** None

### `OnNewTarget(target)`
* **Description:** Called when the leader acquires a new combat target. Shares the target with all eligible followers unless the target is a pet being dismissed. Excludes minigame participants unless PVP is enabled.
* **Parameters:** `target` -- new combat target entity or `nil`
* **Returns:** None
* **Error states:** None

### `RemoveFollower(follower, invalid)`
* **Description:** Removes a follower from the leader's follower list. Fires `stopfollowing` event and clears the follower's leader unless marked invalid.
* **Parameters:**
  - `follower` -- entity to remove as follower
  - `invalid` -- boolean, if `true` skips cleanup events on the follower
* **Returns:** None
* **Error states:** None

### `AddFollower(follower)`
* **Description:** Adds an entity as a follower. Sets up event listeners for follower death and removal. Triggers achievement checks for pig and rocky followers on player leaders.
* **Parameters:** `follower` -- entity to add as follower
* **Returns:** None
* **Error states:** None

### `AddItemFollower(itemfollower)`
* **Description:** Adds an entity as an item-based follower (virtual follower for interaction logic).
* **Parameters:** `itemfollower` -- entity to add as item follower
* **Returns:** None
* **Error states:** None

### `RemoveItemFollower(itemfollower)`
* **Description:** Removes an entity from the item follower list.
* **Parameters:** `itemfollower` -- entity to remove
* **Returns:** None
* **Error states:** None

### `RemoveFollowersByTag(tag, validateremovefn)`
* **Description:** Removes all followers matching a specific tag. Optionally validates each follower before removal.
* **Parameters:**
  - `tag` -- string tag to filter followers by
  - `validateremovefn` -- optional function that returns `true` to allow removal
* **Returns:** None
* **Error states:** None

### `RemoveAllFollowers()`
* **Description:** Removes all regular followers from this leader.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `RemoveAllFollowersOnDeath()`
* **Description:** Called when the leader dies. Removes all followers except those with `keepdeadleader` set to `true`.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `HaveFollowersCachePlayerLeader()`
* **Description:** Calls `CachePlayerLeader()` on all followers that have a follower component. Used for player leader caching on disconnect.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `IsBeingFollowedBy(prefabName)`
* **Description:** Checks if any follower (regular or item) matches a specific prefab name.
* **Parameters:** `prefabName` -- string prefab name to search for
* **Returns:** `true` if a matching follower exists, `false` otherwise
* **Error states:** None

### `OnSave()`
* **Description:** Serializes follower data for saving. Skips saving if the leader is a player. Returns follower GUIDs for persistence.
* **Parameters:** None
* **Returns:** Table with `followers` array of GUIDs, plus the array as second return value, or `nil` if no followers or is player
* **Error states:** None

### `LoadPostPass(newents, savedata)`
* **Description:** Restores followers from saved data after entity loading. Skips loading if the leader is a player.
* **Parameters:**
  - `newents` -- table mapping GUIDs to loaded entities
  - `savedata` -- saved component data table
* **Returns:** None
* **Error states:** None

### `GetDebugString()`
* **Description:** Returns a debug string showing follower count.
* **Parameters:** None
* **Returns:** String in format `"followers:<count>"`
* **Error states:** None

## Events & listeners
**Listens to:**
- `newcombattarget` -- calls `OnNewTarget()` when leader acquires new combat target
- `attacked` -- calls `OnAttacked()` when leader is attacked
- `death` -- calls `RemoveAllFollowersOnDeath()` when leader dies
- `onremove` (on followers) -- tracks follower removal via `_onfollowerremoved`
- `death` (on followers) -- tracks follower death via `_onfollowerdied`

**Pushes:**
- `startfollowing` -- fired on follower when added, data includes `leader` entity
- `stopfollowing` -- fired on follower when removed, data includes `leader` entity
- `leaderchanged` -- fired on follower when leader changes (via `follower:SetLeader()`)
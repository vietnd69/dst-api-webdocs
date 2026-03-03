---
id: leader
title: Leader
description: Manages a group of follower entities, coordinates shared combat targets, and handles follower lifecycle events.
tags: [ai, group, combat, leadership]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 8c00070f
system_scope: entity
---

# Leader

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Leader` component enables an entity to command and coordinate a group of followers—typically creatures or items that follow and assist the leader. It manages follower addition/removal, distributes combat targets to followers when the leader acquires a target or is attacked, and handles persistence across world saves. It works closely with the `follower` and `combat` components of follower entities to propagate targeting decisions and synchronize group behavior.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("leader")

-- Add a follower entity (e.g., a pig or rocky)
local follower = The世界.entities["pig_123"]
if follower and follower.components.follower then
    inst.components.leader:AddFollower(follower)
end

-- Get number of followers
local count = inst.components.leader:CountFollowers()

-- Distribute a combat target to all followers
inst.components.leader:OnNewTarget(some_enemy)
```

## Dependencies & tags
**Components used:** `combat`, `follower`, `inventory`, `petleash`, `minigame_participator`  
**Tags:** None added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `followers` | table | `{}` | Map of active follower entities (`entity → true`). |
| `numfollowers` | number | `0` | Count of regular followers. |
| `itemfollowers` | table | `{}` | Map of virtual followers (e.g., equipped items acting as leader for other entities). |
| `numitemfollowers` | number | `0` | Count of item-based followers. |
| `forceleash` | boolean | `nil` | If set via `SetForceLeash()`, causes followers to remain leashed. |

## Main functions
### `OnAttacked(attacker)`
*   **Description:** When the leader is attacked, broadcasts the attacker as a new target to all followers that can accept targets.
*   **Parameters:** `attacker` (Entity) - the entity that attacked the leader.
*   **Returns:** Nothing.
*   **Error states:** Does not broadcast to followers that are themselves attackers, the leader itself, or participate in non-PVP minigames (unless PVP is enabled).

### `OnNewTarget(target)`
*   **Description:** Broadcasts a newly acquired combat target to all followers, enabling coordinated aggression. Pet dismissals are respected.
*   **Parameters:** `target` (Entity) - the new target entity, or `nil`.
*   **Returns:** Nothing.
*   **Error states:** Returns early if the target is a pet; does not broadcast to minigame participants unless PVP is enabled.

### `AddFollower(follower)`
*   **Description:** Registers an entity as a follower, sets its `leader` field via the `follower` component, and subscribes to follower lifecycle events.
*   **Parameters:** `follower` (Entity) - the entity to add as a follower.
*   **Returns:** Nothing.
*   **Error states:** No effect if the follower is already registered or lacks a `follower` component.

### `RemoveFollower(follower, invalid)`
*   **Description:** Unregisters a follower, resets its leader to `nil`, and fires the `"stopfollowing"` event.
*   **Parameters:**  
    * `follower` (Entity) - the follower to remove.  
    * `invalid` (boolean) - if `true`, skips resetting leader and firing events (used internally during entity removal).
*   **Returns:** Nothing.

### `CountFollowers(tag)`
*   **Description:** Returns the total number of followers; optionally filters by a specific tag.
*   **Parameters:** `tag` (string or `nil`) - optional tag to count only followers with that tag.
*   **Returns:** number - count of matching followers.

### `GetFollowersByTag(tag)`
*   **Description:** Returns an array of followers matching the given tag.
*   **Parameters:** `tag` (string) - tag to filter by (if `nil`, returns empty array).
*   **Returns:** table - array of follower entities.

### `AddItemFollower(itemfollower)`
*   **Description:** Adds an item-based follower (used for interaction logic, not persistence). Not saved across sessions.
*   **Parameters:** `itemfollower` (Entity) - the item or entity to register as a virtual follower.
*   **Returns:** Nothing.

### `RemoveItemFollower(itemfollower)`
*   **Description:** Removes an item-based follower.
*   **Parameters:** `itemfollower` (Entity) - the item follower to remove.
*   **Returns:** Nothing.

### `RemoveAllFollowersOnDeath()`
*   **Description:** Removes all followers upon leader death, respecting `keepdeadleader` on individual followers.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `HaveFollowersCachePlayerLeader()`
*   **Description:** Calls `CachePlayerLeader()` on each follower’s `follower` component, caching the player leader identity for networked synchronization.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `IsFollower(guy)`
*   **Description:** Checks whether an entity is registered as either a regular or item follower.
*   **Parameters:** `guy` (Entity) - entity to check.
*   **Returns:** boolean - `true` if the entity is a follower.

### `IsTargetPet(target)`
*   **Description:** Determines if a given target is a pet (via `petleash`) of the leader or of any equipped inventory item.
*   **Parameters:** `target` (Entity or `nil`) - the entity to check.
*   **Returns:** boolean - `true` if the target is a pet.

### `OnSave()` and `LoadPostPass(newents, savedata)`
*   **Description:** Persist and restore follower relationships for non-player leaders. Saves GUIDs of followers; restores them during world load.
*   **Parameters:**  
    * `OnSave()` — None.  
    * `LoadPostPass(newents, savedata)` — `newents` (table) — mapping of GUIDs to entities; `savedata` (table or `nil`) — saved follower GUID list.
*   **Returns:**  
    * `OnSave()` — `{ followers = { guid1, guid2, ... } }` (table) if followers exist, else `nil`.  
    * `LoadPostPass` — Nothing.

### `GetDebugString()`
*   **Description:** Returns a human-readable debug summary for UI or logging.
*   **Parameters:** None.
*   **Returns:** string — `"followers:" .. self.numfollowers`.

## Events & listeners
- **Listens to:**  
    * `"newcombattarget"` — triggers `OnNewTarget(data.target)`.  
    * `"attacked"` — triggers `OnAttacked(data.attacker)`.  
    * `"death"` — triggers `RemoveAllFollowersOnDeath()`.  
- **Pushes:**  
    * Via follower callbacks: `"startfollowing"` (when adding a follower), `"stopfollowing"` (when removing a follower).  
    * `"leaderchanged"` events are pushed by follower components (not directly by this component).  
- **Fires callbacks:**  
    * `self.onfolloweradded(inst, follower)` — custom callback set externally.  
    * `self.onremovefollower(inst, follower)` — custom callback set externally.  
    * Achievements and profile stats for player leaders (e.g., `"pigman_posse"`, `"rocky_posse"`).

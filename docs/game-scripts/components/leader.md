---
id: leader
title: Leader
description: Manages a group of followers that follow and assist the entity in combat and movement.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 8c00070f
---

# Leader

## Overview
This component enables an entity to maintain and manage a group of followers—both living entities (e.g., pigs, wolves) and item-based followers (e.g., pets in inventory slots). It coordinates combat target sharing, tracks follower counts, handles follower lifecycle events (e.g., joining, leaving, dying), and supports achievement tracking and save/load persistence for non-player leaders.

## Dependencies & Tags
- **Components:** Assumes followers have the `follower` and `combat` components; leader may have `petleash`, `inventory`, and `minigame_participator`.
- **Tags:** Relies on `"player"`, `"pig"`, `"rocky"`, and `"pet"` (indirectly via `petleash`). No tags are added by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity this component is attached to. |
| `followers` | `table` | `{}` | Map of active entity followers (key = entity, value = `true`). |
| `numfollowers` | `number` | `0` | Count of regular entity followers. |
| `itemfollowers` | `table` | `{}` | Map of virtual/item followers (e.g., equippable pets); not persisted. |
| `numitemfollowers` | `number` | `0` | Count of item followers. |
| `forceleash` | `boolean` | `false` | Set via `SetForceLeash()`; used to enforce leash behavior. |
| `_onfollowerdied` | `function` | — | Internal callback to remove follower on death event. |
| `_onfollowerremoved` | `function` | — | Internal callback to remove follower on remove-from-world event. |

## Main Functions
### `OnRemoveFromEntity()`
* **Description:** Cleans up event listeners and removes all followers when the leader is removed from the world.
* **Parameters:** None.

### `SetForceLeash()`
* **Description:** Enables strict leash enforcement for the leader.
* **Parameters:** None.

### `IsFollower(guy)`
* **Description:** Checks whether the given entity is currently following this leader (either as a regular or item follower).
* **Parameters:**
  * `guy` (`Entity`): The entity to check.

### `OnAttacked(attacker)`
* **Description:** When the leader is attacked by a non-follower, notifies all followers to engage the attacker (if they meet combat/follower conditions).
* **Parameters:**
  * `attacker` (`Entity?`): The entity that attacked the leader.

### `CountFollowers(tag)`
* **Description:** Returns the total number of followers, optionally filtered by a specific tag.
* **Parameters:**
  * `tag` (`string?`): Optional tag to count only followers with this tag.

### `GetFollowersByTag(tag)`
* **Description:** Returns a table of followers matching the specified tag.
* **Parameters:**
  * `tag` (`string?`): Required tag to filter followers.

### `IsTargetedByFollowers(target)`
* **Description:** Returns `true` if *any* follower is currently targeting the specified entity.
* **Parameters:**
  * `target` (`Entity?`): The entity to check for targeting.

### `IsTargetPet(target)`
* **Description:** Determines whether the target is a pet of this leader (via `petleash` component or equippable slot).
* **Parameters:**
  * `target` (`Entity?`): The entity to check.

### `OnNewTarget(target)`
* **Description:** Informs all followers to switch to or engage the specified new target, unless the target is a dismissed pet.
* **Parameters:**
  * `target` (`Entity?`): The new combat target; may be `nil`.

### `RemoveFollower(follower, invalid)`
* **Description:** Removes a single follower, updates internal state, and cleans up associated event listeners and follower references.
* **Parameters:**
  * `follower` (`Entity?`): The entity to remove.
  * `invalid` (`boolean`): If `true`, suppresses event notifications (used during world teardown).

### `AddFollower(follower)`
* **Description:** Adds a living entity as a follower, sets up event listeners, updates counters, and may trigger achievements or stats.
* **Parameters:**
  * `follower` (`Entity?`): The entity to add as a follower.

### `AddItemFollower(itemfollower)`
* **Description:** Adds a non-entity (e.g., equippable pet) as a virtual follower.
* **Parameters:**
  * `itemfollower` (`Entity?`): The item to track as an item follower.

### `RemoveItemFollower(itemfollower)`
* **Description:** Removes a virtual item follower.
* **Parameters:**
  * `itemfollower` (`Entity?`): The item to remove.

### `RemoveFollowersByTag(tag, validateremovefn)`
* **Description:** Removes all followers matching a given tag, optionally filtered by a custom validator function.
* **Parameters:**
  * `tag` (`string`): Tag to match.
  * `validateremovefn` (`function?`): Optional callback to decide per-follower removal.

### `RemoveAllFollowers()`
* **Description:** Immediately removes all regular followers.
* **Parameters:** None.

### `RemoveAllFollowersOnDeath()`
* **Description:** Removes all followers upon leader’s death, unless they are configured to stay (`keepdeadleader`).
* **Parameters:** None.

### `HaveFollowersCachePlayerLeader()`
* **Description:** Instructs all followers to cache the player leader (used for UI/sync efficiency).
* **Parameters:** None.

### `IsBeingFollowedBy(prefabName)`
* **Description:** Checks if any follower is of the given prefab name (checked in both regular and item follower lists).
* **Parameters:**
  * `prefabName` (`string`): The prefab name to check.

### `OnSave()`
* **Description:** Serializes follower GUIDs for non-player leaders during world save.
* **Parameters:** None.  
* **Returns:** `{ followers = {guids...} }` and raw follower guids, or `nil` for players or no followers.

### `LoadPostPass(newents, savedata)`
* **Description:** Reconnects followers after save loading using GUIDs for non-player leaders.
* **Parameters:**
  * `newents` (`table`): Map of GUID → entity for loaded entities.
  * `savedata` (`table?`): Saved data containing follower GUIDs.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string showing the follower count.
* **Parameters:** None.  
* **Returns:** `string` in the format `"followers:<count>"`.

## Events & Listeners
- **Listens to:**
  - `"newcombattarget"` → calls `OnNewCombatTarget`, which invokes `OnNewTarget`.
  - `"attacked"` → calls `OnAttacked`.
  - `"death"` → calls `OnDeath`, which invokes `RemoveAllFollowersOnDeath`.
  - `"death"` (follower-specific) → removes follower via `_onfollowerdied`.
  - `"onremove"` (follower-specific) → removes follower via `_onfollowerremoved`.
- **Triggers:**
  - `"startfollowing"` on the follower when added.
  - `"stopfollowing"` on the follower when removed (unless `invalid` is true).
  - Achievements `"pigman_posse"` and `"rocky_posse"` when follower counts meet tuning thresholds.
  - `"TotalFollowersAcquired"` via `NotifyPlayerProgress` on follower addition.
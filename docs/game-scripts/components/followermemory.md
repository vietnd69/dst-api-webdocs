---
id: followermemory
title: Followermemory
description: Manages memory and tracking of a follower's leader across saves, spawns, and gameplay events in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 73b6c308
---

# Followermemory

## Overview
This component persists and tracks the identity of a leader for an entity (typically a follower), including handling reunification logic, wake/sleep state transitions, and event-driven leader loss (e.g., on being attacked by the leader). It works in conjunction with the `follower` component but can operate independently for memory persistence.

## Dependencies & Tags
- **Dependencies:**
  - Uses `inst.components.follower` if present (to set/get the active leader via `follower:SetLeader`, `follower:GetLeader`).
  - Interacts with `TheWorld` for listening to `ms_playerjoined`.
- **Tags:** None explicitly added/removed.
- **Events:**
  - Listens to `attacked` on itself (`inst`) to forget leader if attacked by the leader.
  - Listens to `ms_playerjoined` on `TheWorld` to detect when the remembered leader re-joins the world.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(none)* | Reference to the entity this component is attached to. |
| `reuniterange` | `number` | `40` | Distance threshold (in world units) to trigger reunite callback when near the leader. |
| `onreuniteleaderfn` | `function?` | `nil` | Callback invoked when the entity reunites with its leader within `reuniterange`. Signature: `fn(entity, leader_player)`. |
| `onleaderlostfn` | `function?` | `nil` | Callback invoked when the leader is lost (e.g., leaves world, dies, forgets) *during play* (not on loading from save). Signature: `fn(entity)`. |
| `leaderid` | `string?` | `nil` | Unique user ID of the remembered leader. |
| `leaderchar` | `string?` | `nil` | Prefab name of the remembered leader (e.g., "wanda"). |
| `watching` | `function?` | `nil` | Internal listener function for `ms_playerjoined`. |
| `task` | `DoPeriodicTask?` | `nil` | Active periodic task used to track leader proximity and validity. |

## Main Functions
### `SetReuniteRange(dist)`
* **Description:** Sets the distance threshold (in world units) used to detect reunification with the leader.
* **Parameters:**
  * `dist` (number): New range value.

### `SetOnReuniteLeaderFn(fn)`
* **Description:** Assigns a callback function to execute when the entity reunites with its leader (i.e., is within `reuniterange` and not asleep).
* **Parameters:**
  * `fn` (function?): Function to invoke on reunite, or `nil` to clear.

### `SetOnLeaderLostFn(fn)`
* **Description:** Assigns a callback function to execute when the leader is lost (e.g., leaves the world) during active gameplay. *Does not trigger on reload if the leader was already lost at save time.*
* **Parameters:**
  * `fn` (function?): Function to invoke on leader loss, or `nil` to clear.

### `RememberAndSetLeader(player)`
* **Description:** Records the given player as the leader and, if the `follower` component is present, immediately assigns them as the active leader; otherwise, starts watching for them to return.
* **Parameters:**
  * `player` (`PlayerController`): Player object with `userid` and `prefab`.

### `RememberLeaderDetails(id, prefab)`
* **Description:** Records leader identity (`id`, `prefab`) if no active leader exists *or* if the current follower leader matches the given details. Starts/stops watching as needed.
* **Parameters:**
  * `id` (string): Leader’s user ID.
  * `prefab` (string): Leader’s prefab name.

### `ForgetLeader()`
* **Description:** Clears all leader memory and stops watching/tracking.

### `HasRememberedLeader()`
* **Description:** Returns `true` if a leader ID is currently remembered (does not guarantee the leader is present in the world).
* **Return Type:** `boolean`

### `IsRememberedLeader(target)`
* **Description:** Checks if the given entity matches the remembered leader’s `userid` and `prefab`.
* **Parameters:**
  * `target` (`Entity`): Entity to compare against remembered leader.
* **Return Type:** `boolean`

### `StartTrackingPlayer(player)`
* **Description:** Begins a periodic task to monitor the specified player. Checks if they are the leader, valid, and in range; triggers reunite callback if conditions are met.
* **Parameters:**
  * `player` (`PlayerController`): Player to track.

### `StopTrackingPlayer()`
* **Description:** Cancels any active tracking task.

### `StartWatchingForLeader()`
* **Description:** Begins listening for `ms_playerjoined` events on `TheWorld` to detect when the remembered leader rejoins. Also wakes the entity if not asleep.
* **Internal Use Only.**

### `StopWatchingForLeader()`
* **Description:** Stops listening for `ms_playerjoined`, cancels tracking task, and clears the watching handler.
* **Internal Use Only.**

### `OnEntityWake()`
* **Description:** Called when the entity wakes from sleep. Scans all players to resume tracking the remembered leader if found.
* **Internal Use Only.**

### `OnChangedLeader(leader)`
* **Description:** Syncs memory with the state of the `follower` component’s current leader. Handles loss, reassignment, or reconnection.
* **Parameters:**
  * `leader` (`PlayerController?`): Current leader assigned by the `follower` component, or `nil`.

### `OnSave()`
* **Description:** Returns serializable data containing the remembered leader’s ID, prefab, and a flag indicating if the leader is *currently* lost (i.e., not set in `follower`).
* **Return Type:** `{ id: string, char: string, lost: boolean? }` or `nil`.

### `OnLoad(data)`
* **Description:** Restores leader memory from save data and reinitializes tracking/watching logic.
* **Parameters:**
  * `data` (table): Data returned from `OnSave()`.

### `GetDebugString()`
* **Description:** Returns a debug string showing remembered leader ID and prefab.
* **Return Type:** `string`

## Events & Listeners
- Listens to `"attacked"` on `inst` (the entity): Triggers `OnAttacked` to forget the leader if attacked by the remembered leader.
- Listens to `"ms_playerjoined"` on `TheWorld`: Triggers `self.watching` to detect when the remembered leader re-joins the world.
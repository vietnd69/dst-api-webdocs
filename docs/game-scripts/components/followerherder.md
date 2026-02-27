---
id: followerherder
title: Followerherder
description: A component that toggles follower hostility when used and reduces its own uses, typically attached to items like the Shepherd's Crook.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 32c166e5
---

# Followerherder

## Overview
The `FollowerHerder` component enables an entity (typically a tool) to herd followers by toggling their hostile state (e.g., turning them from hostile to non-hostile or vice versa). It also consumes uses from the entity's `finiteuses` component (if present) and supports custom logic via configurable callbacks.

## Dependencies & Tags
- Requires the entity to have a `leader` component with a populated `followers` table (accessed during `Herd()`).
- May interact with the `finiteuses` component if present on the same entity (to consume uses).
- Does not add or remove tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned in constructor) | Reference to the entity that owns this component. |
| `hostile` | `boolean` | `true` | Tracks the current hostile state to apply to followers. |
| `canherdfn` | `function?` | `nil` | Optional callback function `(self, leader) → (can_herd: boolean, reason?: string)` to determine if herding is allowed. |
| `onherfn` | `function?` | `nil` | Optional callback function `(self, leader)` executed after successful herding. |
| `use_amount` | `number?` | `nil` | Number of uses to consume during herding; defaults to `1` if not set. |

## Main Functions
### `SetCanHerdFn(fn)`
* **Description:** Sets an optional custom function to determine whether the entity can herd a given leader. If this function returns `false`, the `Herd` operation is aborted.
* **Parameters:**  
  `fn` (`function`) — A function with signature `(self, leader) → (can_herd: boolean, reason?: string)`.

### `SetOnHerdFn(fn)`
* **Description:** Sets an optional callback function executed after a successful herding action (i.e., hostility toggle and use consumption).
* **Parameters:**  
  `fn` (`function`) — A function with signature `(self, leader)`.

### `SetUseAmount(use_amount)`
* **Description:** Configures how many uses are consumed when the `Herd` action is performed.
* **Parameters:**  
  `use_amount` (`number`) — The number of uses to deduct; defaults to `1` if not set.

### `CanHerd(leader)`
* **Description:** Checks whether herding is permitted for a given leader entity. Executes the `canherdfn` callback if set; otherwise, permits herding unconditionally.
* **Parameters:**  
  `leader` (`Entity`) — The entity acting as the leader whose followers would be affected.

### `Herd(leader)`
* **Description:** Executes the herding action: toggles the `hostile` state of all followers of the leader to match the inverse of the current `hostile` value, consumes uses (if `finiteuses` is present), and invokes the `onherfn` callback if set.
* **Parameters:**  
  `leader` (`Entity`) — The leader whose followers are being herded.

## Events & Listeners
None.
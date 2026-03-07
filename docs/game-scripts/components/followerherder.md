---
id: followerherder
title: Followerherder
description: Manages herd behavior for a leader entity, toggling hostile state of all followers and consuming finite uses when triggered.
tags: [ai, leader, follower]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 32c166e5
system_scope: entity
---

# Followerherder

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Followerherder` is a component that allows an entity to control the hostility state of followers associated with a given leader. When activated (typically via an action), it inverts the current `hostile` state for all followers and optionally consumes uses from a `finiteuses` component. It supports custom validation (`CanHerd`) and side-effect (`Herd`) callbacks via function hooks.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("followerherder")
inst.components.followerherder:SetUseAmount(1)
inst.components.followerherder:SetCanHerdFn(function(self_inst, leader)
    return leader:HasTag("herdable_leader"), "Leader is not herdable"
end)
inst.components.followerherder:SetOnHerdFn(function(self_inst, leader)
    print("Follower herd triggered for leader:", leader:GetDebugName())
end)
```

## Dependencies & tags
**Components used:** `finiteuses`, `leader`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `hostile` | boolean | `true` | Current hostility state; toggled on herd action. |
| `canherdfn` | function or nil | `nil` | Optional predicate function `(self, leader) -> can_herd: boolean, reason: string?`. |
| `onherfn` | function or nil | `nil` | Optional callback function `(self, leader)` invoked after herding. |
| `use_amount` | number | `1` | Number of uses to consume from `finiteuses` if present. |

## Main functions
### `SetCanHerdFn(fn)`
*   **Description:** Assigns a custom predicate function used by `CanHerd` to determine if herding is allowed.
*   **Parameters:** `fn` (function or nil) - Signature: `fn(self, leader) -> can_herd: boolean, reason?: string`.
*   **Returns:** Nothing.

### `SetOnHerdFn(fn)`
*   **Description:** Assigns a callback function executed after a successful `Herd` action.
*   **Parameters:** `fn` (function or nil) - Signature: `fn(self, leader)`.
*   **Returns:** Nothing.

### `SetUseAmount(use_amount)`
*   **Description:** Sets the number of uses to consume from the `finiteuses` component on `Herd`.
*   **Parameters:** `use_amount` (number) - Number of uses to consume; defaults to `1` if not set or if `nil`.
*   **Returns:** Nothing.

### `CanHerd(leader)`
*   **Description:** Checks whether the current entity can herd the given `leader`. Runs the optional `canherdfn` predicate first, if present.
*   **Parameters:** `leader` (Entity) - The entity whose followers would be controlled.
*   **Returns:** `can_herd: boolean, reason?: string` — `true` if allowed; optionally returns a reason string on failure.
*   **Error states:** Returns `false, reason` if `canherdfn` is set and returns `false` or a falsy value.

### `Herd(leader)`
*   **Description:** Executes the herd action: toggles `hostile` state for all followers of the `leader`, consumes finite uses (if applicable), and runs the `onherfn` callback if set.
*   **Parameters:** `leader` (Entity) - The leader whose followers' hostility states are inverted.
*   **Returns:** Nothing.
*   **Error states:** If `leader` has no `leader` component or no followers, no followers are toggled, but the component still attempts to consume uses and call `onherfn`. No explicit error is thrown.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.

---
id: teamattacker
title: Teamattacker
description: Manages an entity's behavior as a team member, including joining/leaving teams, responding to team orders (attack, warn, hold), following formation positions, and returning home when too far from the home location.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: b7e24da9
---

# Teamattacker

## Overview
This component enables an entity to function as a coordinated team member within the Entity Component System. It handles team membership (including dynamic team type updates), searches for available team leaders, follows formation positions, executes team orders (e.g., `ATTACK`, `WARN`, `HOLD`), and ensures entities return home when outside the leash radius. It integrates with `teamleader`, `combat`, `locomotor`, `health`, and `knownlocations` components to implement coordinated group behavior.

## Dependencies & Tags
**Components Required:**
- `teamleader` (on potential leaders — accessed only if present)
- `combat`
- `locomotor`
- `health`
- `knownlocations`

**Tags:**
- Dynamically adds/removes tags of the form `"team_<type>"` (e.g., `"team_monster"`) based on `team_type`.
- Does *not* manage or require any static tags on itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (injected) | Reference to the owning entity instance. |
| `inteam` | `boolean` | `false` | Indicates whether the entity is currently in a team (not directly used in logic, but tracked). |
| `searchradius` | `number` | `50` | Radius used by `SearchForTeam()` to scan for potential team leaders. |
| `leashdistance` | `number` | `70` | Distance threshold beyond which `ShouldGoHome()` returns `true`, triggering a call to `LeaveTeam()`. |
| `team_type` | `string` | `"monster"` | String identifier used to form `"team_<team_type>"` tag and search tags (`"teamleader_<team_type>"`). |
| `teamsearchtags` | `table` or `nil` | initially `nil`, set in `onteamspec` | List of tags used to search for team leaders. Set to `{"teamleader_<team_type>"}` when a team type is assigned. |
| `teamleader` | `ComponentTeamleader` or `nil` | `nil` | Reference to the team leader component (not stored in constructor; assumed to be set externally or via `teamleader:NewTeammate()`). |
| `formationpos` | `Vector3` or `nil` | `nil` | Target position for formation movement (set externally, likely by the leader). |
| `orders` | `ORDERS.*` or `nil` | `nil` | Current order (e.g., `ORDERS.ATTACK`, `ORDERS.HOLD`). Initialized to `nil`. |
| `ignoreformation` | `boolean` or `nil` | `nil` | Flag set by `LeaveFormation()` to disable formation movement. |

## Main Functions

### `GetDebugString()`
* **Description:** Returns a human-readable string for debugging, indicating whether the entity is in a team and its current orders.
* **Parameters:** None.

### `SearchForTeam()`
* **Description:** Searches for an available team leader within `searchradius`. If found, requests to join the team via the leader's `NewTeammate()` method. Returns `true` if successfully joined; otherwise `false`.
* **Parameters:** None.

### `OnEntitySleep()`
* **Description:** Pauses component updates and notifies the team leader (if present) that this member has left the team.
* **Parameters:** None.

### `OnEntityWake()`
* **Description:** Resumes component updates when the entity wakes.
* **Parameters:** None.

### `ShouldGoHome()`
* **Description:** Checks whether the entity is outside the `leashdistance` from its registered `"home"` location (retrieved via `knownlocations:GetLocation("home")`). Returns `true` if too far.
* **Parameters:** None.

### `LeaveTeam()`
* **Description:** Notifies the team leader (if present) that this entity is leaving the team. Does *not* set `teamleader` to `nil`.
* **Parameters:** None.

### `LeaveFormation()`
* **Description:** Sets `ignoreformation = true`, disabling formation movement in `OnUpdate()`.
* **Parameters:** None.

### `JoinFormation()`
* **Description:** Clears `ignoreformation`, re-enabling formation movement in `OnUpdate()`.
* **Parameters:** None.

### `GetOrders()`
* **Description:** Returns the current `orders` value (e.g., `ORDERS.ATTACK`).
* **Parameters:** None.

### `SetValidMemberFn(fn)`
* **Description:** Assigns a custom predicate function (`validmemberfn`) used to validate team membership. Not directly used in this file but likely referenced by the team leader.
* **Parameters:**
  - `fn`: A function to use for validating membership criteria.

### `OnUpdate(dt)`
* **Description:** Primary tick function called every frame while the entity is awake. Handles:
  - Leaving the team if too far from home (`ShouldGoHome()`).
  - Executing orders when the entity has a leader and the leader can attack:
    - If `orders` is `nil`, `WARN`, or `HOLD`: maintain formation, optionally switch to `ATTACK` if taking fire.
    - If `orders` is `ATTACK`: adopt the leader’s current threat (`teamleader.threat`) as the combat target.
* **Parameters:**
  - `dt`: Delta time in seconds.

## Events & Listeners
The component does not register any `inst:ListenForEvent` handlers or push events via `inst:PushEvent`.
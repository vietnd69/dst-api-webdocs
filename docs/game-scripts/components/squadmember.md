---
id: squadmember
title: Squadmember
description: Manages entity membership in squads, tracking other members and broadcasting join/leave events.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: ac1b27e1
---

# Squadmember

## Overview
The `SquadMember` component tracks whether an entity belongs to a squad (a named group), maintains a set of currently grouped entities, and listens for squad membership events (join/leave) to update tracking accordingly. It supports dynamic squad membership changes, automatic bidirectional tracking between squad members, and event-driven lifecycle management (e.g., removal from entity triggers squad exit).

## Dependencies & Tags
- **Component dependency:** Relies on the `squadmember` component being present on other entities for bidirectional tracking (via `other.components.squadmember`).
- **No explicit tag changes** are made on the entity itself.
- Uses global world events (`ms_joinsquad_*`, `ms_leavesquad_*`) via `TheWorld:PushEvent` and `inst:ListenForEvent`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this component is attached to. |
| `squad` | `string` or `nil` | `""` (empty string) | The name of the squad this entity belongs to; `nil` after leaving a squad. |
| `others` | `table` | `{}` | A set-like table mapping other squad members (entities) to `true`; cleared on leave/disconnect. |

## Main Functions

### `IsInSquad()`
* **Description:** Returns whether the entity is currently in any squad (i.e., `squad` is non-empty).
* **Parameters:** None.

### `GetSquadName()`
* **Description:** Returns the current squad name as a string, or an empty string if not in a squad.
* **Parameters:** None.

### `GetOtherMembers()`
* **Description:** Returns the internal set of currently tracked squad members (other entities).
* **Parameters:** None.

### `JoinSquad(squadname)`
* **Description:** Joins the specified squad (or empty string to clear membership). Automatically stops tracking old members, updates `squad`, registers for join events on the new squad, and broadcasts a join event. Bidirectional tracking with new members is established via `_onotherjoined`.
* **Parameters:**
  * `squadname` (`string`, optional, default `""`): The name of the squad to join.

### `LeaveSquad()`
* **Description:** Exits the current squad: stops tracking all members, clears the `squad` field, and broadcasts a leave event for the previous squad. Called automatically on entity removal via `OnRemoveFromEntity`.
* **Parameters:** None.

### `GetDebugString()`
* **Description:** Returns a multi-line debug string summarizing squad membership: the squad name in angle brackets, followed by line-by-line references to tracked members. Returns `nil` if not in a squad.
* **Parameters:** None.

## Events & Listeners
- **Listens for (`inst:ListenForEvent`):**
  - `"ms_joinsquad_<squadname>"` → triggers `_onotherjoined`
  - `"ms_leavesquad_<squadname>"` → triggers `_onotherleft`
  - `"onremove"` → triggers `_onotherleft`
- **Triggers (`inst:PushEvent` or `TheWorld:PushEvent`):**
  - `"ms_joinsquad_<squadname>"` (via `TheWorld`) when joining a squad.
  - `"ms_leavesquad_<squadname>"` when leaving a squad.
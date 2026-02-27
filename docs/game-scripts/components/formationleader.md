---
id: formationleader
title: Formationleader
description: Manages the behavior and coordination of a group of entities (formations) that move together in patterns relative to a leader entity.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 71d0fefd
---

# Formationleader

## Overview
The `FormationLeader` component enables an entity to act as the leader of a dynamic formation—managing the inclusion, positioning, and coordination of follower entities in geometric arrangements, while responding to formation changes, disbanding, size limits, and target validity.

## Dependencies & Tags
- Adds/removes tags based on `formation_type`: `formationleader_<type>` (e.g., `formationleader_monster`) on the leader entity.
- Assumes the following components exist on the leader and/or members:
  - `health` (to check for death)
  - `formationfollower` (on member entities)
  - `combat` (to drop target)
  - `follower` (optional; to sync leader with target)
- Listens to entity events: `"death"`, `"onremove"`, `"onenterlimbo"` on members.
- Uses `TheSim:FindEntities` to locate nearby formation leaders targeting the same entity.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `formation_type` | string | `"monster"` | Category/type of the formation, determines tagging and member eligibility. |
| `max_formation_size` | number | `6` | Maximum number of members allowed in the formation. |
| `formation` | table | `{}` | Map of member entities in the formation (keyed by entity reference). |
| `target` | entity/`nil` | `nil` | The entity the formation is following/defending. |
| `searchradius` | number | `50` | Radius used to find other formations during `OrganizeFormations`. |
| `theta` | number | `math.random() * TWOPI` | Current angular offset (radians) for position calculation. |
| `thetaincrement` | number | `1` | Angular step size per second for formation rotation. |
| `radius` | number | `5` | Radial distance from leader for first member position. |
| `reverse` | boolean | `false` | If `true`, rotation direction is inverted. |
| `makeotherformationssecondaryfn` | function | `DefaultMakeOtherFormationsSecondary` | Callback to propagate formation parameters to other formations. |
| `age` | number | `0` | Accumulated update time used for formation priority sorting. |
| `ondisbandfn` | function (optional) | `nil` | Callback triggered on formation disband (commented out in source). |
| `onupdatefn` | function (optional) | `nil` | Custom update hook (commented out in source). |

## Main Functions

### `GetFormationSize()`
* **Description:** Returns the current count of valid, non-leader members in the formation.
* **Parameters:** None.

### `SetUp(target, first_member)`
* **Description:** Initializes the leader with a target and first member; infers formation type from the first member and adds them.
* **Parameters:**
  - `target`: The entity to follow/defend (e.g., a player or structure).
  - `first_member`: The first entity to join the formation; its `formationfollower.formation_type` sets the leader’s type.

### `OrganizeFormations()`
* **Description:** Scans for nearby leaders with the same target, sorts them by age (oldest wins), and if this leader is the oldest, calls `makeotherformationssecondaryfn` to adjust other formations’ parameters (e.g., radius, size).
* **Parameters:** None.

### `IsFormationFull()`
* **Description:** Returns `true` if the current formation size has reached or exceeded `max_formation_size`.
* **Parameters:** None.

### `ValidMember(member)`
* **Description:** Validates whether an entity qualifies to join the formation (alive, not in limbo, correct tags, no existing leader, etc.).
* **Parameters:**
  - `member`: The candidate entity to evaluate.

### `DisbandFormation()`
* **Description:** Clears the formation, notifies all members via their leave callbacks, unregisters event listeners, resets state, and removes the component.
* **Parameters:** None.

### `FormationSizeControl()`
* **Description:** Truncates the formation to `max_formation_size` by removing excess members one-by-one.
* **Parameters:** None.

### `NewFormationMember(member)`
* **Description:** Adds a validated member to the formation, subscribes to its death/removal events, updates its follower state, and optionally syncs its follower leader.
* **Parameters:**
  - `member`: The entity to add to the formation.

### `OnLostFormationMember(member)`
* **Description:** Removes a member from the formation, fires leave callbacks, unsubscribes events, clears leader references, drops combat target, and stops following if applicable.
* **Parameters:**
  - `member`: The entity being removed.

### `GetFormationPositions()`
* **Description:** Computes and assigns circular formation positions for all members relative to the leader’s current position and orientation.
* **Parameters:** None.

### `IsFormationEmpty()`
* **Description:** Returns `true` if the formation contains no members.
* **Parameters:** None.

### `GetTheta(dt)`
* **Description:** Calculates the next angular position (`theta`) based on rotation direction and delta time.
* **Parameters:**
  - `dt`: Delta time in seconds.

### `ValidateFormation()`
* **Description:** Ensures all members in the formation are still valid; removes any that are not (e.g., destroyed, removed).
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** Core update loop: validates members, updates age, organizes cross-formation hierarchy, enforces size limits, rotates positions, and disbands if empty or target is lost.
* **Parameters:**
  - `dt`: Delta time in seconds.

## Events & Listeners
- Listens to `"death"`, `"onremove"`, `"onenterlimbo"` on each member entity and triggers `OnLostFormationMember`.
- Calls `DefaultMakeOtherFormationsSecondary` during `OrganizeFormations` to propagate settings; custom `makeotherformationssecondaryfn` may push logic or side effects, but no explicit events are emitted by this component.
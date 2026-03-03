---
id: formationleader
title: Formationleader
description: Manages a group of followers arranged in a dynamic formation around a target entity, handling formation membership, positioning, and disbanding.
tags: [formation, ai, movement, group]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 71d0fefd
system_scope: entity
---

# Formationleader

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`FormationLeader` is a component that orchestrates a formation of followers around a designated target entity (e.g., a boss or player). It tracks participating entities, computes and updates relative positional offsets based on angular spacing and rotation, and manages lifecycle events such as formation fullness, member loss (e.g., death), and disbanding. It integrates with `combat`, `follower`, and `formationfollower` components to synchronize state and behavior across group members.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("formationleader")

-- Initialize the leader with a target and first member
inst.components.formationleader:SetUp(target_entity, first_follower)

-- Start the update loop (handled automatically on add)
inst.components.formationleader.onupdatefn = function(leader_inst)
    print("Formation age:", leader_inst.components.formationleader.age)
end
```

## Dependencies & tags
**Components used:** `combat`, `follower`, `formationfollower`, `health`  
**Tags:** Adds `formationleader_<type>` (e.g., `formationleader_monster`) when formation type is set; checks `formation_<type>` on potential members.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `formation_type` | string | `"monster"` | Identifier used in tag generation (e.g., `formationleader_monster`, `formation_monster`). |
| `max_formation_size` | number | `6` | Maximum number of followers allowed in the formation. |
| `formation` | table | `{}` | Table of active member entities in the formation. |
| `target` | entity | `nil` | The entity the formation is arranged around (usually the leader’s target). |
| `searchradius` | number | `50` | Radius used when searching for other formations with `OrganizeFormations`. |
| `theta` | number | `math.random() * TWOPI` | Current angular offset for position calculation (radians). |
| `thetaincrement` | number | `1` | Angular speed increment per second. |
| `radius` | number | `5` | Radial distance of followers from the target. |
| `reverse` | boolean | `false` | Whether the formation rotates clockwise (`true`) or counterclockwise (`false`). |
| `makeotherformationssecondaryfn` | function | `DefaultMakeOtherFormationsSecondary` | Callback invoked when this leader is the oldest formation; configures other formations. |
| `age` | number | `0` | Accumulated simulation time since formation creation (updated each `OnUpdate`). |

## Main functions
### `SetUp(target, first_member)`
* **Description:** Initializes the formation with a target entity and adds the first member. Sets the formation type based on the first member’s `formationfollower` component.
* **Parameters:**  
  - `target` (entity) — the entity the formation orbits around (e.g., a boss or player).  
  - `first_member` (entity) — the first follower to join; must have a `formationfollower` component.  
* **Returns:** Nothing.
* **Error states:** Does nothing if `first_member` lacks a `formationfollower` component.

### `NewFormationMember(member)`
* **Description:** Adds a valid entity to the formation. Hooks into member’s death/remove events and updates their `formationfollower` state.
* **Parameters:**  
  - `member` (entity) — entity to add to the formation.  
* **Returns:** Nothing.
* **Error states:** Does nothing if `member` fails `ValidMember` checks (invalid, in limbo, dead, already in a formation, or missing the `formation_<type>` tag).

### `OnLostFormationMember(member)`
* **Description:** Removes a member from the formation, cleaning up callbacks and resetting their `formationfollower` state and loyalties.
* **Parameters:**  
  - `member` (entity) — entity to remove.  
* **Returns:** Nothing.

### `GetFormationPositions()`
* **Description:** Computes and assigns `formationpos` to each member’s `formationfollower` component based on current angular position and radius.
* **Parameters:** None.  
* **Returns:** Nothing.

### `IsFormationFull()`
* **Description:** Checks if the formation has reached its maximum allowed size.
* **Parameters:** None.  
* **Returns:** `true` if the formation size is at least `max_formation_size`, otherwise `nil`.

### `DisbandFormation()`
* **Description:** Disbands the entire formation: calls optional `ondisbandfn`, removes all members, and destroys the component instance.
* **Parameters:** None.  
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Main update function called each frame. Handles formation validation, size control, rotation, position updates, and disbanding if the formation is empty or target is invalid.
* **Parameters:**  
  - `dt` (number) — delta time in seconds.  
* **Returns:** Nothing.

### `OrganizeFormations()`
* **Description:** Finds nearby formations with the same target, sorts them by `age`, and promotes the oldest as the primary formation. Invokes `makeotherformationssecondaryfn` on other formations.
* **Parameters:** None.  
* **Returns:** Nothing.
* **Error states:** Does nothing if this instance is not the oldest formation (returns early).

### `ValidMember(member)`
* **Description:** Validates whether an entity is eligible to join the formation.
* **Parameters:**  
  - `member` (entity) — entity to validate.  
* **Returns:** `true` if valid, otherwise `nil`.

### `GetFormationSize()`
* **Description:** Returns the current number of non-leader members in the formation.
* **Parameters:** None.  
* **Returns:** `number` — count of active members.

### `IsFormationEmpty()`
* **Description:** Checks whether the formation has any members.
* **Parameters:** None.  
* **Returns:** `true` if empty, otherwise `false`.

### `GetTheta(dt)`
* **Description:** Computes the updated angular position (`theta`) based on rotation direction (`reverse`) and delta time.
* **Parameters:**  
  - `dt` (number) — delta time in seconds.  
* **Returns:** `number` — updated theta value (radians).

### `ValidateFormation()`
* **Description:** Removes invalid (e.g., deleted) members from the formation.
* **Parameters:** None.  
* **Returns:** Nothing.

### `FormationSizeControl()`
* **Description:** Reduces the formation to `max_formation_size` by disbanding excess members.
* **Parameters:** None.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `death` (on members) — triggers `OnLostFormationMember`.  
  - `onremove` (on members) — triggers `OnLostFormationMember`.  
  - `onenterlimbo` (on members) — triggers `OnLostFormationMember`.  
- **Pushes:** Events are pushed by callers of this component (e.g., `follower:SetLeader` fires `leaderchanged`), but this component itself does not push events directly.

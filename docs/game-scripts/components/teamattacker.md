---
id: teamattacker
title: Teamattacker
description: Manages an entity’s participation in a team-based combat formation, including movement to formation positions and attack orders derived from a team leader.
tags: [combat, ai, team]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: b7e24da9
system_scope: entity
---

# Teamattacker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`TeamAttacker` enables entities to operate as coordinated teammates under a `teamleader`. It handles formation movement, order execution (e.g., `HOLD`, `WARN`, `ATTACK`), and automatic detachment when an entity moves beyond the leash distance. The component integrates with `combat`, `health`, `knownlocations`, `locomotor`, and `teamleader` to execute team tactics during gameplay.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("teamattacker")
inst.components.teamattacker:SetValidMemberFn(function(target) return target:HasTag("monster") end)
inst.components.teamattacker.searchradius = 60
inst.components.teamattacker.leashdistance = 80
-- Automatically joins a nearby team leader during the first OnUpdate tick
```

## Dependencies & tags
**Components used:** `combat`, `health`, `knownlocations`, `locomotor`, `teamleader`  
**Tags:** Adds `team_<type>` (e.g., `team_monster`) based on `team_type`; uses `teamleader_<type>` tags when searching for leaders.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inteam` | boolean | `false` | Whether the entity is currently in a team. |
| `teamleader` | Entity instance or `nil` | `nil` | Reference to the owning `teamleader` entity (set internally via `NewTeammate`). |
| `orders` | number (ORDERS.*) | `nil` | Current combat order (e.g., `ORDERS.HOLD`, `ORDERS.ATTACK`). |
| `formationpos` | Vector3 or `nil` | `nil` | Desired position in the team formation. |
| `ignoreformation` | boolean or `nil` | `nil` | If set, disables movement to `formationpos`. |
| `validmemberfn` | function(inst) → boolean | `nil` | Custom validation function for joining a team. |
| `searchradius` | number | `50` | Radius used by `SearchForTeam` to find potential team leaders. |
| `leashdistance` | number | `70` | Max distance from home before the entity leaves the team. |
| `teamsearchtags` | table or `nil` | `{"teamleader_<type>"}` | Tags used to identify candidate team leaders. |
| `team_type` | string | `"monster"` | Team type; determines tag naming (`team_<type>` and `teamleader_<type>`). |

## Main functions
### `GetDebugString()`
*   **Description:** Returns a human-readable string summarizing team membership and current orders for debugging.
*   **Parameters:** None.
*   **Returns:** `string` – e.g., `"In Team true, Current Orders: ATTACK"`.

### `SearchForTeam()`
*   **Description:** Searches for an available team leader within `searchradius` and attempts to join the first valid one. Requires a `teamleader` component with `IsTeamFull` and `NewTeammate`.
*   **Parameters:** None.
*   **Returns:** `boolean` – `true` if successfully added to a team; `false` otherwise.

### `OnEntitySleep()`
*   **Description:** Called when the entity enters sleep mode (e.g., player logs out). Removes the entity from its team and stops game updates for this component.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnEntityWake()`
*   **Description:** Restarts component updates when the entity wakes. Does not automatically rejoin a team.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ShouldGoHome()`
*   **Description:** Checks whether the entity has moved beyond `leashdistance` from its "home" location (retrieved via `knownlocations:GetLocation("home")`).
*   **Parameters:** None.
*   **Returns:** `boolean` – `true` if the entity should leave the team due to leash violation.

### `LeaveTeam()`
*   **Description:** Explicitly removes the entity from its team, invoking `teamleader:OnLostTeammate`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `LeaveFormation()`
*   **Description:** Sets `ignoreformation = true`, disabling movement to `formationpos`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `JoinFormation()`
*   **Description:** Clears `ignoreformation`, re-enabling movement to `formationpos`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetOrders()`
*   **Description:** Returns the current orders assigned to this team member.
*   **Parameters:** None.
*   **Returns:** `number (ORDERS.*) or nil` – e.g., `ORDERS.ATTACK`.

### `SetValidMemberFn(fn)`
*   **Description:** Sets a custom validation function for team membership eligibility. Typically called during initialization.
*   **Parameters:** `fn` (function) – A function taking an entity instance and returning `true` if it is a valid teammate.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** The main update loop. Handles formation movement, order interpretation (`HOLD`, `WARN`, `ATTACK`), and leash checks. Should be called every frame via `StartUpdatingComponent`.
*   **Parameters:** `dt` (number) – Delta time since last frame.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `teamleader` is `nil` or `CanAttack()` returns `false`. Uses `combat:SuggestTarget` and `locomotor:GoToPoint` internally.

## Events & listeners
- **Listens to:**  
  - `"death"` – via `teamleader:NewTeammate` (not directly on `self.inst`), triggers cleanup.  
  - `"attacked"` – via `teamleader:NewTeammate`, broadcasts distress to team leader.  
  - `"onattackother"` – via `teamleader:NewTeammate`, resets orders and drops current target.  
  - `"onremove"` / `"onenterlimbo"` – cleanup hooks set by `teamleader`.  
- **Pushes:** None directly.

> Note: Most event listeners are registered by `teamleader:NewTeammate` rather than `TeamAttacker` itself.

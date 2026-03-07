---
id: teamleader
title: Teamleader
description: Manages team coordination and formation for monster-type entities, including threat tracking, team membership, and dynamic ordering of team members.
tags: [combat, ai, coordination]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 81e311f9
system_scope: ai
---
# Teamleader

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Teamleader` orchestrates AI behavior for coordinated groups of monster entities (e.g., beefalo, bees, or custom monsters). It manages team membership, formation positioning, threat tracking, and tactical ordering (e.g., `HOLD`, `WARN`, `ATTACK`). When a team leader entity is added to an entity, it takes responsibility for organizing nearby teammates into a synchronized group that follows coordinated attack strategies.

Key interactions include integration with the `teamattacker` component (to control member behavior), `combat` (for dropping targets), `health` (to detect deaths), and `burnable` (to track status effects like burning).

## Usage example
```lua
local leader = CreateEntity()
leader:AddComponent("teamleader")
leader.components.teamleader:SetUp(target_entity, first_member)
leader.components.teamleader:SetNewThreat(some_entity)
```

## Dependencies & tags
**Components used:** `burnable`, `combat`, `health`, `teamattacker`, `transform`
**Tags:** Adds/Removes `teamleader_<team_type>` dynamically (e.g., `teamleader_monster`); checks `team_<team_type>`, `frozen`, and `teamleader_<team_type>` (to exclude leaders from count).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `team_type` | string | `"monster"` | Category of team members (used for tag matching and team search). |
| `min_team_size` | number | `3` | Minimum members required before the team can begin attacking. |
| `max_team_size` | number | `6` | Maximum number of team members allowed. |
| `team` | table | `{}` | Dictionary of active team member entities. |
| `threat` | entity or `nil` | `nil` | Current target of the team's aggression. |
| `searchradius` | number | `50` | Radius around the leader to scan for potential teammates. |
| `theta` | number | `0` | Current angular position for circular formation positioning. |
| `thetaincrement` | number | `1` | Angular velocity for spinning the formation. |
| `radius` | number | `5` | Base radius of the formation circle. |
| `reverse` | boolean | `false` | Whether to reverse rotation direction. |
| `timebetweenattacks` | number | `3` | Countdown timer for triggering next attack wave. |
| `attackinterval` | number | `3` | Duration between attacks in seconds. |
| `maxchasetime` | number | `30` | Max time (in seconds) without threat before disbanding the team. |
| `chasetime` | number | `0` | Current time spent chasing the threat without new members. |
| `attack_grp_size` | number or function or `nil` | `nil` | Controls how many members attack per wave; can be static or dynamic. |
| `chk_state` | boolean | `true` | Whether to consider `frozen`/`burning` states when validating team state. |

## Main functions
### `SetUp(target, first_member)`
* **Description:** Initializes the team with a target and first member. Sets `team_type` and adds the first member.
* **Parameters:**
  * `target` (entity) — initial threat or target for the team.
  * `first_member` (entity) — first team member to join.
* **Returns:** Nothing.

### `GetTeamSize()`
* **Description:** Counts current valid team members (excludes other team leaders).
* **Parameters:** None.
* **Returns:** `number` — number of team members.

### `OrganizeTeams()`
* **Description:** Finds other leaders in the search radius and reassigns `radius`, `reverse`, `thetaincrement`, and `max_team_size` based on team age (older leaders take precedence and tighter formations).
* **Parameters:** None.
* **Returns:** Nothing.

### `IsTeamFull()`
* **Description:** Checks if the team has reached maximum size.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if team is full.

### `ValidMember(member)`
* **Description:** Validates whether an entity can join the team.
* **Parameters:** `member` (entity) — entity to validate.
* **Returns:** `boolean` — `true` if valid, otherwise `false`.

### `DisbandTeam()`
* **Description:** Clears all team members, cleans up events and tags, removes the leader component from the entity, and ends threat tracking.
* **Parameters:** None.
* **Returns:** Nothing.

### `NewTeammate(member)`
* **Description:** Adds a valid entity to the team, registers death/attack event callbacks, and updates component state.
* **Parameters:** `member` (entity) — entity to add.
* **Returns:** Nothing.

### `BroadcastDistress(member)`
* **Description:** Scans for nearby teammates of the same type and attempts to recruit them if they are valid.
* **Parameters:** `member` (entity, optional) — entity that sent the distress; defaults to self.
* **Returns:** Nothing.

### `OnLostTeammate(member)`
* **Description:** Removes a member from the team, cleans up listeners, clears `teamattacker` state, and drops their combat target.
* **Parameters:** `member` (entity) — entity to remove.
* **Returns:** Nothing.

### `CanAttack()`
* **Description:** Checks if the team is large enough to begin attacking.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `GetTeamSize() >= min_team_size`.

### `CenterLeader()`
* **Description:** Moves the leader to the average position of all team members.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetFormationPositions()`
* **Description:** Calculates circular offset positions for each team member based on `theta`, `radius`, and threat location; stores them in `member.components.teamattacker.formationpos`.
* **Parameters:** None.
* **Returns:** Nothing.

### `GiveOrders(order, num)`
* **Description:** Assigns `order` (e.g., `ORDERS.WARN`, `ORDERS.ATTACK`) to `num` random team members that don’t already have an order.
* **Parameters:** 
  * `order` (ORDERS.* value) — order to assign.
  * `num` (number) — max number of members to assign.
* **Returns:** Nothing.

### `GiveOrdersToAllWithOrder(order, oldorder)`
* **Description:** Updates all members with `oldorder` to `order`.
* **Parameters:** 
  * `order` (ORDERS.* value) — new order.
  * `oldorder` (ORDERS.* value) — current order to match.
* **Returns:** Nothing.

### `AllInState(state)`
* **Description:** Checks if all team members are in `state`, or in special states like `frozen` or `burning` (if `chk_state` is `true`).
* **Parameters:** `state` (ORDERS.* value) — expected order state.
* **Returns:** `boolean` — `true` if all members satisfy the condition.

### `IsTeamEmpty()`
* **Description:** Checks if the team currently has no members.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `team` is empty.

### `SetNewThreat(threat)`
* **Description:** Sets the team’s target and registers cleanup if the threat is removed.
* **Parameters:** `threat` (entity or `nil`) — new threat entity.
* **Returns:** Nothing.

### `GetTheta(dt)`
* **Description:** Returns updated `theta` value considering rotation direction and delta time.
* **Parameters:** `dt` (number) — time since last update.
* **Returns:** `number` — new `theta` value.

### `SetAttackGrpSize(val)`
* **Description:** Sets the number (or dynamic function) for how many members attack per wave.
* **Parameters:** `val` (number or function) — static count or a function returning a count.
* **Returns:** Nothing.

### `NumberToAttack()`
* **Description:** Returns number of members to attack in the current wave, based on `attack_grp_size`.
* **Parameters:** None.
* **Returns:** `number` — number of attackers.

### `ManageChase(dt)`
* **Description:** Tracks time chasing a threat; disbands team if `chasetime > maxchasetime`.
* **Parameters:** `dt` (number) — time since last update.
* **Returns:** Nothing.

### `ValidateTeam()`
* **Description:** Removes invalid (e.g., deleted) members from the team.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Main per-frame update logic — manages chase time, centers leader, organizes teams, updates formation, and schedules attacks when threat is present and team is ready.
* **Parameters:** `dt` (number) — time since last update.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `"death"` — fires `member.deathfn` to remove member.
  - `"attacked"` — fires `member.attackedfn` to broadcast team distress.
  - `"onattackother"` — fires `member.attackedotherfn` to stop attack and switch to `HOLD`.
  - `"onremove"` — fires `member.deathfn` or threat-removed handler to disband team.
  - `"onenterlimbo"` — fires `member.deathfn` to remove member.
- **Pushes:** None (does not fire custom events).

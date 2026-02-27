---
id: teamleader
title: Teamleader
description: Manages the coordination and behavior of a group of cooperative attackers (a "team") around a central leader entity, including team membership, formation, ordering, and threat tracking.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 81e311f9
---

# Teamleader

## Overview
The `Teamleader` component enables an entity to serve as the central coordinator for a group of `teamattacker`-enabled entities. It handles team recruitment, disbanding, formation positioning (rotational and dynamic), order assignment (HOLD, WARN, ATTACK), and decay management (e.g., inactivity timeout). It tracks a threat target, organizes team members into geometric formations, and ensures group cohesion during combat or pursuit.

## Dependencies & Tags
- **Component Requirements**: Relies on the `teamattacker` component being present on teammates; uses `combat`, `health`, `burnable`, and `transform` components indirectly via entity checks.
- **Tags Applied/Removed**:
  - Adds `teamleader_<team_type>` when a team is set (e.g., `teamleader_monster`).
  - Removes `teamleader_<oldteam_type>` when the team type changes.
- **No explicit `inst:AddComponent()` calls** — the component expects the owning entity to be valid and updatable.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `team_type` | `string` | `"monster"` | The category string used to identify compatible teammates (also defines tag suffixes). |
| `min_team_size` | `number` | `3` | Minimum number of team members required to enable attacking. |
| `max_team_size` | `number` | `6` | Maximum number of team members allowed before overflow removal is triggered. |
| `team` | `table` | `{}` | Set-like table mapping `Entity` → `Entity` for current team members. |
| `threat` | `Entity?` | `nil` | The current target entity the team is attacking or pursuing. |
| `searchradius` | `number` | `50` | Radius around the leader used to discover new team members. |
| `theta` | `number` | `0` | Current angular position used for formation rotation. |
| `thetaincrement` | `number` | `1` | Angular speed factor for rotation direction/speed. |
| `radius` | `number` | `5` | Base radius for the formation circle. |
| `reverse` | `boolean` | `false` | If `true`, formation rotation direction is inverted. |
| `timebetweenattacks` | `number` | `3` | Remaining time (in seconds) before the next attack cycle can begin. |
| `attackinterval` | `number` | `3` | Fixed interval (in seconds) between attack cycles. |
| `lifetime` | `number` | `0` | Accumulated update time (used for sorting team priority). |
| `maxchasetime` | `number` | `30` | Time (in seconds) after which the team disbands if no threat is engaged. |
| `chasetime` | `number` | `0` | Accumulated time tracking how long the team has waited for a threat. |
| `attack_grp_size` | `number|function?` | `nil` | Specifies how many members should issue the `WARN` order per cycle; may be a static number or a function returning one. |
| `chk_state` | `boolean` | `true` | Controls whether state-checking logic (e.g., `AllInState`) considers special states like burning or frozen. |
| `teamleadersearchtags` | `table?` | `nil` | Tags used to find other team leaders during `OrganizeTeams` (set by `onteamtype`). |
| `teamsearchtags` | `table?` | `nil` | Tags used to find potential teammates during distress calls (set by `onteamtype`). |

## Main Functions

### `GetTeamSize()`
* **Description:** Returns the count of valid, non-leader teammates currently in the team.
* **Parameters:** None.

### `SetUp(target, first_member)`
* **Description:** Initializes the leader with a threat target and recruits a first member, inheriting `team_type` from the member's `teamattacker` component.
* **Parameters:**
  - `target` (`Entity?`): The initial threat to assign.
  - `first_member` (`Entity`): The first teammate, used to determine `team_type`.

### `OrganizeTeams()`
* **Description:** Scans nearby entities with matching team leader tags that share the same threat, sorts them by `lifetime` (most senior first), and promotes the leader with the highest `lifetime` to take charge. Then rebalances `radius`, `thetaincrement`, `reverse`, and `max_team_size` across all teams.
* **Parameters:** None.

### `IsTeamFull()`
* **Description:** Returns `true` if the current team size meets or exceeds `max_team_size`.
* **Parameters:** None.

### `ValidMember(member)`
* **Description:** Validates whether an entity qualifies to join the team (not dead, not in limbo, has combat, belongs to correct team tag, not already in another team, etc.).
* **Parameters:**
  - `member` (`Entity`): The entity to validate.

### `DisbandTeam()`
* **Description:** Removes all team members by calling `OnLostTeammate`, sets `threat` to `nil`, and destroys the `teamleader` component on this instance.
* **Parameters:** None.

### `TeamSizeControl()`
* **Description:** If the team exceeds `max_team_size`, iteratively removes excess members starting from the earliest added.
* **Parameters:** None.

### `NewTeammate(member)`
* **Description:** Adds a valid member to the team, binds callbacks for death, attack, and removal events, and configures the member’s `teamattacker` state.
* **Parameters:**
  - `member` (`Entity`): The entity to recruit.

### `BroadcastDistress(member)`
* **Description:** Scans for teammates within `searchradius` using `teamsearchtags` and recruits those that are valid and not already in the team. Used to form a team after distress events (e.g., one member is attacked).
* **Parameters:**
  - `member` (`Entity?`): The member that triggered the distress call (defaults to leader itself).

### `OnLostTeammate(member)`
* **Description:** Cleans up a departing or dead team member: removes callbacks, resets `teamattacker` state, and drops combat targets.
* **Parameters:**
  - `member` (`Entity`): The departing member.

### `CanAttack()`
* **Description:** Returns `true` if the team has at least `min_team_size` members.
* **Parameters:** None.

### `CenterLeader()`
* **Description:** Repositions the leader to the average position of all current teammates.
* **Parameters:** None.

### `GetFormationPositions()`
* **Description:** Calculates circular positions around the threat for each team member based on current `radius`, `theta`, and `reverse`, assigning the result to `member.components.teamattacker.formationpos`.
* **Parameters:** None.

### `GiveOrders(order, num)`
* **Description:** Assigns a specific order (e.g., `ORDERS.WARN`) to up to `num` randomly selected team members. Clears previous orders first, then fills in defaults to `ORDERS.HOLD` for unassigned members.
* **Parameters:**
  - `order` (`string`): The order to assign (`ORDERS.HOLD`, `ORDERS.WARN`, etc.).
  - `num` (`number`): Maximum number of members to assign the order.

### `GiveOrdersToAllWithOrder(order, oldorder)`
* **Description:** Updates the order for all team members currently holding `oldorder` to `order`.
* **Parameters:**
  - `order` (`string`): The new order.
  - `oldorder` (`string`): The current order to replace.

### `AllInState(state)`
* **Description:** Checks whether all team members either match the given `ORDERS.*` state *or* are in special states (like frozen or burning, depending on `chk_state`). Used to synchronize attack timing.
* **Parameters:**
  - `state` (`string`): The order state to check against.

### `IsTeamEmpty()`
* **Description:** Returns `true` if no teammates remain.
* **Parameters:** None.

### `SetNewThreat(threat)`
* **Description:** Sets a new threat target and registers a callback to disband the team if the threat is removed/deaths.
* **Parameters:**
  - `threat` (`Entity?`): The new threat entity.

### `GetTheta(dt)`
* **Description:** Calculates updated `theta` based on rotation speed (`thetaincrement`), direction (`reverse`), and elapsed time (`dt`).
* **Parameters:**
  - `dt` (`number`): Delta time.

### `SetAttackGrpSize(val)`
* **Description:** Configures how many members initiate the `WARN` order per attack cycle (can be a number or a callback function).
* **Parameters:**
  - `val` (`number|function`): Either a static number or a zero-arity function returning a number.

### `NumberToAttack()`
* **Description:** Returns the number of members to assign `ORDERS.WARN` during the next attack cycle, respecting `attack_grp_size` and falling back to probabilistic logic.
* **Parameters:** None.

### `ManageChase(dt)`
* **Description:** Increments `chasetime` and disbands the team if `maxchasetime` is exceeded (i.e., no engagement).
* **Parameters:**
  - `dt` (`number`): Delta time.

### `ValidateTeam()`
* **Description:** Ensures all team members are still valid (e.g., not in limbo, not removed), removing invalid entries.
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** Main update loop executed every frame. Manages chase timeout, leader position centering, lifetime accumulation, team organization, size control, threat-based formation rotation, and attack scheduling (`HOLD` → `WARN` → `ATTACK`).
* **Parameters:**
  - `dt` (`number`): Delta time.

## Events & Listeners
- **Listens for:**
  - `"death"` — on teammates, triggers disband via `OnLostTeammate`.
  - `"attacked"` — on teammates, triggers `BroadcastDistress`.
  - `"onattackother"` — on teammates, triggers order reset to `HOLD`.
  - `"onremove"` — on teammates or the threat, triggers disband.
  - `"onenterlimbo"` — on teammates, triggers disband.
  - `"onremove"` — on the current threat, disbands the team when the threat is removed.
- **Triggers (via `inst:PushEvent`):** None observed in this script.
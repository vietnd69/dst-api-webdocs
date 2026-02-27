---
id: beequeenbrain
title: Beequeenbrain
description: Controls the decision-making logic for the Bee Queen boss entity, including combat engagement, special move triggering, dodging behavior, and soldier spawning.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 67f96367
---

# Beequeenbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This brain component governs the behavior of the Bee Queen boss entity in Don't Starve Together. It implements a behavior tree that dynamically selects actions based on combat state, environmental conditions, and group coordination. The brain manages engagement transitions, dodge maneuvers (to avoid multiple threats), and special abilities like Screech (to rally guards) and Focus Target (to direct soldier aggression). It interacts primarily with Combat, Commander, LocoMotor, KnownLocations, GroupTargeter, and Timer components.

## Dependencies & Tags
- **Components used:**
  - `combat` (for target management, cooldown checks, and last-attacked time)
  - `commander` (for managing soldier count and checking guard alert status)
  - `locomotor` (for modifying walkspeed and hit recovery during dodging)
  - `knownlocations` (for storing and retrieving the spawn point)
  - `grouptargeter` (for evaluating threat density around the Bee Queen)
  - `timer` (for checking cooldown existence on spawning and focus targeting)
- **Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_act` | `string?` | `nil` | Stores the currently selected special action name ("screech", "spawnguards", or "focustarget"). |
| `_lastengaged` | `number` | `0` | Timestamp of last combat engagement. |
| `_lastdisengaged` | `number` | `0` | Timestamp of last combat disengagement. |
| `_engaged` | `boolean` | `false` | Indicates whether the Bee Queen is currently in an engaged state. |
| `_shouldchase` | `boolean` | `false` | Flags whether the Bee Queen should continue chasing (used for hysteresis in chase decision). |
| `_dodgedest` | `Vector3?` | `nil` | Target position for the current dodge maneuver. |
| `_dodgetime` | `number?` | `nil` | Start timestamp for the current dodge cooldown period. |

## Main Functions
### `OnStart()`
* **Description:** Initializes and assigns the behavior tree root node for the Bee Queen. This builds the full behavior hierarchy including dodge handling, special move selection, chasing, facing, and idle wandering/fleeing sequences.
* **Parameters:** None.
* **Returns:** None.

### `OnStop()`
* **Description:** Resets dodge-related state and restores default movement speed and hit recovery delay.
* **Parameters:** None.
* **Returns:** None.

### `OnInitializationComplete()`
* **Description:** Records the Bee Queen's spawn location as "spawnpoint" in `KnownLocations`, ensuring the Y coordinate is zeroed.
* **Parameters:** None.
* **Returns:** None.

### `GetHomePos(inst)`
* **Description:** Helper function that retrieves the stored spawn point location.
* **Parameters:** `inst` — the Bee Queen entity instance (used implicitly in the call).
* **Returns:** `Vector3` — the spawn point position.

### `TryScreech(self)`
* **Description:** Determines whether the Bee Queen should perform the "screech" special action. Triggers screech when transitioning into combat (engaged for >2 seconds), when transitioning out of combat (disengaged for >5 seconds), or when guards need alerting (if `wantstoalert` is set). Returns the event name `"screech"` if applicable, otherwise `nil`.
* **Parameters:** `self` — the brain instance.
* **Returns:** `"screech"` or `nil`.

### `TrySpawnGuards(inst)`
* **Description:** Checks if the Bee Queen should spawn additional guards. Requires the spawn guard cooldown timer not to exist and current soldier count below either `spawnguards_threshold` (when targeting) or `1` (when not). Returns `"spawnguards"` if spawn condition is met.
* **Parameters:** `inst` — the Bee Queen entity instance.
* **Returns:** `"spawnguards"` or `nil`.

### `TryFocusTarget(inst)`
* **Description:** Determines if the Bee Queen should switch focus to a target when the focus cooldown has expired and sufficient guards are active. Requires `focustarget_cd > 0`, an active target, at least `TUNING.BEEQUEEN_MIN_GUARDS_PER_SPAWN` guards, and no active focus target cooldown. Returns `"focustarget"` if conditions are met.
* **Parameters:** `inst` — the Bee Queen entity instance.
* **Returns:** `"focustarget"` or `nil`.

### `ShouldUseSpecialMove(self)`
* **Description:** Evaluates all special move triggers in priority order (Screech > SpawnGuards > FocusTarget). Sets `_act` to the chosen action and prevents chasing if an action is selected.
* **Parameters:** `self` — the brain instance.
* **Returns:** `boolean` — true if a special move is selected.

### `ShouldChase(self)`
* **Description:** Determines whether the Bee Queen should initiate or continue chasing the current target. Uses hysteresis (`_shouldchase`) to avoid rapid chase-toggle transitions near attack range. Respects focus target cooldown and checks distances against tunable ranges (`BEEQUEEN_CHASE_TO_RANGE`, `BEEQUEEN_ATTACK_RANGE`).
* **Parameters:** `self` — the brain instance.
* **Returns:** `boolean` — true if the Bee Queen should chase.

### `ShouldDodge(self)`
* **Description:** Handles dodge logic, including active dodge state, timer management, and dynamic obstacle-free destination selection. Evaluates threat density by scanning all players and their proximity zones to find a position minimizing risk while staying within deaggro distance. Modifies locomotor walkspeed and hit recovery during active dodge.
* **Parameters:** `self` — the brain instance.
* **Returns:** `boolean` — true if the Bee Queen should begin or continue dodging.

### `CalcDodgeMult(self)`
* **Description:** Calculates a dodge timer multiplier based on the number of nearby threats within attack range. Returns 0.5 if multiple threats are nearby, otherwise 1.0.
* **Parameters:** `self` — the brain instance.
* **Returns:** `number` — dodge timer multiplier.

## Events & Listeners
* **Pushes:** `"screech"`, `"spawnguards"`, `"focustarget"`, `"flee"`
* **Listens to:** None identified.
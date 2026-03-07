---
id: beequeenbrain
title: Beequeenbrain
description: Controls the combat behavior, special abilities, and movement logic of the Bee Queen boss entity.
tags: [combat, ai, boss]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 67f96367
system_scope: brain
---

# Beequeenbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BeeQueenBrain` is the decision-making core for the Bee Queen boss entity. It orchestrates behavior through a Behavior Tree (BT), coordinating combat engagement, special ability usage (screech, guard spawning, targeting focus), dodging mechanics, and patrol/flee states. It integrates tightly with components like `combat`, `commander`, `grouptargeter`, `knownlocations`, `locomotor`, and `timer` to manage dynamic enemy response and environmental awareness.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("beequeen")
inst:AddComponent("brain")
inst.components.brain:SetBrainClass("beequeenbrain")
-- The brain initializes automatically when the entity is spawned in-world
```

## Dependencies & tags
**Components used:** `combat`, `commander`, `grouptargeter`, `knownlocations`, `locomotor`, `timer`
**Tags:** Adds `beequeen`; checks for `playerghost`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_act` | string? | `nil` | Stores the current special ability action name (`"screech"`, `"spawnguards"`, or `"focustarget"`) to be triggered. |
| `_lastengaged` | number | `0` | Timestamp of the last time the Bee Queen engaged combat (target present). |
| `_lastdisengaged` | number | `0` | Timestamp of the last time the Bee Queen disengaged combat (no target). |
| `_engaged` | boolean | `false` | Tracks whether the Bee Queen is currently in an engaged state. |
| `_shouldchase` | boolean | `false` | Internal flag used during chase decision logic to maintain consistent movement direction. |
| `_dodgedest` | Vector3? | `nil` | Target position for the current dodge maneuver. |
| `_dodgetime` | number? | `nil` | Timestamp used for managing the dodge delay timer. |

## Main functions
### `OnStart()`
* **Description:** Initializes the Behavior Tree with the full decision hierarchy for the Bee Queen, including dodge handling, special moves, chasing, face alignment, and a fallback flee/wander sequence.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnStop()`
* **Description:** Resets dodge-specific movement settings (speed and hit recovery delay) back to default values when the brain shuts down or transitions out of dodge mode.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnInitializationComplete()`
* **Description:** Records the Bee Queen's spawn position as `"spawnpoint"` in `knownlocations` so it can be used as the home base for wander/leash logic.
* **Parameters:** None.
* **Returns:** Nothing.

### `ShouldUseSpecialMove(self)`
* **Description:** Evaluates and selects the highest-priority special ability to execute (screech, guard spawn, or focus targeting). Returns `true` if an action is selected and sets `_act` accordingly; this halts chasing.
* **Parameters:** `self` (BeeQueenBrain) — the brain instance.
* **Returns:** `true` if a special move is selected, `false` otherwise.
* **Error states:** None.

### `ShouldChase(self)`
* **Description:** Determines whether the Bee Queen should chase a target based on cooldown, distance thresholds, and focus target state. Uses `_shouldchase` to avoid flickering between chase and non-chase states.
* **Parameters:** `self` (BeeQueenBrain) — the brain instance.
* **Returns:** `true` if the Bee Queen should begin or continue chasing, `false` otherwise.
* **Error states:** Returns `false` silently if target is invalid or nil.

### `ShouldDodge(self)`
* **Description:** Calculates and executes dodge behavior by evaluating threat from nearby players, selecting a safe destination away from danger zones, and updating movement speed and hit recovery. Manages dodge timing via `_dodgetime` and `_dodgedest`.
* **Parameters:** `self` (BeeQueenBrain) — the brain instance.
* **Returns:** `true` if a dodge is in progress or needs to be initiated, `false` otherwise.
* **Error states:** If no safe dodge destination is found, the dodge timer is partially reset to retry sooner.

### `CalcDodgeMult(self)`
* **Description:** Returns a speed multiplier used to shorten the dodge delay if multiple enemies are within attack range (encouraging faster repositioning under heavier threat).
* **Parameters:** `self` (BeeQueenBrain) — the brain instance.
* **Returns:** `0.5` if two or more enemies are close, `1` otherwise.

## Events & listeners
- **Listens to:** None directly (event responses are handled by external stategraph transitions and component-level callbacks).
- **Pushes:** `screech`, `spawnguards`, `focustarget`, `flee` — fired via `self.inst:PushEvent()` when corresponding special moves or flee behavior are triggered.

## Notes
- The Brain implementation uses `WhileNode`, `SequenceNode`, `ParallelNodeAny`, `ActionNode`, `WaitNode`, `ChaseAndAttack`, `FaceEntity`, `Wander`, and `Leash` behaviors defined in the `behaviours/` directory.
- Dodge destination search evaluates circular and radial offset positions around the Bee Queen's current position, scoring each by proximity to players and danger zones.
- `_engaged` state transitions require at least `2` seconds between disengage→engage and `5` seconds between engage→disengage to prevent rapid toggling during combat transitions.

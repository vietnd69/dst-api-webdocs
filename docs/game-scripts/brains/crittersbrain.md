---
id: crittersbrain
title: Crittersbrain
description: Manages AI behavior for small wildlife entities, handling movement toward owners, avoidance of combat zones, playful interactions with other critters, and observation of active minigames.
tags: [ai, locomotion, combat, minigame]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: a73d083d
system_scope: brain
---

# Crittersbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Crittersbrain` defines the behavior tree for small non-hostile wildlife entities (e.g., bees, butterflies, rabbits) in DST. It orchestrates high-level decisions including following a leader (typically a player), avoiding active combat zones, initiating or sustaining playful interactions with other nearby critters, and optionally watching minigames when the owner participates. The brain integrates with several components—`follower`, `crittertraits`, `combat`, `grouptargeter`, `locomotor`, `sleeper`, and `minigame_participator`—to adapt its behavior to the current game state.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("follower")
inst:AddComponent("crittertraits")
inst:AddComponent("locomotor")
inst:AddComponent("sleeper")
inst:AddComponent("minigame_participator")
inst:AddBrain("crittersbrain")
```

## Dependencies & tags
**Components used:** `follower`, `crittertraits`, `combat`, `grouptargeter`, `locomotor`, `sleeper`, `minigame_participator`, `minigame`, `behave` (implicit via `Follow`, `RunAway`, etc.), `action` (via `BufferedAction`, `StandStill`, etc.)  
**Tags:** Checks `busy`, `flying`, `_combat`, `_health`, `wall`, `INLIMBO`, `playerghost` via `inst:HasTag()`; adds no tags directly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `playfultarget` | `Entity` or `nil` | `nil` | Stores the currently selected critter for playful interaction. |
| `runawayfrom` | `Entity` or `nil` | `nil` | Tracks the nearest entity causing combat-avoidance behavior. |

## Main functions
### `GetOwner(inst)`
*   **Description:** Retrieves the entity's leader using the `follower` component. Used extensively as the basis for following and affection logic.
*   **Parameters:** `inst` (`Entity`) — the entity instance whose owner is requested.
*   **Returns:** `Entity` or `nil` — the leader entity, or `nil` if not assigned.

### `FindPlaymate(self)`
*   **Description:** Attempts to locate or retain a valid playmate critter nearby. Considers dominance traits (e.g., `playful`) for extended range and filters out sleeping, busy, or non-playful targets. Updates `self.playfultarget`.
*   **Parameters:** `self` (`CritterBrain` instance).
*   **Returns:** `boolean` — `true` if a valid playmate is found or retained, `false` otherwise.

### `ValidateCombatAvoidance(self)`
*   **Description:** Verifies whether the current `runawayfrom` target remains a valid reason to keep avoiding. Checks distance limits, validity, and whether the target is still in combat. Fires the `"critter_avoidcombat"` event with `{avoid=false}` if the condition lifts.
*   **Parameters:** `self` (`CritterBrain` instance).
*   **Returns:** `boolean` — `true` if combat avoidance is still needed, `false` otherwise.

### `CombatAvoidanceFindEntityCheck(self)`
*   **Description:** Returns a predicate function used by the `RunAway` behavior to locate entities whose presence triggers combat avoidance (e.g., entities actively in combat near the owner).
*   **Parameters:** `self` (`CritterBrain` instance).
*   **Returns:** `function(ent: Entity): boolean` — a function that evaluates whether `ent` should trigger avoidance.

### `WatchingMinigame(inst)`
*   **Description:** Retrieves the `Minigame` instance the owner is currently participating in (if any).
*   **Parameters:** `inst` (`Entity`) — the entity instance.
*   **Returns:** `Minigame` or `nil`.

### `OnStart()`
*   **Description:** Initializes the behavior tree root. Defines hierarchical priority nodes covering: minigame watching, combat avoidance, playful interactions, owner following, affection, and idle states.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (this brain does not register listeners directly; event responses are handled via behavior tree nodes like `WhileNode` and `ActionNode`).
- **Pushes:**
  - `"critter_avoidcombat"` — with `{avoid=true}` when entering avoidance of a combat entity, and `{avoid=false}` when exiting avoidance.
  - `"start_playwithplaymate"` — with `{target=playfultarget}` when beginning a playful interaction sequence.

## Notes
- Behavior is gated on the presence of a valid owner (`follower` component required).
- Playful behavior is extended when the critter has the `playful` dominant trait (`crittertraits:IsDominantTrait("playful")`).
- Combat avoidance is triggered when the owner is in combat *or* near any active combat zone, using distance thresholds defined as `COMBAT_TOO_CLOSE_DIST` (`5`), `COMBAT_SAFE_TO_WATCH_FROM_DIST` (`8`), and `COMBAT_SAFE_TO_WATCH_FROM_MAX_DIST` (`12`).

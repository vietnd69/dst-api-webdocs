---
id: SGitemmimic_revealed
title: SGitemmimic Revealed
description: Defines the animation state machine for revealed item mimic entities, handling locomotion, jumping, and mimic transformation behaviors.
tags: [stategraph, mimic, locomotion, ai]
sidebar_position: 10
last_updated: 2026-04-17
build_version: 722832
change_status: stable
category_type: stategraphs
source_hash: c5bb5a29
system_scope: entity
---

# SGitemmimic Revealed

> Based on game build **722832** | Last updated: 2026-04-17

## Overview
`SGitemmimic_revealed` is a stategraph that controls the behavior and animations of revealed item mimic entities. It manages locomotion states (idle, walk, stop), jump mechanics with physics overrides, and the mimic transformation sequence when attempting to copy other entities. The stategraph integrates with the `locomotor` component for movement and the `shadowthrall_mimics` world component for spawning mimic copies.

## Usage example
```lua
-- Stategraph is automatically attached to itemmimic_revealed prefab
-- To trigger states manually (debug/example):
local inst = SpawnPrefab("itemmimic_revealed")
inst.sg:GoToState("jump_pre")
inst.sg:GoToState("try_mimic_pre")

-- Action handler responds to NUZZLE action automatically
-- Locomote events trigger walk_start/walk/walk_stop states
```

## Dependencies & tags
**External dependencies:**
- `stategraphs/commonstates` -- provides CommonHandlers and AddDeathState helper functions

**Components used:**
- `locomotor` -- Stop(), StopMoving(), WalkForward() for movement control
- `itemmimic` -- SetNoLoot() called on spawned mimic copies
- `shadowthrall_mimics` (world) -- SpawnMimicFor() to create mimic transformations

**Tags:**
- `idle` -- added in idle state
- `canrotate` -- added in idle, walk_start, walk, walk_stop states
- `busy` -- added in jump_pre, try_mimic_pre, try_mimic states
- `jumping` -- added in jump_pre, try_mimic_pre, try_mimic states
- `noattack` -- added in jump_pre, removed at frame 15 via timeline
- `moving` -- added in walk_start, walk states

## Configuration Structure
| Parameter | Type | Value | Description |
|-----------|------|-------|-------------|
| `states` | table | 8 states (7 defined locally + death state added by AddDeathState) | Array of State definitions (idle, jump_pre, try_mimic_pre, try_mimic, walk_start, walk, walk_stop, death) passed to StateGraph constructor |
| `events` | table | 3 handlers | Event handlers for locomote, jump, and death passed to StateGraph constructor |
| `actionhandlers` | table | 1 handler | Maps ACTIONS.NUZZLE to try_mimic_pre state, passed to StateGraph constructor |
| `defaultstate` | string | `"idle"` | Initial state name passed to StateGraph constructor |

> Note: These are constructor parameters for `StateGraph()`, not instance properties accessible on the stategraph object.

## Main functions
### `StateGraph("itemmimic_revealed", states, events, "idle", actionhandlers)`
* **Description:** Constructs and returns the stategraph instance with all defined states, event handlers, and action handlers. This is called at file end and registered with the game's stategraph system.
* **Parameters:**
  - `name` -- string identifier for the stategraph
  - `states` -- table of State definitions
  - `events` -- table of EventHandler and CommonHandler definitions
  - `defaultstate` -- string name of the starting state
  - `actionhandlers` -- table of ActionHandler mappings
* **Returns:** StateGraph instance registered under "itemmimic_revealed"
* **Error states:** None

### `CommonStates.AddDeathState(states, timeline_events)`
* **Description:** Adds a standardized death state to the states table with custom timeline events for sound playback.
* **Parameters:**
  - `states` -- table to append the death state to
  - `timeline_events` -- array of FrameEvent definitions for death animation
* **Returns:** None (modifies states table in-place)
* **Error states:** None

## States
### `idle`
* **Description:** Default resting state. Stops locomotion and allows rotation.
* **Tags:** `idle`, `canrotate`
* **onenter:** Calls `locomotor:Stop()` to halt movement.
* **Events:** None specific to this state.

### `jump_pre`
* **Description:** Prepares and executes a random-direction jump with physics velocity override. Calculates speed as `dist / inst.AnimState:GetCurrentAnimationLength()` which may produce Infinity if animation length is 0.
* **Tags:** `busy`, `jumping`, `noattack`
* **onenter:** Stops locomotor, plays jump animation, pushes toggle tail event, plays sound, calculates random jump position (3 units at random angle), sets motor velocity override.
* **timeline:** Frame 15 removes `noattack` tag, reduces velocity to 35%, restores sanity collision.
* **onexit:** Clears motor velocity override, stops physics, restores sanity collision, pushes toggle tail event.
* **Error states:** None

### `try_mimic_pre`
* **Description:** Preparation state for mimic transformation attempt, triggered by NUZZLE action.
* **Tags:** `busy`, `jumping`
* **onenter:** Stops locomotor, plays eye_disappear animation.
* **Events:** Transitions to `try_mimic` on animover.

### `try_mimic`
* **Description:** Executes mimic transformation. Attempts to spawn a mimic copy of the target entity. The code guards mimic access with `if success then` before accessing `mimic.components.itemmimic`.
* **Tags:** `busy`, `jumping`
* **onenter:** Plays jump animation, pushes toggle tail event, plays sound, calculates target position (uses buffered action target or forward position), sets motor velocity override.
* **timeline:** Frame 1 sets motor velocity override.
* **onexit:** Clears motor velocity override, stops physics, restores sanity collision, clears buffered action, pushes toggle tail event.
* **Events:** On animover, attempts to spawn mimic via `shadowthrall_mimics:SpawnMimicFor()`. If successful, copies noloot status, spawns puff prefab, removes self. If failed, returns to idle.
* **Error states:** None

### `walk_start`
* **Description:** Initializes walking movement with sound and timeout transition.
* **Tags:** `moving`, `canrotate`
* **onenter:** Plays walk loop sound, stops locomotor movement, sets 6-frame timeout.
* **ontimeout:** Transitions to `walk` state.
* **Events:** Kills walkloop sound on death.

### `walk`
* **Description:** Continuous walking state.
* **Tags:** `moving`, `canrotate`
* **onenter:** Calls `locomotor:WalkForward()` to maintain forward movement.
* **Events:** Kills walkloop sound on death.

### `walk_stop`
* **Description:** Stops walking movement with animation timeout.
* **Tags:** `canrotate`
* **onenter:** Stops locomotor movement, sets 11-frame timeout.
* **ontimeout:** Transitions to `idle` state.
* **onexit:** Kills walkloop sound.

## Events & listeners
- **Listens to:**
  - `locomote` -- handled by CommonHandlers.OnLocomote(false, true), triggers walk_start/walk/walk_stop transitions
  - `jump` -- triggers transition to jump_pre state if not busy
  - `death` -- handled by CommonHandlers.OnDeath(), plays death sound
  - `animover` -- triggers state transitions on animation completion in jump_pre, try_mimic_pre, try_mimic states
- **Pushes:**
  - `_toggle_tail_event` -- pushed in jump_pre, try_mimic, and try_mimic onexit for tail animation synchronization
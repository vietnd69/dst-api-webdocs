---
id: oceanfishable
title: Oceanfishable
description: Controls the behavior and fishing mechanics of fish caught by ocean fishing, including stamina management, rod interaction, and movement response to line tension.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: c84eeb5c
---

# Oceanfishable

## Overview
This component manages the gameplay interactions for ocean-caught fish entities, enabling them to be reeled in by fishing rods. It handles rod attachment/detachment, movement speed modulation based on line tension, stamina-based struggling mechanics, and catch readiness detection. It is designed to be attached to fish entities within the Entity Component System.

## Dependencies & Tags
**Component Dependencies:**
- `inst.components.locomotor` — used for dynamic speed adjustment (walkspeed/runspeed)
- `inst.components.inventoryitem` — optionally used to determine grand owner for catch distance checks

**Tags:**
- Adds `"oceanfishing_catchable"` tag when the fish is close enough to the fishing rod owner and the rod is attached.
- Removes `"oceanfishing_catchable"` tag when detached or out of range.

**No other components are explicitly added** — it only interacts with existing ones.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(passed to constructor)* | Reference to the owning entity. |
| `rod` | `Entity?` | `nil` | The fishing rod currently attached to this fish. |
| `catch_distance` | `number` | `4` | Maximum distance (in units) from the rod owner required to be catchable. |
| `max_walk_speed` | `number?` | `nil` | Base walking speed before tension modulation. Set via `StrugglingSetup()`. |
| `max_run_speed` | `number?` | `nil` | Base running speed before tension modulation. Set via `StrugglingSetup()`. |
| `stamina_def` | `table?` | `nil` | Definition table containing `drain_rate`, `recover_rate`, `struggle_times`, and `tired_times` for stamina calculations. Set via `StrugglingSetup()`. |
| `stamina` | `number` | `1.0` | Current stamina level (0.0–1.0), influencing struggle duration and speed. |
| `is_struggling_state` | `boolean` | `false` | Whether the fish is currently in a struggling state (moving away rapidly). |
| `pending_is_struggling_state` | `boolean` | `false` | Pending state to allow smooth transitions between struggling states. |
| `struggling_state_timer` | `number` | `0` | Countdown timer until the next state transition (struggle ↔ tired). |
| `rod_onremove` | `function` | *(lambda)* | Internal callback to detach the rod if it is removed. |
| `onsetrodfn` | `function?` | `nil` | Optional hook called when rod is attached/detached: `fn(inst, rod)`. |
| `onreelinginfn` | `function?` | `nil` | Optional hook called during reel-in: `fn(inst, doer)`. |
| `onreelinginpstfn` | `function?` | `nil` | Optional hook called *after* reel-in processing: `fn(inst, doer)`. |
| `oneatenfn` | `function?` | `nil` | Optional hook called when fish is eaten: `fn(inst, eater)`. |
| `makeprojectilefn` | `function?` | `nil` | Optional override for projectile creation during catch. |
| `overrideunreelratefn` | `function?` | `nil` | Optional override for line unreel rate calculation. |

## Main Functions

### `SetRod(rod)`
* **Description:** Attaches or detaches a fishing rod to/from this fish. Adds/removes the `"oceanfishing_catchable"` tag, updates locomotor speeds, and triggers callbacks. Returns `true` if successfully attached.
* **Parameters:**
  - `rod` (`Entity?`): The fishing rod entity to attach, or `nil` to detach.

### `OnUpdate(dt)`
* **Description:** Called every frame while the fish is being targeted. Updates stamina based on line tension, manages struggling state transitions, and ensures correct catchability tag.
* **Parameters:**
  - `dt` (`number`): Delta time since last frame.

### `StrugglingSetup(walk_speed, run_speed, stamina_def)`
* **Description:** Initializes stamina-related properties and speed limits. Must be called to enable struggling mechanics.
* **Parameters:**
  - `walk_speed` (`number`): Base walking speed.
  - `run_speed` (`number`): Base running speed (used during struggling).
  - `stamina_def` (`table`): Table with keys: `drain_rate`, `recover_rate`, `struggle_times`, `tired_times`. Each time value table has `low`/`high` and optional `r_low`/`r_high` for randomized durations.

### `IsCloseEnoughToCatch()`
* **Description:** Determines if the fish is within range to be caught by the player. Requires an attached rod.
* **Parameters:** None.

### `CalcStaminaDrainRate()`
* **Description:** Calculates the per-second stamina loss rate, factoring in extra drain from the fishing rod’s tension rating.
* **Parameters:** None.

### `ResetStruggling()`
* **Description:** Immediately resets the fish to a full-struggle state: sets stamina to 1.0, begins timer, and activates struggling.
* **Parameters:** None.

### `UpdateStruggleState()`
* **Description:** Applies pending state changes (`pending_is_struggling_state`) and resets the struggle timer.
* **Parameters:** None.

### `CalcStruggleDuration()`
* **Description:** Computes the duration (in seconds) before the next state transition (struggle ↔ tired), based on current stamina.
* **Parameters:** None.

### `CalcLineUnreelRate(rod)`
* **Description:** Computes how fast the fishing line unreels (in units/sec) due to the fish’s movement, used for tension simulation. Returns `0` if not struggling or not moving away.
* **Parameters:**
  - `rod` (`Entity`): The fishing rod entity.

### `MakeProjectile()`
* **Description:** Returns the entity to be used as the projectile when the fish is caught. Defaults to `self.inst`, but can be overridden by `makeprojectilefn`.
* **Parameters:** None.

### `GetDebugString()`
* **Description:** Returns a formatted string for debugging: includes rod status, struggling state/timer, stamina, and optional lure modifiers.
* **Parameters:** None.

## Events & Listeners
- **Listens for `"onremove"` event on the attached `rod` entity**, invoking `self.rod_onremove` to automatically detach if the rod is destroyed.
- **Triggers (via `self.inst`):**
  - Calls custom hooks (`onsetrodfn`, `onreelinginfn`, `onreelinginpstfn`, `oneatenfn`) when applicable.
- **Does not push custom events directly.**
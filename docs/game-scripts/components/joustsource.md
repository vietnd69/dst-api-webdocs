---
id: joustsource
title: Joustsource
description: Manages the jousting lance attack logic, including collision detection, hit timing, and combat interaction during jousting events.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: combat
source_hash: b0c430b0
---

# Joustsource

## Overview
This component handles the core logic for jousting attacks in Don't Starve Together. It calculates lance collision using 2D geometry, enforces hit timing cooldowns, and triggers combat actions (e.g., attacks, knockback, or mutual joust collisions) against valid targets within the lance's range and arc. It integrates with the Combat component to perform attacks and respects physics and tag-based collision rules.

## Dependencies & Tags
- **Component Dependency:** Uses `inst.components.combat` (if present) to perform attacks (`DoAttack`), check ally status, and control `ignorehitrange`.
- **Tags:**
  - Adds `jousting` to entities during jousting (used via `JOUSTING_TAGS` constant).
  - Uses `collide_tags = { "_combat" }` and `no_collide_tags = { "FX", "NOCLICK", "DECOR", "INLIMBO", "player" (if PVP disabled) }` for entity filtering in `TheSim:FindEntities`.
- **Physics/Geometry:** Relies on `Transform:GetWorldPosition`, `Transform:GetRotation`, `GetPhysicsRadius`, and vector math.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity the component is attached to. |
| `speed` | `number` | `TUNING.WILSON_RUN_SPEED` | Movement speed used for the jousting animation or logic (not used in collision). |
| `collide_tags` | `table` | `{ "_combat" }` | Tags that allow collision during jousting detection. |
| `no_collide_tags` | `table` | `{ "FX", "NOCLICK", "DECOR", "INLIMBO", "player" }` | Tags that block collision (player included only when PVP is disabled). |
| `length` | `number` | `nil` | Length of the lance (set via `SetLanceLength`, used in collision range). |
| `loops` | `number` | `nil` | Number of animation loops (set via `SetRunAnimLoopCount`). |
| `onhitotherfn` | `function` | `nil` | Optional callback function invoked on hit (`self.onhitotherfn(self.inst, inst, guy)`). |

## Main Functions
### `SetSpeed(speed)`
* **Description:** Sets the `speed` property used for animation or movement logic (e.g.,骑Lance run speed).
* **Parameters:**
  - `speed` (`number`): New speed value.

### `GetSpeed()`
* **Description:** Returns the current `speed` value.

### `SetRunAnimLoopCount(loops)`
* **Description:** Sets the animation loop count for the jousting run.

### `GetRunAnimLoopCount()`
* **Description:** Returns the animation loop count.

### `SetLanceLength(length)`
* **Description:** Sets the effective lance length used in collision calculations.

### `GetLanceLength()`
* **Description:** Returns the current lance length.

### `SetOnHitOtherFn(fn)`
* **Description:** Registers a custom callback function to be invoked whenever the lance successfully hits a non-jousting target.
* **Parameters:**
  - `fn` (`function`): Function of signature `(joust_inst, attacker_inst, target_inst)`.

### `CheckCollision(inst, targets)`
* **Description:** Computes collision for the lance attack using 2D segment-to-point distance. It finds nearby entities within the lance's arc and range, checks a 0.75-second cooldown per target, and triggers combat actions or joust collisions. Returns `true` if a mutual joust collision occurs (e.g., player vs player).
* **Parameters:**
  - `inst` (`Entity`): The jousting entity (same as `self.inst`).
  - `targets` (`table`): A dictionary used to track last-hit times per target (keyed by target entity) to enforce cooldowns.  
* **Key Logic:**
  - Converts lance base and tip positions to world space based on facing angle.
  - Computes a collision radius around the lance segment.
  - Iterates over entities matching collision/no-collision tag filters.
  - For each valid target, checks if:
    - Hit cooldown is expired (0.75s).
    - Target is within lance range and in front (`dot >= 0`).
  - On hit:
    - If target is also jousting (`"jousting"` tag) *and* facing away (`DiffAngle > 44°`), pushes `"joust_collide"` event and sets `collided = true`.
    - Otherwise, calls `onhitotherfn` (if set), triggers combat via `combat:DoAttack`, and pushes `"knockback"` with radius `6.5` and forced landing.

## Events & Listeners
- **Pushes/Triggers:**
  - `"joust_collide"`: Immediately pushed on mutual jousting collision.
  - `"knockback"`: Pushed on successful hit against a non-jousting or non-reciprocal target, with parameters `{ knocker = inst, radius = 6.5, forcelanded = true }`.
- **Listens for:** None identified.
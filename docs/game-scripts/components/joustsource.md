---
id: joustsource
title: Joustsource
description: Manages the lance-based melee attack logic for jousting entities, including collision detection against targets within the lance's arc and pushback/knockback behavior.
tags: [combat, physics, joust]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: b0c430b0
system_scope: combat
---

# Joustsource

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`JoustSource` implements the physics and logic for lance-based attacks used in jousting gameplay. It calculates a forward-facing lance arc, checks for collisions with eligible targets within that arc, and triggers combat actions or knockback when a target is struck. It relies on the `combat` and `health` components to validate targets and execute attacks.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("joustsource")
inst.components.joustsource:SetLanceLength(8)
inst.components.joustsource:SetSpeed(TUNING.WILSON_RUN_SPEED)
inst.components.joustsource:SetOnHitOtherFn(function(joust_inst, attacker, target)
    -- Custom behavior on lance impact
end)
-- Called periodically during jousting movement to resolve collisions
local hit = inst.components.joustsource:CheckCollision(attacker, targets_table)
```

## Dependencies & tags
**Components used:** `combat`, `health`  
**Tags:** Checks `jousting`, `player`, `FX`, `NOCLICK`, `DECOR`, `INLIMBO`, `_combat`  
**Tags added:** `jousting` (via `JOUSTING_TAGS` constant for reference only; actual tag management happens externally)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `speed` | number | `TUNING.WILSON_RUN_SPEED` | Run speed used during jousting (not directly used in this component but stored for reference) |
| `length` | number or `nil` | `nil` | Length of the lance in game units; required before `CheckCollision` is effective |
| `collide_tags` | table | `{ "_combat" }` | Tags that allow collision (e.g., valid targets must have at least one of these) |
| `no_collide_tags` | table | `{ "FX", "NOCLICK", "DECOR", "INLIMBO" }` (plus `"player"` if PVP is disabled) | Tags that block collision regardless of other tags |
| `onhitotherfn` | function or `nil` | `nil` | Optional callback invoked when a non-jousting target is hit by the lance |
| `loops` | number or `nil` | `nil` | Animation loop count for jousting run animation |

## Main functions
### `SetSpeed(speed)`
* **Description:** Sets the stored run speed value for the jousting entity.
* **Parameters:** `speed` (number) — speed in units per second.
* **Returns:** Nothing.

### `GetSpeed()`
* **Description:** Returns the currently stored run speed.
* **Parameters:** None.
* **Returns:** number — the stored speed value.

### `SetRunAnimLoopCount(loops)`
* **Description:** Sets the number of animation loops to play for the jousting run animation.
* **Parameters:** `loops` (number) — number of animation cycles.
* **Returns:** Nothing.

### `GetRunAnimLoopCount()`
* **Description:** Returns the currently set animation loop count.
* **Parameters:** None.
* **Returns:** number or `nil` — the stored loop count.

### `SetLanceLength(length)`
* **Description:** Sets the effective length of the lance in world units (from hilt to tip).
* **Parameters:** `length` (number) — lance length.
* **Returns:** Nothing.

### `GetLanceLength()`
* **Description:** Returns the currently set lance length.
* **Parameters:** None.
* **Returns:** number or `nil` — the stored lance length.

### `SetOnHitOtherFn(fn)`
* **Description:** Assigns a custom callback function to be invoked when the lance hits a non-jousting target.
* **Parameters:** `fn` (function) — function with signature `fn(joust_inst, attacker, target)`.
* **Returns:** Nothing.

### `CheckCollision(inst, targets)`
* **Description:** Checks for entities within the lance's conical arc in front of `inst`, applies collisions and combat actions for eligible targets, and updates `targets` table with recent hits to prevent spam (via 0.75s cooldown).
* **Parameters:**
  * `inst` (GothamEntity) — the jousting entity performing the lance attack.
  * `targets` (table) — table keyed by target entity, used to track last-hit timestamps for cooldown logic.
* **Returns:** boolean — `true` if any jousting entity collided head-on (`joust_collide` event was pushed), `false` otherwise.
* **Error states:** May silently skip targets that are invalid, dead (`health:IsDead()`), non-targetable (`combat:CanTarget` fails), or within the protection zone defined by `TargetForceAttackOnly`. Also skips collisions if the lance tip has already hit the target within the last `0.75` seconds.

## Events & listeners
- **Listens to:** None.
- **Pushes:**  
  - `knockback` — pushed on hit targets with payload `{ knocker = inst, radius = 6.5, forcelanded = true }`.  
  - `joust_collide` — pushed *immediately* (via `PushEventImmediate`) on another `jousting` entity when lance and lance collide according to `should_collide()` angle logic.

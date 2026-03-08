---
id: SGbishop
title: Sgbishop
description: Manages the state machine and behavioral logic for the Bishop mob, including movement, combat, stunned states, and targeted projectile attacks.
tags: [ai, combat, boss, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: b91ad26e
system_scope: entity
---

# Sgbishop

> Based on game build **714004** | Last updated: 2026-03-08

## Overview
The `SGbishop` stategraph defines the complete state machine for the Bishop mob, including idle behavior, movement, combat (charging and firing projectiles), sleeping/waking, freezing, electrocution, sinking, falling into void, and stun mechanics. It integrates heavily with the `combat`, `health`, `locomotor`, and `sleeper` components to manage transitions between states based on gameplay events and time-based triggers. The Bishop uses custom targeting logic to maintain optimal distance from targets during attacks.

## Usage example
```lua
-- Typically instantiated automatically by the Bishop prefab definition
-- No manual component usage is required; this is a stategraph, not a component.
-- Example of internal usage in a prefabs file:
-- return Class("Bishop", " mob", function(self)
--     local inst = CreateEntity()
--     inst:AddComponent("combat")
--     inst:AddComponent("health")
--     inst:AddComponent("locomotor")
--     inst:AddComponent("sleeper")
--     inst:AddStateGraph("bishop", "SGbishop")
--     return inst
-- end)
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`, `sleeper`
**Tags:** States use and manage tags such as `idle`, `canrotate`, `busy`, `caninterrupt`, `hit`, `attack`, `stunned`, `nosleep`, `noelectrocute`. Tags like `stunned` and `nosleep` are added/removed across multiple states.

## Properties
No public properties. This is a stategraph factory function that returns a `StateGraph` instance.

## Main functions
### `GetTargetingXZDir(inst, target)`
*   **Description:** Calculates a normalized x/z position and facing direction for the Bishop relative to its target, clamping the distance between `MIN_TGT_RANGE` and `MAX_TGT_RANGE`. If the target is at zero distance, it uses the Bishop's current rotation.
*   **Parameters:** `inst` (entity) – the Bishop entity; `target` (entity) – the target entity.
*   **Returns:** `x1` (number), `z1` (number), `dir` (number) – world x and z coordinates and facing direction in degrees.
*   **Error states:** None; returns a default point 6 units ahead if `target` is invalid or nil.

### `LerpTargetingXZDir(...)`
*   **Description:** Linearly interpolates between two targeting positions and directions, while enforcing distance bounds (`MIN_TGT_RANGE`, `MAX_TGT_RANGE`). Used during the attack state to gradually adjust targeting toward the moving target.
*   **Parameters:** `inst` (entity), `xa`/`za`/`dira` (start position/dir), `xb`/`zb`/`dirb` (end position/dir), `k` (number, 0–1 interpolation weight).
*   **Returns:** `x1`, `z1`, `dir1` (numbers) – interpolated position and direction.
*   **Error states:** If the angular difference between start and interpolated direction exceeds 90°, returns the start position/direction instead.

### `SetHeadGlow(inst, glow)`
*   **Description:** Controls the Bishop's head glow intensity via light overrides on various symbols.
*   **Parameters:** `inst` (entity), `glow` (boolean or number) – if truthy, sets intensity to `0.64`; otherwise sets to `0`.
*   **Returns:** Nothing.
*   **Error states:** None.

## Events & listeners
- **Listens to:** `doattack` – triggers `attack` state if not dead/busy; stores target during hit states for delayed attack.
- **Pushes:** None; this stategraph is passive in event emission (no `inst:PushEvent` calls).
- **Common Handlers used:** `OnHop`, `OnLocomote`, `OnSleepEx`, `OnWakeEx`, `OnFreeze`, `OnElectrocute`, `OnAttacked`, `OnDeath`, `OnSink`, `OnFallInVoid`.
- **Timelines & events:** State-specific `FrameEvent` and `TimeEvent` handlers fire sounds, tag changes, and state transitions. Custom event handlers in `events` table register `doattack`.
---
id: SGberniebig
title: Sgberniebig
description: State machine controller for Bernie Big boss entity, managing animations, sound cues, shadow transitions, and behavior states (idle, attack, death, etc.).
tags: [ai, combat, boss, animation, sound]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 6093ec5e
system_scope: entity
---

# Sgberniebig

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGberniebig` defines the complete state machine for the Bernie Big boss entity in Don't Starve Together. It specifies how the entity transitions between states such as idle, taunt, attack, hit, death, and activation/deactivation phases. It integrates closely with the `combat`, `health`, and `locomotor` components, and handles animation control, dynamic shadow sizing, sound playback, and synchronization via timeline events. This stategraph is loaded and driven by the stategraph system, with an initial entry state of `"activate"`.

## Usage example
This stategraph is automatically applied by the game engine when the `bernie_big` prefab is instantiated and its stategraph is set. Modders do not typically invoke it directly; instead, they interact via the entity's components or by triggering events like `"doattack"` or `"attacked"`.

```lua
-- This stategraph is used internally by the prefab "bernie_big"
-- Example of triggering an attack via event (not constructing the SG directly):
if BernieBigEntity ~= nil and BernieBigEntity.components.combat then
    BernieBigEntity:PushEvent("doattack")
end
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`, `animstate`, `dynamicshadow`, `soundemitter`, `transform`  
**Tags added/removed:** `idle`, `canrotate`, `attack`, `busy`, `hit`, `death`, `deactivating`, `caninterrupt`, `noattack`, `running` (inherited via `CommonStates` helpers)  
**Tags checked:** `busy`, `caninterrupt`, `deactivating`, `running`, `softstop`

## Properties
No public properties are defined in this file. State-specific data is stored in `inst.sg.statemem` and `inst.sg.mem` during runtime.

## Main functions
This file does not define any standalone public functions; it returns a fully configured `StateGraph` object via `StateGraph(...)`. The key logic resides in the state definitions, their event handlers, and helper functions local to the file.

### Helper functions (local)
#### `ChooseAttack(inst, target)`
*   **Description:** Triggers the `"attack"` state with a specified target. Defaults to the combat component's current target if none is given.
*   **Parameters:** `inst` (entity instance), `target` (optional entity or nil).
*   **Returns:** `true` (used as callback for brevity).

#### `EaseShadow(inst, k)`
*   **Description:** Interpolates the entity's dynamic shadow size linearly between pre-stored `shadowstart` and `shadowend` using a linear parameter `k ∈ [0,1]`.
*   **Parameters:** `inst` (entity instance), `k` (number, interpolation factor).
*   **Returns:** `nil`.

#### `EaseOutShadow(inst, k)`
*   **Description:** Interpolates shadow size using a quadratic ease-out curve.

#### `EaseInShadow(inst, k)`
*   **Description:** Interpolates shadow size using a quadratic ease-in curve.

#### `EaseInOutShadow(inst, k)`
*   **Description:** Interpolates shadow size using a quadratic ease-in-out curve (easing forward for k ≤ 0.5, backward otherwise).

#### `DoFootStep(inst)`
*   **Description:** Plays the `"footstep"` sound and records the time; sound pitch/params differ if `running` is true in state memory.
*   **Parameters:** `inst` (entity instance).
*   **Returns:** `nil`.

#### `DoStopFootStep(inst)`
*   **Description:** Ensures a footstep sound is played upon stopping if sufficient time has elapsed since the last step.
*   **Parameters:** `inst` (entity instance).
*   **Returns:** `nil`.

### `CommonStates.AddWalkStates(...)`, `AddRunStates(...)`, etc.
*   **Description:** These functions from `commonstates.lua` extend the `states` table with additional walk/run/hop/sink/void-fall states and timelines. They do not return values; modifications are applied in-place to the `states` array.

## Events & listeners
### Listens to:
- `locomote` – via `CommonHandlers.OnLocomote(true, true)`
- `hop` – via `CommonHandlers.OnHop()`
- `sink` – via `CommonHandlers.OnSink()`
- `fallinvoid` – via `CommonHandlers.OnFallInVoid()`
- `death` – transitions to `"death"` state unless already deactivating.
- `doattack` – initiates attack if not busy or dead, or during hit recovery.
- `attacked` – triggers `"hit"` state if not dead and not locked; may chain into attack post-hit.
- `animqueueover` – in `"death"` and `"deactivate"` states, transitions to inactive state upon animation completion.
- `animover` – in `"idle_nodir"`, `"attack"`, `"taunt"`, `"hit"`, and `"activate"` states, transitions appropriately once animation completes.

### Pushes:
- `invincibletoggle` – via `Health:SetInvincible(val)` in `"deactivate"` on enter/exit.

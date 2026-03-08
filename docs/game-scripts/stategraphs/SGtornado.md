---
id: SGtornado
title: Sgtornado
description: Manages the state machine for a tornado entity, controlling movement, animation, and damage/destruction logic for nearby targets.
tags: [locomotion, damage, environment, ai]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 50217677
system_scope: environment
---

# Sgtornado

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGtornado` is a `StateGraph` implementation that defines the behavior and animation states of a tornado entity in DST. It orchestrates movement (`walk`, `run`, `idle`, etc.), triggers periodic destruction logic (`destroystuff`), and handles transitions between idle, walking, and running states. The state graph integrates with the `locomotor`, `combat`, and `workable` components to damage entities or destroy workable objects in the tornado's radius, and it respects PVP and follower rules when selecting targets.

## Usage example
The `SGtornado` state graph is typically applied during the prefab definition of a tornado entity (e.g., via `AddStateGraph("tornado", "stategraphs/SGtornado")`). It is not added as a component but is the core behavior container for the tornado entity itself.

```lua
-- Example usage in a prefab (not shown in this file):
local functionfn(inst)
    inst:AddTag("tornado")
    inst:AddStateGraph("tornado")
    inst.sg:GoToState("spawn") -- transitions to movement
end
```

## Dependencies & tags
**Components used:**  
- `locomotor` — for movement control (`WalkForward`, `RunForward`, `StopMoving`, `WantsToMoveForward`, `WantsToRun`)
- `health` — to check if targets are alive (`IsDead`)
- `combat` — to initiate attacks and suggest new targets (`CanBeAttacked`, `GetAttacked`, `SuggestTarget`)
- `workable` — to destroy workable objects (`CanBeWorked`, `GetWorkAction`, `WorkedBy`)

**Tags:**  
- Internal state tags: `idle`, `moving`, `running`, `canrotate`, `busy`, `empty`  
- Target filtering tags: `_combat`, `CHOP_workable`, `DIG_workable`, `HAMMER_workable`, `MINE_workable`  
- Exclusion tags: `INLIMBO`, `tornado_immune`

## Properties
No public properties. This is a `StateGraph` definition returning a configured `StateGraph` object; it does not declare instance-specific properties.

## Main functions
The file does not define any standalone public functions beyond internal event handlers and `destroystuff`. All logic is embedded in `State` definitions and event callbacks.

### `destroystuff(inst)`
*   **Description:** Scans for valid entities within a 3-unit radius and applies damage or destroys workable objects. It is called on state entry (`idle`, `walk`, `run`, `run_stop`) and periodically via `TimeEvent` during active movement states.
*   **Parameters:**  
    - `inst` (Entity) — the tornado entity.
*   **Returns:** Nothing.
*   **Error states:**  
    - Entities may become invalid mid-iteration; checks `v:IsValid()` before use.
    - Damage is skipped if `v.components.health:IsDead()` is true or `v.components.combat:CanBeAttacked()` returns `false`.
    - PVP restrictions are enforced if PVP is disabled.

## Events & listeners
- **Listens to:**  
  - `locomote` — triggers movement state transitions (`walk_start`, `walk_stop`, `run_start`, `run_stop`, `spawn`, `idle`) based on `locomotor` flags.  
  - `animqueueover`, `animover` — transitions between animation-bound states (`idle`, `walk`, `run`, `run_stop`, `despawn`).
- **Pushes:**  
  - None (this is a `StateGraph`, not a component; events are dispatched internally by the state machine).

---
id: moonbeastbrain
title: Moonbeastbrain
description: Controls the AI behavior of the Moon Beast boss, managing its transitions between chasing, attacking the Moon Base, and petrification states.
tags: [ai, boss, combat]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: e0f0890c
system_scope: brain
---

# Moonbeastbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MoonBeastBrain` defines the decision-making logic for the Moon Beast boss. It coordinates behavior via a behavior tree (`BT`) that evaluates state conditions and executes appropriate actions. Key behaviors include patrolling toward the Moon Base, attacking it when it is vulnerable (during `mooncharge`), chasing players, and entering petrification when the Moon Base is no longer charging. The brain is tightly integrated with the `entitytracker`, `combat`, `health`, `timer`, and `workable` components, and uses common DST behavior modules like `ChaseAndAttack`, `Leash`, `StandStill`, and `AttackWall`.

## Usage example
```lua
-- Typically added automatically when the Moon Beast prefab is instantiated
-- Manual usage is not recommended as it relies on specific prefabs and tags.
-- Example of internal brain initialization:
local brain = MoonBeastBrain(some_inst)
some_inst.brain = brain
brain:OnStart()
```

## Dependencies & tags
**Components used:** `combat`, `entitytracker`, `health`, `timer`, `workable`  
**Tags checked:** `playerskeleton`, `HAMMER_workable` (used in `BreakSkeletons`)

## Properties
No public properties. Internal state is held in private fields `_losttime` and `_petrifytime`.

## Main functions
### `ForcePetrify()`
* **Description:** Forces the Moon Beast to enter the petrification state by setting a reference time for petrification expiration.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnStart()`
* **Description:** Initializes and starts the behavior tree root node. This is called once when the brain is first attached to the entity and should only be invoked by the engine or prefab setup logic.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Pushes:** `workmoonbase` — fired when the Moon Beast begins working on the Moon Base; includes `{ moonbase = <inst> }` in data.
- **Pushes:** `moonpetrify` — fired when the Moon Beast should enter the petrified state.
- **Listens to:** None — this brain does not register custom event listeners. It relies on behavior tree conditions and node actions.

### Behavior Tree Nodes (Internal Use)
The `OnStart()` method constructs the behavior tree with these critical internal behaviors:
- `LostMoonBase`: Ends the Moon Beast’s existence if it fails to reacquire the Moon Base within `LOST_TIME` (5 seconds).
- `LostMoonCharge`: Triggers petrification when the Moon Base’s `mooncharge` timer ends or vanishes.
- `ShouldTargetMoonBase`: Returns true when the Moon Base is workable, charging, and the Moon Beast is not under recent attack (`> AGGRO_TIME`).
- `BreakSkeletons`: Attacks any nearby skeleton entities tagged with `playerskeleton` and `HAMMER_workable` using `WorkedBy`.
- `WorkMoonBase`: Pushes the `workmoonbase` event to signal work initiation.
- `ChaseAndAttack`: Default behavior for targeting players within `100` units.
- `Leash`: Enforces positional constraints relative to the Moon Base (working, returning, or roaming distances).

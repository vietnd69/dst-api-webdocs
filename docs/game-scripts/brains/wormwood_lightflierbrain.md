---
id: wormwood_lightflierbrain
title: Wormwood Lightflierbrain
description: Controls the behavior tree logic for the Wormwood Lightflier entity, primarily managing panic responses and walk speed adjustments via the locomotor component.
tags: [ai, brain, panic, movement, boss]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: e6eb2fe5
---

# Wormwood Lightflierbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`Wormwood_LightFlierBrain` is a brain component that defines the behavior tree for the Wormwood Lightflier entity in Don't Starve Together. It extends the base `Brain` class and implements custom logic in `OnStart` to coordinate movement speed changes and panic responses. When activated, it sets the `walkspeed` property of the `locomotor` component and disables direct drive mode to allow behavior-driven movement. The behavior tree prioritizes panic handling (via `Panic`, `BrainCommon.PanicTrigger`, and `BrainCommon.ElectricFencePanicTrigger`) while falling back to enabling direct drive when no panic condition is active.

## Usage example
```lua
local inst = GLOBAL.Creatura(...)
inst:AddBrain("wormwood_lightflierbrain")
-- The brain automatically initializes its behavior tree during OnStart()
-- when the entity is spawned and the brain component is assigned.
```

## Dependencies & tags
**Components used:**
- `locomotor`: read/write access to `walkspeed` and `directdrive` properties.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `ent` | `nil` (inherited) | The entity instance this brain belongs to; inherited from `Brain._ctor`. |
| `bt` | `BT` | `nil` (assigned in `OnStart`) | The behavior tree instance created using `PriorityNode`, `ParallelNode`, `ActionNode`, `EventNode`, and `WaitNode`. |

## Main functions
### `OnStart()`
* **Description:** Initializes the entity's behavior tree (`self.bt`) during brain activation. Configures a hierarchical node structure to prioritize panic responses and adjust locomotor speed when panic is active. On entry to the fallback path, it re-enables direct drive mode for external movement control.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** None documented; assumes required components (`locomotor`) and constants (`TUNING.LIGHTFLIER.WALK_SPEED`) are available.

## Events & listeners
- **Listens to:** `panic` — triggers a `ParallelNode` combining `Panic` behavior and a 6-second wait.
- **Pushes:** None — the brain does not fire custom events itself (it uses existing `Panic` and `BrainCommon` triggers that may push internally).

> Note: The `EventNode(self.inst, "panic", ...)` listener is registered as part of the behavior tree definition in `OnStart`, not via `inst:ListenForEvent`. Event-driven nodes inside behavior trees use internal BT mechanisms, not the global event system.
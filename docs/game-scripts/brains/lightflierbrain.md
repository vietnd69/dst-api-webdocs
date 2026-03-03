---
id: lightflierbrain
title: Lightflierbrain
description: Controls the AI behavior of lightfliers, managing movement, threat response, home seeking, and formation following.
tags: [ai, locomotion, combat, environment]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 339afd05
system_scope: brain
---

# Lightflierbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Lightflierbrain` defines the behavior tree logic for lightflier entities. It orchestrates movement, fleeing from threats (especially when not in formation), returning to a designated home (a `lightflier_home` tile), and syncs with the `formationfollower` component. It integrates with several components including `homeseeker`, `locomotor`, `burnable`, `pickable`, and `childspawner`, and uses helper behaviors like `RunAway`, `Panic`, `Wander`, and `Follow`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddBrain("lightflierbrain")
-- The brain automatically initializes upon stategraph entry via OnStart()
-- No direct instantiation or method calls are needed by modders.
```

## Dependencies & tags
**Components used:** `homeseeker`, `locomotor`, `formationfollower`, `burnable`, `pickable`, `childspawner`, `knownlocations`  
**Tags added/checked:** `scarytoprey` (via `huntertags`), `lightflier_home` (via `NEW_HOME_TAGS`), `burnt`, `fire` (excluded via `NEW_HOME_NOTAGS`), `NOCLICK` (excluded), `busy` (state tag check)

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree with a hierarchical priority-based state machine. It configures locomotion and behavior based on formation status, threat proximity, and home conditions.
* **Parameters:** None.
* **Returns:** Nothing.

### `GoHomeAction(inst)`
* **Description:** Constructs and returns a buffered `GOHOME` action if conditions are met (e.g., home is valid, not burning, and not pickable), or `nil` otherwise.
* **Parameters:** `inst` (entity) — the lightflier entity.
* **Returns:** `BufferedAction` or `nil`.
* **Error states:** Returns `nil` if `inst.sg:HasStateTag("busy")` is true, or if any required component or home condition fails.

### `FindHome(inst)`
* **Description:** Ensures the `homeseeker` component exists and assigns a valid `lightflier_home` tile as the home if none is currently assigned. Takes ownership of the lightflier in the home’s `childspawner`.
* **Parameters:** `inst` (entity) — the lightflier entity.
* **Returns:** Nothing.

### `ShouldGoHome(inst)`
* **Description:** Determines whether the lightflier should return home. Returns `true` if the lightflier has just returned home (`_lightflier_returning_home == inst`) or if enough time has passed (`>60` seconds) and sufficient offspring are outside (`numchildrenoutside` exceeds `TUNING.LIGHTFLIER_FLOWER_TARGET_NUM_CHILDREN_OUTSIDE`).
* **Parameters:** `inst` (entity) — the lightflier entity.
* **Returns:** `boolean`.
* **Error states:** Returns `false` if home is invalid, not set, or conditions are not met.

## Events & listeners
- **Listens to:** `panic` — triggers a panic behavior and waits 6 seconds.
- **Pushes:** None directly (events are handled internally via behaviors and the behavior tree).

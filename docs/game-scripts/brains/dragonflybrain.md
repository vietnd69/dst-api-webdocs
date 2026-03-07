---
id: dragonflybrain
title: Dragonflybrain
description: Manages AI behavior for the Dragonfly boss, including fight reset logic, Lavae spawning, chase/combat, and home patrolling.
tags: [ai, boss, combat, spawning, locomotion]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: ec78c15a
system_scope: brain
---

# Dragonflybrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`DragonflyBrain` implements the decision-making logic for the Dragonfly boss using a Behavior Tree (`BT`). It coordinates fight reset conditions, Lavae spawning (via `rampingspawner`), enemy tracking (`chaseandattack`), leash constraints (`leash`), and home positioning via `knownlocations`. The brain integrates with the `combat`, `stuckdetection`, and `knownlocations` components to ensure responsive, context-aware behavior.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("dragonflybrain")
-- Initialization adds spawnpoint location and builds behavior tree
inst:DoTaskInTime(0, function()
    inst.components.dragonflybrain:OnInitializationComplete()
    inst.components.dragonflybrain:OnStart()
end)
```

## Dependencies & tags
**Components used:** `combat`, `knownlocations`, `rampingspawner`, `stuckdetection`  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnSpawnLavae()`
* **Description:** Clears cached spawn position and spawns a Lavae entity via the `rampingspawner` component. Called when a Lavae spawn is triggered (e.g., in response to a `"spawnlavae"` event).
* **Parameters:** None.
* **Returns:** Nothing.

### `OnStart()`
* **Description:** Initializes and assigns the Behavior Tree (`self.bt`) root node. The tree handles fight reset, Lavae spawning, chasing/attacking enemies, and patrolling near the spawn point.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnInitializationComplete()`
* **Description:** Records the entity's current world position as `"spawnpoint"` using `knownlocations`, preventing overwriting if already set. Typically called after entity spawn to establish the boss's home anchor.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Pushes:** `"spawnlavae"` — fired after the `Leash` and `DoAction` behavior nodes coordinate near the spawn point. Triggers `OnSpawnLavae()` logic.
- **Listens to:** None identified.

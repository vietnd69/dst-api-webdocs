---
id: sharkboibrain
title: Sharkboibrain
description: Controls the AI behavior of the Sharkboi character, handling combat, trading, wandering, and chatter states in Don't Starve Together.
tags: [ai, combat, trader, wandering, chatter]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: a3c3c616
---

# Sharkboibrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `SharkboiBrain` component implements the behavior tree for the Sharkboi entity, a trader NPC in Don't Starve Together. It manages state-dependent actions such as combat engagement, trading attempts with players, wandering near its designated hole, and contextual chatter (sound effects or voice lines). This brain uses a priority-based behavior tree that evaluates active conditions and executes appropriate sub-trees, including combat, trading, idle wandering, and post-defeat behaviors.

Key dependencies include the `combat`, `health`, `trader`, and `locomotor` components. The brain integrates with multiple behavior modules (`chaseandattack`, `wander`, `faceentity`, `leash`, `chattynode`) to orchestrate AI responses dynamically based on game state and entity proximity.

## Usage example

```lua
local sharkboi = SpawnPrefab("sharkboi")
if sharkboi then
    sharkboi:AddComponent("sharkboibrain")
    sharkboi.components.sharkboibrain:OnStart()
end
```

Note: In practice, the component is typically added and initialized automatically by the prefab definition; this snippet demonstrates manual usage for modding purposes.

## Dependencies & tags

**Components used:**
- `combat`: Invoked via `inst.components.combat:InCooldown()`, `:TargetIs()`, `:TryAttack()`, `:ignorehitrange`, and `:target`
- `health`: Invoked via `target.components.health:IsDead()`
- `trader`: Invoked via `inst.components.trader:IsTryingToTradeWithMe()`
- `locomotor`: Invoked via `inst.components.locomotor.pusheventwithdirection`
- `behavior`: Implemented via `PriorityNode`, `ChaseAndAttack`, `Wander`, `FaceEntity`, `Leash`, `ChattyNode`

**Tags:**
- `"try_restore_canrotate"` (state tag, removed and replaced by `"canrotate"` during navigation)
- `"hostile"` (state tag, checked during combat victory logic)
- `"playerghost"` (checked for valid target exclusion)

## Properties

No public instance variables are initialized or exposed as properties in this component. All logic is encapsulated within the behavior tree root constructed in `OnStart()`.

## Main functions

### `OnStart()`
* **Description:** Initializes and launches the behavior tree. This is the main entry point for the brain and should be called when the entity becomes active or respawns. It constructs a nested priority node hierarchy to handle combat, trading, wandering, idle states, and chatter triggers.
* **Parameters:** None
* **Returns:** `nil`
* **Error states:** None documented. Assumes required components (`combat`, `trader`, `locomotor`, `health`) and behaviors are available.

## Events & listeners

This component does not register or fire any events directly. It relies entirely on the behavior tree infrastructure (`bt`, `BT`, `PriorityNode`, etc.) to manage control flow and state transitions via behavior node evaluations and internal node push/pull semantics.
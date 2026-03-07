---
id: crabkingbrain
title: Crabkingbrain
description: Controls the AI behavior of the Crab King boss, managing phase transitions and targeting actions via behavior trees.
tags: [ai, boss, combat]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 2c23c926
system_scope: brain
---

# Crabkingbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Crabkingbrain` implements the boss AI logic for the Crab King entity in DST. It uses a behavior tree (`BT`) to orchestrate high-priority actions such as healing, casting claws, freezing, and cannon fire, triggered conditionally based on the entity's state, health, and surroundings. The brain integrates with components like `health`, `timer`, `knownlocations`, and `combat`, and depends on external behavior modules like `doaction`, `panic`, and `wander`. It does not override standard `Brain` lifecycle methods beyond `OnStart` and `OnInitializationComplete`.

## Usage example
This brain is attached automatically to the Crab King prefab during entity initialization. Modders typically do not instantiate it directly but can inspect or override its behavior tree by hooking into the entity's state graph or behavior setup.

```lua
-- Example: Attaching the brain to a custom boss entity (conceptual only)
local inst = CreateEntity()
inst:AddComponent("brain")
inst:AddComponent("health")
inst:AddComponent("combat")
inst:AddComponent("timer")
inst:AddComponent("knownlocations")
inst:AddTag("monster")
inst:AddTag("icewall")
inst.components.brain = CrabkingBrain(inst)
inst.components.brain:OnStart()
```

## Dependencies & tags
**Components used:**  
- `combat` (`target` property referenced)  
- `freezable` (`IsFrozen` called)  
- `health` (`GetPercent` called)  
- `knownlocations` (`RememberLocation` called)  
- `timer` (`TimerExists` called)  

**Tags:**  
- `character`, `animal`, `monster`, `smallcreature` — used in `TheSim:FindEntities` filtering for valid targets.  
- `icewall`, `boat`, `boat_ice` — used to conditionally gate actions (e.g., freezing, healing).  
- No tags are added/removed directly by this brain.

## Properties
No public properties are initialized in this brain. All state is managed internally or via attached components.

## Main functions
### `OnStart()`
*   **Description:** Initializes the behavior tree (`bt`) with a priority-based root node. The root evaluates high-priority actions (`heal`, `freeze`, `claws?`) in sequence, but only if the entity is not in `inert`, `casting`, `fixing`, or `spawning` state tags.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None identified; assumes required components and state graph tags exist.

### `OnInitializationComplete()`
*   **Description:** Records the Crab King's starting position as `"spawnpoint"` in the `knownlocations` component for future reference (e.g., retreat or teleport logic).
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
None identified — this brain does not register event listeners or push custom events. All decision logic resides in the behavior tree preconditions (`ShouldHeal`, `ShouldFreeze`, etc.).

> **Note:** Functions like `ShouldHeal`, `ShouldFreeze`, `ShouldHaveClaws`, and `ShouldCannon` are helpers used by `DoAction` behavior nodes. They are not exposed as brain methods but define the conditions under which actions execute. `ShouldCannon` is referenced in the file but not used in the current behavior tree root.

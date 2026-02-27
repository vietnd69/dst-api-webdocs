---
id: rabbitbrain
title: Rabbitbrain
description: Controls the AI behavior of rabbit-like entities, managing panic responses to predators, home seeking, foraging for edible bait, and wandering.
tags: [ai, entity, brain, wander, panic]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 49fb6602
---

# Rabbitbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`RabbitBrain` is a brain component that implements the artificial intelligence logic for rabbit-like entities in DST. It defines a behavior tree that prioritizes survival actions: first responding to immediate threats (via panic triggers), then seeking safety (home), foraging for food, and finally wandering. It uses several external components (`homeseeker`, `eater`, `knownlocations`) and leverages common brain utilities (`BrainCommon`) and behavior utilities (`RunAway`, `DoAction`, `Wander`, `EventNode`, `WhileNode`, `PriorityNode`, `BT`) to orchestrate decision-making.

## Usage example
This component is not typically added manually by modders but is assigned to rabbit-like entities (e.g., Rabbit,.prefab) during entity construction via `inst:AddComponent("brain")` with this brain class set. A minimal example of attaching and initializing the brain for a custom entity:

```lua
inst:AddComponent("brain")
inst.components.brain:SetBrainClass("rabbitbrain")
inst:AddTag("prey")
inst:AddTag("rabbitdisguise") -- to avoid triggering predator response to self
```

Note: Direct instantiation of the brain class via `RabbitBrain()` is discouraged; use the standard `brain` component interface.

## Dependencies & tags
**Components used:**
- `homeseeker` — accessed via `inst.components.homeseeker` to check home validity and location.
- `eater` — accessed via `item.components.eater:CanEat(item)` during food search.
- `knownlocations` — accessed via `inst.components.knownlocations:GetLocation("home")` to get the home position for wandering/wander center.
- `bait` — checked on target items via `item.components.bait`.
- `inventoryitem` — checked via `item.components.inventoryitem:IsHeld()` to prevent eating held items.

**Tags checked/used:**
- `"scarytoprey"` — used to identify threats in `HunterParams`.
- `"INLIMBO"`, `"outofreach"`, `"NOCLICK"`, `"rabbitdisguise"`, `"planted"` — used to filter potential targets.
- `"trapped"` — checked on stategraph to prevent going home while trapped.
- `"INLIMBO"`, `"rabbitdisguise"` — explicitly excluded from panic targets.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance this brain controls (inherited from `Brain`). |

No additional public properties are initialized in the constructor.

## Main functions
### `RabbitBrain:OnStart()`
* **Description:** Initializes the brain's behavior tree when the entity gains control. Constructs a priority-based behavior tree with nodes for panic (predator flee), home seeking, and foraging/wandering. This method is called automatically by the brain system and must not be invoked manually.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** This function assumes required components (`homeseeker`, `knownlocations`, `eater`) are attached to the entity; failure to attach them may cause unexpected behavior (e.g., `GoHomeAction` or `EatFoodAction` failing silently if components are missing).

## Events & listeners
**Listens to:** None explicitly — state transitions and events are handled via behavior tree nodes (`EventNode`, `WhileNode`) that respond to world state or time-of-day changes (`TheWorld.state.isday`, `TheWorld.state.isspring`). The `EventNode` listens for an `"gohome"` event to trigger the `GoHomeAction`, but no direct `inst:ListenForEvent` calls are present.

**Pushes:** None — this component does not fire custom events; behavior changes are signaled internally through the behavior tree execution.
---
id: wagboss_robotbrain
title: Wagboss Robotbrain
description: Controls the AI behavior of the Wagboss robot, with distinct hostile and friendly logic paths determined by the inst.hostile property.
tags: [ai, boss, combat, zone]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: de25a1e8
---

# Wagboss Robotbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`WagbossRobotBrain` is a Brain component that defines the behavioral logic for the Wagboss robot entity in DST. It implements two distinct AI modes: hostile behavior when `inst.hostile` is `true`, and friendly (passive) behavior otherwise. The brain uses a Behavior Tree (BT) root built from high-level behavior nodes (e.g., `PriorityNode`, `ParallelNode`, `Leash`, `Wander`, `ChaseAndAttack`) and integrates with the `combat` component for ranged attacks and the `wagboss_tracker` component for defeat state detection. It is designed to function specifically within the WagPunk arena zone via `TheWorld.Map` queries.

## Usage example
This component is typically attached automatically to the Wagboss robot entity during world initialization (not manually added by modders in most cases). If manually instantiated, it would be added like any other brain component:

```lua
local inst = CreateEntity()
inst:AddComponent("brain")
inst:AddComponent("combat")
inst:AddTag("hostile") -- or not, depending on desired behavior
inst.components.brain:SetBrainClass("wagboss_robotbrain")
inst.hostile = true
```

## Dependencies & tags
**Components used:** `combat` (via `inst.components.combat`), `wagboss_tracker` (via `TheWorld.components.wagboss_tracker`).  
**Tags:** `hostile`, `busy`, `jumping` (checked via `inst.sg:HasStateTag("...")`).  
**Behavior behaviors used:** `Leash`, `Wander`, `ChaseAndAttack` (from `./behaviours/`).

## Properties
No public instance properties are declared or initialized directly in the constructor beyond the inherited Brain fields (`self.inst`, `self.bt`). All configuration is implicit in the Behavior Tree root node structure.

## Main functions
### `WagbossRobotBrain:OnStart()`
* **Description:** Constructs and assigns the Behavior Tree root based on whether the entity is hostile. This is the main initialization method called when the brain becomes active. Hostile behavior prioritizes ranged attacks, combat, and leash enforcement within the arena; friendly behavior waits for the Wagboss to be defeated or the arena barrier to drop, then triggers the "losecontrol" event and wanders loosely.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** None. Fails gracefully if `TheWorld.Map` or `TheWorld.components.wagboss_tracker` are unavailable by returning default behavior.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls in this file).
- **Pushes:** `deactivate` (hostile mode during reset), `losecontrol` (friendly mode after condition wait).
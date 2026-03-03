---
id: mermguardbrain
title: Mermguardbrain
description: Implements the decision-making logic for a merm guard entity, handling combat, following, trading, armor acquisition, healing requests, and interaction with offering pots.
tags: [ai, combat, npc, trader]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 5c0db9b4
system_scope: brain
---

# Mermguardbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MermBrain` defines the behavior tree for a merm guard character, determining how it acts in various situations such as combat, assisting its leader, acquiring armor from armories, seeking healing or trade, eating food, and responding to offering pot calls. It is constructed as a `PriorityNode`-based behavior tree that prioritizes high-criticality actions (e.g., fleeing electric fences, healing, armor pickup) over routine activities (e.g., wandering, following).

The component relies heavily on other components—`combat`, `follower`, `inventory`, `eater`, `health`, `timer`, `knownlocations`, `trader`, and `playercontroller`—to evaluate conditions and perform actions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("brain")
inst:AddComponent("combat")
inst:AddComponent("follower")
inst:AddComponent("inventory")
inst:AddComponent("eater")
inst:AddComponent("health")
inst:AddComponent("timer")
inst:AddComponent("knownlocations")
inst:AddComponent("trader")
inst:AddComponent("playercontroller")

-- Assuming the merm guard prefab is being set up
inst:AddComponent("mermguardbrain")
inst.components.mermguardbrain:OnStart()
```

## Dependencies & tags
**Components used:** `combat`, `container`, `eater`, `equippable`, `follower`, `health`, `inventory`, `knownlocations`, `playercontroller`, `timer`, `trader`  
**Tags:** `merm`, `lunarminion`, `shadowminion`, `merm_armory`, `merm_armory_upgraded`, `mermarmorhat`, `mermarmorupgradedhat`, `INLIMBO`, `outofreach`, `edible_VEGGIE`, `scarytoprey`, `offering_pot`

## Properties
No public properties

## Main functions
### `OnStart()`
*   **Description:** Initializes and assigns the behavior tree to `self.bt`. Constructs a priority-based hierarchy of behavior nodes that handle panic, healing, armor collection, combat, fleeing, returning to throne, leader assistance, answering offering pots, trading, eating, following, and wandering.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Requires `self.inst` to have all required components attached; otherwise, behavior may break or silently fail.

## Events & listeners
- **Listens to:** `merm_use_building` - pushed when armor collection is triggered; internal use only.
- **Pushes:** `merm_use_building` - used internally to trigger armor collection from an armory entity.

---
id: SGstalker_minion
title: Sgstalker Minion
description: Manages the state machine for a stalker minion entity, handling emergence, locomotion, and death behaviors.
tags: [ai, combat, locomotion, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: d6744c91
system_scope: entity
---

# Sgstalker_minion

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGstalker_minion` is a state graph definition that governs the behavior of stalker minion entities in DST. It defines transitions between idle, walking, emerging from the ground, and death states, along with associated logic for collision damage, physics interactions, and animation handling. It leverages several core components—`locomotor`, `health`, `combat`, `workable`, `pickable`, `mine`, and `inventoryitem`—to determine interactions during emergence and movement phases.

## Usage example
This state graph is typically assigned to an entity by calling `inst:AddStateGraph("stalker_minion")`. It does not require manual instantiation or direct method calls.

```lua
local inst = CreateEntity()
inst:AddStateGraph("stalker_minion")
inst.components.locomotor:SetWalkSpeed(1)
inst.emergeimmunetime = 1.5
inst.emergeshadowtime = 3.0
```

## Dependencies & tags
**Components used:**  
`locomotor`, `health`, `combat`, `workable`, `pickable`, `mine`, `inventoryitem`, `transform`, `animstate`, `soundemitter`, `dynamicshadow`  
**Tags:**  
Adds/removes state tags: `idle`, `moving`, `canrotate`, `busy`, `dead`, `noattack`, `NOCLICK`  
Entity tags checked: `flying`, `locomotor`, `INLIMBO`, `NPC_workable`, `stump`, `pickable`, `_inventoryitem`, `_combat`

## Properties
No public properties are initialized in this state graph. It uses per-instance runtime values such as `inst.emergeimmunetime` and `inst.movestarttime`.

## Main functions
This file exports a single `StateGraph` definition and does not define public functions beyond helper closures used internally.

## Events & listeners
- **Listens to:**  
  `death` – triggers transition to `"death"` state if not already dead  
  `stalkerconsumed` – triggers `"death"` state with `"eaten"` anim if not already dead  
  `locomote` – manages transitions between `"idle"` and `"walk"` based on movement intent  
  `animover` – triggers state transitions when animations complete (e.g., return to idle after walk/spawn)
- **Pushes:**  
  None—this state graph does not fire custom events.
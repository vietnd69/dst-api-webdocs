---
id: rabbitkingbrain
title: Rabbitkingbrain
description: Manages the AI behavior tree for the Rabbit King entity, handling distinct behavioral states such as passive trading, aggressive combat, and lucky fleeing.
tags: [ai, boss, combat, locomotion, brain]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 3a3d9abb
system_scope: brain
---

# Rabbitkingbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Rabbitkingbrain` implements the behavior tree for the Rabbit King boss entity. It defines three behavioral variants—passive, aggressive, and lucky—selected based on the `rabbitking_kind` property. The component uses custom actions (`GoHomeAction`, `EatFoodAction`) and leverages common behaviors (`Wander`, `RunAway`, `Leash`, `FaceEntity`, `DoAction`) to govern movement, targeting, and special ability usage. It integrates with components including `combat`, `health`, `eater`, `knownlocations`, `timer`, `homeseeker`, and `inventoryitem`.

## Usage example
```lua
local inst = CreateEntity()
inst.rabbitking_kind = "aggressive"
inst:AddComponent("rabbitkingbrain")
inst.components.rabbitkingbrain:OnStart()
```

## Dependencies & tags
**Components used:** `combat`, `health`, `eater`, `knownlocations`, `timer`, `homeseeker`, `inventoryitem`  
**Tags:** Checks tags `INLIMBO`, `outofreach`, `planted`, `_combat`; manages state tags `trapped` and `ability`.

## Properties
No public properties

## Main functions
### `OnStart()`
*   **Description:** Initializes the behavior tree based on `inst.rabbitking_kind`, selecting and assigning the appropriate behavior tree root (`Create_Passive`, `Create_Aggressive`, or `Create_Lucky`). If `rabbitking_kind` is invalid and the build is dev mode, triggers an assertion.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early without initializing the behavior tree if `rabbitking_kind` is unrecognized *and* not in dev mode; in dev mode, raises an assertion failure.

## Events & listeners
- **Pushes:** `ability_summon`, `ability_dropkick` — fired by the ability node when triggered.

Note: The component does not register any event listeners via `inst:ListenForEvent`. Events are only pushed for ability execution.

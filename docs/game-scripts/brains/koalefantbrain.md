---
id: koalefantbrain
title: Koalefantbrain
description: Implements the AI behavior tree for the koalefant, managing movement, targeting, fleeing, and salt-lick anchoring.
tags: [ai, brain, monster]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 96e2a41c
system_scope: brain
---

# Koalefantbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Koalefantbrain` is a brain component that defines the decision-making logic for the koalefant entity. It constructs a behavior tree using common DST behavior primitives (`ChaseAndAttack`, `RunAway`, `FaceEntity`, `Wander`, `AnchorToSaltlick`) and integrates with `BrainCommon` utilities such as panic triggers and salt-seeking logic. The brain prioritizes survival responses (panic, fleeing), then combat engagement, orientation toward targets, and finally default wander behavior when unthreatened.

## Usage example
```lua
local inst = CreateEntity()
inst:AddBrain("koalefantbrain")
-- No additional setup is required; the brain initializes automatically on start
```

## Dependencies & tags
**Components used:** None identified (relies entirely on brain and behavior classes, not entity components).  
**Tags:** Checks for `notarget` and `character` tags on targets; uses `BrainCommon.ShouldSeekSalt()` logic.

## Properties
No public properties

## Main functions
### `OnStart()`
* **Description:** Initializes and assigns the behavior tree root node by constructing a prioritized sequence of behaviors. This method is automatically called when the brain becomes active.
* **Parameters:** None.
* **Returns:** Nothing.
* **Behavior tree order:** Panic (electric fence/salt-related) > Chase & Attack > Run away + face > Face only > Anchor to saltlick > Wander.

## Events & listeners
None identified.

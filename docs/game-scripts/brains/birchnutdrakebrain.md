---
id: birchnutdrakebrain
title: Birchnutdrakebrain
description: Implements the behavior tree for the Birch Nut Drake, governing its movement, panic responses, combat engagement, and leash behavior.
tags: [ai, combat, boss, navigation]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 96e3aff6
system_scope: brain
---

# Birchnutdrakebrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BirchNutDrakeBrain` defines the decision-making logic for the Birch Nut Drake entity through a behavior tree. It integrates panic responses, ranged combat engagement (`ChaseAndAttack`), and a leash mechanism that restricts movement within a bounded radius of its spawn point. This component relies on the `knownlocations` component to store and retrieve the spawn position used for leash calculations.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("knownlocations")
inst:AddComponent("brain")
inst.components.brain:SetBrain("birchnutdrakebrain")
```

## Dependencies & tags
**Components used:** `knownlocations`  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree root node, which evaluates high-priority behaviors in order: panic triggers (general and electric fence), leash enforcement, combat engagement (chase and attack with ranges 12–21), and finally a fallback action to exit and play idle animation.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None documented.

### `OnInitializationComplete()`
* **Description:** Records the entity's current position as the `"spawnpoint"` location in the `knownlocations` component, which is used later for leash calculations.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None documented.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** `exit` — fired with `{ force = true, idleanim = true }` when no higher-priority behavior triggers, prompting the entity to stop current actions and transition to idle animation.

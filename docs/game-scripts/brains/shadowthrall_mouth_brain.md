---
id: shadowthrall_mouth_brain
title: Shadowthrall Mouth Brain
description: Controls the AI behavior for the Shadowthrall Mouth entity, managing transitions between combat, idle, and stealth states using a behavior tree.
tags: [ai, brain, stealth, combat, boss]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: b0c61457
---

# Shadowthrall Mouth Brain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `ShadowThrallMouthBrain` component implements the behavior tree for the Shadowthrall Mouth entity. It orchestrates transitions between active combat (`ChaseAndAttack`), idle wandering, and stealth modes based on state conditions and timing. The brain uses a priority-based behavior tree to evaluate and execute the highest-priority applicable behavior. Key functionality includes initiating stealth on the entity during combat or after idle periods, and reverting to normal movement/engagement once stealth ends.

The brain interacts with the `Combat` and `KnownLocations` components to check for targets and retrieve the home location, respectively.

## Usage example
Add the brain component to an entity instance and ensure required dependencies are present:

```lua
inst:AddComponent("brain")
inst.components.brain:SetBrain("shadowthrall_mouth_brain")

-- Ensure supporting components are attached
inst:AddComponent("combat")
inst:AddComponent("knownlocations")
inst.components.knownlocations:SetLocation("spawnpoint", inst:GetPosition())
```

## Dependencies & tags
**Components used:** `Combat` (via `inst.components.combat`), `KnownLocations` (via `inst.components.knownlocations`)
**Tags:** None identified.

## Properties
No public instance properties are declared in the constructor or directly assigned to `self`.

## Main functions

### `OnStart()`
* **Description:** Initializes the behavior tree for the Shadowthrall Mouth. Constructs a priority node hierarchy that evaluates conditions in order: combat stealth entry, active combat, idle stealth entry, and default wandering. The behavior tree root is assigned to `self.bt`.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** Relies on `Combat:HasTarget()` and timing checks; behavior selection may fail silently if dependencies (e.g., `Combat`, `KnownLocations`) are missing.

## Events & listeners
**Listens to:** None.
**Pushes:**  
- `"enterstealth"` — Emitted when the entity is transitioning into stealth mode, either after sustained combat or an idle delay.
  
> Note: Stealth exit behavior is handled externally (e.g., via the `Stealth` component), not within this brain’s event logic.
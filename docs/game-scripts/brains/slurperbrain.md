---
id: slurperbrain
title: Slurperbrain
description: Provides AI behavior for the Slurper character by managing behavior tree execution, including panic responses, combat, and homing to a known location.
tags: [ai, brain, combat, panic]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: eb0fb24e
---

# Slurperbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `SlurperBrain` component implements AI behavior for the Slurper entity by constructing and running a behavior tree (`BT`). It inherits from the base `Brain` class and sets up a priority-based behavior tree during `OnStart`. The tree prioritizes panic responses (electric fence and general), followed by combat (`ChaseAndAttack`), and finally wandering back to a "home" location obtained via the `KnownLocations` component. This component is responsible solely for decision-making logic and does not manage entity state or rendering.

## Usage example

```lua
-- Add the component to an entity instance
inst:AddComponent("slurperbrain")

-- The brain is automatically initialized when the entity enters the world
-- via the SGworld stategraph or other triggers that invoke OnStart()
```

## Dependencies & tags

**Components used:** `knownlocations` (accessed via `inst.components.knownlocations:GetLocation("home")`).  
**Tags:** None identified.

## Properties

No public properties are defined in the constructor. The class inherits from `Brain`, which manages internal behavior tree state (`self.bt`).

## Main functions

### `SlurperBrain:OnStart()`
* **Description:** Initializes the behavior tree by constructing a priority node with ordered sub-tasks: `PanicTrigger`, `ElectricFencePanicTrigger`, `ChaseAndAttack`, and `Wander`. This function is called automatically when the entity's state graph enters the `OnStart` transition.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None. Will fail if `inst.components.knownlocations` is missing, causing a runtime error when accessing `GetLocation`.

## Events & listeners

None. This component does not register or fire any events directly.

---
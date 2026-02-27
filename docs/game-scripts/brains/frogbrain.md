---
id: frogbrain
title: Frogbrain
description: The brain component for frog entities, implementing behavior logic including panic responses, home returning, wandering, and combat targeting.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: f5d60b0b
---

# Frogbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `FrogBrain` component implements the AI decision-making logic for frog entities in Don't Starve Together. It uses a Behavior Tree (BT) to prioritize actions such as fleeing from danger (`PanicTrigger`, `ElectricFencePanicTrigger`), returning home during night or winter, wandering during the day, and engaging in combat with nearby targets. It relies on the `homeseeker` and `knownlocations` components to navigate and locate the frog's home position.

## Dependencies & Tags
- **Components used:**
  - `homeseeker`: Reads `inst.components.homeseeker.home` to determine where the frog should return.
  - `knownlocations`: Reads `inst.components.knownlocations:GetLocation("home")` to retrieve the known home location.
- **Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `self.inst` | `Entity` | — | The entity instance this brain component is attached to. |
| `self.bt` | `BT` | `nil` | The behavior tree instance constructed during `OnStart()`. Initialized only when the brain is started. |

## Main Functions
### `GoHomeAction(inst)`
* **Description:** Constructs a buffered action to guide the frog back to its home location if one exists and is valid. Used by the `DoAction` behavior node when the frog needs to return home.
* **Parameters:**  
  - `inst` (`Entity`): The frog entity requesting a home action.
* **Returns:**  
  - `BufferedAction` if home exists and is valid, otherwise `nil`.

### `ShouldGoHome(inst)`
* **Description:** Determines whether the frog should attempt to return home. The condition is true when it is currently night (`TheWorld.state.isnight`) or winter (`TheWorld.state.iswinter`). Note: The condition checks for `not TheWorld.state.isday` to cover both night and winter.
* **Parameters:**  
  - `inst` (`Entity`): The frog entity.
* **Returns:**  
  - `boolean`: `true` if it is night or winter; `false` otherwise.

### `FrogBrain:OnStart()`
* **Description:** Initializes the behavior tree root node and assigns it to `self.bt`. This method is called automatically when the brain becomes active. The behavior tree evaluates nodes in priority order, selecting the first applicable behavior.
* **Parameters:**  
  - None.
* **Returns:**  
  - None.

## Events & Listeners
The `FrogBrain` component does not directly register or fire any events via `inst:ListenForEvent` or `inst:PushEvent`. Event-driven logic is handled indirectly through the behavior nodes (e.g., `ChaseAndAttack`, `Wander`) which may respond to state changes internally.
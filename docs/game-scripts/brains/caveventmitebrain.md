---
id: caveventmitebrain
title: Caveventmitebrain
description: Controls the decision-making behavior of cave vent mites, including fleeing, combat, shield usage, foraging, and wandering.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 9acb7e05
---

# CaveventMiteBrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

`caveventmitebrain` is a Brain component responsible for the behavior tree logic of the Cave Vent Mite. It orchestrates high-level decision-making through a prioritized sequence of Behaviors: fleeing from threats (including panic triggers and electric fences), using a damage-triggered shield in combat, chasing and attacking targets, foraging for edible items, and wandering within a defined radius. It integrates several core components (`combat`, `eater`, `knownlocations`, `timer`) to support autonomous, context-sensitive behavior.

## Dependencies & Tags
- **Components used:**
  - `combat`: Used via `inst.components.combat:HasTarget()`.
  - `eater`: Used via `inst.components.eater:CanEat()` and `inst.components.eater:GetEdibleTags()`.
  - `knownlocations`: Used via `inst.components.knownlocations:GetLocation("home")` and `inst.components.knownlocations:RememberLocation("home", pos)`.
  - `timer`: Used via `inst.components.timer:TimerExists("shield_cooldown")`.
- **Tags:** None added or removed by this component.

## Properties
None identified. The component relies on locally defined constants and behavior functions, and does not declare custom properties in its constructor.

## Main Functions

### `CaveVentMiteBrain:OnStart()`
* **Description:** Initializes and sets up the behavior tree root node. It constructs a priority-based sequence of Behaviors, assigning higher priority to escape-related behaviors (panic, electric fence), followed by shield usage, combat, foraging, and wandering.
* **Parameters:** None.
* **Returns:** None.

### `CaveVentMiteBrain:OnInitializationComplete()`
* **Description:** Records the entity's current position as its "home" location using `knownlocations`. This anchor point is used by the `Wander` behavior to constrain movement range.
* **Parameters:** None.
* **Returns:** None.

## Events & Listeners
None. This component does not register or fire any custom events. It relies entirely on the Behavior Tree system and built-in Behavior hooks (`OnStart`, `OnInitializationComplete`) for execution control.
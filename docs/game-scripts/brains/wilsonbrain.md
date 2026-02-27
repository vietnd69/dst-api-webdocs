---
id: wilsonbrain
title: Wilsonbrain
description: AI brain component that defines Wilson's default behavior tree for combat and movement, prioritizing player-held primary input while enabling fallback automated attacks.
tags: [ai, combat, player]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: d85ce47d
---

# Wilsonbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
Wilsonbrain is a brain component that implements Wilson's default behavior tree logic for combat and movement. It inherits from the base `Brain` class and defines a priority-based behavior tree where the primary action is to hold and maintain an attack target while the player holds the primary mouse button. If no such input is present (or the player controller is absent), it falls back to a standard chase-and-attack sequence. This component is responsible for orchestrating Wilson's autonomous combat behavior when no higher-priority AI task is active.

The behavior tree leverages the `ChaseAndAttack` behavior and uses `PlayerController:IsControlPressed` to detect whether the player is actively engaging in combat via the primary control.

## Usage example
```lua
local inst = World.EntityPool:GetNewEntity("wilson")
inst:AddComponent("brain")
inst.components.brain:SetBrainClass("WilsonBrain")
```

## Dependencies & tags
**Components used:**
- `playercontroller` — used to query control state via `IsControlPressed(CONTROL_PRIMARY)`.

**Tags:** None identified.

## Properties
No public properties are initialized in the constructor beyond those inherited from `Brain`.

## Main functions
### `WilsonBrain:OnStart()`
* **Description:** Initializes and assigns the root behavior tree node for Wilson. The tree prioritizes the player-held primary control state: if the player is holding the primary button, the `ChaseAndAttack` behavior is continuously re-evaluated; otherwise, it falls back to a single `ChaseAndAttack` invocation with no time limit.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None — assumes `ChaseAndAttack` and `BT` classes are properly loaded and the `inst` has a valid `components.playercontroller`.

## Events & listeners
None — this component does not register or fire any events directly.
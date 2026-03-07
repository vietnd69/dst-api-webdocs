---
id: shadowthrall_centipede_controller_brain
title: Shadowthrall Centipede Controller Brain
description: Manages control succession between centipede head segments based on control priority and randomized switching logic.
tags: [ai, combat, boss, controller, locomotion]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: eafca141
system_scope: brain
---

# Shadowthrall Centipede Controller Brain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ShadowThrallCentipedeControllerBrain` is a specialized brain component that coordinates control transitions between multiple head segments of a centipede entity (e.g., the Shadow Thrall boss). It continuously evaluates which head has the highest control priority and transfers control accordingly. When two heads share equal priority, it may randomly switch control to introduce variety. It relies on the `centipedebody` component to manage head state and trigger handoffs via `GiveControlToHead` and `GiveControlToOtherHead`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("centipedebody")
inst:AddBrain("shadowthrall_centipede_controller_brain")
--_heads must be added to the centipedebody component first_
-- Control automatically shifts as heads' control_priority values change
```

## Dependencies & tags
**Components used:** `centipedebody`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `switch_chance_index` | number | `1` | Index into `SWITCH_CHANCES`; increases when head priorities are equal, enabling random switches. |

## Main functions
### `IncreaseSwitchChance()`
* **Description:** Increments `switch_chance_index` up to the maximum index of `SWITCH_CHANCES`, raising the probability of a random control switch during the next evaluation.
* **Parameters:** None.
* **Returns:** Nothing.

### `ResetSwitchChance()`
* **Description:** Resets `switch_chance_index` to `1`, lowering the probability of a random switch back to baseline.
* **Parameters:** None.
* **Returns:** Nothing.

### `RollSwitchChance()`
* **Description:** Attempts to switch control to the *other* head if a random roll succeeds based on the current `SWITCH_CHANCES` probability. Resets `switch_chance_index` afterward if a switch occurs.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** If no alternate head exists (`#centipedebody.heads <= 1`), no switch occurs.

### `OnStart()`
* **Description:** Initializes the behavior tree (`bt`) to periodically evaluate which head should be in control. It prioritizes the head with the highest `control_priority`, and falls back to probabilistic switching if priorities are equal.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.

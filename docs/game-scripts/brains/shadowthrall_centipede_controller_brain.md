---
id: shadowthrall_centipede_controller_brain
title: Shadowthrall Centipede Controller Brain
description: Manages head rotation and control precedence among centipede segments based on control priority and probabilistic switching.
tags: [ai, combat, boss, centipede, control]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: entity
source_hash: eafca141
---

# Shadowthrall Centipede Controller Brain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This brain component acts as a controller for multi-headed centipede entities (e.g., Shadow Thrall centipedes), determining which head holds active control and switching control when appropriate. It evaluates all head segments for their `control_priority`, selects the highest-priority head, and delegates control via `CentipedeBody:GiveControlToHead()`. If multiple heads share equal priority, it uses a progressive probabilistic mechanism (`SWITCH_CHANCES`) to introduce variety in head rotation. The brain integrates with the Behavior Tree system and the `CentipedeBody` component, ensuring dynamic and responsive control transitions.

## Usage example
This brain is typically assigned internally to centipede entities via the game's entity definitions. A modder would not usually add it manually, but an example of its integration is shown below:

```lua
local centipede = Entity("centipede")
centipede:AddComponent("centipedebody")
centipede:AddBrain("brains/shadowthrall_centipede_controller_brain")
```

Once attached, the brain automatically manages control transitions between heads based on priority and internal logic. Modders may interact indirectly by setting `head.control_priority` on head entities.

## Dependencies & tags
**Components used:** `centipedebody` — accessed via `self.inst.components.centipedebody`, calling `GiveControlToHead()` and `GiveControlToOtherHead()`.

**Tags:** None identified (does not manipulate entity tags directly).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `switch_chance_index` | `number` | `1` | Index into `SWITCH_CHANCES` array; tracks current probability of head rotation when priorities are equal. Incremented on equal-priority detection, reset after a switch or priority change. |

## Main functions
### `IncreaseSwitchChance()`
* **Description:** Increments `switch_chance_index`, moving to a higher entry in `SWITCH_CHANCES` (i.e., increasing the probability of a future head rotation). capped at the array's maximum index.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None; safely caps at `#SWITCH_CHANCES`.

### `ResetSwitchChance()`
* **Description:** Resets `switch_chance_index` to `1`, the baseline low-probability state (0% chance of switching on next check).
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `RollSwitchChance()`
* **Description:** Evaluates whether a head switch should occur based on `SWITCH_CHANCES[self.switch_chance_index]`. If the random roll succeeds, triggers `ResetSwitchChance()` and calls `GiveControlToOtherHead()`.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** No-op if `SWITCH_CHANCES` index is out of bounds (though constructor ensures it is initialized to `1`, and `IncreaseSwitchChance` enforces bounds).

### `OnStart()`
* **Description:** Constructs and sets the behavior tree root node. Evaluates which head should be in control by scanning all heads for highest `control_priority`. If a higher-priority head is found, grants it control. If two heads share equal priority (the first and second heads), initiates probabilistic switching logic (`IncreaseSwitchChance()` + `RollSwitchChance()`). Behavior tree re-runs every `UPDATE_RATE = 3` seconds.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** Assumes `centipedebody.heads` has at least one entry; if fewer than two heads exist, equal-priority logic is skipped.

## Events & listeners
This brain does not register or dispatch any events via `inst:ListenForEvent()` or `inst:PushEvent()`.

---
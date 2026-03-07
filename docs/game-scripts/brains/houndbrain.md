---
id: houndbrain
title: Houndbrain
description: Implements the behavior tree for hound entities, governing movement, combat, and social behaviors based on hound type, leadership, and environmental state.
tags: [ai, combat, locomotion, social]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 2d2fda3c
system_scope: brain
---

# Houndbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`HoundBrain` is a brain component responsible for orchestrating hound AI behavior through a behavior tree. It handles core tasks such as following or hunting players, eating corpse food (non-mutated hounds), attacking walls when leaderless, returning to home base, and entering/remaining in statue form for clay hounds or abandoned pets. The behavior differs significantly between `pet_hound`, `clay` hounds, and mutated (`lunar_aligned`) hounds, and it integrates with components like `combat`, `follower`, `homeseeker`, `eater`, and `burnable` to make context-aware decisions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("hound")
inst:AddComponent("brain")
inst.components.brain:SetBrain("houndbrain")
-- Behavior will activate automatically upon stategraph entry
```

## Dependencies & tags
**Components used:** `combat`, `follower`, `homeseeker`, `eater`, `burnable`  
**Tags:** Checks `pet_hound`, `clay`, `lunar_aligned`; uses `INLIMBO`, `outofreach`, `NOCLICK`, `fire`, `creaturecorpse`, `statue`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `carcass` | `Entity` or `nil` | `nil` | Stores the currently selected valid carcass entity for consumption. |
| `reanimatetime` | `number?`, `true`, or `nil` | `nil` | Internal timer used to delay and trigger reanimation for clay hounds or abandoned pets (value `true` indicates ready to reanimate). |

## Main functions
### `SelectCarcass()`
* **Description:** Finds and selects a valid non-mutating creature corpse within `SEE_DIST` (30 units) for consumption. Used for non-mutated hounds.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if a valid carcass is found and stored in `self.carcass`; `false` otherwise.

### `CheckCarcass()`
* **Description:** Validates that the currently stored `self.carcass` is still usable: not burning, still valid, tagged as `creaturecorpse`, and not mutating.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `self.carcass` passes all checks.

### `GetCarcassPos()`
* **Description:** Returns the world position of the validated carcass, or `nil` if the carcass is invalid or unready.
* **Parameters:** None.
* **Returns:** `Vector3?` — World position of the carcass if valid; otherwise `nil`.

### `OnStart()`
* **Description:** Initializes and assigns the root behavior tree node based on hound type (`clay` vs. standard vs. mutated). It constructs complex `PriorityNode`/`WhileNode`/`ChaseAndAttack`/`Leash`/`Wander` trees tailored to the hound's state and tags.
* **Parameters:** None.
* **Returns:** Nothing. Sets `self.bt` with the constructed `BT` instance.

## Events & listeners
- **Listens to:** None directly (behavior tree handles state transitions via nodes).
- **Pushes:** `becomestatue`, `reanimate`, `chomp` — conditionally triggered during statue transitions, reanimation, and carcass eating, respectively.

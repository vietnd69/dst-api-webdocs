---
id: dustmothbrain
title: Dustmothbrain
description: Controls the AI decision-making behavior of the DustMoth entity, handling panic responses, home seeking, food consumption, dustable object interaction, and navigation.
tags: [ai, locomotion, combat, inventory]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 53717b90
system_scope: brain
---

# Dustmothbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`DustMothBrain` is an AI brain component that implements behavior tree logic for the DustMoth entity. It manages threat avoidance, home maintenance (including den repair), food consumption, interaction with dustable objects, and passive wandering when no higher-priority tasks exist. The brain integrates with the `homeseeker`, `inventory`, `knownlocations`, and `workable` components to make autonomous decisions based on game state and entity relationships.

## Usage example
```lua
local inst = CreateEntity()
inst:AddBrain("dustmothbrain")
-- The brain is initialized automatically upon entity creation; no further setup required.
-- It responds to events like PanicTrigger, inventory changes, and position updates.
```

## Dependencies & tags
**Components used:** `homeseeker`, `inventory`, `knownlocations`, `workable`  
**Tags:** Checks `scarytoprey`, `INLIMBO`, `player`, `NOCLICK`, `dustmothfood`, `dustable`, `outofreach`; adds none internally.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst._charged` | boolean | `false` | Indicates whether the DustMoth is fully charged (affects action eligibility). |
| `inst._find_dustables` | boolean | `true` | Controls whether DustOffAction is active. |
| `inst._last_played_search_anim_time` | number | `0` | Tracks the last time the search animation was played (seconds since game start). |
| `inst._time_spent_stuck` | number | `0` | Accumulates time spent with a buffered action pending. |
| `inst._force_unstuck_wander` | boolean | `false` | Flag that triggers temporary wandering to break out of stuck states. |
| `inst.bt` | BT | `nil` | The behavior tree instance (set during `OnStart`). |
| `inst._force_unstuck_wander` | boolean | `nil` | Temporarily set to true during unstuck maneuver; cleared after timeout. |

## Main functions
### `DustMothBrain:OnStart()`
*   **Description:** Initializes the behavior tree root with prioritized nodes for panic, wandering, repair, eating, dusting, and navigation.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None identified; expects all required components (`homeseeker`, `inventory`, `knownlocations`) to be present.

### `AttemptPlaySearchAnim(inst, target)`
*   **Description:** Conditionally triggers the "dustmothsearch" event to play the search animation, based on cooldown and random chance. Also orients the entity toward the target.
*   **Parameters:** 
    * `inst` (Entity) - The DustMoth instance.
    * `target` (Entity or `nil`) - The target to face when playing the animation.
*   **Returns:** Nothing.
*   **Error states:** Returns early if cooldown has not elapsed or random chance fails; safely handles invalid/`nil` targets.

### `RepairDenAction(inst)`
*   **Description:** Attempts to generate a buffered repair action toward the DustMoth's den if the den is broken and the entity is not currently busy or charged.
*   **Parameters:** 
    * `inst` (Entity) - The DustMoth instance.
*   **Returns:** `BufferedAction` or `nil`.
*   **Error states:** Returns `nil` if the entity is busy, uncharged, lacks a valid den, or the den is already intact.

### `EatFoodAction(inst)`
*   **Description:** Attempts to find and consume food (items with the `dustmothfood` tag) within range. Plays the search animation and attempts to generate an `EAT` buffered action.
*   **Parameters:** 
    * `inst` (Entity) - The DustMoth instance.
*   **Returns:** `BufferedAction` or `nil`.
*   **Error states:** Returns `nil` if the entity is busy, charged, or no valid food is found. Skips search animation if item already in inventory slot 1.

### `DustOffAction(inst)`
*   **Description:** Attempts to find and "dust" (interact with) dustable objects within range using a `PET` buffered action. Plays the search animation before attempting.
*   **Parameters:** 
    * `inst` (Entity) - The DustMoth instance.
*   **Returns:** `BufferedAction` or `nil`.
*   **Error states:** Returns `nil` if the entity is busy or `_find_dustables` is `false`. Fails if no valid dustable target found.

## Events & listeners
- **Listens to:** None — this brain does not register event listeners directly; behavior is driven by the behavior tree and internal state checks.
- **Pushes:** 
  - `dustmothsearch` - Fired when the search animation is triggered.
  - Internal behavior tree events (via `BufferedAction`) for `REPAIR`, `EAT`, and `PET` actions.

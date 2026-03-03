---
id: catcoonbrain
title: Catcoonbrain
description: Implements the decision-making AI for the Catcoon entity, coordinating movement, play, loyalty, and home-returning behaviors.
tags: [ai, entity, locomotion, inventory]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 244fc721
system_scope: brain
---

# Catcoonbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`CatcoonBrain` defines the behavior tree for the Catcoon entity, determining how it interacts with its environment, follows a leader, plays with toys, deposits items, and returns home. It integrates with components like `follower`, `homeseeker`, `inventory`, and `burnable` to make context-aware decisions. The brain prioritizes urgent actions (panic, hairball) before routine behaviors (wandering, playing), and adapts based on loyalty, inventory state, and weather conditions.

## Usage example
```lua
-- The CatcoonBrain component is automatically added to the Catcoon prefab during instantiation.
-- Example of checking brain state and behavior triggers from another script:
if some_catcoon:HasTag("catcoon") and some_catcoon.brain ~= nil then
    local has_leader = some_catcoon.components.follower and some_catcoon.components.follower:GetLeader() ~= nil
    local inventory_full = some_catcoon.components.inventory and some_catcoon.components.inventory:IsFull()
end
```

## Dependencies & tags
**Components used:** `burnable`, `follower`, `homeseeker`, `inventory`  
**Tags:** Checks `busy` state tags on stategraph; uses `NO_TAGS` and `PLAY_TAGS` sets during entity search.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `bt` | `BT` | `nil` (set in `OnStart`) | The behavior tree instance for the Catcoon. |
| `raining` | boolean | `false` (set via `ScheduleRaining`) | Indicates whether it is currently raining (triggers home-return). |

## Main functions
### `OnStart()`
* **Description:** Initializes and assigns the Catcoon's behavior tree root node. This method is called automatically when the brain starts running.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None identified. Behavior tree construction depends on Tuning values; invalid Tuning may cause unexpected behavior.

## Events & listeners
* **Listens to:** None explicitly registered (relies on stategraph state tags like `"busy"`, `"landing"`, `"landed"` and external event-driven scheduling like `inst:ScheduleRaining()` for updates).
* **Pushes:** None identified (does not fire custom events).

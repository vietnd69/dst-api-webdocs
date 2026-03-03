---
id: perdbrain
title: Perdbrain
description: Controls the behavior tree for the Perd character, managing movement, foraging, shrine interaction, and threat response.
tags: [ai, brain, npc, foraging, shrine]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 5c51ba59
system_scope: brain
---

# Perdbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`PerdBrain` implements the AI decision-making logic for the Perd character in DST. It uses a behavior tree (BT) to orchestrate high-priority threat responses, home-related actions (e.g., returning to a bush), shrine-seeking behavior during special events, food consumption, berry-picking, and routine wandering. This component depends on several other components and behavior modules (`wander`, `runaway`, `leash`, `standstill`, `doaction`) to execute its decisions.

## Usage example
```lua
local inst = CreateEntity()
-- ... setup entity (add tags, components, etc.) ...
inst:AddBrain("perdbrain")
-- The brain is initialized automatically when added; no further setup required.
```

## Dependencies & tags
**Components used:** `burnable`, `eater`, `homeseeker`, `inventory`, `inventoryitem`, `pickable`  
**Tags:** Checks `edible_veggie`, `INLIMBO`, `outofreach`, `scarytoprey`, `pickable`, `perdshrine`, `burnt`, `fire`. Adds or removes `seekshrine` tag (not visible in this file—controlled externally).  
**Behavior modules used:** `wander`, `leash`, `standstill`, `runaway`, `doaction`

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Constructs and assigns the main behavior tree for the Perd entity. It evaluates multiple priority levels, starting with panic triggers and night-time homing, then shrine-seeking (if enabled), followed by safe eating, fleeing, berry picking, and finally default wandering toward home (a bush).
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Assumes `self.inst` is a valid entity with required components (`inventory`, `eater`, `homeseeker`, etc.) and behavior modules loaded. Failure to meet these assumptions may result in no-op actions or nil behavior tree roots.

## Events & listeners
None identified. This component manages its logic internally via the behavior tree and does not register event listeners directly.

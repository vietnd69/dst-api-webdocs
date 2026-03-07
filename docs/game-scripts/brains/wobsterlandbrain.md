---
id: wobsterlandbrain
title: Wobsterlandbrain
description: Controls the movement and ocean-escape behavior of the Wobster entity, prioritizing hopping into the ocean when near water while wandering otherwise.
tags: [ai, brain, locomotion]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: ba9072f4
system_scope: brain
---

# Wobsterlandbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Wobsterlandbrain` is a behavior tree-based AI component for the Wobster entity. It implements a state machine that prioritizes escaping to the ocean when land-based. When not in a jump state, the entity will first attempt to locate a valid point on the ocean surface near its current orientation to hop into; if successful, it moves toward that point via leash behavior. If no hop point is found or the ocean is already accessible, it falls back to standard wandering. The brain leverages the `wander` behavior and several utility functions to compute ocean-adjacent positions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddBrain("wobsterlandbrain")
-- The brain activates automatically on entity spawn via `OnStart()`
```

## Dependencies & tags
**Components used:** `transform`, `physics`, `sg` (stategraph)
**Tags:** Checks `jumping` state tag; no tags added or removed.

## Properties
No public properties

## Main functions
### `OnStart()`
* **Description:** Initializes and starts the behavior tree for the Wobster. Sets up a priority-based behavior hierarchy: if not jumping, attempts to find and hop into the ocean (via hop-point detection and leash), otherwise wanders.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None — always initializes and starts the behavior tree.

## Events & listeners
- **Listens to:** None
- **Pushes:** `onhop` — fired with `{hop_pos = <Vector3>}` when the entity commits to hopping into the ocean.

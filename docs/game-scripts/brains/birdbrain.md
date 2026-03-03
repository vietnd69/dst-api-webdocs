---
id: birdbrain
title: Birdbrain
description: Controls flight behavior and panic-triggered flee responses for bird-type entities.
tags: [ai, flight, escape, brain]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 7953d39d
system_scope: brain
---

# Birdbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BirdBrain` is a behavior tree–based AI brain component that governs how bird-like entities respond to threats. It primarily determines when the entity should initiate a "fly away" action, such as fleeing from nightfall, lunar hail, fire damage, or the presence of nearby threats (e.g., players, monsters). It relies on the `hauntable`, `health`, and `burnable` components to detect specific danger states.

The brain is used by prefabs like `bird`, `parrot`, and similar flyers, ensuring they flee automatically when appropriate conditions are met.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("birdbrain")
-- No further manual setup required; the brain automatically activates on stategraph start
-- via OnStart() when the entity enters a flight-capable state.
```

## Dependencies & tags
**Components used:** `hauntable`, `health`, `burnable`, `stategraph`  
**Tags:** Uses `SHOULDFLYAWAY_MUST_TAGS = { "notarget", "INLIMBO" }` and `SHOULDFLYAWAY_CANT_TAGS = { "player", "monster", "scarytoprey" }` internally for `FindEntity` filtering.

## Properties
No public properties.

## Main functions
### `OnStart()`
*   **Description:** Initializes the behavior tree for the bird entity. Constructs a priority-based node tree that evaluates panic (from hauntable), flight conditions (via `ShouldFlyAway`), and named events (`threatnear`, `gohome`) to trigger the `fly_away` callback.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Notes:** Stores the resulting behavior tree in `self.bt`. The function captures `self.inst` via closure in `fly_away_fn`, ensuring the correct entity is acted upon.

## Events & listeners
- **Listens to:** `threatnear`, `gohome`, and internal behavior tree events (handled via `EventNode`).
- **Pushes:** `flyaway` (via `FlyAway`) whenever the entity decides to flee.

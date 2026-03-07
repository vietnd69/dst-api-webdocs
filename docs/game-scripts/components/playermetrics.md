---
id: playermetrics
title: Playermetrics
description: Tracks player-related gameplay events and forwards them to the metrics system for analytics.
tags: [network, analytics, player]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: d4acf377
system_scope: network
---

# Playermetrics

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`PlayerMetrics` is a lightweight component responsible for capturing specific in-game events related to player activity—specifically, when a player unlocks and prototypes a new recipe. It listens for the `unlockrecipe` event and forwards structured data to the `Stats` module via a helper function, ensuring telemetry is properly gathered and reported on the networked server instance.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("playermetrics")
-- The component automatically listens for "unlockrecipe" events.
-- No manual calls required; event-driven operation handles metrics reporting.
```

## Dependencies & tags
**Components used:** `stats` (via `Stats.PushMetricsEvent`)
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Cleans up the event listener when the component is removed from its entity.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `unlockrecipe` — triggered when a player successfully unlocks and prototypes a new recipe.
- **Pushes:** Delegates event to `Stats.PushMetricsEvent` with ID `"character.prototyped"`, the player entity, and a table containing `{ prefab = data.recipe }`.

The component does not directly fire its own events; it serves as a bridge between game logic and the analytics system.

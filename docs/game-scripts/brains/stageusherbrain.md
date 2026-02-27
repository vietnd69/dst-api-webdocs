---
id: stageusherbrain
title: Stageusherbrain
description: Manages the behavior tree logic for the Stage Usher boss entity, coordinating movement, combat engagement, and return-to-spawn behavior.
tags: [ai, boss, combat, movement]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: a5739ab3
---

# Stageusherbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This brain component implements the decision-making logic for the Stage Usher boss entity. It uses a Behavior Tree (BT) architecture to orchestrate movement, combat, and idle states. On initialization, it records the entity's starting position as its "spawnpoint" location. During operation, it prioritizes combat engagement when a target is present, and otherwise attempts to return to its spawnpoint before reverting to wandering. The component integrates with `Combat` for target management and `KnownLocations` for positional memory.

## Usage example

This component is automatically attached and managed internally by the game's entity system. Typically, it is instantiated when the Stage Usher prefab is spawned, and no manual interaction is required. However, a modder might reference its behavior tree root to extend or override behavior logic:

```lua
inst:AddComponent("stageusherbrain")
-- The brain is initialized automatically via inst:StartBrain()
-- Custom behavior can be injected by extending or patching the BT nodes
```

## Dependencies & tags
**Components used:**
- `combat` (accessed via `inst.components.combat`)
- `knownlocations` (accessed via `inst.components.knownlocations`)

**Tags:** None explicitly added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `PRIORITY_NODE_RATE` | number | `1.0` | Update interval (in seconds) for priority node evaluation. |
| `MAX_CHASE_DIST` | number | `3 * TUNING.STAGEUSHER_ATTACK_RANGE` | Maximum distance to pursue a target before breaking off. |
| `RETURN_TO_SPAWN_TIMEOUT` | number | `15` | Timeout (in seconds) to wait before forcing entity to sit down if it fails to reach spawnpoint. |

## Main functions

### `StageUsherBrain:OnInitializationComplete()`
* **Description:** Records the entity's current position as `"spawnpoint"` in its `knownlocations` component upon initialization.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** May print and error if `knownlocations:RememberLocation` receives invalid coordinates (handled by `KnownLocations`).

### `StageUsherBrain:OnStart()`
* **Description:** Constructs and assigns the main behavior tree (`self.bt`) using a hierarchy of priority-based nodes. Defines how the entity behaves in combat, idle, and return-to-spawn scenarios.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** May fail silently if required dependencies (`combat`, `knownlocations`) are missing or uninitialized.

### `WalkHomeAction(inst)`
* **Description:** A helper function that constructs a buffered walk-to-action targeting the recorded `"spawnpoint"`. If successful, it fires the `"sitdown"` event on the entity.
* **Parameters:**
  - `inst`: Entity instance (must have `knownlocations` and `actions` components).
* **Returns:** `BufferedAction` or `nil` if spawnpoint is unavailable or entity is busy.
* **Error states:** Returns `nil` if `inst.components.knownlocations` is missing or `"spawnpoint"` has not been recorded.

## Events & listeners
- **Listens to:** None (no explicit `inst:ListenForEvent` calls in this component).
- **Pushes:** `"giveuptarget"` (via `combat:GiveUp()`), `"sitdown"` (via `WalkHomeAction` success callback and `OnStart` sequence).
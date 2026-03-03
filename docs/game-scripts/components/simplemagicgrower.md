---
id: simplemagicgrower
title: Simplemagicgrower
description: Triggers incremental growth stages on an entity using repeated automatic calls to Growable:DoGrowth until a target stage is reached.
tags: [growth, magic, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: ca6b684b
system_scope: entity
---

# Simplemagicgrower

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`SimpleMagicGrower` is a helper component that drives incremental magical growth for an entity by repeatedly invoking `Growable:DoGrowth()` until a specified target stage (`last_stage`) is reached. It leverages the `growable` component, performs recursive delayed calls to `Grow()` between stages, and automatically terminates growth when the target is reached—releasing the `magicgrowth` tag and calling `Growable:StartGrowing()` once more to resume normal growth scheduling.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("growable")
inst:AddComponent("simplemagicgrower")

inst.components.simplemagicgrower:SetLastStage(3)
inst.components.simplemagicgrower:StartGrowing()
```

## Dependencies & tags
**Components used:** `growable`
**Tags:** Adds `magicgrowth` when growth begins; removes `magicgrowth` when growth completes.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `last_stage` | number? | `nil` | The stage index (1-based) at which the sequential growth process stops. Must be set before calling `Grow()` or `StartGrowing()`. |

## Main functions
### `SetLastStage(last_stage)`
*   **Description:** Sets the target growth stage at which the sequential growth sequence will stop.
*   **Parameters:** `last_stage` (number) — the stage index (matching `self.stage` from `growable`) to halt sequential growth.
*   **Returns:** Nothing.

### `Grow()`
*   **Description:** Performs a single growth step via `Growable:DoGrowth()` and schedules the next step using a random-time delay (`math.random()` seconds) unless `last_stage` is reached.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early with no effect if `growable` component is missing or `last_stage` is `nil`.

### `StartGrowing()`
*   **Description:** Initializes the growth sequence by adding the `magicgrowth` tag and calling `Grow()` for the first time.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.

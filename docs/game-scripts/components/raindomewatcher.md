---
id: raindomewatcher
title: Raindomewatcher
description: Tracks whether an entity is inside a rain dome and notifies the entity upon entering or exiting.
tags: [environment, weather, collision]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 75f16698
system_scope: environment
---

# Raindomewatcher

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`RainDomeWatcher` is a lightweight component that monitors an entity's position relative to active rain domes in the world. It periodically checks if the entity is inside one or more rain domes and emits events when the entity enters or exits such zones. It is designed for world- or weather-sensitive entities that need to react to rain dome coverage.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("raindomewatcher")
inst.components.raindomewatcher:IsUnderRainDome()  -- returns true/false
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `underdome` | boolean | `false` | Whether the entity is currently inside at least one rain dome. |

## Main functions
### `IsUnderRainDome()`
*   **Description:** Returns whether the entity is currently inside a rain dome.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if the entity is under a rain dome, `false` otherwise.

### `OnUpdate(dt)`
*   **Description:** Internal update callback, invoked each frame. Checks the entity's current world position for rain dome coverage and updates `underdome` state accordingly.
*   **Parameters:** `dt` (number) — Delta time since the last frame. Not used directly but passed by the framework.
*   **Returns:** Nothing.
*   **Error states:** None. The method is safe to call each frame.

## Events & listeners
- **Listens to:** None  
- **Pushes:**  
  - `enterraindome` — fired the first frame the entity enters a rain dome (i.e., when `underdome` transitions from `false` to `true`).  
  - `exitraindome` — fired the first frame the entity exits all rain domes (i.e., when `underdome` transitions from `true` to `false`).  
  - `underraindomes` — fired every frame while the entity remains inside rain domes; includes table `domes` (array of dome instances/records) in the event payload.

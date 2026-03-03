---
id: unevenground
title: Unevenground
description: Periodically notifies nearby players when they enter a zone affected by uneven ground, triggering related gameplay effects.
tags: [environment, terrain, networking, detection]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 264c1795
system_scope: environment
---

# Unevenground

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Unevenground` is an environment-aware component that detects when players are near a source of uneven terrain and notifies them via the `"unevengrounddetected"` event. It operates by running a periodic task that scans for nearby non-ghost players within a defined radius and pushes event data including the component's activation radius and scan period. This component is typically attached to environment objects (e.g., terrain features or custom structures) that impose movement or visibility penalties.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("unevenground")
inst.components.unevenground:SetEnabled(true)
inst.components.unevenground:SetRadius(4)
inst.components.unevenground:SetDetectRadius(12)
inst.components.unevenground:Start()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds no tags; checks only `playerghost` and `asleep` states via `inst:HasTag` and `inst:IsAsleep()`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enabled` | boolean | `true` | Whether the component is active and responsive to wake/sleep events. |
| `radius` | number | `3` | The inner radius of the uneven ground effect zone, passed to clients via events. |
| `detectradius` | number | `15` | Maximum distance (squared) at which players will be scanned and notified. |
| `detectperiod` | number | `0.6` | Time interval (in seconds) between each scan of nearby players. |
| `detecttask` | task reference or `nil` | `nil` | Reference to the active periodic task; `nil` when stopped. |

## Main functions
### `Start()`
* **Description:** Initiates the periodic detection task if not already running. Automatically called on component construction (unless the entity is asleep) and by `Enable()` / `OnEntityWake()`.
* **Parameters:** None.
* **Returns:** Nothing.

### `Stop()`
* **Description:** Cancels the active periodic task and clears the task reference. Called automatically when the entity goes to sleep, is removed, or via `Disable()`.
* **Parameters:** None.
* **Returns:** Nothing.

### `Enable()`
* **Description:** Enables the component and starts detection if the entity is awake.
* **Parameters:** None.
* **Returns:** Nothing.

### `Disable()`
* **Description:** Disables the component and stops detection.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnEntityWake()`
* **Description:** Lifecycle callback triggered when the entity wakes. Starts detection if the component is enabled.
* **Parameters:** None (method signature implies `self` only).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None  
- **Pushes:**  
  - `"unevengrounddetected"` — Pushed on each detection cycle for every nearby player. Data includes:  
    - `inst` (entity): the Unevenground instance owner  
    - `radius` (number): value of `self.radius`  
    - `period` (number): value of `self.detectperiod`  
  - The event is *not* pushed when players enter or leave the zone; it is a periodic notification only.

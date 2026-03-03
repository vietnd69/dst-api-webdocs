---
id: decay
title: Decay
description: Manages a consumable fuel meter that decays over time and triggers events when fuel is spent or added.
tags: [fuel, timer, inventory]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 0978132f
system_scope: entity
---

# Decay

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Decay` manages a simple fuel/health meter that can be incremented or decremented over time. It is designed for entities that consume a finite resource (e.g., lantern fuel, battery charge, or torch burning time). The component tracks current and maximum fuel levels, applies periodic changes via a threaded loop, and fires events when the fuel crosses thresholds (e.g., reaches zero or increases above max).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("decay")
inst.components.decay.maxhealth = 100
inst.components.decay.currenthealth = 100
inst.components.decay.decayrate = 1
inst.components.decay:SetTimeDelta(-1, 1.0)  -- lose 1 fuel per second
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `maxhealth` | number | `100` | The maximum fuel level the entity can hold. |
| `decayrate` | number | `1` | The rate at which the fuel meter decreases per tick in the decay loop (used for countdown termination logic). |
| `currenthealth` | number | `maxhealth` | The current fuel level. |

## Main functions
### `DoDelta(amount)`
*   **Description:** Adjusts the current fuel level by `amount`. Triggers `"spentfuel"` if fuel drops from positive to zero or below, and `"addfuel"` if fuel exceeds `maxhealth`.
*   **Parameters:** `amount` (number) — the change in fuel (can be negative for consumption, positive for refueling).
*   **Returns:** Nothing.
*   **Error states:** Clamps `currenthealth` to `0` and `maxhealth` — no negative or over-max values persist.

### `SetTimeDelta(amount, pause, num)`
*   **Description:** Starts or restarts a threaded loop that repeatedly calls `DoDelta(amount)` every `pause` seconds. The loop runs `num` times if `num` is provided, or indefinitely if `num` is `nil`.
*   **Parameters:**  
  - `amount` (number) — delta to apply each tick (e.g., `-1` for decay).  
  - `pause` (number) — delay in seconds between ticks (must be `> 0` to start the timer).  
  - `num` (number? optional) — number of ticks to execute. If omitted, runs until manually stopped or interrupted.
*   **Returns:** Nothing.
*   **Error states:**  
  - If a previous timer task (`deltatask`) is running, it is killed and replaced.  
  - If `pause <= 0`, no new thread is started.

## Events & listeners
- **Listens to:** None  
- **Pushes:**  
  - `"spentfuel"` — fired when `currenthealth` transitions from positive to zero or below.  
  - `"addfuel"` — fired when `currenthealth` exceeds `maxhealth`.

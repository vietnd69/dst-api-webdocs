---
id: platformhopdelay
title: Platformhopdelay
description: Manages a delay period measured in frame ticks before allowing a platform-hopping action (e.g., moving between floating platforms) to occur.
tags: [locomotion, platform, delay, physics]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: e8f51f0c
system_scope: locomotion
---
# Platformhopdelay

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`PlatformHopDelay` is a lightweight component that tracks a delay in frame ticks for platform-hopping actions—typically used for characters like Wigfrid or Warly when moving across floating platforms in the Ruins or Gorge. It stores the remaining delay duration (`delayticks`) and provides methods to configure and query it. The component does not enforce the delay itself but serves as a shared state source that other systems can reference (e.g., in state graphs or locomotion logic) to gate platform transitions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("platformhopdelay")

-- Set delay in seconds (converted to ticks internally)
inst.components.platformhopdelay:SetDelay(0.5)

-- Alternatively, set delay directly in ticks
inst.components.platformhopdelay:SetDelayTicks(4)

-- Query current delay
local ticks = inst.components.platformhopdelay:GetDelayTicks()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `delayticks` | number | `8` | Number of frame ticks remaining before the hop delay expires. `8` ticks ≈ 0.133 seconds at 60 FPS (`FRAMES = 0.0166667`). |

## Main functions
### `SetDelay(time)`
*   **Description:** Sets the delay duration in seconds, converting and rounding up to the nearest whole tick.
*   **Parameters:** `time` (number) — delay duration in seconds.
*   **Returns:** Nothing.

### `SetDelayTicks(ticks)`
*   **Description:** Sets the delay duration directly in frame ticks.
*   **Parameters:** `ticks` (number) — integer or float (converted to integer) delay in ticks.
*   **Returns:** Nothing.

### `GetDelayTicks()`
*   **Description:** Returns the current remaining delay in frame ticks.
*   **Parameters:** None.
*   **Returns:** number — current delay ticks.

## Events & listeners
None identified

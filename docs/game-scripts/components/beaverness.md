---
id: beaverness
title: Beaverness
description: Manages the beaver-related "beaverness" hunger subtype for entities, including starvation state, time-based decay, and network synchronization.
tags: [hunger, network, starvation]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: d0e0d976
system_scope: entity
---

# Beaverness

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Beaverness` implements a secondary hunger-like resource—distinct from the base `hunger` component—that tracks an entity’s beaver-specific sustenance. It supports time-based decay (via `StartTimeEffect`), starvation detection, and syncing to clients via the `player_classified` network replica. When beaverness reaches `0`, it triggers starving events and contributes to health damage via the `hunger` component.

This component is typically added to player characters (especially beaver-specific variants) and integrates with `hunger` and `health` to implement starvation mechanics.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("beaverness")
inst.components.beaverness:SetPercent(1.0)
inst.components.beaverness:StartTimeEffect(1.0, -5)  -- decay 5 units/sec
inst:ListenForEvent("startstarving", function() print("Beaver is starving!") end)
```

## Dependencies & tags
**Components used:** `health`, `hunger`, `player_classified`
**Tags:** Adds `beaverness` to the owning entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `current` | number | `100` | Current beaverness value (0 to `max`). |
| `max` | number | `100` | Maximum beaverness value. Read-only for networked players. |
| `time_effect_multiplier` | number | `1` | Scaling factor for beaverness decay/gain during time-based effects. |
| `task` | Task | `nil` | Internal periodic task for timed decay. |

## Main functions
### `IsStarving()`
*   **Description:** Checks whether beaverness is at or below zero.
*   **Parameters:** None.
*   **Returns:** `true` if `current <= 0`, otherwise `false`.

### `DoDelta(delta, overtime)`
*   **Description:** Adjusts beaverness by `delta`, clamps it within `[0, max]`, and fires state-change events.
*   **Parameters:**  
  `delta` (number) – amount to change beaverness (can be negative).  
  `overtime` (boolean) – indicates whether the change occurred over time (affects event metadata).
*   **Returns:** Nothing.
*   **Error states:** If `current` drops from positive to `<= 0`, fires `startstarving`; if `current` rises from `<= 0` to positive, fires `stopstarving`. Only triggers starving events if `hunger` is not already starving.

### `SetPercent(percent, overtime)`
*   **Description:** Sets `current` to a percentage of `max` and calls `DoDelta` to sync state.
*   **Parameters:**  
  `percent` (number) – desired fraction of max (e.g., `0.5` for 50%).  
  `overtime` (boolean) – passed to `DoDelta`.
*   **Returns:** Nothing.

### `StartTimeEffect(dt, delta_b)`
*   **Description:** Starts a periodic task that applies beaverness decay (`delta_b`) every `dt` seconds, scaled by `time_effect_multiplier`.
*   **Parameters:**  
  `dt` (number) – interval in seconds between decay ticks.  
  `delta_b` (number) – base delta applied per tick before scaling.
*   **Returns:** Nothing.
*   **Error states:** Cancels any existing periodic task before starting a new one.

### `StopTimeEffect()`
*   **Description:** Cancels the active periodic decay task.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetTimeEffectMultiplier(multiplier)`
*   **Description:** Sets the multiplier applied to beaverness changes during `StartTimeEffect`.
*   **Parameters:**  
  `multiplier` (number?) – scaling factor (e.g., `2.0` for double rate); if `nil`, defaults to `1`.
*   **Returns:** Nothing.

### `GetPercent()`
*   **Description:** Returns the current beaverness as a fraction of `max`.
*   **Parameters:** None.
*   **Returns:** number between `0` and `1`.

### `OnSave()`
*   **Description:** Returns serializable state for persistence.
*   **Parameters:** None.
*   **Returns:** Table `{ current = number }`.

### `OnLoad(data)`
*   **Description:** Restores beaverness state after loading.
*   **Parameters:**  
  `data` (table?) – saved state from `OnSave`.
*   **Returns:** Nothing.
*   **Error states:** Only applies changes if `data.current` is present and differs from `self.current`.

### `GetDebugString()`
*   **Description:** Returns a formatted debug string for UI or console output.
*   **Parameters:** None.
*   **Returns:** `"current / max"` with two decimal places (e.g., `"75.00 / 100.00"`).

## Events & listeners
- **Listens to:** None.
- **Pushes:**  
  `beavernessdelta` – when `current` changes; payload `{ oldpercent, newpercent, overtime }`.  
  `startstarving` – fired once when `current` crosses from >0 to `<= 0` (only if `hunger` is not already starving).  
  `stopstarving` – fired once when `current` crosses from `<= 0` to >0 (only if `hunger` was previously starving).

---
id: mightybadge
title: Mightybadge
description: Renders Wolfgang's Mightiness status bar with dynamic visual feedback based on current might level and rate of change.
tags: [ui, character, visual]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 87d0eb47
system_scope: ui
---

# Mightybadge

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`MightyBadge` is a specialized UI widget that visually represents Wolfgang's Mightiness status (normal, mighty, legend). It extends the base `Badge` class and adds dynamic behavior including animated arrow indicators showing rate of change (increase/decrease) and a segmented circular meter that updates based on current mightiness state. The component is typically instantiated for Wolfgang players to provide real-time feedback on his buffed state.

## Usage example
```lua
local MightyBadge = require "widgets/mightybadge"
local badge = MightyBadge(owner)
-- Automatically refreshes on update; no manual setup required
-- Typically created by the UI system when Wolfgang's character is active
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Checks `wolfgang_overbuff_2`, `wolfgang_overbuff_3`, `wolfgang_overbuff_4`, `wolfgang_overbuff_5` via `ThePlayer:HasTag()`; relies on `owner:GetCurrentMightinessState()` and `owner:GetMightinessRateScale()` methods.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `cur_mighty_state` | string or `nil` | `nil` | Tracks the last-processed mightiness state (`"normal"`, `"mighty"`, or `"legend"`). |
| `circleframe` | UIAnim | inherited | Frame element whose animation percentage indicates mightiness level. |
| `mightyarrow` | UIAnim | created | Arrow widget showing rate of change animation (`neutral`, `arrow_loop_increase*`, or `arrow_loop_decrease*`). |
| `RATE_SCALE_ANIM` | table | local constant | Maps `RATE_SCALE` enum values to animation names. |

## Main functions
### `RefreshMightiness()`
*   **Description:** Updates the `circleframe` animation percentage based on the owner's current mightiness state. Only triggers a change when the state has changed since the last update.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Uses `self.owner:GetCurrentMightinessState()` — ensures no crash if the method is missing (though not explicitly guarded).

### `OnUpdate(dt)`
*   **Description:** Called every frame to refresh mightiness state and update the rate-change arrow animation. Skips updates during server pause.
*   **Parameters:** `dt` (number) — delta time since last frame.
*   **Returns:** Nothing.
*   **Error states:** Safely checks for `self.owner.GetMightinessRateScale` existence before calling. Returns early if `TheNet:IsServerPaused()`.

### `SetPercent(val)`
*   **Description:** Updates the visual meter and number display based on `val`. Handles overbuff thresholds via Wolfgang-specific tags.
*   **Parameters:** `val` (number) — normalized meter value (0.0–1.0 range expected, but overbuff extends beyond 1.0).
*   **Returns:** Nothing.
*   **Error states:** Uses `ThePlayer` context (not `self.owner`) to check overbuff tags. Scales `val` differently when `val*100 > 100`, with max thresholds (`20`, `30`, `40`, `50`) depending on tag presence.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified  
(Events are managed by the parent `Badge` class or UI system; no direct event handling in `MightyBadge`.)
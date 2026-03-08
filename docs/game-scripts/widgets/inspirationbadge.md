---
id: inspirationbadge
title: Inspirationbadge
description: Manages the visual and client-side UI representation of Wathgrithr's Inspiration ability, including slot activation states and buff icon updates.
tags: [ui, character, wathgrithr, status]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 5e2c2930
system_scope: ui
---

# Inspirationbadge

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`InspirationBadge` is a UI widget component that renders Wathgrithr's Inspiration status panel. It extends `Badge` and manages two sets of animated slots (3 total): one for active Inspiration levels (depletion meter), and one for displayed buff icons. It handles client-side updates including animation transitions, sound feedback, and visual sync with server state, particularly to minimize perceived jitter during network lag.

## Usage example
```lua
-- Typically instantiated automatically by Wathgrithr's prefab.
-- For modder reference:
local badge = InspirationBadge(owner, "inspiration_colour")
badge:OnUpdateSlots(2)  -- Activate first 2 slots
badge:OnBuffChanged(1, "WATHGRITHR_INSPIRATION_BERSERK")  -- Show berserk buff in slot 1
badge:EnableClientPredictedDraining(true)  -- Start client-side meter countdown
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_clientpredicteddraining` | boolean | `false` | Whether client-side meter draining is currently active. |
| `slots` | table (array of UIAnim) | `{}` | Array of 3 UIAnim widgets representing the depletion meter slots. |
| `buffs` | table (array of UIAnim) | `{}` | Array of 3 UIAnim widgets representing active buff icons. |
| `num_active_slots` | number | `0` | Current number of active (lit) meter slots displayed. |
| `percent` | number | *undefined* | Current Inspiration meter percentage (used in `OnUpdate`). |

## Main functions
### `OnUpdateSlots(num)`
*   **Description:** Updates the number of active meter slots (0–3) to reflect current Inspiration level. Plays activation/deactivation animations and triggers sound effects.
*   **Parameters:** `num` (number) — the target number of active slots. Must be between `0` and `NUM_SLOTS` (inclusive).
*   **Returns:** Nothing.

### `OnBuffChanged(num, name)`
*   **Description:** Updates the buff icon in a given slot. If `name` is non-nil, sets the icon and plays an activation animation; if `name` is `nil`, plays deactivation and resets to `buff_off`.
*   **Parameters:**  
    - `num` (number) — the slot index (1–`NUM_SLOTS`).  
    - `name` (string?) — the animation/sprite name for the buff icon, or `nil` to clear.
*   **Returns:** Nothing.
*   **Error states:** No-op if `num` is out of bounds or `self.buffs[num]` is `nil`.

### `EnableClientPredictedDraining(enable)`
*   **Description:** Starts or stops the client-side meter countdown (used to reduce visual lag). Calls `StartUpdating`/`StopUpdating` accordingly.
*   **Parameters:** `enable` (boolean?) — whether to enable draining. Defaults to `false` if omitted.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Decrements the local `percent` over time using `TUNING.INSPIRATION_DRAIN_RATE`. Called only if `EnableClientPredictedDraining(true)` was previously set and the server is not paused.
*   **Parameters:** `dt` (number) — delta time in seconds since last frame.
*   **Returns:** Nothing.
*   **Error states:** Early exit if `TheNet:IsServerPaused()` is true.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified
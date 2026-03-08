---
id: wandaagebadge
title: Wandaagebadge
description: Renders and manages the visual age, health pulse indicators, and effigy status for Wanda's character in Don't Starve Together.
tags: [ui, player, character, health]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: f042b577
system_scope: ui
---

# Wandaagebadge

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`OldAgeBadge` is a UI widget that visually represents Wanda's aging state by displaying her current age in years, animating year/day hand indicators, and tracking health-based pulse effects and effigy presence. It extends the base `Badge` widget and integrates closely with Wanda-specific systems such as `player_classified` for aging simulation, `health` for status updates, and various sound and animation resources. It also supports visual feedback for acid sizzling effects,腐蚀 debuffs, and buff icons.

## Usage example
```lua
local OldAgeBadge = require "widgets/wandaagebadge"
local badge = CreateWidget("oldagebadge", owner) -- or add to an entity's widget hierarchy
badge:SetPercent(0.5, 100, 0) -- Set health age to mid-range
badge:ShowBuff("abigail") -- Show Abigail buff icon
badge:ShowEffigy("grave") -- Show gravestone effigy animation
```

## Dependencies & tags
**Components used:** `player_classified`, `health` (via `owner.replica.health`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `OVERRIDE_SYMBOL_BUILD` | table | `{}` | Modder-configurable mapping of symbol names to build names for buff icons. |
| `default_symbol_build` | string | `"status_abigail"` | Default build used when no override is set for a symbol. |
| `year_hand` | UIAnim | `nil` | Animated hand representing the year fraction of aging. |
| `days_hand` | UIAnim | `nil` | Animated hand representing the day progress within a year. |
| `effigyanim` | UIAnim | `nil` | Animation widget for standard (non-grave) effigy state. |
| `gravestoneeffigyanim` | UIAnim | `nil` | Animation widget for grave effigy state. |
| `bufficon` | UIAnim | `nil` | Animated icon for displaying active buffs (e.g., Abigail). |
| `corrosives` | table | `{}` | Tracks active corrosive debuffs on the owner. |
| `health_precent` | number | `1` | Current health percentage (normalized `0..1`). |
| `healthpenalty` | number | `0` | Health penalty percentage applied to effective health. |
| `buffsymbol` | number | `0` | Currently displayed buff symbol ID. |
| `effigy` | boolean | `false` | Whether an effigy is currently active. |
| `effigybreaksound` | string? | `nil` | Sound path used when effigy deactivates. |
| `acidsizzling` | UIAnim? | `nil` | Optional visual effect for acid sizzling. |

## Main functions
### `SetBuildForSymbol(build, symbol)`
*   **Description:** Allows modders to register a custom build (animation asset) for a given buff symbol.  
*   **Parameters:**  
    - `build` (string) — The animation build name (e.g., `"status_abigail"`).  
    - `symbol` (string or number) — The symbol identifier used in `ShowBuff`.  
*   **Returns:** Nothing.

### `ShowBuff(symbol)`
*   **Description:** Displays a buff icon animation based on the provided symbol. Handles activation, idle, and deactivation states.  
*   **Parameters:**  
    - `symbol` (number or string) — Symbol ID. `0` hides the buff.  
*   **Returns:** Nothing.  
*   **Error states:** Uses `OVERRIDE_SYMBOL_BUILD[symbol]` or falls back to `default_symbol_build`.

### `ShowEffigy(effigy_type)`
*   **Description:** Triggers effigy appearance animation for either `"grave"` or standard types.  
*   **Parameters:**  
    - `effigy_type` (string) — Either `"grave"` or any other string (treated as standard).  
*   **Returns:** Nothing.

### `HideEffigy(effigy_type)`
*   **Description:** Triggers effigy disappearance animation and schedules sound playback on animation completion.  
*   **Parameters:**  
    - `effigy_type` (string) — Either `"grave"` or any other string (treated as standard).  
*   **Returns:** Nothing.  
*   **Error states:** sound playback only occurs if the badge is visible and the effigy deactivate animation is active.

### `SetPercent(val, max, penaltypercent)`
*   **Description:** Updates the displayed age and year hand rotation based on the current health percentage (`val`). Also stores health penalty data.  
*   **Parameters:**  
    - `val` (number) — Health percentage (`0..1`).  
    - `max` (number) — Max health (unused for calculation but present for signature compatibility).  
    - `penaltypercent` (number) — Unused in current logic.  
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Client-side updater for day/year aging simulation. Compensates for paused state and predicts aging rate. Updates `days_hand` rotation.  
*   **Parameters:**  
    - `dt` (number) — Delta time in seconds.  
*   **Returns:** Nothing.  
*   **Error states:** Returns early if `TheNet:IsServerPaused()` is `true` or `owner.player_classified` is unavailable.

### `PulseGreen()`, `PulseRed()`, `PulseOff()`, `Pulse(color)`
*   **Description:** Manages health status pulse animations and sounds. `Pulse` dispatches to green or red based on `color`.  
*   **Parameters (Pulse(color)):**  
    - `color` (string) — `"green"` for health gain, otherwise `"red"`.  
*   **Returns (Pulse*):** Nothing.  
*   **Error states:** Sound volume for health-down pulses depends on oldager rate and age thresholds (`TUNING.WANDA_AGE_THRESHOLD_OLD`, `TUNING.WANDA_AGE_THRESHOLD_YOUNG`).

### `HealthDelta(data)`
*   **Description:** Handles health change events, updating age display, triggering pulses, and canceling pending pulse-off timers if needed.  
*   **Parameters:**  
    - `data` (table) — Must contain `newpercent` and `oldpercent` fields.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"startcorrosivedebuff"` — Adds debuff entry to `self.corrosives` and listens for `"onremove"` on the debuff instance.  
  - `"serverpauseddirty"` — Pauses/resumes `"pulse_loop"` sound based on server pause state.  
  - `"isacidsizzling"` — Creates or destroys `acidsizzling` animation based on acid sizzle state.  
  - `"animover"` (on `effigyanim` and `gravestoneeffigyanim`) — Calls `OnEffigyDeactivated` to hide effigy visuals on animation completion.  
- **Pushes:** None identified.
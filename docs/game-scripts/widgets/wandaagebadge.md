---
id: wandaagebadge
title: OldAgeBadge
description: UI widget that displays Wanda's age, health status, effigy indicators, and corrosive debuff states in the HUD.
tags: [ui, widget, wanda, hud]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: widgets
source_hash: 5f674637
system_scope: ui
---

# OldAgeBadge

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`OldAgeBadge` is a HUD widget that extends the `Badge` class to display Wanda-specific status information including her current age in years, health percentage, effigy activation states, and corrosive debuff indicators. It handles visual feedback for health changes through color pulsing animations and manages multiple UI animation children for different status displays. This widget is typically attached to Wanda's player HUD and updates in real-time based on classified component data and health events.

## Usage example
```lua
local WandaAgeBadge = require "widgets/wandaagebadge"
local player = ThePlayer

-- Create the badge widget attached to the player
local agebadge = WandaAgeBadge(player)
agebadge:SetPercent(0.75, 100, 0.1)
agebadge:ShowEffigy("normal")
agebadge:ShowBuff(1)

-- Update health display when health changes
agebadge:HealthDelta({ oldpercent = 0.8, newpercent = 0.75 })
```

## Dependencies & tags
**External dependencies:**
- `widgets/badge` -- parent class that provides base badge functionality
- `widgets/uianim` -- UI animation child widgets for visual elements

**Components used:**
- `player_classified` -- accessed via `owner.player_classified` for oldager year percent and rate data
- `replica.health` -- accessed via `owner.replica.health` for health penalty percent and max health values

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `OVERRIDE_SYMBOL_BUILD` | table | `{}` | Modders can add symbol-build pairs by calling `SetBuildForSymbol`. |
| `default_symbol_build` | string | `"status_abigail"` | Default build name for buff icon symbols. |
| `rate_time` | number | `0` | Tracking value for rate calculations. |
| `warning_precent` | number | `0.1` | Threshold percentage for warning states. |
| `health_precent` | number | `1` | Current health percentage value. |
| `year_hand` | UIAnim | `nil` | Animation child displaying year hand rotation. |
| `days_hand` | UIAnim | `nil` | Animation child displaying day hand rotation. |
| `effigyanim` | UIAnim | `nil` | Animation child for normal effigy status display. |
| `gravestoneeffigyanim` | UIAnim | `nil` | Animation child for grave effigy status display. |
| `effigy` | boolean | `false` | Whether an effigy is currently shown. |
| `effigybreaksound` | string | `nil` | Sound name played when effigy breaks. |
| `bufficon` | UIAnim | `nil` | Animation child for buff icon display. |
| `buffsymbol` | number | `0` | Current buff symbol index (0 = none). |
| `corrosives` | table | `{}` | Tracks active corrosive debuffs. |
| `hots` | table | `{}` | Tracks active heal-over-time debuffs. |
| `healthpenalty` | number | `0` | Current health penalty percentage. |
| `acidsizzling` | UIAnim | `nil` | Animation child for acid sizzling effect (conditional). |
| `pulsing` | string | `nil` | Current pulse color state ("green", "red", or nil). |
| `playing_pulse_loop` | string | `nil` | Which pulse loop sound is playing ("up", "down", or nil). |
| `turnofftask` | task | `nil` | Scheduled task to turn off pulse animation. |

## Main functions
### `SetBuildForSymbol(build, symbol)`
* **Description:** Allows modders to override the build used for a specific buff symbol. Stores the mapping in `OVERRIDE_SYMBOL_BUILD` table.
* **Parameters:**
  - `build` -- string build name to use for the symbol
  - `symbol` -- string or number symbol identifier
* **Returns:** None
* **Error states:** None

### `ShowBuff(symbol)`
* **Description:** Displays a buff icon on the badge. Plays activate animation when changing to a new symbol, or deactivate animation when setting to 0 (none).
* **Parameters:** `symbol` -- number buff symbol index (0 = no buff)
* **Returns:** None
* **Error states:** None

### `UpdateBuff(symbol)`
* **Description:** Wrapper function that calls `ShowBuff(symbol)`. Provided for API consistency.
* **Parameters:** `symbol` -- number buff symbol index
* **Returns:** None
* **Error states:** None

### `ShowEffigy(effigy_type)`
* **Description:** Shows the effigy animation indicator. Supports "grave" type for gravestone effigies or any other value for normal effigies.
* **Parameters:** `effigy_type` -- string effigy type ("grave" or other)
* **Returns:** None
* **Error states:** None

### `HideEffigy(effigy_type)`
* **Description:** Hides the effigy animation indicator and schedules a break sound to play after 7 frames if the effigy is currently shown. Cancels any existing break sound task before scheduling a new one.
* **Parameters:** `effigy_type` -- string effigy type ("grave" or other)
* **Returns:** None
* **Error states:** None

### `SetPercent(val, max, penaltypercent)`
* **Description:** Updates the age display based on health percentage. Calculates Wanda's age in years using `TUNING.WANDA_MIN_YEARS_OLD` and `TUNING.WANDA_MAX_YEARS_OLD`, updates the number string, and rotates the year hand accordingly.
* **Parameters:**
  - `val` -- number current health percentage (0-1)
  - `max` -- number maximum health value
  - `penaltypercent` -- number health penalty percentage
* **Returns:** None
* **Error states:** None

### `OnUpdate(dt)`
* **Description:** Called every frame while updating. Retrieves oldager year percent from `player_classified` component and updates the days hand rotation. On client, performs prediction for oldager component progression based on DPS rate. Returns early if server is paused or `player_classified` is nil.
* **Parameters:** `dt` -- number delta time since last frame
* **Returns:** None
* **Error states:** None

### `PulseColor(r, g, b, a)`
* **Description:** Sets the pulse animation color and plays the "on" animation followed by "on_loop". Used internally by `PulseGreen()` and `PulseRed()`.
* **Parameters:**
  - `r` -- number red channel (0-1)
  - `g` -- number green channel (0-1)
  - `b` -- number blue channel (0-1)
  - `a` -- number alpha channel (0-1)
* **Returns:** None
* **Error states:** Errors if `self.pulse` is nil (no nil guard present before accessing `self.pulse:GetAnimState()`).

### `PulseGreen()`
* **Description:** Triggers a green pulse animation indicating positive health change. Calls `PulseColor(0, 1, 0, 1)`.
* **Parameters:** None
* **Returns:** None
* **Error states:** Inherits error states from `PulseColor()`.

### `PulseRed()`
* **Description:** Triggers a red pulse animation indicating negative health change. Calls `PulseColor(1, 0, 0, 1)`.
* **Parameters:** None
* **Returns:** None
* **Error states:** Inherits error states from `PulseColor()`.

### `PulseOff()`
* **Description:** Stops the pulse animation and kills the pulse loop sound. Resets `playing_pulse_loop` and `pulsing` to nil.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.pulse` is nil (no nil guard present before accessing `self.pulse:GetAnimState()`).

### `Pulse(color)`
* **Description:** Triggers a health change pulse with sound effects. "green" plays health up sounds, any other value plays health down sounds with volume based on oldager rate and age thresholds.
* **Parameters:** `color` -- string "green" or other value for red pulse
* **Returns:** None
* **Error states:** Errors if `self.owner.player_classified` is nil when accessing `GetOldagerRate()`. Errors if `self.pulse` is nil when calling `PulseGreen()` or `PulseRed()`.

### `HealthDelta(data)`
* **Description:** Responds to health change events. Compares old and new health percentages and penalties to determine if a pulse should trigger. Cancels existing turnoff tasks and schedules a new one to turn off pulse after 0.25 seconds.
* **Parameters:** `data` -- table containing `oldpercent`, `newpercent` fields from health event
* **Returns:** None
* **Error states:** Errors if `self.owner.replica.health` is nil (no nil guard before accessing `GetPenaltyPercent()` or `Max()`).

### `ForceHealthPulse(data)`
* **Description:** Forces a health pulse animation without comparing old/new values. Uses `data.up` for green pulse or `data.down` for red pulse.
* **Parameters:** `data` -- table containing `up` or `down` boolean fields
* **Returns:** None
* **Error states:** None

## Events & listeners
- **Listens to:** `animover` on `effigyanim.inst` -- hides effigy widget when deactivation animation completes
- **Listens to:** `animover` on `gravestoneeffigyanim.inst` -- hides gravestone effigy widget when deactivation animation completes
- **Listens to:** `startcorrosivedebuff` on `owner` -- tracks new corrosive debuffs in `corrosives` table
- **Listens to:** `onremove` on debuff entities -- removes corrosive debuff from tracking when debuff is removed
- **Listens to:** `serverpauseddirty` on `TheWorld` -- kills or resumes pulse loop sound based on server pause state
- **Listens to:** `isacidsizzling` on `owner` -- shows or hides acid sizzling animation based on sizzling state
---
id: uiclock
title: Uiclock
description: Renders a visual representation of in-game time (day/night cycles, phases, moon phases) with dynamic text, segments, and animations for both surface and cave worlds.
tags: [ui, time, cycle]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: fc8900a9
system_scope: ui
---

# Uiclock

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`UIClock` is a UI widget that visually displays the current world time using animated segments, hands, and text. It supports both surface and cave environments, adapting its appearance (e.g., textures, animations, behavior) based on world context. It listens to world events (`clocksegschanged`, `phasechanged`, `moonphasechanged2`, etc.) to update the clock state, and provides special handling for cave-specific mechanics like sinkhole-based lighting detection.

## Usage example
```lua
-- Create and attach the clock to an entity (typically in a HUD prefab)
local inst = CreateEntity()
inst:AddComponent("uiclock")
inst.components.uiclock:OnGainFocus()  -- Shows survival time
inst.components.uiclock:OnLoseFocus()  -- Shows world time

-- Cave-specific usage
if TheWorld and TheWorld:HasTag("cave") then
    inst.components.uiclock:UpdateCaveClock(ThePlayer)
    inst.components.uiclock:OpenCaveClock()
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_cave` | boolean | `false` | Indicates whether the clock is in a cave world. |
| `_caveopen` | boolean or `nil` | `nil` | Whether the cave clock is currently open (`true`), closed (`false`), or uninitialized (`nil`). |
| `_lastsinkhole` | Entity or `nil` | `nil` | Cached sinkhole entity used for cave lighting detection. |
| `_moonphasebuild` | string | `"moon_phases"` | Build identifier for moon phase textures (e.g., `"moonalter_phases"`). |
| `_daysegs` | number | `0` | Number of segments lit during the day. |
| `_cycles` | number or `nil` | `nil` | Total world cycles survived. |
| `_phase` | string or `nil` | `nil` | Current world phase (`"day"`, `"dusk"`, `"night"`). |
| `_moonphase` | string or `nil` | `nil` | Current moon phase (`"full"`, `"new"`, `"quarter"`, etc.). |
| `_mooniswaxing` | boolean or `nil` | `nil` | Whether the moon is waxing (growing). |
| `_time` | number or `nil` | `nil` | Current fractional time (0.0–1.0) within a cycle. |

## Main functions
### `UpdateDayString()`
* **Description:** Updates the clock text to show the number of cycles survived (e.g., `"Day 5"`). Used when the clock has focus.
* **Parameters:** None.
* **Returns:** Nothing.

### `UpdateWorldString()`
* **Description:** Updates the clock text to show the current world day using `WORLD_CLOCKDAY_V2` (e.g., `"Day 5"`). Used when the clock does not have focus.
* **Parameters:** None.
* **Returns:** Nothing.

### `ShowMoon()`
* **Description:** Renders the current moon phase by overriding the `moon_phases_clock` animation symbol and playing the appropriate animation.
* **Parameters:** None.
* **Returns:** Nothing.

### `IsCaveClock()`
* **Description:** Returns whether the clock is configured for a cave world.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if in cave world, otherwise `false`.

### `UpdateCaveClock(owner)`
* **Description:** Checks for nearby sinkholes to determine if the cave clock should be open or closed. Updates `_lastsinkhole` cache to avoid repeated entity searches.
* **Parameters:** `owner` (Entity) — The player entity to check proximity against.
* **Returns:** Nothing.

### `OpenCaveClock()`
* **Description:** Animates the cave clock to the open state (hands visible, rim animation plays).
* **Parameters:** None.
* **Returns:** Nothing.

### `CloseCaveClock()`
* **Description:** Animates the cave clock to the closed state (hands hidden, rim animation plays).
* **Parameters:** None.
* **Returns:** Nothing.

### `OnGainFocus()`
* **Description:** Event handler triggered when the clock widget gains focus; updates text to survival time.
* **Parameters:** None.
* **Returns:** `true` — To indicate successful handling.

### `OnLoseFocus()`
* **Description:** Event handler triggered when the clock widget loses focus; updates text to world time.
* **Parameters:** None.
* **Returns:** `true` — To indicate successful handling.

### `OnClockSegsChanged(data)`
* **Description:** Updates the segments (16 wedges) to reflect day/dusk/night phases, applying appropriate colors (e.g., yellow for day, reddish for dusk) and toggling visibility.
* **Parameters:** `data` (table) — Contains `day`, `dusk`, and `night` keys, totaling `NUM_SEGS` (16).
* **Returns:** Nothing.

### `OnCyclesChanged(cycles)`
* **Description:** Updates internal cycle count and refreshes the clock text accordingly.
* **Parameters:** `cycles` (number) — Total world cycles survived.
* **Returns:** Nothing.

### `OnPhaseChanged(phase)`
* **Description:** Handles transitions between world phases (day/dusk/night) using animation transitions and triggers moon phase updates at night.
* **Parameters:** `phase` (string) — One of `"day"`, `"dusk"`, `"night"`.
* **Returns:** Nothing.

### `OnMoonPhaseChanged2(data)`
* **Description:** Updates moon phase data and refreshes the moon texture/animation if the clock is in the night phase.
* **Parameters:** `data` (table) — Contains `moonphase` (string) and `waxing` (boolean).
* **Returns:** Nothing.

### `OnMoonPhaseStyleChanged(data)`
* **Description:** Updates moon texture set (e.g., standard vs. Alter-themed) and adjusts associated build/bank names for animations.
* **Parameters:** `data` (table) — Contains `style` (string), e.g., `"glassed_alter_active"`.
* **Returns:** Nothing.

### `OnClockTick(data)`
* **Description:** Updates the clock hand rotation and triggers visual pulses for day segments advancing. Also updates the clock text if needed.
* **Parameters:** `data` (table) — Contains `time` (number in [0, 1)) representing the fractional cycle time.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Custom update loop for cave clock hands animations (expanding/collapsing, scaling). Uses easing functions for smooth transitions.
* **Parameters:** `dt` (number) — Delta time in seconds.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `clocksegschanged` (from `TheWorld`) — Triggers `OnClockSegsChanged`.  
  - `cycleschanged` (from `TheWorld`) — Triggers `OnCyclesChanged`.  
  - `phasechanged` (from `TheWorld`, surface only) — Triggers `OnPhaseChanged`.  
  - `moonphasechanged2` (from `TheWorld`, surface only) — Triggers `OnMoonPhaseChanged2`.  
  - `moonphasestylechanged` (from `TheWorld`, surface only) — Triggers `OnMoonPhaseStyleChanged`.  
  - `clocktick` (from `TheWorld`) — Triggers `OnClockTick`.
- **Pushes:** None identified.
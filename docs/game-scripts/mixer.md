---
id: mixer
title: Mixer
description: Manages sound channel volumes and dynamic audio filters for the game's sound system.
tags: [audio, sound, mixing]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: e99bddf2
system_scope: audio
---

# Mixer

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `Mixer` component provides a stateful system for managing multiple named sound level configurations (`Mix` objects) and applying dynamic volume transitions (fades) between them. It also supports time-based low-pass and high-pass audio filtering. Internally, it maintains a stack of active mixes and applies the highest-priority mix's settings, using linear interpolation for smooth crossfading. It interfaces with `TheSim` (the engine's audio subsystem) to directly control sound volumes and DSP filters.

## Usage example
```lua
local mixer = require("mixer").Mixer()

-- Create a new mix named "battle" with fade time 2s, priority 10, and specific channel levels
mixer:AddNewMix("battle", 2, 10, { music = 0.8, sfx = 0.9 })

-- Push the "battle" mix onto the stack; it will be applied after the fade-in
mixer:PushMix("battle")

-- In your update loop (e.g., `Update` in a component):
function component:Update(dt)
    mixer:Update(dt)
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `mixes` | table | `{}` | A dictionary of named `Mix` objects (`name → Mix`) available for use. |
| `stack` | table | `{}` | A stack (array) of active `Mix` objects, sorted by descending priority. |
| `lowpassfilters` | table | `{}` | Tracks active low-pass filter configurations per category. |
| `highpassfilters` | table | `{}` | Tracks active high-pass filter configurations per category. |

## Main functions
### `AddNewMix(name, fadetime, priority, levels)`
*   **Description:** Creates and registers a new named mix with specified fade time, priority, and initial channel levels. The mix is *not* activated until explicitly pushed.
*   **Parameters:**
    *   `name` (string) — Unique identifier for the mix.
    *   `fadetime` (number, optional) — Duration in seconds for fade-in when this mix is pushed (`default = 1`).
    *   `priority` (number, optional) — Higher priority mixes appear closer to the top of the stack; used for stacking (`default = 0`).
    *   `levels` (table) — Key-value pairs mapping sound channel names (strings) to volume levels (0.0–1.0).
*   **Returns:** `Mix` — The newly created mix object.

### `PushMix(mixname)`
*   **Description:** Pushes an existing mix onto the stack by name, applying fades if a different mix is already on top or if this is the first mix.
*   **Parameters:** `mixname` (string) — Name of the mix to push (must exist in `self.mixes`).
*   **Returns:** Nothing.
*   **Error states:** No effect if `mixname` does not exist in `self.mixes`.

### `PopMix(mixname)`
*   **Description:** Removes the specified mix from anywhere in the stack, and re-initiates a blend if the stack top changes.
*   **Parameters:** `mixname` (string) — Name of the mix to remove (matched by `mix.name`).
*   **Returns:** Nothing.

### `DeleteMix(mixname)`
*   **Description:** Removes the specified mix from the stack and immediately applies the new top mix without a fade-in.
*   **Parameters:** `mixname` (string) — Name of the mix to delete.
*   **Returns:** Nothing.

### `Blend()`
*   **Description:** Initiates a fade by capturing the current sound volumes as a snapshot and resetting the fade timer. Typically called internally before applying a new mix with fade.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Update(dt)`
*   **Description:** Called every frame to advance active fades and update DSP filters. Interpolates sound volumes from the snapshot to the current top-mix levels over time.
*   **Parameters:** `dt` (number) — Delta time in seconds since the last frame.
*   **Returns:** Nothing.

### `SetLowPassFilter(category, cutoff, timetotake)`
*   **Description:** Starts a fade of a low-pass filter's cutoff frequency from its current value to `cutoff` over `timetotake` seconds.
*   **Parameters:**
    *   `category` (string) — Sound category to apply the filter to.
    *   `cutoff` (number) — Target cutoff frequency in Hz.
    *   `timetotake` (number, optional) — Duration in seconds for the transition (`default = 3`).
*   **Returns:** Nothing.

### `ClearLowPassFilter(category, timetotake)`
*   **Description:** Clears a low-pass filter by ramping its cutoff to `25000` Hz over `timetotake` seconds.
*   **Parameters:**
    *   `category` (string) — Sound category to clear.
    *   `timetotake` (number, optional) — Transition duration (`default = 3`).
*   **Returns:** Nothing.

### `SetHighPassFilter(category, cutoff, timetotake)`
*   **Description:** Starts a fade of a high-pass filter's cutoff frequency from its current value to `cutoff` over `timetotake` seconds.
*   **Parameters:**
    *   `category` (string) — Sound category to apply the filter to.
    *   `cutoff` (number) — Target cutoff frequency in Hz.
    *   `timetotake` (number, optional) — Transition duration (`default = 3`).
*   **Returns:** Nothing.

### `ClearHighPassFilter(category, timetotake)`
*   **Description:** Clears a high-pass filter by ramping its cutoff to `0` Hz over `timetotake` seconds.
*   **Parameters:**
    *   `category` (string) — Sound category to clear.
    *   `timetotake` (number, optional) — Transition duration (`default = 3`).
*   **Returns:** Nothing.

## Events & listeners
Not applicable
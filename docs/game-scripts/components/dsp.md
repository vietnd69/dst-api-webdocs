---
id: dsp
title: Dsp
description: Manages dynamic audio filtering (low-pass and high-pass) based on player season, temperature, and runtime DSP stacks.
tags: [audio, player, seasonal]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: cfb1f7e7
system_scope: audio
---

# Dsp

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Dsp` is an audio management component that controls real-time dynamic sound filtering for the active player. It applies low-pass and high-pass filters via `TheMixer` based on seasonal context (summer/winter), environmental temperature (for summer), and user-issued DSP stacks (`pushdsp`/`popdsp`). It works closely with `PlayerHearing` to synchronize DSP settings and automatically activates on player switch.

## Usage example
```lua
-- Typically added automatically to the world or environment entity
-- No manual instantiation required for normal gameplay
-- Example of manually pushing DSP for a custom effect:
inst:PushEvent("pushdsp", {
    lowdsp = { ["set_sfx/movement"] = 1000 },
    highdsp = { ["set_sfx/voice"] = 2000 },
    duration = 1.5
})
-- To remove:
inst:PushEvent("popdsp", {
    lowdsp = { ["set_sfx/movement"] = 1000 },
    duration = 1.5
})
```

## Dependencies & tags
**Components used:** `playerhearing` (accessed via `inst.components.playerhearing:GetDSPTables()` for initialization)
**Tags:** None identified.

## Properties
No public properties

## Main functions
### `GetDebugString()`
* **Description:** Returns a multi-line string listing the currently active low-pass and high-pass filter values for debugging (e.g., in console or logs).
* **Parameters:** None.
* **Returns:** String in format `"LOW: set_sfx/movement=1000, set_sfx/player=5000\nHIGH: set_sfx/voice=2000"`, or `"LOW: nil\nHIGH: nil"` if no filters are active.
* **Error states:** None.

## Events & listeners
- **Listens to:**  
  - `playeractivated` — activates listener set for the newly activated player, including pushing default DSP and restoring their stacked DSP.
  - `playerdeactivated` — deactivates listeners for the deactivated player, clearing stacks and resetting to baseline.
  - `seasontick` — triggers DSP update when the season changes (via `OnSeasonTick`).
  - `temperaturetick` — triggers DSP update for summer seasons based on temperature thresholds (only while `_summerlevel` is active).
  - `pushdsp` — applies a new DSP stack layer to the low/highpass stacks.
  - `popdsp` — removes a specific DSP stack layer from the low/highpass stacks.
- **Pushes:** None.

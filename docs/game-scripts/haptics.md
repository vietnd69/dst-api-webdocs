---
id: haptics
title: Haptics
description: Defines the HapticEffects configuration table containing all haptic feedback effect definitions for Don't Starve Together, organized by category including DANGER, PLAYER, ENVIRONMENT, BOSS, and UI effects.
tags: [configuration, input, ui, player]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: data_config
source_hash: f65c030f
system_scope: player
---

# Haptics

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`haptics.lua` defines the `HapticEffects` configuration table, which stores all haptic feedback effect definitions used throughout Don't Starve Together. The data is organized into categories such as DANGER, PLAYER, ENVIRONMENT, BOSS, and UI to standardize controller vibration responses for different gameplay scenarios. This file serves as a static data source required by the input and audio systems to trigger appropriate haptic feedback during events. It is not a component and does not attach to entities; instead, it is accessed globally via `require()`.

## Usage example
```lua
local HapticEffects = require "haptics"
-- Access the first effect record in the array
local first_effect = HapticEffects[1]
print(first_effect.event, first_effect.category)
-- Filter effects by category field
for i, effect in ipairs(HapticEffects) do
    if effect.category == "DANGER" then
        print(effect.event, effect.vibration_intensity)
    end
end
```

## Dependencies & tags
**Components used:**
None identified.

**Tags:**
None

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `HapticEffects` | table | --- | Top-level container table holding all haptic effect definitions as an array. |
| `event` | string | --- | Sound event path string (e.g., `"dontstarve/wilson/hungry"`). |
| `vibration` | boolean | --- | Whether this effect triggers controller vibration. |
| `audio` | boolean | --- | Whether this effect plays an audio sound. |
| `vibration_intensity` | number | --- | Intensity multiplier for vibration (typically 0.5–25.0). |
| `audio_intensity` | number | --- | Intensity multiplier for audio playback. |
| `category` | string | --- | Effect category for filtering. Valid values: `"DANGER"`, `"PLAYER"`, `"ENVIRONMENT"`, `"BOSS"`, `"UI"`. |
| `player_only` | boolean | --- | If true, effect only triggers for the local player (optional field, not present on all records). |

## Main functions
None.

## Events & listeners
This file is not event-driven.

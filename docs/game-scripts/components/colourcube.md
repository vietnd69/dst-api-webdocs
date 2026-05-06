---
id: colourcube
title: Colourcube
description: Manages post-processing colour cube transitions and visual distortion effects based on time of day, season, sanity state, and environmental conditions.
tags: [visual, postprocessing, environment]
sidebar_position: 10

last_updated: 2026-04-18
build_version: 722832
change_status: stable
category_type: components
source_hash: 3dada642
system_scope: environment
---

# Colourcube

> Based on game build **722832** | Last updated: 2026-04-18

## Overview
`Colourcube` manages the visual colour grading and post-processing effects for the game world. It handles transitions between different colour cubes based on time of day (day/dusk/night), season, moon phase, and player sanity state (including lunacy mode). The component uses three PostProcessor channels: channel 0 for ambient colour, channel 1 for insanity effects, and channel 2 for lunacy effects. It also manages distortion and fisheye effects that intensify based on environmental conditions like rain domes.

## Usage example
```lua
local cc = TheWorld.components.colourcube

-- Set a custom distortion modifier (affects visual intensity)
cc:SetDistortionModifier(0.5)

-- Override the colour cube directly (bypasses normal transitions)
TheWorld:PushEvent("overridecolourcube", "images/colour_cubes/custom_cc.tex")

-- Get debug information about current state
print(cc:GetDebugString())
```

## Dependencies & tags
**External dependencies:**
- `easing` -- used for smooth interpolation of sanity/lunacy distortion values

**Components used:**
- `playervision` -- accessed via `player.components.playervision:GetCCPhaseFn()` and `GetCCTable()` for colour cube overrides
- `sanity` (replica) -- accessed via `player.replica.sanity` for sanity percentage and lunacy mode state

**Tags:**
- `cave` -- checked on inst to determine if cave colour cubes should be used
- `dappereffects` -- checked on player to apply squared distortion effects

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity | `nil` | The entity instance that owns this component. |

## Main functions
### `OnUpdate(dt)`
* **Description:** Main update loop called every frame. Handles colour cube blending, distortion effects, fisheye intensity, and lunacy intensity transitions. Skips blending when fade level is at maximum or no player is activated.
* **Parameters:** `dt` -- delta time in seconds since last frame
* **Returns:** None
* **Error states:** None

### `LongUpdate(dt)`
* **Description:** Calls `OnUpdate` with the internal `_remainingblendtime` value, ignoring the passed `dt` parameter. Used for extended update cycles.
* **Parameters:** `dt` -- delta time parameter (present for interface compatibility but not used in implementation)
* **Returns:** None
* **Error states:** None

### `SetDistortionModifier(modifier)`
* **Description:** Sets the distortion modifier value that affects fisheye and distortion effect intensity. Triggers a post-processor update if fisheye intensity is non-zero.
* **Parameters:** `modifier` -- number representing distortion intensity multiplier
* **Returns:** None
* **Error states:** None

### `GetDebugString()`
* **Description:** Returns a formatted string with current colour cube state including override status, blend time remaining, and current/transitioning colour cube textures for ambient, sanity, and lunacy channels.
* **Parameters:** None
* **Returns:** String containing debug information
* **Error states:** None

## Events & listeners
- **Listens to:** `playeractivated` -- sets up event listeners for the activated player and initializes sanity state
- **Listens to:** `playerdeactivated` -- removes event listeners and resets sanity/lunacy state
- **Listens to:** `phasechanged` -- triggers colour cube blend when time of day changes
- **Listens to:** `moonphasechanged2` -- triggers blend when moon enters/exits full moon phase
- **Listens to:** `moonphasestylechanged` -- triggers blend when alter guardian awakens during full moon
- **Listens to:** `seasontick` -- triggers colour cube update when season changes (not in caves)
- **Listens to:** `overridecolourcube` -- sets a direct colour cube override texture
- **Listens to:** `overridecolourmodifier` -- sets a colour modifier value for post-processing
- **Listens to:** `sanitydelta` -- updates lunacy/insanity distortion based on player sanity percentage
- **Listens to:** `ccoverrides` -- updates ambient colour cube table from playervision component
- **Listens to:** `ccphasefn` -- updates colour cube phase function from playervision component
- **Listens to:** `stormlevel` -- triggers blend when entering/exiting moonstorm
- **Listens to:** `enterraindome` -- enables fisheye distortion effect
- **Listens to:** `exitraindome` -- disables fisheye distortion effect
- **Pushes:** None
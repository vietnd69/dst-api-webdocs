---
id: leafcanopy
title: Leafcanopy
description: Manages a dynamic UI canopy of animated leaf rows that respond to camera movement and player position to simulate overhead foliage.
tags: [ui, animation, environment]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 79a16978
system_scope: ui
---

# Leafcanopy

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Leafcanopy` is a UI widget that renders a multi-row animated leaf canopy effect above the player. It creates five horizontal rows of animated leaf elements using `UIAnim` widgets, each row containing five leaf instances positioned horizontally. The component dynamically adjusts leaf position, depth, and animation based on camera movement (camera direction and distance), player's `_underleafcanopy` state, and screen boundaries to simulate parallax and occlusion effects. It is intended for use in scenarios where the player moves under or through overhead foliage (e.g., forests), and it primarily affects the client-side visual experience.

## Usage example
```lua
-- Typically added to the player prefab's UI root or a dedicated root widget
local root = root_widget -- e.g., the main UI container
local leafcanopy = root:AddChild(Leafcanopy(player_inst))
-- Leafcanopy initializes all rows automatically in constructor; no further setup required.
-- The OnUpdate loop is invoked automatically by DST's widget update system.
```

## Dependencies & tags
**Components used:** `owner._underleafcanopy` (expects a numeric component with `:value()` returning `1` when under canopy, `0` otherwise)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Entity` | `nil` | The owner entity (typically the player) whose `_underleafcanopy` state drives canopy visibility. |
| `leavestop_intensity` | number | `0` | Current intensity of the leaf effect (0 = fully hidden, 1 = fully visible), interpolated over time. |
| `leavesfullyin` | boolean | `true` | Flag indicating whether the player is fully under the canopy; used for animation blending. |
| `leavespercent` | number | `0` | Fractional offset used in animation blending when `leavesfullyin` is `true`. |
| `lastframecoords` | `Vector3`? | `nil` | Camera position from the previous frame, used to compute motion delta. |

## Main functions
### `OnUpdate(dt)`
*   **Description:** Called every frame by DST's widget system. Updates leaf positions, animations, and visibility based on camera movement and player's `_underleafcanopy` state.
*   **Parameters:** `dt` (number) — time delta since last frame.
*   **Returns:** Nothing.
*   **Error states:** Early returns if `TheNet:IsServerPaused()` is `true`. Uses `TheCamera` and `TheSim` APIs, so must be run on the client.

## Events & listeners
None identified.
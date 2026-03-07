---
id: reticuleline
title: Reticuleline
description: Factory function that creates visual FX prefabs for reticle line indicators used in UI and world feedback.
tags: [fx, ui, visual]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 85eb01d5
system_scope: fx
---

# Reticuleline

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`reticuleline` is a prefab factory module that defines three visual FX prefabs used to display dynamic line indicators in-game—typically for targeting, pathing, or feedback overlays. It exports two static line prefabs (`reticuleline` and `reticuleline2`) and one animated ping effect (`reticulelineping`) that scales, fades, and flashes over time. These prefabs are non-persistent and intended solely for visual feedback, not simulation logic.

## Usage example
```lua
local reticuleline = Prefab("reticuleline")
local reticuleline2 = Prefab("reticuleline2")
local reticulelineping = Prefab("reticulelineping")

-- Spawn a static line indicator
local line = reticuleline()
line.Transform:SetPosition(x, y, z)

-- Spawn an animated ping effect at target location
local ping = reticulelineping()
ping.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `animstate`, `transform`  
**Tags:** Adds `FX`, `NOCLICK` to spawned entities.

## Properties
No public properties.

## Main functions
### `MakeReticule(name)`
*   **Description:** Factory function that returns a `Prefab` definition for a static reticle line indicator. It configures the anim state with bank/build matching `name`, sets orientation and layer for world background rendering, and applies a fixed scale.
*   **Parameters:** `name` (string) - base name used to construct the animation asset path and prefab ID (e.g., `"reticuleline"` → `"anim/reticuleline.zip"`).
*   **Returns:** `Prefab` - a reusable prefab factory function and asset list.
*   **Error states:** None. Always returns a valid prefab.

### `pingfn()`
*   **Description:** Defines the `reticulelineping` prefab. It creates a non-persistent FX entity that performs a scaling and colour-modulation animation using a periodic task, then automatically removes itself after the animation completes.
*   **Parameters:** None.
*   **Returns:** `Prefab` - a prefab with a custom entity constructor.
*   **Error states:** None.

## Events & listeners
None identified.
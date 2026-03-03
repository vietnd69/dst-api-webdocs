---
id: shatterfx
title: Shatterfx
description: Manages animated shatter effects for an entity by cycling through pre-defined animation sequences based on a numeric level.
tags: [fx, animation]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 09ea5df6
system_scope: fx
---
# Shatterfx

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Shatterfx` is a lightweight component that controls play-loop animation sequences for shatter-style visual effects. It is attached to an entity (typically a visual FX prefab) and uses `self.levels` to define different animation configurations, each potentially containing a short `pre` animation followed by a looping `anim` animation. The component selects and plays the appropriate sequence based on a provided integer `level` value.

It directly manipulates the entity's `AnimState` component to trigger animations and ensures only valid levels are played. The component itself does not manage dynamic state beyond the currently active level and does not interact with other components or systems beyond animation control.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("shatterfx")

-- Define animation levels
inst.components.shatterfx.levels = {
    { pre = "shatter_01_pre", anim = "shatter_01_loop" },
    { pre = "shatter_02_pre", anim = "shatter_02_loop" },
}

-- Play the second level's animation sequence
inst.components.shatterfx:SetLevel(2)
```

## Dependencies & tags
**Components used:** `animstate` (accessed via `self.inst.AnimState`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `level` | number\|nil | `nil` | The currently active level index (1-based). `nil` indicates no level is active. |
| `levels` | table | `{}` | A list of animation configurations, each a table containing optional `pre` and `anim` string keys for animation names. |

## Main functions
### `SetLevel(level)`
*   **Description:** Sets the active shatter effect level, playing the corresponding animation sequence. If the requested level differs from the current level and is valid, it first plays an optional `pre` animation followed by the looping `anim` (if `pre` exists and no level was previously active). Otherwise, it plays only the `anim` loop.
*   **Parameters:** `level` (number) — The 1-based index of the desired animation sequence in `self.levels`.
*   **Returns:** Nothing.
*   **Error states:** If `level` exceeds the number of defined levels (`#self.levels`), it is clamped to the maximum valid index. The function does nothing if the requested `level` is already active or has no corresponding entry in `self.levels`.

## Events & listeners
None.

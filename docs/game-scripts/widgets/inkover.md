---
id: inkover
title: Inkover
description: Manages visual ink splatter effects on a player character when they become inked.
tags: [visuals, fx, player]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 8537b674
system_scope: fx
---

# Inkover

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`InkOver` is a UI widget that triggers and coordinates visual ink splatter effects on a player character. It listens for the `inked` event on the owner entity and responds by playing sound and animating one of two internal splatter effects (`InkOver` or `InkOver2`) using the `Flash` method.

## Usage example
```lua
local inst = ThePlayer
inst:AddWidget("inkover")
inst.widgets.inkover:Flash()  -- Manually trigger ink effect if needed
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The entity (typically a player) that owns this widget and triggers ink effects. |
| `InkOver` | InkOver_splat | `nil` | First splatter widget instance. |
| `InkOver2` | InkOver_splat | `nil` | Second splatter widget instance, used alternately to avoid overlap. |

## Main functions
### `Flash()`
* **Description:** Triggers a visual ink splatter effect by playing a sound and calling `Flash()` on one of the two `InkOver_splat` widgets. It selects between `InkOver` (using `"ink"`) and `InkOver2` (using `"ink2"`) based on elapsed time since last flash, ensuring staggered or alternating behavior to prevent visual clashing.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None — always plays a sound and flashes one splatter widget.

## Events & listeners
- **Listens to:** `inked` — fires `Flash()` in response when the owner receives this event.
- **Pushes:** None.
---
id: parasitethrallover
title: Parasitethrallover
description: Manages the visual overlay animation shown when a player is controlled by a parasite thrall effect.
tags: [ui, animation, effect]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 4ebe8e59
system_scope: ui
---

# Parasitethrallover

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Parasitethrallover` is a UI widget responsible for rendering the visual overlay animation that appears on screen when a player is under the influence of a parasite thrall control effect. It inherits from `UIAnim` and manages animation states ("in", "loop", "out", "empty") based on the `parasitethralllevel` event emitted by the owner entity. The widget is non-interactive, center-anchored, and scales consistently across screen sizes.

## Usage example
```lua
local owner = ThePlayer
local overlay = ParasiteThrallOver(owner)
overlay.inst:AddToScene()
overlay.inst:SetRenderEntity()
overlay.inst:SetSceneRun(true)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds no tags — only uses entity events.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Entity` | `nil` | The entity (typically a player) whose parasite thrall state triggers the overlay. |

## Main functions
### `UpdateAnim(status)`
*   **Description:** Controls animation playback based on the current thrall status. If `status` is `true`, plays the "in" animation followed by an infinite "loop"; if `false`, triggers the "out" animation if currently playing "in" or "loop".
*   **Parameters:** `status` (boolean) — `true` indicates thrall active (show overlay), `false` indicates ending thrall state.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `parasitethralllevel` — fired by the `owner` entity with a `level` parameter (boolean), triggering `UpdateAnim(level)`.
- **Listens to:** `animover` — fired when animation transitions complete; hides and resets the overlay if the "out" animation finishes.
- **Pushes:** None.
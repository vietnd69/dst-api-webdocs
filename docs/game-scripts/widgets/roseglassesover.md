---
id: roseglassesover
title: Roseglassesover
description: Renders a visual overlay on the screen when the player has active rose glasses vision.
tags: [ui, visualfx, hud]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 364ad3f5
system_scope: ui
---

# Roseglassesover

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`RoseGlassesOver` is a client-side UI widget that displays an animated visual overlay (specifically, rose-tinted glass visuals) when the player is under the effect of rose glasses vision. It extends `UIAnim` and responds to the `roseglassesvision` event, toggling its visibility based on the state of the owner's `playervision` component. It integrates directly with the UI rendering system and does not participate in network or gameplay logic beyond mirroring the vision state.

## Usage example
```lua
local roseglasses = RoseGlassesOver(player)
roseglasses:Toggle(true)  -- Show the overlay
-- Later, when vision ends:
roseglasses:Toggle(false) -- Hide the overlay after animation
```

## Dependencies & tags
**Components used:** `playervision` (via `owner.components.playervision:HasRoseGlassesVision()`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Entity` | `nil` | The entity whose vision state controls this overlay. |
| `shown` | `boolean` | `false` | Internal flag indicating whether the overlay is currently visible or animating toward visibility. |
| `hidetask` | `Task` or `nil` | `nil` | Reference to a delayed hide task; used to defer hiding until after the exit animation completes. |

## Main functions
### `Toggle(show)`
*   **Description:** Shows or hides the overlay based on the `show` flag. Handles animation sequencing and prevents redundant state changes.
*   **Parameters:** `show` (boolean) — `true` to show the overlay, `false` to hide it.
*   **Returns:** Nothing.
*   **Error states:** No-op if `show` matches the current `shown` state.

### `Enable()`
*   **Description:** Initiates the overlay’s visibility. Cancels any pending hide task, shows the widget immediately, and plays the entry animation (`over_pre`) followed by the idle loop (`over_idle`).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Disable()`
*   **Description:** Begins the process of hiding the overlay. Plays the exit animation (`over_pst`) and schedules a delayed `Hide()` call after the animation completes.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `roseglassesvision` (on `owner`) — fired by the `playervision` component to indicate the rose glasses vision state has changed. Triggers `Toggle(data.enabled)`.
- **Pushes:** None.
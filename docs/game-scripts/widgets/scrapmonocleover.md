---
id: scrapmonocleover
title: Scrapmonocleover
description: Renders an overlay animation when the player has Scrap Monocle vision active.
tags: [ui, vision, overlay]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: d1e3a332
system_scope: ui
---

# Scrapmonocleover

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ScrapMonocleover` is a UI widget that displays the Scrap Monocle vision overlay animation on the screen. It listens for the `"scrapmonolevision"` event from its owner and toggles visibility based on whether the owner's `playervision` component reports active Scrap Monocle vision. It extends `UIAnim` and manages its own animation playback and delayed hiding behavior.

## Usage example
```lua
-- Typically instantiated and managed automatically by the Scrap Monocle prefab.
-- Manual usage example (not recommended for production):
local over = ScrapMonocleOver(owner)
TheFrontEnd:AddWidget(over, "scrap_monocle_over")
```

## Dependencies & tags
**Components used:** `playervision`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `GEntity` | `nil` | The entity (usually a player) whose vision state controls the overlay. |
| `shown` | boolean | `false` | Internal flag tracking whether the overlay is currently shown. |
| `hidetask` | `Task` | `nil` | Task used to defer hiding after the post-animation finishes. |

## Main functions
### `Toggle(show)`
*   **Description:** Shows or hides the overlay based on the `show` flag, handling transitions via `Enable()` and `Disable()`.
*   **Parameters:** `show` (boolean) — `true` to show the overlay, `false` to hide it.
*   **Returns:** Nothing.
*   **Error states:** No-op if the current visibility state already matches `show`.

### `Enable()`
*   **Description:** Activates the overlay: cancels any pending hide task and plays the pre-animation followed by the idle loop.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Disable()`
*   **Description:** Begins the hiding sequence: plays the post-animation and schedules a delayed `Hide()` call based on animation length.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `scrapmonolevision` — fired on the `owner` entity; triggers `Toggle(data.enabled)` to show/hide the overlay.
- **Pushes:** None identified.
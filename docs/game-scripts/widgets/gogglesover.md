---
id: gogglesover
title: Gogglesover
description: Manages the visual rendering of goggle overlays when the player enters or exits goggle vision mode.
tags: [ui, vision, overlay]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: db7bd2f0
system_scope: ui
---

# Gogglesover

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Gogglesover` is a UI widget that controls the display of storm-related visual overlays (e.g., lightning or electrical storm effects) when the player has active goggle vision. It listens for the `gogglevision` event on the owner entity and toggles the visibility of its child `storm_overlays` accordingly. It extends the base `Widget` class and is responsible for ensuring overlays are correctly parented in the UI hierarchy based on vision state.

## Usage example
```lua
-- Typically instantiated internally by the game; manual instantiation is rare.
-- Example of expected usage context:
local goggles = GogglesOver(owner, storm_overlays_widget)
-- The component automatically responds to owner.components.playervision changes and events.
```

## Dependencies & tags
**Components used:** `playervision` (read-only via `HasGoggleVision()`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `GEntity?` | `nil` | The entity (usually a player) that owns this goggle overlay state. |
| `storm_overlays` | `Widget` | required arg | The widget containing the storm-specific visual overlays to manage. |
| `storm_root` | `Widget` | derived | The parent of `storm_overlays`, used to reparent during toggle. |
| `bg` | `Image` | created internally | Background overlay texture for the goggles effect. |

## Main functions
### `ToggleGoggles(show)`
* **Description:** Shows or hides the goggle overlay and reparents the `storm_overlays` widget to maintain correct draw order. When `show` is `true`, overlays are added as a child and moved to the back; when `false`, they are moved back to their original parent.
* **Parameters:**  
  `show` (boolean) — whether to enable the goggle vision overlay.
* **Returns:** Nothing.
* **Error states:** No explicit error states; operates safely even if `shown` state matches the requested visibility.

## Events & listeners
- **Listens to:** `gogglevision` on `owner` — triggers `ToggleGoggles(data.enabled)` when the event fires.
- **Pushes:** None.
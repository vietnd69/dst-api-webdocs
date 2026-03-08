---
id: werebadge
title: Werebadge
description: Renders the wereness progress indicator with animated overlays for different Werecreature forms and directional arrows for drain rate.
tags: [ui, status, werecreature]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 7d8c271f
system_scope: ui
---

# Werebadge

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Werebadge` is a specialized UI widget subclassing `Badge` that visually represents the player's current "wereness" level — a progress bar for Werecreature transformation states. It extends the base badge with dynamic animation layers: a circular overlay (`circleframe2`) that displays the specific Werecreature mode (beaver, moose, or goose), and a sanity arrow (`sanityarrow`) that indicates the current drain rate direction. It periodically updates the bar based on the owner's `GetWerenessDrainRate` and plays sound/animation feedback on mode changes.

## Usage example
```lua
local inst = ThePlayer
inst:AddComponent("werebadge")
inst.components.werebadge:SetPercent(50)  -- Show 50% wereness
-- The component automatically updates and animates based on the player's wereness state.
```

## Dependencies & tags
**Components used:** None (relies on owner entity for `GetWerenessDrainRate` and tag checks).
**Tags:** Checks owner for tags: `"beaver"`, `"weremoose"`, `"weregoose"` (inferred usage, one tag active at a time).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `val` | number | `100` | Current wereness percentage (0–100). |
| `arrowdir` | string or nil | `nil` | Current animation state name for the sanity arrow (e.g., `"arrow_loop_decrease_most"`). |
| `mode` | string or nil | `nil` | Active Werecreature mode: `"beaver"`, `"moose"`, or `"goose"`. |
| `circleframe2` | UIAnim | Created in constructor | Secondary animated circle showing the current transformation icon. |
| `sanityarrow` | UIAnim | Created in constructor | Animated arrow indicating drain rate direction. |

## Main functions
### `SpawnNewFX()`
* **Description:** Triggers a "new" animation on the `circleframe2` overlay and plays a petrification sound if visible. Used to highlight when a new transformation state is applied.
* **Parameters:** None.
* **Returns:** Nothing.

### `SpawnShatterFX()`
* **Description:** Plays a destruction animation on a temporary UI element matching the current `mode`, then resets `self.mode` to `nil`. Used when the wereness state is removed or resets.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Silently returns if `self.mode` is `nil`.

### `UpdateArrow()`
* **Description:** Updates the `sanityarrow` animation to reflect the current wereness drain rate (e.g., decreasing quickly vs. slowly). Determines animation based on `owner:GetWerenessDrainRate()`.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetPercent(val)`
* **Description:** Sets the wereness percentage and triggers updating logic: starts/stops the update loop and refreshes the arrow animation.
* **Parameters:** `val` (number) – percentage value (0–100).
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Called regularly to update `val` by applying the owner's drain rate over time. Skips updates during server pauses.
* **Parameters:** `dt` (number) – delta time in seconds.
* **Returns:** Nothing.

### `OnShow()`
* **Description:** Initializes or updates the `mode` based on the owner's tags and sets the `circleframe2` animation to show the correct transformation icon.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnHide()`
* **Description:** Stops the update loop when the badge is hidden.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` – used internally to clean up temporary shatter FX instances via `RemoveFX`.
- **Pushes:** None (does not fire custom events).
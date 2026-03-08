---
id: badge
title: Badge
description: Renders a customizable status indicator (e.g., health, hunger, or custom metrics) with animated progress bars, warning pulses, and optional numeric display.
tags: [ui, visual, indicator]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: ed2d77a7
system_scope: ui
---

# Badge

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Badge` is a UI widget component that visually represents a numeric percentage value through animated bars, warning pulses, and an optional numeric label. It supports multiple visual configurations—linear or circular progress, tinted icons, bonus indicators, and dynamic warning states. It inherits from `Widget` and is designed to be embedded in UI screens (e.g., player status bars). It does not require or interact with any entity components.

## Usage example
```lua
local badge = CreateWidget(Badge, "status", nil, {1, 1, 1, 1}, nil, false, true, false)
badge:SetPercent(0.75, 100)  -- Shows "75" with 75% fill
badge:PulseGreen()           -- Triggers a green pulse animation
badge:SetIconSkin("wooden_goggles")  -- Applies a custom skin to the icon
badge:OnGainFocus()          -- Shows the numeric label
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | Reference to the entity this badge represents (e.g., player), passed during construction but not actively used internally. |
| `percent` | number | `1` | Last set normalized value (used when re-rendering without explicit `val`). |
| `pulse` | UIAnim | `UIAnim()` | Visual pulse effect for feedback (e.g., health regen). |
| `warning` | UIAnim | `UIAnim()` | Warning indicator (hidden by default). |
| `warningstarted` | boolean or `nil` | `nil` | Tracks whether a warning state is active. |
| `warningdelaytask` | Task | `nil` | Delayed task to re-hide warning after pulse expires. |
| `anim` | UIAnim | `UIAnim()` | Main progress bar (linear or circular fallback). |
| `backing` | UIAnim | `UIAnim()` | Background bar (e.g., `status_meter` or `status_clear_bg`). |
| `anim_bonus` | UIAnim or `nil` | `UIAnim()` | Bonus progress overlay (e.g., extra hunger). |
| `circular_meter` | UIAnim or `nil` | `nil` | Circular progress bar (replaces linear `anim` if enabled). |
| `circleframe` | UIAnim | `UIAnim()` | Static frame/outline for the progress meter, optionally overridden with an icon. |
| `anim_bonus` | UIAnim | `UIAnim()` | Overlay for bonus value progress. |
| `underNumber` | Widget | `Widget("undernumber")` | Container for the numeric display. |
| `num` | Text | `Text(BODYTEXTFONT, 33)` | Numeric label showing ceiling(`percent * max`). |

## Main functions
### `SetIconSkin(skinname)`
* **Description:** Applies a custom skin to the icon on the circle frame. Uses `GetBuildForItem` to resolve the skin's asset build.
* **Parameters:** `skinname` (string) — Name of the item or skin (empty string resets to default).
* **Returns:** Nothing.

### `SetPercent(val, max, bonusval)`
* **Description:** Updates the progress bar(s) and numeric label based on the normalized value `val` and optional maximum and bonus values.
* **Parameters:**
  * `val` (number) — Normalized progress (0–1). Defaults to `self.percent` if omitted.
  * `max` (number) — Maximum value for display. Defaults to `100`.
  * `bonusval` (number or `nil`) — Extra value shown as a secondary overlay. If `nil`, hides the bonus bar.
* **Returns:** Nothing.

### `PulseGreen()`
* **Description:** Triggers a green pulse animation on the `pulse` widget and cancels pending warning tasks.
* **Parameters:** None.
* **Returns:** Nothing.

### `PulseRed()`
* **Description:** Triggers a red pulse animation on the `pulse` widget and schedules the `warning` to appear after a delay (unless canceled).
* **Parameters:** None.
* **Returns:** Nothing.

### `StopWarning()`
* **Description:** Immediately stops and hides any active warning state.
* **Parameters:** None.
* **Returns:** Nothing.

### `StartWarning(r, g, b, a)`
* **Description:** Activates a warning state using the specified color. If no valid arguments are given, defaults to red (`1, 0, 0, 1`). Shows the `warning` widget if not already visible.
* **Parameters:**
  * `r`, `g`, `b`, `a` (numbers) — RGBA color components. Must all be provided to override defaults.
* **Returns:** Nothing.

### `OnGainFocus()`
* **Description:** Overrides the base `Widget` method. Shows the numeric label (`self.num`).
* **Parameters:** None.
* **Returns:** Nothing.

### `OnLoseFocus()`
* **Description:** Overrides the base `Widget` method. Hides the numeric label (`self.num`).
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
This component does not register event listeners or push events. Any tasks created (e.g., `warningdelaytask`) are scheduled via `inst:DoTaskInTime` and use local callbacks (`CheckWarning`) instead of `ListenForEvent`.
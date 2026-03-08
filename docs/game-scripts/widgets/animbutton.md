---
id: animbutton
title: Animbutton
description: A specialized button widget that displays an animated visual instead of static text, typically used for interactive UI elements with dynamic feedback.
tags: [ui, animation, interaction]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: ddd672d7
system_scope: ui
---

# Animbutton

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`AnimButton` is a UI widget that extends the base `Button` class to support animated visuals. It manages a child `UIAnim` component to render animation states (e.g., idle, over, disabled) and integrates with the DST UI focus and interaction system. It is used wherever a button needs visual feedback through animation rather than static graphics or text.

## Usage example
```lua
local AnimButton = require "widgets/animbutton"
local button = AnimButton("myanimname", {
    idle = "idle",
    over = "hover",
    disabled = "disabled"
})
button:SetPosition(100, 100)
button:SetSize(64, 64)
button:SetCallback(OnButtonPress)
TheFrontEnd:AddWidget(button)
```

## Dependencies & tags
**Components used:** `UIAnim` (via `self:AddChild(UIAnim())`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `anim` | `UIAnim` instance | — | Child widget responsible for rendering animations. |
| `animstates` | table or nil | `nil` | Optional table mapping state keys (`idle`, `over`, `disabled`) to animation names. Falls back to hardcoded defaults if not provided. |

## Main functions
### `OnGainFocus()`
*   **Description:** Overrides the base button behavior to play the "over" animation when the button gains focus, provided it is enabled and not selected.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnLoseFocus()`
*   **Description:** Overrides the base button behavior to play the "idle" animation when focus is lost, provided the button is not selected or disabled.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Enable()`
*   **Description:** Re-enables the button and resets the animation to the "idle" state.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Disable()`
*   **Description:** Disables the button and sets the animation to the "disabled" state.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
None identified.
---
id: resurrectbutton
title: Resurrectbutton
description: Provides a UI button and input handling for triggering character resurrection via an effigy or grave.
tags: [ui, hud, resurrection, input]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 588d0145
system_scope: ui
---

# Resurrectbutton

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Resurrectbutton` is a UI widget that renders and manages the resurrection button in the Heads-Up Display (HUD). It integrates with input systems (keyboard and controller) and responds to the current HUD focus state. When activated, it delegates the actual resurrection logic to the `playercontroller` component's `DoResurrectButton()` method. It also supports dynamic texture and tooltip updates based on the resurrection method (e.g., standard effigy vs. Wendy's grave).

## Usage example
```lua
local resurrect_button = AddChild(inst.HUD, CreateWidget(ResurrectButton, player))
resurrect_button:SetType("grave") -- Show grave-specific icon and text
resurrect_button:ToggleHUDFocus(true) -- Enable HUD focus
```

## Dependencies & tags
**Components used:** `playercontroller` (accessed via `self.owner.components.playercontroller:DoResurrectButton()`)  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The owner entity (typically the player) for which this button operates. |
| `hud_focus` | boolean | `false` | Controls whether the button should display controller-specific text. |
| `button` | ImageButton | `nil` | The clickable button widget used for visual representation and interaction. |
| `text` | Text | `nil` | The label that displays localized input instructions (e.g., "[A] Resurrect"). |
| `shown` | boolean | `nil` | Inherited from Widget; determines visibility. |

## Main functions
### `ToggleHUDFocus(focus)`
* **Description:** Updates the HUD focus state and refreshes the button's text visibility.
* **Parameters:** `focus` (boolean) — whether HUD controls should be enabled and displayed.
* **Returns:** Nothing.
* **Error states:** None.

### `SetScale(pos, y, z)`
* **Description:** Sets the widget's scale and inversely scales the embedded text to maintain legibility.
* **Parameters:**  
  - `pos` (number | vector) — horizontal scale factor, or a vector with `x`, `y`, `z` components.  
  - `y` (number, optional) — vertical scale factor if `pos` is a number.  
  - `z` (number, optional) — depth scale factor if `pos` is a number.  
* **Returns:** Nothing.

### `OnShow()`
* **Description:** Updates the button's text based on HUD focus and controller presence. Shows the text only if HUD is focused and a controller is attached.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Text is hidden if `hud_focus` is `false` or no controller is attached.

### `CheckControl(control, down)`
* **Description:** Handles controller input for resurrection. Called by `PlayerHud:OnControl`.
* **Parameters:**  
  - `control` (enum) — the control being pressed (e.g., `CONTROL_CONTROLLER_ATTACK`).  
  - `down` (boolean) — whether the control is pressed (`true`) or released (`false`).  
* **Returns:** `true` if the event was consumed (resurrection triggered); otherwise `nil`.
* **Error states:** Returns `nil` if `shown` is `false` or `down` is `false`.

### `DoResurrect()`
* **Description:** Triggers the resurrection action by calling `playercontroller:DoResurrectButton()`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Early return with no effect if `playercontroller` component is missing.

### `SetType(effigy_type)`
* **Description:** Updates the button’s icon, tooltip, and textures based on the resurrection method.
* **Parameters:** `effigy_type` (string or `nil`) — either `"grave"` for Wendy’s resurrection grave, or `nil` for standard effigy.
* **Returns:** Nothing.
* **Error states:** No-op if `effigy_type` is unrecognized (only `"grave"` and `nil` are handled explicitly).

## Events & listeners
- **Listens to:** `continuefrompause` (on `TheWorld`) — triggers `OnShow()` if the button is currently visible, restoring text visibility after resuming from pause.
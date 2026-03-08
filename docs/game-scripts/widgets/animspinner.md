---
id: animspinner
title: Animspinner
description: A UI widget that displays an animated visual indicator for spinner selections, allowing runtime replacement of animation symbols for skinning or item preview.
tags: [ui, animation, skinning]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 7d3a53fd
system_scope: ui
---

# Animspinner

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`AnimSpinner` is a UI widget derived from `Spinner` that renders an animated symbol (e.g., for item or skin previews) in a foreground animation layer. It supports dynamic symbol overriding—either via `OverrideSymbol` or `OverrideSkinSymbol`—to swap animation visuals at runtime based on selection, enabling flexible UI customization such as character skin previews or inventory item displays.

## Usage example
```lua
local AnimSpinner = require "widgets/animspinner"
local spinner = AnimSpinner(options_list, 200, 60, text_info, false, atlas, textures, false, 100, 30)
spinner:SetAnim("frames_comp", "frames_comp", "idle_on", "SWAP_ICON") -- set animation and symbol to override
spinner:SetSelectedIndex(2)
local build, symbol, _ = spinner:GetSelectedSymbol() -- e.g., "my_build", "SWAP_ICON"
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fganim` | UIAnim | (created internally) | Foreground animation widget used to display the animated symbol. |
| `old_symbol` | string or `nil` | `nil` | Name of the symbol in the current animation bank to be overridden. |
| `bank` | string | `""` | Animation bank name used by `fganim`. |
| `anim` | string | `""` | Animation name played in `fganim`. |
| `skin` | boolean | `false` | Whether the override uses skin-specific logic (`OverrideSkinSymbol`). |
| `new_anim` | string or `nil` | `nil` | Optional animation state to play after overriding (e.g., to show a new indicator). |
| `arrow_scale` | number | `1` | Scale factor applied to left/right arrow buttons. |
| `selectedIndex` | number | `0` | Index of the currently selected option in `self.options`. |

## Main functions
### `SetAnim(build, bank, anim, old_symbol, skin, new_anim)`
* **Description:** Configures the foreground animation for the spinner and specifies the symbol to override. Must be called after construction to initialize the visual content.
* **Parameters:**  
  `build` (string) — Name of the build file containing the animation assets.  
  `bank` (string) — Animation bank name.  
  `anim` (string) — Name of the animation to play initially.  
  `old_symbol` (string) — Name of the symbol in the animation to replace dynamically.  
  `skin` (boolean) — `true` to use `OverrideSkinSymbol`, otherwise uses `OverrideSymbol`.  
  `new_anim` (string, optional) — If present, plays this animation after setting up the override (e.g., to show a “new” badge).
* **Returns:** Nothing.

### `Next(noclicksound)`
* **Description:** Advances the spinner to the next selection, wrapping or clamping based on `enableWrap`. Plays sound unless `noclicksound` is true.
* **Parameters:**  
  `noclicksound` (boolean, optional) — If `true`, suppresses the default click sound.
* **Returns:** Nothing.

### `Prev(noclicksound)`
* **Description:** Moves the spinner to the previous selection, wrapping or clamping based on `enableWrap`. Plays sound unless `noclicksound` is true.
* **Parameters:**  
  `noclicksound` (boolean, optional) — If `true`, suppresses the default click sound.
* **Returns:** Nothing.

### `GetSelectedSymbol()`
* **Description:** Returns the build and symbol data for the currently selected item.
* **Parameters:** None.
* **Returns:**  
  `build` (string or `nil`) — Build file name from the selected option.  
  `symbol` (string or `nil`) — Symbol name from the selected option.  
  `new_indicator` (any or `nil`) — Arbitrary value (often boolean) indicating if a new indicator should be shown.

### `SetSelectedIndex(idx)`
* **Description:** Sets the spinner’s selection index, updating text, color, and animation symbol override accordingly. Triggers `Changed` event.
* **Parameters:**  
  `idx` (number) — Desired selection index. Clamped to valid range.
* **Returns:** Nothing.

### `GoToEnd()`
* **Description:** Sets the selection index to the maximum valid index.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetArrowScale(scale)`
* **Description:** Adjusts the visual scale of the spinner’s left and right arrow buttons.
* **Parameters:**  
  `scale` (number) — Uniform scale factor (e.g., `0.8` to shrink).
* **Returns:** Nothing.

## Events & listeners
**Listens to:** None identified.  
**Pushes:** Inherits `Changed` event from `Spinner` (fired on selection change in `SetSelectedIndex` and `Next`/`Prev`).  
*(Note: Events are not declared directly in this file; they originate from `Spinner` or `Widget` base classes.)*
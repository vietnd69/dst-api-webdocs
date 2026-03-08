---
id: newhostpicker
title: Newhostpicker
description: Renders a UI selector for choosing host mode (Alone or Together) in the server creation screen.
tags: [ui, server, selection]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 6dfcae39
system_scope: ui
---

# Newhostpicker

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`NewHostPicker` is a UI widget that presents two mutually exclusive host mode options — "Alone" and "Together" — for server creation. It manages interactive buttons with visual feedback (focus, hover, selection), displays descriptive text when a button is focused, and supports focus navigation and callback-based selection. As a subclass of `Widget`, it integrates into the larger UI hierarchy and is typically instantiated and embedded in the `ServerCreationScreen`.

## Usage example
```lua
local NewHostPicker = require "widgets/redux/newhostpicker"
local picker = CreateWidget(NewHostPicker)
picker:SetCallback(function(mode)
    print("Selected host mode:", mode) -- e.g., "ALONE" or "TOGETHER"
end)
picker:SetFocus(MOVE_RIGHT) -- initial focus
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `buttons` | table of `ImageButton` | `{}` | Array of two `ImageButton` instances representing the host mode options. |
| `description` | `Text` | `nil` | Text widget that displays the current description based on focused button. |
| `headertext` | `Text` | `nil` | Header text showing the localized title ("New Host"). |
| `next_focus` | `ImageButton` or `nil` | `nil` | Temporary storage for forcing focus on a specific button during re-initialization. |
| `cb` | function or `nil` | `nil` | Callback function invoked when a button is clicked; receives the selected `data` string (`"ALONE"` or `"TOGETHER"`). |

## Main functions
### `SetCallback(cb)`
*   **Description:** Sets the callback function to be invoked when a host mode button is clicked.
*   **Parameters:** `cb` (function) — a function that accepts a single string argument (`"ALONE"` or `"TOGETHER"`).
*   **Returns:** Nothing.

### `SetSelected(intention)`
*   **Description:** Prepares the picker to move focus to the button matching the given `intention` on the next call to `SetFocus`. (Note: The code references `intention_options`, but the local `newhost_options` is used; this is likely a typo — behavior assumes `intention` matches one of `newhost_options[i].data`.)
*   **Parameters:** `intention` (string) — expected value `"ALONE"` or `"TOGETHER"`.
*   **Returns:** Nothing.
*   **Error states:** If `intention` does not match any option, no button is queued for focus.

### `SetFocus(direction)`
*   **Description:** Sets keyboard/mouse focus to a button. If `next_focus` was set via `SetSelected`, it takes priority. Otherwise, defaults to leftmost or rightmost button based on `direction`.
*   **Parameters:** `direction` (number) — `MOVE_LEFT` or another direction hint; used only if `next_focus` is `nil`.
*   **Returns:** Nothing.

## Events & listeners
*   **Listens to:** None identified (focus/click events are handled via widget callbacks, not `inst:ListenForEvent`).
*   **Pushes:** None identified.
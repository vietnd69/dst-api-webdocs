---
id: playstylepicker
title: Playstylepicker
description: Renders a horizontal selector of playable world styles with descriptive text, allowing users to choose a world generation preset in the server creation UI.
tags: [ui, selection, worldgen]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 11f7d0d1
system_scope: ui
---

# Playstylepicker

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`PlaystylePicker` is a UI widget that presents a horizontal row of interactive buttons representing available world generation playstyles (e.g., "Survival", "Skyfall", "Little End"). It retrieves playstyle definitions via `Levels.GetPlaystyles()` and `Levels.GetPlaystyleDef()`, creates clickable buttons with icons and labels, and displays dynamic descriptive text when a button gains focus or is clicked. It also supports an optional "Any" fallback option for flexible world selection.

## Usage example
```lua
local picker = CreateWidget("PlaystylePicker", "Select Playstyle", "Any playstyle will be used.")
picker:SetCallback(function(playstyle_id)
    print("Selected playstyle:", playstyle_id)
end)
picker:SetFocus(MOVE_RIGHT) -- Start focus on first button
picker:SetSelected("SURVIVAL") -- Pre-select the Survival playstyle
```

## Dependencies & tags
**Components used:** None (this is a widget, not a component; uses other widgets like `Image`, `Text`, `ImageButton`)
**Tags:** Adds `playstylepicker` tag to its root widget (inherited from `Widget._ctor`), but no entity tags are used.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `buttons` | array of ImageButton | `{}` | Array of playstyle selector buttons, populated at construction. |
| `button_root` | Widget | Created internally | Root container widget for the button row. |
| `headertext` | Text | Created internally | Header text widget displaying the picker's title string. |
| `description` | Text | Created internally | Text widget used to show the description of the currently focused playstyle. |
| `anybutton` | ImageButton or `nil` | `nil` | Optional "Any" button; only created if `any_desc` is provided. |
| `cb` | function or `nil` | `nil` | Callback function set via `SetCallback`, invoked with the selected playstyle ID on click. |
| `next_focus` | ImageButton or `nil` | `nil` | Temporary focus target used by `SetSelected` or `SetFocus`. |

## Main functions
### `SetCallback(cb)`
*   **Description:** Sets the callback function to be invoked when a playstyle button (or the "Any" button) is clicked.
*   **Parameters:** `cb` (function) — a function expecting a single argument: the playstyle ID string (e.g., `"SURVIVAL"` or `PLAYSTYLE_ANY`). May be `nil`.
*   **Returns:** Nothing.

### `SetSelected(playstyle)`
*   **Description:** Sets the keyboard focus to the button corresponding to the given playstyle ID.
*   **Parameters:** `playstyle` (string) — a playstyle ID, such as one returned by `Levels.GetPlaystyles()` or `PLAYSTYLE_ANY`.
*   **Returns:** Nothing. Sets `self.next_focus` internally; the next call to `SetFocus()` will apply this selection.

### `SetFocus(direction)`
*   **Description:** Places keyboard focus on a button: either the one previously set by `SetSelected`, or defaults to the first or last button depending on `direction`.
*   **Parameters:** `direction` (number) — a movement direction constant (e.g., `MOVE_LEFT`, `MOVE_RIGHT`). Used only if `next_focus` is `nil`.
*   **Returns:** Nothing. Calls `SetFocus()` on an `ImageButton` instance.

## Events & listeners
- **Listens to:** None (the widget does not register entity events).
- **Pushes:** None (the widget does not push events via `inst:PushEvent`).
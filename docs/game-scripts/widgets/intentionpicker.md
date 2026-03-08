---
id: intentionpicker
title: Intentionpicker
description: A UI widget that lets players select a server intention (Social, Cooperative, Competitive, or Madness) via interactive buttons.
tags: [ui, server, selection]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: bdcf1f30
system_scope: ui
---

# Intentionpicker

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`IntentionPicker` is a UI widget that presents a horizontal row of clickable buttons representing server intention options. Each button displays an icon, localized text, and a descriptive description on focus. It supports keyboard/gamepad navigation and optional "Any" selection mode. This component is typically used in server configuration or lobby UIs to let players agree on gameplay tone before world generation.

## Usage example
```lua
local picker = CreateWidget(IntentionPicker, "Choose Intention", {
    SOC = "Interact with others openly.",
    COOP = "Work together to survive.",
    COMP = "Compete for resources and goals.",
    MAD = "Embrace chaos and unpredictability.",
    ANY = "Let others decide the server style.",
}, true)

picker:SetCallback(function(intention)
    print("Selected intention:", intention)
end)
picker:SetFocus(MOVE_RIGHT)
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `buttons` | table | `{}` | Array of `ImageButton` widgets representing intention options. |
| `headertext` | `Text` | `nil` | Header label widget displaying the picker's title. |
| `description` | `Text` | `nil` | Text widget that shows the description of the currently focused button. |
| `anybutton` | `ImageButton` | `nil` | Optional "Any" button, only present if `allowany` is `true`. |
| `cb` | function | `nil` | Callback function invoked when a button is clicked or selected. |
| `next_focus` | `ImageButton` or `nil` | `nil` | Button to receive focus next, used for forced focus placement. |

## Main functions
### `SetCallback(cb)`
*   **Description:** Registers a callback function to be invoked when a button is clicked.
*   **Parameters:** `cb` (function) — function accepting one argument: the selected intention constant (`INTENTIONS.SOC`, `INTENTIONS.COOP`, etc., or `INTENTIONS.ANY`).
*   **Returns:** Nothing.

### `SetSelected(intention)`
*   **Description:** Sets the next focus to the button matching the specified intention constant.
*   **Parameters:** `intention` (string) — one of the `INTENTIONS.*` constants.
*   **Returns:** Nothing.

### `SetFocus(direction)`
*   **Description:** Sets keyboard/gamepad focus to either the first or last button, or to a previously scheduled button via `SetSelected`.
*   **Parameters:** `direction` (number) — `MOVE_LEFT` or `MOVE_RIGHT`; ignored if `next_focus` is set.
*   **Returns:** Nothing.

## Events & listeners
- **Pushes:** None identified.

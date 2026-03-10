---
id: achievementspopup
title: Achievementspopup
description: Renders a festival-specific achievements popup screen with dynamic panel selection, level badge, and colour-cube post-processing for Quagmire and Lava Arena events.
tags: [ui, screen, festival, achievements]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: cda51969
system_scope: ui
---

# Achievementspopup

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`AchievementsPopup` is a screen component that displays festival-specific achievements and progress. It dynamically selects and initializes a panel widget (`AchievementsPanel`, `QuagmireBookWidget`, or `LavaarenaBookWidget`) based on the `festival_key` and `season` passed to its constructor. The screen also sets up visual elements such as the event title text, a festival rank badge, and optional post-processing colour cube effects for specific events.

## Usage example
```lua
-- Example usage within TheFrontEnd stack
local screen = AchievementsPopup(prev_screen, FESTIVAL_EVENTS.QUAGMIRE, 1)
TheFrontEnd:PushScreen(screen)
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None added, removed, or checked.

## Properties
No public properties.

## Main functions
### `DoInit()`
*   **Description:** Initializes the screen UI layout, including background, title text, rank badge, and the appropriate achievements panel based on festival type and season. Handles positioning adjustments for different events.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Prints a warning to the console if `self.festival_key` is not recognized (`FESTIVAL_EVENTS.LAVAARENA` or `FESTIVAL_EVENTS.QUAGMIRE`).

### `OnControl(control, down)`
*   **Description:** Handles input events; specifically triggers screen dismissal when the cancel control (e.g., Esc or B) is released.
*   **Parameters:**
    *   `control` (control enum) — the control key pressed.
    *   `down` (boolean) — whether the control was pressed (`true`) or released (`false`).
*   **Returns:** `true` if the event was handled; `false` otherwise.

### `GetHelpText()`
*   **Description:** Returns localized help text indicating how to close the screen (e.g., "Esc Back").
*   **Parameters:** None.
*   **Returns:** `string` — localized instruction for returning to the previous screen.

### `_Close()`
*   **Description:** Closes the popup screen by popping it from `TheFrontEnd`'s screen stack.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
None.
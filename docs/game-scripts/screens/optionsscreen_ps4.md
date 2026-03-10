---
id: optionsscreen_ps4
title: Optionsscreen Ps4
description: Manages the PS4-specific options menu screen, handling player-configurable settings like volume, UI size, vibration, and screen shake.
tags: [ui, settings, platform]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 43a059b4
system_scope: ui
---

# Optionsscreen Ps4

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`OptionsScreen` is a screen widget that presents a PS4-specific settings interface for adjusting audio (volume), HUD scale, vibration, autosave, screen shake, and (in RoG DLC) the Wathgrithr font. It inherits from `Screen` and manages local state (`self.working`) separately from persisted profile state (`self.options`) until the user explicitly applies changes. It integrates with `TheMixer`, `Profile`, and platform-specific services (`TheInputProxy`, `TheSystemService`) to apply and persist adjustments.

## Usage example
```lua
-- Push the options screen to the front-end
TheFrontEnd:PushScreen(OptionsScreen(false)) -- false = not in-game
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds none; interacts with `TheFrontEnd`, `TheMixer`, `Profile`, `TheInputProxy`, `TheSystemService`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `in_game` | boolean | — | Indicates if the screen was opened from within a game session. |
| `options` | table | Populated from `Profile` | Stores *persisted* settings (read from `Profile` on init). |
| `working` | table | Deep copy of `options` | Stores *working* (unsaved) settings modified via UI controls. |
| `grid` | `Grid` | — | Main layout container for spinner groups. |
| `display_area` | `Widget` | — | Container for the display-safe-area adjustment button. |

## Main functions
### `OnControl(control, down)`
*   **Description:** Handles PS4 controller input for back/accept actions. Checks if changes are pending and triggers revert or apply prompts accordingly.
*   **Parameters:** `control` (number) — control code; `down` (boolean) — whether the control was pressed.
*   **Returns:** `true` if the control was handled, otherwise `false`.
*   **Error states:** N/A.

### `Save(cb)`
*   **Description:** Commits `self.working` to `Profile` settings and persists them to disk. Optionally invokes callback `cb` after save completes.
*   **Parameters:** `cb` (function?, optional) — function to execute after saving.
*   **Returns:** Nothing.
*   **Error states:** None documented.

### `RevertChanges()`
*   **Description:** Discards unsaved changes by reloading `self.options` into `self.working`, re-applies current (unchanged) settings, and reinitializes UI spinners.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `IsDirty()`
*   **Description:** Compares `self.working` against `self.options` to determine if any settings have been modified but not yet saved.
*   **Parameters:** None.
*   **Returns:** `true` if any setting differs; otherwise `false`.

### `ConfirmApply()`
*   **Description:** Opens a confirmation dialog before applying and saving changes. If confirmed, applies changes, saves profile, then navigates back.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ConfirmRevert()`
*   **Description:** Opens a confirmation dialog before reverting unsaved changes. If confirmed, reverts settings and pops the dialog screen.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Apply(force)`
*   **Description:** Immediately applies all working settings (e.g., volume, vibration, screenshake, font) without saving to disk.
*   **Parameters:** `force` (any, unused).
*   **Returns:** Nothing.

### `CreateSpinnerGroup(text, spinner)`
*   **Description:** Wraps a spinner widget in a `Widget` container with a right-aligned label for use in the option grid.
*   **Parameters:** `text` (string) — label text; `spinner` (`Spinner`/`NumericSpinner`) — the spinner widget.
*   **Returns:** `Widget` — container widget with label and spinner.

### `InitializeSpinners()`
*   **Description:** Sets each spinner’s selected index to match current `working` values, including volume rounds (nearest integer).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnAdjustDisplayArea()`
*   **Description:** Invokes system service to open PS4’s display safe-area adjustment utility.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Back()`
*   **Description:** Navigates away from the screen by popping it from `TheFrontEnd`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Accept()`
*   **Description:** Applies and saves changes, then closes the screen (i.e., `Save()` → `Close()`).
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
**Listens to:** None (relies on `Screen` base class for event wiring).  
**Pushes:** None.
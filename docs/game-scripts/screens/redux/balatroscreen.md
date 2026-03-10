---
id: balatroscreen
title: Balatroscreen
description: Manages the UI screen for the Balatro minigame, handling layout, audio context, and lifecycle events.
tags: [ui, minigame, audio]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 6a01563f
system_scope: ui
---

# Balatroscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`BalatroScreen` is a UI screen component that displays and manages the Balatro minigame interface. It inherits from `Screen` and constructs a layered UI hierarchy with a semi-transparent black overlay, a root layout container, and a `BalatroWidget` instance. It integrates with the audio mixer for background music and sound context, and manages per-player card sound muting during gameplay.

## Usage example
```lua
-- Typically instantiated internally by the minigame flow
local screen = BalatroScreen(owner, target, jokers, cards)
FRONTEND:PushScreen(screen)
```

## Dependencies & tags
**Components used:** None directly accessed via `inst.components.X`.
**Tags:** None added or checked.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity or `nil` | `nil` | The player entity that owns the screen (used for music triggering). |
| `target` | entity or `nil` | `nil` | The target entity whose local card sounds should be muted during the screen. |
| `game` | `BalatroWidget` or `nil` | `nil` | The primary widget managing the Balatro gameplay logic. |
| `blackoverlay` | `Image` | `nil` | Full-screen semi-transparent black overlay used for dimming background UI. |
| `root` | `Widget` | `nil` | Root layout container for screen elements. |
| `default_focus` | `Widget` | `self.game` | Widget that receives default input focus. |

## Main functions
### `OnDestroy()`
*   **Description:** Cleans up the screen on destruction — restores card sound muting, pops the audio mix, prints the final score for debugging, closes the Balatro popup, and calls parent cleanup.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnBecomeInactive()`
*   **Description:** Deactivates the screen; delegates to parent class behavior.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnBecomeActive()`
*   **Description:** Activates the screen; delegates to parent class behavior.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `TryToCloseWithAnimations()`
*   **Description:** Attempts to close the screen using Balatro's animation if the game widget exists; otherwise immediately pops the screen from the frontend stack.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnControl(control, down)`
*   **Description:** Handles input control events. Delegates to parent class first; returns `true` if handled, `false` otherwise.
*   **Parameters:**  
    - `control` (string or number) – The control identifier (e.g., `"accept"`, `"cancel"`).  
    - `down` (boolean) – Whether the control was pressed (`true`) or released (`false`).
*   **Returns:** `boolean` – `true` if the event was handled, `false` otherwise.

### `GetHelpText()`
*   **Description:** Returns the help text for the current controller configuration. Currently returns an empty string as no help text is defined.
*   **Parameters:** None.
*   **Returns:** `string` – Always returns an empty string (`""`) in current implementation.

## Events & listeners
- **Listens to:** None explicitly via `inst:ListenForEvent`.
- **Pushes:** None explicitly via `inst:PushEvent`.
- **Uses internal event push (in `UpdateBalatroMusic`):** `playbalatromusic` – pushed periodically on the owner entity if present.
- **Uses internal event push (in `OnDestroy`):** `POPUPS.BALATRO:Close(self.owner)` – closes the Balatro popup.
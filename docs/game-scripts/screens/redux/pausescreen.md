---
id: pausescreen
title: Pausescreen
description: Manages the in-game pause menu interface, including server pausing, options access, scrapbook navigation, and disconnect handling.
tags: [ui, pause, network]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 11126e10
system_scope: ui
---

# Pausescreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`PauseScreen` is a UI screen component that presents the player with options when the game is paused. It handles rendering the menu, managing server pause state (for hosts), navigating to sub-screens (Options, Scrapbook), and confirming disconnections. It extends `Screen` and integrates with `TheFrontEnd`, `TheNet`, `TheInput`, and `Profile` systems.

## Usage example
```lua
-- Typically instantiated and pushed by the framework when the pause control is triggered:
TheFrontEnd:PushScreen(PauseScreen())

-- Internal methods manage menu behavior and state transitions:
inst.components.pausescreen = PauseScreen()
inst:AddComponent("pausescreen") -- (Not a standard pattern; pause screen is UI-level, not entity-attached)
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `active` | boolean | `true` | Indicates whether the pause screen is currently active and enforcing pause state. |
| `owner` | entity | `ThePlayer` | The player instance for whom the pause menu is opened. |
| `pause_button_index` | number or `nil` | `nil` | Index of the server pause/unpause button in the menu, if applicable. |
| `options_button_index` | number or `nil` | `nil` | Index of the Options menu button (used for focus restoration). |
| `scrapbook_button_index` | number or `nil` | `nil` | Index of the Scrapbook button (used for focus restoration). |
| `will_autopause` | boolean or `nil` | `nil` | Temporary flag indicating if auto-pause should be considered during build. |
| `popped_autopause` | boolean | `false` | Tracks whether auto-pause was disabled during session to avoid double-disabling. |

## Main functions
### `BuildMenu()`
* **Description:** Constructs or rebuilds the pause menu interface, including buttons for Player Status, Server Pause, Server Actions (admin-only), Options, Issue Report, Scrapbook, Disconnect, and Close.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** If a menu already exists, it is destroyed and rebuilt; `last_focus` is restored only on rebuild.

### `UpdateText()`
* **Description:** Updates the menu title and body text, as well as the pause button label, based on whether the server is paused or auto-paused.
* **Parameters:** None.
* **Returns:** Nothing.

### `PauseText()`
* **Description:** Sets the title to `PAUSED_DST_TITLE` or `AUTOPAUSED_DST_TITLE`, updates body subtitle, and changes the pause button text to `UNPAUSE_SERVER` (if server is manually paused) or `PAUSE_SERVER`.
* **Parameters:** None.
* **Returns:** Nothing.

### `UnpauseText()`
* **Description:** Restores default title (`DST_TITLE`) and body (`DST_SUBTITLE`) and sets the pause button text back to `PAUSE_SERVER`.
* **Parameters:** None.
* **Returns:** Nothing.

### `ToggleServerPause()`
* **Description:** Toggles the server pause state by calling `SetServerPaused()`.
* **Parameters:** None.
* **Returns:** Nothing.

### `unpause()`
* **Description:** Resumes gameplay by unpause state, destroys the pause screen, caches the controller (to restore input), and fires the `"continuefrompause"` event on the world.
* **Parameters:** None.
* **Returns:** Nothing.

### `doconfirmquit()`
* **Description:** Prompts the user with a confirmation dialog before quitting (host: requires confirmation from all players; client: immediate quit after confirmation). Handles Japanese PS4 font sizing adjustments.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles controller or keyboard input; responds to `CONTROL_PAUSE` or `CONTROL_CANCEL` (e.g., Escape) by calling `unpause()`.
* **Parameters:** `control` (string) — input control constant; `down` (boolean) — `true` if pressed, `false` if released.
* **Returns:** `true` if handled, `false` otherwise.

### `OnUpdate(dt)`
* **Description:** While `active`, continuously sets pause state to `true` via `SetPause(true)`.
* **Parameters:** `dt` (number) — delta time since last frame.
* **Returns:** Nothing.

### `OnBecomeActive()`
* **Description:** Called when the screen becomes active; hides the top fade effect to prevent visual obstruction of the pause menu.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnDestroy()`
* **Description:** Ensures auto-pause is disabled exactly once during destruction if not already disabled during quit.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetHelpText()`
* **Description:** Returns localized help text for the close/exit action (e.g., "ESC Close").
* **Parameters:** None.
* **Returns:** `string` — help text string.

## Events & listeners
- **Listens to:** `serverpauseddirty` (on `TheWorld`) — triggers `UpdateText()` when server pause state changes.
- **Pushes:** None. (However, `unpause()` calls `TheWorld:PushEvent("continuefrompause")`.)
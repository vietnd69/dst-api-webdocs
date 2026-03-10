---
id: networkloginpopup
title: Networkloginpopup
description: Displays a modal UI screen for handling network login progress and user cancellation during the login flow.
tags: [ui, network, modal]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: ba2a514d
system_scope: ui
---

# Networkloginpopup

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`NetworkLoginPopup` is a UI screen component that presents a modal dialog during network login attempts. It provides visual feedback (via an animated ellipsis) while waiting for the account manager to respond and offers the user options to proceed offline or cancel the login. It extends `Screen` and integrates with the `TheFrontEnd` and `TheInventory` systems to monitor login progress and handle user input.

## Usage example
```lua
local NetworkLoginPopup = require "screens/networkloginpopup"

TheFrontEnd:PushScreen(NetworkLoginPopup(
    function(forceOffline)
        -- called on login success or offline fallback
        print("Login completed, offline:", forceOffline)
    end,
    function()
        -- called when user cancels
        print("Login cancelled")
    end,
    false -- show offline button
))
```

## Dependencies & tags
**Components used:** `TheFrontEnd`, `TheInventory`, `TheFrontEnd:GetAccountManager()`, `TheInventory:IsDownloadingInventory()`  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `black` | `Image` | — | Fullscreen dark overlay for focus. |
| `proot` | `Widget` | — | Root widget container for proportional scaling. |
| `bg` | `Widget` (from template) | — | Background container (curly window). |
| `title` | `Text` | empty string | Title text (currently unused, always empty). |
| `text` | `Text` | `STRINGS.UI.NOTIFICATION.LOGIN` | Dynamic status text with animated ellipsis. |
| `menu` | `Menu` | — | Container for action buttons. |
| `buttons` | table | — | List of button configs (text + callback). |
| `default_focus` | `Menu` | — | Sets menu as default input focus. |
| `time` | number | `0` | Accumulator for ellipsis animation timing. |
| `progress` | number | `0` | Current ellipsis step (1–3). |
| `onLogin` | function | — | Callback invoked on login completion or offline fallback. |
| `onCancel` | function | — | Callback invoked on user cancellation. |
| `logged` | boolean | `false` | Internal flag indicating login has been handled. |

## Main functions
### `OnUpdate(dt)`
*   **Description:** Updates the ellipsis animation and checks login state; automatically completes login if no longer waiting or downloading.  
*   **Parameters:** `dt` (number) — time elapsed since last frame.  
*   **Returns:** Nothing.  
*   **Error states:** None. Progress animation resets after `progress > 3`.

### `OnControl(control, down)`
*   **Description:** Handles user input, particularly `CONTROL_CANCEL` to trigger cancellation. Delegates base screen input handling first.  
*   **Parameters:**  
  - `control` (string) — the control key pressed.  
  - `down` (boolean) — whether the control is pressed (`true`) or released (`false`).  
*   **Returns:** `true` if input was consumed, otherwise `false`.  
*   **Error states:** Only triggers `OnCancel()` on release of `CONTROL_CANCEL` (`down == false`).

### `OnLogin(forceOffline)`
*   **Description:** Finalizes the login process, disabling the screen and invoking the `onLogin` callback. Supports optional offline mode.  
*   **Parameters:** `forceOffline` (boolean, optional) — if `true`, explicitly cancels online login and proceeds offline.  
*   **Returns:** Nothing.  
*   **Error states:** If `logged` is already `true`, the function returns early without side effects.

### `OnCancel()`
*   **Description:** Cancels the active login attempt, discards the screen, and invokes the `onCancel` callback.  
*   **Parameters:** None.  
*   **Returns:** Nothing.  
*   **Error states:** Ensures `CancelLogin()` is called on the account manager and the screen is popped from the frontend stack.

## Events & listeners
- **Listens to:** `CONTROL_CANCEL` — triggers `OnCancel()` when released.  
- **Pushes:** None identified.
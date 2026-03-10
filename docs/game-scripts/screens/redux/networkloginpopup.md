---
id: networkloginpopup
title: Networkloginpopup
description: Displays a waiting dialog during network login and inventory synchronization, handling login/cancellation callbacks and updating UI text based on progress state.
tags: [ui, network, account, inventory]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 1bf21a48
system_scope: ui
---

# Networkloginpopup

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`NetworkLoginPopup` is a UI screen component that inherits from `GenericWaitingPopup` and provides a modal dialog during the account login and inventory download process. It monitors the account manager's login state and the inventory system's download progress, updating the dialog title to reflect the current step on console platforms. It manages callback execution for successful login or cancellation and cancels ongoing operations on exit.

## Usage example
```lua
local NetworkLoginPopup = require "screens/redux/networkloginpopup"

local popup = NetworkLoginPopup(
    function(forceOffline)
        -- Handle successful login (forceOffline = true if offline play selected)
    end,
    function()
        -- Handle cancelled login
    end,
    false -- hideOfflineButton
)
TheFrontEnd:PushScreen(popup)
```

## Dependencies & tags
**Components used:** `TheFrontEnd:GetAccountManager()`, `TheInventory`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `onLogin_cb` | function | `nil` | Callback invoked on successful login or offline fallback. Receives `forceOffline` boolean argument. |
| `onCancel_cb` | function | `nil` | Callback invoked when user cancels the login process. |
| `inventory_step` | number | `INVENTORY_PROGRESS.IDLE` | Tracks the last displayed inventory progress step (console only). |
| `logged` | boolean | `false` | Internal flag indicating whether login has already been processed. |

## Main functions
### `:OnUpdate(dt)`
*   **Description:** Updates the popup state each frame. Monitors login status and inventory download progress, updating the dialog title on console platforms to reflect the current step (e.g., `CHECK_SHOP`, `CHECK_INVENTORY`). Automatically triggers `OnLogin()` when login completes and inventory download finishes.
*   **Parameters:** `dt` (number) - Delta time since last frame.
*   **Returns:** Nothing.

### `:OnLogin(forceOffline)`
*   **Description:** Finalizes the login process. Disables the popup, stops updates, cancels pending operations if `forceOffline` is true, and invokes the `onLogin_cb` callback.
*   **Parameters:** `forceOffline` (boolean, optional) - If `true`, cancels network login and inventory download to allow offline play.
*   **Returns:** Nothing.
*   **Error states:** Executes only once; subsequent calls are ignored due to `self.logged` guard.

### `:OnCancel()`
*   **Description:** Handles user cancellation. Disables the popup, cancels network login and inventory download, pops the current screen, and invokes the `onCancel_cb` callback.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.
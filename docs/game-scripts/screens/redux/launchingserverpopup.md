---
id: launchingserverpopup
title: Launchingserverpopup
description: Manages the UI state and logic while waiting for a dedicated server to start, transition through world generation, and respond to success or failure outcomes.
tags: [ui, network, server]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 43227cc2
system_scope: ui
---

# Launchingserverpopup

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`LaunchingServerPopup` is a screen component that displays a waiting interface during the launch and initialization of a dedicated server. It extends `GenericWaitingPopup` and monitors the server process status via `TheNet:GetChildProcessStatus()` and error states via `TheNet:GetChildProcessError()`. Upon detecting completion (status `3`) or failure (error or status `0`/`1`), it triggers the appropriate callback and removes itself from the UI stack.

## Usage example
```lua
local popup = LaunchingServerPopup(
    serverinfo,
    function(info) print("Server started:", info.name) end,
    function() print("Server failed to start") end
)
TheFrontEnd:PushScreen(popup)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `serverinfo` | table | `nil` | Server configuration data passed to `successCallback` on successful launch. |
| `successCallback` | function | `nil` | Callback invoked when the server reaches ready status (`status == 3`). |
| `errorCallback` | function | `nil` | Callback invoked when an error is detected (`hasError == true`). |
| `launchtime` | number | `GetStaticTime()` | Timestamp when the popup is instantiated. |
| `errorStartingServers` | boolean | `false` | Internal flag set via `SetErrorStartingServers()` to force error state. |
| `worldgenscreen` | Screen or `nil` | `nil` | Placeholder reference; commented-out code suggests potential usage but is unused in current build. |

## Main functions
### `OnUpdate(dt)`
*   **Description:** Periodically checks the server process status and error state. Updates the dialog title during world generation and triggers callbacks or screen removal based on status changes.
*   **Parameters:** `dt` (number) — time elapsed since last frame.
*   **Returns:** Nothing.
*   **Error states:** Performs screen removal and callback invocation under three conditions:
    *   `hasError` is `true`: calls `errorCallback()`, pops itself and optionally `worldgenscreen`.
    *   `status == 2`: updates dialog title to `"SERVER_WORLDGEN"`.
    *   `status == 3`: calls `successCallback(serverinfo)`, pops itself.

### `OnCancel()`
*   **Description:** Handles user-initiated cancellation. Stops all dedicated servers and removes the screen.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetErrorStartingServers()`
*   **Description:** Sets the internal `errorStartingServers` flag to `true`, forcing the popup to treat the next `OnUpdate` cycle as an error state.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
None identified
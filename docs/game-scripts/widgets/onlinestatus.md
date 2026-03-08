---
id: onlinestatus
title: Onlinestatus
description: Displays the current online status and family-sharing indication on the main screen UI.
tags: [ui, network]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 1f129c21
system_scope: ui
---

# Onlinestatus

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`OnlineStatus` is a UI widget that dynamically displays the player's current online status—such as offline, family-shared, or connected—as text on the main screen. It extends `Widget` and updates its display based on network state checks (`TheSim:IsBorrowed()`, `TheFrontEnd:GetIsOfflineMode()`, `TheSim:IsLoggedOn()`, `TheNet:IsOnlineMode()`, and `TheNet:GetIsServer()`). It is intended for use in the main menu or persistent UI contexts.

## Usage example
```lua
-- Create and show the online status widget
local online_status = OnlineStatus(true)  -- enable borrowed info
online_status:Show()
-- The widget automatically updates its text via OnUpdate() when added to the UI tree
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `show_borrowed_info` | boolean | `false` | Controls whether family-sharing status is displayed. |
| `fixed_root` | Widget | `nil` | Root widget container with proportional scaling and centered anchors. |
| `text` | Text | `nil` | Main display text for status messages (positioned at (378, 345)). |
| `debug_connections` | Text | `nil` | Optional debug text (visible only in dev builds) showing connection state. |

## Main functions
### `OnUpdate()`
* **Description:** Updates the displayed status text based on the current network state. This method is called periodically when the widget is active.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None. Behavior is deterministic based on runtime state.

## Events & listeners
Not applicable.
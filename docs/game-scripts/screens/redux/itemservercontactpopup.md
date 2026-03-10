---
id: itemservercontactpopup
title: Itemservercontactpopup
description: Displays a waiting dialog while the game contacts the item server during startup.
tags: [ui, network, startup]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 5dd0d548
system_scope: ui
---

# Itemservercontactpopup

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`ItemServerContactPopup` is a UI screen that extends `GenericWaitingPopup` to show a modal dialog while the client establishes contact with the item server — typically during game launch or session initialization. It presents a localized "Connecting..." message and automatically dismisses upon successful connection or user cancellation.

## Usage example
```lua
local ItemServerContactPopup = require "screens/redux/itemservercontactpopup"
local popup = ItemServerContactPopup()
TheFrontEnd:PushScreen(popup)
-- The popup is automatically dismissed by internal logic upon connection success or cancel
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `text` | `string` or `Widget` | `self.dialog.body` | Reference to the dialog's body text component for potential updates (not actively modified in current code). |

## Main functions
### `Close()`
* **Description:** Immediately cancels the popup and triggers its internal cancellation handler (`OnCancel`), typically used to abort the item server connection attempt.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified
---
id: hostcloudserverpopup
title: HostCloudServerPopup
description: Manages the UI popup shown while requesting and connecting to a cloud server for a festival event.
tags: [ui, network, server]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 53b01493
system_scope: network
---

# HostCloudServerPopup

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`HostCloudServerPopup` is a UI screen component that displays status messages during the process of hosting a cloud server for a festival event. It extends `GenericWaitingPopup` and shows localized progress phases (determining region, requesting server, connecting) while invoking `TheNet:StartCloudServerRequestProcess` to initiate the network request. It monitors the cloud server request state and transitions to error or success states accordingly.

## Usage example
```lua
local HostCloudServerPopup = require "screens/redux/hostcloudserverpopup"
local popup = HostCloudServerPopup("My Server", "A fun server", "password", { id = "clan123", only = false, admin = false })
TheFrontEnd:PushScreen(popup)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `status_msg` | Text widget | `nil` | Label displaying the current stage of server provisioning. |
| `dialog.title` | Text widget | Modified in constructor | Title label showing formatted header `"HOST - <name>"`. |

## Main functions
### `OnUpdate(dt)`
* **Description:** Called every frame to check the cloud server request state and update the status message or trigger an error if the request fails.  
* **Parameters:** `dt` (number) – time elapsed since the last frame.  
* **Returns:** Nothing.  
* **Error states:** If `TheNet:GetCloudServerRequestState()` returns `4`, `5`, or `6`, the `OnError` method is invoked with a corresponding localized error message.

### `OnError(body)`
* **Description:** Handles failure of the cloud server request. Disables the popup, stops updates, and shows a `PopupDialogScreen` with an error message before popping itself.  
* **Parameters:** `body` (string?) – optional error message body; defaults to `STRINGS.UI.FESTIVALEVENTSCREEN.HOST_FAILED_BODY` if `nil`.  
* **Returns:** Nothing.

### `OnCancel()`
* **Description:** Handles user cancellation of the cloud server request. Cancels the ongoing request, notifies the net layer of the cancellation, disconnects, and invokes the base class cancel behavior.  
* **Parameters:** None.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified
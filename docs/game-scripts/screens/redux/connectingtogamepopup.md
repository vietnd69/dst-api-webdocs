---
id: connectingtogamepopup
title: ConnectingToGamePopup
description: Displays a waiting popup during server connection and handles user cancellation of the join request.
tags: [ui, network, migration]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 66e7b8cd
system_scope: ui
---

# ConnectingToGamePopup

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`ConnectingToGamePopup` is a UI screen component that extends `GenericWaitingPopup` and is displayed while the client attempts to connect to a dedicated server. It provides visual feedback to the player during the connection process and implements custom cancellation logic that aborts the join attempt, disconnects the network session, and optionally restarts the game if a shard migration is in progress.

## Usage example
```lua
-- This component is instantiated and managed by the UI system.
-- It is typically pushed as a screen via TheFrontEnd:PushScreen("connectingtogamepopup")
-- when a server join operation begins.
-- Manual instantiation is not recommended; use TheFrontEnd API instead.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `OnCancel()`
*   **Description:** Handles user-initiated cancellation of the pending server connection. Disables the popup, cancels the join request, disconnects the network session, pops the screen from the frontend, stops any dedicated server processes, and triggers a game restart if shard migration is active.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
None identified
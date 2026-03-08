---
id: friendsmanager
title: Friendsmanager
description: Manages the UI panel for viewing friends, joining parties, and chatting in multiplayer sessions.
tags: [ui, network, multiplayer]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: d0eab39f
system_scope: ui
---

# Friendsmanager

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`FriendsManager` is a UI widget component responsible for rendering and managing the friends and party interface. It provides tabs for viewing online friends, managing party membership, displaying party chat history, and handling incoming party invites. It integrates with `TheNet` to fetch network state and trigger party-related actions like inviting, joining, leaving, and chatting.

## Usage example
```lua
local GetFriendsManager = require("widgets/friendsmanager")
local fm = GetFriendsManager()
fm:Show()
fm:SwitchToPartyTab()
```

## Dependencies & tags
**Components used:** None (this is a widget, not an entity component).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `windowwidth` | number | `220` | Total width of the manager window in pixels. |
| `windowheight` | number | `360` | Total height of the manager window in pixels. |
| `margin` | number | `20` | Outer margin around the window. |
| `padding` | number | `10` | Inner padding for content area. |
| `lineheight` | number | `14` | Vertical spacing unit for text elements. |
| `buttonheight` | number | `28` | Height reserved for tab buttons. |
| `contentwidth` | number | `190` | Width of the content area (`windowwidth - 2 * padding`). |
| `contentheight` | number | `262` | Height of the content area (`windowheight - 2 * padding - buttonheight`). |
| `tab` | string | `"friends"` or `"party"` | Current active tab (`"friends"` or `"party"`). |
| `friendstab` | `FriendsTab` widget | — | Reference to the friends tab sub-widget. |
| `partytab` | `PartyTab` widget | — | Reference to the party tab sub-widget. |

## Main functions
### `SwitchToFriendsTab()`
* **Description:** Switches the active view to the friends tab. Hides the party tab and shows the friends tab if the manager is visible.
* **Parameters:** None.
* **Returns:** Nothing.

### `SwitchToPartyTab()`
* **Description:** Switches the active view to the party tab. Hides the friends tab and shows the party tab if the manager is visible.
* **Parameters:** None.
* **Returns:** Nothing.

### `ReceiveInvite(inviter, partyid)`
* **Description:** Handles an incoming party invite by displaying it in the party tab. If successful, it switches to the party tab to show the invite.
* **Parameters:**  
  `inviter` (string) — Name of the player who sent the invite.  
  `partyid` (number) — Unique identifier for the party being invited to.  
* **Returns:** Nothing.

### `ReceivePartyChat(chatline)`
* **Description:** Appends a party chat message to the chat history display in the party tab.
* **Parameters:**  
  `chatline` (table) — A table containing `name` (string) and `message` (string) keys, with optional `netid`.  
* **Returns:** Nothing.

### `RefreshFriendsTab()`
* **Description:** Forces the friends tab to immediately refresh its list of friends by fetching from `TheNet`.
* **Parameters:** None.
* **Returns:** Nothing.

### `RefreshPartyTab()`
* **Description:** Forces the party tab to immediately refresh its party list and chat history.
* **Parameters:** None.
* **Returns:** Nothing.

### `Kill()`
* **Description:** Removes this widget from its parent and hides it. Typically used on manager shutdown or reinitialization.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
* **Listens to:** None (this widget does not register `inst:ListenForEvent` calls; it responds to `TheNet` events indirectly via `TheNet:GetPartyTable()`, `TheNet:GetFriendsList()`, etc.).
* **Pushes:** None (this widget does not fire custom events via `inst:PushEvent`).

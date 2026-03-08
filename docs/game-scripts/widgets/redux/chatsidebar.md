---
id: chatsidebar
title: Chatsidebar
description: Manages the UI layout and input handling for the lobby chat sidebar, including the chat message input box, chat message history display, and player list panel.
tags: [ui, lobby, chat, input]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 09b7c3b0
system_scope: ui
---

# Chatsidebar

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ChatSidebar` is a UI widget that implements the lobby chat interface in Don't Starve Together. It organizes the chat input area, chat message history, and player list vertically, handles text input and submission, and manages focus navigation between the player list and chat input. It inherits from `Widget` and integrates with `LobbyChatQueue`, `PlayerList`, and standard input handling.

## Usage example
```lua
local ChatSidebar = require "widgets/redux/chatsidebar"
local sidebar = ChatSidebar()
-- Typically added to the frontend or parent widget hierarchy
-- The sidebar automatically positions itself and initializes its child widgets
-- No further manual setup is required for standard use.
```

## Dependencies & tags
**Components used:** None (pure UI widget with no entity components).
**Tags:** Adds no tags to entities.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `active_tab` | string | `"players"` | Tracks the currently active sidebar tab (currently only `"players"` or `"chat"` are implied). |
| `chatbox` | Widget | `nil` | Parent widget containing the chat input textbox and send button. Set during `MakeTextEntryBox`. |
| `chat_pane` | Widget | `nil` | Container widget for the chat input and message queue. Set during `BuildChatWindow`. |
| `chatqueue` | LobbyChatQueue | `nil` | Chat message history display. Set during `BuildChatWindow`. |
| `default_focus` | Widget | `self.chatbox` | Specifies the initial focus target. |
| `playerList` | PlayerList | `nil` | Player list panel. Set during `BuildSidebar`. |

## Main functions
### `BuildSidebar()`
* **Description:** Initializes and positions the player list and chat windows. Called once during construction.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None identified.

### `MakeTextEntryBox(parent)`
* **Description:** Constructs the chat input field, including the `StandardSingleLineTextEntry` textbox, send button, and associated event handlers (e.g., `OnTextEntered`). Configures text length limits and word prediction.
* **Parameters:** `parent` (Widget) — the parent widget to which the chatbox is added.
* **Returns:** Nothing. Sets `self.chatbox` internally.
* **Error states:** None identified.

### `BuildChatWindow()`
* **Description:** Sets up the chat pane container, creates the text entry box, initializes the `LobbyChatQueue`, and positions all elements.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None identified.

### `IsChatting()`
* **Description:** Checks whether the chat input textbox currently has focus and is in editing mode.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if the textbox is being edited, `false` otherwise.

### `OnControl(control, down)`
* **Description:** Handles control inputs (keyboard/controller) for navigation and chat interaction. Prioritizes routing controls to the chat input textbox when focused or active.
* **Parameters:** 
  * `control` (number) — the input control identifier (e.g., `CONTROL_ACCEPT`, `CONTROL_SCROLLBACK`).
  * `down` (boolean) — whether the control is pressed (`true`) or released (`false`).
* **Returns:** `boolean` — `true` if the control was consumed, `false` otherwise.

### `DoFocusHookups()`
* **Description:** Configures directional focus navigation between the player list and chatbox.
* **Parameters:** None.
* **Returns:** Nothing. Calls `BuildPlayerList` internally after hookups.

### `Refresh(params)`
* **Description:** Refreshes the player list display, passing layout parameters for focus flow alignment.
* **Parameters:** `params` (table) — layout configuration (e.g., `{right = ..., down = ...}`).
* **Returns:** Nothing.

## Events & listeners
- **Pushes:** None identified.
- **Listens to:** None identified (uses standard widget event system, but no explicit `ListenForEvent` calls are present in the code).
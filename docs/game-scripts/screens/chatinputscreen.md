---
id: chatinputscreen
title: Chatinputscreen
description: Handles player text input for chat and slash commands, supporting both keyboard and console input with whisper/say mode toggling.
tags: [ui, input, chat]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: df967979
system_scope: ui
---

# Chatinputscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`ChatInputScreen` is a UI screen that manages player text input for in-game chat messages and user commands. It provides a dedicated interface for entering messages, supports whisper/say mode selection, and integrates with the emoji and command autocomplete systems via `TextEdit`. When active, it pauses debug toggles, hides the chat queue, and prioritizes keyboard/controller input for chat operations. It interacts with `TheNet:Say()` for message transmission and `UserCommands.RunTextUserCommand()` for command processing.

## Usage example
```lua
-- Launch the chat input screen in whisper mode
TheFrontEnd:PushScreen("screens/chatinputscreen", true)

-- Launch the chat input screen in say mode
TheFrontEnd:PushScreen("screens/chatinputscreen", false)
```

## Dependencies & tags
**Components used:** None (`ChatInputScreen` is a screen subclass, not a component).  
**Tags:** None identified.  
**Widget dependencies:** `Text`, `TextEdit`, `ScrollableChatQueue`, `ImageButton`, `Widget`, `Screen`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `whisper` | boolean | `false` | Indicates whether the next message should be sent as a whisper. |
| `runtask` | Task | `nil` | Cancelable delay task used to debounce message sending. |
| `chat_edit` | TextEdit | — | Input field widget for player text entry. |
| `chat_type` | Text | — | Display text indicating current mode (`SAY` or `WHISPER`). |
| `chat_queue_root` | Widget | — | Container for the chat queue display. |
| `networkchatqueue` | ScrollableChatQueue | — | Widget showing recent network chat messages. |

## Main functions
### `OnBecomeActive()`
* **Description:** Activates the screen, focuses the text input, and hides the chat queue HUD.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnBecomeInactive()`
* **Description:** Deactivates the screen, cancels pending tasks, and restores the chat queue HUD.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetHelpText()`
* **Description:** Returns localized help text describing current input control mappings.
* **Parameters:** None.
* **Returns:** `string` — concatenation of localized control labels and actions (e.g., `"B Cancel  A Say"`).
* **Error states:** None.

### `HasMessageToSend()`
* **Description:** Checks whether the text input contains non-whitespace content.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if trimmed text is non-empty, otherwise `false`.

### `Run()`
* **Description:** Processes and sends the current input: dispatches slash commands, or sends the message via `TheNet:Say()` if within length limits.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Early return if input is empty or exceeds `MAX_CHAT_INPUT_LENGTH`.

### `OnTextEntered()`
* **Description:** Schedules `Run()` to execute after a short delay; cancels any previous pending task.
* **Parameters:** None.
* **Returns:** Nothing.

### `Close()`
* **Description:** Closes the screen, restores debug toggle, and pops it from the frontend stack.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (does not register `inst:ListenForEvent` handlers).
- **Pushes:** None (does not call `inst:PushEvent`).
- **Uses task scheduling:** `inst:DoTaskInTime(0, DoRun, self)` — not an event but a DST-specific delayed execution mechanism.
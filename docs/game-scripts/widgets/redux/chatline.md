---
id: chatline
title: Chatline
description: Renders individual chat messages with dynamic content such as user names, messages, and special badges for announcements, system messages, or skins.
tags: [ui, chat, rendering]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 73cb759a
system_scope: ui
---

# Chatline

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ChatLine` is a UI widget responsible for rendering a single chat entry—such as a player message, system notification, or skin announcement—in the game's chat interface. It dynamically configures visual content (message text, sender name, and badges) based on the `ChatTypes` enum and manages focus-based size scaling and alpha blending. It integrates with skin data and supports localized skin announcements via `STRINGS.UI.NOTIFICATION.NEW_SKIN_ANNOUNCEMENT`.

## Usage example
```lua
local chatline = ChatLine(chat_font, 100, 20, 300, 80)
chatline:SetChatData(
    ChatTypes.Message,
    1.0,
    "Hello, world!",
    {1, 1, 1},
    "PlayerOne",
    {0.8, 0.8, 1},
    "knight_helmet",
    nil
)
chatline:UpdateAlpha(0.7)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Checks `ChatTypes` enum (e.g., `ChatTypes.Message`, `ChatTypes.SkinAnnouncement`, etc.) for type-based rendering logic. Uses `ANCHOR_LEFT`, `ANCHOR_RIGHT` alignment constants.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `root` | Widget | `nil` (created in constructor) | Root container widget for all visual children. |
| `type` | `ChatTypes` enum | `ChatTypes.Message` | Type of chat message; determines which UI elements are visible. |
| `user_width`, `user_max_chars` | number | `nil` (from constructor args) | Maximum width and character count allowed for the sender name text. |
| `message_width`, `message_max_chars` | number | `nil` (from constructor args) | Maximum width and character count allowed for the message text. |
| `message` | Text | `nil` | Text widget displaying the chat message. |
| `user` | Text | `nil` | Text widget displaying the sender name. |
| `skin_btn` | ImageButton | `nil` | Interactive button for skin announcements (click triggers `SkinsItemPopUp`). |
| `skin_txt` | Text | `nil` | Display text showing the skin name in skin announcements. |
| `skin_data` | table or `nil` | `nil` | Packet of skin data: `{skin_name, user_name, user_colour}` used by `SkinsItemPopUp`. |
| `flair`, `announcement`, `systemmessage`, `chattermessage` | Widget (badge templates) | `nil` | Badge widgets shown conditionally based on `type`. |

## Main functions
### `UpdateSkinAnnouncementPosition()`
* **Description:** Recalculates and sets the position of `skin_btn` and `skin_txt` relative to their content size.
* **Parameters:** None.
* **Returns:** Nothing.

### `UpdateSkinAnnouncementSize(size)`
* **Description:** Updates the font size of `skin_btn.text` and `skin_txt`, then recalculates positions.
* **Parameters:** `size` (number) — the new font size in pixels.
* **Returns:** Nothing.

### `OnGainFocus()`
* **Description:** Called when this widget gains focus; increases font size to `focus_chat_size` (≈35) via `UpdateSkinAnnouncementSize`.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnLoseFocus()`
* **Description:** Called when this widget loses focus; resets font size to `chat_size` (30) via `UpdateSkinAnnouncementSize`.
* **Parameters:** None.
* **Returns:** Nothing.

### `UpdateAlpha(alpha)`
* **Description:** Sets the opacity (`alpha`) of visible content and adjusts visibility of message/user, skin, and badge elements depending on `self.type`.
* **Parameters:** `alpha` (number) — opacity value in `[0, 1]`. If `<= 0`, hides the entire line.
* **Returns:** Nothing.

### `SetChatData(type, alpha, message, m_colour, sender, s_colour, icondata, icondatabg)`
* **Description:** Configures the full visual and logical content of the chat line. Handles text placement, colouring, badge assignment, and skin announcement setup.
* **Parameters:**
  * `type` (`ChatTypes` enum) — defines the message type.
  * `alpha` (number) — opacity to apply.
  * `message` (string) — chat message text.
  * `m_colour` (table) — `{r,g,b}` or `{r,g,b,a}` array for message colour.
  * `sender` (string, optional) — sender name; if `nil`, sender is hidden.
  * `s_colour` (table) — `{r,g,b}` or `{r,g,b,a}` array for sender colour.
  * `icondata` (any) — flair or announcement icon data passed to badge widgets.
  * `icondatabg` (any, optional) — background flair data for `ChatterMessage`.
* **Returns:** Nothing.

## Events & listeners
None identified.
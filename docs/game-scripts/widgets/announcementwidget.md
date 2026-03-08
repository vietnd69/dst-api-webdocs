---
id: announcementwidget
title: Announcementwidget
description: Renders and animates announcement messages with optional icons, text, and fade-out effects.
tags: [ui, animation, notification]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: b660b1f1
system_scope: ui
---

# Announcementwidget

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`AnnouncementWidget` is a UI widget that displays temporary announcement messages, typically used for in-game notifications (e.g., quest updates, achievements, system alerts). It inherits from `Widget`, manages a text label and icon, supports dynamic positioning of the icon relative to the text width, and handles its own fade-out lifecycle using a custom update loop.

## Usage example
```lua
local widget = AnnouncementWidget(UIFONT, 24, {1, 1, 1, 1})
widget:SetAnnouncement("Quest Complete!", "achievement", {1, 0.8, 0, 1}, 5, 1.5)
widget:SetPosition(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2)
AddToHud(widget)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `root` | `Widget` | `self:AddChild(Widget("Root"))` | Root container for internal child widgets. |
| `text` | `Text` | `self.root:AddChild(Text(...))` | Text label component for the announcement. |
| `icon` | `Image` | `self:AddChild(Image(...))` | Icon image displayed alongside text. |
| `font` | string | `UIFONT` | Font name used for rendering text. |
| `size` | number | `30` | Font size for the text. |
| `colour` | table | `{1,1,1,1}` | RGBA colour table for the text and icon. |
| `announce_type` | string | `""` | Identifier for the current icon style (e.g., `"achievement"`, `"default"`). |
| `lifetime` | number | `0` | Time in seconds until the announcement expires. |
| `fadetime` | number | `0` | Duration in seconds for the fade-out effect. |

## Main functions
### `OnUpdate(dt)`
* **Description:** Decrements `lifetime` and fades out the widget once expired. Hides and stops updating when fully faded.
* **Parameters:** `dt` (number) — Delta time in seconds since last frame.
* **Returns:** Nothing.

### `UpdateIconPosition()`
* **Description:** Recalculates and updates the icon's X position to be centered relative to the text width, with a fixed offset.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetFont(font)`
* **Description:** Updates the font used for text rendering and recalculates icon position.
* **Parameters:** `font` (string) — New font name (e.g., `UIFONT`).
* **Returns:** Nothing.

### `SetSize(size)`
* **Description:** Updates the font size and recalculates icon position.
* **Parameters:** `size` (number) — New font size.
* **Returns:** Nothing.

### `SetTextColour(r,g,b,a)`
* **Description:** Sets the RGBA colour of the text and stores it internally.
* **Parameters:**  
  - `r` (number or table) — Red channel or entire colour table.  
  - `g` (number, optional) — Green channel (used only if `r` is numeric).  
  - `b` (number, optional) — Blue channel.  
  - `a` (number, optional) — Alpha channel.
* **Returns:** Nothing.

### `ClearText()`
* **Description:** Clears the text string and updates icon position accordingly.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetText(string)`
* **Description:** Sets the announcement text and updates icon position.
* **Parameters:** `string` (string) — Text to display.
* **Returns:** Nothing.

### `GetText()`
* **Description:** Returns the current text string.
* **Parameters:** None.
* **Returns:** `string` — The displayed text, or `""` if empty.

### `SetIcon(announce_type)`
* **Description:** Sets the icon texture based on the `ANNOUNCEMENT_ICONS` lookup table.
* **Parameters:** `announce_type` (string or `nil`) — Key in `ANNOUNCEMENT_ICONS`; uses `"default"` if `nil`.
* **Returns:** Nothing.

### `SetAlpha(alpha)`
* **Description:** Updates the alpha transparency of text and icon components.
* **Parameters:** `alpha` (number) — Alpha value in `[0,1]`.
* **Returns:** Nothing.

### `GetAlpha()`
* **Description:** Returns the current alpha value stored in `colour[4]`.
* **Parameters:** None.
* **Returns:** `number` — Alpha value (default `0` if missing).

### `CopyInfo(announcement_info)`
* **Description:** Copies configuration from another announcement widget or info object.
* **Parameters:** `announcement_info` (table or widget with matching interface) — Source of configuration data.
* **Returns:** Nothing.

### `SetAnnouncement(announcement, announce_type, colour, lifetime, fadetime)`
* **Description:** Configures and starts the announcement: sets text, icon, colours, lifetime, and initiates the fade-out timer.
* **Parameters:**  
  - `announcement` (string) — Text to display (required).  
  - `announce_type` (string) — Icon type (e.g., `"default"`).  
  - `colour` (table) — RGBA colour table.  
  - `lifetime` (number) — Display duration in seconds.  
  - `fadetime` (number) — Fade-out duration in seconds.
* **Returns:** Nothing.

## Events & listeners
None identified
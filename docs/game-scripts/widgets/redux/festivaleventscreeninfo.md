---
id: festivaleventscreeninfo
title: Festivaleventscreeninfo
description: Constructs a reusable UI widget for displaying event-related information including an image, optional title text, and a link button.
tags: [ui]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: c9588685
system_scope: ui
---

# Festivaleventscreeninfo

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`FestivalEventScreenInfo` is a UI widget component used to display a consistent information card for festival events or mod-linked content. It composes an image (scaled to 70% size), optional multi-line truncated title text positioned above the button, and a standard link button that opens a URL in the browser. The widget inherits from `Widget` and is intended to be reused across mod or in-game screens (e.g., mod settings, event info panels).

## Usage example
```lua
local info = FestivalEventScreenInfo("mod_atlas", "mod_icon.tex", "Festival 2026: Spring Rush", "https://example.com/event")
inst:AddChild(info)
```

## Dependencies & tags
**Components used:** `Image`, `Text`, `ImageButton` (via `TEMPLATES.StandardButton`), `Widget`, `UIAnim`, `TEMPLATES`  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `button` | ImageButton | `nil` (set in constructor) | Reference to the standard link button; used for focus handling if non-nil. |
| `focus_forward` | widget | `nil` (set conditionally) | Points to the `button` if it exists, used for navigation focus. |

## Main functions
### `FestivalEventScreenInfo(atlas, image, str, url)`
*   **Description:** Constructor that initializes the widget with an image, optional header text, and a URL-triggering button.
*   **Parameters:**
    *   `atlas` (string) – Texture atlas name for the image.
    *   `image` (string) – Image name (texture ID) within the atlas.
    *   `str` (string or `nil`) – Header text to display; if `nil`, no title is added.
    *   `url` (string) – Web URL opened when the button is pressed.
*   **Returns:** A fully configured `FestivalEventScreenInfo` instance.
*   **Error states:** No explicit error handling or edge cases; `str` being `nil` simply omits the title text.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified
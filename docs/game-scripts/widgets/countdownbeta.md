---
id: countdownbeta
title: CountdownBeta
description: Renders a countdown timer UI widget for upcoming updates or events, supporting multiple visual modes (text-only, image-based reveal, released state, or Quagmire-themed).
tags: [ui, countdown, frontend]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: d04a4ac8
system_scope: ui
---

# CountdownBeta

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`CountdownBeta` is a UI widget subclassed from `Widget` that displays a countdown to a specified release or update date. It supports multiple display modes—`text`, `image`, `reveal`, `released`, and `quagmire`—each configuring internal child widgets (images, labels, animations) differently. It computes days remaining using `os.time`, applying a fixed timezone offset (`klei_tz = 28800` seconds = UTC-8) for consistency.

## Usage example
```lua
-- Example: Create a text-only countdown showing days until a date
local owner = TheFrontEnd:GetActiveScreen()
local release_date = {year = 2026, month = 12, day = 25, hour = 0}
local countdown = CountdownBeta(owner, "text", nil, nil, release_date)
TheFrontEnd:AddChild(countdown)

-- Example: Image-based reveal mode
local countdown_reveal = CountdownBeta(owner, "reveal", "silhouette_image", "New Update v1.2", release_date)
countdown_reveal:SetPosition(100, -50)
TheFrontEnd:AddChild(countdown_reveal)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `countdown` (via widget hierarchy root node name `"Countdown"`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `bg` | `Image` | `nil` | Background label backdrop image (used in most modes). |
| `daysuntiltext` | `Text` | `nil` | Text widget displaying countdown (e.g., "15 days until release"). |
| `title` | `Text` | `nil` | Main title text (always `"BETA"`). |
| `title2` | `Text` or `nil` | `nil` | Secondary text (e.g., update name or "UPDATE RELEASED"). |
| `image` | `Image` or `UIAnim` | `nil` | Primary image/animation (e.g., silhouette or Quagmire asset). |
| `reveal_image` | `Image` or `nil` | `nil` | Reveal layer (tinted in reveal mode). |
| `smoke` | `UIAnim` or `nil` | `nil` | Smoke/portal effect animation (used in `reveal` mode). |
| `button` | `ImageButton` or `nil` | `nil` | Optional clickable button (e.g., for link to forums). |
| `focus_forward` | widget or `nil` | `nil` | Widget to receive focus (set to `self.button` if present). |

## Main functions
### `SetCountdownDate(date)`
* **Description:** Computes and sets the remaining days until the provided date, updating `daysuntiltext` and optionally animation state.  
* **Parameters:**  
  - `date` (table) — Table in format `{year = number, month = number, day = number, hour = number}`. Must be a valid `os.time`-compatible table; invalid or non-table input returns early.  
* **Returns:** Nothing.  
* **Error states:** Returns silently if `date` is `nil` or not a table.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified
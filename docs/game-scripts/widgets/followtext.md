---
id: followtext
title: Followtext
description: Renders a text label that follows a target entity on screen, typically used for dynamic UI elements like floating text or status indicators.
tags: [ui, label, overlay]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 96af3ca7
system_scope: ui
---

# Followtext

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`FollowText` is a UI widget that displays a text label positioned to track a target entity on the screen. It inherits from `Widget` and uses screen-space projection to update the text's position based on the target's world position, ensuring the label moves with the target during gameplay. It optionally supports HUD scaling adjustments via event listeners and legacy fallback.

## Usage example
```lua
local followtext = followtext("Fonts/latin font.fnt", 24, "Hello!")
followtext:SetTarget(some_entity)
followtext:SetOffset(Vector3(0, 1, 0))
followtext:SetScreenOffset(5, -10)
TheFrontEnd:AddWidget(followtext)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `text` | Text widget | (created internally) | The child text widget used to render the string. |
| `offset` | Vector3 | `Vector3(0, 0, 0)` | Local offset applied to the target's symbol position. |
| `screen_offset` | Vector3 | `Vector3(0, 0, 0)` | Additional screen-space offset (in pixels) applied after projection. |
| `target` | Entity or nil | `nil` | The entity being followed; if valid, the text updates to match its position. |
| `hashud` | boolean | `false` | Internal flag indicating whether HUD scaling listeners have been attached. |

## Main functions
### `SetHUD(hud)`
* **Description:** Attaches HUD scaling event listeners to the widget (e.g., to update text scale when HUD size changes). Only activates once.
* **Parameters:** `hud` (Widget) — the HUD widget instance used to scope the event listeners.
* **Returns:** Nothing.

### `SetTarget(target)`
* **Description:** Sets the entity the text should follow. Triggers an immediate position update.
* **Parameters:** `target` (Entity or nil) — the entity whose position determines the text location.
* **Returns:** Nothing.

### `SetOffset(offset)`
* **Description:** Sets the local offset (in world units) applied relative to the target’s symbol or position.
* **Parameters:** `offset` (Vector3) — offset vector added to the target's position before screen projection.
* **Returns:** Nothing.

### `SetScreenOffset(x, y)`
* **Description:** Sets the screen-space offset (in pixels) to adjust the final text position.
* **Parameters:**  
  `x` (number) — horizontal offset in pixels.  
  `y` (number) — vertical offset in pixels.
* **Returns:** Nothing.

### `GetScreenOffset()`
* **Description:** Returns the current screen-space offset.
* **Parameters:** None.
* **Returns:** `number, number` — the current `x` and `y` screen offset values.

### `OnUpdate(dt)`
* **Description:** Updates the widget's screen position based on the target's world position. Called automatically due to `StartUpdating()`.
* **Parameters:** `dt` (number) — delta time since last frame (unused directly but required by update loop).
* **Returns:** Nothing.
* **Error states:** If `target` is `nil` or invalid, or `target.AnimState` is missing and `Transform` is absent, no position update occurs.

## Events & listeners
- **Listens to:**  
  `continuefrompause` — updates text scale when game resumes from pause.  
  `refreshhudsize` — updates text scale when HUD scale changes (params: `hud`, `scale`).  
- **Pushes:** None identified
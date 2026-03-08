---
id: flareover
title: Flareover
description: Renders a full-screen overlay effect (e.g., for blinding light or screen flash) that fades out over time.
tags: [ui, fx]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 21d3d399
system_scope: ui
---

# Flareover

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`FlareOver` is a UI widget that displays a full-screen visual flare effect (e.g., for sudden bright lighting or screen flash events) using a tinted image. It supports alpha-based fading and is typically attached to an owner entity (e.g., a player) that receives the `"startflareoverlay"` event to trigger the effect.

## Usage example
```lua
-- Add the widget to an entity (e.g., in the entity's prefab init)
inst:AddComponent("flareover")
-- Trigger the flare with custom tint (e.g., white flash)
inst:PushEvent("startflareoverlay", { r=1.0, g=1.0, b=1.0 })
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The entity that owns this widget and to which it listens for events. |
| `_alpha` | number | `0.0` | Current alpha value of the overlay (0.0 = invisible, 1.0 = opaque). |
| `_alpha_target` | number | `0.0` | Target alpha (unused in current implementation; always driven by fade logic). |
| `_alpha_speed` | number | `0.5` | Rate at which alpha decreases per second during the fade. |
| `bg` | Image | `nil` | The underlying image component displaying the flare texture. |

## Main functions
### `StartFlare(data)`
*   **Description:** Initiates the flare effect by showing the overlay and resetting the alpha to full, then begins updating.
*   **Parameters:** `data` (table or `nil`) - Optional table containing keys `r`, `g`, and `b` (numbers from `0.0` to `1.0`) to set the tint color. If `nil`, no tint is applied.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Called every frame while the overlay is visible. Gradually reduces `_alpha`, updates the background image's fade alpha, and hides the widget when the effect completes.
*   **Parameters:** `dt` (number) - Delta time in seconds since the last frame.
*   **Returns:** Nothing.
*   **Error states:** Ends fading early and hides the widget when `_alpha <= 0.01`; stops updating automatically.

## Events & listeners
- **Listens to:** `startflareoverlay` — triggered on the `owner` entity; invokes `StartFlare(data)` with event payload `data`.
- **Pushes:** None identified
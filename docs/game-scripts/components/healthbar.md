---
id: healthbar
title: Healthbar
description: Renders and manages a visual health bar overlay for an entity, displaying current health as a percentage alongside a colored background and fill bar.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: ui
source_hash: 7065d8b0
---

# Healthbar

## Overview
The `HealthBar` component renders a non-networked UI-style overlay entity (background bar + fill bar + percentage label) above an entity to visually indicate its health status. It listens to health-related events and updates the bar's width, tint, and text label accordingly. It is intended for client-side visualization only and does not persist across sessions.

## Dependencies & Tags
- **Component Dependency:** Requires the entity to have a `health` component for full functionality (only used to fetch initial health percentage on master simulation).
- **Tags Added (to rendered entities):** `"CLASSIFIED"`, `"NOCLICK"` (applied to both background and bar entities).
- **Internal Net Variable:** Uses a `net_float` named `"healthbar._healthpct"` with event `"healthpctdirty"` for cross-thread sync on non-master instances.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `bar_atlas` | `string` | `"images/hud.xml"` | Texture atlas path for the bar graphics. |
| `bar_image` | `string` | `"stat_bar.tex"` | Texture image name within the atlas. |
| `bar_width` | `number` | `100` | Full width (in pixels) of the health bar container. |
| `bar_height` | `number` | `10` | Full height (in pixels) of the health bar container. |
| `bar_border` | `number` | `1` | Inner border margin used to compute the fill area dimensions. |
| `bar_colour` | `{r, g, b, a}` | `{0.7, 0.1, 0, 1}` | RGBA tint for the health fill bar. |
| `bg_colour` | `{r, g, b, a}` | `{0.075, 0.07, 0.07, 1}` | RGBA tint for the background bar. |
| `bar_world_offset` | `Vector3` | `Vector3(0, 3, 0)` | World-space offset of the bar relative to the parent entity. |
| `bar_ui_offset` | `Vector3` | `Vector3(12, 0, 0)` | UI-space offset for the fill bar, used for centering. |
| `label_ui_offset` | `Vector3` | `Vector3(-50, 0, 0)` | UI-space offset for the percentage label. |
| `enabled` | `boolean` | `true` | Enables or disables the bar (affects visibility). |

## Main Functions

### `Enable(enable)`
* **Description:** Enables or disables the health bar. When disabled, the bar becomes invisible; when re-enabled, it redraws the current health percentage.
* **Parameters:**  
  `enable` (`boolean` or `nil`) — If `true` or omitted, enables the bar. If `false`, hides the bar.

### `SetValue(percent)`
* **Description:** Updates the health bar's fill width and percentage label based on the given health percentage. If `percent > 0`, the bar becomes visible; otherwise, it is hidden.
* **Parameters:**  
  `percent` (`number`) — A float between `0.0` and `1.0` representing the current health fraction.

## Events & Listeners
- **Listens for:**
  - `"healthdelta"` (master sim only): Updates health percentage and refreshes bar state on health changes.
  - `"healthpctdirty"` (non-master sim): Triggers a refresh when the net-synced health percentage changes.
- **Triggers:**
  - None directly (relies on event listeners to update internal state).
---
id: healthbar
title: Healthbar
description: Renders a visual health bar and percentage label above an entity, updating in response to health changes.
tags: [ui, health, rendering]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 7065d8b0
system_scope: ui
---

# Healthbar

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`HealthBar` is a client-side UI component that displays a horizontal health bar and current health percentage above an entity. It is intended for visual feedback in multiplayer contexts and uses networked replication (`net_float`) to synchronize health percentage across clients. It does not manage health state itself, but reacts to health changes by listening to events from the `health` component.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("health") -- Required for healthdelta events
inst:AddComponent("healthbar")
inst.components.healthbar:Enable(true)
```

## Dependencies & tags
**Components used:** `health` (accessed via `inst.components.health:GetPercent()`)
**Tags:** Checks none directly; does not add/remove tags on the host entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `bar_atlas` | string | `"images/hud.xml"` | Path to the texture atlas containing the health bar image. |
| `bar_image` | string | `"stat_bar.tex"` | Filename of the health bar texture within the atlas. |
| `bar_width` | number | `100` | Total width (in pixels) of the bar container. |
| `bar_height` | number | `10` | Height (in pixels) of the bar container. |
| `bar_border` | number | `1` | Border thickness used to compute inner fill dimensions. |
| `bar_colour` | `{number, number, number, number}` | `{0.7, 0.1, 0, 1}` | RGBA tint applied to the health fill bar. |
| `bg_colour` | `{number, number, number, number}` | `{0.075, 0.07, 0.07, 1}` | RGBA tint applied to the background bar. |
| `bar_world_offset` | Vector3 | `Vector3(0, 3, 0)` | World-space offset of the bar relative to the entity. |
| `bar_ui_offset` | Vector3 | `Vector3(12, 0, 0)` | Base UI offset for the bar image position. |
| `label_ui_offset` | Vector3 | `Vector3(-50, 0, 0)` | UI offset for the health percentage label. |
| `enabled` | boolean | `true` | Controls whether the bar is visible. |

## Main functions
### `Enable(enable)`
*   **Description:** Toggles visibility of the health bar and label. If `enable` is `true`, the bar updates to reflect current health; if `false`, it is hidden.
*   **Parameters:** `enable` (boolean, optional) — if omitted or `true`, shows the bar; if `false`, hides it.
*   **Returns:** Nothing.

### `SetValue(percent)`
*   **Description:** Updates the bar fill width and percentage label based on a health percentage value. Only updates while `enabled`.
*   **Parameters:** `percent` (number) — expected range `0.0` to `1.0`.
*   **Returns:** Nothing.
*   **Error states:** If `percent <= 0`, the bar and label are hidden.

## Events & listeners
- **Listens to:** `healthdelta` (on master sim) — triggers update via `_healthpct:set` and `OnHealthPctDirty`.
- **Listens to:** `healthpctdirty` (on clients) — triggers update via `OnHealthPctDirty`.
- **Pushes:** `healthpctdirty` (via `net_float`) — used to synchronize health percentage state across network.

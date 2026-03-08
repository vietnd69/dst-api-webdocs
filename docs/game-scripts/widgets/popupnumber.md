---
id: popupnumber
title: PopupNumber
description: Renders a floating numeric value above an entity or world position with animation and fading effects.
tags: [ui, fx, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 0b711b9b
system_scope: ui
---

# PopupNumber

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`PopupNumber` is a UI widget that displays a floating, animated numeric text effect — commonly used to show damage, healing, currency changes, or other transient numerical feedback. It inherits from `Widget`, manages its own lifecycle with a two-phase animation (rise then drop), and automatically removes itself when complete. It is typically instantiated client-side to provide visual feedback without requiring entity ownership or server interaction.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("popupnumber")
local popup = inst.components.popupnumber
-- Assuming 'pos' is a Vector3 and 'colour' is a 4-element RGBA table
popup:Show(15, 24, pos, colour, true)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | Entity | `nil` | The entity associated with this popup (e.g., damage target); not actively used beyond reference. |
| `text` | Text widget | `nil` | The child text element displaying the numeric value. |
| `pos` | Vector3 | `nil` | The world position where the popup originates (used to map screen position). |
| `colour` | table (4-element) | `nil` | RGBA color values for the text (each component 0–1). |
| `xoffs`, `yoffs` | number | random | Initial random offsets for horizontal drift and vertical height. |
| `xoffs2`, `yoffs2` | number | `0` | Dynamic offsets updated per-frame during animation. |
| `dir` | number | `1` or `-1` | Horizontal drift direction (positive or negative). |
| `rise`, `drop`, `speed` | number | `8`, `24`, `68` | Animation parameters: max rise height, fall rate, and horizontal drift speed. |
| `progress` | number | `0` | Animation progress (0–1 = rise phase; 1–2 = drop phase). |
| `burst` | boolean | `false` | Whether the popup should scale up during the rise phase. |

## Main functions
### `OnUpdate(dt)`
*   **Description:** Updates the popup's position, opacity, motion, and scale each frame based on animation progress. Handles two phases: upward rise followed by downward drop, then kills itself.
*   **Parameters:** `dt` (number) — delta time in seconds since last frame.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if already killed. Automatically calls `Kill()` when animation completes (`progress >= 2`).

## Events & listeners
None identified.
---
id: miasmacloudsover
title: Miasmacloudsover
description: A UI widget that displays a looping miasma cloud animation centered over an entity, typically used for visual feedback of miasma-based environmental effects.
tags: [ui, fx, environment]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 2c1c6241
system_scope: ui
---

# Miasmacloudsover

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Miasmacloudsover` is a UI widget that renders a looping animation representing miasma clouds overlaying an entity or location in the game world. It extends `UIAnim`, inherits UI behavior (e.g., anchoring and scaling), and configures its animation state to play a specific miasma loop. This component is used for atmospheric or status effect visualization, such as indicating the presence of miasma in levels or on characters.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("miasmacloudsover")
inst.components.miasmacloudsover:SetOwner(player)
-- The widget will automatically display centered over the owner if used correctly in UI context
```

## Dependencies & tags
**Components used:** None (this is a standalone UI widget).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `GEntity` or `nil` | `nil` | The entity this widget is conceptually attached to (used for context, but not directly referenced beyond assignment). |

## Main functions
### `Miasmacloudsover(owner)`
*   **Description:** Constructor for the widget. Initializes UI animation state, disables click interaction, centers the widget, and sets up the "miasma_over" bank/build and "dust_loop" animation for looping playback.
*   **Parameters:** `owner` (GEntity) — the entity this widget is associated with; used for reference but not actively managed.
*   **Returns:** Nothing.
*   **Error states:** Not applicable.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.
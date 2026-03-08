---
id: containerwidget
title: Containerwidget
description: Renders and manages interactive UI widgets for containers, including slot layout, animations, and button handling.
tags: [ui, container, inventory]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 15de3afd
system_scope: ui
---

# Containerwidget

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ContainerWidget` is a UI component responsible for visually representing and interacting with in-game containers (e.g., chests, backpacks, construction sites). It dynamically constructs an inventory grid of `InvSlot` widgets, applies background animations and textures based on container configuration, and handles user-triggered actions via an optional button. It integrates with the `playeractionpicker` to register/unregister itself and respects control state via `playercontroller:IsEnabled()`.

## Usage example
```lua
local containerwidget = ContainerWidget(owner)
-- Typically added to a parent widget or screen
parent:AddChild(containerwidget)

-- Open the widget for a specific container instance
containerwidget:Open(container, doer)
-- Doer is the entity triggering the interaction (e.g., player)

-- Later, close it explicitly when done
containerwidget:Close()
```

## Dependencies & tags
**Components used:** `playeractionpicker`, `playercontroller`, `constructionbuilderuidata`
**Tags:** None added or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `TheSim` or `Entity` | `nil` | The entity that owns this widget instance (typically the player). |
| `open` | boolean | `false` | Legacy flag; use `isopen` instead. |
| `isopen` | boolean | `false` | Whether the widget is currently open and visible. |
| `container` | `Entity` or `nil` | `nil` | The container instance currently displayed by the widget. |
| `inv` | table | `{}` | Array of `InvSlot` widgets representing inventory slots. |
| `bganim` | `UIAnim` | — | Background animation entity. |
| `bgimage` | `Image` | — | Static background image entity. |
| `button` | `ImageButton` or `nil` | `nil` | Optional action button for non-read-only, non-controller interactions. |
| `slotsperrow` | number | `3` | Not actively used; retained for compatibility. |
| `onitemlosefn` | function or `nil` | `nil` | Event callback for `itemlose` event. |
| `onitemgetfn` | function or `nil` | `nil` | Event callback for `itemget` event. |
| `onrefreshfn` | function or `nil` | `nil` | Event callback for `refresh` event. |

## Main functions
### `Open(container, doer)`
*   **Description:** Opens and initializes the widget for a given container, setting up background visuals, inventory slots, and the optional action button.
*   **Parameters:**
    *   `container` (Entity) — the container instance to display. Must have a valid `replica.container`.
    *   `doer` (Entity or `nil`) — the entity triggering the interaction; used to register/unregister with `playeractionpicker` and check control state.
*   **Returns:** Nothing.
*   **Error states:** Calls `Close()` at the start to ensure cleanup; silently handles missing `widget` configuration fields (e.g., `nil` `bgatlas`, `pos`, `buttoninfo`).

### `Refresh()`
*   **Description:** Updates all slot contents and visual state (e.g., read-only brightness) based on current container data.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Skips slot updates if `self.inv` entries are missing; handles read-only containers by dimming the background animation via `SetMultColour`.

### `OnItemGet(data)`
*   **Description:** Handles the `itemget` event, updating a specific slot with a new item and optionally animating the item’s appearance.
*   **Parameters:**
    *   `data` (table) — Event payload; must contain `slot` (index), `item` (entity), and optionally `src_pos` (start position for animation), `ignore_stacksize_anim`.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `self.inv[data.slot]` is missing; skips animation if `src_pos` is `nil`.

### `OnItemLose(data)`
*   **Description:** Handles the `itemlose` event, clearing the specified slot.
*   **Parameters:**
    *   `data` (table) — Event payload; must contain `slot` (index).
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `self.inv[data.slot]` is missing.

### `Close()`
*   **Description:** Closes the widget, cleaning up event listeners, slots, button, and background animations; schedules the widget for removal after `.3s`.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Ensures idempotency via `self.isopen` check; safely calls `UnregisterContainer` only if `owner` and `playeractionpicker` exist.

## Events & listeners
- **Listens to:**
    *   `itemlose` — updates UI when an item is removed from the container.
    *   `itemget` — updates UI when an item is added to the container.
    *   `refresh` — triggers full UI refresh via `Refresh()`.
    *   `continuefrompause` (on `TheWorld`) — toggles button visibility based on controller and read-only state.
- **Pushes:** No events.

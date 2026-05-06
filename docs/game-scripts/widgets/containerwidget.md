---
id: containerwidget
title: Containerwidget
description: UI widget that displays container inventory contents with slots, animations, and optional action buttons.
tags: [ui, inventory, widget]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: widgets
source_hash: 60aa30d6
system_scope: ui
---

# Containerwidget

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`ContainerWidget` is a UI widget that renders container inventory interfaces for players. It displays item slots, handles container open/close animations, and supports optional action buttons. The widget integrates with the container replica system to synchronize inventory state across the network and responds to item changes through event listeners.

## Usage example
```lua
local ContainerWidget = require "widgets/containerwidget"

local containerWidget = ContainerWidget(owner)
containerWidget:Open(container, doer)
containerWidget:Refresh()
containerWidget:Close()
```

## Dependencies & tags
**External dependencies:**
- `class` -- base class system
- `widgets/invslot` -- individual inventory slot widgets
- `widgets/widget` -- base widget class this extends
- `widgets/text` -- text rendering for button labels
- `widgets/uianim` -- animated UI elements
- `widgets/imagebutton` -- interactive button widget
- `widgets/itemtile` -- item display tiles within slots

**Components used:**
- `playeractionpicker` -- registers/unregisters container for action picking
- `playercontroller` -- checks if controls are enabled before button clicks
- `constructionbuilderuidata` -- retrieves construction site and container for building UI
- `container` (replica) -- accesses container items, widget config, and state

**Tags:**
- `busy` -- checked on doer to ignore button clicks when entity is busy

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `open` | boolean | `false` | Set in constructor but unused; actual state tracking uses `isopen`. |
| `inv` | table | `{}` | Array of InvSlot child widgets. |
| `owner` | entity | `nil` | The player entity that owns this widget. |
| `slotsperrow` | number | `3` | Number of slots per row in the grid. |
| `bganim` | UIAnim | `nil` | Child widget for background animations. |
| `bgimage` | Image | `nil` | Child widget for static background image. |
| `isopen` | boolean | `false` | Whether the container is currently open. |
| `button` | ImageButton | `nil` | Optional action button (created in Open). |
| `container` | entity | `nil` | The container entity being displayed. |
| `onitemlosefn` | function | `nil` | Callback for itemlose events. |
| `onitemgetfn` | function | `nil` | Callback for itemget events. |
| `onrefreshfn` | function | `nil` | Callback for refresh events. |

## Main functions
### `ContainerWidget(owner)`
* **Description:** Constructor that initializes the container widget with the owning player entity. Sets up background animation, image, and default scale.
* **Parameters:** `owner` -- player entity that owns this widget.
* **Returns:** ContainerWidget instance.
* **Error states:** None

### `Open(container, doer)`
* **Description:** Opens the container widget, displaying inventory slots and optional action button. Configures background visuals from container widget data and registers event listeners.
* **Parameters:**
  - `container` -- container entity to display
  - `doer` -- player entity interacting with the container
* **Returns:** None
* **Error states:** Errors if `container.replica.container` is nil when accessing widget data or items.

### `Close()`
* **Description:** Closes the container widget, removes event listeners, kills child widgets, and unregisters from playeractionpicker. Plays close animation before hiding.
* **Parameters:** None
* **Returns:** None
* **Error states:** None (includes nil guards for button, container, and callback functions)

### `Refresh()`
* **Description:** Updates all inventory slots with current container items. Handles read-only container visuals and item tile creation or refresh.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.container.replica.container` is nil when calling GetItems() or IsReadOnlyContainer().

### `RefreshPosition()`
* **Description:** Updates widget position based on container widget configuration. Only refreshes if widget has a posfn defined.
* **Parameters:** None
* **Returns:** None
* **Error states:** None (includes nil guards for container and widget)

### `OnItemGet(data)`
* **Description:** Handles itemget event by creating and animating item tile into the appropriate slot. Triggers button refresh if button exists.
* **Parameters:** `data` -- table containing `slot`, `item`, `ignore_stacksize_anim`, and optional `src_pos`.
* **Returns:** None
* **Error states:** Errors if `self.container.replica.container` is nil when checking IsReadOnlyContainer().

### `OnItemLose(data)`
* **Description:** Handles itemlose event by clearing the tile from the affected slot. Triggers button refresh if button exists.
* **Parameters:** `data` -- table containing `slot` index of the lost item.
* **Returns:** None
* **Error states:** None

## Events & listeners
- **Listens to:** `itemlose` (on container) - clears slot tile when item is removed.
- **Listens to:** `itemget` (on container) - creates slot tile when item is added.
- **Listens to:** `refresh` (on container) - triggers full widget refresh.
- **Listens to:** `continuefrompause` (on TheWorld) - toggles button visibility based on controller attachment and read-only state.
- **Pushes:** None
---
id: wxpowerover
title: Wxpowerover
description: A UI widget that displays a visual overlay for WX-78's power state transitions.
tags: [ui, wx78, overlay]
sidebar_position: 10
last_updated: 2026-05-06
build_version: 722832
change_status: stable
category_type: widgets
source_hash: dfd285a1
system_scope: ui
---

# Wxpowerover

> Based on game build **722832** | Last updated: 2026-05-06

## Overview
Wxpowerover is a UI widget for WX-78's power state transitions. It displays a visual overlay effect when power is turned off and hides when power is on. Used in the WX-78 class to provide visual feedback during power state changes.

## Usage example
```lua
local WxPowerOver = require("widgets/wxpowerover")

-- Inside WX-78's screen or UI setup
self.powerOverlay = self:AddChild(WxPowerOver(self))
self.powerOverlay:PowerOff() -- shows the turnoff animation
self.powerOverlay:Clear() -- hides the overlay
```

## Dependencies & tags


**External dependencies:**
- `widgets/uianim` -- used to create child UI animation widget
- `widgets/widget` -- base class for the widget

**Components used:** None identified

**Tags:** None

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | Entity | --- | The WX-78 entity instance that owns this widget. Set during _ctor and used for context. |
| `fx` | UIAnim | --- | UI animation widget used for power overlay effect. Created during _ctor. |



## Main functions
### `PowerOff()`
* **Description:** Plays the power-off animation and sound, then shows the widget. Used when WX-78's power is turned off.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if TheFrontEnd is nil (no nil guard present).

### `Clear()`
* **Description:** Plays the power-on sound and hides the widget. Used when WX-78's power is turned on.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if TheFrontEnd is nil (no nil guard present).

### `_ctor(owner)`
* **Description:** Initializes the widget and sets up the visual effects for power state transitions.
* **Parameters:** `owner` -- the WX-78 entity instance that owns this widget.
* **Returns:** None
* **Error states:** Errors if AddChild returns nil (no guard present) — crashes when accessing self.fx properties or methods.

## Events & listeners
**None.**
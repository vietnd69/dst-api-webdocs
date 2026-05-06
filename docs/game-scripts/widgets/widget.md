---
id: widget
title: Widget
description: Base class for all UI widgets in Don't Starve Together, providing entity management, focus handling, animation, and child widget composition.
tags: [widget, ui, base]
sidebar_position: 1
last_updated: 2026-04-27
build_version: 722832
change_status: stable
category_type: widgets
source_hash: 7b172659
system_scope: ui
---

# Widget

> Based on game build **722832** | Last updated: 2026-04-27

## Overview
`Widget` is the base class for all UI widgets in Don't Starve Together. It creates an entity with UI transform components, manages child widget hierarchies, handles focus navigation, and provides animation capabilities via the `uianim` component. All custom widgets extend this class and are embedded into screens via `screen:AddChild(Widget())`. Widgets run tasks on `StaticUpdate` by default so pausing the server does not freeze UI effects.

## Usage example
```lua
local Widget = require("widgets/widget")
local Text = require("widgets/text")

-- Inside a screen's _ctor:
self.my_widget = self:AddChild(Widget("my_widget"))
self.my_widget:SetPosition(0, 100, 0)
self.my_widget:SetScale(1.2, 1.2, 1)

local label = self.my_widget:AddChild(Text(NEWFONT_OUTLINE, 24, "Hello"))
label:SetPosition(0, 0, 0)

-- Enable animations:
self.my_widget:MoveTo(Vector3(0, 100, 0), Vector3(0, 150, 0), 0.5)
```

## Dependencies & tags
**External dependencies:**
- `widgets/imagebutton` -- loaded dynamically in SetHoverText for hover text background
- `widgets/text` -- loaded dynamically in SetHoverText for hover text label
- `widgets/widget` -- base class (this file)

**Components used:**
- `uianim` -- added automatically for animation functions (MoveTo, ScaleTo, RotateTo, TintTo); handles interpolated transforms

**Tags:**
- `widget` -- added to inst.entity in constructor
- `UI` -- added to inst.entity in constructor

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `children` | table | `{}` | Dictionary of child widgets; keyed by child widget instance. |
| `callbacks` | table | `{}` | Registered event callbacks; keyed by event name. |
| `name` | string | `"widget"` | Widget identifier; used for debugging and entity naming. |
| `inst` | entity | --- | The underlying entity instance with UITransform component. |
| `enabled` | boolean | `true` | Whether the widget accepts input; checked in IsEnabled(). |
| `shown` | boolean | `true` | Visibility state; false after Hide(), true after Show(). |
| `focus` | boolean | `false` | Whether this widget currently has input focus. |
| `focus_target` | boolean | `false` | Reserved for focus targeting logic. |
| `can_fade_alpha` | boolean | `true` | Whether SetFadeAlpha() is permitted on this widget. |
| `focus_flow` | table | `{}` | Maps direction (e.g., "down", "up") to next widget in focus navigation. |
| `focus_flow_args` | table | `{}` | Arguments to pass when following focus_flow to next widget. |
| `parent` | Widget | `nil` | Parent widget in the hierarchy; set by AddChild(). |
| `parent_screen` | Screen | `nil` | Cached reference to root screen; populated by GetParentScreen(). |
| `parent_scroll_list` | ScrollList | `nil` | Parent scroll list for scroll control passthrough. |
| `tooltip` | string | `nil` | Tooltip text displayed on focus. |
| `tooltip_pos` | Vector3 | `nil` | Custom tooltip position offset. |
| `tooltipcolour` | table | `nil` | RGBA colour table for tooltip text. |
| `hovertext_root` | Widget | `nil` | Root widget for hover text popup; created in SetHoverText(). |
| `hovertext` | Text | `nil` | Text widget displaying hover tooltip. |
| `hovertext_bg` | Image | `nil` | Background image for hover tooltip. |
| `followhandler` | InputHandler | `nil` | Input move handler for FollowMouse(). |
| `ongainfocusfn` | function | `nil` | Custom callback set via SetOnGainFocus(). |
| `onlosefocusfn` | function | `nil` | Custom callback set via SetOnLoseFocus(). |
| `next_in_tab_order` | Widget | `nil` | Next widget in tab order; set by SetFocusChangeDir(). |

## Main functions
### `_ctor(name)`
* **Description:** Initialises the widget base class. Creates an entity with UITransform, adds "widget" and "UI" tags, attaches uianim component, and configures task scheduling (StaticUpdate by default for pause-resistance).
* **Parameters:** `name` -- string identifier for the widget (default `"widget"`)
* **Returns:** nil
* **Error states:** None — handles nil name gracefully with default.

### `UpdateWhilePaused(update_while_paused)`
* **Description:** Configures whether widget tasks continue while the game is paused. When true, uses `DoStaticPeriodicTask`/`DoStaticTaskInTime` instead of sim-tied tasks. Also forwards setting to uianim component.
* **Parameters:** `update_while_paused` -- boolean to enable/disable paused updates
* **Returns:** nil
* **Error states:** None.

### `AddChild(child)`
* **Description:** Adds a child widget to this widget's hierarchy. Sets the child's parent, removes child from any previous parent, and attaches child's entity to this widget's entity.
* **Parameters:** `child` -- Widget instance to add
* **Returns:** The child widget instance
* **Error states:** None — handles nil child gracefully (no-op).

### `RemoveChild(child)`
* **Description:** Removes a child widget from this widget's hierarchy. Clears child's parent reference and detaches child's entity from parent entity.
* **Parameters:** `child` -- Widget instance to remove
* **Returns:** nil
* **Error states:** None — handles nil child gracefully.

### `KillAllChildren()`
* **Description:** Removes and kills all child widgets. Calls `Kill()` on each child, clears the children table, and clears hover text.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `Kill()`
* **Description:** Destroys the widget and all children. Stops updating, kills all children, removes from parent's children table, clears widget reference on inst, stops mouse follow, and removes the entity.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `Enable()`
* **Description:** Sets `enabled` to true and calls `OnEnable()` hook. Does not recursively enable children.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `Disable()`
* **Description:** Sets `enabled` to false and calls `OnDisable()` hook. Does not recursively disable children.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `IsEnabled()`
* **Description:** Returns true if this widget and all ancestors are enabled. Recursively checks parent's IsEnabled().
* **Parameters:** None
* **Returns:** boolean
* **Error states:** None.

### `Show()`
* **Description:** Makes the widget visible by calling `inst.entity:Show()`, sets `shown` to true, and calls `OnShow(was_hidden)`.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `Hide()`
* **Description:** Hides the widget by calling `inst.entity:Hide()`, sets `shown` to false, and calls `OnHide(was_visible)`.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `IsVisible()`
* **Description:** Returns true if `shown` is true AND (no parent OR parent:IsVisible() is true). Checks full visibility chain.
* **Parameters:** None
* **Returns:** boolean
* **Error states:** None.

### `OnShow(was_hidden)`
* **Description:** Lifecycle hook called when widget becomes visible. Override in subclasses for custom show logic.
* **Parameters:** `was_hidden` -- boolean indicating previous hidden state
* **Returns:** nil
* **Error states:** None.

### `OnHide(was_visible)`
* **Description:** Lifecycle hook called when widget becomes hidden. Override in subclasses for custom hide logic.
* **Parameters:** `was_visible` -- boolean indicating previous visible state
* **Returns:** nil
* **Error states:** None.

### `OnEnable()`
* **Description:** Lifecycle hook called when widget is enabled. Override in subclasses for custom enable logic.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `OnDisable()`
* **Description:** Lifecycle hook called when widget is disabled. Override in subclasses for custom disable logic.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `SetPosition(pos, y, z)`
* **Description:** Sets widget local position. Accepts either three numbers (x, y, z) or a single Vector3/table with Get() method.
* **Parameters:**
  - `pos` -- number (x) or Vector3/table
  - `y` -- number (y coordinate, used if pos is number)
  - `z` -- number (z coordinate, default 0)
* **Returns:** nil
* **Error states:** Errors if pos is a table without Get() method and is not a number (calls `pos:Get()` without guard).

### `GetPosition()`
* **Description:** Returns widget local position as Vector3 from UITransform.
* **Parameters:** None
* **Returns:** Vector3
* **Error states:** None.

### `GetPositionXYZ()`
* **Description:** Returns widget local position as raw x, y, z values from UITransform (not wrapped in Vector3).
* **Parameters:** None
* **Returns:** x, y, z (three numbers)
* **Error states:** None.

### `GetLocalPosition()`
* **Description:** Alias for GetPosition(); returns widget local position as Vector3.
* **Parameters:** None
* **Returns:** Vector3
* **Error states:** None.

### `GetWorldPosition()`
* **Description:** Returns widget world position as Vector3 from UITransform.
* **Parameters:** None
* **Returns:** Vector3
* **Error states:** None.

### `SetScale(pos, y, z)`
* **Description:** Sets widget scale. Accepts either three numbers (x, y, z) or a single Vector3/table with x, y, z fields.
* **Parameters:**
  - `pos` -- number (x) or Vector3/table
  - `y` -- number (y scale, default pos if pos is number)
  - `z` -- number (z scale, default pos if pos is number)
* **Returns:** nil
* **Error states:** Errors if pos is a table without x, y, z fields (accesses `pos.x`, `pos.y`, `pos.z` without guard).

### `GetScale()`
* **Description:** Returns cumulative world scale by multiplying this widget's scale with parent's scale recursively.
* **Parameters:** None
* **Returns:** Vector3
* **Error states:** None.

### `GetLooseScale()`
* **Description:** Returns this widget's local scale only (does not include parent scale).
* **Parameters:** None
* **Returns:** Vector3 (x, y, z from UITransform)
* **Error states:** None.

### `GetWorldScale()`
* **Description:** Returns widget world scale as Vector3 from UITransform.
* **Parameters:** None
* **Returns:** Vector3
* **Error states:** None.

### `SetRotation(angle)`
* **Description:** Sets widget rotation angle via UITransform.
* **Parameters:** `angle` -- number (radians)
* **Returns:** nil
* **Error states:** None.

### `GetRotation()`
* **Description:** Returns widget rotation angle from UITransform.
* **Parameters:** None
* **Returns:** number (radians)
* **Error states:** None.

### `SetMaxPropUpscale(val)`
* **Description:** Sets maximum upscaling factor for child images/props.
* **Parameters:** `val` -- number
* **Returns:** nil
* **Error states:** None.

### `SetScaleMode(mode)`
* **Description:** Sets the scale mode (e.g., SCALEMODE_PROPORTIONAL) for this widget.
* **Parameters:** `mode` -- scale mode constant
* **Returns:** nil
* **Error states:** None.

### `MoveTo(from, to, time, fn)`
* **Description:** Animates widget position from `from` to `to` over `time` seconds. Calls completion function `fn` when done. Adds uianim component if not present.
* **Parameters:**
  - `from` -- Vector3 start position
  - `to` -- Vector3 destination position
  - `time` -- number (duration in seconds)
  - `fn` -- function (completion callback, optional)
* **Returns:** nil
* **Error states:** None — adds uianim component automatically if missing.

### `CancelMoveTo(run_complete_fn)`
* **Description:** Cancels any active MoveTo animation. Calls `run_complete_fn` if provided and animation was active.
* **Parameters:** `run_complete_fn` -- function to call on cancel (optional)
* **Returns:** nil
* **Error states:** None.

### `ScaleTo(from, to, time, fn)`
* **Description:** Animates widget scale from `from` to `to` over `time` seconds. Calls completion function `fn` when done. Adds uianim component if not present.
* **Parameters:**
  - `from` -- Vector3 start scale
  - `to` -- Vector3 destination scale
  - `time` -- number (duration in seconds)
  - `fn` -- function (completion callback, optional)
* **Returns:** nil
* **Error states:** None — adds uianim component automatically if missing.

### `CancelScaleTo(run_complete_fn)`
* **Description:** Cancels any active ScaleTo animation. Calls `run_complete_fn` if provided and animation was active.
* **Parameters:** `run_complete_fn` -- function to call on cancel (optional)
* **Returns:** nil
* **Error states:** None.

### `RotateTo(from, to, time, fn, infinite)`
* **Description:** Animates widget rotation from `from` to `to` over `time` seconds. If `infinite` is true, rotation loops continuously. Adds uianim component if not present.
* **Parameters:**
  - `from` -- number (start angle in radians)
  - `to` -- number (destination angle in radians)
  - `time` -- number (duration in seconds)
  - `fn` -- function (completion callback, optional)
  - `infinite` -- boolean (loop continuously, optional)
* **Returns:** nil
* **Error states:** None — adds uianim component automatically if missing.

### `CancelRotateTo(run_complete_fn)`
* **Description:** Cancels any active RotateTo animation. Calls `run_complete_fn` if provided and animation was active.
* **Parameters:** `run_complete_fn` -- function to call on cancel (optional)
* **Returns:** nil
* **Error states:** None.

### `TintTo(from, to, time, fn)`
* **Description:** Animates widget tint colour from `from` to `to` over `time` seconds. Calls completion function `fn` when done. Adds uianim component if not present. Only works if inst.widget.SetTint exists.
* **Parameters:**
  - `from` -- ColorTable (r, g, b, a)
  - `to` -- ColorTable (r, g, b, a)
  - `time` -- number (duration in seconds)
  - `fn` -- function (completion callback, optional)
* **Returns:** nil
* **Error states:** None — silently returns if SetTint not available.

### `CancelTintTo(run_complete_fn)`
* **Description:** Cancels any active TintTo animation. Calls `run_complete_fn` if provided and animation was active.
* **Parameters:** `run_complete_fn` -- function to call on cancel (optional)
* **Returns:** nil
* **Error states:** None.

### `ForceStartWallUpdating()`
* **Description:** Forces uianim component to update every frame (wall updating). Disabled on console builds. Adds uianim component if not present.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None — returns early on console.

### `ForceStopWallUpdating()`
* **Description:** Stops forced wall updating on uianim component. Disabled on console builds. Adds uianim component if not present.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None — returns early on console.

### `SetFocus()`
* **Description:** Sets focus to this widget. Calls OnGainFocus(), notifies parent via SetFocusFromChild(), and clears focus from all children.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `ClearFocus()`
* **Description:** Removes focus from this widget. Calls OnLoseFocus(), calls onlosefocusfn if set, and recursively clears focus from children.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `SetFocusFromChild(from_child)`
* **Description:** Called by children to set focus to this widget. Clears focus from sibling children, sets focus flag, calls OnGainFocus(), and propagates up to parent.
* **Parameters:** `from_child` -- Widget instance that is yielding focus
* **Returns:** nil
* **Error states:** None — prints warning if called on non-screen widget without parent.

### `IsDeepestFocus()`
* **Description:** Returns true if this widget has focus AND none of its children have focus.
* **Parameters:** None
* **Returns:** boolean
* **Error states:** None.

### `GetDeepestFocus()`
* **Description:** Recursively finds the deepest widget with focus in this widget's subtree.
* **Parameters:** None
* **Returns:** Widget instance or nil
* **Error states:** None.

### `GetFocusChild()`
* **Description:** Returns the immediate child widget that currently has focus, if any.
* **Parameters:** None
* **Returns:** Widget instance or nil
* **Error states:** None.

### `SetFocusChangeDir(dir, widget, ...)`
* **Description:** Sets the next widget to receive focus when navigation occurs in direction `dir` (e.g., "up", "down", "left", "right"). Stores additional args to pass to destination widget's SetFocus().
* **Parameters:**
  - `dir` -- string direction name
  - `widget` -- Widget instance to focus next
  - `...` -- variadic args to pass to destination's SetFocus()
* **Returns:** nil
* **Error states:** None.

### `ClearFocusDirs()`
* **Description:** Clears all focus direction mappings and tab order reference.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `OnGainFocus()`
* **Description:** Lifecycle hook called when widget gains focus. Override in subclasses for custom focus logic.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `OnLoseFocus()`
* **Description:** Lifecycle hook called when widget loses focus. Override in subclasses for custom blur logic.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `SetOnGainFocus(fn)`
* **Description:** Sets a custom callback function to be called when widget gains focus (in addition to OnGainFocus()).
* **Parameters:** `fn` -- function to call on gain focus
* **Returns:** nil
* **Error states:** None.

### `SetOnLoseFocus(fn)`
* **Description:** Sets a custom callback function to be called when widget loses focus (in addition to OnLoseFocus()).
* **Parameters:** `fn` -- function to call on lose focus
* **Returns:** nil
* **Error states:** None.

### `OnFocusMove(dir, down)`
* **Description:** Handles focus navigation input. Propagates to focused child first, then follows focus_flow if dir matches, then passes to parent_scroll_list if set.
* **Parameters:**
  - `dir` -- string direction ("up", "down", "left", "right")
  - `down` -- boolean (button press vs release)
* **Returns:** boolean (true if handled)
* **Error states:** None.

### `OnControl(control, down)`
* **Description:** Handles controller/keyboard input. Propagates to focused child first, then passes scroll controls to parent_scroll_list if applicable.
* **Parameters:**
  - `control` -- CONTROL_* enum value
  - `down` -- boolean (button press vs release)
* **Returns:** boolean (true if handled)
* **Error states:** None.

### `OnMouseButton(button, down, x, y)`
* **Description:** Handles mouse button input. Propagates to focused child first.
* **Parameters:**
  - `button` -- mouse button enum
  - `down` -- boolean (press vs release)
  - `x` -- number (screen x coordinate)
  - `y` -- number (screen y coordinate)
* **Returns:** boolean (true if handled)
* **Error states:** None.

### `OnRawKey(key, down)`
* **Description:** Handles raw keyboard input. Propagates to focused child first.
* **Parameters:**
  - `key` -- keyboard key enum
  - `down` -- boolean (press vs release)
* **Returns:** boolean (true if handled)
* **Error states:** None.

### `OnTextInput(text)`
* **Description:** Handles text input events (e.g., from IME or virtual keyboard). Propagates to focused child first.
* **Parameters:** `text` -- string input
* **Returns:** boolean (true if handled)
* **Error states:** None.

### `OnStopForceProcessTextInput()`
* **Description:** Placeholder for stopping forced text input processing. Currently empty.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `IsEditing()`
* **Description:** Recursively checks if this widget or any child has `editing` flag set (for text input widgets).
* **Parameters:** None
* **Returns:** boolean
* **Error states:** None.

### `HookCallback(event, fn)`
* **Description:** Registers a callback function for an entity event. Removes any existing callback for the same event before registering new one.
* **Parameters:**
  - `event` -- string event name
  - `fn` -- function to call on event
* **Returns:** nil
* **Error states:** None.

### `UnhookCallback(event)`
* **Description:** Removes a registered callback for an event and clears from callbacks table.
* **Parameters:** `event` -- string event name
* **Returns:** nil
* **Error states:** None.

### `HasCallback(event)`
* **Description:** Returns true if a callback is registered for the given event.
* **Parameters:** `event` -- string event name
* **Returns:** boolean
* **Error states:** None.

### `SetTooltip(str)`
* **Description:** Sets the tooltip text for this widget.
* **Parameters:** `str` -- string tooltip text
* **Returns:** nil
* **Error states:** None.

### `GetTooltip()`
* **Description:** Returns tooltip text from deepest focused child, or this widget's tooltip if no child has one. Returns nil if not focused.
* **Parameters:** None
* **Returns:** string or nil
* **Error states:** None.

### `SetTooltipPos(pos, pos_y, pos_z)`
* **Description:** Sets custom tooltip position offset. Accepts either three numbers or a single Vector3/table.
* **Parameters:**
  - `pos` -- number (x) or Vector3/table
  - `pos_y` -- number (y, used if pos is number)
  - `pos_z` -- number (z, used if pos is number)
* **Returns:** nil
* **Error states:** None — checks inst validity and prints debug info if invalid, but continues execution.

### `GetTooltipPos()`
* **Description:** Returns tooltip position from deepest focused child, or this widget's tooltip_pos if no child has one. Returns nil if not focused.
* **Parameters:** None
* **Returns:** Vector3 or nil
* **Error states:** None.

### `SetTooltipColour(r, g, b, a)`
* **Description:** Sets tooltip text colour as RGBA values.
* **Parameters:**
  - `r` -- number (red, 0-1)
  - `g` -- number (green, 0-1)
  - `b` -- number (blue, 0-1)
  - `a` -- number (alpha, 0-1)
* **Returns:** nil
* **Error states:** None.

### `GetTooltipColour()`
* **Description:** Returns tooltip colour from deepest focused child, or this widget's tooltipcolour if no child has one. Returns nil if not focused.
* **Parameters:** None
* **Returns:** table (RGBA) or nil
* **Error states:** None.

### `SetHoverText(text, params)`
* **Description:** Creates a hover text popup that appears when widget gains focus. Creates hovertext_root, hovertext_bg (Image), and hovertext (Text) widgets. Supports custom font, size, colour, word wrap, region size, and offset. If widget has GetString(), creates invisible ImageButton to capture focus for hover.
* **Parameters:**
  - `text` -- string hover text content
  - `params` -- table with optional fields: font, font_size, colour, bg, bg_atlas, bg_texture, offset_x, offset_y, region_w, region_h, wordwrap, attach_to_parent
* **Returns:** nil
* **Error states:** Errors if params.attach_to_parent is set but is not a valid Widget (calls AddChild without guard).

### `ClearHoverText()`
* **Description:** Destroys hover text widgets and restores original OnGainFocus/OnLoseFocus if they were wrapped.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `FollowMouse()`
* **Description:** Makes widget follow mouse cursor position. Adds input move handler and sets initial position to current screen position.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `StopFollowMouse()`
* **Description:** Stops mouse following by removing the input move handler.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `SetParentScrollList(list)`
* **Description:** Sets the parent scroll list for scroll control passthrough.
* **Parameters:** `list` -- ScrollList instance
* **Returns:** nil
* **Error states:** None.

### `GetParent()`
* **Description:** Returns the parent widget in the hierarchy.
* **Parameters:** None
* **Returns:** Widget instance or nil
* **Error states:** None.

### `GetParentScreen()`
* **Description:** Returns the root screen widget by traversing up the parent chain. Caches result in parent_screen for subsequent calls.
* **Parameters:** None
* **Returns:** Screen instance
* **Error states:** Errors if widget is not part of a screen hierarchy (infinite loop if no parent.is_screen found).

### `GetChildren()`
* **Description:** Returns the children table (dictionary of child widgets).
* **Parameters:** None
* **Returns:** table
* **Error states:** None.

### `StartUpdating()`
* **Description:** Registers widget with TheFrontEnd for per-frame updates via StartUpdatingWidget().
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `StopUpdating()`
* **Description:** Unregisters widget from TheFrontEnd update loop via StopUpdatingWidget().
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `SetFadeAlpha(alpha, skipChildren)`
* **Description:** Sets alpha fade value. Recursively applies to children unless skipChildren is true. Respects can_fade_alpha flag.
* **Parameters:**
  - `alpha` -- number (0-1)
  - `skipChildren` -- boolean (default false)
* **Returns:** nil
* **Error states:** None.

### `SetCanFadeAlpha(fade, skipChildren)`
* **Description:** Enables or disables alpha fading. Recursively applies to children unless skipChildren is true.
* **Parameters:**
  - `fade` -- boolean
  - `skipChildren` -- boolean (default false)
* **Returns:** nil
* **Error states:** None.

### `SetClickable(val)`
* **Description:** Sets whether the widget entity accepts click input.
* **Parameters:** `val` -- boolean
* **Returns:** nil
* **Error states:** None.

### `MoveToBack()`
* **Description:** Moves widget entity to back of render order.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `MoveToFront()`
* **Description:** Moves widget entity to front of render order.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `UpdatePosition(x, y)`
* **Description:** Helper to update position from mouse coordinates. Used by FollowMouse handler.
* **Parameters:**
  - `x` -- number (screen x)
  - `y` -- number (screen y)
* **Returns:** nil
* **Error states:** None.

### `Nudge(offset)`
* **Description:** Offsets current position by given Vector3 offset.
* **Parameters:** `offset` -- Vector3
* **Returns:** nil
* **Error states:** None.

### `SetHAnchor(anchor)`
* **Description:** Sets horizontal anchor for UI positioning (ANCHOR_LEFT, ANCHOR_RIGHT, ANCHOR_MIDDLE).
* **Parameters:** `anchor` -- anchor enum
* **Returns:** nil
* **Error states:** None.

### `SetVAnchor(anchor)`
* **Description:** Sets vertical anchor for UI positioning (ANCHOR_TOP, ANCHOR_BOTTOM, ANCHOR_MIDDLE).
* **Parameters:** `anchor` -- anchor enum
* **Returns:** nil
* **Error states:** None.

### `SetScissor(x, y, w, h)`
* **Description:** Sets scissor rectangle for clipping widget rendering.
* **Parameters:**
  - `x` -- number (left)
  - `y` -- number (top)
  - `w` -- number (width)
  - `h` -- number (height)
* **Returns:** nil
* **Error states:** None.

### `GetStr(indent)`
* **Description:** Returns debug string representation of widget hierarchy with indentation. Includes focus and enabled state.
* **Parameters:** `indent` -- number (indentation level, default 0)
* **Returns:** string
* **Error states:** None.

### `__tostring()`
* **Description:** Returns widget name as string representation.
* **Parameters:** None
* **Returns:** string
* **Error states:** None.

## Events & listeners
**Listens to:**
- Dynamic events via `HookCallback(event, fn)` — widgets can subscribe to any entity event through the inst entity

**Pushes:**
- None identified — widgets typically communicate via direct method calls rather than pushing events
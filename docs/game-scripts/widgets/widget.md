---
id: widget
title: Widget
description: Provides a foundational UI widget class with layout, focus, animation, and event management for frontend screens.
tags: [ui, layout, focus, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 8f3ea9e6
system_scope: ui
---

# Widget

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Widget` is the base class for all UI components in DST's frontend system. It manages entity hierarchy, visibility, focus flow, and animation via an underlying `uianim` component. Widgets can be nested in a tree structure, participate in keyboard navigation, support hover text tooltips, and run tasks independently of game simulation to remain responsive during pause.

## Usage example
```lua
local Widget = require "widgets/widget"
local my_widget = Widget("my_custom_widget")
my_widget:SetPosition(100, 100, 0)
my_widget:SetScale(1.5)
my_widget:Enable()
my_widget:Show()
my_widget:SetFocus()
```

## Dependencies & tags
**Components used:** `uianim` (added automatically), `UITransform` (added automatically via `entity:AddUITransform()`), `entity` system  
**Tags:** Adds `widget` and `UI` tags to the internal entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `name` | string | `"widget"` | Name used for identification and debugging. |
| `children` | table | `{}` | Map of child widgets (`child → child` entries). |
| `callbacks` | table | `{}` | Map of event handlers (`event → fn`). |
| `enabled` | boolean | `true` | Whether the widget processes input and is considered enabled. |
| `shown` | boolean | `true` | Whether the widget is visible (does not account for parent visibility). |
| `focus` | boolean | `false` | Whether this widget currently has keyboard focus. |
| `focus_target` | boolean | `false` | Reserved for future focus target behavior (unused in source). |
| `can_fade_alpha` | boolean | `true` | Controls whether `SetFadeAlpha` affects this widget. |
| `focus_flow` | table | `{}` | Maps `dir` (e.g., `"up"`, `"down"`) to next focus widget. |
| `focus_flow_args` | table | `{}` | Extra arguments passed to `SetFocus` when following focus paths. |
| `parent` | Widget or `nil` | `nil` | Parent widget in the hierarchy. |
| `parent_screen` | Widget or `nil` | `nil` | Cached top-level screen container. |
| `parent_scroll_list` | ScrollList or `nil` | `nil` | Parent scroll list for handling scroll input. |
| `tooltip` | string or `nil` | `nil` | Tooltip text string. |
| `tooltip_pos` | Vector3 or `nil` | `nil` | Tooltip position offset. |
| `tooltipcolour` | `{r,g,b,a}` or `nil` | `nil` | Tooltip tint color. |
| `hovertext_root`, `hovertext`, `hovertext_bg` | Widget or Text or Image or `nil` | `nil` | Hover tooltip UI elements (created lazily). |

## Main functions
### `UpdateWhilePaused(update_while_paused)`
* **Description:** Configures whether the widget’s tasks run during simulation pauses (e.g., server pause). When enabled, tasks use `DoStaticPeriodicTask`/`DoStaticTaskInTime`.
* **Parameters:** `update_while_paused` (boolean) — if `true`, tasks continue during pause.
* **Returns:** Nothing.

### `IsDeepestFocus()`
* **Description:** Returns `true` if this widget has focus and none of its children do (i.e., it is the deepest focused widget).
* **Parameters:** None.
* **Returns:** `boolean`.

### `OnMouseButton(button, down, x, y)`
* **Description:** Handles mouse button events, propagating to focused children. Override for custom behavior.
* **Parameters:**  
  `button` (string) — e.g., `"left"`, `"right"`.  
  `down` (boolean) — whether the button was pressed (`true`) or released (`false`).  
  `x`, `y` (number) — screen coordinates.  
* **Returns:** `true` if the event was consumed by a child.

### `MoveToBack()`, `MoveToFront()`
* **Description:** Adjusts widget rendering order relative to siblings.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnFocusMove(dir, down)`
* **Description:** Handles directional focus movement (e.g., Tab/arrow keys). Uses `focus_flow` to jump to predefined widgets if no child accepts focus.
* **Parameters:**  
  `dir` (string) — direction key (e.g., `"up"`, `"down"`, `"left"`, `"right"`).  
  `down` (boolean) — whether key was pressed.  
* **Returns:** `true` if focus change succeeded.

### `IsVisible()`
* **Description:** Computes visibility recursively based on `shown` and parent visibility.
* **Parameters:** None.
* **Returns:** `boolean`.

### `OnRawKey(key, down)`, `OnTextInput(text)`, `OnStopForceProcessTextInput()`, `OnControl(control, down)`
* **Description:** Input handlers for keyboard and text input. Propagate to focused children; `OnControl` handles scroll controls for scroll-list parenting.
* **Parameters:**  
  `key` (string) — raw key code.  
  `text` (string) —TextInput character(s).  
  `control` (number/string) — e.g., `CONTROL_SCROLLBACK`, `CONTROL_SCROLLFWD`.  
  `down` (boolean) — key press state.  
* **Returns:** `true` if handled.

### `SetParentScrollList(list)`
* **Description:** Associates the widget with a parent scroll list to delegate scroll control.
* **Parameters:** `list` (ScrollList) — scroll container to delegate to.
* **Returns:** Nothing.

### `IsEditing()`
* **Description:** Recursively checks if any child currently has text edit focus.
* **Parameters:** None.
* **Returns:** `boolean`.

### `CancelMoveTo(run_complete_fn)`
### `MoveTo(from, to, time, fn)`
### `CancelRotateTo(run_complete_fn)`
### `RotateTo(from, to, time, fn, infinite)`
### `CancelScaleTo(run_complete_fn)`
### `ScaleTo(from, to, time, fn)`
### `CancelTintTo(run_complete_fn)`
### `TintTo(from, to, time, fn)`
* **Description:** Wrappers for the `uianim` component's animation functions. Automatically adds `uianim` if missing.
* **Parameters:**  
  `from`, `to` (Vector3 or number) — start/end values (scale or position) or single numbers for uniform scaling/position.  
  `time` (number) — duration in seconds.  
  `fn` (function or `nil`) — completion callback.  
  `infinite` (boolean, `RotateTo` only) — if `true`, rotation repeats indefinitely.  
* **Returns:** Nothing.

### `ForceStartWallUpdating()`, `ForceStopWallUpdating()`
* **Description:** Forces UI wall updating on/off. Disabled on console builds.
* **Parameters:** None.
* **Returns:** Nothing.

### `IsEnabled()`
* **Description:** Checks if the widget and all parents are enabled.
* **Parameters:** None.
* **Returns:** `boolean`.

### `GetParent()`, `GetParentScreen()`, `GetChildren()`
* **Description:** Navigation helpers for widget hierarchy.
* **Parameters:** None.
* **Returns:** Parent widget, top-level screen, or child list (`{}` if none).

### `Enable()`, `Disable()`, `OnEnable()`, `OnDisable()`
* **Description:** Toggles and responds to enable state changes. `OnEnable`/`OnDisable` are overridable hooks.
* **Parameters:** None.
* **Returns:** Nothing.

### `RemoveChild(child)`, `KillAllChildren()`, `AddChild(child)`
* **Description:** Manages child hierarchy. `AddChild` automatically adjusts entity parenting and focus flow.
* **Parameters:** `child` (Widget) — widget to add/remove/kill.
* **Returns:** `AddChild` returns `child` (for chaining).

### `Hide()`, `Show()`, `OnHide(was_visible)`, `OnShow(was_hidden)`
* **Description:** Controls visibility state and notifies subclasses via hooks.
* **Parameters:** `was_visible`/`was_hidden` (boolean) — previous state.
* **Returns:** Nothing.

### `Kill()`
* **Description:** Destroys the widget: stops updates, kills children, detaches from parent, and removes the internal entity.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetPosition()`, `GetWorldPosition()`, `SetPosition(pos, y, z)`
### `GetRotation()`, `SetRotation(angle)`
### `GetScale()`, `GetLooseScale()`, `SetScale(pos, y, z)`
### `Nudge(offset)`
### `GetWorldScale()`
* **Description:** Position/rotation/scale getters and setters via `UITransform`.
* **Parameters:** Coordinates and vectors accepted as tables or numbers (unified via overloads).
* **Returns:** `Vector3` for getters.

### `HookCallback(event, fn)`, `UnhookCallback(event)`
* **Description:** Attaches/detaches event listeners and manages their lifecycle.
* **Parameters:** `event` (string) — event name; `fn` (function) — handler.
* **Returns:** Nothing.

### `SetVAnchor(anchor)`, `SetHAnchor(anchor)`
* **Description:** Sets vertical/horizontal anchor points for layout.
* **Parameters:** `anchor` (string) — e.g., `"top"`, `"bottom"`, `"left"`, `"right"`, `"center"`.
* **Returns:** Nothing.

### `SetTooltip(...)`, `GetTooltip()`, `GetTooltipPos()`, `GetTooltipColour()`
* **Description:** Sets/gets tooltip text, position, and color. `GetTooltip*` methods prefer child overrides when focused.
* **Parameters:**  
  `str` (string) — tooltip text.  
  `pos` (Vector3 or `{x,y,z}`) — position offset.  
  `r,g,b,a` (number) — color components.  
* **Returns:** `GetTooltip*` return tooltip data (or child’s data if focused).

### `StartUpdating()`, `StopUpdating()`
* **Description:** Registers/unregisters widget with `TheFrontEnd` to receive periodic updates.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetFadeAlpha(alpha, skipChildren)`, `SetCanFadeAlpha(fade, skipChildren)`
* **Description:** Controls alpha blending during fade states (e.g., modal overlays).
* **Parameters:**  
  `alpha` (number) — target alpha (`0`–`1`).  
  `fade` (boolean) — whether fading is allowed.  
  `skipChildren` (boolean) — if `true`, only affect this widget.  
* **Returns:** Nothing.

### `SetClickable(val)`
* **Description:** Enables/disables UI raycasting for mouse clicks on this widget.
* **Parameters:** `val` (boolean).
* **Returns:** Nothing.

### `UpdatePosition(x, y)`
* **Description:** Convenience method to set 2D position with `z = 0`.
* **Parameters:** `x`, `y` (number) — screen coordinates.
* **Returns:** Nothing.

### `FollowMouse()`, `StopFollowMouse()`
* **Description:** Attaches/detaches a mouse-move handler to track cursor position.
* **Parameters:** None.
* **Returns:** Nothing.

### Focus management (`SetFocus()`, `ClearFocus()`, `GetDeepestFocus()`, etc.)
* **Description:** Core focus navigation API for keyboard focus. `SetFocus` clears sibling focus, `ClearFocus` clears children recursively. Overridable hooks: `OnGainFocus`, `OnLoseFocus`.
* **Parameters:** `SetFocus` and `SetFocusFromChild` take no args; `SetFocusChangeDir(dir, widget, ...)` accepts direction, target widget, and optional args.
* **Returns:** `GetDeepestFocus` returns the deepest focused widget (or `nil`).

### `GetStr(indent)`
* **Description:** Generates a debug tree string (indented with tabs).
* **Parameters:** `indent` (number) — initial indentation level.
* **Returns:** `string`.

### `SetHoverText(text, params)`, `ClearHoverText()`
* **Description:** Creates/updates a custom tooltip with optional background, text, and dynamic positioning. Supports attachment to parent or global screen.
* **Parameters:**  
  `text` (string) — hover text.  
  `params` (table) — supports `bg`, `bg_atlas`, `bg_texture`, `font`, `font_size`, `colour`, `offset_x`, `offset_y`, `attach_to_parent`, `region_w`, `region_h`, `wordwrap`.  
* **Returns:** Nothing.

### `SetScissor(x, y, w, h)`
* **Description:** Sets a scissor rectangle to clip widget rendering.
* **Parameters:** `x`, `y`, `w`, `h` (number) — scissor bounds in local space.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None directly — `HookCallback` and `UnhookCallback` manage event registration dynamically.  
- **Pushes:** `Widget` itself does not push events, but child classes or host screens may use `inst:PushEvent`.
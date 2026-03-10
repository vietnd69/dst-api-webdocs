---
id: input
title: Input
description: Central input management component that handles keyboard, mouse, and controller input events for the game.
tags: [input, controls, keyboard, mouse, controller]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 33001f7e
system_scope: input
---

# Input

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`Input` is the global input management component responsible for handling all keyboard, mouse, and controller input events in Don't Starve Together. It centralizes event processing for keys, mouse buttons, movement, text input, and gestures, and provides utility functions for coordinate conversion, entity hover detection, control scheme resolution, and virtual keyboard management. It is instantiated once as `TheInput` and acts as a bridge between raw input events and higher-level game systems.

## Usage example
```lua
-- Example: Add a key handler for the 'E' key
local function onEKeyDown()
    print("E key pressed")
end
TheInput:AddKeyDownHandler(KEY_E, onEKeyDown)

-- Example: Check if the player is using a controller
if TheInput:ControllerAttached() then
    print("Controller is active")
end

-- Example: Get localized control string for a virtual control
local controlStr = TheInput:GetLocalizedControl(0, CONTROL_PRIMARY)
print("Primary action is mapped to:", controlStr)
```

## Dependencies & tags
**Components used:** `TheInputProxy`, `TheSim`, `TheFrontEnd`, `TheNet`, `Profile`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `onkey` | EventProcessor | `EventProcessor()` | Events fired for all keys (down and up) with key parameter. |
| `onkeyup` | EventProcessor | `EventProcessor()` | Events fired on key release, no parameters. |
| `onkeydown` | EventProcessor | `EventProcessor()` | Events fired on key press, no parameters. |
| `onmousebutton` | EventProcessor | `EventProcessor()` | Events fired on mouse button events. |
| `position` | EventProcessor | `EventProcessor()` | Events fired on mouse movement. |
| `oncontrol` | EventProcessor | `EventProcessor()` | Events fired for game controls (digital/analog). |
| `ontextinput` | EventProcessor | `EventProcessor()` | Events fired for text input. |
| `ongesture` | EventProcessor | `EventProcessor()` | Events fired for gestures (e.g., touch). |
| `hoverinst` | entity or `nil` | `nil` | The entity currently under the mouse cursor. |
| `enabledebugtoggle` | boolean | `true` | Controls whether the debug toggle key functionality is enabled. |
| `mouse_enabled` | boolean | `IsNotConsole() and not TheNet:IsDedicated()` | Whether mouse input is enabled. |
| `overridepos` | Vector3 or `nil` | `nil` | Unused; reserved for coordinate override. |
| `controllerid_cached` | number or `nil` | `nil` | Cached ID of the most recently active controller. |
| `entitiesundermouse` | array of entities | `{}` | List of entities at mouse position (set during `OnUpdate`). |
| `vk_text_widget` | TextWidget or `nil` | `nil` | Reference to the text widget currently using the virtual keyboard. |

## Main functions
### `DisableAllControllers()`
*   **Description:** Disables all connected input devices except device ID `0` (typically keyboard/mouse).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `EnableAllControllers()`
*   **Description:** Enables all connected input devices (except ID `0`).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `IsControllerLoggedIn(controller)`
*   **Description:** Checks if a specific controller user is logged in. Only applicable on Xbox One consoles.
*   **Parameters:** `controller` (number) - controller index.
*   **Returns:** `true` if logged in (or always on non-Xbox platforms); `false` if not logged in.

### `LogUserAsync(controller, cb)`
*   **Description:** Asynchronously logs in a controller user. Implemented only for Xbox One.
*   **Parameters:** `controller` (number) - controller index; `cb` (function) - callback function accepting a boolean success indicator.
*   **Returns:** Nothing.

### `EnableMouse(enable)`
*   **Description:** Enables or disables mouse input based on platform and net mode.
*   **Parameters:** `enable` (boolean) - whether to enable mouse input.
*   **Returns:** Nothing.

### `CacheController()`
*   **Description:** Caches the ID of the last active controller for faster repeated access.
*   **Parameters:** None.
*   **Returns:** `number or nil` — cached controller ID, or `nil` if none.

### `GetControllerID()`
*   **Description:** Returns the cached controller ID, or the last active controller ID if no cache is set.
*   **Parameters:** None.
*   **Returns:** `number` — controller ID (always `0` on non-console).

### `ControllerAttached()`
*   **Description:** Checks if any controller is attached and active (connected and enabled).
*   **Parameters:** None.
*   **Returns:** `true` if controller is active; `false` otherwise.

### `GetInputDevices()`
*   **Description:** Returns a list of connected input devices with their localized names and IDs.
*   **Parameters:** None.
*   **Returns:** `array` — table of `{ text = string, data = number }` entries.

### `AddKeyUpHandler(key, fn)`
*   **Description:** Registers a handler function to be called when a specific key is released.
*   **Parameters:** `key` (string or key constant) — key identifier; `fn` (function) — handler function.
*   **Returns:** `handler ID` — identifier for the registered handler (used for removal).

### `AddKeyDownHandler(key, fn)`
*   **Description:** Registers a handler function to be called when a specific key is pressed.
*   **Parameters:** `key` (string or key constant) — key identifier; `fn` (function) — handler function.
*   **Returns:** `handler ID`.

### `AddKeyHandler(fn)`
*   **Description:** Registers a handler function for all keys (both press and release).
*   **Parameters:** `fn` (function) — handler function.
*   **Returns:** `handler ID`.

### `AddMouseButtonHandler(fn)`
*   **Description:** Registers a handler function for mouse button events.
*   **Parameters:** `fn` (function) — handler function.
*   **Returns:** `handler ID`.

### `AddMoveHandler(fn)`
*   **Description:** Registers a handler function for mouse movement events.
*   **Parameters:** `fn` (function) — handler function.
*   **Returns:** `handler ID`.

### `AddControlHandler(control, fn)`
*   **Description:** Registers a handler function for a specific virtual control event.
*   **Parameters:** `control` (string or control constant) — control name; `fn` (function) — handler function.
*   **Returns:** `handler ID`.

### `AddGeneralControlHandler(fn)`
*   **Description:** Registers a handler function for all control events (generic control type).
*   **Parameters:** `fn` (function) — handler function.
*   **Returns:** `handler ID`.

### `AddControlMappingHandler(fn)`
*   **Description:** Registers a handler function for control mapping change events.
*   **Parameters:** `fn` (function) — handler function.
*   **Returns:** `handler ID`.

### `AddGestureHandler(gesture, fn)`
*   **Description:** Registers a handler function for a specific gesture event.
*   **Parameters:** `gesture` (string) — gesture identifier; `fn` (function) — handler function.
*   **Returns:** `handler ID`.

### `OnControl(control, digitalvalue, analogvalue)`
*   **Description:** Processes a control event (digital/analog) and forwards to registered handlers. Filters out mouse controls if mouse is disabled.
*   **Parameters:** `control` (number or string) — control identifier; `digitalvalue` (number or boolean) — digital state; `analogvalue` (number) — analog value (e.g., stick axis).
*   **Returns:** Nothing.

### `OnMouseMove(x, y)`
*   **Description:** Handles mouse movement events, forwarding to `TheFrontEnd`.
*   **Parameters:** `x` (number), `y` (number) — mouse position in screen coordinates.
*   **Returns:** Nothing.

### `OnMouseButton(button, down, x, y)`
*   **Description:** Handles mouse button events.
*   **Parameters:** `button` (number) — button index; `down` (boolean) — whether the button is pressed; `x`, `y` — screen coordinates.
*   **Returns:** Nothing.

### `OnRawKey(key, down)`
*   **Description:** Processes raw key events and fires `onkey`, `onkeydown`, and `onkeyup`.
*   **Parameters:** `key` (key constant or string) — key identifier; `down` (boolean) — key state.
*   **Returns:** Nothing.

### `OnText(text)`
*   **Description:** Fires text input events (e.g., for virtual keyboard).
*   **Parameters:** `text` (string) — input text.
*   **Returns:** Nothing.

### `OpenVirtualKeyboard(text_widget)`
*   **Description:** Attempts to open the platform's virtual keyboard for a text widget.
*   **Parameters:** `text_widget` (TextWidget) — widget to bind to keyboard.
*   **Returns:** `true` if keyboard opened successfully; `false` otherwise.

### `AbortVirtualKeyboard(for_text_widget)`
*   **Description:** Cancels the virtual keyboard if it is active for the specified widget.
*   **Parameters:** `for_text_widget` (TextWidget or `nil`) — widget instance.
*   **Returns:** Nothing.

### `OnControlMapped(deviceId, controlId, inputId, hasChanged)`
*   **Description:** Processes control mapping changes.
*   **Parameters:** `deviceId` (number), `controlId` (number), `inputId` (number), `hasChanged` (boolean).
*   **Returns:** Nothing.

### `GetScreenPosition()`
*   **Description:** Returns the current screen-space cursor position.
*   **Parameters:** None.
*   **Returns:** `Vector3` — screen position (x, y, 0).

### `GetWorldPosition()`
*   **Description:** Projects the current screen position into world coordinates.
*   **Parameters:** None.
*   **Returns:** `Vector3 or nil` — world position (x, y, z), or `nil` if projection fails.

### `GetWorldXZWithHeight(height)`
*   **Description:** Projects screen position to world X and Z coordinates at a given height.
*   **Parameters:** `height` (number) — Y-coordinate (height) to use in projection.
*   **Returns:** `x` (number), `z` (number) — world coordinates.

### `GetAllEntitiesUnderMouse()`
*   **Description:** Returns the list of entities under the mouse cursor.
*   **Parameters:** None.
*   **Returns:** `array` — list of entity instances (empty if mouse disabled).

### `GetWorldEntityUnderMouse()`
*   **Description:** Returns the topmost world-space entity under the mouse (with transform).
*   **Parameters:** None.
*   **Returns:** `entity or nil` — valid, visible entity with transform, or `nil`.

### `GetHUDEntityUnderMouse()`
*   **Description:** Returns the topmost HUD element under the mouse (no transform).
*   **Parameters:** None.
*   **Returns:** `entity or nil` — valid, visible HUD entity, or `nil`.

### `IsMouseDown(button)`
*   **Description:** Checks whether a mouse button is currently held down.
*   **Parameters:** `button` (number) — mouse button index.
*   **Returns:** `boolean` — whether button is pressed.

### `IsKeyDown(key)`
*   **Description:** Checks whether a key is currently held down.
*   **Parameters:** `key` (key constant or string) — key identifier.
*   **Returns:** `boolean` — whether key is pressed.

### `ResolveVirtualControls(control)`
*   **Description:** Converts virtual controls (e.g., `VIRTUAL_CONTROL_AIM_UP`) to physical controls, respecting active control schemes and HUD state.
*   **Parameters:** `control` (number) — virtual control ID.
*   **Returns:** `number or nil` — resolved physical control ID, or `nil` if blocked (e.g., HUD overlay).

### `IsControlPressed(control)`
*   **Description:** Checks if a control (virtual or physical) is currently pressed.
*   **Parameters:** `control` (number) — control ID.
*   **Returns:** `boolean` — whether the control is pressed.

### `GetAnalogControlValue(control)`
*   **Description:** Gets the current analog value of a control (e.g., stick axis).
*   **Parameters:** `control` (number) — control ID.
*   **Returns:** `number` — analog value (`0` to `1` or `-1` to `1`), or `0` if unmapped.

### `GetActiveControlScheme(schemeId)`
*   **Description:** Returns the currently active control scheme for a given scheme group.
*   **Parameters:** `schemeId` (number) — e.g., `CONTROL_SCHEME_CAM_AND_INV`.
*   **Returns:** `number` — scheme index (`1` to `7`).

### `SupportsControllerFreeAiming()`
*   **Description:** Checks if controller free aiming (twin-stick style) is supported in the active scheme.
*   **Parameters:** None.
*   **Returns:** `true` if schemes `4` to `7` are active.

### `SupportsControllerFreeCamera()`
*   **Description:** Checks if controller free camera (R-stick) is supported in the active scheme.
*   **Parameters:** None.
*   **Returns:** `true` if schemes `2` to `7` are active.

### `GetLocalizedControl(deviceId, controlId, use_default_mapping, use_control_mapper)`
*   **Description:** Returns a localized string representation of a control (e.g., "W", "A", "Right Stick Up").
*   **Parameters:** `deviceId` (number), `controlId` (number), `use_default_mapping` (boolean), `use_control_mapper` (boolean).
*   **Returns:** `string` — human-readable control binding.

### `GetLocalizedVirtualControl(deviceId, controlId, use_default_mapping, use_control_mapper)`
*   **Description:** Resolves and localizes a virtual control using the active control scheme and modifiers.
*   **Parameters:** `deviceId`, `controlId`, `use_default_mapping`, `use_control_mapper` (same as `GetLocalizedControl`).
*   **Returns:** `string` — localized control binding, including modifier if needed.

### `IsPasteKey(key)`
*   **Description:** Checks if a key combination represents the paste action (platform-dependent).
*   **Parameters:** `key` (key constant) — key to test.
*   **Returns:** `true` if it matches paste key combo; `false` otherwise.

### `UpdateEntitiesUnderMouse()`
*   **Description:** Updates the `entitiesundermouse` list based on the current mouse position.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnUpdate()`
*   **Description:** Updates mouse-over state and fires `mouseover`/`mouseout` events. Handles `CanMouseThrough` logic.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `IsControlMapped(deviceId, controlId)`
*   **Description:** Checks if a control is mapped to at least one physical input.
*   **Parameters:** `deviceId` (number), `controlId` (number).
*   **Returns:** `true` if mapped; `false` otherwise.

### `ControlsHaveSameMapping(deviceId, controlId_1, controlId_2)`
*   **Description:** Checks if two controls have identical physical mappings.
*   **Parameters:** `deviceId`, `controlId_1`, `controlId_2`.
*   **Returns:** `true` if all inputs match; `false` otherwise.

### `PlatformUsesVirtualKeyboard()`
*   **Description:** Returns whether the current platform uses a virtual keyboard.
*   **Parameters:** None.
*   **Returns:** `true` on consoles or Steam Deck; `false` otherwise.

## Events & listeners
- **Listens to:** Internal raw events (`OnMouseMove`, `OnInputKey`, `OnControl`, `OnMouseButton`, `OnInputText`, `OnGesture`, `OnControlMapped`) called from global event functions.
- **Pushes:** `mouseover`, `mouseout` — fired when hover entity changes.
---
id: uianimbutton
title: Uianimbutton
description: A UI button widget that plays back animations based on its state (idle, focus, disabled, down, selected).
tags: [ui, widget, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 26668c65
system_scope: ui
---

# Uianimbutton

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`UIAnimButton` is a UI widget that extends `Button` and adds support for animated visual feedback based on button state transitions. It uses an internal `UIAnim` child widget to manage animation states and provides methods to assign and play different animations for idle, focus, disabled, down (pressed), and selected states. It integrates with the game's UI focus and input systems to trigger appropriate animations during user interaction.

## Usage example
```lua
local button = UIAnimButton("bank_name", "build_name", "idle", "focus", "disabled", "down", "selected")
button:SetOnFocus(function() print("Button focused!") end)
button:SetOnLoseFocus(function() print("Button lost focus.") end)
button:SetOnDown(function() print("Button pressed.") end)
button:SetOnClick(function() print("Button clicked.") end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `button` and `uianimbutton` tags via `Button._ctor`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `uianim` | `UIAnim` | (none) | Child widget managing the animation state. |
| `animstate` | `AnimState` | (none) | Reference to the `AnimState` obtained from `uianim`. |
| `idleanimation` | string | `nil` | Name of the animation to play when the button is in normal (idle) state. |
| `focusanimation` | string | `nil` | Name of the animation to play when the button gains focus. |
| `disabledanimation` | string | `nil` | Name of the animation to play when the button is disabled. |
| `downanimation` | string | `nil` | Name of the animation to play while the button is pressed down. |
| `selectedanimation` | string | `nil` | Name of the animation to play when the button is selected (e.g., via keyboard nav). |
| `loops` | table | `{}` | Mapping of animation names to loop flags (boolean). |
| `onfocus`, `onlosefocus`, `ondown`, `onclick`, `whiledown` | function or `nil` | `nil` | Optional callback functions for state events. |
| `down` | boolean | `false` | Internal flag indicating whether the button is currently held down. |

## Main functions
### `UIAnimButton(bank, build, idle_anim, focus_anim, disabled_anim, down_anim, selected_anim)`
*   **Description:** Constructor. Initializes the button with animation assets and sets up the internal `UIAnim` child. Assigns initial animations.
*   **Parameters:**  
    - `bank` (string) – Animation bank name.  
    - `build` (string) – Build name for the `AnimState`.  
    - `idle_anim` (string) – Name of the idle animation.  
    - `focus_anim` (string) – Name of the focus animation.  
    - `disabled_anim` (string) – Name of the disabled animation.  
    - `down_anim` (string) – Name of the down animation.  
    - `selected_anim` (string) – Name of the selected animation.
*   **Returns:** Nothing.

### `SetAnimations(idle_anim, focus_anim, disabled_anim, down_anim, selected_anim, loop)`
*   **Description:** Sets all animation types at once using `SetIdleAnim`, `SetFocusAnim`, etc. Optional `loop` flag is applied to all.
*   **Parameters:**  
    - `idle_anim`, `focus_anim`, `disabled_anim`, `down_anim`, `selected_anim` (strings or `nil`) – Animation names.  
    - `loop` (boolean or `nil`) – Loop flag applied to each animation.
*   **Returns:** Nothing.

### `SetIdleAnim(idle_anim, loop)`
*   **Description:** Assigns and plays the idle animation if the button is in normal, non-down state.
*   **Parameters:**  
    - `idle_anim` (string or `nil`) – Animation name to use. `nil` returns early.  
    - `loop` (boolean or `nil`) – Whether the animation should loop.
*   **Returns:** Nothing.

### `SetFocusAnim(focus_anim, loop)`
*   **Description:** Assigns and plays the focus animation if the button is in focused state.
*   **Parameters:**  
    - `focus_anim` (string or `nil`) – Animation name.  
    - `loop` (boolean or `nil`) – Loop flag.
*   **Returns:** Nothing.

### `SetDisabledAnim(disabled_anim, loop)`
*   **Description:** Assigns and plays the disabled animation if the button is disabled.
*   **Parameters:**  
    - `disabled_anim` (string or `nil`) – Animation name.  
    - `loop` (boolean or `nil`) – Loop flag.
*   **Returns:** Nothing.

### `SetDownAnim(down_anim, loop)`
*   **Description:** Assigns and plays the down animation if the button is currently pressed.
*   **Parameters:**  
    - `down_anim` (string or `nil`) – Animation name.  
    - `loop` (boolean or `nil`) – Loop flag.
*   **Returns:** Nothing.

### `SetSelectedAnim(selected_anim, loop)`
*   **Description:** Assigns and plays the selected animation if the button is selected.
*   **Parameters:**  
    - `selected_anim` (string or `nil`) – Animation name.  
    - `loop` (boolean or `nil`) – Loop flag.
*   **Returns:** Nothing.

### `SetLoop(animation_name, loop)`
*   **Description:** Sets or updates the loop flag for a specific animation. If the animation is currently playing, it restarts with the new loop setting.
*   **Parameters:**  
    - `animation_name` (string or `nil`) – Name of the animation.  
    - `loop` (boolean or `nil`) – Whether the animation should loop.
*   **Returns:** Nothing.

### `PushIdleAnim(idle_anim)`
*   **Description:** Replaces the current idle animation in the playback stack without clearing history (uses `AnimState:PushAnimation`). Only effective if the button is in normal, non-down state.
*   **Parameters:**  
    - `idle_anim` (string or `nil`) – Animation name to push.
*   **Returns:** Nothing.

### `SetOnFocus(fn)`
*   **Description:** Registers a callback to be executed when the button gains focus.
*   **Parameters:**  
    - `fn` (function or `nil`) – Callback function.
*   **Returns:** Nothing.

### `SetOnLoseFocus(fn)`
*   **Description:** Registers a callback to be executed when the button loses focus.
*   **Parameters:**  
    - `fn` (function or `nil`) – Callback function.
*   **Returns:** Nothing.

### `OnGainFocus()`
*   **Description:** Overrides base button behavior. Plays the focus animation and invokes `onfocus` if applicable.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnLoseFocus()`
*   **Description:** Overrides base button behavior. Plays the idle animation (if allowed) and invokes `onlosefocus`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnControl(control, down)`
*   **Description:** Handles button press/release events. Triggers down animation on press, returns to focus animation on release, plays click sound, and fires callbacks (`ondown`, `onclick`, `whiledown`).
*   **Parameters:**  
    - `control` (string or enum) – Control identifier.  
    - `down` (boolean) – `true` if control is pressed, `false` on release.
*   **Returns:** `true` if the control was handled, `false` otherwise.

### `OnDisable()`
*   **Description:** Plays the disabled animation when the button becomes disabled.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnSelect()`
*   **Description:** Plays the selected animation when the button becomes selected.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified (overrides base class button event handlers like `OnGainFocus`, `OnLoseFocus`, etc. but does not register external events via `inst:ListenForEvent`).
- **Pushes:** None identified (callback events like `onclick`, `ondown`, etc., are invoked directly as functions, not as `inst:PushEvent` calls).
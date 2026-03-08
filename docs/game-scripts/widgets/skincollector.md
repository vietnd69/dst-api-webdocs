---
id: skincollector
title: SkinCollector
description: A UI widget that manages the Skin Collector character's appearance, speech bubbles, animations, and dialogue logic during the skin trading mini-game.
tags: [ui, npc, animation, dialogue]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 44edb135
system_scope: ui
---

# SkinCollector

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SkinCollector` is a UI widget that provides the visual and interactive interface for the Skin Collector character in Don't Starve Together. It manages animated character models (using `UIAnim`), speech bubble rendering (using `Text` and `UIAnim`), and controlled dialogue flow for trading interactions. The component is typically instantiated during the skin trading mini-game screen and handles entry/exit animations, speech state transitions, and idle speech scheduling.

## Usage example
```lua
local SkinCollector = require "widgets/skincollector"
local mini_game = GetMiniGame() -- hypothetical mini-game reference
local widget = SkinCollector(5, mini_game, STRINGS.UI.TRADESCREEN.SKIN_COLLECTOR_SPEECH.START, false)
widget:Appear()
widget:Say("Hello, traveler!", nil, "Beefalo Wool", "5")
```

## Dependencies & tags
**Components used:** `UIAnim`, `Text`, `Image`, `Widget`, `TEMPLATES.InvisibleButton`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `innkeeper` | `UIAnim` | `nil` | The animated character model for the Skin Collector. |
| `speech_bubble` | `UIAnim` | `nil` | The animated speech bubble container. |
| `text` | `Text` | `nil` | The text widget displaying speech content. |
| `hand` | `Widget` (InvisibleButton) | `nil` | Interactive button area to trigger "Hand" speech. |
| `mini_game` | table / `nil` | `nil` | Reference to the associated mini-game context. |
| `start_text` | string / table | `nil` | Initial speech text to use on appearance. |
| `num_items` | number | `0` | Number of items to display in context (e.g., for START_EMPTY vs START). |
| `intro_done` | boolean | `false` | Whether the appearance animation has completed. |
| `talking` | boolean | `false` | Whether the character is currently speaking. |
| `sleeped` | boolean | `false` | Whether the character is in a sleeping state (pausing updates). |
| `exit_callback` | function | `nil` | Callback to invoke on exit completion. |
| `last_speech_time` | number | `0` | Static time (seconds) of the last speech event. |
| `text_string` | string | `nil` | Current speech text to display. |
| `display_text_time` | number | `0` | Remaining time (seconds) to show the speech text. |
| `sound_started` | boolean | `nil` | Whether the talk loop sound has been started. |

## Main functions
### `Appear()`
* **Description:** Initiates the Skin Collector's entry animation sequence and begins update loop for speech/idle logic.
* **Parameters:** None.
* **Returns:** Nothing.

### `Disappear(callbackfn)`
* **Description:** Starts the exit animation and schedules a callback for after the animation finishes.
* **Parameters:** `callbackfn` (function) — function to call once disappear animation completes.
* **Returns:** Nothing.

### `Snap()`
* **Description:** Plays a quick "snap" animation (e.g., for interaction feedback) and returns to idle state.
* **Parameters:** None.
* **Returns:** Nothing.

### `QuitTalking()`
* **Description:** Immediately ends current speech, closes bubble, and kills associated sound.
* **Parameters:** None.
* **Returns:** Nothing.

### `Say(text, rarity, name, number)`
* **Description:** Triggers a speech sequence: queues animations, displays formatted text, and plays talk loop sound.
* **Parameters:**  
  `text` (string or table) — speech content; if table, a random item is selected.  
  `rarity` (string, optional) — placeholder for `<rarity>` substitution.  
  `name` (string, optional) — placeholder for `<item>` substitution.  
  `number` (string, optional) — placeholder for `<number>` substitution.
* **Returns:** Nothing.
* **Error states:** Asserts `text` is non-nil; raises error with message `"Bad text string for SkinCollector speech"` if missing.

### `ClearSpeech()`
* **Description:** Ends speech cleanly—closes bubble, resets text, and plays post-dialogue animation.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-op if not currently talking (i.e., dialog animations not active).

### `Sleep()`
* **Description:** Pauses all speech and update logic by setting internal sleep flag.
* **Parameters:** None.
* **Returns:** Nothing.

### `Wake()`
* **Description:** Resumes update logic by clearing the sleep flag.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Main update loop for managing speech, idle behavior, and animation state transitions.
* **Parameters:** `dt` (number) — delta time in seconds since last frame.
* **Returns:** Nothing.
* **Error states:** Early returns if `sleeped` is `true` or during exit animations.

## Events & listeners
- **Listens to:** None (does not register events).
- **Pushes:** None (does not fire events).
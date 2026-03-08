---
id: magicskincollector
title: Magicskincollector
description: Manages the UI widget for the Magic Skin Collector NPC, handling visual appearance, speech bubbles, dialogue animations, and idle speech intervals.
tags: [ui, npc, dialogue, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 29cce60f
system_scope: ui
---

# Magicskincollector

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`MagicSkinCollector` is a UI widget component that implements the interactive visual representation of the Magic Skin Collector NPC in the trade screen. It manages character animations (idle, appear, disappear, speech), speech bubble display, text rendering, and automatic idle speech timing. The component extends `Widget` and is responsible for both visual presentation and lifecycle state transitions (e.g., starting up, talking, exiting).

## Usage example
```lua
local collector = CreateWidget("MagicSkinCollector")
collector:Appear() -- Show the collector with appear animation
collector:Say(STRINGS.UI.TRADESCREEN.MAGICSKIN_COLLECTOR_SPEECH.HAND)
collector:QuitTalking() -- Stop current dialogue immediately
collector:Disappear(function() print("Exit complete") end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Does not manage entity tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `root` | Widget | `nil` | Root container widget child of `self`. |
| `innkeeper` | UIAnim | `nil` | Character animation widget for the collector. |
| `speech_bubble` | UIAnim | `nil` | Speech bubble animation widget. |
| `text` | Text | `nil` | Text widget for speech content. |
| `hand` | InvisibleButton | `nil` | Clickable hotspot to trigger speech. |
| `last_speech_time` | number | `0` | Timestamp of the last speech, used for idle speech logic. |
| `intro_done` | boolean | `nil` | Whether the initial "appear" animation has completed. |
| `exit_callback` | function | `nil` | Callback executed after the "disappear" animation completes. |
| `text_string` | string | `nil` | Current speech text to display. |
| `display_text_time` | number | `0` | Remaining time (in seconds) to show current speech. |
| `talking` | boolean | `nil` | Whether the collector is currently in a speech state. |
| `sound_started` | boolean | `nil` | Whether the speech sound loop has started. |

## Main functions
### `Appear()`
* **Description:** Initiates the collector's appearance by playing the "appear" animation and starting the update loop.
* **Parameters:** None.
* **Returns:** Nothing.

### `Disappear(callbackfn)`
* **Description:** Begins the exit sequence by playing the "disappear" animation, stores a callback to be invoked on completion, and stops updates once finished.
* **Parameters:** `callbackfn` (function) — Function to execute after the disappearance animation completes.
* **Returns:** Nothing.

### `Snap()`
* **Description:** Plays the "snap" animation sequence (e.g., for a quick response), then returns to idle.
* **Parameters:** None.
* **Returns:** Nothing.

### `QuitTalking()`
* **Description:** Immediately ends any active speech, clears the text, and stops the speech sound.
* **Parameters:** None.
* **Returns:** Nothing.

### `Say(text, rarity, name, number)`
* **Description:** Triggers a new speech with optional string interpolation for `<rarity>`, `<item>`, and `<number>` placeholders. Plays speech animations and starts the sound loop.
* **Parameters:**
  * `text` (string | table) — Text or list of texts (randomly chosen if table).
  * `rarity` (string?) — Replacement for `<rarity>` placeholder.
  * `name` (string?) — Replacement for `<item>` placeholder.
  * `number` (string?) — Replacement for `<number>` placeholder.
* **Returns:** Nothing.
* **Error states:** Asserts that `text` is provided; raises an error if missing.

### `ClearSpeech()`
* **Description:** Ends current speech cleanly by playing post-dialogue animations, clearing text, and stopping sound. Only has effect if currently talking.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Frame-based update logic handling intro completion, idle speech scheduling, speech text display, and exit flow.
* **Parameters:** `dt` (number) — Delta time in seconds.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** Does not fire custom events; relies on animation states and update logic.
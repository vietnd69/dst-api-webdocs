---
id: kitcoongamescreen
title: Kitcoongamescreen
description: Renders and manages the interactive UI screen for the Kitcoon pet game, including UI layout, input handling, and profile-based state updates.
tags: [ui, pet, game, input]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 62d7af27
system_scope: ui
---

# Kitcoongamescreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`KitcoonGameScreen` is a UI screen component responsible for presenting and managing the Kitcoon pet interaction interface. It initializes and positions child widgets (`KitcoonPuppet`, `KitcoonPouch`, `KitcoonFood`, `KitcoonPoop`) based on profile data, handles controller and keyboard input for game actions (feed, play, hibernate, clear poop), and displays contextual information such as the pet's name and age. It extends `Screen`, integrates with the Redux UI system, and shows an abandonment message popup when needed.

## Usage example
```lua
local KitcoonGameScreen = require "screens/kitcoongamescreen"
local screen = KitcoonGameScreen(profile)
TheFrontEnd:PushScreen(screen)
```

## Dependencies & tags
**Components used:** `Profile` (via `self.profile:GetKit*()` and `Profile:GetKitIsHibernating()`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `profile` | table | `nil` | The profile object containing persistent Kitcoon pet data (name, build, birth time, hibernation state, etc.). |
| `pressed` | table | `{}` | Internal tracking table for input state (not actively used beyond initialization). |
| `fixed_root` | Widget | `nil` | Root container widget for fixed-position UI elements. |
| `bg_anim` | UIAnim | `nil` | Background animation widget using the `kitcoon_bg` bank and build. |
| `pouch` | KitcoonPouch | `nil` | Widget representing the Kitcoon's sleeping pouch (controls hibernation/wake actions). |
| `kit_puppet` | KitcoonPuppet | `nil` | Visual representation and logic controller for the Kitcoon pet. |
| `food` | KitcoonFood | `nil` | Widget for feeding the Kitcoon. |
| `poops` | table | `{}` | Array of `KitcoonPoop` widgets (0–N) representing cleaned mess on the ground. |
| `age_txt` | Text | `nil` | Text widget displaying the pet’s name and age (or hibernation status). |
| `exit_button` | Widget (optional) | `nil` | Back button (only created if no controller is attached). |
| `letterbox` | Widget | `nil` | Foreground letterbox container. |

## Main functions
### `SetUpUI()`
* **Description:** Initializes and arranges all UI child widgets (background, pouch, puppet, food, poops, age text, exit button), sets animation states, and schedules the abandonment message popup if required.
* **Parameters:** None.
* **Returns:** Nothing.

### `RemovePoop(poop)`
* **Description:** Removes a given `KitcoonPoop` widget from the internal `poops` array.
* **Parameters:** `poop` (KitcoonPoop) — the poop widget to remove.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Called on every frame while the screen is active; delegates to the parent `Screen` implementation and updates the interface (e.g., age text).
* **Parameters:** `dt` (number) — delta time in seconds.
* **Returns:** Nothing.

### `UpdateInterface()`
* **Description:** Dynamically updates the `age_txt` widget based on pet profile state: displays hibernation status, or calculates and shows the pet’s name and age in days since birth. If the pet build string is empty (`""`), the text is hidden.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Returns early if `self.inst:IsValid()` is `false`.

### `Quit()`
* **Description:** Initiates screen exit by fading out the front-end and calling `LeaveGameScreen()` on the `kit_puppet`.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnBecomeActive()`
* **Description:** Hook invoked when the screen becomes active (e.g., top of stack). Delegates to parent class.
* **Parameters:** None.
* **Returns:** Nothing.

### `IsKitActive()`
* **Description:** Stub method; implementation is empty and not used.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles player input for all interactive actions based on controller or keyboard.
  - `CONTROL_CANCEL`: Exits the screen (via `Quit()`).
  - `CONTROL_ACCEPT` (when awake): Triggers play interaction (`kit_puppet:onclick()`).
  - `CONTROL_MENU_MISC_2` (when awake, not sleeping): Triggers feeding (`food:onclick()`).
  - `CONTROL_MENU_R2` (always): Toggles hibernation (via `pouch:onclick()`).
  - `CONTROL_MENU_MISC_1` (when poops exist): Clears a random poop (`poops[i]:onclick()`).
* **Parameters:** `control` (number/string) — the input control identifier; `down` (boolean) — `true` on key/button press, `false` on release.
* **Returns:** `true` if the input was handled, `false` otherwise.

### `GetHelpText()`
* **Description:** Generates localized help strings summarizing available actions for the current UI state (e.g., pickup name tag if pet not built, feed/play/hibernate if awake, clear poop if present, and back button).
* **Parameters:** None.
* **Returns:** `string` — concatenated, localized control hints separated by `"  "`.

## Events & listeners
None identified.
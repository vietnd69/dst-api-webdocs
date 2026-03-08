---
id: pethungerbadge
title: Pethungerbadge
description: A UI badge widget that displays an animated hunger indicator for a pet, extending the base badge with arrow animation support.
tags: [ui, pet, hunger, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: a13e09f3
system_scope: ui
---

# Pethungerbadge

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`PetHungerBadge` is a UI widget that extends `Badge` to display a pet's hunger status visually. It introduces dynamic arrow animation (e.g., spinning or pulsing) to indicate changing hunger levels. The component manages an optional child `UIAnim` instance for the arrow animation, which is controlled via a user-provided animation function (`arrowanimfn`). It automatically starts/stops updates based on visibility and ensures animations are synchronized with game state.

## Usage example
```lua
local badge = PetHungerBadge(owner, "white", "pet_hunger_icon")
badge:SetArrowAnimFn(function() return "spin" end)
badge:Show()
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `arrowanimfn` | function\|nil | `nil` | A callback returning the current animation name string (e.g., `"spin"`, `"neutral"`), or `nil` to stop animation. |
| `arrowdir` | string\|nil | `nil` | Tracks the currently playing animation direction/name. |
| `hungerarrow` | UIAnim\|nil | `nil` | The child UIAnim widget used to render the animated hunger indicator. |
| `_base` | Badge | inherited | Base class reference to `Badge` methods. |

## Main functions
### `SetArrowAnimFn(fn)`
* **Description:** Sets the animation function that determines the current arrow animation state. If `fn` is non-`nil`, initializes and starts the `hungerarrow` animation; otherwise, stops updating and cleans up the arrow.
* **Parameters:** `fn` (function\|nil) — A function returning a string animation name (e.g., `"spin"`, `"neutral"`) or `nil` to pause animation.
* **Returns:** Nothing.

### `OnShow(was_hidden)`
* **Description:** Overrides `Badge.OnShow`. Starts the animation update loop if `hungerarrow` exists.
* **Parameters:** `was_hidden` (boolean) — Whether the badge was previously hidden.
* **Returns:** Nothing.

### `OnHide(was_visible)`
* **Description:** Overrides `Badge.OnHide`. Stops the animation update loop to conserve resources when hidden.
* **Parameters:** `was_visible` (boolean) — Whether the badge was previously visible.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Periodically called when updates are active. Queries `arrowanimfn()` to fetch the current animation name and updates `hungerarrow` accordingly, unless the game is paused on the server.
* **Parameters:** `dt` (number) — Delta time since last update.
* **Returns:** Nothing.
* **Error states:** Immediately returns if `TheNet:IsServerPaused()` is `true`.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.
---
id: hideandseeker
title: Hideandseeker
description: Periodically validates a player's proximity to a Hide-and-Seek game and handles announcements when they go too far or return within range.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: f313dc93
---

# Hideandseeker

## Overview
The `hideandseeker` component monitors an entity's distance from an active Hide-and-Seek game instance. It uses a periodic task to check proximity thresholds and triggers speech announcements (e.g., if the entity strays too far or returns within range), or removes itself if the game is no longer valid.

## Dependencies & Tags
- **Component usage**: `inst:RemoveComponent("hideandseeker")` — may be removed dynamically during validation.
- **Dependencies**:
  - `talker` component: Required to trigger speech announcements via `Say()`.
  - `hideandseekgame` component (on the game entity): Provides configuration values such as `hiding_range`, `hiding_range_toofar`, `seeker_too_far_announce`, `seeker_too_far_return_announce`, and `gameaborted_announce`.
- **No tags are added or removed** by this component.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GEntity` | — | Reference to the entity the component is attached to. |
| `hideandseekgame` | `Component?` | `nil` | Reference to the `hideandseekgame` component of the active game. Set via `SetGame()`. |
| `abort_game_msg` | `string?` | `nil` | Localization key for the announcement when the game is aborted (set when `SetGame()` is called). |
| `is_faraway` | `boolean` | `false` | Tracks whether the entity is currently too far from the game to participate. |
| `validate_task` | `Task?` | `nil` | Periodic task (runs every 1 second) that calls the `Validate()` function. |

## Main Functions

### `SetGame(hideandseekgame)`
* **Description:** Assigns the active Hide-and-Seek game instance and preloads the abort-message localization key. Resets `abort_game_msg` based on the game’s configuration.
* **Parameters:**
  - `hideandseekgame` (`Component?`): The `hideandseekgame` component of the game entity. If `nil`, `abort_game_msg` becomes `nil`.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string showing the current game reference and `is_faraway` state.
* **Parameters:** None.

### `OnRemoveFromEntity()`
* **Description:** Cleans up by canceling the `validate_task` to prevent memory leaks or orphaned tasks when the component is removed.
* **Parameters:** None.

## Events & Listeners
None. This component does **not** use event listeners (`inst:ListenForEvent`) or explicitly push events (`inst:PushEvent`). All logic is driven by the periodic task.
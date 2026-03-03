---
id: hideandseeker
title: Hideandseeker
description: Monitors a seeker entity’s distance from a hide-and-seek game instance and triggers announcements or removal when the entity strays too far or returns within range.
tags: [game, game_logic, communication]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f313dc93
system_scope: world
---

# Hideandseeker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Hideandseeker` is a lightweight entity component that ensures a seeker entity remains within a designated range of the active `hideandseekgame` instance. It periodically validates the seeker’s position using `Validate`, which compares the seeker’s proximity to the game’s `hiding_range` and `hiding_range_toofar` thresholds. If the game is no longer active, it announces a message (via `talker`) and removes itself. If the seeker is too far away, it sets `is_faraway` to `true` and announces the condition; if returning within range, it clears the flag and announces re-entry.

This component is designed to work exclusively with the `hideandseekgame` component and relies on the `talker` component for localized speech.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("hideandseeker")
local game = inst.entity:GetParent()  -- or however the game instance is obtained
inst.components.hideandseeker:SetGame(game)
-- Validation runs automatically via periodic task; no further setup required
```

## Dependencies & tags
**Components used:** `hideandseekgame`, `talker`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity owning this component (inherited from constructor). |
| `validate_task` | `Task` | `nil` | Periodic task (every 1 second) that runs `Validate`; set in constructor. |
| `hideandseekgame` | `Component` (optional) | `nil` | Reference to the `hideandseekgame` component instance; set via `SetGame()`. |
| `abort_game_msg` | `string` (key) | `nil` | Localized string key for the abort announcement; derived from `hideandseekgame.gameaborted_announce`. |
| `is_faraway` | `boolean` | `false` | Flag indicating whether the entity is currently outside the `hiding_range_toofar` threshold. |

## Main functions
### `SetGame(hideandseekgame)`
*   **Description:** Attaches the component to a specific `hideandseekgame` instance and configures the abort message key.
*   **Parameters:** `hideandseekgame` (`Component` or `nil`) — the game component to track; if `nil`, `abort_game_msg` is set to `nil`.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a debug-friendly string summarizing the current state: the `hideandseekgame` reference (as string) and `is_faraway` status.
*   **Parameters:** None.
*   **Returns:** `string` — e.g., `"[Component hideandseekgame] @ 0x123456, is far away: false"`.

## Events & listeners
- **Listens to:** Periodic task (`DoPeriodicTask(1, Validate)`) — calls `Validate` every 1 second.
- **Pushes:** No events; relies on side effects (`talker:Say`, `inst:RemoveComponent`).

---
id: SGcarnivalgame_shooting_target
title: Sgcarnivalgame Shooting Target
description: Manages the animated behavior and state transitions of a carnival shooting target in response to game events such as round start, hit detection, and power state changes.
tags: [carnival, animation, event, gameobject]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 021a4525
system_scope: entity
---

# Sgcarnivalgame Shooting Target

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This stategraph controls the visual and audio behavior of carnival shooting targets used in minigames (e.g., summer event shooting galleries). It defines state transitions triggered by specific game events (`carnivalgame_turnon`, `carnivalgame_target_startround`, `carnivalgame_shooting_target_hit`, `carnivalgame_endofround`, `carnivalgame_turnoff`), and handles animation playback and sound effects for different target types (friendly vs enemy) and phases (idle, activation, hit, post-activation). The stategraph does not manage game logic directly but responds to external events to drive the entity's presentation.

## Usage example
```lua
-- This stategraph is automatically assigned to entities via the target prefab (e.g., "carnival_shooting_target_good" or "_bad").
-- The entity is expected to have an AnimState and SoundEmitter component.
-- State transitions are triggered by events pushed elsewhere in the game (e.g., carnival minigame manager).
```

## Dependencies & tags
**Components used:** None identified (relies on `AnimState` and `SoundEmitter` being present on the entity — these are standard components not explicitly referenced in the source code).
**Tags:** The following state tags are defined: `on` (for active states: `idle_on`, `friendly_activate`, `friendly_activate_hit`, `friendly_activate_pst`, `enemy_activate`, `enemy_activate_hit_pst`, `enemy_activate_pst`) and `off` (for inactive states: `idle_off`, `turn_on`, `turn_off`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_shouldturnoff` | boolean | `nil` (nil until set by external code) | A private flag indicating whether the target should transition to `turn_off` instead of `idle_on` when the round ends or activation completes. |

## Main functions
Not applicable (this is a stategraph definition, not a component with public methods. Behavior is driven by state entries and event handlers.)

## Events & listeners
- **Listens to:**
  - `carnivalgame_turnon` → transitions to `turn_on`
  - `carnivalgame_target_startround` → activates based on `data.isactivated` and `data.isfriendlytarget`
  - `carnivalgame_endofround` → transitions to post-activation state if active
  - `carnivalgame_shooting_target_hit` → transitions to hit state if active
  - `carnivalgame_turnoff` → transitions to `turn_off` or post-activation state depending on active status

- **Pushes:** None (this stategraph only listens for events; it does not fire custom events.)

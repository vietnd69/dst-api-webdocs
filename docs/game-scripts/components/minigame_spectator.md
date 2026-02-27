---
id: minigame_spectator
title: Minigame Spectator
description: Attaches to an entity to watch a minigame and automatically removes itself when the minigame ends.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: b0d4298d
---

# Minigame Spectator

## Overview
This component enables an entity (typically a spectator, such as a non-player or observer) to register interest in a specific minigame. It manages cleanup logic by removing itself from the entity when the watched minigame ends or is deactivated, and prevents the entity from attacking players while the minigame is active.

## Dependencies & Tags
- Requires `inst.components.combat` (if present) to drop combat targets.
- No tags are added or removed.
- Listens to events on the watched minigame object: `"onremove"` and `"ms_minigamedeactivated"`.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(passed in constructor)* | Reference to the entity the component is attached to. |
| `minigame` | `Entity?` | `nil` | Reference to the minigame entity currently being watched; `nil` if none. |
| `onminigameover` | `function` | *(lambda defined in `_ctor`)* | Callback function that removes the component from `inst` when invoked. |

## Main Functions

### `MinigameSpectator:OnRemoveFromEntity()`
* **Description:** Cleans up event listeners attached to the minigame before the component is fully removed from the entity.
* **Parameters:** None.

### `MinigameSpectator:SetWatchingMinigame(minigame)`
* **Description:** Sets the given `minigame` as the active minigame to watch. Registers event listeners for minigame termination and drops the entity's combat target if it is a player.
* **Parameters:**
  - `minigame` *(Entity)*: The minigame entity to watch. Must be valid and not already set (the method is idempotent only if `minigame` is `nil`).

### `MinigameSpectator:GetMinigame()`
* **Description:** Returns the currently watched minigame entity, or `nil` if none.
* **Parameters:** None.

### `MinigameSpectator:GetDebugString()`
* **Description:** Returns a human-readable debug string indicating whether a minigame is being watched.
* **Parameters:** None.

## Events & Listeners
- Listens for:
  - `"onremove"` on the minigame entity → triggers `onminigameover`.
  - `"ms_minigamedeactivated"` on the minigame entity → triggers `onminigameover`.
- Triggers:
  - None (does not push events).
---
id: minigame_participator
title: Minigame Participator
description: Attaches an entity to a minigame session and manages cleanup or behavior changes upon minigame activation and termination.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: d6a0e3ab
---

# Minigame Participator

## Overview
This component enables an entity (typically a player) to participate in a minigame by tracking the active minigame instance, managing automatic removal upon minigame completion or deactivation, and enforcing associated side effects such as follower stoppage and target revalidation.

## Dependencies & Tags
- Adds the `"minigame_participator"` tag to the entity on initialization.
- Removes the `"minigame_participator"` tag on component removal.
- Depends on the following components (used but not added by this script):  
  - `leader` (optional): Used to disband followers during minigame start.
  - `follower` (optional): Checked to prevent following during minigame (unless `keepleaderduringminigame` is true).
  - `combat` (optional): Target revalidation triggered on minigame end.
- Uses `GetTime()` and `DoPeriodicTask()` for timeout logic.
- Relies on external `"onremove"` and `"ms_minigamedeactivated"` events from the minigame instance.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the owner entity, set during construction. |
| `minigame` | `Entity?` | `nil` | Reference to the current minigame entity being participated in; `nil` when inactive. |
| `updatecheck` | `Task?` | `nil` | Periodic task used to poll expiration time if `notimeout` is false. Canceled on removal. |
| `expireytime` | `number?` | — | Timestamp (from `GetTime()`) when the participant should be removed if no active minigame activity occurs. |
| `onminigameover` | `function` | — | Callback executed when the minigame ends or is deactivated; removes this component and clears `minigame`. |

## Main Functions

### `SetMinigame(minigame)`
* **Description:** Assigns a minigame instance to the participant, sets up event listeners and expiration logic, and disbands followers unless they are configured to stay during the minigame.
* **Parameters:**  
  - `minigame`: `Entity` — The minigame entity to join.

### `GetMinigame()`
* **Description:** Returns the currently assigned minigame entity, or `nil` if not participating.
* **Parameters:** None.

### `CurrentMinigameType()`
* **Description:** Returns the `gametype` string from the minigame’s `minigame` component, or `nil` if no minigame is active.
* **Parameters:** None.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string indicating the current minigame being played (uses `tostring` on the minigame entity).
* **Parameters:** None.

### `OnRemoveFromEntity()`
* **Description:** Cleans up when the component is removed from its entity: removes the tag, cancels pending tasks, unsubscribes from minigame events, and resets leader-follow behavior.
* **Parameters:** None.

## Events & Listeners
- Listens for:
  - `"onremove"` event on the assigned minigame entity (triggers `onminigameover`).
  - `"ms_minigamedeactivated"` event on the assigned minigame entity (triggers `onminigameover`).
- Triggers:
  - Self-removal via `self.inst:RemoveComponent("minigame_participator")` inside `onminigameover`.
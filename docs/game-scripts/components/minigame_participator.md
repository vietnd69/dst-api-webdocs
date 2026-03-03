---
id: minigame_participator
title: Minigame Participator
description: Tracks and manages an entity’s participation in a minigame, including automatic cleanup, follower disengagement, and timeout handling.
tags: [minigame, entity, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: d6a0e3ab
system_scope: entity
---

# Minigame Participator

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MinigameParticipator` enables an entity to participate in a minigame by tracking the active minigame instance and managing side effects such as follower disengagement and automatic expiration. It attaches the `minigame_participator` tag to the entity and automatically removes itself when the minigame ends (via `onremove` or `ms_minigamedeactivated`) or when a timeout expires. It also interacts with the `leader` and `follower` components to pause following behavior during minigame participation.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("minigame_participator")

-- Assign the entity to a minigame (e.g., after a minigame starts)
inst.components.minigame_participator:SetMinigame(minigame_entity)

-- Query the current minigame type
local type = inst.components.minigame_participator:CurrentMinigameType()
```

## Dependencies & tags
**Components used:** `combat`, `follower`, `leader`, `minigame`  
**Tags:** Adds `minigame_participator`; removes on entity removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `minigame` | Entity or `nil` | `nil` | Reference to the minigame entity the participant is engaged in. |
| `updatecheck` | `PerodicTask` or `nil` | `nil` | Timer task used to check for timeout expiry (only if `notimeout` is false). |
| `expireytime` | number or `nil` | `nil` | Timestamp after which participation expires (set via `GetTime() + 3` by default). |
| `notimeout` | any truthy/falsy value | `nil` | Optional flag (commented out in constructor); if truthy, disables automatic timeout. |
| `onminigameover` | function | `function() ... end` | Callback triggered when the minigame ends — removes the component and clears `minigame`. |

## Main functions
### `GetMinigame()`
* **Description:** Returns the currently assigned minigame entity.
* **Parameters:** None.
* **Returns:** Entity or `nil`.

### `SetMinigame(minigame)`
* **Description:** Assigns the entity to the given minigame. Sets up event listeners, timer, and auto-removal on minigame end. Automatically stops followers from following (unless they have `keepleaderduringminigame`). Also resets `keeptargettimeout` for all followers to force target revalidation.
* **Parameters:** `minigame` (Entity) — the minigame entity to join.
* **Returns:** Nothing.
* **Error states:** No-op if `minigame` is already set (`self.minigame ~= nil`). Timeout task only starts if `notimeout` is falsy.

### `CurrentMinigameType()`
* **Description:** Returns the type of the current minigame, as defined by its `minigame.gametype` property.
* **Parameters:** None.
* **Returns:** String or `nil` (if no minigame, or minigame component is missing/invalid).

### `GetDebugString()`
* **Description:** Returns a human-readable debug string for display in logs or overlays.
* **Parameters:** None.
* **Returns:** `"Playing: <minigame>"`, where `<minigame>` is `tostring(self.minigame)`.

### `OnRemoveFromEntity()`
* **Description:** Cleanup routine called when the component is removed from its entity. Cancels timer, removes event listeners, and notifies followers’ combat components to reset target timeouts.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` (on minigame), `ms_minigamedeactivated` (on minigame) — both trigger `onminigameover`.
- **Pushes:** None (this component does not fire custom events).

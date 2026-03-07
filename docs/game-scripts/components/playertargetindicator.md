---
id: playertargetindicator
title: Playertargetindicator
description: Tracks players who should display target indicators on screen and manages their visibility based on frustum culling and tracking eligibility.
tags: [ui, camera, player, frustum]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 4aba6f5f
system_scope: ui
---
# Playertargetindicator

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`PlayerTargetIndicator` is a client-side component that manages the visibility of target indicators for other players. It monitors which players are currently within the camera frustum, ensures they meet tracking criteria (via `hudindicatable`), and updates the HUD accordingly by adding or removing target indicators. The component relies on the `hudindicatable` and `hudindicatablemanager` components to determine tracking eligibility and discovery of eligible targets.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("playertargetindicator")
-- The component automatically registers for events and starts tracking when the entity is updated
-- Typically added to player prefabs to manage their view of other players' target indicators
```

## Dependencies & tags
**Components used:**  
- `hudindicatable` (via `target.components.hudindicatable:ShouldTrack()`)  
- `hudindicatablemanager` (via `TheWorld.components.hudindicatablemanager.items`)  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `offScreenPlayers` | table (array) | `{}` | List of players currently off-screen but whose indicators are visible (tracked for removal when they return on screen or become untrackable). |
| `onScreenPlayersLastTick` | table (array) | `{}` | List of players who were within camera frustum in the previous update frame. |

## Main functions
### `ShouldShowIndicator(target)`
*   **Description:** Determines whether the target player should have a target indicator added to the HUD. Returns `true` only if the target is eligible for tracking *and* was on-screen in the previous frame (indicating it just moved off-screen).
*   **Parameters:** `target` (Entity) — the potential target player entity.
*   **Returns:** `boolean` — `true` if the indicator should be shown, otherwise `false`.
*   **Error states:** Assumes `target.components.hudindicatable` exists; may fail if called on an entity without this component.

### `ShouldRemoveIndicator(target)`
*   **Description:** Determines whether an existing target indicator should be removed. Returns `true` if the target no longer qualifies for tracking.
*   **Parameters:** `target` (Entity) — the target player entity currently shown.
*   **Returns:** `boolean` — `true` if the indicator should be removed, otherwise `false`.

### `OnUpdate()`
*   **Description:** The main update loop. Checks tracked off-screen players for removal conditions, identifies newly eligible targets via the world’s `hudindicatablemanager`, and updates HUD indicators. Also refreshes `onScreenPlayersLastTick` for next-frame comparison.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Relies on `TheWorld.components.hudindicatablemanager` being present; silently skips updates if missing.

### `OnRemoveFromEntity()`
*   **Description:** Cleanup function called when the component is removed. Removes all currently tracked target indicators and deregisters event callbacks.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `unregister_hudindicatable` — triggers `OnPlayerExited` to remove target indicators when a player leaves the world or is unregistered.  
- **Pushes:** None.

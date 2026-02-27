---
id: playertargetindicator
title: Playertargetindicator
description: Tracks off-screen players with HUD-indicatable components and manages target indicators for the local player's HUD.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: ui
source_hash: 4aba6f5f
---

# Playertargetindicator

## Overview
This component is responsible for managing the visibility of target indicators (e.g., health bars, icons) on the local player's HUD for other players who are currently off-screen but still within the indicator range. It detects when players enter/exit the screen using frustum checks and HUD-indicatable state, updating the HUD accordingly.

## Dependencies & Tags
- Requires the `hudindicatable` component on tracked targets (via `target.components.hudindicatable`).
- Relies on `TheWorld.components.hudindicatablemanager` to maintain a list of indicatable entities.
- Attaches to an entity (typically the player) and starts automatic updates via `inst:StartUpdatingComponent(self)`.
- Registers for the `"unregister_hudindicatable"` event from `TheWorld`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity the component is attached to (the local player). |
| `offScreenPlayers` | `table` | `{}` | List of players currently tracked off-screen and whose target indicators are active on the HUD. |
| `onScreenPlayersLastTick` | `table` | `{}` | List of players that were on-screen (passed frustum check) during the last update cycle. |
| `onplayerexited` | `function` | `OnPlayerExited(self, player)` | Event handler callback invoked when `"unregister_hudindicatable"` is fired. |

*Note:* No `_ctor` is explicitly defined; initialization occurs inline in the `Class()` function. Properties marked above are initialized during construction.

## Main Functions
### `OnRemoveFromEntity()`
* **Description:** Cleans up when the component is removed. Removes all active target indicators from the HUD, unregisters the event listener, and clears internal state.
* **Parameters:** None (method on the component instance).

### `ShouldShowIndicator(target)`
* **Description:** Determines whether a target player should have a HUD indicator shown (i.e., is off-screen, tracked, and indicatable).
* **Parameters:**  
  `target` (`Entity`): The potential target player entity.

### `ShouldRemoveIndicator(target)`
* **Description:** Determines whether a target player’s indicator should be removed (i.e., no longer tracked or indicatable).
* **Parameters:**  
  `target` (`Entity`): The player entity to check.

### `OnUpdate()`
* **Description:** Main update loop (called each tick). Syncs active indicators: removes indicators for players who are no longer indicatable, adds indicators for newly off-screen indicatable players, and updates tracking lists.
* **Parameters:** None.

## Events & Listeners
- Listens for `"unregister_hudindicatable"` on `TheWorld`, calling `OnPlayerExited`.
- Removes listener during cleanup in `OnRemoveFromEntity()`.
- Uses `TheWorld.components.hudindicatablemanager.items` to iterate over all indicatable entities.

*Note:* No events are explicitly pushed/triggers by this component — it only consumes events and updates the HUD via `inst.HUD:AddTargetIndicator()` / `inst.HUD:RemoveTargetIndicator()`.
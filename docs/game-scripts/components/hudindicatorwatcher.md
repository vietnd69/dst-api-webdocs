---
id: hudindicatorwatcher
title: Hudindicatorwatcher
description: Manages the display and removal of player-specific HUD target indicators based on visibility and tracking conditions.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: ui
source_hash: e1db281b
---

# Hudindicatorwatcher

## Overview
This component manages HUD target indicators for entities tracked by the player (e.g., allies or notable actors). It monitors visibility changes (via `playerexited` and `unregister_hudindicatable` events) and updates the HUD accordingly—adding indicators when an entity enters view and is marked as trackable, and removing them when the entity exits view or is no longer trackable.

## Dependencies & Tags
- **Component Dependencies**:  
  - Requires `inst.HUD` (HUD component) to be present on the entity.  
  - Relies on `target.components.hudindicatable:ShouldTrack(self.inst)` for per-target tracking logic.  
  - Requires `TheWorld.components.hudindicatablemanager` to provide the list of potential indicators (`items`).  
- **Tags**: None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `offScreenItems` | `table` | `{}` | List of entities currently displayed as target indicators on the HUD. |
| `onScreenItemsLastTick` | `table` | `{}` | Reserved for potential use (currently commented out in `OnUpdate()`). |
| `onitemexited` | `function` | `nil` (set in constructor) | Event callback handler for `playerexited` and `unregister_hudindicatable` events. |

## Main Functions

### `HudIndicatorWatcher:ShouldShowIndicator(target)`
* **Description:** Determines whether the HUD should display a target indicator for the given entity.  
* **Parameters:**  
  - `target`: Entity to evaluate. Must have a `hudindicatable` component.  
* **Logic:** Checks if the target’s `hudindicatable` component indicates it should be tracked by the entity (`self.inst`).

### `HudIndicatorWatcher:ShouldRemoveIndicator(target)`
* **Description:** Determines whether a target indicator should be removed from the HUD.  
* **Parameters:**  
  - `target`: Entity to evaluate. Must have a `hudindicatable` component.  
* **Logic:** Returns `true` if the target’s `hudindicatable` component indicates it should *not* be tracked by the entity.

### `HudIndicatorWatcher:OnUpdate()`
* **Description:** Periodically updates the HUD indicators based on entity visibility and tracking state.  
* **Parameters:** None.  
* **Logic:**  
  - Removes indicators for entities no longer trackable or already processed.  
  - Adds indicators for new entities that are trackable and not already in `offScreenItems`.  
  - Uses `TheWorld.components.hudindicatablemanager.items` as the source of potential targets.

### `HudIndicatorWatcher:OnRemoveFromEntity()`
* **Description:** Cleans up state when the component is removed.  
* **Parameters:** None.  
* **Logic:**  
  - Unregisters event listeners (`playerexited`, `unregister_hudindicatable`).  
  - Removes all indicators from the HUD for entities in `offScreenItems`.  
  - Nullifies `offScreenItems` to prevent stale references.

## Events & Listeners
- **Listens For:**  
  - `"playerexited"` (from `TheWorld`) → triggers `OnItemExited`.  
  - `"unregister_hudindicatable"` (from `TheWorld`) → triggers `OnItemExited`.  
- **No events are explicitly pushed** by this component.
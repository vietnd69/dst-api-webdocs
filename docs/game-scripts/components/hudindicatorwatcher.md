---
id: hudindicatorwatcher
title: Hudindicatorwatcher
description: Manages on-screen HUD target indicators for nearby entities tracked via the hudindicatable system.
tags: [ui, hud, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: e1db281b
system_scope: ui
---

# Hudindicatorwatcher

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Hudindicatorwatcher` is a client-side component that monitors tracked entities (via `hudindicatable`) and updates their on-screen target indicators for the owning entity (typically a player). It listens for world-level events (`playerexited`, `unregister_hudindicatable`) to remove outdated indicators and maintains an internal list (`offScreenItems`) of tracked entities currently outside the viewer's frustum. The component integrates with `hudindicatable` and `hudindicatablemanager` to ensure only relevant, visible indicators are shown.

## Usage example
```lua
local inst = ThePlayer
inst:AddComponent("hudindicatorwatcher")
-- The component automatically starts monitoring and updating indicators via OnUpdate()
-- No further manual setup required — it hooks into the HUD system internally.
```

## Dependencies & tags
**Components used:** `hudindicatable`, `hudindicatablemanager`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `offScreenItems` | table | `{}` | List of entities whose indicators are currently shown but off-screen. |
| `onScreenItemsLastTick` | table | `{}` | Previously tracked on-screen items (commented out in current usage). |

## Main functions
### `ShouldShowIndicator(target)`
*   **Description:** Determines whether the target entity should be shown with a target indicator for the viewer (owner of this component). Checks if the target is tracked and (previously) whether it was on-screen last tick (currently unused due to commented logic).
*   **Parameters:** `target` (entity) - the entity to check.
*   **Returns:** `boolean` — `true` if the indicator should be shown, `false` otherwise.
*   **Error states:** If `target` lacks the `hudindicatable` component, an error will occur.

### `ShouldRemoveIndicator(target)`
*   **Description:** Determines whether the target's indicator should be removed (i.e., it is no longer tracked).
*   **Parameters:** `target` (entity) — the entity to check.
*   **Returns:** `boolean` — `true` if the indicator should be removed, `false` otherwise.

### `OnUpdate()`
*   **Description:** Called each frame (via `StartUpdatingComponent`). Synchronizes the list of off-screen indicators with the current state: removes indicators for untracked entities and adds indicators for newly tracked entities currently off-screen.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnRemoveFromEntity()`
*   **Description:** Cleans up component resources on removal: deregisters event callbacks, removes all active indicators from the HUD, and clears internal state.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnItemExited(self, item)`
*   **Description:** Private callback function triggered when an entity exits the world or unregisters itself from HUD tracking. Removes the item from `offScreenItems` and the HUD indicator if present.
*   **Parameters:** `self` (HudIndicatorWatcher), `item` (entity) — the exiting entity.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `playerexited` — handled via `OnItemExited`; triggered when an entity leaves the world.
- **Listens to:** `unregister_hudindicatable` — handled via `OnItemExited`; triggered when an entity explicitly unregisters its HUD indicator.
- **Pushes:** None.

---
id: hudindicatable
title: Hudindicatable
description: Enables an entity to register or unregister itself with the HUD indicator system for visibility tracking.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: ui
source_hash: e1d225d5
---

# Hudindicatable

## Overview
This component allows an entity to register or unregister itself with the `hudindicatablemanager` world component, enabling or disabling its display on the Heads-Up Display (HUD). It supports dynamic tracking control via a customizable predicate function.

## Dependencies & Tags
- Requires `TheWorld.components.hudindicatablemanager` to be present for registration/unregistration to occur.
- No standard component dependencies are explicitly added.
- No tags are assigned or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (injected by `Class`) | Reference to the entity the component is attached to. |
| `shouldtrackfn` | `function` | `function() return true end` | Predicate function used to determine if the entity should be tracked for HUD display; receives `(self.inst, viewer)` as arguments. |

## Main Functions
### `SetShouldTrackFunction(fn)`
* **Description:** Sets or updates the predicate function used to determine whether the entity should be tracked (i.e., visible) on the HUD for a given viewer.
* **Parameters:**  
  `fn` (function): A callable taking two arguments: the entity instance and the viewer (typically a player). Should return `true` to track, `false` otherwise.

### `ShouldTrack(viewer)`
* **Description:** Evaluates the current tracking predicate to determine if this entity should be visible on the HUD for the specified viewer.
* **Parameters:**  
  `viewer` (Entity): The entity (usually a player) whose HUD visibility is being checked.

### `UnRegisterWithWorldComponent()`
* **Description:** Removes the entity from the `hudindicatablemanager` and broadcasts an `"unregister_hudindicatable"` event if the manager exists.
* **Parameters:** None.

### `RegisterWithWorldComponent()`
* **Description:** Registers the entity with the `hudindicatablemanager`, making it eligible for HUD rendering if tracked.
* **Parameters:** None.

### `OnRemoveFromEntity()`
* **Description:** Cleanup hook triggered when the component is removed from the entity; ensures the entity is unregistered from the manager.
* **Parameters:** None.

## Events & Listeners
- **Listens to:**
  - `"onremove"` → triggers `UnRegisterWithWorldComponent`
- **Triggers:**
  - `"unregister_hudindicatable"` (via `TheWorld:PushEvent(...)`) when unregistered from the manager.
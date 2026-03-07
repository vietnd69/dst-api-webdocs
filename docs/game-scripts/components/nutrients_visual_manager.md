---
id: nutrients_visual_manager
title: Nutrients Visual Manager
description: Manages visibility and rendering state of nutrient-related visual effects based on the player's nutrient vision toggle.
tags: [visual, effect, world, networking]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 73eb3df7
system_scope: world
---

# Nutrients Visual Manager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Nutrients_Visual_Manager` is a client-only component responsible for controlling the visual state of nutrient-related overlay effects (e.g., glowing mushrooms or fungi visible under nutrient vision). It dynamically adjusts an entity's animation color, layer, and sort order in response to the `nutrientsvision` event—typically triggered when the player activates or deactivates nutrient vision. This component does not run on dedicated servers.

## Usage example
```lua
-- Typically added automatically to the world entity on clients
-- e.g., via world prefabs or scenario startup logic:
inst:AddComponent("nutrients_visual_manager")

-- Visual entities (e.g., nutrients) register/unregister themselves:
inst.components.nutrients_visual_manager:RegisterNutrientsVisual(visual_entity)
inst.components.nutrients_visual_manager:UnregisterNutrientsVisual(visual_entity)

-- The system responds to the 'nutrientsvision' event to toggle visuals.
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `UpdateVisualAnimState(visual)`
* **Description:** Updates the rendering state (`AnimState`) of a registered visual entity to reflect whether nutrient vision is enabled. Applies distinct color and layer settings based on `nutrients_vision` state.
* **Parameters:** `visual` (entity or table) – an entity with an `AnimState` component that represents a nutrient visual to update.
* **Returns:** Nothing.
* **Error states:** No explicit error handling—expects `visual.AnimState` to be valid.

### `RegisterNutrientsVisual(visual)`
* **Description:** Registers a visual entity to be managed by this component. Registered visuals will have their `AnimState` updated when the nutrient vision toggle changes.
* **Parameters:** `visual` (entity or table) – the visual entity to track.
* **Returns:** Nothing.

### `UnregisterNutrientsVisual(visual)`
* **Description:** Removes a visual entity from management. It will no longer be updated when nutrient vision toggles.
* **Parameters:** `visual` (entity or table) – the visual entity to stop tracking.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `nutrientsvision` – event fired to toggle nutrient vision (e.g., via hotkey). Carries `data.enabled` (boolean) indicating current vision state.
- **Pushes:** None

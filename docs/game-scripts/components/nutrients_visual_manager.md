---
id: nutrients_visual_manager
title: Nutrients Visual Manager
description: Manages the visual rendering and toggling of nutrient entities (e.g., fungal growths) in Don't Starve Together based on the player's nutrient vision state.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 73eb3df7
---

# Nutrients Visual Manager

## Overview
This component controls the visual appearance of nutrient-related entities (such as fungal growths) in the game world. It toggles their visibility and rendering layer based on whether the player has "nutrient vision" enabled—switching them between a hidden, low-contrast state and a fully visible, highlighted state. It is instantiated only on non-dedicated clients and operates on the entity it is attached to (typically the player).

## Dependencies & Tags
- Requires the client environment: throws an assertion on dedicated servers.
- Listens to the `"nutrientsvision"` network event (sent from the server) to toggle rendering state.
- No components are added to the host entity (`self.inst`).
- No tags are added or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(none)* | The entity (typically a player) this component is attached to. Set at construction. |

No additional public member variables are exposed directly.

## Main Functions

### `UpdateVisualAnimState(visual)`
* **Description:** Updates the visual rendering properties (color, layer, sort order) of a registered nutrient visual entity based on the current `nutrients_vision` state. When disabled, visuals become nearly invisible with a dim tint; when enabled, they appear fully opaque on the background layer.
* **Parameters:**  
  `visual` (`Entity`): The visual entity whose `AnimState` component should be modified.

### `RegisterNutrientsVisual(visual)`
* **Description:** Registers a visual entity (e.g., a spawned nutrient effect) to be managed by this component. The visual will be updated whenever nutrient vision is toggled.
* **Parameters:**  
  `visual` (`Entity`): The visual entity to add to the internal registry.

### `UnregisterNutrientsVisual(visual)`
* **Description:** Removes a visual entity from the internal registry. It will no longer be affected by future nutrient vision toggles.
* **Parameters:**  
  `visual` (`Entity`): The visual entity to remove from the registry.

## Events & Listeners
- Listens to event `"nutrientsvision"` (via `inst:ListenForEvent`) and triggers the internal `ToggleNutrientsVision` handler, which updates all registered visuals when the player’s nutrient vision state changes.
- Does *not* push or emit any events itself.
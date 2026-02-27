---
id: playermetrics
title: Playermetrics
description: Tracks and reports player-specific gameplay events—specifically, when a player unlocks a recipe—by pushing metrics to the analytics system.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: d4acf377
---

# Playermetrics

## Overview
The `PlayerMetrics` component is a lightweight network-oriented component attached to player entities that listens for recipe-unlocking events and forwards them to the `Stats` analytics system via the `PushMetricsEvent` function. It ensures that protoyping actions (i.e., recipe unlocks) are logged for telemetry and analytics purposes.

## Dependencies & Tags
- **Dependency**: `stats` (custom module, required via `require("stats")`)
- **Event Listener**: Registers callback for `"unlockrecipe"` event on its entity
- **No components added or tags applied**

## Properties
No public properties are initialized in the constructor. The component stores only a reference to its entity (`self.inst`) internally.

## Main Functions
### `OnUnlockRecipe(inst, data)`
* **Description:** Callback invoked when the `"unlockrecipe"` event is fired. If the event data contains a valid recipe, it triggers a metrics event `"character.prototyped"` with the unlocked recipe’s prefab name.
* **Parameters:**
  - `inst`: The entity (player) that unlocked the recipe.
  - `data`: Event payload containing at least `recipe` (string or table with `prefab` field).

### `PlayerMetrics:OnRemoveFromEntity()`
* **Description:** Cleans up event listener registration when the component is removed from the entity.
* **Parameters:** None.

## Events & Listeners
- **Listens to**: `"unlockrecipe"` event (via `inst:ListenForEvent("unlockrecipe", OnUnlockRecipe)`)
- **Triggers**:
  - `"character.prototyped"` event (via `PushEvent("character.prototyped", inst, { prefab = data.recipe })`)
  - This event is an internal metrics payload, not an engine-level game event; actual event name used by `Stats.PushMetricsEvent` is implementation detail of the `Stats` module.
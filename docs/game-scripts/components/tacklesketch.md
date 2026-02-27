---
id: tacklesketch
title: Tacklesketch
description: A component that grants a specific tackle recipe to a player when used, then removes itself from the game.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: crafting
source_hash: aee4ad16
---

# Tacklesketch

## Overview
This component is attached to an entity (typically ausable item like a "Tackle Sketch") and enables players to learn a predefined tackle recipe by calling the `Teach` method. It tags the entity with `"tacklesketch"` for identification and cleans up the tag upon removal.

## Dependencies & Tags
* **Tags added:** `"tacklesketch"` (during initialization)
* **Tags removed:** `"tacklesketch"` (in `OnRemoveFromEntity`)
* **Component dependencies:** Relies on the target entity having a `craftingstation` component (used to learn the recipe) and the source entity supporting `GetSpecificSketchPrefab()` and `GetRecipeName()` methods.

## Properties
No public properties are explicitly initialized in the constructor or initialization logic. Only the `inst` reference is stored.

## Main Functions
### `OnRemoveFromEntity()`
* **Description:** Cleans up the `"tacklesketch"` tag when the component is removed from its entity (e.g., when the item is destroyed or consumed).
* **Parameters:** None.

### `Teach(target)`
* **Description:** Grants the player (or other target) the tackle recipe associated with this sketch, triggers a `"onlearnednewtacklesketch"` event on the target, and removes the sketch entity entirely.
* **Parameters:**  
  * `target` (Entity): The entity (usually a player) that will learn the recipe. Must have a `craftingstation` component.

## Events & Listeners
* **Listens for:** None.
* **Triggers:**  
  * `onlearnednewtacklesketch` — pushed on the `target` entity after the recipe is learned.
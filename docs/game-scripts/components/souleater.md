---
id: souleater
title: Souleater
description: A component that enables an entity to consume soul-based entities, optionally triggering a custom callback and removing the consumed soul.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 2d179474
---

# Souleater

## Overview
The `Souleater` component allows an entity to consume "soul" entities. It verifies that the target has a `soul` component, optionally resolves stackable souls to their base instance, dispatches a `"oneatsoul"` event, invokes an optional custom callback, and finally removes the consumed soul from the world.

## Dependencies & Tags
- Adds the `"souleater"` tag to the entity.
- Relies on the target soul entity having a `soul` component.
- May interact with the target's `stackable` component if present.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `oneatsoulfn` | `function` or `nil` | `nil` | Optional callback function set via `SetOnEatSoulFn`, invoked as `fn(inst, soul)` after event dispatch. |

## Main Functions

### `SetOnEatSoulFn(fn)`
* **Description:** Assigns a custom callback function to be executed when a soul is consumed. The callback receives the eater instance and the consumed soul instance as arguments.
* **Parameters:**  
  - `fn` (`function?`) — Optional function with signature `(eater_inst: Entity, soul: Entity) → nil`. Set to `nil` to clear.

### `EatSoul(soul)`
* **Description:** Attempts to consume the given `soul` entity. Handles stackable souls, dispatches the `"oneatsoul"` event, invokes the callback (if set), and removes the soul if still valid.
* **Parameters:**  
  - `soul` (`Entity`) — The entity to consume, expected to have a `soul` component.  
* **Returns:** `boolean` — `true` if consumption logic was executed (regardless of whether the soul was successfully removed), `false` if `soul.components.soul` was missing.

## Events & Listeners

- **Dispatches:** `"oneatsoul"` with payload `{ soul = soul }` — fired *before* the soul is removed, allowing listeners to react (e.g., gain abilities, play effects).
---
id: prototyper
title: Prototyper
description: Manages prototyping state and interactions for entities like Crafting Stations by tracking active users (doers) and triggering on/off callbacks.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: crafting
source_hash: 922c291a
---

# Prototyper

## Overview
The `Prototyper` component tracks which entities (doers) are currently using a prototyping station (e.g., a Crafting Station) and manages state transitions between idle (off) and active (on) modes. It integrates with the `TechTree` system to provide recipe data and supports customizable callbacks for activation, turn-on, and turn-off events. When a doer activates the station, it adds a `"prototyper"` tag and begins listening for the doer's removal to auto-reset state.

## Dependencies & Tags
- Adds the `"prototyper"` tag to the entity via `inst:AddTag("prototyper")`.
- Depends on `TechTree` module (loaded via `require("techtree")`).
- May optionally interact with `craftingstation` component (if present on the same entity).
- Registers event callbacks for `"onremove"` events on doer entities.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity the component is attached to. |
| `trees` | `TechTree` | `TechTree.Create()` | Holds the tech/recipe tree data for prototyping. |
| `on` | `boolean` | `false` | Indicates whether at least one doer is actively using the prototyper. |
| `onturnon` | `function?` | `nil` | Global callback invoked once when the prototyper transitions from off to on. |
| `onturnoff` | `function?` | `nil` | Global callback invoked once when the prototyper transitions from on to off. |
| `doers` | `table` | `{}` | Dictionary mapping doer entities (keys) to `true` (values); tracks active users. |
| `onremovedoer` | `function` | — | Internal callback (set once in constructor) used to turn off the prototyper when a doer is removed. |
| `onturnonfordoer` | `function?` | `nil` | Doer-specific callback (externally assignable) triggered when a doer turns on the prototyper. |
| `onturnofffordoer` | `function?` | `nil` | Doer-specific callback (externally assignable) triggered when a doer turns off the prototyper. |
| `onactivate` | `function?` | `nil` | Callback (externally assignable) invoked when `Activate` is called. |

## Main Functions

### `OnRemoveFromEntity()`
* **Description:** Cleans up when the component is removed from its entity. Removes the `"prototyper"` tag, unregisters `"onremove"` callbacks for all tracked doers, and fires the global `onturnoff` callback if the prototyper was on.
* **Parameters:** None.

### `TurnOn(doer)`
* **Description:** Registers a doer as an active user and turns the prototyper on if it was previously off.
* **Parameters:**
  - `doer` (`Entity`): The entity (e.g., a player) beginning to use the prototyper.

### `TurnOff(doer)`
* **Description:** Removes a doer from the active user list and turns the prototyper off if no doers remain.
* **Parameters:**
  - `doer` (`Entity`): The entity ending its use of the prototyper.

### `GetTechTrees()`
* **Description:** Returns a deep copy of the internal `trees` (tech/recipe data).
* **Parameters:** None.

### `Activate(doer, recipe)`
* **Description:** Registers a recipe crafting event (via the optional `craftingstation` component) and fires the `onactivate` callback.
* **Parameters:**
  - `doer` (`Entity`): The entity that activated the prototyper.
  - `recipe` (`Recipe`): The recipe object being crafted.

## Events & Listeners
- Listens to `"onremove"` event on each `doer` entity, invoking `onremovedoer` (which calls `TurnOff` for that doer).
- May push custom events via external callbacks (`onturnon`, `onturnoff`, `onactivate`, `onturnonfordoer`, `onturnofffordoer`), but this component does not directly call `PushEvent`.
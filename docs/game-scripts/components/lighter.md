---
id: lighter
title: Lighter
description: This component enables an entity to ignite burnable targets, optionally invoking a custom callback and broadcasting a downstream event.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: cd38eac6
---

# Lighter

## Overview
The `Lighter` component provides the ability for an entity (typically an item or character) to ignite burnable targets. It manages a callback function (`onlight`) triggered upon successful ignition and ensures appropriate event propagation.

## Dependencies & Tags
- Adds the tag `"lighter"` to the entity on construction.
- Removes the `"lighter"` tag on entity removal via `OnRemoveFromEntity`.
- Relies on the `burnable` component being present on target entities for ignition logic.

## Properties

| Property     | Type      | Default Value | Description                                      |
|--------------|-----------|---------------|--------------------------------------------------|
| `inst`       | `Entity`  | —             | Reference to the owning entity.                  |
| `onlight`    | `function`| `nil`         | Optional callback executed after successful ignition. |

## Main Functions

### `SetOnLightFn(fn)`
* **Description:** Sets or replaces the callback function that is invoked when the lighter successfully ignites a target. The callback receives two arguments: the lighter entity and the target entity.
* **Parameters:**
  - `fn` (`function` or `nil`): The callback to invoke on successful ignition; `nil` clears the callback.

### `Light(target, doer)`
* **Description:** Attempts to ignite the given `target` entity. Ignition succeeds only if the target has a `burnable` component and does not meet exclusion criteria (e.g., depleted fuel without override, or being in limbo). Upon success, the callback (`onlight`) is executed (if set), and the `onlighterlight` event is pushed on the target regardless of success or failure.
* **Parameters:**
  - `target` (`Entity`): The entity to ignite.
  - `doer` (`Entity`): The entity performing the ignition (e.g., the player).

## Events & Listeners
- **Listens for:** None.
- **Triggers:**
  - Pushes the `"onlighterlight"` event on the `target` entity in all cases via `target:PushEvent("onlighterlight")`, regardless of whether ignition succeeded.
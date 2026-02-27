---
id: halloweenpotionmoon
title: Halloweenpotionmoon
description: A component that applies a mutation transformation to a target entity when used, then consumes the potion item.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 393242aa
---

# Halloweenpotionmoon

## Overview
This component implements the behavior of a Halloween potion item in Don't Starve Together. When used, it attempts to mutate a target entity that possesses the `halloweenmoonmutable` component, calls an optional user-defined callback, and finally consumes the potion by removing it from the game.

## Dependencies & Tags
The component does not add or remove any tags or components on its host entity. It *interacts with* the following external components on target or self entities:
- `halloweenmoonmutable` (on target)
- `inventoryitem` (on target)
- `stackable` (on self)

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (passed to constructor) | Reference to the entity the component is attached to (i.e., the potion item). |
| `onusefn` | `function` or `nil` | `nil` | Optional callback function set via `SetOnUseFn`, invoked after attempting the mutation. Signature: `fn(inst, doer, target, success, transformed_inst, container)`. |

## Main Functions

### `SetOnUseFn(fn)`
* **Description:** Assigns an optional callback function to be executed when the potion is used. This allows modders to inject custom logic (e.g., sound, particle, or state changes) after the mutation attempt.
* **Parameters:**
  - `fn` (`function`): A function to call on use. Must accept six arguments: `(potion_inst, doer, target, success, transformed_inst, container)`.

### `Use(doer, target)`
* **Description:** Executes the core potion behavior. Attempts to mutate the target if it has the `halloweenmoonmutable` component. Invokes the `onusefn` callback (if set), and removes the potion (either by decrementing stack count or fully destroying it).
* **Parameters:**
  - `doer` (`Entity`): The entity performing the action (e.g., a player).
  - `target` (`Entity` or `nil`): The entity targeted for mutation. May be `nil`.

## Events & Listeners
None identified.
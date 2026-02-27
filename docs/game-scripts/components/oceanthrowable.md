---
id: oceanthrowable
title: Oceanthrowable
description: This component enables an entity to be thrown into the ocean by attaching a complexprojectile component and optionally invoking a custom projectile setup function.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: f65c6490
---

# Oceanthrowable

## Overview
The Oceanthrowable component prepares an entity to function as an ocean-thrown object by ensuring it has a `complexprojectile` component and allowing optional customization of the projectile via a user-defined callback function. It is typically used for items thrown into the ocean by the player or other actors.

## Dependencies & Tags
- **Component Dependency:** `complexprojectile`
- **Tags Added/Removed:** None identified

## Properties
The component does not define any public properties in its constructor (`_ctor`). All state is held in instance fields (`self.*`) set during runtime.

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `onaddprojectilefn` | `function?` | `nil` | Optional callback function invoked during `AddProjectile()` to configure the projectile (e.g., set velocity, splash logic). |

## Main Functions

### `SetOnAddProjectileFn(fn)`
* **Description:** Assigns a callback function that will be executed when `AddProjectile` is called, allowing external code to customize the projectile before launch.
* **Parameters:**  
  - `fn` (`function`): A function that accepts the entity instance (`inst`) as its sole argument. Typically used to configure physics, effects, or behavior for the projectile.

### `AddProjectile()`
* **Description:** Ensures the entity has a `complexprojectile` component and, if set, invokes the `onaddprojectilefn` callback to finalize projectile setup.
* **Parameters:** None

## Events & Listeners
None — this component does not register or emit events.
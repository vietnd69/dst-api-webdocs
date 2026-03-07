---
id: burnable_locator_medium
title: Burnable Locator Medium
description: A non-physical, boat-anchored locator entity that triggers fire damage on its parent boat while smoldering or burning.
tags: [fire, entity, boat, environment]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5c55bb45
system_scope: environment
---

# Burnable Locator Medium

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`burnable_locator_medium` is a helper entity that tracks and propagates fire damage to a parent boat. It has no visual presence or physical collision and exists solely to bind fire state to its `boat` parent. When ignited or smoldering, it begins periodic fire damage application to the boat via the `health` component. When extinguished, it cleans up its task and decrements the boat's `activefires` counter. This entity follows DST's ECS pattern, using the `burnable` and `health` components indirectly via callbacks and component access.

## Usage example
```lua
-- Typically instantiated automatically by the game when a boat catches fire
-- and is not meant to be manually created by modders.
-- The prefab is registered as "burnable_locator_medium" and returned by its fn()
-- Example internal usage (not public API):
local locator = SpawnPrefab("burnable_locator_medium")
locator.boat = myboat_entity
locator.boat.activefires = (locator.boat.activefires or 0) + 1
```

## Dependencies & tags
**Components used:** `burnable`, `health`  
**Tags:** Adds `NOBLOCK`, `NOCLICK`, `ignorewalkableplatforms` on creation; dynamically toggles `NOCLICK` based on fire state (`add` on extinguish/smoldering end, `remove` on ignite/smoldering start).

## Properties
No public properties.

## Main functions
This prefab does not define any public functions beyond the callbacks registered with `burnable`.

### `applytickdamage(inst)`
*   **Description:** Called periodically during burning; applies instant fire damage to the parent `boat` using `health:DoFireDamage`.
*   **Parameters:** `inst` (Entity) — the locator instance itself.
*   **Returns:** Nothing.
*   **Error states:** If `inst.boat` is `nil` or lacks a `health` component, no damage is applied.

### `onignite(inst)`
*   **Description:** Triggered when the locator ignites; increments `boat.activefires`, starts a periodic task for `applytickdamage`, and removes `NOCLICK` tag.
*   **Parameters:** `inst` (Entity) — the locator instance.
*   **Returns:** Nothing.

### `onextinguish(inst)`
*   **Description:** Triggered when fire is extinguished; decrements `boat.activefires`, re-adds `NOCLICK` tag, and cancels the periodic damage task.
*   **Parameters:** `inst` (Entity) — the locator instance.
*   **Returns:** Nothing.

### `onsmoldering(inst)`
*   **Description:** Triggered when the locator enters smoldering state; removes `NOCLICK` tag.
*   **Parameters:** `inst` (Entity) — the locator instance.
*   **Returns:** Nothing.

### `onstopsmoldering(inst)`
*   **Description:** Triggered when smoldering ends; re-adds `NOCLICK` tag.
*   **Parameters:** `inst` (Entity) — the locator instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (uses burnable callback hooks instead).
- **Pushes:** None (Relies on burnable and health component events internally; no custom events are pushed).
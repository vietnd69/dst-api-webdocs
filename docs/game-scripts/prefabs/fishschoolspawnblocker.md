---
id: fishschoolspawnblocker
title: Fishschoolspawnblocker
description: Removes itself automatically after a fixed lifetime to prevent permanent obstruction of fish school spawn points.
tags: [spawning, environment, temporary]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 93b79c8d
system_scope: environment
---

# Fishschoolspawnblocker

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`fishschoolspawnblocker` is a lightweight, temporary entity prefab used to block fish school spawn locations for a controlled duration. It prevents unintended placement or activation of fish schools during world generation or events by occupying the spawn slot temporarily. The entity has no visual representation (uses only a transform), and automatically destroys itself once its internal timer expires.

## Usage example
This prefab is not intended for manual instantiation by modders. It is created internally by the game's world generation system, specifically by the `schoolspawner` logic, to enforce timing constraints on fish school availability.

```lua
-- Example use inside world generation (not for direct modder use)
local blocker = SpawnPrefab("fishschoolspawnblocker")
blocker.Transform:SetPosition(x, y, z)
-- The blocker will self-remove after TUNING.SCHOOL_SPAWNER_BLOCKER_LIFETIME seconds
```

## Dependencies & tags
**Components used:** `timer` (via `inst:AddComponent("timer")`)
**Tags:** Adds `herd`, `NOBLOCK`, `NOCLICK`, and `fishschoolspawnblocker`.

## Properties
No public properties are defined. The component logic relies entirely on the `timer` component's internal state and event handling.

## Main functions
Not applicable — this is a prefab definition, not a reusable component class. No custom methods are exposed.

## Events & listeners
- **Listens to:** `timerdone` — fires when the internal timer expires, triggering automatic removal of the entity via `ontimerdone`.
- **Pushes:** None.

### `ontimerdone(inst)`
*   **Description:** Internal callback that removes the entity from the world upon timer completion.
*   **Parameters:** `inst` (Entity) — the blocker entity instance.
*   **Returns:** Nothing.

### `fn()`
*   **Description:** Prefab constructor function. Initializes and configures the blocker entity.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) — fully configured entity ready for placement in the world.
*   **Error states:** None; always returns a valid entity instance.
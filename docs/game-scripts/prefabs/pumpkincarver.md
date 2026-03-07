---
id: pumpkincarver
title: Pumpkincarver
description: Creates a stackable pumpkin carver item prefab used during Halloween events, with event-specific animation and scrapbook integration.
tags: [halloween, item, event]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a601450a
system_scope: inventory
---

# Pumpkincarver

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`pumpkincarver.lua` defines the prefab factory for pumpkin carver items used during the Halloween season. Each carver is a cosmetic, stackable inventory item with unique animations (`carver1`, `carver2`, etc.) and scrapbook metadata. It is not intended for crafting or gameplay use beyond visual display and collection. The component does not define its own logic in this file — instead, the `pumpkincarver` component (added to each instance) is referenced, though its implementation resides elsewhere.

## Usage example
```lua
-- Example of spawning a pumpkin carver (e.g., carver #2)
local carver = Prefab("pumpkincarver2")
if carver ~= nil then
    local inst = carver()
    inst.Transform:SetWorldPosition(x, y, z)
    TheWorld:SpawnPrefab(inst)
end
```

## Dependencies & tags
**Components used:** `inventoryitem`, `pumpkincarver`, `inspectable`, `smallburnable`, `smallpropagator`, `hauntablelaunch`
**Tags:** Adds `donotautopick`.

## Properties
No public properties.

## Main functions
### `MakeCarver(id)`
*   **Description:** Factory function that constructs and returns a `Prefab` for a specific pumpkin carver variant (`id`). It configures the entity's transform, animation, physics, and add-ons; initializes network replication; and sets scrapbook metadata.
*   **Parameters:** `id` (number) — the index of the carver variant (e.g., `1`, `2`, `3`).
*   **Returns:** `Prefab` — a reusable prefab factory function (`fn`) and associated assets.

## Events & listeners
None identified.
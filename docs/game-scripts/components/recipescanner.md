---
id: recipescanner
title: Recipescanner
description: Enables scanning of entities to automatically unlock associated recipes for a builder.
tags: [crafting, discovery, interaction]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 4f546cbd
system_scope: crafting
---

# Recipescanner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Recipescanner` component allows an entity to scan other entities in the world to discover and unlock new recipes for a designated builder. It is typically attached to entities like the Recluse, Science Machine, or similar devices that can analyze objects to grant crafting knowledge. The component delegates recipe validation and unlocking logic to the `builder` component on the scanning doer.

## Usage example
```lua
-- Example: Adding recipescanner to a custom device
local inst = CreateEntity()
inst:AddComponent("recipescanner")

-- Optionally set a callback for post-scan actions
inst.components.recipescanner:SetOnScannedFn(function(scanner, target, doer, recipe_name)
    print("Recipe", recipe_name, "was scanned by", doer.name)
end)

-- Example: Triggering a scan (e.g., from an action)
if inst.components.recipescanner then
    local success, reason = inst.components.recipescanner:Scan(some_target_entity, player_entity)
end
```

## Dependencies & tags
**Components used:** `builder` (on the doer entity)  
**Tags:** Adds `recipescanner` on construction; removes `recipescanner` on entity removal.

## Properties
No public properties.

## Main functions
### `SetOnScannedFn(fn)`
*   **Description:** Sets a custom callback function to be invoked after a successful scan.
*   **Parameters:** `fn` (function) - A function with signature `fn(scanner, target, doer, recipe_name)`.
*   **Returns:** Nothing.

### `Scan(target, doer)`
*   **Description:** Attempts to scan a target entity and unlock the corresponding recipe for the doer if valid. Performs checks for builder capability, recipe availability, and deconstruction restrictions.
*   **Parameters:**
    *   `target` (GObject) - The entity being scanned; must have a resolvable recipe (e.g., via `target.SCANNABLE_RECIPENAME` or `target.prefab`).
    *   `doer` (GObject) - The entity performing the scan; must have a `builder` component.
*   **Returns:**
    *   `true` if the recipe was successfully unlocked.
    *   `false, "CANTLEARN"` if the recipe cannot be learned (e.g., missing builder tags, skill requirements, or explicit deconstruction restriction).
    *   `false, "KNOWN"` if the doer already knows the recipe.
*   **Error states:** Returns early with `false` if the doer lacks a `builder` component or the target has the `NOCLICK` tag.

## Events & listeners
- **Listens to:** None.
- **Pushes:** `onrecipescanned` - fired on the `target` entity after successful scan with payload `{ scanner = self.inst, doer = doer, recipe = recipe.name }`.
- **Callback support:** Invokes `self.onscanned(scanner, target, doer, recipe_name)` if set via `SetOnScannedFn`.

---
id: hungerregenbuff
title: Hungerregenbuff
description: Applies a periodic hunger regeneration buff to a target entity, adjusting output based on eater and food memory multipliers.
tags: [buff, hunger, passive]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a701ecd0
system_scope: entity
---

# Hungerregenbuff

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`hungerregenbuff` is a non-persistent, server-only entity prefab that functions as a *debuff container* to periodically restore hunger to a target entity. It is not attached directly to playable characters or world objects; instead, it is instantiated and assigned to a target via the `debuff` component. While active, it spawns a periodic task that adds hunger in fixed ticks, adjusted by the target’s `eater.hungerabsorption` and `foodmemory:GetFoodMultiplier()` values. It ceases operation upon target death, removal, or when manually stopped.

## Usage example
```lua
-- Typical usage by a debuff-aware prefab (e.g., character or item)
local buff = SpawnPrefab("hungerregenbuff")
if buff and target.components.debuff then
    target.components.debuff:Start("hungerregenbuff", buff)
end
```

## Dependencies & tags
**Components used:** `debuff`, `health`, `hunger`, `eater`, `foodmemory`  
**Tags:** Adds `hungerregenbuff` to the target entity while active; listens for `onremove` to clean up tag.

## Properties
No public properties.

## Main functions
### `OnTick(inst, target)`
*   **Description:** Periodic callback executed on a fixed tick interval. Applies hunger delta to the target, provided the target is alive and not a ghost. Exits early and triggers `debuff:Stop()` if target is invalid.
*   **Parameters:**  
    `inst` (Entity) — the hungerregenbuff instance.  
    `target` (Entity) — the entity receiving hunger regen.  
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `target.components.health` or `target.components.hunger` is missing, if `target:IsDead()`, or if `target` has tag `"playerghost"`.

### `OnAttached(inst, target)`
*   **Description:** Called when the buff is attached to a target. Attaches the buff entity as a child of the target, initializes a periodic task for hunger ticks, and sets up event listeners (death, removal).
*   **Parameters:**  
    `inst` (Entity) — the hungerregenbuff instance.  
    `target` (Entity) — the entity receiving the buff.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `death` (on target) — triggers `inst.components.debuff:Stop()`.  
  `onremove` (on target, scoped to buff) — removes `hungerregenbuff` tag from target.  
- **Pushes:** None.
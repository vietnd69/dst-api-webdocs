---
id: sewing
title: Sewing
description: Enables repair of entities with the 'needssewing' tag using fuel-based or consumable sewing kits.
tags: [crafting, repair, inventory]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: d0dfd891
system_scope: crafting
---

# Sewing

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `sewing` component provides a standardized method for repairing entities that require sewing (e.g., clothing or gear with the `needssewing` tag). It is typically attached to items like Sewing Kits. When `DoSewing` is called, it consumes the tool (either decrementing finite uses or removing a stack item) and restores fuel to the target via the `fueled` component. It also triggers achievement progression and custom post-sewing logic if defined.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("sewing")
inst.components.sewing.repair_value = 25
-- Later, when the item repairs a target:
local success = inst.components.sewing:DoSewing(target_entity, player_entity)
```

## Dependencies & tags
**Components used:** `fueled`, `finiteuses`, `stackable`
**Tags:** Checks `needssewing` on target; awards achievement `sewing_kit` via `AwardPlayerAchievement`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `repair_value` | number | `1` | The amount of fuel to add to the target entity. |

## Main functions
### `DoSewing(target, doer)`
*   **Description:** Attempts to repair the given target entity by restoring fuel and consuming this sewing tool. Only succeeds if the target has the `needssewing` tag.
*   **Parameters:**  
    `target` (Entity) — The entity to repair; must have a `fueled` component and the `needssewing` tag.  
    `doer` (Entity) — The entity performing the repair; used for achievement attribution and event context.
*   **Returns:** `true` if repair was successful, `nil` otherwise.
*   **Error states:** Returns `nil` silently if the target lacks the `needssewing` tag. If this component is attached to a tool with no `finiteuses` or `stackable` component, the tool is not consumed (though repair still succeeds, which may indicate a logic bug).

## Events & listeners
- **Listens to:** None directly. Custom callback can be attached via `self.onsewn`.
- **Pushes:** `AwardPlayerAchievement("sewing_kit", doer)` — triggers in-game achievement.

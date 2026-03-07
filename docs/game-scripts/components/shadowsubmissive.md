---
id: shadowsubmissive
title: Shadowsubmissive
description: Grants an entity the `shadowsubmissive` tag and manages its behavioral response to shadow-dominant entities by tracking attacks and restoring the `shadowdominance` tag after a delay if conditions are met.
tags: [shadow, behavior, combat]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 0e644a7e
system_scope: entity
---

# Shadowsubmissive

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ShadowSubmissive` manages the "submissive" behavior of an entity in relation to shadow-dominant entities. It automatically adds the `shadowsubmissive` tag upon initialization and listens for the `attacked` event. When attacked, it cancels any prior delayed reaction and schedules a reapplication of the `shadowdominance` tag after a fixed cooldown period (12 seconds), provided the attacker currently holds or is inherently shadow-dominant. This component is intended to work in conjunction with the `ShadowDominance` component and the `inherentshadowdominance` tag.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("shadowsubmissive")

-- Later, if attacked:
-- The component will automatically remove `shadowdominance` from the attacker
-- and schedule a delayed call to restore it if conditions hold.
```

## Dependencies & tags
**Components used:** `inventory` (only via `EquipHasTag` check)  
**Tags:** Adds `shadowsubmissive`; checks `shadowdominance`, `inherentshadowdominance`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `forgetattackertime` | number | `12` | Time in seconds after which the attacker’s `shadowdominance` tag is re-added if conditions are still met. |
| `inst` | Entity | (runtime-assigned) | Reference to the entity the component is attached to. |

## Main functions
### `ShouldSubmitToTarget(target)`
*   **Description:** Determines whether the entity should submit to the given target based on the target’s dominance status.
*   **Parameters:** `target` (Entity or nil) — the entity to check dominance against.
*   **Returns:** `true` if `target` is valid and has the `shadowdominance` tag; otherwise `false`.
*   **Error states:** Returns `false` if `target` is `nil` or invalid.

### `TargetHasDominance(target)`
*   **Description:** Checks whether the target is considered shadow-dominant by inspecting both equipped items (via `inventory:EquipHasTag`) and innate tags.
*   **Parameters:** `target` (Entity or nil) — the entity to check dominance for.
*   **Returns:** `true` if `target` is valid and either:
    - has an equip with the `shadowdominance` tag (via `inventory.EquipHasTag`), **or**
    - has the `inherentshadowdominance` tag;
    otherwise returns `false`.
*   **Error states:** Returns `false` if `target` is `nil` or invalid.

## Events & listeners
- **Listens to:** `attacked` — triggers `OnAttacked`, which removes the attacker’s `shadowdominance` tag and schedules a delayed re-addition.
- **Pushes:** None.

### `OnRemoveFromEntity()`
*   **Description:** Clean-up handler invoked when the component is removed from its entity.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Side effects:** Removes the `shadowsubmissive` tag from `inst`; unregisters the `attacked` event listener.

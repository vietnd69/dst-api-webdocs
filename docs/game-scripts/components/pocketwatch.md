---
id: pocketwatch
title: Pocketwatch
description: Controls whether an entity can cast spells based on its inactive state and optional custom casting conditions.
tags: [spellcasting, state, ability]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: fbbba304
system_scope: entity
---

# Pocketwatch

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `pocketwatch` component implements a toggle mechanism to enable or disable spellcasting functionality on an entity. It manages an `inactive` state flag, which—if `true`—blocks all spell casting unless explicitly overridden by custom logic. When the component is attached to an entity, it automatically manages the `"pocketwatch_inactive"` tag based on the `inactive` state, allowing game systems to query tag presence for conditional behavior.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("pocketwatch")

-- Override casting logic (optional)
inst.components.pocketwatch.CanCastFn = function(inst, doer, target, pos)
    return doer:HasTag("player") and pos ~= nil
end

inst.components.pocketwatch.DoCastSpell = function(inst, doer, target, pos)
    -- Perform spell logic here
    return true
end

-- Disable spellcasting by setting inactive = true (default)
inst.components.pocketwatch.inactive = true

-- Enable spellcasting
inst.components.pocketwatch.inactive = false
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds/removes `"pocketwatch_inactive"` on the owner entity based on the `inactive` state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inactive` | boolean | `true` | If `true`, casting is blocked (unless overridden by `CanCastFn`). Controls the `"pocketwatch_inactive"` tag. |
| `CanCastFn` | function or `nil` | `nil` | Optional custom predicate used in `CanCast`. Signature: `fn(inst, doer, target, pos) -> boolean`. |
| `DoCastSpell` | function or `nil` | `nil` | Optional spellcasting implementation. Signature: `fn(inst, doer, target, pos) -> success (boolean), reason (string?)`. |

## Main functions
### `CanCast(doer, target, pos)`
*   **Description:** Checks whether spellcasting is allowed at this time. Returns `false` if `inactive` is `true`, unless overridden by `CanCastFn`.
*   **Parameters:**
    *   `doer` (entity) – The entity attempting to cast the spell.
    *   `target` (entity or `nil`) – The target entity, if any.
    *   `pos` (`Vector3` or `nil`) – The target position, if any.
*   **Returns:** `boolean` – `true` if casting is permitted, `false` otherwise.

### `CastSpell(doer, target, pos)`
*   **Description:** Attempts to execute the spell using `DoCastSpell`, but only if `inactive` is `false`.
*   **Parameters:**
    *   `doer` (entity) – The entity casting the spell.
    *   `target` (entity or `nil`) – The target entity, if any.
    *   `pos` (`Vector3` or `nil`) – The target position, if any.
*   **Returns:** `success (boolean)`, `reason (string or nil)` – Success status and optional failure reason (e.g., "not implemented"). Returns `false, nil` if `DoCastSpell` is `nil` or `inactive` is `true`.

## Events & listeners
- **Pushes:** `pocketwatch_inactive` tag is added/removed via `inst:AddOrRemoveTag` when `inactive` changes (handled via property setter).  
- **Listens to:** None identified.

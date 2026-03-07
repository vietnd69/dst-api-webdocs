---
id: aoespell
title: Aoespell
description: Manages casting and validation logic for area-of-effect (AoE) spells in DST, integrating with targeting, spellbook, inventory, and world constraint systems.
tags: [combat, spell, targeting, aoe]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 1a6f8280
system_scope: combat
---

# Aoespell

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`AOESpell` provides the core logic for casting area-of-effect spells. It stores a spell function (`spellfn`) to execute when casting, and validates whether a cast can occur based onSpellbook permissions, fuel status, ownership, rider state, and map constraints via `aoetargeting`. It notifies the world and doer of successful or failed casts via events.

This component is typically attached to spell items (e.g., spellbooks, wands) or spell-casting entities and depends heavily on the `aoetargeting`, `spellbook`, `inventoryitem`, `fueled`, `rider`, and world map APIs.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("aoespell")
inst.components.aoespell:SetSpellFn(function(inst, doer, pos)
    -- Spell effect logic here
    -- return true or false, optional reason
    return true
end)

local success, reason = inst.components.aoespell:CastSpell(player, Vector3(10, 0, 20))
```

## Dependencies & tags
**Components used:**  
- `aoetargeting`  
- `spellbook`  
- `inventoryitem`  
- `fueled`  
- `rider`  

**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `spellfn` | function? | `nil` | The callback function that executes the spell effect when cast. Signature: `(spell_inst, doer, pos) → success (boolean), reason? (string)`. |

## Main functions
### `SetSpellFn(fn)`
* **Description:** Sets the spell execution function. This function is invoked during `CastSpell`.
* **Parameters:**  
  - `fn` (function) — Must accept `(self.inst, doer, pos)` as arguments and return `(success, reason?)`. `success` defaults to `true` if omitted.
* **Returns:** Nothing.

### `CastSpell(doer, pos)`
* **Description:** Executes the spell at the given world position. Logs a success/failure and fires the `oncastaoespell` event on the doer.
* **Parameters:**  
  - `doer` (Entity?) — The entity performing the cast. May be `nil`.  
  - `pos` (Vector3) — World position to cast the spell.
* **Returns:**  
  - `success` (boolean) — Whether the spell executed successfully.  
  - `reason` (string?) — Optional error message (only if `spellfn` returns `nil, reason`).
* **Error states:** Returns `true, nil` if no `spellfn` is set.

### `CanCast(doer, pos)`
* **Description:** Determines whether the spell can be cast at `pos`, considering spellbook permissions, item ownership/fuel, rider status, and map constraints.
* **Parameters:**  
  - `doer` (Entity) — The entity attempting the cast.  
  - `pos` (Vector3) — World position to validate casting at.
* **Returns:** `true` if the cast is allowed, `false` otherwise.
* **Error states:** Returns `false` if:  
  - `spellfn` is `nil`,  
  - `spellbook:CanBeUsedBy(doer)` fails,  
  - Item is not owned by `doer` (if inventoryitem exists),  
  - Item is empty (if fueled and IsEmpty()),  
  - `doer` is riding but `allowriding` is `false`,  
  - `aoetargeting` is disabled or `CanCastAtPoint()` fails.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:**  
  - `oncastaoespell` — Fired on the `doer` entity after casting. Payload: `{ item = self.inst, pos = pos, success = success }`.

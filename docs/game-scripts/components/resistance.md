---
id: resistance
title: Resistance
description: Manages damage resistance by tracking tags that grant immunity or mitigation against specific damage sources.
tags: [combat, damage, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f6bec40b
system_scope: combat
---

# Resistance

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Resistance` component enables an entity to declare resistance (typically immunity) to damage from entities or weapons carrying specific tags. It is commonly used to implement mechanics such as fireproofing (`resistsfire`), electric resistance, or boss immunities to certain weapon types. This component does not reduce damage values directly; instead, it flags resistance conditions and triggers events when damage is resisted.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("resistance")

-- Grant resistance to fire-tagged attackers
inst.components.resistance:AddResistance("fire")

-- Grant resistance to weapons with the "electric" tag
inst.components.resistance:AddResistance("electric")

-- Optionally configure custom logic
inst.components.resistance:SetShouldResistFn(function(ent) return ent.components.health and ent.components.health:IsAlive() end)
inst.components.resistance:SetOnResistDamageFn(function(inst, damage, attacker)
    -- e.g., play sound, spawn FX
end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds and removes custom string tags (e.g., `"fire"`, `"electric"`). No built-in tags are managed internally.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `tags` | table | `{}` | Map of resistance tags; keys and values are identical tag strings. |
| `onresistdamage` | function or nil | `nil` | Optional callback invoked when damage is resisted. Signature: `fn(inst, damage_amount, attacker)`. |
| `shouldresistfn` | function or nil | `nil` | Optional predicate function that determines whether resistance should apply. Signature: `fn(inst) -> boolean`. |

## Main functions
### `AddResistance(tag)`
*   **Description:** Registers a tag as a source of damage that this entity resists.
*   **Parameters:** `tag` (string) — the tag to resist (e.g., `"fire"`, `"boss"`).
*   **Returns:** Nothing.

### `RemoveResistance(tag)`
*   **Description:** Removes a previously registered resistance tag.
*   **Parameters:** `tag` (string) — the tag to remove from resistance.
*   **Returns:** Nothing.

### `HasResistance(attacker, weapon)`
*   **Description:** Checks if the entity resists damage from the given attacker and/or weapon by comparing their tags against registered resistances.
*   **Parameters:** 
    * `attacker` (GO or nil) — the entity delivering the damage.
    * `weapon` (GO or nil) — the weapon used to deal damage (may be `nil`).
*   **Returns:** `true` if any tag on `attacker` or `weapon` matches a registered resistance; otherwise `false`.
*   **Error states:** Returns `nil` implicitly if no matching tag is found or if `attacker` is `nil`.

### `HasResistanceToTag(tag)`
*   **Description:** Checks if a specific tag is currently a registered resistance.
*   **Parameters:** `tag` (string) — the tag to check.
*   **Returns:** `true` if the tag is registered; otherwise `false`.

### `SetOnResistDamageFn(fn)`
*   **Description:** Sets the callback function executed when damage is successfully resisted.
*   **Parameters:** `fn` (function or nil) — function to invoke with `(inst, damage_amount, attacker)`. Pass `nil` to clear.
*   **Returns:** Nothing.

### `SetShouldResistFn(fn)`
*   **Description:** Sets a predicate function that controls *whether* resistance should be applied in a given scenario (e.g., based on health state).
*   **Parameters:** `fn` (function or nil) — function to invoke with `(inst)` and returning `true`/`false`. Pass `nil` to enable resistance unconditionally.
*   **Returns:** Nothing.

### `ShouldResistDamage()`
*   **Description:** Evaluates the `shouldresistfn` to determine if resistance should currently be active.
*   **Parameters:** None.
*   **Returns:** `true` if `shouldresistfn` is `nil` or returns `true`; otherwise `false`.

### `ResistDamage(damage_amount, attacker)`
*   **Description:** Triggers the resistance action. Calls `onresistdamage` and fires the `damageresisted` event.
*   **Parameters:** 
    * `damage_amount` (number) — the amount of damage being resisted.
    * `attacker` (GO) — the entity responsible for the damage.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a human-readable string listing all registered resistance tags for debugging.
*   **Parameters:** None.
*   **Returns:** string — e.g., `"Resists: fire, electric"`.

## Events & listeners
- **Pushes:** `damageresisted` — fired when `ResistDamage` is called. Data payload: `{damage_amount = number, attacker = GO}`.

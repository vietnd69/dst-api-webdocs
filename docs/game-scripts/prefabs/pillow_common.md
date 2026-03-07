---
id: pillow_common
title: Pillow Common
description: Provides a shared knockback function that respects special tags and body armor defense values when applying knockback effects.
tags: [knockback, defense, physics]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 23a6639f
system_scope: entity
---

# Pillow Common

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`pillow_common` is a utility module that exports a `DoKnockback` function for applying knockback to entities. It checks for tags that prevent knockback (`epic`, `nopush`), reads optional defense values from equipped body armor, and computes the final knockback strength and radius. It then fires a `knockback` event on the target entity with computed parameters. This module is intended for reuse across prefabs that need consistent knockback behavior, especially those involving pillow-related mechanics.

## Usage example
```lua
local pillow_common = require("prefabs/pillow_common")

local function OnHitTarget(target, source)
    if pillow_common.DoKnockback(target, source, { amount = 0.75, strengthmult = 1.2 }) then
        -- knockback was applied successfully
    else
        -- knockback was blocked by tag
    end
end
```

## Dependencies & tags
**Components used:** `inventory` (to retrieve `BODY` slot item and its `_defense_amount`)
**Tags:** Reads `epic`, `nopush` (prevents knockback); checks `bodypillow` on equipped body item.

## Properties
No public properties

## Main functions
### `DoKnockback(target, source, knockback_data)`
*   **Description:** Applies knockback to `target`, accounting for tags that block knockback and defense from equipped items. Fires a `knockback` event on the target with the computed knockback parameters.
*   **Parameters:** 
    * `target` (entity) — the entity to be knocked back.
    * `source` (entity) — the entity applying the knockback.
    * `knockback_data` (table, optional) — contains optional fields: `amount` (number, default `0.5`), `strengthmult` (number, default `1`).
*   **Returns:** `true` if knockback was applied, `false` if blocked by an `epic` or `nopush` tag.
*   **Error states:** Returns `false` and does nothing if `target` has either the `epic` or `nopush` tag. If `target` lacks an inventory component or no body item is equipped, defense is treated as `0`.

## Events & listeners
- **Pushes:** `knockback` — fired on the target entity with payload: `{ knocker = source, radius = number, strengthmult = number, forcelanded = boolean }`.  
- **Listens to:** None.
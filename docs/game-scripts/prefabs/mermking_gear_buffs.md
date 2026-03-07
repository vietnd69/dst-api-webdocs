---
id: mermking_gear_buffs
title: Mermking Gear Buffs
description: Provides prefab factory functions to generate temporary debuff components for Merm King gear upgrades (Trident, Crown, Pauldron) that modify combat stats of attached targets.
tags: [combat, debuff, buff, gear]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e58118b2
system_scope: entity
---

# Mermking Gear Buffs

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`mermking_gear_buffs.lua` is a helper factory module that defines three reusable Prefabs (`mermking_buff_trident`, `mermking_buff_crown`, `mermking_buff_pauldron`) for applying temporary buffs to targets when equipped by the Merm King. Each buff functions as a client-side-agnostic debuff entity that binds to a target and modifies outgoing damage, evasion, sanity aura, or damage absorption via external modifier lists. The buffs are automatically cleaned up on target death or detachment.

## Usage example
```lua
-- Apply the trident buff (5% damage increase)
local tridentBuff = Prefab("mermking_buff_trident")()
tridentBuff.components.debuff:Attach(target)

-- Later, detach the buff manually (optional; also triggers cleanup on death)
tridentBuff.components.debuff:Stop()
```

## Dependencies & tags
**Components used:** `debuff`, `transform`, `combat`, `sanity`, `health`, `attackdodger`  
**Tags:** Adds `CLASSIFIED` to each buff instance  
**Tuning keys used:** `TUNING.MERMKING_CROWNBUFF_DODGE_COOLDOWN`, `TUNING.MERMKING_CROWNBUFF_SANITYAURA_MOD`, `TUNING.MERMKING_PAULDRONBUFF_DEFENSEPERCENT_PLAYER`, `TUNING.MERMKING_PAULDRONBUFF_DEFENSEPERCENT`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None | — | — | No public properties exposed on the Prefab entities themselves. Buff behavior is driven by callbacks (`onattached`, `ondetached`) and attached components. |

## Main functions
The module itself exports only the result of three `MakeBuff(...)` calls (as `return` expressions), not callable functions. Each returned Prefab entity is a lightweight, non-persistent debuff object.

### `MakeBuff(name, data)`
*   **Description:** Internal helper function that constructs and returns a Prefab for a named gear buff. The buff entity is only created on the master simulation (`TheWorld.ismastersim`), otherwise it is immediately destroyed.
*   **Parameters:** 
    * `name` (string) — suffix used in the Prefab name (`mermking_buff_`..`name`)
    * `data` (table) — must contain optional `onattached` and `ondetached` callback functions, and optionally a `prefabs` array for asset dependencies.
*   **Returns:** Prefab — a ready-to-instantiate prefab factory.
*   **Error states:** If called on the client (`not TheWorld.ismastersim`), returns `nil`-like result as the prefab function returns early with `inst.Remove`.

## Events & listeners
- **Listens to:** `death` on the target entity — triggers `debuff:Stop()` to remove the buff when the target dies.
- **Pushes:** None — the component does not fire its own events, though attached logic (e.g., attackdodger) may push `attackdodged` on the target.

---
id: lunarplanttentacle
title: Lunarplanttentacle
description: Creates a short-lived lunar-aligned tentacle entity for combat in DST, handling health, combat stats, planar damage, and auto-despawn.
tags: [combat, boss, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e76cf690
system_scope: entity
---

# Lunarplanttentacle

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lunarplanttentacle` defines a prefab that spawns a temporary combat entity used during lunar events. It combines visual, physical, and gameplay properties: cylinder physics for collision, a custom state graph for AI behavior, and components for health, combat, planar damage, and loot dropping. The entity is intended to be short-lived (9-second lifetime) and is automatically removed after the `attack_pst` animation state completes or immediately if not in that state.

## Usage example
This prefab is not instantiated directly by modders; it is spawned internally by the `lunarplant_tentacle_weapon` item. Typical usage would involve triggering the weapon's use action:

```lua
-- Example of spawning logic (not modder-facing):
-- When lunarplant_tentacle_weapon is used, it calls:
-- SpawnPrefab("lunarplanttentacle", ...)

-- The resulting entity has:
-- inst.components.health
-- inst.components.combat
-- inst.components.planardamage
-- inst.components.lootdropper
```

## Dependencies & tags
**Components used:** `health`, `combat`, `planardamage`, `lootdropper`, `planarentity`  
**Tags:** Adds `soulless`, `lunar_aligned`, `notarget`

## Properties
No public properties

## Main functions
### `Despawn(inst)`
*   **Description:** Triggers the entity’s removal. If the entity is currently in the `attack_pst` state, it waits for that state to finish before removal; otherwise, it transitions to `attack_pst` first.
*   **Parameters:** `inst` (Entity) — the lunarplanttentacle instance.
*   **Returns:** Nothing.
*   **Error states:** None.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.
---
id: healingsalve
title: Healingsalve
description: Provides healing functionality and implements a debuff-based acid immunity buff system for player or entity use.
tags: [healing, inventory, debuff, item]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0ad41086
system_scope: inventory
---

# Healingsalve

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`healingsalve` is a consumable inventory item prefab that restores health via the `healer` component. Two variants exist: standard healing salve (`healingsalve`) and acid-formula healing salve (`healingsalve_acid`). The acid variant grants a temporary `acidrainimmune` tag and heals over time via a debuff (`healingsalve_acidbuff`). The debuff system handles attachment/detachment logic, expiration, and persistence across saves/load events.

## Usage example
```lua
-- Create and use standard healing salve
local salve = SpawnPrefab("healingsalve")
player.components.inventory:GiveItem(salve)
player.components.inventory:Equip(salve)
player:PushEvent("useitem", { item = salve })

-- The acid variant applies a temporary debuff
local acid_salve = SpawnPrefab("healingsalve_acid")
player.components.inventory:GiveItem(acid_salve)
player:PushEvent("useitem", { item = acid_salve })
```

## Dependencies & tags
**Components used:** `stackable`, `inspectable`, `inventoryitem`, `healer`, `debuff`, `talker`, `health`  
**Tags:** `healerbuffs` (only for `healingsalve_acid`), `acidrainimmune` (applied during debuff attachment), `CLASSIFIED` (for debuff entity)  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `health` | number | `TUNING.HEALING_MED` | Amount of health restored when used (same for both variants) |
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for inventory stacking |

## Main functions
### `OnHealFn(inst, target)`
*   **Description:** Callback function for `healingsalve_acid` that triggers the debuff application on the target after healing. Not used for the standard salve.
*   **Parameters:**  
    `inst` (Entity) — the `healingsalve_acid` instance.  
    `target` (Entity) — the entity receiving the heal.  
*   **Returns:** Nothing.  
*   **Error states:** No explicit error handling; assumes valid target with `AddDebuff` support.

## Events & listeners
- **Listens to:** `death` — cancels the debuff when the target dies to avoid invalid operations.  
- **Pushes:** None directly; the `debuff` component fires internal events such as `debuffattached`, `debuffdetached`, `debuffextended`, and `debuffexpired`.
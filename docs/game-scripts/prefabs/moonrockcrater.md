---
id: moonrockcrater
title: Moonrockcrater
description: Acts as a tradeable socketed moon rock that transforms into a specific colored Moon Eye when a matching gem is traded to it.
tags: [inventory, trading, environment, moon, socket]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: fd1b71be
system_scope: environment
---

# Moonrockcrater

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`moonrockcrater` is a Prefab representing a socketed Moon Rock in the game. It functions as a specialized item that accepts gem trades and converts itself into a corresponding colored Moon Eye (e.g., purple, blue, red, orange, yellow, or green) depending on the gem type. It integrates with the `inventoryitem`, `repairer`, and `trader` components, and is designed to be placed in a socketed state using `MakeInventoryPhysics` and the `inventoryitem` sink behavior.

## Usage example
```lua
local crater = SpawnPrefab("moonrockcrater")
crater.Transform:SetPosition(x, y, z)
crater:AddTag("socket")
-- Later, when a compatible gem is traded to it:
crater.components.trader:TradeItem(player, gem_item)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `repairer`, `trader`, `inspectable`, `transform`, `animstate`, `soundemitter`, `network`, `physics`, `hauntable_launch`
**Tags:** Adds `gemsocket`, `trader`, `give_dolongaction`; checks `gem`, `precious`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `repairmaterial` | string (enum key) | `MATERIALS.MOONROCK` | The material type used for repair operations. |
| `healthrepairvalue` | number | `TUNING.REPAIR_MOONROCK_CRATER_HEALTH` | Amount of health restored per repair action. |
| `workrepairvalue` | number | `TUNING.REPAIR_MOONROCK_CRATER_WORK` | Amount of workPoints restored per repair action. |

## Main functions
### `ItemTradeTest(inst, item)`
*   **Description:** Validates whether a given item can be traded to the Moon Rock Crater. Enforces strict matching: item must be a gem, not a precious gem, and must be named with "gem" as its last 3 characters.
*   **Parameters:**  
  `inst` (Entity) — the crater entity; unused in logic.  
  `item` (Entity or nil) — the candidate trading item.
*   **Returns:**  
  `true` — if the item is acceptable.  
  `false, "NOTGEM"` — if item is nil or lacks the `gem` tag / suffix.  
  `false, "WRONGGEM"` — if item is a precious gem (e.g., "dragongem").
*   **Error states:** Returns `false` with a reason string instead of raising errors.

### `OnGemGiven(inst, giver, item)`
*   **Description:** Handles successful trade: spawns the appropriate Moon Eye prefab (e.g., "purplemooneye"), removes the crater, and places the Moon Eye in the same inventory slot or world position.
*   **Parameters:**  
  `inst` (Entity) — the crater entity being consumed.  
  `giver` (Entity) — the trading entity (typically the player).  
  `item` (Entity) — the accepted gem used to trigger conversion.
*   **Returns:** Nothing.
*   **Error states:** If `container` is `nil`, falls back to world-space placement at the crater’s position.

## Events & listeners
None identified.
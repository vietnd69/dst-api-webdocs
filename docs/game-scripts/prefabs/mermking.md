---
id: mermking
title: Mermking
description: The Merm King is a sentient, trading NPC that coordinates merm guards, manages hunger and combat, and exchanges items based on player and skill-based conditions.
tags: [npc, combat, trader, ai, boss]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e8a412d5
system_scope: entity
---

# Mermking

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`mermking` is a complex, combat-capable NPC prefab that serves as a boss/milestone entity in DST. It integrates multiple systems: trading (`trader`), hunger-based behavior (`hunger`, `eater`, `foodaffinity`), combat coordination (`combat`, guard summoning), and dynamic animation overrides. It is the central unit of merm-related events, using skill tags from players to conditionally accept trades and dynamically adjust its hunger system. The Merm King coordinates a squad of `mermguard` entities during combat, which are summoned based on its health and guard availability.

## Usage example
```lua
-- Instantiating the Merm King
local mermking = Prefab("mermking", fn, assets, prefabs)
local inst = mermking:SpawnInstance()

-- Example: Trigger guard summoning manually (e.g. for testing)
if inst.components.combat.target ~= nil and inst.components.health:GetPercent() < 0.75 then
    inst.CallGuards(inst)
end

-- Example: Check equipped items
if inst.HasTrident(inst) then
    -- custom logic
end
```

## Dependencies & tags
**Components used:** `combat`, `eater`, `edible`, `hauntable`, `health`, `hunger`, `inventory`, `inventoryitem`, `lootdropper`, `skilltreeupdater`, `talker`, `timer`, `trader`, `weighable`  
**Tags added:** `character`, `merm`, `mermking`, `wet`, `companion`, `trader`, `alltrader`  
**Tags checked:** `merm`, `player`, `fish`, `oceanfish`, `DECOR`, `FX`, `INLIMBO`, `NOCLICK`, `locomotor`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `guards_available` | number | `4` | Remaining merm guards that can be summoned (capped at `4`). Decremented on summon, incremented on guard death/exit. |
| `guards` | table | `{}` | List of active `mermguard` entity references controlled by this king. |
| `trading_items` | table | Deep copy of `trading_items` | List of item trade configurations (prefab list, min/max counts, reset behavior). Consumed per trade and replenished as defined. |
| `itemtotrade` | entity or `nil` | `nil` | The item currently pending trade processing. |
| `tradegiver` | entity or `nil` | `nil` | The entity (player) offering the item for trade. |
| `lastpercent_hunger` | number | `0.25` | Cached hunger percentage for talk trigger detection and change tracking. |
| `call_guard_task` | task or `nil` | `nil` | Delayed task callback used to reset `guards_available` after guard summon. |
| `HasTrident`, `HasCrown`, `HasPauldron` | function | `local` | Convenience functions to check if `trident`, `ruinshat`, or `armormarble` is equipped in inventory. |

## Main functions
### `TradeItem(inst)`
*   **Description:** Executes the current trade: spawns reward items (from `trading_items`), optionally adds filler items, and drops gold for ocean fish. Removes the traded item, cycles the reward pool, and resets if empty or configured.
*   **Parameters:** None (operates on `inst.itemtotrade`, `inst.tradegiver`, and `inst.trading_items`).
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling; relies on valid item presence and correct `trading_items` state.

### `OnGetItemFromPlayer(inst, giver, item)`
*   **Description:** Handles a player offering an item. Acceptance is determined by `ShouldAcceptItem`. Food items may trigger eating or trading states. Equippable trinkets (`trident`, `ruinshat`, `armormarble`) trigger specific state changes and global events.
*   **Parameters:**  
    `giver` (entity) – Player or NPC offering the item. Must be a `merm` and have valid skill tags for gear items.  
    `item` (entity) – The item being offered.  
*   **Returns:** Nothing.

### `ShouldAcceptItem(inst, item, giver)`
*   **Description:** Determines whether to accept an offered item. Accepts if:  
    - `giver` is a `merm`,  
    - item is edible and the Merm King is not full, or item is a `fish`,  
    - item is `trident`/`ruinshat`/`armormarble` and the corresponding skill (`wurt_mermkingtrident`, etc.) is activated on `giver` and the item is not already equipped.  
*   **Parameters:** Same as `OnGetItemFromPlayer`.  
*   **Returns:** `true` or `false`.

### `OnHaunt(inst, haunter)`
*   **Description:** Called during haunt attempts. Refuses current trade (via `OnRefuseItem`) and permits haunting if `trader.enabled == true`; otherwise blocks haunt.
*   **Parameters:** `haunter` (entity) – Entity performing the haunt.  
*   **Returns:** `true` if haunt is allowed, `false` otherwise.

### `CallGuards(inst)`
*   **Description:** Summons up to `guards_available` `mermguard` entities in a ring around the Merm King, sets them to attack the current combat target, and removes the `companion` tag to disable friendly targeting. Updates sound and FX.
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `ReturnMerms(inst)`
*   **Description:** Re-adds `companion` tag, instructs guards to drop their targets, and marks guards for return. Used when target is lost.
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `RefreshHungerParameters(inst, feeder)`
*   **Description:** Dynamically adjusts max hunger and hunger burn rate based on `feeder`'s Wurt skill tags. Increases max hunger if skill provides multiplier (and current max is lower). Applies `wurt_skill` hunger burn modifier if relevant skill is active.
*   **Parameters:**  
    `feeder` (entity or `nil`) – Entity feeding the king or triggering hunger sync. If `nil`, resets hunger max to base and removes `wurt_skill` modifier.  
*   **Returns:** Nothing.

### `HasTrident(inst)`, `HasCrown(inst)`, `HasPauldron(inst)`
*   **Description:** Convenience methods checking inventory for equipped items.
*   **Parameters:** None (uses `inst` implicitly).  
*   **Returns:** `true` if item exists in inventory, otherwise `false`.

## Events & listeners
- **Listens to:**  
    `attacked` – Sets combat target and shares aggro with nearby `merm` non-player allies.  
    `hungerdelta` – Triggers hunger-based dialogue, controls health regen start/stop based on hunger state.  
    `healthdelta` – Summons guards when health drops below 75% during combat (if guards available).  
    `oncreated` – Initializes hunger, sets nearby inventory items to airborne.  
    `giveuptarget`, `droppedtarget` – Triggers guard recall via `ReturnMerms`.  
    `dropitem` – Handles item removal (trident/crown/pauldron), clears animation overrides, and emits world events.  
- **Pushes:**  
    `onmermkingtridentadded`, `onmermkingcrownadded`, `onmermkingpauldronadded`, `onmermkingtridentremoved`, `onmermkingcrownremoved`, `onmermkingpauldronremoved` – Global world events tied to gear states.  
    (No direct `PushEvent` calls from this component; it emits world events via `TheWorld:PushEvent`.)
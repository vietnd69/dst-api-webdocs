---
id: gears
title: Gears
description: A versatile consumable and repair item used for befriending clockwork creatures, restoring health/sanity/hunger, and repairing items in DST.
tags: [repair, consumable, clockwork, bait]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f8bca980
system_scope: inventory
---

# Gears

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `gears` prefab represents the in-game item "Gears", a stackable consumable item with multiple utility functions: it can be eaten for significant resource restoration, used to repair items via the `repairer` component, used to befriend and fully heal clockwork creatures (via the `useabletargeteditem` component), and also serves as bait for moles. It is included in the item pool and handles both server-side logic and client-side presentation.

## Usage example
```lua
local inst = SpawnPrefab("gears")
inst.components.stackable:SetStackSize(5) -- stack size up to 5
inst.components.edible:Apply(inst) -- consume one gear (if edible component logic applies)
-- For repair:
local repair_target = GetEntityWithRepairer()
if repair_target and repair_target.components.repairer:IsRepairable("gears") then
    repair_target.components.repairer:Repair(inst)
end
-- For clockwork creature befriend:
local target = GetClockworkCreature()
if target and inst.components.useabletargeteditem:CanUseOn(target) then
    inst.components.useabletargeteditem:UseOn(target)
end
```

## Dependencies & tags
**Components used:** `stackable`, `inspectable`, `inventoryitem`, `bait`, `edible`, `repairer`, `useabletargeteditem`, `snowmandecor`  
**Tags:** Adds `molebait`; no other tags added or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `pickupsound` | string | `"metal"` | Sound played when picking up the item. |
| `AnimState.bank` | string | `"gears"` | Animation bank for rendering. |
| `AnimState.build` | string | `"gears"` | Animation build name. |
| `AnimState.current_animation` | string | `"idle"` | Default animation played. |

## Main functions
### `UseableTargetedItem_ValidTarget(inst, target, doer)`
*   **Description:** Validates whether the gears can be used on a given target (i.e., if the target is a befriendable clockwork entity without a leader).
*   **Parameters:** `inst` (Entity), `target` (Entity), `doer` (Entity) — the gear item, the potential target entity, and the entity performing the use.
*   **Returns:** `boolean` — `true` if the target has tag `befriendable_clockwork`, is a valid follower entity, and currently has no leader (`GetLeader() == nil`).
*   **Error states:** Returns `false` if target lacks the tag, `replica.follower` is `nil`, or the target already has a leader.

### `OnUsedOnChess(inst, target, doer)`
*   **Description:** Executes the primary interaction when gears are used on a befriendable clockwork entity (e.g., Clockwork Chassis). Fully restores target health, wakes it up (if sleeper), and consumes one gear from the stack.
*   **Parameters:** `inst` (Entity) — the gears item, `target` (Entity) — the clockwork creature, `doer` (Entity) — the player using the item.
*   **Returns:** `boolean` — `true` if the interaction succeeded, `false` otherwise.
*   **Error states:** Returns `false` if `target:TryBefriendChess(doer)` fails.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls observed).
- **Pushes:** `onwakeup` (via `target.components.sleeper:WakeUp()`), though indirectly via target entity.

## Extra Notes
- The item is safe to use in client-only code (`TheWorld.ismastersim` guard ensures only server simulates core logic).
- Supports stacking (`stackable.maxsize = TUNING.STACK_SIZE_SMALLITEM`).
- The `snowmandecor` component is added, but its behavior is not detailed in this file.
- The `bait` component enables use as mole bait (likely via default bait behavior).
- The ` edible` component is configured with high-value nutrition/sanity data (`HEALING_HUGE`, `CALORIES_HUGE`, `SANITY_HUGE`) and type `FOODTYPE.GEARS`.
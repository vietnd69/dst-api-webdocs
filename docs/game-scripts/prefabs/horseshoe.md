---
id: horseshoe
title: Horseshoe
description: A wearable lucky item that grants luck bonuses to the player when equipped, with animated shine effects.
tags: [inventory, lucky, equipment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 918cc8e3
system_scope: inventory
---

# Horseshoe

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `horseshoe` prefab is a wearable inventory item that provides luck bonuses to the player. When equipped, it dynamically calculates its luck value based on whether the player is wearing the Yoth Knight equipment set and whether the Yoth event is active. It features a periodic shine animation and integrates with DST’s ECS via the `inventoryitem`, `stackable`, and `luckitem` components.

## Usage example
The horseshoe is automatically instantiated by the game when spawned (e.g., via crafting or world generation). Modders can reference it programmatically as:
```lua
local horseshoe = SpawnPrefab("horseshoe")
horseshoe:PushEvent("mine") -- Example interaction, though not specific to horseshoe logic
```

## Dependencies & tags
**Components used:** `inventoryitem`, `stackable`, `luckitem`, `inspectable`, `hauntable`
**Tags:** Adds `luckyitem`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `shinetask` | task | `nil` | Handle to the scheduled shine effect task; `nil` if no task is active. |

## Main functions
### `DoShine(inst)`
*   **Description:** Triggers a sparkle animation and schedules the next shine effect after a random delay (`4–9` seconds), unless the entity is asleep.
*   **Parameters:** `inst` (Entity instance) — the horseshoe entity.
*   **Returns:** Nothing.

### `OnEntityWake(inst)`
*   **Description:** Ensures the shine task restarts if the horseshoe wakes from sleep and no shine task is pending.
*   **Parameters:** `inst` (Entity instance) — the horseshoe entity.
*   **Returns:** Nothing.

### `GetLuckFn(inst, owner)`
*   **Description:** Calculates the luck bonus granted by the horseshoe, scaling based on set bonuses and active events.
*   **Parameters:**  
    `inst` (Entity instance) — the horseshoe entity (unused in logic).  
    `owner` (Entity or `nil`) — the entity wearing the horseshoe; used to check for Yoth Knight set bonus.  
*   **Returns:** number — total luck value (e.g., `TUNING.HORSESHOE_LUCK` × multiplier).  
*   **Error states:** Returns `nil` if `TUNING` values are undefined, though this is unlikely in standard builds.

## Events & listeners
- **Listens to:** `OnEntityWake` — used as an event callback to restart shine effects when the entity awakens.
- **Pushes:** None directly; shine effects are handled via task scheduling and animation transitions.
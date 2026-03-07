---
id: mandrake_inactive
title: Mandrake Inactive
description: Represents an inactive mandrake plant prefab that becomes edible and triggers sleep effects when eaten raw or cooked.
tags: [consumable, sleep, plant, prefabs]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1790c1b3
system_scope: entity
---

# Mandrake Inactive

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`mandrake_inactive` defines the prefab data for both the raw and cooked mandrake plants. It establishes core inventory behavior, edibility, and sleep-inducing effects on consumption. The prefab uses shared logic via `commonfn`, with specialized behavior for raw and cooked states in `rawfn` and `cookedfn` respectively. It integrates with the `edible`, `inventoryitem`, `cookable`, `stackable`, `freezable`, `pinnable`, `fossilizable`, `rider`, `sleeper`, and `grogginess` components to determine which entities are affected when consumed.

## Usage example
```lua
-- Example: Spawning and interacting with a raw mandrake
local inst = SpawnPrefab("mandrake")
inst.Transform:SetPosition(x, y, z)
inst:AddComponent("inventoryitem")  -- ensure inventory integration if added manually
inst.components.edible.healthvalue -- returns TUNING.HEALING_HUGE for raw mandrake
```

## Dependencies & tags
**Components used:** `edible`, `inventoryitem`, `cookable`, `stackable`, `tradable`, `freezable`, `pinnable`, `fossilizable`, `rider`, `sleeper`, `grogginess`, `inspectable`  
**Tags added:** `cookable` (only for raw mandrake), `meditem`, `smallitem`, `VEGGIE` (via FOODTYPE)  
**Tags checked (for sleep target filtering):** `playerghost`, `FX`, `DECOR`, `INLIMBO`, `sleeper`, `player`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `anim` | string | `"object"` (raw), `"cooked"` (cooked) | Animation state bank used in `AnimState`. |
| `scrapbook_anim` | string | Same as `anim` | Used for scrapbook rendering. |
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size. |
| `foodtype` | FOODTYPE enum | `FOODTYPE.VEGGIE` | Type of food, used for dietary logic. |
| `healthvalue` | number | `TUNING.HEALING_HUGE` (raw), `TUNING.HEALING_SUPERHUGE` (cooked) | Health restored on consumption. |
| `hungervalue` | number | `TUNING.CALORIES_HUGE` (raw), `TUNING.CALORIES_SUPERHUGE` (cooked) | Hunger restored on consumption. |
| `product` | string | `"cookedmandrake"` | Prefab name produced when cooked. |

## Main functions
### `commonfn(anim, cookable)`
*   **Description:** Shared factory function that initializes core properties and components for both raw and cooked mandrake prefabs. Sets up transform, animstate, network sync, physics, inventory properties, and conditionally adds cookable component.
*   **Parameters:** `anim` (string) - animation name to play; `cookable` (boolean) - whether to add cookable component.
*   **Returns:** `inst` (Entity) — The initialized entity instance.
*   **Error states:** If executed on a non-master simulation (client), returns early after setting up non-networked properties.

### `rawfn()`
*   **Description:** Factory function for the raw mandrake. Configures high healing/hunger restore and sets up the `oneaten_raw` handler to trigger area sleep.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) — The raw mandrake entity.
*   **Error states:** None.

### `cookedfn()`
*   **Description:** Factory function for the cooked mandrake. Configures super-high healing/hunger restore and sets up the `oneaten_cooked` handler.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) — The cooked mandrake entity.
*   **Error states:** None.

### `doareasleep(inst, range, time)`
*   **Description:** Finds and affects entities within a circular area around the mandrake with sleep/knockout logic. Filters out ghost, decor, floating FX, limbo, frozen, pinned, and fossilized entities.
*   **Parameters:** `inst` (Entity) — source of the effect; `range` (number) — radius of effect; `time` (number) — duration of sleep/knockout.
*   **Returns:** Nothing.
*   **Error states:** If a sleeper's mount exists, it receives a `ridersleep` event; players receive a `yawn` event. Entities without sleeper/grogginess components receive a generic `knockedout` event.

### `oneaten_raw(inst, eater)`
*   **Description:** Callback triggered when raw mandrake is eaten. Plays a sound and schedules area sleep effect.
*   **Parameters:** `inst` (Entity) — the mandrake; `eater` (Entity) — the consumer.
*   **Returns:** Nothing.
*   **Error states:** None.

### `oneaten_cooked(inst, eater)`
*   **Description:** Callback triggered when cooked mandrake is eaten. Plays a sound and schedules area sleep effect with a larger range.
*   **Parameters:** `inst` (Entity) — the mandrake; `eater` (Entity) — the consumer.
*   **Returns:** Nothing.
*   **Error states:** None.

### `oncooked(inst, cooker, chef)`
*   **Description:** Callback triggered when raw mandrake is cooked. Plays a sound and schedules area sleep effect for the cook.
*   **Parameters:** `inst` (Entity) — the raw mandrake; `cooker` (Entity) — cooking device; `chef` (Entity) — the cooking player.
*   **Returns:** Nothing.
*   **Error states:** None.

## Events & listeners
- **Listens to:** None.
- **Pushes:** `yawn` (to players), `ridersleep` (to mounts), `knockedout` (generic fallback).
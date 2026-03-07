---
id: halloweenpotion_moon
title: Halloweenpotion Moon
description: Represents a Halloween-themed moon potion item that spawns moon puff effects on use and interacts with fire sources.
tags: [item, halloween, potion, fx]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7e4cb634
system_scope: inventory
---

# Halloweenpotion Moon

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`halloweenpotion_moon` is a consumable inventory item prefab used as a special potion during Halloween events. It is designed to spawn visual FX (`halloween_moonpuff`) when used on targets or placed in campfires. It integrates with the `halloweenpotionmoon` component to define custom use behavior and with the `fuel` component to react when placed in fire. The prefab is non-networked on clients and fully initialized only on the master sim.

## Usage example
```lua
-- Inside a prefab or scenario context:
local inst = SpawnPrefab("halloweenpotion_moon")
if inst ~= nil then
    inst.components.halloweenpotionmoon:SetOnUseFn(my_custom_onuse)
    inst.components.fuel.fuelvalue = TUNING.MED_FUEL
end
```

## Dependencies & tags
**Components used:** `halloweenpotionmoon`, `inspectable`, `inventoryitem`, `stackable`, `fuel`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fuelvalue` | number | `TUNING.MED_FUEL` | Fuel value assigned when the potion is placed in a campfire. |
| `ontaken` | function | `onputinfirefn` | Callback executed when the item is placed in a fire source. |

## Main functions
### `SetOnUseFn(fn)`
*   **Description:** Sets the function to be invoked when the potion is used (e.g., right-clicked on a target or environment). This function is provided by the `halloweenpotionmoon` component.
*   **Parameters:** `fn` (function) — a callback with signature `(inst, doer, target, success, transformed_inst, container)`.
*   **Returns:** Nothing.
*   **Error states:** No explicit validation—passing `nil` may result in no action on use.

## Events & listeners
- **Listens to:** `animqueueover` — triggers `PlayRandomIdle` to replay a random idle animation when the current animation completes.
- **Pushes:** None directly; relies on `doer:PushEvent("on_halloweenmoonpotion_failed")` via `onusefn` when use fails.
---
id: carnivaldecor_lamp
title: Carnivaldecor Lamp
description: A reusable decorative light fixture that can be activated via manual interaction or token insertion, emitting light and playing animations while supporting save/load, hammering, and trading.
tags: [decoration, light, trading, activatable, environmental]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ddf21e87
system_scope: environment
---

# Carnivaldecor Lamp

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `carnivaldecor_lamp` is a prefabricated structure that functions as a decorative lamp in the game world. It supports three activation methods: manual activation (via quick action), inserting a `carnival_gametoken`, and natural toggling via its `activatable` and `trader` components. When active, it emits light, plays ON animations, and automatically turns off after a configurable duration. It integrates with `workable` (hammered), `lootdropper`, `carnivaldecor`, and save/load systems, making it suitable for event-based decorations in the Summer Carnival minigame.

## Usage example
```lua
local lamp = SpawnPrefab("carnivaldecor_lamp")
lamp.Transform:SetPosition(entity.Transform:GetWorldPosition())
lamp:DoTaskInTime(2, function()
    -- Manually trigger activation
    lamp.components.activatable:OnActivate(lamp)
end)
```

## Dependencies & tags
**Components used:** `inspectable`, `lootdropper`, `carnivaldecor`, `workable`, `trader`, `activatable`, `burnable`, `propagator`, `fueled`, `soundemitter`, `light`, `animstate`, `transform`, `network`  
**Tags added:** `carnivaldecor`, `carnivallamp`, `structure`, `cattoyairborne`  
**Tags checked:** `inactive` (in `AbleToAcceptTest`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `shape` | number | `math.random(6)` | Random integer (1–6) indicating the lamp's visual variant. Used in animation selection (e.g., `"idle1_on"`). |
| `turnofftask` | Task? | `nil` | Active task scheduled to turn off the lamp after a duration. |

## Main functions
### `EnableLight(inst, duration)`
* **Description:** Turns the lamp ON, starts a delayed task to turn it OFF after `duration` seconds, and resets any existing OFF task.
* **Parameters:** `duration` (number) — time in seconds before the lamp automatically turns off.
* **Returns:** Nothing.

### `LightOn(inst)`
* **Description:** Enables the lamp's light source, plays the "idle#_on" animation, and sets `activatable.inactive` to `false`.
* **Parameters:** `inst` — the entity instance.
* **Returns:** Nothing.

### `LightOff(inst)`
* **Description:** Disables the lamp's light source, plays the "idle#_off" animation, sets `activatable.inactive` to `true`, and cancels the OFF task if present.
* **Parameters:** `inst` — the entity instance.
* **Returns:** Nothing.

### `OnActivate(inst, doer)`
* **Description:** Handler for manual activation (e.g., via quick action). Calls `EnableLight` with `TUNING.CARNIVALDECOR_LAMP_ACTIVATE_TIME`.
* **Parameters:** `doer` (Entity) — the entity performing the activation.
* **Returns:** `true`

### `OnAcceptItem(inst, doer)`
* **Description:** Handler for `trader.onaccept` — called when a valid item is accepted (e.g., a `carnival_gametoken`). Calls `EnableLight` with `TUNING.CARNIVALDECOR_LAMP_TOKEN_TIME`.
* **Parameters:** `doer` (Entity) — the entity inserting the item.
* **Returns:** `true`

### `AbleToAcceptTest(inst, item, giver)`
* **Description:** Predicate function used by `trader` to determine whether to accept an item.
* **Parameters:**
  - `item` (Entity) — the item to evaluate.
  - `giver` (Entity) — the source entity.
* **Returns:** `true` if `item.prefab == "carnival_gametoken"`; otherwise returns `false, "CARNIVALGAME_INVALID_ITEM"`.
* **Error states:** Does *not* currently enforce the `inactive` tag check (line is commented out).

### `onhammered(inst, worker)`
* **Description:** Callback for `workable` when the lamp is hammered. Spawns a small collapse FX, drops loot, and removes the lamp entity.
* **Parameters:** `worker` (Entity) — the entity performing the hammering.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onbuilt` — calls `onbuilt(inst)` to play the placement animation and sound.
- **Pushes:** None directly. Relies on underlying components (`lootdropper`, `workable`) for standard event propagation.
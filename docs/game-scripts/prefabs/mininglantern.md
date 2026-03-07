---
id: mininglantern
title: Mininglantern
description: Manages the behavior, lighting, fuel consumption, and equip/unequip interactions for the Mining Lantern item.
tags: [inventory, equipment, lighting, fuel]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2ccf1c3f
system_scope: inventory
---

# Mininglantern

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `mininglantern` prefab implements the gameplay and visual behavior of the Mining Lantern, a portable light source that consumes fuel. It integrates with the `fueled`, `equippable`, `machine`, and `inventoryitem` components to manage lighting, fuel consumption, sound playback, and equipping/unequipping logic. When turned on, it spawns a child `lanternlight` prefab for the actual light effect, which tracks with the owner while equipped.

## Usage example
```lua
local inst = SpawnPrefab("lantern")
inst.components.fueled:InitializeFuelLevel(600) -- 10 minutes at standard rate
inst.components.fueled.accepting = true
inst.components.machine.turnonfn(inst) -- turns the lantern on
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `equippable`, `fueled`, `machine`, `sound emitter`, `animstate`, `transform`, `network`, `hauntable`
**Tags:** Adds `light` (on the lantern prefab), `FX` (on the lanternlight child prefab)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_light` | Entity or `nil` | `nil` | Reference to the spawned `lanternlight` entity (only when on and not removed). |
| `_soundtask` | Task or `nil` | `nil` | Delayed sound task for turn-off sound to avoid clipping. |
| `_owner` | Entity or `nil` | `nil` | Cached reference to the current owner for equip/unequip tracking. |

## Main functions
### `turnon(inst)`
* **Description:** Enables the lantern. Starts fuel consumption, spawns the light entity (if not present), updates animation and skin, plays the on sound, and notifies listeners. Does nothing if fuel is depleted.
* **Parameters:** `inst` (Entity) — the lantern instance.
* **Returns:** Nothing.
* **Error states:** No effect if `fueled:IsEmpty()` returns true.

### `turnoff(inst)`
* **Description:** Disables the lantern. Stops fuel consumption, removes the light entity, resets animation, hides overlay on owner, updates skin image, and fires `lantern_off` event.
* **Parameters:** `inst` (Entity) — the lantern instance.
* **Returns:** Nothing.

### `fuelupdate(inst)`
* **Description:** Dynamically adjusts the light intensity and radius based on current fuel percentage (0% → dimmer, smaller; 100% → brighter, larger).
* **Parameters:** `inst` (Entity) — the lantern instance.
* **Returns:** Nothing.
* **Error states:** No effect if `_light` is `nil`.

### `onequip(inst, owner)`
* **Description:** Handles equip logic. Sets up skin overrides, adjusts owner's anim state (shows ARM_carry, hides ARM_normal), shows lantern overlay if lit, and auto-turns on if fuel remains.
* **Parameters:** `inst` (Entity), `owner` (Entity) — the entity equipping the lantern.
* **Returns:** Nothing.

### `onunequip(inst, owner)`
* **Description:** Handles unequip logic. Clears animation overrides, hides lantern overlay, and if lantern was on, begins tracking the owner to prevent light flicker if re-equipped quickly.
* **Parameters:** `inst` (Entity), `owner` (Entity) — the entity unequipping the lantern.
* **Returns:** Nothing.

### `nofuel(inst)`
* **Description:** Called when fuel is fully depleted. Turns off the lantern and notifies the owner via `torchranout` event if equipped.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `ontakefuel(inst)`
* **Description:** Called when fuel is added. If currently equipped, automatically turns the lantern on.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `"equip"` on owner — triggers `inst._onownerequip` to turn off lantern if another item (hand or heavy body armor) is equipped.
  - `"onremove"` on `_light` — clears `_light` reference via `onremovelight`.
- **Pushes:**
  - `"lantern_on"` — fired when lantern transitions to on state.
  - `"lantern_off"` — fired when lantern transitions to off state.
  - `"torchranout"` — fired on owner when lantern runs out of fuel while equipped.
  - `"equipskinneditem"` / `"unequipskinneditem"` — fired on owner during equip/unequip of skinned variants.
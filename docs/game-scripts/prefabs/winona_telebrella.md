---
id: winona_telebrella
title: Winona Telebrella
description: A powered inventory item that enables long-range teleportation when charged, interacts with engineering circuits, and supports Winona skill enhancements.
tags: [inventory, teleport, engineering, power]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7e803b3a
system_scope: inventory
---

# Winona Telebrella

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `winona_telebrella` is a Powered Inventory Item that functions as a remote teleportation device for Winona. It consumes fuel to teleport the wielder across the map and integrates with the engineering circuit system to receive automatic charging from connected batteries. The item reacts to the `winona_wagstaff_2` and `winona_gadget_recharge` skill tree upgrades. It manages dynamic visual effects (LED state, swapping animations) and supports save/load for battery charge and skill state.

It interacts primarily with:
- `fueled`: To manage fuel consumption and charging
- `circuitnode`: To connect to engineering batteries and receive charge
- `remoteteleporter`: To handle the teleport sequence and fuel deduction
- `equippable`: To manage equip/unequip behavior and weapon slot attachment
- `inspectable`: To report status (CHARGING/CHARGED/OFF/MISSINGSKILL)
- `waterproofer`, `floater`, `inventoryitem`, `powerload`, `highlightchild`, `colouradder`, `updatelooper`

## Usage example
```lua
local inst = SpawnPrefab("winona_telebrella")
inst.components.inventoryitem:SetOnDroppedFn(function() print("Dropped") end)
inst:AddBatteryPower(5) -- Adds 5 seconds of battery charge
inst.components.fueled:DoDelta(-10) -- Manually consume fuel
```

## Dependencies & tags
**Components used:** `fueled`, `circuitnode`, `remoteteleporter`, `equippable`, `inventoryitem`, `inspectable`, `waterproofer`, `floater`, `powerload`, `highlightchild`, `colouradder`, `updatelooper`, `tradable`, `skilltreeupdater` (external), `health` (external), `inventory` (external)

**Tags:** Adds `nopunch`, `umbrella`, `metal`, `engineering`, `engineeringbatterypowered`, `waterproofer`, `FX` (swap effects only). Checks `handyperson`, `playerghost`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_powertask` | Task or nil | `nil` | Task handle for active charging; canceled when fully charged or disconnected. |
| `_quickcharge` | boolean | `false` | Set to `true` when dropped by a character with the `winona_gadget_recharge` skill active. |
| `_landed_owner` | Entity or nil | `nil` | Temporary reference to the owner when dropped, used for indirect circuit use. |
| `_wired` | boolean or nil | `nil` | Tracks whether wire visual is currently active. |
| `_inittask` | Task | Task | Deferred initialization task to ensure circuit connection occurs after world load. |
| `_flash` | number or nil | `nil` | Intensity state for spark effect during wire connection/disconnection. |

## Main functions
### `AddBatteryPower(power)`
*   **Description:** Adds battery power (in seconds) and starts/stops charging as needed. Automatically handles transitions between charging and charged states.
*   **Parameters:** `power` (number) - duration of charge to add in seconds.
*   **Returns:** Nothing.
*   **Error states:** If already full, stops charging immediately.

### `SetCharging(inst, powered, duration)`
*   **Description:** Starts or stops the charging process. When `powered` is true, schedules a task to charge for `duration` seconds and configures load/animation; when false, cancels tasks and resets state.
*   **Parameters:** `powered` (boolean) - whether charging is active; `duration` (number) - time to complete charging (only used when turning on).
*   **Returns:** Nothing.

### `GetStatus(inst, viewer)`
*   **Description:** Returns a human-readable status string: `CHARGING`, `CHARGED`, `OFF`, `MISSINGSKILL`, or `nil`.
*   **Parameters:** `viewer` (Entity, optional) - entity checking the status.
*   **Returns:** (string or nil) Status description. Returns `"MISSINGSKILL"` if viewer lacks `winona_wagstaff_2` skill and has `handyperson` tag.

### `DoWireSparks(inst)`
*   **Description:** Triggers a spark sound effect and spawns wire sparks animation, then schedules a fade-out visual effect via `updatelooper`.
*   **Parameters:** `inst` (Entity) — the telebrella instance.
*   **Returns:** Nothing.

### `SetLedEnabled(inst, enabled)`
*   **Description:** Controls LED and canopy lighting visuals (bloom, override light levels) for the main item.
*   **Parameters:** `enabled` (boolean) — whether the LED and associated lighting should be active.
*   **Returns:** Nothing.

### `SetFxOwner(inst, owner)`
*   **Description:** Spawns and attaches swap effects (`winona_telebrella_swap_fx`) to the owner, follows their `swap_object` symbol, and syncs colour/lighting. Also handles skill-based LED state.
*   **Parameters:** `owner` (Entity or nil) — entity to attach to; `nil` removes effects.
*   **Returns:** Nothing.

### `OnEquip(inst, owner)` / `OnUnequip(inst, owner)`
*   **Description:** Called when equipped/unequipped. Updates animation (ARM_carry/ARM_normal), shadow size, spawns FX, and starts/stops fuel consumption.
*   **Parameters:** `inst`, `owner` — standard instance and owner entities.
*   **Returns:** Nothing.

### `OnDropped(inst)` / `OnLanded(inst)`
*   **Description:** `OnDropped`: Records dropped owner (for indirect circuit use), disconnects circuit if not landed, reconnects to batteries if landed. `OnLanded`: Connects to batteries if not held and not already connected.
*   **Parameters:** `inst` — the telebrella instance.
*   **Returns:** Nothing.

### `OnConnectCircuit(inst)` / `OnDisconnectCircuit(inst)`
*   **Description:** Manages wire visual state (`_wired`) and triggers circuit change notification. Sparks occur on connect/disconnect.
*   **Parameters:** `inst` — the telebrella instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `engineeringcircuitchanged` — triggers `OnCircuitChanged` to notify connected nodes.
- **Pushes:** No events directly, but `remoteteleporter` events (`onteleported`, `onstartteleport`, `onstopteleport`) are hooked up via component callbacks.

> Note: `inst._onskillrefresh` is a local callback used with `onactivateskill_server` / `ondeactivateskill_server` events on the owner to refresh LED state via `RefreshAttunedSkills`.
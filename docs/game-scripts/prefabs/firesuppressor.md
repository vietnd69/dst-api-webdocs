---
id: firesuppressor
title: Firesuppressor
description: Manages fire suppression operations, including fire detection, extinguishing, and fuel-dependent activation with emergency mode handling.
tags: [fire, suppression, protection, machine]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 22d1632b
system_scope: environment
---

# Firesuppressor

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`firesuppressor` is a prefabricated structure component that detects fires within its range and extinguishes them using water projectiles and localized cooling. It integrates with multiple components to provide fire protection: `firedetector` scans for fires and triggers emergency mode when danger accumulates; `wateryprotection` applies cooling and extinguishing effects to nearby entities; `fueled` manages fuel consumption to power operation; `machine` handles on/off states; and `workable` allowshammering for repair or salvage. The component dynamically adjusts warning light color based on emergency status and updates fuel meter visuals during use.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("firesuppressor")
-- All initialization is handled internally by the prefab constructor.
-- Usage occurs through interaction (machine toggle), repair (hammering), or fuel insertion.
```

## Dependencies & tags
**Components used:** `burnable`, `complexprojectile`, `deployhelper`, `firedetector`, `fueled`, `inspectable`, `lootdropper`, `machine`, `placer`, `wateryprotection`, `workable`  
**Tags added:** `hasemergencymode`, `structure`  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `on` | boolean | `true` (on creation) | Whether the suppressor is currently active and consuming fuel. |
| `_warninglevel` | string | `"off"` | Current warning light state: `"off"`, `"green"`, `"yellow"`, or `"red"`. |
| `_fuellevel` | number | `10` | Current fuel section index (1–10). |
| `_glow` | entity | `nil` | Reference to the glow overlay entity. |
| `_fade` | number | `0` | Fade opacity for the glow entity. |
| `_task` | task | `nil` | Timer task for glow fading transitions. |

## Main functions
### `LaunchProjectile(targetpos)`
*   **Description:** Spawns a snowball projectile and launches it toward a target position. Adjusts horizontal speed based on distance using linear easing and applies gravity.
*   **Parameters:** `targetpos` (Vector3) - destination position in world space.
*   **Returns:** Nothing.
*   **Error states:** Projectile fails to launch if `SpawnPrefab("snowball")` returns `nil`.

### `SpreadProtectionAtPoint(inst, firePos)`
*   **Description:** Calls `SpreadProtectionAtPoint` on the `wateryprotection` component for the given fire position. Used as a delayed action during sleep.
*   **Parameters:** `inst` (entity) - the firesuppressor instance. `firePos` (Vector3) - position of the detected fire.
*   **Returns:** Nothing.

### `OnFindFire(inst, firePos)`
*   **Description:** Handles detection of a fire. If the entity is asleep, schedules protection after a delay; otherwise, immediately pushes `"putoutfire"` event.
*   **Parameters:** `inst` (entity) - the firesuppressor instance. `firePos` (Vector3) - position of the fire.
*   **Returns:** Nothing.

### `SetWarningLevelLight(inst, level)`
*   **Description:** Updates the warning light color and glow animation based on emergency level. `nil` = off; `<=0` = green; `<=EMERGENCY_BURNT_NUMBER` = yellow; else = red.
*   **Parameters:** `inst` (entity) - the firesuppressor instance. `level` (number or nil) - emergency level to display.
*   **Returns:** Nothing.

### `TurnOn(inst, instant)`
*   **Description:** Activates the machine, starts fuel consumption, and activates the fire detector (normal or emergency mode). Updates state graph and warning lights.
*   **Parameters:** `inst` (entity) - the firesuppressor instance. `instant` (boolean) - whether to skip animation transitions.
*   **Returns:** Nothing.

### `TurnOff(inst, instant)`
*   **Description:** Deactivates the machine, stops fuel consumption, and deactivates the fire detector. Sets warning lights to off and transitions to idle state.
*   **Parameters:** `inst` (entity) - the firesuppressor instance. `instant` (boolean) - whether to skip animation transitions.
*   **Returns:** Nothing.

### `OnBeginEmergency(inst, level)`
*   **Description:** Called when emergency level is reached. Sets warning light to red and ensures machine is turned on.
*   **Parameters:** `inst` (entity) - the firesuppressor instance. `level` (number) - current emergency level.
*   **Returns:** Nothing.

### `OnEndEmergency(inst, level)`
*   **Description:** Called when emergency condition ends. Ensures machine is turned off.
*   **Parameters:** `inst` (entity) - the firesuppressor instance. `level` (number) - previous emergency level.
*   **Returns:** Nothing.

### `OnFuelEmpty(inst)`
*   **Description:** Turns off the machine when fuel is depleted.
*   **Parameters:** `inst` (entity) - the firesuppressor instance.
*   **Returns:** Nothing.

### `OnAddFuel(inst)`
*   **Description:** Handles fuel addition: plays sound and automatically turns on if currently off.
*   **Parameters:** `inst` (entity) - the firesuppressor instance.
*   **Returns:** Nothing.

### `OnFuelSectionChange(new, old, inst)`
*   **Description:** Updates fuel meter visuals when fuel level crosses a section boundary.
*   **Parameters:** `new` (number) - new fuel section index. `old` (number) - previous fuel section index. `inst` (entity) - the firesuppressor instance.
*   **Returns:** Nothing.

### `CanInteract(inst)`
*   **Description:** Returns whether the machine can be interacted with (e.g., toggled). Always `true` when fuel is present.
*   **Parameters:** `inst` (entity) - the firesuppressor instance.
*   **Returns:** boolean — `true` if fuel is not empty.

### `onhammered(inst, worker)`
*   **Description:** Extinguishes fire if burning, drops loot, spawns collapse FX, and removes the entity.
*   **Parameters:** `inst` (entity) - the firesuppressor instance. `worker` (entity) - hammering entity.
*   **Returns:** Nothing.

### `onhit(inst, worker)`
*   **Description:** Triggers hit animation if not burnt or busy.
*   **Parameters:** `inst` (entity) - the firesuppressor instance. `worker` (entity) - hitting entity.
*   **Returns:** Nothing.

### `getstatus(inst, viewer)`
*   **Description:** Returns status string for inspection UI. Returns `"ON"` or `"LOWFUEL"` (no `"OFF"` status reported).
*   **Parameters:** `inst` (entity) - the firesuppressor instance. `viewer` (entity) - inspecting entity (unused).
*   **Returns:** string — `"ON"` or `"LOWFUEL"`.

### `OnEntitySleep(inst)`
*   **Description:** Stops idle sound when the entity goes to sleep.
*   **Parameters:** `inst` (entity) - the firesuppressor instance.
*   **Returns:** Nothing.

### `OnRemoveEntity(inst)`
*   **Description:** Removes the glow entity when the firesuppressor is destroyed.
*   **Parameters:** `inst` (entity) - the firesuppressor instance.
*   **Returns:** Nothing.

### `OnEnableHelper(inst, enabled)`
*   **Description:** Creates or destroys a helper placer entity for build preview.
*   **Parameters:** `inst` (entity) - the firesuppressor instance. `enabled` (boolean) - whether to enable helper.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onbuilt` — triggers `onbuilt` callback for sound. `onisondirty` — initiates glow fade task when state changes.  
- **Pushes:** `putoutfire` — sent when a fire is found and not sleeping; carries `{ firePos = firePos }`. `machineturnedon` / `machineturnedoff` — fired by `machine` component. `onextinguish` — fires via `burnable` component.
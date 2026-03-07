---
id: temperatureoverrider
title: Temperatureoverrider
description: Provides a temperature override that takes effect within a specified radius around the entity, used for localized environmental heating or cooling.
tags: [environment, temperature, override, network, world]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 02b91be7
system_scope: environment
---

# Temperatureoverrider

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`TemperatureOverrider` is a world-space component that allows an entity to define a localized temperature effect within a circular radius. When enabled, it registers itself globally and overrides the base world temperature for any location (`x, z`) within its radius. It uses networked float variables (`_activeradius` and `_temperature`) for client-server synchronization. When no active overrider is within range, it falls back to `fumarolelocaltemperature:GetTemperatureAtXZ()` or the global `TheWorld.state.temperature`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("temperatureoverrider")
inst.components.temperatureoverrider:SetRadius(10)
inst.components.temperatureoverrider:SetTemperature(50)
inst.components.temperatureoverrider:Enable()
```

## Dependencies & tags
**Components used:** `transform`, `temperatureoverrider` (self), `fumarolelocaltemperature` (global `TheWorld.net.components.fumarolelocaltemperature`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `radius` | number | `16` (server-side only, initial) | Desired active radius in units. Only affects internal logic; final active radius is stored in `_activeradius`. |
| `enabled` | boolean | `false` (server-side only, initial) | Whether the overrider is active. Must be set via `Enable()` or `Disable()` to take effect. |

## Main functions
### `SetTemperature(temperature)`
*   **Description:** Sets the temperature value (in arbitrary units) that will be used within the override radius. Only valid on the master simulation (server).
*   **Parameters:** `temperature` (number) - the temperature to apply inside the radius.
*   **Returns:** Nothing.
*   **Error states:** Has no effect on non-master clients.

### `SetRadius(radius)`
*   **Description:** Updates the *intended* radius. The actual active radius is managed internally via `_activeradius` and is synced over the network.
*   **Parameters:** `radius` (number) - new radius in units.
*   **Returns:** Nothing.
*   **Error states:** Radius is not applied until `Enable()` is called or after `_activeradiusdirty` is triggered. Changes are local to the master simulation.

### `Enable()`
*   **Description:** Activates the temperature override by setting `_activeradius` to `radius`, registering the entity in the global `_overriders` set, and listening for changes via network dirty events.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No effect if already enabled or not on the master simulation.

### `Disable()`
*   **Description:** Deactivates the temperature override by setting `_activeradius` to `0`, unregistering from `_overriders`, and stopping influence on global temperature queries.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No effect if already disabled or not on the master simulation.

### `GetActiveRadius()`
*   **Description:** Returns the currently active radius value (the value stored in the networked `_activeradius` float).
*   **Parameters:** None.
*   **Returns:** `number` - the current override radius (may be `0` if disabled).

### `GetTemperature()`
*   **Description:** Returns the temperature value currently stored in the networked `_temperature` float.
*   **Parameters:** None.
*   **Returns:** `number` - the current override temperature.

### `OnRemoveEntity()`
*   **Description:** Cleanup hook called when the entity is removed. Ensures the entity is unregistered from `_overriders` if it had a non-zero active radius.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `_activeradiusdirty` - triggers `OnActiveRadiusDirty()` when `_activeradius` is updated over the network.
- **Pushes:** None.

---
id: temperatureoverrider
title: Temperatureoverrider
description: Registers and manages a spatially active temperature override source for entities in the world, allowing local temperature to be customized per entity within a specified radius.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 02b91be7
---

# Temperatureoverrider

## Overview  
This component enables an entity to define a localized region around itself where the ambient temperature is overridden to a custom value. It maintains a global registry of active overrider instances and provides the `GetTemperatureAtXZ` and `GetLocalTemperature` functions to resolve the effective temperature at any point in the world, prioritizing proximity-based overrides before falling back to global or fumarole-based defaults.

## Dependencies & Tags  
- Relies on:  
  - `inst.Transform` (for world position queries via `GetDistanceSqToPoint`)  
  - `inst.GUID` (used for network variable binding)  
- Network variables created:  
  - `_activeradius` (float, networked, triggers `_activeradiusdirty` event)  
  - `_temperature` (float, networked)  
- No specific tags added/removed.

## Properties  
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity the component is attached to. |
| `ismastersim` | `boolean` | `TheWorld.ismastersim` | Indicates whether this component instance runs in master simulation (server). |
| `_activeradius` | `net_float` | `0` (initial), synced via network | Networked variable for the current active radius of the temperature override. |
| `_temperature` | `net_float` | `25` (on server init) | Networked variable storing the custom temperature to apply inside the radius. |
| `radius` | `number` | `16` (server-only, non-networked) | Internal cached radius value used on the server to control active radius when enabled. |
| `enabled` | `boolean` | `false` (server-only) | Controls whether this overrider contributes to temperature calculations. |

## Main Functions  
### `TemperatureOverrider:GetActiveRadius()`
* **Description:** Returns the current active override radius as a networked float value.  
* **Parameters:** None.  

### `TemperatureOverrider:GetTemperature()`
* **Description:** Returns the custom temperature value defined by this overrider.  
* **Parameters:** None.  

### `TemperatureOverrider:SetTemperature(temperature)`
* **Description:** (Server only) Sets the custom temperature to be applied within the override radius. Broadcasts via the networked `_temperature` variable.  
* **Parameters:**  
  - `temperature` (number): The new temperature value.  

### `TemperatureOverrider:SetRadius(radius)`
* **Description:** (Server only) Sets the internal radius value, which will be used if `Enable()` is called. Does *not* affect the active radius until enabled or `SetActiveRadius_Internal()` is called.  
* **Parameters:**  
  - `radius` (number): The desired override radius.  

### `TemperatureOverrider:Enable()`
* **Description:** (Server only) Enables the temperature override and activates it by setting the active radius to the stored `radius` value. Registers this entity as a valid overrider in `_overriders`.  
* **Parameters:** None.  

### `TemperatureOverrider:Disable()`
* **Description:** (Server only) Disables the temperature override by setting the active radius to `0`. Unregisters the entity from `_overriders`.  
* **Parameters:** None.  

### `TemperatureOverrider:SetActiveRadius_Internal(new, old)`
* **Description:** (Server only) Updates the `_activeradius` network variable and registers/unregisters this entity in `_overriders` depending on whether the new radius is zero or non-zero. Used internally by `Enable`, `Disable`, and the `radius` property change handler.  
* **Parameters:**  
  - `new` (number): The new radius value (may be `0`).  
  - `old` (number): The previous radius value.  

## Events & Listeners  
- Listens for:  
  - `_activeradiusdirty` → calls `OnActiveRadiusDirty(inst)` (on client only)  
- Triggers:  
  - `_activeradiusdirty` (via networked variable change)  
- Global event listeners:  
  - None  
- Events pushed by other systems using this component’s values:  
  - `TheWorld.net.components.fumarolelocaltemperature:GetTemperatureAtXZ(x, z)` (used as fallback, not an event)  
  - `GetTemperatureAtXZ(x, z)` and `GetLocalTemperature(inst)` query registered overriders — no events involved.
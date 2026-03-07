---
id: nightlight
title: Nightlight
description: A deployable structure that provides shadow-light illumination and sanity benefits while consuming nightmare fuel.
tags: [structure, lighting, sanity, fueled]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: bcf094eb
system_scope: environment
---

# Nightlight

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `nightlight` is a deployable structure prefab that provides a stable, non-damaging light source in the Night time. It functions as a fueled light source, consuming `FUELTYPE.NIGHTMARE` resources, and emits a sanity aura that reduces sanity when the light is active. It integrates with multiple components including `burnable`, `fueled`, `sanityaura`, `workable`, `hauntable`, and `lootdropper` to support lighting behavior, fuel consumption, sanity effects, hammering interaction, haunting mechanics, and loot dropping.

## Usage example
This is a built-in game prefab and not intended for direct component instantiation. However, modders can reference its construction logic:
```lua
-- Example of how a similar light source might be implemented
local inst = CreateEntity()
inst:AddComponent("burnable")
inst:AddComponent("fueled")
inst:AddComponent("sanityaura")
-- ... configure properties as in nightlight.lua ...
```

## Dependencies & tags
**Components used:** `burnable`, `sanityaura`, `lootdropper`, `workable`, `fueled`, `hauntable`, `inspectable`  
**Tags added:** `structure`, `wildfireprotected`  
**Tags manipulated:** `shadow_fire` (added on ignite, removed on extinguish)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `maxfuel` | number | `TUNING.NIGHTLIGHT_FUEL_MAX` | Maximum fuel capacity for the light. |
| `accepting` | boolean | `true` | Indicates the light accepts Nightmare Fuel. |
| `fueltype` | FUELTYPE enum | `FUELTYPE.NIGHTMARE` | Type of fuel accepted. |
| `sections` | integer | `4` | Number of fuel level stages for visual feedback. |

## Main functions
### `CalcSanityAura(inst, observer)`
* **Description:** Calculates the sanity aura effect based on proximity to the active light. Returns negative sanity per second if the observer is within half the light's radius.
* **Parameters:** `inst` (Entity) — the nightlight entity; `observer` (Entity) — the player or observer entity.
* **Returns:** `number` — negative value (e.g., `-0.05`) if close and burning, otherwise `0`.
* **Error states:** Returns `0` if `burnable` component is missing or light radius is `0`.

### `onignite(inst)`
* **Description:** Event callback called when the light is ignited. Adds the `shadow_fire` tag.
* **Parameters:** `inst` (Entity) — the nightlight instance.
* **Returns:** Nothing.

### `onextinguish(inst)`
* **Description:** Event callback called when the light is extinguished. Empties fuel and removes the `shadow_fire` tag.
* **Parameters:** `inst` (Entity) — the nightlight instance.
* **Returns:** Nothing.

### `ontakefuel(inst)`
* **Description:** Sound callback triggered when fuel is added to the light.
* **Parameters:** `inst` (Entity) — the nightlight instance.
* **Returns:** Nothing.

### `onupdatefueled(inst)`
* **Description:** Callback triggered on fueled updates. Synchronizes burn FX with current fuel section.
* **Parameters:** `inst` (Entity) — the nightlight instance.
* **Returns:** Nothing.

### `onfuelchange(newsection, oldsection, inst)`
* **Description:** Callback triggered when the fuel section changes. Extinguishes if section is `<= 0`; ignites if section is `> 0` and not burning; updates burn FX level.
* **Parameters:** `newsection` (integer) — new fuel section index; `oldsection` (integer) — previous section index; `inst` (Entity) — the nightlight instance.
* **Returns:** Nothing.

### `OnHaunt(inst, haunter)`
* **Description:** Handles haunting mechanics. If the light has fuel, there is a 50% chance to empty it and grant a small haunt value.
* **Parameters:** `inst` (Entity) — the nightlight instance; `haunter` (Entity) — the haunting entity.
* **Returns:** `boolean` — `true` if haunting succeeded, `nil` otherwise.

### `onhammered(inst)`
* **Description:** Callback when the light is hammered. Drops loot, spawns collapse FX, and removes the light.
* **Parameters:** `inst` (Entity) — the nightlight instance.
* **Returns:** Nothing.

### `onhit(inst)`
* **Description:** Plays a hit animation when the light is being hammered.
* **Parameters:** `inst` (Entity) — the nightlight instance.
* **Returns:** Nothing.

### `onbuilt(inst)`
* **Description:** Sound and animation callback after the light is built placed in world.
* **Parameters:** `inst` (Entity) — the nightlight instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onextinguish`, `onignite`, `onbuilt` — used to trigger fuel reset, tag management, and FX/sound updates.
- **Pushes:** None directly (events are handled via callbacks in component listeners).

## Notes
- The light can be ignited automatically via fuel section changes (e.g., initial placement with fuel).
- The `workable` component is set up to allow hammering for 4 hits, after which it drops loot and collapses.
- The sanity aura is active only while the light is burning and the observer is within half the flame radius.
- Haunting can empty the light completely but does not damage the structure directly.
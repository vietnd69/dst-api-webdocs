---
id: campfire
title: Campfire
description: Manages a consumable fire source that provides heat, light, cooking capability, and hauntable behavior in the game world.
tags: [environment, lighting, cooking, hauntable]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ef6a81fd
system_scope: environment
---

# Campfire

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The campfire is a core environmental entity that functions as a renewable heat source and cooking station. It is built using the Entity Component System (ECS) and integrates with multiple components: `burnable` (for fire mechanics), `fueled` (for fuel management), `propagator` (for heat/light spread), `workable` (for hammering interaction), `inspectable` (for UI status display), `hauntable` (for haunts), `storytellingprop` (for narrative context), and `cooker` (for food preparation). Its behavior changes dynamically based on fuel level, weather (rain), and player interactions.

## Usage example
```lua
local inst = Prefab("campfire")
inst.components.fueled:DoDelta(50) -- Add fuel
inst.components.burnable:Ignite()  -- Light the fire
inst.components.inspectable.getstatus(inst) -- Get current status string ("NORMAL", "LOW", etc.)
```

## Dependencies & tags
**Components used:** `burnable`, `fueled`, `propagator`, `workable`, `inspectable`, `hauntable`, `cooker`, `storytellingprop`, `rainimmunity` (indirectly via component existence check)  
**Tags added:** `campfire`, `NPC_workable`, `cooker`, `storytellingprop`, `NOCLICK` (added upon fuel depletion)

## Properties
No public properties are initialized in the constructor. However, internal state includes:
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `queued_charcoal` | boolean or nil | `nil` | Temporary flag set when campfire reaches max fuel level, indicating charcoal should spawn upon extinction. |
| `disable_charcoal` | boolean | `false` | Set in Quagmire variant to suppress charcoal spawning. |

## Main functions
### `onfuelchange(newsection, oldsection, inst)`
*   **Description:** Central callback triggered when the fuel section (level) changes. Manages fire state (ignite/extinguish), visual animations, physics, propagator settings (range and heat), and spawning of ash or charcoal.
*   **Parameters:** `newsection` (number) - new fuel section index (`0` to `4`), `oldsection` (number) - previous section index, `inst` (entity) - the campfire instance.
*   **Returns:** Nothing.
*   **Error states:** Extinguishes fire and destroys entity components when `newsection <= 0`; lights fire and initializes heat propagation if fuel is restored.

### `updatefuelrate(inst)`
*   **Description:** Dynamically updates the fuel consumption rate based on precipitation (rain). Non-ignited rain-immune campfires consume fuel faster during rain.
*   **Parameters:** `inst` (entity) - the campfire instance.
*   **Returns:** Nothing.
*   **Error states:** Uses `TUNING.CAMPFIRE_RAIN_RATE` and `TheWorld.state.precipitationrate` to compute rate multiplier; assumes `TheWorld.state` is valid.

### `getstatus(inst)`
*   **Description:** Provides a human-readable status string for the campfire’s current fuel level, used in the inspect UI.
*   **Parameters:** `inst` (entity) - the campfire instance.
*   **Returns:** String: `"OUT"`, `"EMBERS"`, `"LOW"`, `"NORMAL"`, or `"HIGH"`.
*   **Error states:** Returns `"OUT"` if `GetCurrentSection()` returns `0`.

### `OnHaunt(inst)`
*   **Description:** Handles haunts from the `hauntable` component. chance-based small fuel addition and haunts the haunter.
*   **Parameters:** `inst` (entity) - the campfire instance.
*   **Returns:** Boolean: `true` if haunt succeeded, `false` otherwise.
*   **Error states:** Returns `false` if haunt fails (random check or fuel depleted/unaccepting).

### `OnInit(inst)`
*   **Description:** Final initialization callback that fixes burn FX (e.g., fire particles) after entity is fully built and synced.
*   **Parameters:** `inst` (entity) - the campfire instance.
*   **Returns:** Nothing.

### `onbuilt(inst)`
*   **Description:** Triggered on entity placement; plays placement animation and sound.
*   **Parameters:** `inst` (entity) - the campfire instance.
*   **Returns:** Nothing.

### `onextinguish(inst)`
*   **Description:** Resets fuel level to zero when the campfire is extinguished manually.
*   **Parameters:** `inst` (entity) - the campfire instance.
*   **Returns:** Nothing.

### `ontakefuel(inst)`
*   **Description:** Sound callback triggered when fuel is added to the campfire.
*   **Parameters:** `inst` (entity) - the campfire instance.
*   **Returns:** Nothing.

### `onhammered(inst, worker)`
*   **Description:** Callback executed when the campfire is destroyed via hammering (e.g., by player or NPC). Spawns ash and collapse FX, then removes the entity.
*   **Parameters:** `inst` (entity) - the campfire instance, `worker` (entity) - entity performing the hammering.
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Serialization hook; stores `queued_charcoal` state.
*   **Parameters:** `inst` (entity), `data` (table) - save data table.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Deserialization hook; restores `queued_charcoal` flag from saved data.
*   **Parameters:** `inst` (entity), `data` (table or nil) - loaded save data.
*   **Returns:** Nothing.

### `quagmire_fn()`
*   **Description:** Variant constructor for the Quagmire world; disables charcoal spawning and sets up special Quagmire behavior via `event_server_data`.
*   **Parameters:** None (called as constructor).
*   **Returns:** Entity instance configured for Quagmire.
*   **Error states:** Explicitly sets `disable_charcoal = true`; assumes `event_server_data` hook exists.

## Events & listeners
- **Listens to:** `onextinguish` — triggers fuel reset; `onbuilt` — triggers placement animation/sound.
- **Pushes:** None directly (events are handled via callbacks like `onextinguish`, not pushed by the campfire itself).
- **External events it may respond to (via components):** `death`, `percentusedchange`, `onfueldsectionchanged`, `onignite`.
---
id: rock_avocado_bush
title: Rock Avocado Bush
description: A renewable plant prefab that grows through four distinct stages, yielding rock avocado fruits only at maturity before regrowing cycles.
tags: [environment, renewable, plant, harvest]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 74d4af04
system_scope: environment
---

# Rock Avocado Bush

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `rock_avocado_bush` is a renewable plant entity that progresses through four growth stages before producing `rock_avocado_fruit` at stage 3. It integrates with multiple components including `growable`, `pickable`, `burnable`, `witherable`, and `workable`. The bush automatically cycles through stages using tuned timing values and supports regrowth after harvesting, up to a maximum number of cycles. It stops growing when burnt or withered, and its produce survives burning due to the rock-hard nature of the fruit.

## Usage example
```lua
-- Typical usage in a script to interact with a rock avocado bush
if bush:IsValid() and bush.components.growable ~= nil then
    local current_stage = bush.components.growable.stage
    if current_stage == 3 and bush.components.pickable:CanBePicked() then
        -- Harvest the bush; three fruits will drop
        bush.components.pickable.onpickedfn(bush, harvester)
    elseif bush.components.pickable:IsBarren() then
        --Bush is barren and will regrow after cycles
        print("Bush is barren; waiting for regrowth.")
    end
end
```

## Dependencies & tags
**Components used:** `burnable`, `growable`, `lootdropper`, `pickable`, `simplemagicgrower`, `witherable`, `workable`, `inspectable`, `smallobstaclephysics`, `animstate`, `transform`, `minimapentity`, `network`, `hauntable`, `mediumburnable`, `mediumpropagator`, `waxableplant`  
**Tags added:** `plant`, `renewable`, `slurtlepickable`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `growth_stages` | table (static) | `growth_stages` | Defines four stages (1–4), each with timing and animation functions. Stage 3 produces `rock_avocado_fruit`. |
| `max_cycles` | number | `TUNING.ROCK_FRUIT_PICKABLE_CYCLES` | Maximum harvest cycles before the bush becomes barren. |
| `cycles_left` | number | `max_cycles` | Remaining harvest cycles; tracked by `pickable` component. |

## Main functions
### `on_bush_burnt(inst)`
* **Description:** Handles bush burning. Drops three `rock_avocado_fruit` if the bush is at stage 3 (mature/fruiting). Stops all growth immediately and calls the default burnt function.
* **Parameters:** `inst` (Entity) — The bush instance.
* **Returns:** Nothing.
* **Error states:** None.

### `on_dug_up(inst, digger)`
* **Description:** Handles the bush being dug up. If withered or barren, drops two `twigs`. If mature, drops three `rock_avocado_fruit` and the `dug_rock_avocado_bush` prefab. Removes the bush entity.
* **Parameters:** `inst` (Entity), `digger` (Entity or `nil`) — The entity performing the dig; may be `nil`.
* **Returns:** Nothing.
* **Error states:** None.

### `onpickedfn(inst, picker)`
* **Description:** Called after picking. Resets the bush to stage 1, plays the appropriate picked animation (`picked` if stage 3, otherwise `crumble`). If the bush becomes barren after this harvest, stops growing and sets animation to dead state.
* **Parameters:** `inst` (Entity), `picker` (Entity) — The entity performing the harvest.
* **Returns:** Nothing.
* **Error states:** If `IsBarren()` is true, animation sequence ends with `dead1`; otherwise, returns to `idle1`.

### `makeemptyfn(inst)`
* **Description:** Called when the bush regrows after being emptied. Sets stage to 1, restarts growth, enables `magicgrowable`, and plays appropriate animation (normal or transition from dead state).
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.
* **Error states:** Only executes if `not POPULATING`.

### `makebarrenfn(inst, wasempty)`
* **Description:** Called when the bush becomes barren. Resets stage to 1, stops growth, disables `magicgrowable`, and plays dead animation.
* **Parameters:** `inst` (Entity), `wasempty` (boolean) — Whether the bush was empty before this cycle.
* **Returns:** Nothing.
* **Error states:** None.

### `onregenfn(inst)`
* **Description:** Overrides default regeneration logic. If the bush is < stage 3, skips directly to stage 3 to ensure mature fruit can be harvested.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.
* **Error states:** None.

### `ontransplantfn(inst)`
* **Description:** Called after transplanting (e.g., via shovel). Immediately makes the bush barren (cycle reset).
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.
* **Error states:** None.

### `on_save(inst, data)`
* **Description:** Saves burning state for persistence.
* **Parameters:** `inst` (Entity), `data` (table) — Save data table.
* **Returns:** Nothing.

### `on_load(inst, data)`
* **Description:** Restores bush state on load. If burnt, calls `on_bush_burnt`. If withered, forces withering. If stage was saved as `nil`, ensures stage is set to 1.
* **Parameters:** `inst` (Entity), `data` (table or `nil`) — Loaded data.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None directly (no `inst:ListenForEvent` calls); relies on component event hooks (`onpickedfn`, `onregenfn`, `ontransplantfn`, `makebarrenfn`, `makeemptyfn`, `onburnt`, `onignite`, `on_load`, `on_save`).
- **Pushes:** None directly (no `inst:PushEvent` calls in this file).

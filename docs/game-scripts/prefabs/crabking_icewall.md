---
id: crabking_icewall
title: Crabking Icewall
description: Creates and configures a Crabs vs. King-exclusive ice spike obstacle entity that acts as a hostile, non-healable wall with dynamic visual variation and health-based state transitions.
tags: [combat, obstacle, boss, environment, fx]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 334beda4
system_scope: environment
---

# Crabking Icewall

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`crabking_icewall` is a prefabricated entity definition for a decorative yet functional ice spike obstacle used during the Crab King boss encounter. It functions as a combat-capable wall with fixed health, no physical movement, and dynamic animation variation based on its state. The entity interacts with the `health` and `combat` components to manage damage and visual feedback, and uses `savedrotation` and `inspectable` for world persistence and player interaction. It is not persistent in saves (`persists = false`) once destroyed.

## Usage example
This prefab is instantiated automatically during the Crab King fight when spawning icewalls. Manual usage is not intended for modders, but an example instantiation pattern is:

```lua
local inst = Prefab("crabking_icewall", IceWallFn, assets, prefabs)()
inst.Transform:SetPos(x, y, z)
inst:SetVariation(2) -- Sets to variation 2 of the spike model
```

## Dependencies & tags
**Components used:** `combat`, `health`, `inspectable`, `savedrotation`, `transform`, `animstate`, `physics`, `soundemitter`, `network`

**Tags added:**
- `crabking_icewall`
- `crabking_ally`
- `frozen`
- `hostile`
- `soulless`

Additionally, upon destruction: adds `FX` and `NOCLICK`, and removes tags via `Remove()`.

## Properties
No public properties are exposed directly on the prefab instance beyond those provided by attached components (`combat`, `health`, etc.). The internal variable `inst.variation` is used but not intended for external manipulation.

## Main functions
Not applicable — this file defines a Prefab constructor (`IceWallFn`) rather than a component with procedural methods. All logic resides in local functions (`SetVariation`, `OnHealthDelta`, `OnSave`, `OnLoad`) that operate on the entity instance.

The `SetVariation` function is assigned directly to the instance (`inst.SetVariation = SetVariation`) and is callable externally, but is considered an internal detail.

### `SetVariation(variation)`
*   **Description:** Changes the visual variant of the ice spike, adapting to current health (low-health animation used `when <= 50`% HP).
*   **Parameters:** `variation` (number) - integer between `1` and `NUM_VARIATIONS` (inclusive).
*   **Returns:** Nothing.
*   **Error states:** Uses `inst.variation` internally; may reload animation state but does not validate input (assumes valid variation index).

### `OnHealthDelta(inst, oldpercent, newpercent)`
*   **Description:** Callback invoked on health change. Triggers destruction FX at 0% health, plays break sound, and switches to low-health animation when HP drops below 50%.
*   **Parameters:**
    - `inst` (Entity) — the icewall entity instance.
    - `oldpercent` (number) — previous health ratio (`0..1`).
    - `newpercent` (number) — new health ratio (`0..1`).
*   **Returns:** Nothing.
*   **Error states:** When `newpercent <= 0`, schedules removal after FX animation via `inst:ListenForEvent("animqueueover", inst.Remove)`.

## Events & listeners
- **Listens to:** `animqueueover` — triggers entity removal (`inst.Remove`) when destruction animation completes.
- **Pushes:** None — the entity does not fire custom events.

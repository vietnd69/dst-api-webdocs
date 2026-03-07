---
id: stalker_bulb
title: Stalker Bulb
description: Manages the lifecycle of a stalker flower, including bloom phase, fading light effects, and regenerative picking behavior in DST.
tags: [environment, light, plant]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9ecf9832
system_scope: environment
---

# Stalker Bulb

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `stalker_bulb` prefab defines a renewable light-emitting plant found in the Caves. It manages a multi-stage animation lifecycle (bloom → idle → wilted/picked) and controls dynamic lighting intensity, radius, and falloff using a custom fade system. It integrates with the `pickable` component to allow harvesting of `lightbulb` items, and with the `burnable` component for fire mechanics—though custom ignition/extinguish handlers are explicitly cleared to preserve persistence flags. The prefab is instantiated in two variants: single (`stalker_bulb`) and double (`stalker_bulb_double`), differing in light radius and loot quantity.

## Usage example
```lua
-- Example: Spawn a single stalker bulb and manually unpause regeneration
local inst = Prefab("stalker_bulb")()
if inst.components.pickable then
    inst.components.pickable:Pause(false) -- unpause (note: Pause() without args pauses; To resume, use regen timer directly)
end
```

## Dependencies & tags
**Components used:**  
- `pickable` — manages harvest interaction and regeneration  
- `burnable` — enables fire propagation and burning (custom handlers cleared)  
- `inspectable`  
- `lootdropper`  
- `hauntable` (via `MakeHauntableIgnite`)  

**Tags added:**  
- `plant`  
- `stalkerbloom`  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_faderadius` | number | `3` or `4.5` | Base radius value used for dynamic light fading. Set per variant. |
| `_fade` | `net_byte` | `net_byte(inst.GUID, ...)` | Networked byte tracking fade progress. Used to synchronize light effects across client/server. |
| `_fadetask` | task or `nil` | `DoPeriodicTask(FRAMES, OnUpdateFade)` | Periodic task updating light intensity during fade-in or fade-out. |
| `persists` | boolean | `false` | Disables saving the entity to save files. |

## Main functions
### `OnUpdateFade(inst)`
* **Description:** Updates the light’s intensity, radius, and falloff based on `_fade` progress. Implements a two-phase fade curve: increasing brightness for the first `FADE_FRAMES`, then decreasing for the remainder.
* **Parameters:** `inst` (Entity) — the stalker bulb instance.
* **Returns:** Nothing.
* **Error states:** Cancels `_fadetask` when fade completes (`_fade` reaches `FADE_FRAMES` or `2*FADE_FRAMES + 1`).

### `OnFadeDirty(inst)`
* **Description:** Ensures `_fadetask` exists and immediately triggers one fade update cycle. Used to trigger or re-sync fading on demand.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `FadeOut(inst, instant)`
* **Description:** Initiates fade-out by setting `_fade` to the terminal phase (full fade-out) or ramping it up. Does *not* resume fading unless task exists or is started.
* **Parameters:**  
  - `instant` (boolean) — if `true`, jump immediately to end state.  
* **Returns:** Nothing.

### `KillPlant(inst)`
* **Description:** Handles plant decay after bloom period or harvest. Cancels `_killtask`, disables interaction, triggers `FadeOut`, and plays the `"wilt"` animation.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `OnBloomed(inst)`
* **Description:** Callback triggered after the initial `"bloom"` animation completes. Resets to `"idle"` animation, enables picking (`caninteractwith = true`), and schedules `KillPlant` after `TUNING.STALKER_BLOOM_DECAY + random()`.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `OnPicked(inst)`
* **Description:** Callback when player harvests the bulb. Cancels decay timer, triggers immediate fade-out (`FadeOut(inst, true)`), plays `"picked_wilt"` animation, and schedules entity removal after animation completes.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `commonfn(bank, build, radius)`
* **Description:** Shared constructor logic for both `single` and `double` variants. Sets up transform, anim state, light, network, and tags; configures lighting parameters and fade system; adds required components; and clears burnable callbacks.
* **Parameters:**  
  - `bank` (string) — anim bank (`"bulb_plant_single"` or `"bulb_plant_double"`)  
  - `build` (string) — anim build (same as `bank`)  
  - `radius` (number) — initial light radius (`3` or `4.5`)  
* **Returns:** `Entity` — fully initialized instance. Returns early on client to avoid duplicate server-side logic.

### `single()`
* **Description:** Factory for the single-bulb variant. Calls `commonfn` with single-specific values and configures `pickable` to produce 1 `lightbulb`, then immediately pauses regeneration.
* **Parameters:** None.
* **Returns:** `Entity`.

### `double()`
* **Description:** Factory for the double-bulb variant. Calls `commonfn` with double-specific values and configures `pickable` to produce 2 `lightbulb` items, then immediately pauses regeneration.
* **Parameters:** None.
* **Returns:** `Entity`.

## Events & listeners
- **Listens to:**  
  - `"fadedirty"` — triggers `OnFadeDirty` on client to resync fading.  
  - `"animover"` — triggers `OnBloomed` or `inst.Remove` depending on stage.  
- **Pushes:** None (no direct `PushEvent` calls in this file).  
  > Note: Event `fadedirty` is set as the sync callback in `net_byte(..., "fadedirty")`, but no explicit push occurs in this code.
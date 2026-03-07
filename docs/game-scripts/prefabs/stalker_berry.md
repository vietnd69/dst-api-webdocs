---
id: stalker_berry
title: Stalker Berry
description: A prefabricated plant entity that blooms over time, becomes harvestable, then wilts and respawns; used to spawn Wormlights when picked.
tags: [world, plant, lighting, respawn]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: eb69c643
system_scope: world
---

# Stalker Berry

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`stalker_berry` is a prefab (not a component) representing a dynamic plant entity that undergoes a lifecycle: initial blooming animation, delayed activation for harvesting, and eventual decay or re-spawning after being picked or wilting. It emits light with a fade-out effect and integrates with the `pickable`, `burnable`, and `lootdropper` systems. Its primary purpose is to provide a renewable source of `wormlight_lesser` when harvested.

## Usage example
The prefab is instantiated by the game engine via the Prefab system and does not require manual instantiation. However, modders may reference its logic when designing similar lifecycle plants:
```lua
-- Example of creating a stalker berry manually (e.g., via spawn functions)
local plant = Prefab("stalker_berry")
local inst = MakePrefab("stalker_berry")

-- The entity is self-contained; no manual setup required.
-- The lifecycle (bloom → harvestable → wilt/respawn) is handled internally.
```

## Dependencies & tags
**Components used:** `pickable`, `inspectable`, `lootdropper`, `burnable`, `propagator`, `hauntable`
**Tags:** Adds `plant` and `stalkerbloom`.

## Properties
No public properties. State is managed internally via private fields (`inst._fade`, `inst._fadetask`, `inst._killtask`) and component APIs.

## Main functions
This is a prefab function (`fn`), not a component, so it contains initialization logic only. Key helper functions are used internally to manage state transitions.

### `FadeOut(inst, instant)`
*   **Description:** Triggers a light-fade-out animation to visually signal decay. If `instant` is true, the fade completes immediately; otherwise, it ramps up over time.
*   **Parameters:**  
    `inst` (EntityInstance) – the stalker berry entity.  
    `instant` (boolean) – if true, skips fade-in and sets fade state to fully faded.
*   **Returns:** Nothing.
*   **Error states:** None identified.

### `KillPlant(inst)`
*   **Description:** Terminates the current instance: disables interaction, triggers fade-out, sets wilt animation, and schedules removal after the animation ends.
*   **Parameters:** `inst` (EntityInstance).
*   **Returns:** Nothing.
*   **Error states:** None identified.

### `OnBloomed(inst)`
*   **Description:** Called when the initial bloom animation completes. Activates harvesting by enabling `caninteractwith`, starts idle animation, and schedules eventual decay via `KillPlant`.
*   **Parameters:** `inst` (EntityInstance).
*   **Returns:** Nothing.

### `OnPicked(inst)`
*   **Description:** Handler for when a player picks the berry. Cancels scheduled decay, triggers immediate fade-out, stops bloom listener, and schedules removal after picked animation completes.
*   **Parameters:** `inst` (EntityInstance).
*   **Returns:** Nothing.

### `OnUpdateFade(inst)`
*   **Description:** Periodic task that updates light intensity, radius, and falloff during fade-in or fade-out. Handles light enable/disable logic on master.
*   **Parameters:** `inst` (EntityInstance).
*   **Returns:** Nothing.

### `OnFadeDirty(inst)`
*   **Description:** Restarts or kicks off the fade animation task if not already running.
*   **Parameters:** `inst` (EntityInstance).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` – triggers bloom completion (`OnBloomed`) or post-pick removal (`inst.Remove`).
- **Pushes:** none directly; the `stalker_berry` prefab does not fire custom events.

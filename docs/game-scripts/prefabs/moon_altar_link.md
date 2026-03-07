---
id: moon_altar_link
title: Moon Altar Link
description: Coordinates the activation sequence of the Moon Altar device by linking three altars, clearing surrounding area, and triggering moonstorm events.
tags: [moon_device, event, environment, prefab]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: fb22f7df
system_scope: environment
---

# Moon Altar Link

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `moon_altar_link` prefab represents the central geyser structure that activates when all three Moon Altars (moon_altar, moon_altar_cosmic, and moon_altar_astral) are correctly positioned. It tracks the altars using the `entitytracker` component, validates their geometric configuration via `moonstormmanager`, clears the surrounding area of destructible structures, and orchestrates the moonstorm activation sequence through animation and sound cues. It does not persist across sessions and only exists on the master simulation.

## Usage example
```lua
-- Automatically instantiated by the game when all three altars are placed correctly
-- Typically no manual usage; triggered via `moon_altarlink:EstablishLink()` call in `OnLoadPostPass`
```

## Dependencies & tags
**Components used:** `entitytracker`, `moonaltarlink`, `pointofinterest`, `workable`, `inspectable`, `soundemitter`, `animstate`, `transform`, `network`  
**Tags added:** `NOBLOCK`, `moon_altar_link`, `FX`, `NOCLICK`, `NOBLOCK`  
**Tags checked:** `can_build_moon_device`, `structure`, `tree`, `boulder`  
**Prefabs referenced:** `moon_altar`, `moon_altar_cosmic`, `moon_altar_astral`, `moon_altar_link_contained`, `moonpulse_spawner`, `collapse_small`

## Properties
No public properties exposed for external modification.

## Main functions
### `OnLinkEstablished(inst, altars)`
*   **Description:** Called when all three altars form a valid triangle around the link geyser. Handles tracker initialization, area clearing, visual/animation sequence, and sound effects. Skips all but animation setup during world population (`POPULATING`).
*   **Parameters:**  
    `inst` (Entity) — the moon_altar_link instance  
    `altars` (table) — array of three altar entities  
*   **Returns:** Nothing.
*   **Error states:** If `POPULATING` is true, it only updates the `can_build_moon_device` tag if a moonstorm already exists.

### `OnLoadPostPass(inst)`
*   **Description:** Attempts to locate the three tracked altars after world load. If all three exist and pass geometric validity, it calls `moonaltarlink:EstablishLink()`. Otherwise, it disables altars and destroys itself.
*   **Parameters:** `inst` (Entity) — the moon_altar_link instance  
*   **Returns:** Nothing.
*   **Error states:** Returns early without linking if any altar is missing or the triangle test fails.

### `startmoonstorms(inst)`
*   **Description:** Fires the `ms_startthemoonstorms` event and ensures the `can_build_moon_device` tag is added.
*   **Parameters:** `inst` (Entity) — the moon_altar_link instance  
*   **Returns:** Nothing.

### `ClearArea(inst)`
*   **Description:** Finds and destroys structures, trees, and boulders within the designated radius (unless they are protected altars), spawning small collapse FX before destruction.
*   **Parameters:** `inst` (Entity) — the moon_altar_link instance  
*   **Returns:** Nothing.
*   **Error states:** Only destroys entities that are `workable` and not in the `CANT_DESTROY_PREFABS` list.

## Events & listeners
- **Listens to:**  
  - `animover` — triggers post-animation moonstorm sequence via `onlinkpreanimover`.  
  - `ms_moonstormwindowover` — restarts moonstorm sequence if the link was spawned during load and a moonstorm window just ended.  
  - `onremove` — auto-registered via `EntityTracker:TrackEntity` to clean up tracked entities.

- **Pushes:**  
  - `ms_startthemoonstorms` — via `TheWorld:PushEvent` to initiate moonstorm logic.
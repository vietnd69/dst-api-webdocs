---
id: quagmire_grill
title: Quagmire Grill
description: Manages visual and networked state for Quagmire grills, including smoke effects, burnt indicators, and ember visuals.
tags: [visual, network, quagmire, fx]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 234d48bd
system_scope: fx
---

# Quagmire Grill

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`quagmire_grill` is a prefab definition file that creates both the grill entity and its corresponding item version for the Quagmire biome. It handles server-side initialization and client-side replication for visual effects such as smoke, burnt indicators, and embers. The component is self-contained and does not rely on external component functions — all state management occurs within the script via networked variables (`net_event`, `net_tinybyte`) and local helpers.

## Usage example
This prefab is automatically instantiated by the game when the `quagmire_grill` or `quagmire_grill_small` entities are spawned (e.g., placed by a player). Manual creation is not typical in modding.

```lua
-- Example: Creating a grill instance programmatically (rare)
local inst = Prefab("quagmire_grill")
-- ... further manual setup would be required, but prefabs are usually spawned via worldgen or inventory placement
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `"FX"` and `"NOCLICK"` to effect entities.

## Properties
No public properties.

## Main functions
### `AddHighlightChildren(inst, target)`
* **Description:** Appends `inst` (the grill) to `target.highlightchildren` array if `target` is a firepit, enabling visual highlighting (e.g., when hovering).  
* **Parameters:**  
  - `inst` (entity) – the grill entity.  
  - `target` (entity) – the potential parent firepit entity.  
* **Returns:** Nothing.

### `KillFX(fx)`
* **Description:** Safely terminates a visual effect entity (`fx`) by delaying removal until its current animation completes if needed, and reparenting it if necessary to prevent removal with parent.  
* **Parameters:**  
  - `fx` (entity) – the visual effect entity to terminate.  
* **Returns:** Nothing.

### `CreateBurntSmoke(build, sound)`
* **Description:** Creates and configures a non-networked visual effect entity representing burnt smoke (two variants: front and back). Sets animation, offsets, and hides appropriate grill/smoke layers. Assigns `KillFX` method.  
* **Parameters:**  
  - `build` (string) – asset build/bank name.  
  - `sound` (boolean) – whether to attach a `SoundEmitter`.  
* **Returns:** `fx` (entity) – the smoke effect entity.

### `OnBurntDirty(inst)`
* **Description:** Responds to burnt state changes by spawning or updating smoke effects. Adjusts smoke color and sound based on burnt level. Removes smoke when burnt value drops to zero.  
* **Parameters:**  
  - `inst` (entity) – the grill instance.  
* **Returns:** Nothing.

### `OnGrillSmoke(inst)`
* **Description:** Spawns a one-shot smoke puff effect when grill cooking completes (triggered via event). Plays cooking sounds and schedules self-removal on animation finish.  
* **Parameters:**  
  - `inst` (entity) – the grill instance (unused directly).  
* **Returns:** Nothing (creates a temporary effect entity internally).

### `OnEntityReplicated(inst)`
* **Description:** On client replication, ensures the grill is registered in the parent’s `highlightchildren` list and requests widget setup for the container (e.g., firepit).  
* **Parameters:**  
  - `inst` (entity) – the grill instance.  
* **Returns:** Nothing.

### `OnRemoveEntity(inst)`
* **Description:** Cleans up the grill from the parent’s `highlightchildren` list upon removal, and clears the list if empty and parent is a firepit.  
* **Parameters:**  
  - `inst` (entity) – the grill instance.  
* **Returns:** Nothing.

### `OnEmbersDirty(inst)`
* **Description:** Updates ember visibility based on `_embers` value: shows/hides ember layers (`ember1`, `ember2`, `ember3`) and toggles the `embersfx` entity.  
* **Parameters:**  
  - `inst` (entity) – the grill instance.  
* **Returns:** Nothing.

### `CreateEmbers(build)`
* **Description:** Creates a non-networked ember effect entity (hidden by default) for visual feedback. Configures animation and offset.  
* **Parameters:**  
  - `build` (string) – asset build/bank name.  
* **Returns:** `fx` (entity) – the ember effect entity.

### `MakeGrill(name)`
* **Description:** Generates two prefabs: the grill entity and its item version (`_item`). Registers assets and prefabs, then initializes entities with appropriate networked variables (`_smoke`, `_burnt`, `_embers`) and event listeners. Calls `event_server_data(...).master_postinit(...)` on the master simulation for full setup.  
* **Parameters:**  
  - `name` (string) – the base name (e.g., `"quagmire_grill"`).  
* **Returns:** Nothing (modifies global `ret` table).  

## Events & listeners
- **Listens to:**  
  - `name.."._smoke"` – triggers `OnGrillSmoke` on client.  
  - `"burntdirty"` – triggers `OnBurntDirty` on client.  
  - `"embersdirty"` – triggers `OnEmbersDirty` on client.  
- **Pushes:** No events directly; uses `net_event` and `net_tinybyte` for replication.
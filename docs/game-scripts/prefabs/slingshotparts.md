---
id: slingshotparts
title: Slingshotparts
description: Defines prefabs for slingshot parts (bands, frames, handles) and registers them with appropriate components and tags for installation in slingshot mod containers.
tags: [crafting, inventory, equipment, installable, slingshot]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: cdfb0238
system_scope: crafting
---

# Slingshotparts

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`slingshotparts.lua` is a prefab factory script that dynamically generates prefabs for slingshot modification parts (bands, frames, and handles). It leverages external definitions from `prefabs/slingshotpart_defs.lua` and attaches necessary components—particularly `containerinstallableitem`, `inventoryitem`, and `inspectable`—to support installation into the `slingshotmodscontainer` and usage in-game. Each part is tagged appropriately (`slingshot_band`, `slingshot_frame`, or `slingshot_handle`) and includes client-side floatable physics and inventory visuals.

## Usage example
This file is not directly instantiated by modders; it returns prefabs when loaded. A modder would typically reference the resulting prefabs by name (e.g., `"slingshot_band_rubber"`, `"slingshot_frame_hardwood"`) in crafting recipes or world spawning logic.

Example of installing a slingshot part via code (requires a valid part prefab and a `slingshotmodscontainer`):
```lua
local part = SpawnPrefab("slingshot_band_rubber")
local container = SpawnPrefab("slingshotmodscontainer")
container.components.containerinstallable:InstallItem(part)
```

## Dependencies & tags
**Components used:**  
- `containerinstallableitem` (for install/uninstall hooks and container validation)  
- `clientpickupsoundsuppressor` (to prevent pickup noise on client)  
- `inspectable` (server-only)  
- `inventoryitem` (server-only)  

**Tags added:**  
- `slingshot_band`, `slingshot_frame`, or `slingshot_handle` (per part definition)  
- No tags removed or checked dynamically.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `slingshot_slot` | string (e.g., `"band"`, `"frame"`, `"handle"`) | Set at runtime per definition | Slot type this part occupies on the slingshot. |
| `swap_build` | string (e.g., `"slingshot_bands"`) | Set at runtime per definition | Animation bank/build name for the part. |
| `swap_symbol` | string | Set at runtime per definition | Symbol used for UI display (e.g., in slingshot mod slot). |
| `REQUIRED_SKILL` | string or nil | Set per definition | Skill requirement for using the slingshot with this part installed (e.g., `"grand"`). |

## Main functions
### `MakePart(name, def)`
*   **Description:** Factory function that constructs and returns a `Prefab` for a single slingshot part based on the given definition (`def`). Sets up transforms, animation, physics, tags, components, and server-only fields.
*   **Parameters:**  
    `name` (string) – Unique name identifier for the prefab (e.g., `"slingshot_band_rubber"`).  
    `def` (table) – A definition table (from `SLINGSHOTPART_DEFS`) containing keys like `slot`, `anim`, `skill`, `swap_symbol`, `oninstalledfn`, `onuninstalledfn`, `usedeferreduninstall`, and `prefabs`.
*   **Returns:** `Prefab` – A ready-to-use `Prefab` object.
*   **Error states:** None explicitly handled; relies on correct `def` structure.

### `ValidContainer(inst, containerinst)`
*   **Description:** Callback function used by `containerinstallableitem` to determine whether a given container (e.g., slingshot or mod slot) can accept this part.  
*   **Parameters:**  
    `inst` (Entity) – The slingshot part instance.  
    `containerinst` (Entity) – The container entity being checked.  
*   **Returns:** `boolean` – `true` only if `containerinst.prefab == "slingshotmodscontainer"`.
*   **Error states:** Returns `false` for any container not named `"slingshotmodscontainer"`.

## Events & listeners
- **Listens to:** None (this file does not register any event listeners itself).  
- **Pushes:** None (this file does not fire events directly).  
*(Note: Components added in this file—like `containerinstallableitem`—may internally listen and fire events, but such behavior is defined in `containerinstallableitem.lua`, not here.)*
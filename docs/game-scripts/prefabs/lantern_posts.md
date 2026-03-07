---
id: lantern_posts
title: Lantern Posts
description: Generates prefabs for lantern posts, their light chains, deployment kits, and placement helpers, handling lighting, partnerships, and seasonal loot logic.
tags: [lighting, structure, loot, network]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c4b1ca31
system_scope: world
---

# Lantern Posts

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lantern_posts.lua` is a factory script that dynamically creates prefabs for lantern-style light posts and their associated chain/link systems. It supports configuration-driven variants via `lantern_posts_defs.lua`, and handles core behaviors such as lighting state (based on contained items), partnerships with neighboring posts (with dynamic chain spawning), perish rates, burnable state, and loot generation—including special event drops (e.g., Winters Feast ornaments). This script runs during game initialization to populate the global prefab registry.

## Usage example
This file does not instantiate components on an existing entity at runtime. Instead, it defines reusable prefab templates. Modders typically extend it by adding new entries to `prefabs/lantern_posts_defs.lua` and registering them in `prefabs/init.lua`. Example usage in a mod:
```lua
-- In a mod's modmain.lua or prefabs init script:
local LanternDefs = require("prefabs/lantern_posts_defs").lantern_posts
table.insert(LanternDefs, {
    name = "custom_lantern_post",
    build = "custom_lantern",
    bank = "custom_lantern",
    material = "stone",
    chain_dist = 10,
    partner_count = 2,
    kit_data = {
        floater_data = { ... },
        tags = { "custom_tag" },
        burnable_data = { ... },
        deployable_data = { ... },
    },
    OnSave = function(inst, savedata) savedata.custom = true end,
    OnLoad = function(inst, savedata) if savedata.custom then ... end end,
})
```

## Dependencies & tags
**Components used:** `burnable`, `container`, `entitytracker`, `lightpostpartner`, `lootdropper`, `placer`, `preserver`, `updatelooper`, `workable`, `worldstate`.  
**Tags added:** `structure`, `lantern_post`, `lamp`, `FX`, `NOCLICK`, `CLASSIFIED`, `placer`, `burnt`, `abandoned`.  
**Tags filtered against:** `burnt`, `abandoned`.  
**Tags checked in find logic:** `lantern_post`, `lightpostpartner`.

## Properties
No public properties are exposed on the script itself—this is a prefab generator module. Individual prefabs created by this script expose internal state (e.g., `inst.neighbour_lights`, `inst.partners`, `inst.chains`), but none are documented as public API.

## Main functions
The script exports only the unpacked prefabs (via `return unpack(lantern_prefabs)`); all key functions are internal helpers used during prefab construction and runtime behavior. Documented here are the primary internal functions referenced elsewhere in the codebase:

### `MakeLanternPost(data)`
*   **Description:** Constructs the main lantern post prefab definition, including light, container, workability, burnable, and partnership logic. Configurable via `data` (see `lantern_posts_defs.lua`).
*   **Parameters:** `data` (table) — Configuration with keys such as `name`, `build`, `bank`, `partner_count`, `chain_dist`, `kit_data`, `master_postinit`, `common_postinit`, `no_burn`, etc.
*   **Returns:** A `Prefab` object (used by DST to register the entity).
*   **Error states:** None; returns `nil` only if `CreateEntity()` fails internally.

### `MakeLanternLightChain(data)`
*   **Description:** Constructs the light chain/link prefab that visually connects two lantern posts, including sway animation and light sync.
*   **Parameters:** `data` (table) — Same structure as `MakeLanternPost`, plus `link_length`, `has_lantern_link`, `num_variations`.
*   **Returns:** A `Prefab` object.
*   **Error states:** Chain is not spawned if either partner is invalid or burnt.

### `MakeLanternPostKitItem(data)`
*   **Description:** Creates a deployable kit item prefab for the lantern post.
*   **Parameters:** `data` (table) — Same as above; must include `kit_data`.
*   **Returns:** A `Prefab` object.

### `MakeLanternPostPlacer(data)`
*   **Description:** Creates a placement helper (reticule) prefab used during deployment.
*   **Parameters:** `data` (table) — Same as above; used to configure the helper lines.
*   **Returns:** A `Prefab` object.

### `LanternPost_UpdateLightState(inst)`
*   **Description:** Updates the post’s perish rate and light state based on whether it contains valid battery-type or full lighters in its container.
*   **Parameters:** `inst` (entity) — The lantern post entity.
*   **Returns:** Nothing.

### `FindPostPartners(inst)`
*   **Description:** Locates up to `PARTNER_COUNT` compatible posts within `CHAIN_DIST` and spawns a light chain between them.
*   **Parameters:** `inst` (entity) — The lantern post entity.
*   **Returns:** Nothing.

### `LightChain_SetPartners(inst, partner1, partner2)`
*   **Description:** Sets up the two post partners for a light chain, tracking them via `entitytracker`, and initializes light sync and neighbor-light bookkeeping.
*   **Parameters:**  
    `inst` (entity) — The light chain entity.  
    `partner1`, `partner2` (entity) — The two lantern posts.
*   **Returns:** Nothing.

### `SpawnChain(inst, nohide)`
*   **Description:** Spawns the visual chain links and optional lanterns between the two partners using client-side positioning and sway animation.
*   **Parameters:** `inst` (entity) — The light chain.  
    `nohide` (boolean, optional) — If `true`, do not hide chain until nearest player.
*   **Returns:** Nothing.

### `RemoveChain(inst, instant)`
*   **Description:** Removes all chain links and lanterns, optionally playing break animations over time.
*   **Parameters:** `inst` (entity) — The light chain.  
    `instant` (boolean) — Whether to remove immediately or animate breaking.
*   **Returns:** Nothing.

### `LightChain_OnPostUpdate(inst)`
*   **Description:** Client-side post-update that recalculates chain and lantern positions based on partner positions and sway animation.
*   **Parameters:** `inst` (entity) — The light chain.
*   **Returns:** Nothing.

### `IsSamePostType(postname, partner)`
*   **Description:** Helper used during partner search to ensure compatibility (same prefab or matching `lightpostpartner.post_type` and shackling state).
*   **Parameters:**  
    `postname` (string) — The current post’s prefab name.  
    `partner` (entity) — The candidate partner.
*   **Returns:** `true` if compatible, otherwise `false`.

### `IsLightOn(inst)`
*   **Description:** Checks whether the post is “on” by searching its container for valid battery/light source items (`lightbattery`, `spore`, or `lightcontainer`).
*   **Parameters:** `inst` (entity) — The lantern post.
*   **Returns:** `true` if a battery-type item is found, otherwise `false`.

## Events & listeners
**Listens to:**  
- `onbuilt` — Triggers `OnBuilt` callback (plays place animation, finds partners, optionally spawns a lightbulb).  
- `itemget`, `itemlose` — Triggers `LanternPost_UpdateLightState`.  
- `onremove`, `onburnt` — Triggers `LanternPost_RemoveNeighbourLights`.  
- `partnerdirty` (client) — Re-evaluates partner presence and chain state (`LightChain_OnPartnerDirty`).  
- `enablelightsdirty` (client) — Syncs chain light visibility (`LightChain_EnableLightsDirty`).  
- `animover` (on chain links) — Removes chain links after break animation.  
- `lantern_light_chain.update_skin` (client, if skins enabled) — Marks chain as dirty for reparenting (`LightChain_OnUpdateSkin_Client`).  
- `onremove` (on partner entities, attached in `SetPartners`) — Clears cached neighbor reference.

**Pushes:**  
- `entity_droploot` — Fired after `lootdropper:DropLoot()`.

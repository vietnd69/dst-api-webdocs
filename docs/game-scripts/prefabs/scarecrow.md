---
id: scarecrow
title: Scarecrow
description: A decorative and functional structure that can be built by players to occupy space and interact with dressing-up mechanics; it supports hammering, burning, and skin changes.
tags: [structure, crafting, dressing, fire]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: df71c080
system_scope: world
---

# Scarecrow

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `scarecrow` prefab is a static structure used for decoration and interaction. It supports physical interaction via hammering, burning, and dressing-up (via `wardrobe` component), and includes networking support for client-server synchronization. It utilizes several core components (`playeravatardata`, `lootdropper`, `workable`, `wardrobe`, `burnable`, `skinner`, `inspectable`) to enable dynamic behavior such as face changes, clothing state persistence, and loot generation upon destruction or burning. It is typically placed using the `MakePlacer` helper and deployed with a smart radius.

## Usage example
```lua
local scarecrow = SpawnPrefab("scarecrow")
scarecrow.Transform:SetPosition(x, y, z)
scarecrow.components.wardrobe.ondressupfn = function(inst, cb) 
    -- custom dressup logic
    inst.components.wardrobe:Enable(false)
    cb()
end
```

## Dependencies & tags
**Components used:** `playeravatardata`, `lootdropper`, `workable`, `wardrobe`, `burnable`, `skinner`, `inspectable`, `soundemitter`, `animstate`, `transform`, `minimapentity`, `network`

**Tags:** `structure`, `scarecrow`, `NOCLICK` (temporarily added during dressing transformation), `burnt` (added when burnt), `fire` (used internally to alter face animation)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `face` | number | `1` | Current face index; incremented/changed by `ChangeFace`. Used to select which texture variant to display via `OverrideSymbol`. |
| `_dressuptask` | Task | `nil` | Task handle for dressing-up animation duration. Used to track state and cancel ongoing transformations. |

## Main functions
### `ChangeFace(inst, prefix)`
* **Description:** Changes the scarecrow's facial texture by selecting a random variant from predefined sets (`hit`, `scary`, `screaming`) based on the `prefix`. If the scarecrow has the `fire` tag, it forces the `screaming` set.
* **Parameters:** 
  * `inst` (Entity) — the scarecrow entity instance.
  * `prefix` (string, optional) — animation prefix: `"hit"`, `"scary"`, or `"screaming"`. Defaults to `"scary"`.
* **Returns:** Nothing.
* **Error states:** None; always sets `inst.face` and updates the `swap_scarecrow_face` symbol.

### `onhammered(inst)`
* **Description:** Called when the scarecrow is fully hammered (i.e., `workable` task completes). Drops loot, spawns a `collapse_big` FX entity, and removes the scarecrow entity.
* **Parameters:** 
  * `inst` (Entity) — the scarecrow entity instance.
* **Returns:** Nothing.

### `onhit(inst)`
* **Description:** Called when the scarecrow is partially hammered (each work step). Plays the `"hit"` animation and triggers a face change to `"hit"` if not dressing up or burnt.
* **Parameters:** 
  * `inst` (Entity) — the scarecrow entity instance.
* **Returns:** Nothing.
* **Error states:** No-op if `IsDressingUp(inst)` is `true` or `inst:HasTag("burnt")` is `true`.

### `onbuilt(inst)`
* **Description:** Called after the scarecrow is placed via crafting/building. Plays `"place"` animation, queues `"idle"`, and plays the crafting sound.
* **Parameters:** 
  * `inst` (Entity) — the scarecrow entity instance.
* **Returns:** Nothing.

### `ondressup(inst, cb)`
* **Description:** Initiates the dressing-up transformation sequence. Disables `wardrobe`, adds `NOCLICK`, plays `"transform"` animation, queues `"idle"`, and sets a delayed callback to `ontransformend`.
* **Parameters:** 
  * `inst` (Entity) — the scarecrow entity instance.
  * `cb` (function, optional) — optional callback executed after transformation starts.
* **Returns:** Nothing.
* **Error states:** No-op if `inst:HasTag("burnt")` is `true`.

### `ondressedup(inst, data)`
* **Description:** Records the dresser’s name and clothing/skin data into the scarecrow's `playeravatardata` component for display persistence.
* **Parameters:** 
  * `inst` (Entity) — the scarecrow entity instance.
  * `data` (table) — contains `doer`, `skins`, etc., passed by the `dressedup` event.
* **Returns:** Nothing.
* **Error states:** No-op if `inst:HasTag("burnt")` is `true`.

### `onsave(inst, data)`
* **Description:** Saves burning state to the world save data.
* **Parameters:** 
  * `inst` (Entity) — the scarecrow entity instance.
  * `data` (table) — save table to mutate.
* **Returns:** Nothing.

### `onload(inst, data)`
* **Description:** Loads saved state and re-applies player data if not burnt. If burnt, triggers `onburnt` to restore burnt state.
* **Parameters:** 
  * `inst` (Entity) — the scarecrow entity instance.
  * `data` (table, optional) — loaded save data.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** 
  * `"onbuilt"` — triggers `onbuilt`.
  * `"dressedup"` — triggers `ondressedup`.
- **Pushes:** None directly.
- **Callback hooks:**
  * `inst.OnEntityWake` → `ChangeFace`
  * `inst.OnSave` → `onsave`
  * `inst.OnLoad` → `onload`
---
id: w_radio
title: W Radio
description: Spawnable furniture entity that plays music, tends nearby farm plants, and supports skin customization with modular part variations.
tags: [prefab, furniture, music, skin]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 74a165ae
system_scope: entity
---

# W Radio

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`w_radio.lua` registers a spawnable furniture entity that functions as a music-playing machine. The prefab's `fn()` constructor builds the entity with inventory physics, animation state, and network replication for part variations. On the master sim, gameplay components are attached including machine (on/off state), workable (hammering), and furnituredecor (placement on furniture). The radio periodically tends nearby farm plants when active and supports skin customization with five modular part variations encoded in a netvar.

## Usage example
```lua
-- Spawn at world origin:
local inst = SpawnPrefab("w_radio")
inst.Transform:SetPosition(0, 0, 0)

-- Turn on the radio:
if inst.components.machine ~= nil then
    inst.components.machine:TurnOn()
end

-- Check if parts differ from a skin code:
local hex_code = "1A2B3C"
if inst.ReskinToolCustomDataDiffers ~= nil then
    local differs = inst.ReskinToolCustomDataDiffers(inst, hex_code)
end
```

## Dependencies & tags
**External dependencies:**
- `MakeInventoryPhysics` -- applies physics and floatable behavior for inventory items
- `MakeInventoryFloatable` -- configures floating behavior in water
- `MakeHauntable` -- registers ghost haunting interactions

**Components used:**
- `inspectable` -- allows players to examine the entity
- `inventoryitem` -- enables carrying in inventory; hooks `ToPocket` on pickup
- `furnituredecor` -- enables placement on furniture; hooks on put/take off
- `machine` -- manages on/off state; hooks `TurnOn`/`TurnOff` callbacks
- `workable` -- enables hammering with 3 work left; triggers `OnHammered` on finish
- `lootdropper` -- spawns loot when hammered

**Tags:**
- `furnituredecor` -- added in fn(); marks entity as furniture-decoratable
- `groundonlymachine` -- added in fn(); restricts placement to ground

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | --- | Array of `Asset(...)` entries listing animation, atlas, and texture files loaded with this prefab. |
| `prefabs` | table | `{"collapse_small"}` | Array of dependent prefab names spawned as FX when hammered. |
| `inst.parts` | net_ushortint | `0` | Encodes 5 part variations (plate, face, left_side, right_side, antenna) in a single integer. Dirty event: `partsdirty`. |
| `inst._icondirty` | boolean | `true` | Flag indicating inventory icon layers need refresh. Cleared after `LayeredInvImageFn` regenerates layers. |
| `inst.layeredinvimagefn` | function | `LayeredInvImageFn` | Returns layered inventory icon table. Called by inventory system to render item icon with part variations. |
| `inst.OnWRadioSkinChanged` | function | `OnWRadioSkinChanged` | Callback invoked when skin changes. Applies part variations from skin custom data. |
| `inst.ReskinToolCustomDataDiffers` | function | `ReskinToolCustomDataDiffers` | Callback for reskin tool. Returns `true` if current parts differ from provided skin custom data. |
| `inst.ReskinToolUpdateCustomData` | function | `ReskinToolUpdateCustomData` | Callback for reskin tool. Updates part variations from provided skin custom data. |
| `inst.OnEntityWake` | function | `OnSpawnCheckSkin` | Called when entity becomes active. Validates skin build exists; removes entity if missing. |
| `inst.OnEntitySleep` | function | `OnSpawnCheckSkin` | Called when entity goes idle. Same validation as OnEntityWake. |
| `inst.OnSave` | function | `OnSave` | Serializes `parts` netvar to hex string for save data. |
| `inst.OnLoad` | function | `OnLoad` | Restores `parts` from save data and applies visual variations. |
| `FARM_PLANT_TAGS` | table (local) | `{"tendable_farmplant"}` | Tag list used by song_update to find farm plants within tend range. |

## Main functions
### `fn()`
* **Description:** Prefab constructor that runs on both client and master. On client, registers listener for `partsdirty` event. On master, attaches all gameplay components (inspectable, inventoryitem, furnituredecor, machine, workable, lootdropper) and lifecycle callbacks.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None — components are added immediately before access in same function, guaranteeing existence.

### `TurnOn(inst)` (local)
* **Description:** Activates the radio. Plays looping music sound "dontstarve/music/w_radio" and starts periodic `song_update` task (1 second interval) to tend nearby farm plants. Initial task delay is randomized on master sim only.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None — guards against already-playing sound before calling PlaySound.

### `TurnOff(inst)` (local)
* **Description:** Deactivates the radio. Stops looping music, plays end sound "dontstarve/music/gramaphone_end", and cancels the `song_update` periodic task.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None — guards against non-playing sound and nil task reference.

### `ToPocket(inst, owner)` (local)
* **Description:** Called when the radio is put into a player's inventory. If the radio is on, stops the loop sound, plays end sound on the owner, and turns off the machine component.
* **Parameters:**
  - `inst` -- entity instance
  - `owner` -- player entity picking up the radio
* **Returns:** None
* **Error states:** None — guards against machine component state and owner SoundEmitter existence.

### `DoApplyFurnitureShadow(inst, enable)` (local)
* **Description:** Applies or clears the furniture shadow symbol override. When `enable` is true and the entity has a skin build, overrides "shadow01" symbol with "shadow02" from the skin build. When `enable` is false, clears the symbol override.
* **Parameters:**
  - `inst` -- entity instance
  - `enable` -- boolean to enable or disable shadow override
* **Returns:** None
* **Error states:** None — guards against nil skin_build before calling OverrideItemSkinSymbol.

### `OnPutOnFurniture(inst)` (local)
* **Description:** Called when the radio is placed on furniture. Disables workable (prevents hammering while on furniture) and applies furniture shadow override.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None — workable component is added in fn() before the callback is assigned, guaranteeing existence.

### `OnTakeOffFurniture(inst)` (local)
* **Description:** Called when the radio is removed from furniture. Re-enables workable and clears furniture shadow override.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None — workable component is added in fn() before the callback is assigned, guaranteeing existence.

### `OnHammered(inst)` (local)
* **Description:** Called when hammering work completes. Spawns "collapse_small" FX prefab at entity position, sets material to "metal", drops loot via lootdropper component, and removes the entity.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None — lootdropper component is added in fn() before the callback is assigned, guaranteeing existence.

### `song_update(inst)` (local)
* **Description:** **Periodic task callback.** Finds all entities with tag "tendable_farmplant" within `TUNING.PHONOGRAPH_TEND_RANGE` and calls `TendTo()` on their `farmplanttendable` component. Runs every 1 second while radio is on.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** Errors if a found entity lacks farmplanttendable component (no nil guard before components.farmplanttendable access).

### `OnSave(inst, data)` (local)
* **Description:** Serializes the `parts` netvar value to a hex string and stores in save data table under `data.parts`. Only saves if parts value is non-zero.
* **Parameters:**
  - `inst` -- entity instance
  - `data` -- table to populate with save data
* **Returns:** None
* **Error states:** None — called by game save system which always provides a valid table.

### `OnLoad(inst, data, ents)` (local)
* **Description:** Restores entity state from save data. Calls `OnSpawnCheckSkin` to validate skin, then applies part variations from `data.parts` if present and entity persists.
* **Parameters:**
  - `inst` -- entity instance
  - `data` -- saved data table
  - `ents` -- entity reference table for deserialization
* **Returns:** None
* **Error states:** None — guards against nil data and nil parts field.

### `OnSpawnCheckSkin(inst)` (local)
* **Description:** Validates that the entity has a skin build. If no skin exists, sets `persists = false` and schedules entity removal next tick. Clears OnEntityWake/OnEntitySleep after first run to prevent repeated checks.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None.

### `OnWRadioSkinChanged(inst, skin_build, skin_custom)` (local)
* **Description:** Handles skin change events. Decodes skin custom data JSON and applies part variations via `SetPartsFromCode`. If no skin build exists, schedules entity removal. Applies furniture shadow if currently on furniture.
* **Parameters:**
  - `inst` -- entity instance
  - `skin_build` -- skin build name or nil
  - `skin_custom` -- JSON string with part variation data or nil
* **Returns:** None
* **Error states:** Errors if `json.decode` fails on malformed `skin_custom` string (no pcall guard).

### `ReskinToolCustomDataDiffers(inst, skin_custom)` (local)
* **Description:** Compares current part variations against provided skin custom data. Returns `true` if parts differ, `false` if identical or if skin_custom is nil/invalid.
* **Parameters:**
  - `inst` -- entity instance
  - `skin_custom` -- JSON string with part variation data
* **Returns:** boolean
* **Error states:** Errors if `json.decode` fails on malformed `skin_custom` string (no pcall guard).

### `ReskinToolUpdateCustomData(inst, skin_custom)` (local)
* **Description:** Updates part variations from provided skin custom data. Decodes JSON and calls `SetPartsFromCode` with encoded hex value.
* **Parameters:**
  - `inst` -- entity instance
  - `skin_custom` -- JSON string with part variation data
* **Returns:** None
* **Error states:** Errors if `json.decode` fails on malformed `skin_custom` string (no pcall guard).

### `SetPartsFromCode(inst, hex)` (local)
* **Description:** Updates `parts` netvar if the provided hex value differs from current value. Triggers `DoApplyPartsFromCode` to apply visual changes and fires dirty event for client replication.
* **Parameters:**
  - `inst` -- entity instance
  - `hex` -- integer or hex string encoding part variations
* **Returns:** None
* **Error states:** None — handles string-to-int conversion internally.

### `DoApplyPartsFromCode(inst, hex)` (local)
* **Description:** Applies visual part variations to the entity's AnimState. Decodes hex value into 5 part indices (plate, face, left_side, right_side, antenna) and calls `SetPart` for each. Triggers `OnPartsDirty` on non-dedicated clients for icon refresh.
* **Parameters:**
  - `inst` -- entity instance
  - `hex` -- integer encoding part variations
* **Returns:** None
* **Error states:** Silent failure if `GetSkinBuild()` returns nil—`SetPart` receives nil `skin_build` and symbol override does not apply. No crash but visual parts not applied.

### `SetPart(inst, skin_build, partname, variation)` (local)
* **Description:** Overrides or clears a single part symbol on the AnimState. If variation > 1, overrides symbol with skinned variant; otherwise clears override. Stores variation value on `inst[partname]`.
* **Parameters:**
  - `inst` -- entity instance
  - `skin_build` -- skin build name
  - `partname` -- string part name (e.g., "plate", "face")
  - `variation` -- integer variation index (1-8)
* **Returns:** None
* **Error states:** None.

### `LayeredInvImageFn(inst)` (local)
* **Description:** Generates layered inventory icon table based on current part variations. Called by inventory system to render item icon. Caches layers in `inst._iconlayers` and marks `_icondirty` nil after generation.
* **Parameters:** `inst` -- entity instance
* **Returns:** table of layer definitions
* **Error states:** None — initializes `_iconlayers` if nil.

### `OnPartsDirty(inst)` (local)
* **Description:** Client-side listener for `partsdirty` netvar change. Marks `_icondirty = true` to trigger icon refresh on next `LayeredInvImageFn` call and pushes `imagechange` event.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None.

### `_DecodePart(hex, partnum)` (local)
* **Description:** Extracts a 3-bit part variation value from the encoded hex integer. Each part occupies 3 bits (values 1-8). Returns 1-based index.
* **Parameters:**
  - `hex` -- integer encoding all part variations
  - `partnum` -- integer part index (1-5)
* **Returns:** integer variation index (1-8)
* **Error states:** None.

### `_EncodePart(variation, partnum)` (local)
* **Description:** Encodes a part variation value into the correct bit position in the hex integer. Clamps variation to 1-8 range.
* **Parameters:**
  - `variation` -- integer variation index (1-8)
  - `partnum` -- integer part index (1-5)
* **Returns:** integer bit-shifted value
* **Error states:** None.

### `_parse_skin_custom_data(data)` (local)
* **Description:** Encodes skin custom data table (PLATE, FACE, LEFT, RIGHT, ANTENNA fields) into a single hex integer using `_EncodePart`.
* **Parameters:** `data` -- table with part variation fields
* **Returns:** integer encoded hex value
* **Error states:** None — called only after json.decode succeeds upstream; nil fields are clamped to 1 by _EncodePart.

## Events & listeners
- **Listens to (client only):** `partsdirty` -- triggers `OnPartsDirty`; marks icon dirty for inventory refresh
- **Pushes:** `imagechange` -- fired when parts change; signals inventory system to update icon
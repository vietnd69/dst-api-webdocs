---
id: prefabskin
title: Prefabskin
description: System for defining and applying reusable visual and functional skins to prefabs in Don't Starve Together, handling build overrides, sound effects, FX, and entity state changes.
tags: [entity, skin, fx, sound, inventory]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 121a1580
system_scope: entity
---

# Prefabskin

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `prefabskin` module is a foundational system for defining, initializing, and clearing reusable skin prefabs across entities in Don't Starve Together. It provides a declarative and composable approach to visual customization by allowing skins to override animation builds, inventory icons, sound effects, and FX behavior—while also handling complex cases such as linked items, mounted entities, and multi-state machinery. Skins are created via the `CreatePrefabSkin` constructor, and applied using a suite of specialized initialization and clear functions. These functions integrate with components like `AnimState`, `inventoryitem`, `burnable`, `floater`, and `blinkstaff` to ensure correct behavior across client/server boundaries and game states.

## Usage example
```lua
-- Define a custom skin for a lantern
local mylanternskin = CreatePrefabSkin("myprefab", {
    base_prefab = "lantern",
    type = "base",
    build_name_override = "lantern_myskin",
    skin_sound = "dontstarve/common/lantern_custom",
    SKIN_FX_PREFAB = "fx_mylantern",
    SKIN_SOUND_FX = { ... }, -- sound data
})

-- In a prefab's OnPostSpawn or similar, apply the skin:
if inst.skin_id and SKIN_FX_PREFAB["myprefab"] then
    LanternPostCommonInit(inst) -- client-side handling
end
```

## Dependencies & tags
**Components used:**
- `blinkstaff`
- `bundlemaker`
- `burnable`
- `container`
- `equippable`
- `floater`
- `Inspectable`
- `inventoryitem`
- `locomotor`
- `machine`
- `mightygym`
- `placer`
- `rider`
- `saddler`
- `symbolswapdata`

**Tags:**
- `"nobundling"`
- `"regaljoker"`
- `"open_top_hat"`
- `"hermithouse_winter_ornament"`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.bundledskinname` | string | `nil` | Set by `bundlemaker:SetSkinData`, stores the skin name for bundle items. |
| `inst.bundledskin_id` | number | `nil` | Set by `bundlemaker:SetSkinData`, stores the skin ID for bundle items. |
| `inst.fxoffset` | `Vector3` or `nil` | `nil` | Set by `burnable:SetFXOffset`, controls the spawn offset of FX children. |
| `inst.fxchildren` | table | `{}` | Set by `burnable`, collection of FX instances spawned on fuel use. |
| `inst.linked` | table | `{}` | Property of `placer` component; used to track linked entities (e.g., walls, winona devices). |
| `inst.linked_skinname` | string or `nil` | `nil` | Stores the current skin build name when it must be propagated to linked or child entities. |
| `inst.skin_id` | number or `nil` | `nil` | Unique ID for the active skin; used to retrieve skin data. |
| `inst.do_bank_swap` | boolean | `false` | Controls whether `floater` should swap animation banks when floating. |
| `inst.float_index` | number | `1` | Index for animation frame selection in `floater` when floating. |
| `inst.swap_data` | table | `nil` | Custom swap config for `floater`, containing `bank`, `anim`, `sym_name`, `sym_build`. |
| `inst.ison` | boolean | `false` | Boolean flag used by `machine` for lantern state. |

## Main functions
### `CreatePrefabSkin(name, info)`
* **Description:** Constructs a skin prefab with metadata and behavior definitions. Parses `info` to set up `init_fn`, `clear_fn`, sound and FX references, build overrides, and global tables (`BASE_TORSO_TUCK`, `SKIN_FX_PREFAB`, `SKIN_SOUND_FX`, etc.). Returns a fully formed skin table ready for use.
* **Parameters:**  
  - `name`: Skin prefab name (string).  
  - `info`: Table with fields: `base_prefab`, `type`, `skin_tags`, `init_fn`, `build_name_override`, `bigportrait`, `rarity`, `rarity_modifier`, `skins`, `skin_sound`, `is_restricted`, `granted_items`, `marketable`, `release_group`, `linked_beard`, `share_bigportrait_name`, `is_npc_base`, `torso_tuck_builds`, `torso_untuck_builds`, `torso_untuck_wide_builds`, `has_alternate_for_body`, `has_alternate_for_skirt`, `one_piece_skirt_builds`, `legs_cuff_size`, `feet_cuff_size`, `fx_prefab`.  
* **Returns:** Prefab table with skin metadata and entry points.

### `AddSkinSounds(inst)`
* **Description:** Applies skin-specific sound effects to an instance. Reads `SKIN_SOUND_FX[inst:GetSkinName()]` and assigns sound properties (`hit_skin_sound`, `skin_sound`, `skin_castsound`, etc.) to `inst`. Also configures `blinkstaff` via `SetSoundFX` and `SetFX` if present. Missing keys do not cause errors—only missing keys are skipped.
* **Parameters:**  
  - `inst`: Entity instance to which sounds are applied.  
* **Returns:** None.

### `RemoveSkinSounds(inst)`
* **Description:** Clears all skin-related sound properties set by `AddSkinSounds` and resets `blinkstaff` FX/sounds.
* **Parameters:**  
  - `inst`: Entity instance from which sounds are removed.  
* **Returns:** None.

### `basic_init_fn(inst, build_name, def_build, filter_fn)`
* **Description:** Core skin initialization. Sets build on `AnimState` using `build_name` or fallback `def_build`, applies optional `filter_fn` to derive skin name, updates inventory image if container is open (`container:IsOpen()`), and adjusts animation bank for floating (`floater`) entities.
* **Parameters:**  
  - `inst`: Entity instance.  
  - `build_name`: Skin build name (string).  
  - `def_build`: Default build fallback (string).  
  - `filter_fn`: Optional function mapping skin name to modified name.  
* **Returns:** None.

### `basic_clear_fn(inst, def_build)`
* **Description:** Reverts `basic_init_fn`. Restores default build on `AnimState`, resets inventory image name to default, and updates float animation if floating.
* **Parameters:**  
  - `inst`: Entity instance.  
  - `def_build`: Default build fallback (string).  
* **Returns:** None.

### `RemoveChargedFrom(input)`
* **Description:** Internal helper that removes the `"_charged"` suffix from `input`, e.g., converts `"spear_wathgrithr_lightning_charged"` to `"spear_wathgrithr_lightning"`.
* **Parameters:**  
  - `input`: String with optional `"_charged"` suffix.  
* **Returns:** String without `"_charged"` suffix.

### `LanternPostCommonInit(inst)`
* **Description:** After skin is applied to a lantern, traverses `inst.neighbour_lights`, triggers `OnSkinDirty()` on each, and pushes `"update_skin"` event to synchronize lighting effects.
* **Parameters:**  
  - `inst`: Lantern entity instance.  
* **Returns:** None.

### `LanternPostClearInit(inst)`
* **Description:** Same as `LanternPostCommonInit`, called after skin removal to restore default behavior across neighbor lanterns.
* **Parameters:**  
  - `inst`: Lantern entity instance.  
* **Returns:** None.

### `FixBeefBellInvIcon(inst, build_name)`
* **Description:** Updates inventory image name to include `"_linked"` suffix if `"nobundling"` tag is present.
* **Parameters:**  
  - `inst`: Entity instance.  
  - `build_name`: Skin build name (may be nil).  
* **Returns:** None.

### `AddSkinSounds(inst)` / `RemoveSkinSounds(inst)` (also documented above)
* **Description:** See `AddSkinSounds` and `RemoveSkinSounds` above.

### `LanternEnterLimbo(inst)`
* **Description:** Stores lantern FX last position before entering limbo.
* **Parameters:** `inst`.
* **Returns:** None.

### `LanternOn(inst)`
* **Description:** Turns on lantern FX: spawns if needed, sets parent, applies symbol overrides, and attaches as follower. Handles both held and placed states.
* **Parameters:** `inst`.
* **Returns:** None.

### `LanternOff(inst)`
* **Description:** Turns off lantern FX: detaches, kills or removes, depending on `KillFX`.
* **Parameters:** `inst`.
* **Returns:** None.

### `LanternOnRemoveFX(fx)`
* **Description:** Callback when lantern FX is removed; clears its `_lantern` reference.
* **Parameters:** `fx` — the FX entity.
* **Returns:** None.

### `CaneDoTrail(inst)`
* **Description:** Spawns a trail FX at a position near the owner, accounting for movement and mount status (via `rider:IsRiding()` and `locomotor:GetRunSpeed()`).
* **Parameters:** `inst`.
* **Returns:** None.

### `CaneEquipped(inst, data)`
* **Description:** Spawns and attaches VFX, starts periodic trail task when cane is equipped. `data.owner` provides the equipping entity.
* **Parameters:** `inst`, `data`.
* **Returns:** None.

### `CaneUnequipped(inst, owner)`
* **Description:** Removes VFX and cancels trail task on unequip/remove.
* **Parameters:** `inst`, `owner`.
* **Returns:** None.

### `IceboxOpened(inst)`
* **Description:** Spawns open FX and frost FX when icebox opens; applies skin symbols to frost FX.
* **Parameters:** `inst`.
* **Returns:** None.

### `IceboxClosed(inst)`
* **Description:** Removes frost FX when icebox closes or is removed.
* **Parameters:** `inst`.
* **Returns:** None.

### `ResearchLab2PushAnimation(inst, anim, loop)`
* **Description:** Pushes animation to main and highlight FX, sets up flashing effect if animation supports it.
* **Parameters:** `inst`, `anim`, `loop`.
* **Returns:** None.

### `ResearchLab2PlayAnimation(inst, anim, loop)`
* **Description:** Plays animation on main and highlight FX and triggers flashing.
* **Parameters:** `inst`, `anim`, `loop`.
* **Returns:** None.

### `ResearchLab2InitFn(inst, build_name)`
* **Description:** Initializes "researchlab2" skin. Sets skin, applies overrides, spawns highlight FX, assigns custom animation handlers, and initiates flashing.
* **Parameters:** `inst`, `build_name`.
* **Returns:** None.

### `ResearchLab2ClearFn(inst)`
* **Description:** Clears "researchlab2" skin. Resets build, clears overrides, removes FX, cancels flash tasks, restores default handlers.
* **Parameters:** `inst`.
* **Returns:** None.

### `ReviverInitFn(inst, build_name)`
* **Description:** Initializes "reviver" skin. Sets skin, updates image name, spawns FX as highlight children, plays skin sounds, fires `skin_switched`.
* **Parameters:** `inst`, `build_name`.
* **Returns:** None.

### `ReviverClearFn(inst)`
* **Description:** Clears "reviver" skin. Resets build and image name, removes FX children, restores default `PlayBeatAnimation`, clears sounds, fires `skin_switched`.
* **Parameters:** `inst`.
* **Returns:** None.

### `RecordInitFn(inst, build_name, trackname)`
* **Description:** Initializes "record" skin. Sets skin via `basic_init_fn`, sets `record_displayname`, sets `nameoverride` on `inspectable`, sets `songToPlay_skin`, sets `linked_skinname`, adds sounds.
* **Parameters:** `inst`, `build_name`, `trackname`.
* **Returns:** None.

### `RecordClearFn(inst)`
* **Description:** Clears "record" skin. Resets build from `recorddata`, restores name/image, clears `songToPlay_skin`, removes sounds.
* **Parameters:** `inst`.
* **Returns:** None.

### `BushHatInitFn(inst, build_name)`
* **Description:** Initializes "bushhat". Sets up `equipped`, `unequipped`, and `onremove` event listeners to manage VFX if `SKIN_FX_PREFAB` is present.
* **Parameters:** `inst`, `build_name`.
* **Returns:** None.

### `BushHatClearFn(inst)`
* **Description:** Clears "bushhat" skin and removes VFX listeners.
* **Parameters:** `inst`.
* **Returns:** None.

### `NightswordInitFn(inst, build_name)`
* **Description:** Initializes "nightsword" skin. Sets skin via `basic_init_fn`, parses `SKIN_FX_PREFAB`, registers `equipped`, `unequipped`, `onremove` callbacks.
* **Parameters:** `inst`, `build_name`.
* **Returns:** None.

### `NightswordClearFn(inst)`
* **Description:** Clears "nightsword" skin. Resets skin, removes VFX, unregisters callbacks.
* **Parameters:** `inst`.
* **Returns:** None.

### `LurePlantInitFn(inst, build_name)`
* **Description:** For placers: sets skin via `AnimState:SetSkin(build_name, "lureplant")`. For mastersim: gets skin data, sets `item_skinname`, calls `SetSkin()`.
* **Parameters:** `inst`, `build_name`.
* **Returns:** None.

### `LurePlantClearFn(inst)`
* **Description:** Resets build, clears `item_skinname`, calls `SetSkin()` on mastersim.
* **Parameters:** `inst`.
* **Returns:** None.

### `LurePlantBulbInitFn(inst, build_name)`
* **Description:** Sets skin via `AnimState:SetSkin(build_name, "lureplantbulb")` and updates inventory image.
* **Parameters:** `inst`, `build_name`.
* **Returns:** None.

### `LurePlantBulbClearFn(inst)`
* **Description:** Resets build and clears inventory image.
* **Parameters:** `inst`.
* **Returns:** None.

### `PetInitFn(inst, build_name, default_build)`
* **Description:** On mastersim: sets skin via `AnimState:SetSkin(build_name, default_build)`.
* **Parameters:** `inst`, `build_name`, `default_build`.
* **Returns:** None.

### `PetClearFn(inst, default_build)`
* **Description:** Resets pet to base build via `SetBuild`, removes VFX/sounds, clears `linked_skinname`.
* **Parameters:** `inst`, `default_build`.
* **Returns:** None.

### `CaneInitFn(inst, build_name)`
* **Description:** Initializes "cane" skin. Calls `basic_init_fn`, sets grass override, parses `SKIN_FX_PREFAB`, sets up VFX and trail, and registers `equipped`, `unequipped`, `onremove` callbacks.
* **Parameters:** `inst`, `build_name`.
* **Returns:** None.

### `CaneClearFn(inst)`
* **Description:** Clears "cane" skin. Calls `basic_clear_fn`, removes grass override, unregisters callbacks.
* **Parameters:** `inst`.
* **Returns:** None.

### `StaffInitFn(inst, build_name)`
* **Description:** Initializes "staffs" skin. Calls `basic_init_fn`, sets grass override, adds skin sounds (master only).
* **Parameters:** `inst`, `build_name`.
* **Returns:** None.

### `StaffClearFn(inst)`
* **Description:** Clears "staffs" skin. Calls `basic_clear_fn`, clears grass override, removes skin sounds.
* **Parameters:** `inst`.
* **Returns:** None.

### `OrangeStaffInitFn(inst, build_name)`
* **Description:** Initializes "orangestaff" skin. Calls `staff_init_fn`, parses `SKIN_FX_PREFAB`, sets VFX/trail, binds `cane_equipped`/`cane_unequipped`, configures `blinkstaff` FX.
* **Parameters:** `inst`, `build_name`.
* **Returns:** None.

### `OrangeStaffClearFn(inst)`
* **Description:** Clears "orangestaff" skin. Calls `staff_clear_fn`, removes callbacks, resets blinkstaff FX and sound.
* **Parameters:** `inst`.
* **Returns:** None.

### `LanternInitFn(inst, build_name, overridesymbols, followoffset)`
* **Description:** Initializes "lantern" skin. Sets skin, parses `SKIN_FX_PREFAB`, registers callbacks, and turns on FX if `machine.ison`.
* **Parameters:** `inst`, `build_name`, `overridesymbols`, `followoffset`.
* **Returns:** None.

### `LanternClearFn(inst)`
* **Description:** Clears "lantern" skin. Resets build, turns off FX, clears stored data and callbacks.
* **Parameters:** `inst`.
* **Returns:** None.

### `TorchInitFn`, `LighterInitFn`, `SpearInitFn`, `AxeInitFn`, `PickaxeInitFn`, `ShovelInitFn`, `HammerInitFn`, `RazorInitFn`, `FishingRodInitFn`, `UmbrellaInitFn`, `SlingshotInitFn`, `WobySmallInitFn`, `TrunkVestInitFn`, `HatInitFn`, `BeardHatInitFn`, `WinterHatInitFn`, `HiveHatInitFn`, `FootballHatInitFn`, `TopHatInitFn`, `FlowerHatInitFn`, `StrawHatInitFn`, `WalrusHatInitFn`, `RainHatInitFn`, `MinerHatInitFn`, `FeatherHatInitFn`, `BeeHatInitFn`, `WatermelonHatInitFn`, `BeefaloHatInitFn`, `EyebrellaHatInitFn`, `EarmuffsHatInitFn`, `RuinHatInitFn`, `PigHouseInitFn`, `ResearchLabInitFn`, `ChesterInitFn`, `GlommerFlowerInitFn`, `BundleWrapInitFn`, `AbigailInitFn`, `BugNetInitFn`, `CookPotInitFn`, `FireSuppressorInitFn`, `FirepitInitFn`, `CampfireInitFn`, `PetInitFn`, `CritterInitFn`, `MinisignInitFn`, `BoatInitFn`, `WalkingPlankInitFn`, `SteeringWheelInitFn`, `AnchorInitFn`, `MastInitFn`, `WallInitFn`, `FenceInitFn`, `FenceGateInitFn`, `RecordInitFn`, `BernieInitFn`, `ResearchLab4InitFn`, `IceBoxInitFn`, `GemSocketInitFn`, `MoleHatInitFn`, `PremiumWateringCanInitFn`, `MushroomFarmInitFn`, `DockWoodPostsInitFn`, `TrophyScaleFishInitFn`, `TrophyScaleOversizedVeggieInitFn`, `ResurrectionStatueInitFn`, `AntlionHatInitFn`, `WoodCarvedHatInitFn`, `NightStickInitFn`, `HawaiianShirtInitFn`, `IceHatInitFn`, `PumpkinHatInitFn`, `HermitCrabInitFn`, `HermitCrabLightPostInitFn`, `HermitHotSpringInitFn`, `HermitHouseInitFn`, `HermitChairRockingInitFn`, `HermitCrabTeashopInitFn`, and their corresponding clear functions
* **Description:** All follow patterns built on `basic_init_fn`/`basic_clear_fn`. Most set build, update inventory image, apply `AddSkinSounds`/`RemoveSkinSounds`, handle client/server replication, and/or fire custom events (e.g., `skin_switched`, `OnMeatRackSkinChanged`, `OnSlingshotSkinChanged`, `OnWobySkinChanged`). Some (e.g., lantern, cane, nightsword) include VFX/animation callbacks; others (e.g., winona, researchlab) manage overrides, linked items, or highlight FX.
* **Parameters:** `inst`, `build_name`, and optional extras (e.g., `opentop`, `fxoffset`, `trackname`, `default_build`, `anim_bank`, `facings`, `followoffset`).
* **Returns:** None.

### `SaddleBasicInitFn(inst, build_name)`
* **Description:** Calls `basic_init_fn` and sets swap data on `saddler` via `SetSwaps(build_name, "swap_saddle", inst.GUID)`.
* **Parameters:** `inst`, `build_name`.
* **Returns:** None.

### `SaddleBasicClearFn(inst)`
* **Description:** Clears skin and resets `saddler` swaps to defaults.
* **Parameters:** `inst`.
* **Returns:** None.

### `Wy78ScannerInitFn`, `PortableBlenderInitFn`, `PortableCookpotInitFn`, `PortableSpicerInitFn`
* **Description:** Sets `linked_skinname`, calls `basic_init_fn`, overrides inventory image to `build_name .. "_item"`, and adds sounds (for scanner variants).
* **Parameters:** `inst`, `build_name`.
* **Returns:** None.

### `DragonflyChestInitFn`, `TreasureChestInitFn`
* **Description:** Handles upgraded chest skins via `_chestupgrade_stacksize`, uses `basic_init_fn`, adds sounds.
* **Parameters:** `inst`, `build_name`.
* **Returns:** None.

### `MeatRackInitFn`
* **Description:** Calls `basic_init_fn("meat_rack")`, then fires `OnMeatRackSkinChanged(build_name)` on mastersim.
* **Parameters:** `inst`, `build_name`.
* **Returns:** None.

## Events & listeners
* **Listens to:**
  - `equipped` — VFX spawn and trail task start (cane, nightsword, orangestaff, bushhat).
  - `unequipped` — VFX removal and trail task cancel (cane, nightsword, orangestaff, bushhat, lantern).
  - `onremove` — cleanup of VFX (cane, nightsword, orangestaff, bushhat, lantern, icebox).
  - `takefuel` — spawns FX when fuel is consumed (firepit, campfire, coldfirepit skins).
  - `onopen` / `onclose` — controls FX state (icebox).
  - `lantern_on` / `lantern_off` — toggles lantern FX state.
* **Pushes:**
  - `skin_switched` — fired after init/clear for reviver and other skins via `:PushEvent("skin_switched")`.
  - `imagechange` — fired via `InventoryItem:ChangeImageName()` in `basic_init_fn`, `basic_clear_fn`, and many skin functions.
  - `OnMeatRackSkinChanged(build_name)` — fired by meat rack skins on mastersim.
  - `OnSlingshotSkinChanged(build_name)` — fired by slingshot skins.
  - `OnWobySkinChanged(build_name)` — fired by woby skins.
  - `OnBackpackSkinChanged(build_name)` — fired by backpack skins.
  - `update_skin` — pushed to neighbors for lantern skin updates.
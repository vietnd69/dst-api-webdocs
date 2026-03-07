---
id: slingshot
title: Slingshot
description: Manages the core functionality, visual layers, equipment, and projectile launching behavior for the slingshot weapon and its variants in DST.
tags: [combat, equipment, weapon]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8c810d92
system_scope: combat
---

# Slingshot

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `slingshot` prefab defines a highly flexible ranged weapon that supports interchangeable parts (band, frame, handle), layered inventory icons, skill-based modding, and multiple variants (basic, charged, double-ammo, magic-amplified). It integrates tightly with components like `weapon`, `container`, `equippable`, `linkeditem`, `slingshotmods`, `aoecharging`, `aoetargeting`, and `aoespell`. This prefab acts as the central hub for slingshot mechanics—including loading, firing, dynamic visual updates, skill validation, and skin handling—across all its incarnations.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("inventoryitem")
inst:AddComponent("equippable")
inst:AddComponent("weapon")
inst:AddComponent("container")
inst:AddComponent("linkeditem")
inst:AddComponent("slingshotmods")

inst:AddTag("slingshot")
inst:AddTag("rangedweapon")

inst.components.weapon:SetRange(TUNING.SLINGSHOT_DISTANCE, TUNING.SLINGSHOT_DISTANCE_MAX)
inst.components.weapon:SetProjectileOffset(1)
inst.components.container:WidgetSetup("slingshot")
inst.components.container.canbeopened = false
inst.components.container.stay_open_on_hide = true
```

## Dependencies & tags
**Components used:**  
`slingshotmods`, `linkeditem`, `clientpickupsoundsuppressor`, `inspectable`, `inventoryitem`, `equippable`, `weapon`, `container`, `burnable`, `hauntable`, `floatable`, `aoecharging`, `aoetargeting`, `aoespell`

**Tags:**  
`rangedweapon`, `slingshot`, `weapon`, `FX` (for slingshotparts_fx only)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `bandid` | `net_tinybyte` | `0` | Networked ID for the currently equipped band part. |
| `handleid` | `net_tinybyte` | `0` | Networked ID for the currently equipped handle part. |
| `frameid` | number | `nil` | Local ID for the currently equipped frame part (not networked). |
| `buildname` | `net_string` | `""` | Networked string representing the current skin build. |
| `_iconlayers` | table or `nil` | `nil` | Table defining layered inventory icon images; populated on part changes. |
| `fx` | table or `nil` | `nil` | List of FollowFX entities used during equipment to visually animate slingshot components on the player. |
| `projectilespeedmult` | number or `nil` | `nil` | Multiplier applied to projectile speed upon launch (used by some mods). |
| `voidbonusenabled` | boolean or `nil` | `nil` | Whether void bonus is enabled for the launched projectile. |
| `chargedmult` | number or `nil` | `nil` | Charge multiplier applied to damage when charging a shot. |
| `magicamplified` | boolean or `nil` | `nil` | Whether launched projectiles benefit from magic amplification. |
| `overrideammoslot` | number or `nil` | `nil` | Slot index to override default ammo consumption (e.g., slot 2 for special ammo). |

## Main functions
### `SetBandIcon(inst, name)`
* **Description:** Updates the slingshot’s band part icon by ID and triggers a refresh of layered inventory icons. Only affects non-networked state.
* **Parameters:**  
  `name` (string) — The prefab name of the band part (e.g., `"slingshot_band_leather"`).
* **Returns:** Nothing.

### `SetFrameIcon(inst, name)`
* **Description:** Updates the slingshot’s frame part ID. Unlike bands/handles, frames are not changed dynamically after spawn.
* **Parameters:**  
  `name` (string) — The prefab name of the frame part.
* **Returns:** Nothing.

### `SetHandleIcon(inst, name)`
* **Description:** Updates the slingshot’s handle part icon by ID and triggers layered icon refresh.
* **Parameters:**  
  `name` (string) — The prefab name of the handle part.
* **Returns:** Nothing.

### `OnIconDirty(inst)`
* **Description:** Rebuilds the `_iconlayers` table used by `LayeredInvImageFn` to render layered inventory icons, incorporating current band, frame, handle, and skin build. Fires the `imagechange` event.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnEquip(inst, owner)`
* **Description:** Initializes FollowFX entities and overrides animation symbols on the equipped owner (player or character) when the slingshot is equipped. Opens the container. Called by the `equippable` component.
* **Parameters:**  
  `inst` (entity) — The slingshot instance.  
  `owner` (entity) — The entity equipping the slingshot.
* **Returns:** Nothing.

### `OnUnequip(inst, owner)`
* **Description:** Cleans up FollowFX entities, restores owner animation states, clears overrides, and closes the container. Called by `equippable`.
* **Parameters:** Same as above.
* **Returns:** Nothing.

### `OnProjectileLaunched(inst, attacker, target, proj)`
* **Description:** Handles post-launch logic: sets projectile speed multiplier, void bonus, charged multiplier, and magic amplification; consumes the primary ammo stack; checks for special parts like mimic ammo.
* **Parameters:**  
  `inst` (entity) — The slingshot instance.  
  `attacker` (entity) — The entity that launched the projectile.  
  `target` (entity) — The target position or entity.  
  `proj` (entity) — The spawned projectile.
* **Returns:** Nothing.

### `OnAmmoLoaded(inst, data)`
* **Description:** Updates the `weapon` component’s projectile type based on the newly loaded ammo item. Adds the `ammoloaded` tag and fires `ammoloaded` on the ammo.
* **Parameters:**  
  `inst` (entity) — The slingshot.  
  `data` (table) — Event data containing `item` and `slot`.
* **Returns:** Nothing.

### `OnAmmoUnloaded(inst, data)`
* **Description:** Resets the `weapon` projectile type and removes the `ammoloaded` tag when ammo is removed. Fires `ammounloaded` events.
* **Parameters:** Same as above.
* **Returns:** Nothing.

### `OnInstalledPartsChanged(inst, part)`
* **Description:** Invoked when a slingshot part is installed or uninstalled. Calls the appropriate refresh function (`RefreshBand`, `RefreshFrame`, `RefreshHandle`) and updates linked owner info.
* **Parameters:**  
  `inst` (entity) — The slingshot.  
  `part` (entity) — The installed/uninstalled part entity.
* **Returns:** Nothing.

### `OnDeconstruct(inst, caster)`
* **Description:** Drops all container contents and slingshot parts when the slingshot is deconstructed.
* **Parameters:**  
  `inst` (entity) — The slingshot.  
  `caster` (entity) — The deconstruction source.
* **Returns:** Nothing.

### `OnBurnt(inst)`
* **Description:** Drops all container contents and slingshot parts upon burning.
* **Parameters:**  
  `inst` (entity) — The slingshot.
* **Returns:** Nothing.

### `RefreshBand(inst, owner)`, `RefreshFrame(inst)`, `RefreshHandle(inst)`
* **Description:** Updates animation symbols for slingshot parts on both the slingshot and the equipped owner, including overrides for custom build/symbol or fallbacks to skin-based overrides.
* **Parameters:**  
  `inst` (entity) — The slingshot.  
  `owner` (entity or `nil`) — Only used by `RefreshBand`.
* **Returns:** Nothing.

### `DisplayNameFn(inst)`
* **Description:** Generates a custom display name using the linked owner’s name (if available) and a localized format string (`STRINGS.NAMES.SLINGSHOT_FMT`).
* **Parameters:**  
  `inst` (entity) — The slingshot.
* **Returns:** string or `nil`.

### `GetStatus(inst, viewer)`
* **Description:** Returns `"NOT_MINE"` if the viewer is a slingshot sharpshooter and the slingshot belongs to another player. Used for inspection UI.
* **Parameters:**  
  `inst` (entity) — The slingshot.  
  `viewer` (entity) — The inspecting entity.
* **Returns:** `"NOT_MINE"` or `nil`.

## Events & listeners
- **Listens to:**  
  `icondirty` — Triggers `OnIconDirty` on client.  
  `itemget` — Fires `OnAmmoLoaded` when ammo is placed in the first slot.  
  `itemlose` — Fires `OnAmmoUnloaded` when ammo is removed.  
  `containerinstalleditem` / `containeruninstalleditem` — Fires `OnInstalledPartsChanged`.  
  `installreplacedslingshot` — Calls `UpdateLinkedItemOwner`.  
  `ondeconstructstructure` — Calls `OnDeconstruct`.  
  `floater_startfloating` / `floater_stopfloating` — Starts/stops float animation.  
  `equipped` / `unequipped` (variant-specific) — Triggers skill refresh and charging/timing logic in `slingshotex`, `slingshot999ex`, and `slingshot2ex`.  
  `onactivateskill_server` / `ondeactivateskill_server` (variant-specific) — Refreshes skill-based enabling of charging/targeting features.

- **Pushes:**  
  `imagechange` — Fired by `OnIconDirty` when icon layers are updated.  
  `ammoloaded`, `ammounloaded` — Fired on ammo items to notify of load/unload events.  
  `equipskinneditem`, `unequipskinneditem` — Variant-specific events when equipping skinned slingshots.
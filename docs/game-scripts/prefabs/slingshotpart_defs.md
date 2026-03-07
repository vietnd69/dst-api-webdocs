---
id: slingshotpart_defs
title: Slingshotpart Defs
description: Defines modding configurations and installation/uninstallation logic for slingshot parts (bands, frames, handles) in DST.
tags: [inventory, crafting, equipment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3d0d2bee
system_scope: inventory
---

# Slingshotpart Defs

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`slingshotpart_defs` is a data-only Lua table containing definitions for all slingshot upgrade parts (bands, frames, and handles) in DST. Each definition maps a part prefab name to its visual, gameplay, and behavioral attributes, including slot type, animations, associated crafting skill, and custom `oninstalledfn`/`onuninstalledfn` callbacks. These callbacks manage dynamic slingshot upgrades (e.g., range increases, projectile speed multipliers), slingshot replacement logic, tag management (e.g., `nosteal`, `stickygrip`), and event-driven state changes (e.g., void set synergy with `voidclothhat`). This file does not define a component class itself but serves as a configuration source for the `slingshotmods` component.

## Usage example
```lua
-- Example: Apply a band mod to a slingshot
local slingshot = CreateEntity()
slingshot:AddComponent("slingshotmods")
slingshot:AddComponent("weapon")
slingshot:AddComponent("container")

local band_def =defs["slingshot_band_pigskin"]
slingshot.components.slingshotmods:AddPart(band_def)
-- Installation logic runs automatically via oninstalledfn
```

## Dependencies & tags
**Components used:** `container`, `equippable`, `inventoryitem`, `slingshotmods`, `weapon`, `clientpickupsoundsuppressor`  
**Tags added:** `nosteal`, `stickygrip`, `equipped` (via event callback logic)  
**Tags removed:** `nosteal`, `stickygrip` (via event callback logic)  

## Properties
No public properties are defined in this file. It returns a plain table (`defs`) of预制体 definitions keyed by prefab name.

## Main functions
This file defines only *definition-attached* callbacks (not standalone functions), which are invoked by the `slingshotmods` component. The following are the key functions referenced in `defs`:

### `SetRange(slingshot, bonus)`
*   **Description:** Adjusts the slingshot's attack and hit range based on a numeric bonus using `TUNING` constants.
*   **Parameters:**  
    - `slingshot` (Entity) — The slingshot entity instance.  
    - `bonus` (number) — Range bonus to add to base slingshot distance.
*   **Returns:** Nothing.
*   **Error states:** N/A.

### `SetProjectileSpeedMult(slingshot, mult)`
*   **Description:** Sets the slingshot’s projectile speed multiplier (`projectilespeedmult`).
*   **Parameters:**  
    - `slingshot` (Entity) — The slingshot entity instance.  
    - `mult` (number or `nil`) — Speed multiplier; `nil` resets to default.
*   **Returns:** Nothing.

### `ReplaceSlingshot(slingshot, newprefab)`
*   **Description:** Replaces the current slingshot with a new prefab while preserving installed mods and transferring ammo. Used when frame upgrades require a different slingshot entity (e.g., `slingshot` → `slingshot2`).
*   **Parameters:**  
    - `slingshot` (Entity) — The current slingshot.  
    - `newprefab` (string) — Prefab name for the replacement.
*   **Returns:** Nothing.
*   **Error states:** May silently fail if `newprefab` does not exist or is invalid.

### `ReturnAmmoToOwner(slingshot, slot, owner)`
*   **Description:** Attempts to move ammo from a specific slingshot container slot to the owner’s inventory. Closes the slingshot container first to prevent recursion.
*   **Parameters:**  
    - `slingshot` (Entity) — The slingshot with the ammo.  
    - `slot` (number) — Container slot index.  
    - `owner` (Entity or `nil`) — The ammo’s owner entity; if `nil`, ammo is dropped instead.
*   **Returns:** Nothing.

### `MoveAmmoStack(slingshot, slot, newslingshot, newslot)`
*   **Description:** Moves ammo from one slingshot’s slot to another, respecting infinite stack size and overstack rules.
*   **Parameters:**  
    - `slingshot` (Entity) — Source slingshot.  
    - `slot` (number) — Source container slot.  
    - `newslingshot` (Entity) — Destination slingshot.  
    - `newslot` (number or `nil`) — Optional destination slot.
*   **Returns:** `true` if the move succeeded, `false` otherwise.
*   **Error states:** Returns `false` if destination container cannot accept the item.

### `TransferAmmo(slingshot, new)`
*   **Description:** Transfers all ammo from the current slingshot to another one during replacement.
*   **Parameters:**  
    - `slingshot` (Entity) — Source slingshot.  
    - `new` (Entity) — Replacement slingshot.
*   **Returns:** Nothing.

### `handle_sticky_onequipped(slingshot, data)`
*   **Description:** Adds `nosteal` and `stickygrip` tags to the slingshot when equipped (sticky handle mod).
*   **Parameters:**  
    - `slingshot` (Entity) — The slingshot instance.  
    - `data` (table) — Event data (unused).
*   **Returns:** Nothing.

### `handle_stick_onunequipped(slingshot, data)`
*   **Description:** Removes `nosteal` and `stickygrip` tags when the sticky-handle slingshot is unequipped.
*   **Parameters:**  
    - `slingshot` (Entity) — The slingshot instance.  
    - `data` (table) — Event data (unused).
*   **Returns:** Nothing.

### `handle_voidcloth_SetBuffEnabled(slingshot, enabled)`
*   **Description:** Enables/disables the voidcloth slingshot bonus based on `voidbonusenabled` flag.
*   **Parameters:**  
    - `slingshot` (Entity) — The slingshot instance.  
    - `enabled` (boolean) — Whether the bonus is active.
*   **Returns:** Nothing.

### `handle_voidcloth_SetBuffOwner(slingshot, owner)`
*   **Description:** Updates owner bindings for voidcloth handle synergy logic. Registers/unregisters equip/unequip listeners on the owner and checks for `voidclothhat` equipped.
*   **Parameters:**  
    - `slingshot` (Entity) — The slingshot instance.  
    - `owner` (Entity or `nil`) — The new owner entity.
*   **Returns:** Nothing.

### `handle_voidcloth_onequipped(slingshot, data)`
*   **Description:** Invoked when the voidcloth-handled slingshot is equipped; initializes owner-based state.
*   **Parameters:**  
    - `slingshot` (Entity) — The slingshot instance.  
    - `data` (table) — Event data, includes `owner`.
*   **Returns:** Nothing.

### `handle_voidcloth_onunequipped(slingshot, data)`
*   **Description:** Invoked when unequipped; clears owner bindings for the voidcloth handle.
*   **Parameters:**  
    - `slingshot` (Entity) — The slingshot instance.  
    - `data` (table) — Event data.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `equipped` — Slingshot equipped; triggers sticky/handle bond or voidcloth handle logic.  
  - `unequipped` — Slingshot unequipped; removes sticky tags or resets voidcloth handle.  
  - `equip` — Owner equipped item (used by voidcloth handle to detect `voidclothhat`).  
  - `unequip` — Owner unequipped item (used by voidcloth handle to detect hat removal).  
  - `installreplacedslingshot` — Pushed on the new slingshot after replacement.

- **Pushes:**  
  - `installreplacedslingshot` — Fired after `ReplaceSlingshot` to notify others of the upgrade.

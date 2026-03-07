---
id: waxwell
title: Waxwell
description: Defines the Waxwell character prefab, a magician-specialized player with shadow-minion management, sanity penalties, and shadow-level equipment announcements.
tags: [character, magician, sanity, pets, equip]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ef0beeca
system_scope: player
---

# Waxwell

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`waxwell` is a player character prefab that extends `MakePlayerCharacter` with specialized mechanics for shadow magic. It manages shadow creature minions via the `petleash` component, enforces sanity penalties for each active shadow minion, handles equipment-based sanity resistance for shadow items, and announces when equipping items with increasing shadow levels. It integrates closely with `reader`, `magician`, `sanity`, `health`, `hunger`, `foodaffinity`, and `skinner` components, and also modifies `dapperness` behavior for equipped items.

## Usage example
```lua
local inst = MakePlayerCharacter("waxwell", prefabs, assets, common_postinit, master_postinit)
-- This prefab is automatically instantiated by the game when selecting Waxwell as a character.
-- Modders typically reference its components via:
-- inst.components.petleash:GetPets()
-- inst.components.sanity:AddSanityPenalty(pet, TUNING.SHADOWWAXWELL_SANITY_PENALTY)
-- inst.components.magician:StopUsing()
```

## Dependencies & tags
**Components used:**  
- `builder` (`inst.components.builder.freebuildmode`)
- `equippable` (`IsEquipped`)
- `foodaffinity` (`AddPrefabAffinity`)
- `health` (`IsDead`, `IsInvincible`, `Kill`, `SetMaxHealth`)
- `hunger` (`SetMax`)
- `inventory` (`DropEverything`)
- `inventoryitem` (`IsHeldBy`)
- `magician` (`StopUsing`)
- `petleash` (`DespawnPet`, `GetMaxPets`, `GetPets`, `SetMaxPets`, `SetOnDespawnFn`, `SetOnSpawnFn`, `ondespawnfn`, `onspawnfn`)
- `reader` (`SetOnReadFn`, `SetSanityPenaltyMultiplier`)
- `sanity` (`AddSanityPenalty`, `IsInsane`, `RemoveSanityPenalty`, `SetMax`, `SetPercent`, `dapperness`, `get_equippable_dappernessfn`, `ignore`, `no_moisture_penalty`)
- `shadowcreaturespawner` (`SpawnShadowCreature`)
- `shadowlevel` (`GetCurrentLevel`, `level`)
- `skinner` (`CopySkinsFromPlayer`)
- `talker` (`Say`)

**Tags added/removed/checked:**  
- Added: `shadowmagic`, `dappereffects`, `magician`, `reader`, `quagmire_shopper`
- Checked: `shadowminion`, `shadowcreature`, `_combat`, `locomotor`, `INLIMBO`, `notaunt`, `playerghost`, `shadow_item`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `refusestobowtoroyalty` | boolean | `true` | Indicates Waxwell refuses to bow to royalty. |
| `starting_inventory` | table | (depends on game mode) | Starting items for the character. |
| `customidleanim` | function | `customidleanimfn` | Priority function for idle animation selection. |
| `customidlestate` | string | `"waxwell_funnyidle"` | Fallback idle animation state. |
| `soundsname` | string | `"maxwell"` | Sound bank identifier. |
| `_announceshadowlevel` | table | `{ task = nil, time = -math.huge, level = 0, levels = {} }` | State for shadow-level announcement cooldowns. |
| `is_snapshot_user_session` | boolean | `nil` | Used to suppress inventory drops during snapshot despawn. |

## Main functions
### `customidleanimfn(inst)`
* **Description:** Determines if Waxwell should use the `idle3_waxwell` animation based on proximity to a floating codex umbra book. This takes priority over `customidlestate`.
* **Parameters:** `inst` (entity) – Waxwell instance.
* **Returns:** String `"idle3_waxwell"` if a floating codex is within range; otherwise `nil`.
* **Error states:** None.

### `KillPet(pet)`
* **Description:** Recursively attempts to kill a shadow minion pet; reschedules if the pet is currently invincible.
* **Parameters:** `pet` (entity) – Shadow minion to kill.
* **Returns:** Nothing.
* **Error states:** Does nothing if pet has already been scheduled for killing (`pet._killtask ~= nil`).

### `OnSpawnPet(inst, pet)`
* **Description:** Called when a shadow minion pet spawns. Applies a sanity penalty for each minion and copies player skins. If the owner is dead, schedules pet for immediate termination.
* **Parameters:**  
  - `inst` (entity) – Waxwell instance.  
  - `pet` (entity) – Shadow minion spawned.
* **Returns:** Nothing.
* **Error states:** If `inst.components.builder.freebuildmode` is true (commented out), no sanity penalty is applied.

### `OnDespawnPet(inst, pet)`
* **Description:** Called when a shadow minion is despawned. Drops all inventory (except keepondeath items), then either initiates a `quickdespawn` state or removes the pet outright depending on snapshot context.
* **Parameters:**  
  - `inst` (entity) – Waxwell instance.  
  - `pet` (entity) – Shadow minion despawning.
* **Returns:** Nothing.

### `ReskinPet(pet, player, nofx)`
* **Description:** Synchronously or asynchronously (with minor delay) updates a pet’s skin to match the player’s current appearance.
* **Parameters:**  
  - `pet` (entity) – Shadow minion to reskin.  
  - `player` (entity) – Player whose skins to copy.  
  - `nofx` (boolean, optional) – Skip visual effects.
* **Returns:** Nothing.

### `OnSkinsChanged(inst, data)`
* **Description:** Responds to player skin changes (e.g., equipping clothing) by triggering skin updates on all shadow minions.
* **Parameters:**  
  - `inst` (entity) – Waxwell instance.  
  - `data` (table, optional) – May contain `{ nofx = true }` to skip FX.
* **Returns:** Nothing.

### `OnDeath(inst)`
* **Description:** On Waxwell’s death, schedules all shadow minions for termination with a randomized delay.
* **Parameters:** `inst` (entity) – Waxwell instance.
* **Returns:** Nothing.

### `OnBecameGhost(inst)`
* **Description:** Removes sanity penalties and listener for pet loss; despawns shadow minions; resets sanity to 50% with temporary immunity.
* **Parameters:** `inst` (entity) – Waxwell instance.
* **Returns:** Nothing.

### `ForceDespawnShadowMinions(inst)`
* **Description:** Despawns all shadow minions immediately (e.g., during roll-over events or world migration).
* **Parameters:** `inst` (entity) – Waxwell instance.
* **Returns:** Nothing.

### `OnDespawn(inst, migrationdata)`
* **Description:** Called on entity despawn; if `migrationdata` is present, forces all shadow minions to despawn.
* **Parameters:**  
  - `inst` (entity) – Waxwell instance.  
  - `migrationdata` (table or nil) – Non-nil triggers force despawn.
* **Returns:** Nothing.

### `OnReadFn(inst, book)`
* **Description:** Handles book reading while insane: spawns a shadow creature if under the global cap (`TUNING.BOOK_MAX_SHADOWCREATURES`) and sanity is active.
* **Parameters:**  
  - `inst` (entity) – Waxwell instance.  
  - `book` (entity) – The book being read.
* **Returns:** Nothing.
* **Error states:** Does nothing if sanity is not in an "insane" state.

### `OnLoad(inst)`
* **Description:** Restores state on character load: stops magician usage and immediately reskins shadow minions without FX.
* **Parameters:** `inst` (entity) – Waxwell instance.
* **Returns:** Nothing.

### `GetEquippableDapperness(owner, equippable)`
* **Description:** Calculates dapperness for equipped items, reducing it by `TUNING.WAXWELL_SHADOW_ITEM_RESISTANCE` for `shadow_item` items.
* **Parameters:**  
  - `owner` (entity) – Player entity.  
  - `equippable` (equippable component instance).
* **Returns:** Number – modified dapperness value.

### `DoAnnounceShadowLevel(inst, params, item)`
* **Description:** Announces via talker when Waxwell equips an item with a new or higher shadow level, respecting cooldowns (600s per level, 3s minimum spacing).
* **Parameters:**  
  - `inst` (entity) – Waxwell instance.  
  - `params` (table) – Shared state for announcements (`task`, `time`, `level`, `levels`).  
  - `item` (entity) – Item with `shadowlevel` component.
* **Returns:** Nothing.
* **Error states:** No announcement if item invalid, not equipped, not held, not owned by Waxwell, or cooldown in effect.

### `OnEquip(inst, data)`
* **Description:** Listener for `equip` events; schedules a delayed `DoAnnounceShadowLevel` call if the equipped item has a `shadowlevel` > 0.
* **Parameters:**  
  - `inst` (entity) – Waxwell instance.  
  - `data` (table) – Event payload containing `{ item = ... }`.
* **Returns:** Nothing.

### `OnUnequip(inst, data)`
* **Description:** Listener for `unequip` events; records the current time for shadow level cooldowns.
* **Parameters:**  
  - `inst` (entity) – Waxwell instance.  
  - `data` (table) – Event payload containing `{ item = ... }`.
* **Returns:** Nothing.

### `common_postinit(inst)`
* **Description:** Client-side initialization: adds tags, assigns AnimState overrides, and sets game-mode-specific tags (`quagmire_shopper`, `magician`, `reader`).
* **Parameters:** `inst` (entity) – Waxwell instance.
* **Returns:** Nothing.

### `master_postinit(inst)`
* **Description:** Server-side initialization: sets inventory, components (magician, reader, petleash), sanity/hunger/health stats, dapperness override, food affinity, event listeners, and mode-specific hooks.
* **Parameters:** `inst` (entity) – Waxwell instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onskinschanged` – triggers skin updates for minions.  
  - `death` – schedules minion termination.  
  - `ms_becameghost` – handles transition to ghost state and minion cleanup.  
  - `ms_playerreroll` – forces minion despawn during roll-over.  
  - `equip` – schedules shadow level announcements.  
  - `unequip` – updates cooldown timers for announcements.

- **Pushes:** None directly. Delegates talker announcements and component events to the game’s event system.


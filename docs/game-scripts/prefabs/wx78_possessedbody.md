---
id: wx78_possessedbody
title: Wx78 Possessedbody
description: Prefab for WX-78's possessed body form, a gestalt entity that links to a player owner and supports upgrade modules, planar state, and shield mechanics.
tags: [prefab, wx78, character, gestalt]
sidebar_position: 10
last_updated: 2026-05-01
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 8c8f7a1c
system_scope: entity
---

# Wx78 Possessedbody

> Based on game build **722832** | Last updated: 2026-05-01

## Overview
`wx78_possessedbody.lua` registers the WX-78 possessed body prefab, a gestalt entity that can link to a player owner via the `linkeditem` component. The prefab combines player-like stats (health, hunger, sanity) with WX-78-specific mechanics including upgrade modules, planar state toggling, and shield damage redirection. Client-side setup occurs in `fn()` before the master simulation guard; server-only initialization (components, stategraph, brain) runs after the `if not TheWorld.ismastersim` check.

## Usage example
```lua
-- Spawn the possessed body:
local inst = SpawnPrefab("wx78_possessedbody")
inst.Transform:SetPosition(0, 0, 0)

-- Attach to an owner (server only):
if TheWorld.ismastersim then
    inst:TryToAttachToOwner(player_inst)
end

-- Toggle planar state:
inst:SetIsPlanar(true)

-- Check current planar status:
local is_planar = inst:GetIsPlanar()
```

## Dependencies & tags
**External dependencies:**
- `prefabs/player_common_extensions` -- base player setup functions (footstep/foley overrides, symbol visibility)
- `prefabs/wx78_common` -- WX-78 shared initialization (upgrade modules, heat/dizzy FX, master setup)
- `brains/wx78_possessedbodybrain` -- AI behavior tree for the possessed body
- `MakeCharacterPhysics` -- applies physics and collision setup
- `MakeMediumBurnableCharacter` -- registers burnable behavior for medium characters
- `MakeLargeFreezableCharacter` -- registers freezable behavior for large characters

**Components used:**
- `linkeditem` -- links the body to an owner player via UserID
- `health` -- HP with no fadeout on death
- `hunger` -- hunger stats with gear-eating capability
- `sanity` -- sanity with negative aura modifier for gestalt state
- `combat` -- attack damage with custom multipliers for planar/shadow weapons
- `follower` -- follows leader, triggers attachment on leader change
- `trader` -- accepts items from players
- `wx78_shield` -- shield damage redirection before health damage
- `upgrademoduleowner` -- manages upgrade module slots and charge
- `inventory` -- holds items, disables drop on death
- `skinner` -- copies skins from owner player
- `embarker` -- boat boarding speed
- `locomotor` -- movement handling
- `maprevealable` -- shows icon on map for other players
- `debuffable` -- debuff visual follow symbol
- `damagetyperesist` / `damagetypebonus` -- lunar/shadow damage modifiers
- `burnable` / `freezable` -- environmental status effects
- `hauntable` -- ghost haunt interactions
- `efficientuser` -- attack action multiplier
- `lootdropper` / `timer` / `planardamage` / `planardefense` / `sheltered` / `wx78_abilitycooldowns` / `luckuser` -- additional gameplay systems

**Tags:**
- `NOBLOCK` -- added in fn()
- `scarytoprey` -- added in fn()
- `character` -- added in fn()
- `possessedbody` -- added in fn()
- `player_damagescale` -- added in fn()
- `gestalt` -- added in fn()
- `upgrademoduleowner` -- added in fn()
- `wx78_shield` -- added in fn()
- `trader` -- added in fn()
- `alltrader` -- added in fn()
- `canseeindark` -- added in fn()
- `lunar_aligned` -- added in fn()
- `electricdamageimmune` -- added in fn()

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | --- | Array of Asset entries for animations, sounds, and scripts loaded with this prefab. |
| `prefabs` | table | --- | Array of dependent prefab names (explode_reskin, collapse_small, globalmapiconunderfog, plus WX78Common dependencies). |
| `TUNING.WX78_HEALTH` | constant | --- | Max health applied to health component on master. |
| `TUNING.WX78_HUNGER` | constant | --- | Max hunger applied to hunger component on master. |
| `TUNING.WX78_SANITY` | constant | --- | Max sanity applied to sanity component on master. |
| `TUNING.WX78_INITIAL_MAXCHARGELEVEL` | constant | --- | Default max charge level for upgrademoduleowner when owner has no upgrademoduleowner component. |
| `TUNING.SKILLS.WX78.POSSESSEDBODY_NEGATIVE_SANITY_AURA_MODIFIER` | constant | --- | Sanity aura penalty applied while in non-planar possessed body form. |
| `TUNING.SKILLS.WX78.PLANARPOSSESSEDBODY_NEGATIVE_SANITY_AURA_MODIFIER` | constant | --- | Sanity aura penalty applied while in planar possessed body form. |
| `TUNING.SKILLS.WX78.PLANARPOSSESSEDBODY_DAMAGE_MULT` | constant | --- | Damage multiplier when in planar state (normal attacks). |
| `TUNING.SKILLS.WX78.POSSESSEDBODY_DAMAGE_MULT` | constant | --- | Damage multiplier when not in planar state (normal attacks). |
| `TUNING.SKILLS.WX78.PLANARPOSSESSEDBODY_PLANAR_SHADOW_DAMAGE_MULT` | constant | --- | Damage multiplier for planar state attacks with shadow_item weapons (special attacks). |
| `TUNING.SKILLS.WX78.PLANARPOSSESSEDBODY_PLANAR_DAMAGE_MULT` | constant | --- | Damage multiplier for planar state attacks without shadow_item weapons (special attacks). |
| `TUNING.SKILLS.WX78.POSSESSEDBODY_PLANAR_DAMAGE_MULT` | constant | --- | Damage multiplier for non-planar state attacks (special attacks). |
| `TUNING.SKILLS.WX78.POSSESSEDBODY_LUNAR_RESIST` | constant | --- | Lunar-aligned damage resistance percentage. |
| `TUNING.SKILLS.WX78.POSSESSEDBODY_VS_SHADOW_BONUS` | constant | --- | Bonus damage percentage against shadow-aligned targets. |
| `PLANAR_BIT` | constant (local) | `1` | Bit flag for planar state in planarflags netvar. |
| `SHOWN_BIT` | constant (local) | `2` | Bit flag for FX visibility in planarflags netvar. |

## Main functions
### `fn()`
* **Description:** Prefab constructor that runs on both client and server. Creates the entity, sets up physics, animation, and client-side components. On master, continues to attach gameplay components (health, hunger, sanity, combat, etc.), stategraph, and brain. Returns `inst` for framework to branch into master_postinit logic.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None — engine guarantees valid entity creation.

### `SpawnBigSpark(inst)` (local)
* **Description:** Spawns a wx78_big_spark prefab and aligns it to the target inst. Used when all upgrade modules are removed and workable has no work left.
* **Parameters:** `inst` -- entity to align spark to
* **Returns:** None
* **Error states:** None.

### `DisplayNameFn(inst)` (local)
* **Description:** Returns the formatted display name for the possessed body, including the owner's name via linkeditem component. Returns nil if no owner name is available.
* **Parameters:** `inst` -- possessed body entity
* **Returns:** Formatted string or `nil`
* **Error states:** Errors if `inst` has no `linkeditem` component (nil dereference on `inst.components.linkeditem` — no guard present in source).

### `GetSpecialDescription(inst, viewer)` (local)
* **Description:** Returns a custom inspection description that includes the owner's name. Returns nil if viewer is a ghost or no description string exists.
* **Parameters:**
  - `inst` -- possessed body entity
  - `viewer` -- player entity inspecting the body
* **Returns:** Formatted description string or `nil`
* **Error states:** Errors if `inst` has no `linkeditem` component (nil dereference on `inst.components.linkeditem` — no guard present in source).

### `CheckCircuitSlotStatesFrom(inst, owner)` (local)
* **Description:** Syncs the possessed body's max charge level from the owner's upgrademoduleowner component, then sets current charge to max (gestalt bodies are always fully charged).
* **Parameters:**
  - `inst` -- possessed body entity
  - `owner` -- player entity owning the body
* **Returns:** None
* **Error states:** None — owner and owner.components.upgrademoduleowner accesses are guarded by nil checks.

### `TryToAttachToOwner(inst, owner)` (local)
* **Description:** Attempts to link the possessed body to an owner player. Checks backup body availability, copies skins from player if applicable, spawns skin swap FX, and initializes circuit slot states. Returns false if owner is nil, is a snapshot user, or already has a linked owner.
* **Parameters:**
  - `inst` -- possessed body entity
  - `owner` -- player entity to attach to
* **Returns:** `true` on successful attachment, `false` on failure
* **Error states:** None — linkeditem access is guarded by nil check.

### `TryToAttachToLeader(inst)` (local)
* **Description:** Retrieves the leader from the follower component and attempts to attach to them. Removes any pending skilltree initialization callback. Kills the possessed body if attachment fails.
* **Parameters:** `inst` -- possessed body entity
* **Returns:** None
* **Error states:** Errors if `inst` has no `follower` component (nil dereference on `inst.components.follower` — no guard present in source).

### `OnChangedLeader(inst, new_leader, prev_leader)` (local)
* **Description:** Handles leader changes for the follower component. Unlinks from previous owner, removes skilltree callbacks, and either attempts attachment to new leader or kills/dormantizes the body if leader is lost.
* **Parameters:**
  - `inst` -- possessed body entity
  - `new_leader` -- new leader entity or nil
  - `prev_leader` -- previous leader entity or nil
* **Returns:** None
* **Error states:** None — both linkeditem and health accesses are guarded.

### `AttachClassified_wx78(inst, classified)` (local)
* **Description:** Stores reference to wx78_classified entity and registers onremove listener to clean up on detach.
* **Parameters:**
  - `inst` -- possessed body entity
  - `classified` -- wx78_classified child entity
* **Returns:** None
* **Error states:** None.

### `DetachClassified_wx78(inst)` (local)
* **Description:** Clears wx78_classified reference and detach callback.
* **Parameters:** `inst` -- possessed body entity
* **Returns:** None
* **Error states:** None.

### `OnSkillTreeInitializedFn(inst, owner)` (local)
* **Description:** Called when owner's skill tree initializes. Attempts to add the possessed body as a backup body via wx78_classified. If failed, unlinks the body; otherwise syncs circuit slot states.
* **Parameters:**
  - `inst` -- possessed body entity
  - `owner` -- player entity
* **Returns:** None
* **Error states:** None — linkeditem access is guarded.

### `OnOwnerInstCreatedFn(inst, owner)` (local)
* **Description:** Placeholder callback for when owner entity is created. Currently does nothing (globaltrackingicon line is commented out).
* **Parameters:**
  - `inst` -- possessed body entity
  - `owner` -- player entity
* **Returns:** None
* **Error states:** None.

### `OnOwnerInstRemovedFn(inst, owner)` (local)
* **Description:** Called when owner entity is removed. Attempts to remove the possessed body from the owner's backup body list via wx78_classified.
* **Parameters:**
  - `inst` -- possessed body entity
  - `owner` -- player entity or nil
* **Returns:** None
* **Error states:** None.

### `OnAttacked(inst, data)` (local)
* **Description:** Kills the possessed body if the attacker is a leader who has this body as a follower (prevents self-damage from leader).
* **Parameters:**
  - `inst` -- possessed body entity
  - `data` -- event data table with `attacker` field
* **Returns:** None
* **Error states:** Errors if `inst` has no `health` component or `data.attacker` has no `leader` component (nil dereference — no guard present in source).

### `TryToReplaceWithBackupBody(inst, gestaltalive)` (local)
* **Description:** Spawns a wx78_backupbody at the possessed body's position, transfers stats (health, hunger, sanity), activates the backup body, configures it as possessed if gestaltalive is true, and removes the current possessed body. Always removes the possessed body regardless of success.
* **Parameters:**
  - `inst` -- possessed body entity
  - `gestaltalive` -- boolean whether to configure backup as possessed
* **Returns:** `true` on successful replacement, `false` if backup activation fails
* **Error states:** Errors if `inst` has no `health`, `hunger`, `sanity`, `upgrademoduleowner`, `activatable`, or `linkeditem` component (nil dereference — no guard present in source).

### `CreateGestaltFx()` (local)
* **Description:** Creates a non-networked child entity for planar affinity visual effects. Sets up anim state with lunar affinity FX bank/build, bloom effects, and follower component to track the parent's head symbol.
* **Parameters:** None
* **Returns:** FX entity instance
* **Error states:** None.

### `OnPlanarFlagsDirty(inst)` (local)
* **Description:** Property watcher callback for planarflags netvar dirty event. Updates gestaltfx animation and visibility based on planar state and shown bit flags.
* **Parameters:** `inst` -- possessed body entity
* **Returns:** None
* **Error states:** None.

### `SetPlanarBit(inst, flag, val)` (local)
* **Description:** Sets or clears a specific bit in the planarflags netvar. Triggers OnPlanarFlagsDirty if value changed.
* **Parameters:**
  - `inst` -- possessed body entity
  - `flag` -- bit flag (PLANAR_BIT or SHOWN_BIT)
  - `val` -- boolean to set or clear the flag
* **Returns:** None
* **Error states:** None.

### `SetPlanarFxShown(inst, shown)` (local)
* **Description:** Convenience wrapper to set the SHOWN_BIT in planarflags, controlling gestaltfx visibility.
* **Parameters:**
  - `inst` -- possessed body entity
  - `shown` -- boolean visibility state
* **Returns:** None
* **Error states:** None.

### `SetIsPlanar(inst, planar)` (local)
* **Description:** Toggles the planar state of the possessed body. Adds or removes planarentity component, updates sanity negative aura modifier based on state, and sets the PLANAR_BIT in planarflags.
* **Parameters:**
  - `inst` -- possessed body entity
  - `planar` -- boolean planar state
* **Returns:** None
* **Error states:** Errors if `inst` has no `sanity` component (nil dereference on `inst.components.sanity` — no guard present in source).

### `GetIsPlanar(inst)` (local)
* **Description:** Returns the current planar state by checking the PLANAR_BIT in planarflags netvar.
* **Parameters:** `inst` -- possessed body entity
* **Returns:** `true` if planar, `false` otherwise
* **Error states:** None.

### `WeaponPercentChanged(inst, data)` (local)
* **Description:** Listens for weapon durability reaching 0%. Pushes toolbroke event to the inventory item's owner if the possessed body has no rechargeable component.
* **Parameters:**
  - `inst` -- possessed body entity
  - `data` -- event data with `percent` field
* **Returns:** None
* **Error states:** None — inventoryitem and owner accesses are guarded.

### `OnEquip(inst, data)` (local)
* **Description:** Registers WeaponPercentChanged listener on the equipped item for percentusedchange events.
* **Parameters:**
  - `inst` -- possessed body entity
  - `data` -- event data with `item` field
* **Returns:** None
* **Error states:** None.

### `OnUnequip(inst, data)` (local)
* **Description:** Removes WeaponPercentChanged listener from the unequipped item.
* **Parameters:**
  - `inst` -- possessed body entity
  - `data` -- event data with `item` field
* **Returns:** None
* **Error states:** None.

### `ShouldAcceptItem(inst, item, giver, count)` (local)
* **Description:** Trader accept test function. Returns true if the item has an inventoryitem component.
* **Parameters:**
  - `inst` -- possessed body entity
  - `item` -- item entity being traded
  - `giver` -- player entity giving the item
  - `count` -- number of items
* **Returns:** `true` if item has inventoryitem component, `false` otherwise
* **Error states:** None.

### `OnGetItem(inst, giver, item, count)` (local)
* **Description:** Trader onaccept callback. Currently does nothing.
* **Parameters:**
  - `inst` -- possessed body entity
  - `giver` -- player entity
  - `item` -- item entity
  - `count` -- number of items
* **Returns:** None
* **Error states:** None.

### `CustomCombatDamage(inst, target, weapon, multiplier, mount)` (local)
* **Description:** Custom damage multiplier function for combat component. Returns planar shadow damage multiplier if weapon has shadow_item tag and no mount; otherwise returns planar or non-planar damage multiplier based on current state.
* **Parameters:**
  - `inst` -- possessed body entity
  - `target` -- target entity
  - `weapon` -- weapon entity or nil
  - `multiplier` -- base damage multiplier
  - `mount` -- mount entity or nil
* **Returns:** Damage multiplier number
* **Error states:** None.

### `CustomSPCombatDamage(inst, target, weapon, multiplier, mount)` (local)
* **Description:** Custom special attack damage multiplier function. Similar to CustomCombatDamage but uses different TUNING constants for special attack damage multipliers.
* **Parameters:**
  - `inst` -- possessed body entity
  - `target` -- target entity
  - `weapon` -- weapon entity or nil
  - `multiplier` -- base damage multiplier
  - `mount` -- mount entity or nil
* **Returns:** Damage multiplier number
* **Error states:** None.

### `OnSanityDelta(inst, data)` (local)
* **Description:** Kills the possessed body if sanity reaches 0% and the body is not already dead.
* **Parameters:**
  - `inst` -- possessed body entity
  - `data` -- event data with `newpercent` field
* **Returns:** None
* **Error states:** Errors if `inst` has no `health` component (nil dereference — no guard present in source).

### `ArmorBroke(inst, data)` (local)
* **Description:** Auto-equips the next available armor from inventory when current armor breaks. Prioritizes same prefab type, then any equippable armor.
* **Parameters:**
  - `inst` -- possessed body entity
  - `data` -- event data with `armor` field
* **Returns:** None
* **Error states:** Errors if `inst` has no `inventory` component (nil dereference — no guard present in source).

### `OnUpgradeModuleAdded(inst, moduleent)` (local)
* **Description:** Called when an upgrade module is added. Updates the wx78_classified upgrademodulebars netvar with the new module's netid.
* **Parameters:**
  - `inst` -- possessed body entity
  - `moduleent` -- upgrade module entity
* **Returns:** None
* **Error states:** Errors if `inst.wx78_classified` is nil or `moduleent` has no `upgrademodule` component (nil dereference — no guard present in source).

### `OnUpgradeModuleRemoved(inst, moduleent)` (local)
* **Description:** Called when an upgrade module is removed. Currently does nothing (TODO in source).
* **Parameters:**
  - `inst` -- possessed body entity
  - `moduleent` -- upgrade module entity
* **Returns:** None
* **Error states:** None.

### `OnOneUpgradeModulePopped(inst, moduleent, was_activated)` (local)
* **Description:** Called when a single upgrade module is popped. Deducts charge cost from upgrademoduleowner (with skill tree discount if wx78_circuitry_bettercharge is active). Clears the module slot in wx78_classified upgrademodulebars.
* **Parameters:**
  - `inst` -- possessed body entity
  - `moduleent` -- upgrade module entity
  - `was_activated` -- boolean whether module was charged
* **Returns:** None
* **Error states:** Errors if `inst` has no `linkeditem`, `upgrademoduleowner`, or `moduleent` has no `upgrademodule` component (nil dereference — no guard present in source).

### `OnAllUpgradeModulesRemoved(inst)` (local)
* **Description:** Called when all upgrade modules are removed. Spawns big spark FX if workable has no work left, pushes upgrademoduleowner_popallmodules event, and clears all module slots in wx78_classified.
* **Parameters:** `inst` -- possessed body entity
* **Returns:** None
* **Error states:** Errors if `inst` has no `workable` or `wx78_classified` component (nil dereference — no guard present in source).

### `RedirectToWxShield(inst, amount, overtime, cause, ignore_invincible, afflicter, ignore_absorb)` (local)
* **Description:** Health delta modifier function that redirects damage to wx78_shield component if present. Returns modified damage amount after shield absorption.
* **Parameters:**
  - `inst` -- possessed body entity
  - `amount` -- damage amount
  - `overtime` -- boolean for damage over time
  - `cause` -- damage cause entity
  - `ignore_invincible` -- boolean
  - `afflicter` -- damage source entity
  - `ignore_absorb` -- boolean
* **Returns:** Modified damage amount (0 if shield is impenetrable)
* **Error states:** None — guarded by `~= nil` check on wx78_shield component.

### `OnSave(inst, data)` (local)
* **Description:** Saves max charge, planar state, and current health/hunger/sanity/shield values to the save table. WX-78 manually saves these stats because component OnLoad would override them with default max values.
* **Parameters:**
  - `inst` -- possessed body entity
  - `data` -- save table to populate
* **Returns:** None
* **Error states:** Errors if `inst` has no `health`, `hunger`, `sanity`, `wx78_shield`, or `upgrademoduleowner` component (nil dereference — no guard present in source).

### `OnLoad(inst, data, newents)` (local)
* **Description:** Restores max charge, planar state, and current health/hunger/sanity/shield values from the save table. Applied after component OnLoad to override default max values.
* **Parameters:**
  - `inst` -- possessed body entity
  - `data` -- save table with saved values
  - `newents` -- entity remap table (unused)
* **Returns:** None
* **Error states:** Errors if `inst` has no `health`, `hunger`, `sanity`, `wx78_shield`, or `upgrademoduleowner` component (nil dereference — no guard present in source).

### `OnLoadPostPass(inst, owner)` (local)
* **Description:** Called after load post-pass. Attempts to replace the possessed body with a backup body (gestaltalive = true).
* **Parameters:**
  - `inst` -- possessed body entity
  - `owner` -- owner entity (unused in function body)
* **Returns:** None
* **Error states:** None.



## Events & listeners
**Listens to:**
- `planarflagsdirty` (client only) — triggers OnPlanarFlagsDirty; updates gestaltfx animation and visibility. Data: none
- `attacked` — triggers OnAttacked; kills body if attacker is leader with this body as follower. Data: `{attacker = entity}`
- `sanitydelta` — triggers OnSanityDelta; kills body if sanity reaches 0%. Data: `{newpercent = number}`
- `armorbroke` — triggers ArmorBroke; auto-equips next available armor from inventory. Data: `{armor = entity}`
- `equip` — triggers OnEquip; registers weapon durability listener on equipped item. Data: `{item = entity}`
- `unequip` — triggers OnUnequip; removes weapon durability listener from unequipped item. Data: `{item = entity}`
- `ms_skilltreeinitialized` (on leader) — triggers skilltree initialization callback for attachment. Data: none
- `onremove` (on wx78_classified) — triggers DetachClassified_wx78 cleanup. Data: none

**Pushes:**
- `become_dormant` — pushed when previous leader dies but wasn't dead (OnChangedLeader). Data: none
- `upgrademoduleowner_popallmodules` — pushed when all upgrade modules are removed. Data: none
- `toolbroke` (to owner) — pushed when equipped weapon durability reaches 0%. Data: `{tool = entity}`

**World state watchers:**
- None.
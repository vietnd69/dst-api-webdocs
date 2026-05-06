---
id: ghost
title: Ghost
description: "Prefab file that registers two ghost entity types: the standard player ghost and Wendy's grave guard ghost variant, each with combat, aura, and trader components."
tags: [prefab, ghost, entity, undead]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 179a81b3
system_scope: entity
---

# Ghost

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`ghost.lua` registers two spawnable ghost entity prefabs. The primary `ghost` prefab represents the standard player ghost form with hostility toward non-allies and sanity drain aura. The `graveguard_ghost` prefab is Wendy's decorated grave guard variant with modified targeting logic that respects ghost-friendly tags and PvP settings. Both prefabs attach combat, health, aura, sanityaura, locomotor, and trader components, and are linked to their respective brain files for AI behavior.

## Usage example
```lua
-- Spawn standard ghost at position:
local ghost_inst = SpawnPrefab("ghost")
ghost_inst.Transform:SetPosition(10, 0, 10)

-- Spawn grave guard ghost:
local guard_inst = SpawnPrefab("graveguard_ghost")

-- Link grave guard to a gravestone (master only):
if TheWorld.ismastersim then
    guard_inst.LinkToHome(guard_inst, gravestone_inst)
end
```

## Dependencies & tags
**External dependencies:**
- `brains/ghostbrain` -- AI behavior tree for standard ghost
- `brains/graveguard_ghostbrain` -- AI behavior tree for grave guard ghost
- `MakeGhostPhysics` -- applies ghost-specific physics configuration
- `TUNING` -- global constants table for balance values

**Components used:**
- `locomotor` -- movement speed configuration (walkspeed, runspeed, directdrive)
- `sanityaura` -- drains sanity of nearby players (-TUNING.SANITYAURA_MED)
- `health` -- sets max health to TUNING.GHOST_HEALTH
- `combat` -- damage output and target tracking with custom keep target function
- `aura` -- periodic damage aura with custom test function
- `trader` -- accepts heart items for flavor text (always rejects via AbleToAcceptTest)
- `inspectable` -- allows players to examine the ghost
- `knownlocations` -- (graveguard only) remembers gravestone home position
- `timer` -- (graveguard only) tracks "played_recently" timer

**Tags:**
- `ghost` -- added to both variants for ghost-specific interactions
- `flying` -- added to both variants for movement classification
- `noauradamage` -- added to both variants to prevent receiving aura damage
- `trader` -- added to both variants for trader component optimization
- `monster` -- added to standard ghost for combat targeting
- `hostile` -- added to standard ghost for aggression classification
- `graveghost` -- added to graveguard variant only

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | --- | Array of Asset entries for animation and sound files loaded with both prefabs. |
| `GRAVEGUARD_SCRAPBOOK_OVERRIDEDARA` | constant (local) | `{{ "ghost_eyes", "ghost_build", "ghost_eyes_happy" }}` | (graveguard) File-scope constant defining symbol override data for scrapbook rendering. |
| `GUARD_AURA_SAFE_TAGS` | constant (local) | `{"abigail", "ghostlyfriend"}` | (graveguard) Tags that exempt targets from graveguard aura aggression. |
| `GUARD_AURA_UNSAFE_TAGS` | constant (local) | `{"hostile", "monster"}` | (graveguard) Tags that mark targets for graveguard aura aggression. |

## Main functions

### `fn()`
* **Description:** Client-side constructor for the standard ghost prefab. Creates entity, applies ghost physics, configures light and animation, adds tags, and plays ambient howl sound. On master sim, attaches brain, stategraph, and all gameplay components (locomotor, sanityaura, health, combat, aura, trader, inspectable). Returns `inst` for engine processing.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None — runs on every host with master-only branching for gameplay components.

### `graveguard_fn()`
* **Description:** Client-side constructor for Wendy's grave guard ghost variant. Similar to `fn()` but with modified eye symbol override (happy eyes), different multicolour tint, and additional components (knownlocations, timer). On master sim, attaches graveguard-specific brain, custom aura test function, and gravestone linking functionality. Sets `persists = false` to prevent world save.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None — runs on every host with master-only branching for gameplay components.

### `AbleToAcceptTest(inst, item)` (local)
* **Description:** Trader component test function that determines if the ghost can accept a trade item. Always returns `false` with reason string `"GHOSTHEART"` if item has "reviver" tag, otherwise returns `false` with `nil` reason. Used to trigger flavor text when players attempt to give hearts.
* **Parameters:**
  - `inst` -- ghost entity instance
  - `item` -- item entity being offered for trade
* **Returns:** `false, reason_string` or `false, nil`
* **Error states:** Errors if `item` is nil and trader component does not guard before calling test function (no nil guard before `item:HasTag()` call in this function).

### `OnDeath(inst)` (local)
* **Description:** Event callback fired when ghost dies. Disables the aura component to stop periodic damage ticks. Called via `inst:ListenForEvent("death", OnDeath)`.
* **Parameters:** `inst` -- ghost entity instance
* **Returns:** None
* **Error states:** Errors if `inst.components.aura` is nil (component not attached).

### `AuraTest(inst, target)` (local)
* **Description:** Aura component test function for standard ghost. Returns `true` if target should receive aura damage. Targets are damaged if they are the ghost's combat target, if the ghost is their combat target, or if they lack "abigail", "ghostlyfriend", or "ghost_ally" tags.
* **Parameters:**
  - `inst` -- ghost entity instance
  - `target` -- potential aura damage recipient entity
* **Returns:** `true` to apply damage, `false` to skip
* **Error states:** Errors if `inst.components.combat` or `target.components.combat` is nil.

### `OnAttacked(inst, data)` (local)
* **Description:** Event callback fired when ghost is attacked. Sets combat target to the attacker unless attacker has "noauradamage" tag. Clears target if attacker is nil. Called via `inst:ListenForEvent("attacked", OnAttacked)`.
* **Parameters:**
  - `inst` -- ghost entity instance
  - `data` -- event data table with `attacker` field
* **Returns:** None
* **Error states:** Errors if `inst.components.combat` is nil (no guard present) or if `data.attacker` is non-nil but lacks `HasTag` method.

### `KeepTargetFn(inst, target)` (local)
* **Description:** Combat component keep target function for standard ghost. Returns `true` to maintain target if within TUNING.GHOST_FOLLOW_DSQ distance squared. Clears `inst.brain.followtarget` and returns `false` if target is too far.
* **Parameters:**
  - `inst` -- ghost entity instance
  - `target` -- current combat target entity
* **Returns:** `true` to keep target, `false` to drop
* **Error states:** Errors if `inst:GetDistanceSqToInst()` fails on invalid target.

### `target_test(inst, target, pvp_enabled)` (local)
* **Description:** Internal targeting test for graveguard variant. Determines if target should be aggressively targeted based on PvP settings, ghost-friendly tags, and combat target relationships. Returns `false` for players with PvP off or targets with safe tags. Returns `true` for targets attacking the ghost or their leader.
* **Parameters:**
  - `inst` -- graveguard entity instance
  - `target` -- potential target entity
  - `pvp_enabled` -- boolean or nil (queries TheNet if nil)
* **Returns:** `true` to target, `false` to ignore
* **Error states:** Errors if `target.components.combat` is nil when expected, or if TheNet methods fail.

### `GuardAuraTest(inst, target)` (local)
* **Description:** Aura component test function for graveguard variant. Combines tag checks ("character", "hostile", "monster", "smallcreature") with `target_test()` logic. Only applies aura damage to valid hostile targets.
* **Parameters:**
  - `inst` -- graveguard entity instance
  - `target` -- potential aura damage recipient entity
* **Returns:** `true` to apply damage, `false` to skip
* **Error states:** Errors if `target:HasAnyTag()` fails or `target_test()` encounters nil components.

### `GuardKeepTargetFn(inst, target)` (local)
* **Description:** Combat component keep target function for graveguard variant. Identical logic to `KeepTargetFn()` — maintains target within TUNING.GHOST_FOLLOW_DSQ distance, clears brain follow target otherwise.
* **Parameters:**
  - `inst` -- graveguard entity instance
  - `target` -- current combat target entity
* **Returns:** `true` to keep target, `false` to drop
* **Error states:** Errors if `inst:GetDistanceSqToInst()` fails on invalid target.

### `OnGhostPlayWithMe(inst)` (local)
* **Description:** Event callback for graveguard variant fired when player interacts via "ghostplaywithme" event. Starts or resets "played_recently" timer to TUNING.SEG_TIME duration. Used to track recent player interaction for behavior decisions.
* **Parameters:** `inst` -- graveguard entity instance
* **Returns:** None
* **Error states:** Errors if `inst.components.timer` is nil.

### `link_to_gravestone(inst, gravestone)` (local)
* **Description:** Links graveguard ghost to a gravestone home position. Stores unlink callback on `inst.UnlinkFromGravestone`, registers gravestone "onremove" event listener, and remembers gravestone position via knownlocations component as "home" location.
* **Parameters:**
  - `inst` -- graveguard entity instance
  - `gravestone` -- gravestone entity to link to
* **Returns:** None
* **Error states:** Errors if `gravestone:IsValid()` fails, `gravestone:ListenForEvent()` fails, or `inst.components.knownlocations` is nil.

## Events & listeners
**Listens to:**
- `death` -- triggers OnDeath; disables aura component on both variants
- `attacked` -- triggers OnAttacked; sets combat target to attacker on both variants
- `ghostplaywithme` -- triggers OnGhostPlayWithMe; resets played_recently timer (graveguard only)

**Pushes:**
- None identified

**World state watchers:**
- None identified
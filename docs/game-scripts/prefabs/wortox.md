---
id: wortox
title: Wortox
description: Manages Wortox's soul-based gameplay systems, including soul collection, storage, overloading, portal hopping, and skill-triggered buffs and effects.
tags: [player, combat, inventory, sanity, ai]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ab2354e1
system_scope: player
---

# Wortox

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `wortox` prefab implements the core gameplay logic for the Wortox character in DST. It manages soul-based mechanics: collecting souls from corpses and traps, storing them as inventory items (`wortox_soul` and `wortox_souljar`), tracking soul count to avoid overloading (which triggers sanity loss and soul dumping), and enabling portal hopping ( soul-based teleportation) with cooldown mechanics via the `wortox_soulecho_buff`. It integrates tightly with `health`, `hunger`, `sanity`, `inventory`, `combat`, `locomotor`, `skinner`, `skilltreeupdater`, `souleater`, `follower`, `debuff`, and `rechargeable` components. It defines both client and server behavior, especially for events like `entity_death`, `murdered`, and `starvedtrapsouls`, as well as player actions like blinking and portal hopping.

## Usage example
```lua
-- Typical setup within MakePlayerCharacter()
local function common_postinit(inst)
    inst:AddTag("playermonster")
    inst:AddTag("soulstealer")
    inst:AddComponent("reticule")
    inst.components.reticule.targetfn = ReticuleTargetFn
    inst.components.reticule.ease = true
    -- ... (other reticule setup)
end

local function master_postinit(inst)
    inst:AddComponent("souleater")
    inst.components.souleater:SetOnEatSoulFn(OnEatSoul)
    inst:ListenForEvent("entity_death", OnEntityDeath)
    inst:ListenForEvent("murdered", OnMurdered)
    inst:ListenForEvent("soulhop", OnSoulHop)
    inst.CheckForOverload = CheckForOverload
    inst.GetSouls = GetSouls
    -- ... (other initialization)
end
```

## Dependencies & tags
**Components used:** `combat`, `container`, `debuff`, `eater`, `follower`, `foodaffinity`, `health`, `hunger`, `inventory`, `inventoryitem`, `locomotor`, `lootdropper`, `playeractionpicker`, `rechargeable`, `reticule`, `sanity`, `skilltreeupdater`, `skinner`, `souleater`, `stackable`, `timer`.

**Tags added:** `playermonster`, `soulstealer`, `souleater`, `monster` (conditionally removed when `wortox_inclination` is `"nice"`), `decoy` (for decoy prefab), `soulless`, `scarytoprey` (for decoy), `CLASSIFIED` (for debuff prefabs), `FX` (for VFX prefabs).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `wortox_inclination` | string? | `"naughty"` | Determines if Wortox is "nice" (no aggro on Pigs/Catcoons) or "naughty" (aggressive by default). Set via `RecalculateInclination()` using skill tags and allegiance. |
| `soulcount` | number | `0` | Cached total soul count (including souls and souljar contents). Updated on soul changes and overload checks. |
| `_freesoulhop_counter` | number | `0` | Tracks accumulated free portal hops. Incremented on soul use for hopping; resets when portal hop completes. |
| `_soulhop_cost` | number | `0` | Cumulative soul cost of current portal hop sequence (used to consume souls at end). |
| `_checksoulstask` | Task? | `nil` | Delayed task to check soul count after animations or inventory changes. Cancels/reenqueues if skill tree not initialized. |
| `wortox_needstreeinit` | boolean | `true` | Temporary flag set until `ms_skilltreeinitialized` fires, delaying soul count checks. |
| `wortox_souloverload_fx` | Entity? | `nil` | VFX entity shown during overload warning (naughty mode only). |
| `finishportalhoptask` | Task? | `nil` | Timer for the current portal hop cooldown window (soul echo). Cancels on hop completion or cancel. |
| `finishportalhoptaskmaxtime` | number? | `nil` | Duration of `finishportalhoptask` (used to compute partial soul consumption during hop). |

## Main functions
### `RecalculateInclination()`
* **Description:** Recalculates Wortox's `wortox_inclination` ("nice" or "naughty") based on skill tag counts and allegiance. Updates monster tags and fires `wortox_inclination_changed` if changed.
* **Parameters:** None (uses `skilltreeupdater` component and skill tree data).
* **Returns:** Nothing.
* **Error states:** Only runs when skilltreeupdater is present; no explicit error returns.

### `GetSouls()`
* **Description:** Finds all `wortox_soul` items in inventory and returns the list and total count (accounting for stack sizes).
* **Parameters:** None (uses `inst.components.inventory`).
* **Returns:** `{souls: table, count: number}` — list of soul items and total stack-size sum.

### `CheckForOverload(souls, count)`
* **Description:** Checks if `count` exceeds the soul limit (with skill-based adjustments for `wortox_souljar_2`). If overloaded and inclination is "naughty", shows a VFX warning; otherwise, spawns overload VFX, drops excess souls, and inflicts sanity loss. Also emits `souloverload` or `soultoomany` events.
* **Parameters:** `souls` (table of soul items), `count` (number of souls).
* **Returns:** Nothing (modifies inventory and sanity directly).

### `TryToPortalHop(souls, consumeall)`
* **Description:** Attempts to initiate portal hopping. If not enough souls, returns `false`. Otherwise, increments hop counter and starts a cooldown window (`wortox_soulecho_buff` if skill `wortox_liftedspirits_1` is active). If `consumeall` is false and hop threshold not met, charges souls with cooldown; otherwise, consumes immediately and finishes hop.
* **Parameters:** `souls` (number of souls to use, default 1), `consumeall` (boolean, skip echo cooldown).
* **Returns:** `true` on success, `false` if insufficient souls.

### `FinishPortalHop()`
* **Description:** Ends the current portal hop sequence. Cancels the echo timer, consumes the required souls from inventory, resets counters, removes `wortox_soulecho_buff`, and schedules a soul check.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetHopsPerSoul()`
* **Description:** Returns the number of free hops granted per soul, increased by skill `wortox_liftedspirits_3`.
* **Parameters:** None.
* **Returns:** `number` — hops per soul.

### `GetSoulEchoCooldownTime()`
* **Description:** Returns the echo cooldown duration, modified by skill `wortox_liftedspirits_2`.
* **Parameters:** None.
* **Returns:** `number` — cooldown time in seconds.

### `DoCheckSoulsAdded()`
* **Description:** Schedules `CheckSoulsAdded` immediately (or reschedules if already pending) to recount souls and check for overloads or portal hop completion.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnEatSoul(inst, soul)`
* **Description:** Called by `souleater` when Wortox consumes a soul. Restores hunger, applies sanity change based on inclination, and schedules `CheckSoulsRemoved` after the eat animation.
* **Parameters:** `inst` (Wortox entity), `soul` (soul item consumed).
* **Returns:** Nothing.

### `OnEntityDeath(inst, data)`
* **Description:** Event handler for `entity_death` (server). Checks if a victim has a soul, is within range (with skill bonus), and hasn't already spawned souls recently. Spawns souls at corpse if valid.
* **Parameters:** `inst` (Wortox entity), `data` (event data including `inst` victim, `explosive` flag, `afflicter`).
* **Returns:** Nothing.

### `OnMurdered(inst, data)`
* **Description:** Event handler for `murdered` (server). Gives souls to Wortox upon killing a victim with a soul, respecting stack multiplier.
* **Parameters:** `inst` (Wortox entity), `data` (event data including `victim`, `stackmult`, `incinerated` flag).
* **Returns:** Nothing.

### `OnStarvedTrapSouls(inst, data)`
* **Description:** Event handler for `starvedtrapsouls`. Spawns souls near Wortox if trap is within range.
* **Parameters:** `inst` (Wortox entity), `data` (includes `trap`, `numsouls`).
* **Returns:** Nothing.

### `OnHarvestTrapSouls(inst, data)`
* **Description:** Event handler for `harvesttrapsouls`. Gives souls to Wortox when harvesting trap souls.
* **Parameters:** `inst` (Wortox entity), `data` (includes `numsouls`, `pos`).
* **Returns:** Nothing.

### `OnReroll(inst)`
* **Description:** Handler for `ms_playerreroll`. Drops all currently owned souls.
* **Parameters:** None (uses `inst:GetSouls()`).
* **Returns:** Nothing.

### `CanSoulhop(souls)`
* **Description:** Checks if Wortox can perform a portal hop with at least `souls` (default 1). Ensures not currently riding.
* **Parameters:** `souls` (number, default 1).
* **Returns:** `true` if can hop, `false` otherwise.

### `CanBlinkTo(pos)`
* **Description:** Checks if a point is valid to blink to (passable, not ground-target blocked, and teleport permitted).
* **Parameters:** `pos` (vector3).
* **Returns:** `boolean`.

### `CanBlinkFromWithMap(pt)`
* **Description:** Checks teleport permission only (used for map-based blink).
* **Parameters:** `pt` (vector3).
* **Returns:** `boolean`.

### `ReticuleTargetFn(inst)`
* **Description:** Function passed to `reticule.targetfn`. Returns target position for blink using `ControllerReticle_Blink_GetPosition` and `IsNotBlocked`.
* **Parameters:** `inst` (Wortox entity).
* **Returns:** `vector3?` — target position or `nil`.

### `GetPointSpecialActions(inst, pos, useitem, right)`
* **Description:** Function passed to `playeractionpicker.pointspecialactionsfn`. Returns `{ACTIONS.BLINK}` if in right-hand mode, no item equipped, blink is valid, and can soulhop.
* **Parameters:** `inst`, `pos`, `useitem`, `right`.
* **Returns:** `{ACTIONS.BLINK}` or `{}`.

### `OnSetOwner(inst)`
* **Description:** Event handler for `setowner`. Sets `pointspecialactionsfn` on `playeractionpicker` to `GetPointSpecialActions`.
* **Parameters:** `inst`.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `entity_death` (server, via `OnEntityDeath`)
  - `entity_droploot` (server, via `OnEntityDropLoot`, set only after respawn)
  - `starvedtrapsouls` (server, via `OnStarvedTrapSouls`)
  - `murdered` (server, via `OnMurdered`)
  - `harvesttrapsouls` (server, via `OnHarvestTrapSouls`)
  - `soulhop` (server, via `OnSoulHop`)
  - `gotnewitem` (via `OnGotNewItem`)
  - `newactiveitem` (via `OnNewActiveItem`)
  - `stacksizechange` (via `OnStackSizeChange`)
  - `dropitem` (via `OnDropItem`)
  - `ms_respawnedfromghost` (via `OnRespawnedFromGhost`)
  - `ms_becameghost` (via `OnBecameGhost`)
  - `ms_playerreroll` (via `OnReroll`)
  - `setowner` (via `OnSetOwner`)
  - `ms_skilltreeinitialized` (via `OnSkillTreeInitialized`)
  - `freesoulhopschanged` (client only, via `OnFreesoulhopsChanged`)
  - `onactivateskill_server`, `ondeactivateskill_server`, `onactivateskill_client`, `ondeactivateskill_client` (via `RecalculateInclination`)
  - `timerdone` (soulecho buff, via `OnTimerDone_soulecho`)
  - `death` (on debuffs like `wortox_soulecho_buff` and `wortox_forget_debuff` to stop debuffs)
- **Pushes:**
  - `wortox_inclination_changed` (data: `old_inclination`, `new_inclination`)
  - `souloverload` (stategraph trigger)
  - `souloverloadwarning` (Wisecracker event, naught mode warning)
  - `souloverloadavoided` (Wisecracker event)
  - `soultoomany` (Wisecracker event)
  - `soultoofew`, `soulempty` (Wisecracker events)
  - `wortox_panflute_playing_active`, `wortox_panflute_playing_used` (Wisecracker events)

---
id: spear_wathgrithr
title: Spear Wathgrithr
description: Implements Wathgrithr's spear variants, including basic, lightning, and fully charged lightning spear with dynamic equipment effects, skill-based ability scaling, and lunge-based lightning attacks.
tags: [combat, equipment, skills]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f4637326
system_scope: inventory
---

# Spear Wathgrithr

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `spear_wathgrithr` prefab defines the spear weapon for the character Wathgrithr, supporting multiple variants (basic, uncharged lightning, and charged lightning). It integrates deeply with the combat system via the `weapon`, `aoeweapon_lunge`, `aoetargeting`, `rechargeable`, `aoespell`, `upgradeable`, and `equippable` components. It dynamically modifies player properties (e.g., speed, inspiration gain) upon equipping and responds to skill activation/deactivation via the `skilltreeupdater` component. The charged spear variant adds persistent FX (lighting glow, floating follow), conditional electrocution, and on-hit repair behavior during lunge attacks.

## Usage example
```lua
-- Spawning the basic spear
local spear = SpawnPrefab("spear_wathgrithr")

-- Spawning the charged lightning spear
local charged_spear = SpawnPrefab("spear_wathgrithr_lightning_charged")

-- Manually charge/discharge (server-side only)
if charged_spear.components.rechargeable then
    charged_spear.components.rechargeable:Discharge(5.0) -- discharge over 5 seconds
end

-- Upgrade a normal lightning spear to charged
-- (requires Upgradeable component and proper preconditions)
charged_spear.components.upgradeable:SetOnUpgradeFn(function(inst, upgrader, item)
    -- upgrade logic already defined in prefab
end)
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `weapon`, `planardamage`, `finiteuses`, `equippable`, `aoetargeting`, `aoeweapon_lunge`, `aoespell`, `rechargeable`, `upgradeable`, `colouradder`, `highlightchild`, `floater`.  
**Tags added:** `sharp`, `pointy`, `battlespear`, `weapon`, `aoeweapon_lunge`, `rechargeable`.  
**Tags removed:** None.  
**Tags checked:** `debuffed`, `buffed` (via `usesdepleted` in `finiteuses`), `inspirationgain` (via `skilltreeupdater`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `is_lightning_spear` | boolean | `false` | Indicates whether the spear is a lightning spear variant. |
| `_swapbuild` | string | `data.swapbuild` | Symbol build for weapon swap animation. |
| `_swapsymbol` | string | `data.swapsymbol` | Symbol name for weapon swap animation. |
| `_cooldown` | number | `TUNING.SPEAR_WATHGRITHR_LIGHTNING_LUNGE_COOLDOWN` or `TUNING.SPEAR_WATHGRITHR_LIGHTNING_CHARGED_LUNGE_COOLDOWN` | Cooldown duration for lunge attacks (varies by variant). |
| `_electric_lunge_task` | Task | `nil` | Task managing temporary electric state during lunge. |
| `_lunge_hit_count` | number | `nil` | Counter for how many valid hits occurred during current lunge (used for repairs). |
| `_fxowner` | Entity | `nil` | Current owner entity of the FX child. |
| `itemtile_lightning` | boolean | `false` | Flag used to render the item tile for charged variant. |
| `_onskillrefresh` | function | `function(owner)` | Callback used to refresh inspiration multipliers and charging state on skill activation/deactivation. |

## Main functions
### `RefreshAttunedSkills(inst, owner, prevowner)`
*   **Description:** Updates inspiration gain multiplier modifier on `singinginspiration.gainratemultipliers` based on active "inspirationgain" skill level and sets `aoetargeting` enabled state for lightning spears when skill `wathgrithr_arsenal_spear_4` is active.
*   **Parameters:** `inst` (Entity), `owner` (Entity or `nil`), `prevowner` (Entity or `nil`).
*   **Returns:** Nothing.

### `WatchSkillRefresh(inst, owner)`
*   **Description:** Attaches or removes event listeners for `"onactivateskill_server"` and `"ondeactivateskill_server"` on the owner to trigger skill-based refresh logic.
*   **Parameters:** `inst` (Entity), `owner` (Entity or `nil`).
*   **Returns:** Nothing.

### `OnEquip(inst, owner)`
*   **Description:** Called when the spear is equipped. Updates animation, applies skin overrides, refreshes skill-related modifiers, discharges weapon if re-equipping mid-charge, and starts charge sound loop for charged spears.
*   **Parameters:** `inst` (Entity), `owner` (Entity).
*   **Returns:** Nothing.

### `OnUnequip(inst, owner)`
*   **Description:** Called when the spear is unequipped. Restores default animations, removes skin overrides, clears skill listeners, stops charge sound, and removes inspiration modifier.
*   **Parameters:** `inst` (Entity), `owner` (Entity).
*   **Returns:** Nothing.

### `Lightning_OverrideStimuliFn(inst, attacker, target)`
*   **Description:** Determines if the weapon should apply electric stimuli (i.e., deal wet electric damage) based on whether a lunge is active or the target is wet.
*   **Parameters:** `inst` (Entity), `attacker` (Entity), `target` (Entity).
*   **Returns:** `"electric"` or `nil`.

### `Lightning_OnAttack(inst, attacker, target)`
*   **Description:** Spawns electric hit sparks if the target can be electrocuted.
*   **Parameters:** `inst` (Entity), `attacker` (Entity), `target` (Entity).
*   **Returns:** Nothing.

### `Lightning_OnPreLunge(inst, doer, startingpos, targetpos)`
*   **Description:** Sets up temporary electric lunge state before the lunge begins; schedules a reset task.
*   **Parameters:** `inst` (Entity), `doer` (Entity), `startingpos` (Vector3), `targetpos` (Vector3).
*   **Returns:** Nothing.

### `Lightning_OnLunged(inst, doer, startingpos, targetpos)`
*   **Description:** Fires on lunge completion: spawns lunge FX, discharges the weapon, and resets lunge hit count.
*   **Parameters:** `inst` (Entity), `doer` (Entity), `startingpos` (Vector3), `targetpos` (Vector3).
*   **Returns:** Nothing.

### `Lightning_OnLungedHit(inst, doer, target)`
*   **Description:** Called on each valid hit during lunge. Repairs `finiteuses` up to a per-lunge cap (`SPEAR_WATHGRITHR_LIGHTNING_CHARGED_MAX_REPAIRS_PER_LUNGE`) for upgradeable (uncharged) spears.
*   **Parameters:** `inst` (Entity), `doer` (Entity), `target` (Entity).
*   **Returns:** Nothing.

### `Lightning_OnCharged(inst)`
*   **Description:** Enables `aoetargeting` when fully charged *if* the skill `wathgrithr_arsenal_spear_4` is active on the grand owner.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `Lightning_OnDischarged(inst)`
*   **Description:** Disables `aoetargeting` when the spear is discharged.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `Lightning_ReticuleMouseTargetFn(inst, mousepos)`
*   **Description:** Computes a lunge target position based on mouse position and max lunge range (6.5 units), clamped to avoid exceeding range.
*   **Parameters:** `inst` (Entity), `mousepos` (Vector3 or `nil`).
*   **Returns:** `Vector3` of target position in world space.

### `Lightning_CanBeUpgraded(inst, item)`
*   **Description:** Allows upgrade only if the spear is unequipped.
*   **Parameters:** `inst` (Entity), `item` (Entity).
*   **Returns:** `true` or `false`.

### `Lightning_OnUpgraded(inst, upgrader, item)`
*   **Description:** Performs upgrade: spawns a `spear_wathgrithr_lightning_charged` variant, transfers charge and uses state, then removes the original and places the new spear in the same inventory slot or world position.
*   **Parameters:** `inst` (Entity), `upgrader` (Entity), `item` (Entity).
*   **Returns:** Nothing.

### `LightningCharged_SetFxOwner(inst, owner)`
*   **Description:** Attaches/detaches the FX child (`inst.fx`) from the given owner: manages parenting, follower attachment, highlight ownership, and colour syncing via `colouradder`.
*   **Parameters:** `inst` (Entity), `owner` (Entity or `nil`).
*   **Returns:** Nothing.

### `LightningCharged_OnEntityWake(inst)`
*   **Description:** Restarts the charge sound loop if the entity wakes and isn’t already playing it.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `LightningCharged_OnEntitySleep(inst)`
*   **Description:** Stops the charge sound loop when the entity goes to sleep or enters limbo.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"onremove"` (on children of `ColourAdder`) — detach children on removal.  
  - `"onactivateskill_server"` / `"ondeactivateskill_server"` (on owner) — refresh skill-dependent modifiers and charging state.  
  - `"floater_stopfloating"` (on charged spear) — restore idle loop animation.  
  - `"exitlimbo"` / `"enterlimbo"` (on charged spear) — manage charge loop sound.  
  - `"animover"` (on FX entities) — cleanup after animation finishes.

- **Pushes:**  
  - `"equipskinneditem"` / `"unequipskinneditem"` — during equip/unequip with skin builds.  
  - `"imagechange"` — via `inventoryitem:ChangeImageName()`.  
  - `"percentusedchange"` — via `finiteuses:SetUses()` on uses change.  
  - `"combat_lunge"` — when `aoespell` is cast during lunge.
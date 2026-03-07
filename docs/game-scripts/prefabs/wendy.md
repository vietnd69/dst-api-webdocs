---
id: wendy
title: Wendy
description: Implements Wendy’s unique gameplay mechanics, including Abigail the ghostly friend, sanity aura adjustments during Sisturn events, and bonding progression.
tags: [player, ghost, combat, sanity, skill]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2cc2b353
system_scope: player
---

# Wendy

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wendy` defines the player character prefab with support for the ghostly companion Abigail. It integrates tightly with the `ghostlybond`, `sanity`, `combat`, `health`, and `foodaffinity` components. Key features include bond level progression, Abigail summoning and recall, custom damage/multiplier logic for Abigail interactions, and dynamic sanity aura adjustments during Sisturn events. The UI component `WendyFlowerOver` visually reflects bond level and pet skin state on the client.

## Usage example
```lua
local wendy = MakePlayerCharacter("wendy", prefabs, assets, common_postinit, master_postinit)
-- Common postinit attaches basic tags and components (e.g., pethealthbar)
-- Master postinit initializes ghostlybond, sanity multipliers, combat multipliers, and event listeners
-- The character is fully configured when inst.components.ghostlybond:Init("abigail", ...) is called
```

## Dependencies & tags
**Components used:** `combat`, `foodaffinity`, `ghostlybond`, `health`, `hunger`, `inventory`, `pethealthbar`, `sanity`, `sanityauraadjuster`, `sisturnregistry`, `skilltreeupdater`, `talker`, `fader`, `revivablecorpse`  
**Tags added:** `ghostlyfriend`, `elixirbrewer`, `quagmire_grillmaster`, `quagmire_shopper`, `player_damagescale`, `INLIMBO`, `ignoretalking`, `playerghost`  
**Tags checked:** `playerghost`, `INLIMBO`, `abigail`, `player`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_bondlevel` | `net_tinybyte` | `0` | Networked bond level (0–3), triggers `_bondleveldirty` on change. |
| `refreshflowertooltip` | `net_event` | `nil` | Networked event used to refresh Abigail flower tooltip. |
| `questghost` | instance or `nil` | `nil` | Special quest ghost referenced in save/load. |

## Main functions
### `redirect_to_abigail(inst, amount, overtime, cause, ignore_invincible, afflicter, ignore_absorb)`
* **Description:** Health redirect function; routes damage taken by Wendy to Abigail when she is active and not in limbo.
* **Parameters:**  
  - `inst` (entity) – Wendy’s entity instance.  
  - Other arguments are standard `Health:DoDelta` parameters.  
* **Returns:** `true` if redirect occurred; `false` or `nil` otherwise.

### `CustomCombatDamage(inst, target)`
* **Description:** Custom damage multiplier function for Abigail-based combat interactions. Applies `TUNING.ABIGAIL_VEX_GHOSTLYFRIEND_DAMAGE_MOD` when the target has an Abigail Vex debuff; returns `0` if target is Abigail herself.
* **Parameters:**  
  - `inst` (entity) – Wendy.  
  - `target` (entity) – Entity being attacked.  
* **Returns:** `number` – Final damage multiplier.

### `CustomSPCombatDamage(inst, target)`
* **Description:** Custom special damage multiplier; only returns `0` if target is Abigail (to prevent self-damage).
* **Parameters:** Same as above.  
* **Returns:** `number` – `0` or `1`.

### `ghostlybond_onlevelchange(inst, ghost, level, prev_level, isloading)`
* **Description:** Callback set on `ghostlybond`. Updates `_bondlevel` net property, announces level-up on talker, and refreshes flower overlay.
* **Parameters:** As passed by `GhostlyBond` component.  
* **Returns:** `nil`.

### `testForSanityAuraBuff(inst, oldlist)`
* **Description:** `sanityauraadjuster` adjustment function; monitors nearby players during Sisturn events and applies/removes sanity modifier via `neg_aura_modifiers`. Returns updated list of affected players.
* **Parameters:**  
  - `inst` (entity) – Wendy.  
  - `oldlist` (table) – Previously tracked affected players.  
* **Returns:** `table` – Updated list of players receiving sanity aura buff.

### `update_sisturn_state(inst, is_active, is_blossom)`
* **Description:** Syncs Abigail’s bond time multiplier and `player_damagescale` tag based on Sisturn event status and skill activation (`wendy_sisturn_3`).
* **Parameters:**  
  - `is_active` (boolean?, default `nil`) – Whether Sisturn is active.  
  - `is_blossom` (boolean?, default `nil`) – Whether blossom event is active.  
* **Returns:** `nil`.

### `OnBondLevelDirty(inst)`
* **Description:** Client-side handler for bond level changes; updates HUD state icons and triggers `WendyFlowerOver` animation for bond level ≥ 2.
* **Parameters:** `inst` (entity) – Wendy.  
* **Returns:** `nil`.

### `OnClientPetSkinChanged(inst)`
* **Description:** Syncs `WendyFlowerOver` skin to current pet skin from `pethealthbar`.
* **Parameters:** `inst` (entity) – Wendy.  
* **Returns:** `nil`.

### `RefreshFlowerTooltip(inst)`
* **Description:** Instructs inventory system to update Abigail flower tooltip (used after summon).
* **Parameters:** `inst` (entity) – Wendy.  
* **Returns:** `nil`.

## Events & listeners
- **Listens to:**  
  - `playeractivated` – Initializes `WendyFlowerOver` and bond-level listeners on local client.  
  - `playerdeactivated` – Cleans up listeners and overlay.  
  - `clientpetskindirty` – Updates `WendyFlowerOver` skin.  
  - `refreshflowertooltip` – Triggers tooltip refresh.  
  - `death`, `ms_becameghost` – Recalls and pauses bond bonding.  
  - `ms_respawnedfromghost` – Resets bond level and resumes bonding.  
  - `onsisturnstatechanged` (on `TheWorld`) – Updates Sisturn-related Abigail stats.  
  - `babysitter_set` – Announces babysitter state.  
  - `murdered` – Triggers nightmare buff if `wendy_shadow_3` skill is active.  
  - `onactivateskill_server`, `ondeactivateskill_server` – Broadcasts skill change events.  
  - `ms_skilltreeinitialized` – Ensures skill change events are emitted after skill tree init.  
  - `ms_playerreroll` – Handles despawn during reroll.  

- **Pushes:**  
  - `ghostlybond_level_change` (via `GhostlyBond` component)  
  - `sanitydelta`, `healthdelta`, `refreshflowertooltip` (networked event via `inst.refreshflowertooltip:push()`)
---
id: sanity
title: Sanity
description: Manages sanity value, mode (Insanity/Lunacy), and related mechanics for an entity, including dynamic rate calculation from environmental and aura sources.
tags: [sanity, player, entity, aura, environment]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 963ceb73
system_scope: entity
---
# Sanity

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Sanity` component tracks and updates an entity's sanity level (a float value between `0` and `max`), determines its mental state (`SANITY_MODE_INSANITY` or `SANITY_MODE_LUNACY`), and calculates net sanity change rate based on dapperness, moisture, light, entity auras, and ghost presence. It synchronizes state with clients via replica properties and integrates with multiple other components (e.g., `health`, `inventory`, `moisture`, `rider`, `sanityaura`, `shard_players`) to compute dynamic effects. Key behaviors include sanity threshold transitions (become insane/enlightened) and penalty support that caps maximum sanity for players.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("sanity")

-- Set max sanity and initialize
inst.components.sanity:SetMax(100)

-- Add a sanity penalty (e.g., from eating too many monster treats)
inst.components.sanity:AddSanityPenalty("monster_treat", 0.3)

-- Force entity into lunacy mode
inst.components.sanity:EnableLunacy(true, "custom_source")

-- Trigger an immediate sanity change
inst.components.sanity:DoDelta(-10)

-- Check current mental state
if inst.components.sanity:IsSane() then
    print("Entity is sane")
else
    print("Entity is not sane")
end
```

## Dependencies & tags
**Components used:**  
`health` (via `:IsInvincible()`), `inventory` (via `equipslots`), `moisture` (via `GetMoisture`, `GetMaxMoisture`), `rider` (via `GetMount`, `IsRiding`), `sanityaura` (via `GetAura`), `shard_players` (via `GetNumGhosts`, `GetNumAlive`)

**Tags:** Checks tags for aura immunity and entity filtering (`sanityaura`, `FX`, `NOCLICK`, `DECOR`, `INLIMBO`). Adds no new tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `max` | number | `100` | Maximum sanity value. |
| `current` | number | `100` | Current sanity value. |
| `mode` | number | `SANITY_MODE_INSANITY` | Current sanity mode (`SANITY_MODE_INSANITY` or `SANITY_MODE_LUNACY`). |
| `rate` | number | `0` | Net sanity change per second. |
| `ratescale` | number | `RATE_SCALE.NEUTRAL` | Rate scaling factor used for UI indicators. |
| `sane` | boolean | `true` | Player's current sanity state (before induced modifiers). |
| `penalty` | number | `0` | Fractional sanity penalty (reduces max effective sanity). |
| `inducedinsanity` | boolean or nil | `nil` | True if sanity is forced to `0` by external sources (e.g., nightmare fuel). |
| `inducedlunacy` | boolean or nil | `nil` | True if entity is in forced lunacy state (base sanity scaled by `(1 - penalty)`). |
| `ghost_drain_mult` | number | `0` | Multiplier for sanity drain caused by nearby ghosts. |
| `neg_aura_absorb` | number | `0` | Passive absorption of negative auras (reduces drain from negative sources). |
| `neg_aura_immune_sources` | SourceModifierList | (constructor) | Tracks sources granting immunity to negative auras. |
| `sanity_aura_immune_sources` | SourceModifierList | (constructor) | Tracks sources granting immunity to all auras. |
| `player_ghost_immune_sources` | SourceModifierList | (constructor) | Tracks sources granting immunity to ghost-driven sanity drain. |
| `light_drain_immune_sources` | SourceModifierList | (constructor) | Tracks sources granting immunity to light-based sanity drain. |
| `sanity_penalties` | table | `{}` | Key-modifier map for additive penalties applied to max sanity. |
| `externalmodifiers` | SourceModifierList | (constructor) | Additive modifiers to the sanity rate. |
| `neg_aura_modifiers` | SourceModifierList | (constructor) | Multipliers to negative aura effects. |
| `dapperness` | number | `0` | Base dapperness (sanity gain) from the entity itself. |
| `dapperness_mult` | number | `1` | Multiplier for dapperness effects. |
| `night_drain_mult` | number | `1` | Multiplier for night light-based sanity drain. |
| `custom_rate_fn` | function or nil | `nil` | Optional callback `(inst, dt) -> rate_delta`. |

## Main functions
### `IsSane()`
* **Description:** Returns whether the entity is currently considered *sane* under the current mode and induced states. Logic differs between `SANITY_MODE_INSANITY` and `SANITY_MODE_LUNACY`.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if the entity is sane; otherwise `false`.
* **Error states:** Returns `false` when `inducedinsanity` is `true` in Insanity mode (sanity is zeroed), or `inducedlunacy` is `true` in Lunacy mode (sanity is scaled but considered "insane" for transition logic).

### `DoDelta(delta, overtime)`
* **Description:** Applies a sanity delta to `current`, clamps it to `[0, max * (1 - penalty)]`, and handles state transitions (e.g., `goinsane`, `goenlightened`). Also updates the `sanitydelta` event.
* **Parameters:**  
  `delta` (number) — amount to add to current sanity.  
  `overtime` (boolean) — if `true`, ignores invincibility/sleep flags (used for time-based recalculations); otherwise may skip updates under protection.  
* **Returns:** Nothing.
* **Error states:** Early exit if `self.redirect` or `self.ignore` is set. Uses `TUNING` values for threshold transitions (e.g., `SANITY_BECOME_INSANE_THRESH`).

### `SetMax(amount)`
* **Description:** Sets the maximum sanity value and resets `current` to the new maximum. Triggers `DoDelta(0)` to sync replica and events.
* **Parameters:** `amount` (number) — new maximum sanity.
* **Returns:** Nothing.

### `GetPercent()`
* **Description:** Returns sanity as a fraction of maximum, adjusted for `inducedinsanity` (returns `0`) or `inducedlunacy` (returns `(1 - penalty)`).
* **Parameters:** None.
* **Returns:** `number` — sanity percentage (`0` to `1`).
* **Error states:** Always returns a numeric value (never `nil`).

### `GetPercentWithPenalty()`
* **Description:** Returns sanity as a fraction of *penalty-adjusted* maximum (`current / (max - max * penalty)`). Useful for UI where the effective max matters.
* **Parameters:** None.
* **Returns:** `number` — sanity percentage relative to effective max.

### `SetInducedInsanity(src, val)`
* **Description:** Sets or removes an induced insanity source. When active, sanity is clamped to `0`. Updates replica and fires `inducedinsanity` event.
* **Parameters:**  
  `src` (any) — identifier for the source (e.g., entity instance or string).  
  `val` (boolean) — whether to apply the source.  
* **Returns:** Nothing.

### `EnableLunacy(enable, source)`
* **Description:** Enables or disables lunacy mode. If enabled, mode becomes `SANITY_MODE_LUNACY`; otherwise defaults to `SANITY_MODE_INSANITY`.
* **Parameters:**  
  `enable` (boolean) — whether to enter lunacy mode.  
  `source` (any) — identifier for the source.  
* **Returns:** Nothing.

### `Recalc(dt)`
* **Description:** Computes the current net sanity rate (`rate`) from dapperness, moisture, light, auras, ghosts, and modifiers. Calls `DoDelta(rate * dt, true)`.
* **Parameters:** `dt` (number) — time delta in seconds.
* **Returns:** Nothing.
* **Error states:** Skips light and aura calculations if respective immunities are active.

### `OnUpdate(dt)`
* **Description:** Main update loop called periodically. If the entity is not invincible or protected, calls `Recalc(dt)`; otherwise resets rate to `0`.
* **Parameters:** `dt` (number) — time delta in seconds.
* **Returns:** Nothing.

### `GetAuraMultipliers()`
* **Description:** Computes the combined multiplier applied to negative aura effects.
* **Parameters:** None.
* **Returns:** `number` — `neg_aura_mult * neg_aura_modifiers:Get()`.

### `AddSanityPenalty(key, mod)`
* **Description:** Adds an additive penalty (0 to 1) to the entity's max sanity. Used for items/abilities that reduce sanity cap (e.g., monster treats).
* **Parameters:**  
  `key` (string/any) — unique identifier for the penalty source.  
  `mod` (number) — penalty fraction to apply.  
* **Returns:** Nothing.
* **Error states:** Effective penalty is clamped to `1 - (5/self.max)` for players (max sanity cannot go below 5).

### `RemoveSanityPenalty(key)`
* **Description:** Removes a sanity penalty by key and recalculates the total penalty.
* **Parameters:** `key` (string/any) — identifier of the penalty source.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None directly (but uses event infrastructure via `inst:PushEvent`).
- **Pushes:**  
  - `sanitydelta` — fired when `current` or state changes. Includes `oldpercent`, `newpercent`, `overtime`, `sanitymode`.  
  - `sanitymodechanged` — fired when `mode` switches between Insanity/Lunacy. Includes `mode`.  
  - `inducedinsanity` — fired when `inducedinsanity` changes. Payload is the new value (`true`/`false`).  
  - `inducedlunacy` — fired when `inducedlunacy` changes. Payload is the new value.  
  - `gosane` — fired when transitioning *to* a sane state.  
  - `goinsane` — fired when transitioning *to* Insanity mode's insane state.  
  - `goenlightened` — fired when transitioning *to* Lunacy mode's insane state.  

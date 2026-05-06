---
id: sanity
title: Sanity
description: Manages sanity state, drainage rates, and mode transitions for entities including insanity and lunacy modes.
tags: [sanity, mental, status]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: components
source_hash: 41e8e2a2
system_scope: entity
---

# Sanity

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`Sanity` manages an entity's mental state, tracking current sanity value, maximum capacity, and drainage/gain rates. It supports two modes: Insanity (traditional sanity system) and Lunacy (enlightenment system). The component calculates sanity changes from multiple sources including dapperness from equipped items, moisture exposure, ambient light levels, sanity auras from nearby entities, and ghost player penalties. Sanity state changes trigger events that other systems can listen to for visual effects, audio cues, and gameplay modifications.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("sanity")
inst.components.sanity:SetMax(200)
inst.components.sanity:SetPercent(0.5)
inst.components.sanity:EnableLunacy(true, "moonstone_effect")
inst.components.sanity:AddSanityPenalty("wetness", 0.2)
```

## Dependencies & tags
**External dependencies:**
- `easing` -- used for moisture penalty interpolation
- `util/sourcemodifierlist` -- manages stacked modifiers from multiple sources

**Components used:**
- `health` -- checks `IsInvincible()` to pause sanity drain during invincibility
- `inventory` -- accesses `equipslots` for dapperness calculation from equipped items
- `moisture` -- calls `GetMoisture()` and `GetMaxMoisture()` for wetness penalty
- `rider` -- checks `IsRiding()` and `GetMount()` for mount sanity aura
- `sanityaura` -- calls `GetAura()` on nearby entities and mounted creatures
- `equippable` -- calls `GetDapperness()` on equipped items
- `shard_players` -- calls `GetNumGhosts()` and `GetNumAlive()` for ghost drain calculation

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `max` | number | `100` | Maximum sanity capacity for this entity. |
| `current` | number | `self.max` | Current sanity value. |
| `mode` | constant | `SANITY_MODE_INSANITY` | Current sanity mode (INSANITY or LUNACY). |
| `_lunacy_sources` | SourceModifierList | `new SourceModifierList` | Tracks sources that enable lunacy mode. |
| `rate` | number | `0` | Current sanity change rate per second. |
| `ratescale` | constant | `RATE_SCALE.NEUTRAL` | Visual scale indicator for rate magnitude. |
| `rate_modifier` | number | `1` | Multiplier applied to final rate calculation. |
| `sane` | boolean | `true` | Whether entity is currently in sane state. |
| `fxtime` | number | `0` | Time accumulator for sanity-related effects. |
| `dapperness` | number | `0` | Base dapperness value from the entity itself. |
| `externalmodifiers` | SourceModifierList | `new SourceModifierList` | External rate modifiers from other sources. |
| `inducedinsanity` | boolean | `nil` | Whether insanity is forcibly induced. |
| `inducedinsanity_sources` | table | `nil` | Tracks sources inducing insanity. |
| `inducedlunacy` | boolean | `nil` | Whether lunacy is forcibly induced. |
| `inducedlunacy_sources` | table | `nil` | Tracks sources inducing lunacy. |
| `night_drain_mult` | number | `1` | Multiplier for night-time sanity drain. |
| `neg_aura_mult` | number | `1` | Multiplier for negative aura effects (deprecated). |
| `neg_aura_modifiers` | SourceModifierList | `new SourceModifierList` | Modifiers for negative aura absorption. |
| `neg_aura_absorb` | number | `0` | Amount of negative aura to absorb. |
| `neg_aura_immune_sources` | SourceModifierList | `new SourceModifierList` | Sources granting negative aura immunity. |
| `dapperness_mult` | number | `1` | Multiplier for dapperness calculations. |
| `penalty` | number | `0` | Current sanity penalty as a fraction (0-1). |
| `sanity_penalties` | table | `{}` | Key-value store of active sanity penalties. |
| `ghost_drain_mult` | number | `0` | Multiplier for ghost player sanity drain. |
| `custom_rate_fn` | function | `nil` | Custom function to modify sanity rate calculation. |
| `sanity_aura_immune_sources` | SourceModifierList | `new SourceModifierList` | Sources granting sanity aura immunity. |
| `player_ghost_immune_sources` | SourceModifierList | `new SourceModifierList` | Sources granting ghost player drain immunity. |
| `light_drain_immune_sources` | SourceModifierList | `new SourceModifierList` | Sources granting light drain immunity. |

## Main functions
### `IsSane()`
* **Description:** Returns whether the entity is currently in a sane state, accounting for mode and induced states.
* **Parameters:** None
* **Returns:** Boolean indicating sane status.
* **Error states:** None

### `IsInsane()`
* **Description:** Returns whether the entity is currently insane (Insanity mode only).
* **Parameters:** None
* **Returns:** Boolean indicating insane status.
* **Error states:** None

### `IsEnlightened()`
* **Description:** Returns whether the entity is currently enlightened (Lunacy mode only).
* **Parameters:** None
* **Returns:** Boolean indicating enlightened status.
* **Error states:** None

### `IsCrazy()`
* **Description:** Deprecated alias for `IsInsane()`.
* **Parameters:** None
* **Returns:** Boolean indicating insane status.
* **Error states:** None

### `SetSanityMode(mode)`
* **Description:** Deprecated. Mode is now controlled via `EnableLunacy()`.
* **Parameters:** `mode` -- sanity mode constant.
* **Returns:** None
* **Error states:** None

### `IsInsanityMode()`
* **Description:** Returns whether the current mode is Insanity mode.
* **Parameters:** None
* **Returns:** Boolean.
* **Error states:** None

### `IsLunacyMode()`
* **Description:** Returns whether the current mode is Lunacy mode.
* **Parameters:** None
* **Returns:** Boolean.
* **Error states:** None

### `GetSanityMode()`
* **Description:** Returns the current sanity mode constant.
* **Parameters:** None
* **Returns:** Mode constant (`SANITY_MODE_INSANITY` or `SANITY_MODE_LUNACY`).
* **Error states:** None

### `UpdateMode_Internal()`
* **Description:** Updates sanity mode based on lunacy sources and pushes event if changed.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `EnableLunacy(enable, source)`
* **Description:** Enables or disables lunacy mode from a specific source.
* **Parameters:**
  - `enable` -- boolean to enable or disable lunacy
  - `source` -- entity or identifier representing the source
* **Returns:** None
* **Error states:** None

### `AddSanityPenalty(key, mod)`
* **Description:** Adds a sanity penalty that reduces maximum sanity capacity.
* **Parameters:**
  - `key` -- string identifier for this penalty
  - `mod` -- number penalty value to add
* **Returns:** None
* **Error states:** None

### `RemoveSanityPenalty(key)`
* **Description:** Removes a sanity penalty by key.
* **Parameters:** `key` -- string identifier of penalty to remove.
* **Returns:** None
* **Error states:** None

### `RecalculatePenalty()`
* **Description:** Recalculates total penalty from all active sanity penalties and clamps to maximum allowed.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `AddSanityAuraImmunity(tag, source)`
* **Description:** Grants immunity to sanity auras from entities with the specified tag.
* **Parameters:**
  - `tag` -- string tag to be immune against
  - `source` -- entity or identifier granting the immunity (optional, defaults to self.inst)
* **Returns:** None
* **Error states:** None

### `RemoveSanityAuraImmunity(tag, source)`
* **Description:** Removes sanity aura immunity for a specific tag and source.
* **Parameters:**
  - `tag` -- string tag to remove immunity from
  - `source` -- entity or identifier to remove (optional, defaults to self.inst)
* **Returns:** None
* **Error states:** None

### `SetFullAuraImmunity(immunity, source)`
* **Description:** Sets immunity to all sanity auras.
* **Parameters:**
  - `immunity` -- boolean enabling or disabling full immunity
  - `source` -- entity or identifier granting the immunity (optional, defaults to self.inst)
* **Returns:** None
* **Error states:** None

### `SetNegativeAuraImmunity(immunity, source)`
* **Description:** Sets immunity to negative sanity auras only.
* **Parameters:**
  - `immunity` -- boolean enabling or disabling negative aura immunity
  - `source` -- entity or identifier granting the immunity (optional, defaults to self.inst)
* **Returns:** None
* **Error states:** None

### `SetPlayerGhostImmunity(immunity, source)`
* **Description:** Sets immunity to ghost player sanity drain.
* **Parameters:**
  - `immunity` -- boolean enabling or disabling ghost drain immunity
  - `source` -- entity or identifier granting the immunity (optional, defaults to self.inst)
* **Returns:** None
* **Error states:** None

### `SetLightDrainImmune(immunity, source)`
* **Description:** Sets immunity to light-based sanity drain.
* **Parameters:**
  - `immunity` -- boolean enabling or disabling light drain immunity
  - `source` -- entity or identifier granting the immunity (optional, defaults to self.inst)
* **Returns:** None
* **Error states:** None

### `OnSave()`
* **Description:** Returns save data for sanity state.
* **Parameters:** None
* **Returns:** Table containing `current`, `sane`, and `mode` values.
* **Error states:** None

### `OnLoad(data)`
* **Description:** Loads sanity state from save data.
* **Parameters:** `data` -- table containing saved sanity state.
* **Returns:** None
* **Error states:** None

### `GetPenaltyPercent()`
* **Description:** Returns the current sanity penalty as a fraction.
* **Parameters:** None
* **Returns:** Number between 0 and 1.
* **Error states:** None

### `GetRealPercent()`
* **Description:** Returns current sanity as a fraction of max without induced state modifications.
* **Parameters:** None
* **Returns:** Number between 0 and 1.
* **Error states:** None

### `GetPercent()`
* **Description:** Returns current sanity percentage accounting for induced insanity and lunacy states.
* **Parameters:** None
* **Returns:** Number between 0 and 1. Returns 0 if induced insanity, returns `1 - penalty` if induced lunacy.
* **Error states:** None

### `GetPercentWithPenalty()`
* **Description:** Returns sanity percentage with penalty applied to denominator.
* **Parameters:** None
* **Returns:** Number representing percentage with penalty consideration.
* **Error states:** None

### `SetPercent(per, overtime)`
* **Description:** Sets sanity to a specific percentage of max.
* **Parameters:**
  - `per` -- number target percentage (0-1)
  - `overtime` -- boolean whether to apply change over time (optional)
* **Returns:** None
* **Error states:** None

### `GetDebugString()`
* **Description:** Returns formatted debug string with current sanity state information.
* **Parameters:** None
* **Returns:** String with current/max sanity, rate, penalty, and mode.
* **Error states:** None

### `SetMax(amount)`
* **Description:** Sets maximum sanity capacity and resets current to match.
* **Parameters:** `amount` -- number new maximum sanity value.
* **Returns:** None
* **Error states:** None

### `GetMaxWithPenalty()`
* **Description:** Returns maximum sanity accounting for active penalties.
* **Parameters:** None
* **Returns:** Number representing effective maximum sanity.
* **Error states:** None

### `GetRateScale()`
* **Description:** Returns the current rate scale constant.
* **Parameters:** None
* **Returns:** `RATE_SCALE` constant indicating rate magnitude.
* **Error states:** None

### `SetInducedInsanity(src, val)`
* **Description:** Sets induced insanity state from a specific source.
* **Parameters:**
  - `src` -- entity or identifier representing the source
  - `val` -- boolean enabling or disabling induced insanity
* **Returns:** None
* **Error states:** None

### `SetInducedLunacy(src, val)`
* **Description:** Sets induced lunacy state from a specific source.
* **Parameters:**
  - `src` -- entity or identifier representing the source
  - `val` -- boolean enabling or disabling induced lunacy
* **Returns:** None
* **Error states:** None

### `DoDelta(delta, overtime)`
* **Description:** Applies a sanity change delta and handles state transitions between sane/insane/enlightened.
* **Parameters:**
  - `delta` -- number amount to change sanity by (positive gains, negative drains)
  - `overtime` -- boolean whether change is applied over time
* **Returns:** None
* **Error states:** None

### `OnUpdate(dt)`
* **Description:** Called each frame to update sanity state. Skips recalculation during invincibility, spawn protection, sleep, or teleportation.
* **Parameters:** `dt` -- number delta time in seconds.
* **Returns:** None
* **Error states:** None

### `RecalcGhostDrain()`
* **Description:** Recalculates ghost player sanity drain multiplier based on server ghost/alive player ratio.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `TheWorld.shard.components.shard_players` is nil.

### `GetAuraMultipliers()`
* **Description:** Returns combined multiplier for negative aura effects.
* **Parameters:** None
* **Returns:** Number multiplier value.
* **Error states:** None

### `Recalc(dt)`
* **Description:** Recalculates sanity rate from all sources including dapperness, moisture, light, auras, and ghosts.
* **Parameters:** `dt` -- number delta time in seconds.
* **Returns:** None
* **Error states:** Errors if `self.inst.components.inventory`, `self.inst.components.moisture`, or `self.inst.LightWatcher` is nil.

### `TransferComponent(newinst)`
* **Description:** Transfers sanity state to a new entity instance.
* **Parameters:** `newinst` -- entity instance to transfer sanity to.
* **Returns:** None
* **Error states:** Errors if `newinst.components.sanity` is nil.

## Events & listeners
**Listens to:** None identified

**Pushes:**
- `sanitymodechanged` -- fired when sanity mode changes between Insanity and Lunacy. Data: `{ mode = mode }`
- `inducedinsanity` -- fired when induced insanity state changes. Data: boolean value
- `inducedlunacy` -- fired when induced lunacy state changes. Data: boolean value
- `sanitydelta` -- fired when sanity value changes. Data: `{ oldpercent, newpercent, overtime, sanitymode }`
- `gosane` -- fired when entity transitions to sane state
- `goinsane` -- fired when entity transitions to insane state (Insanity mode only)
- `goenlightened` -- fired when entity transitions to enlightened state (Lunacy mode only)
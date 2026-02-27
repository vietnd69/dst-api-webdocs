---
id: sanity
title: Sanity
description: Manages a player entity's sanity level, including perception of reality, sanity decay/gain sources, mode transitions (Insanity vs. Lunacy), and interactions with auras, gear, and environment.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 963ceb73
---

# Sanity

## Overview
The `sanity` component governs a player's mental state in Don't Starve Together, tracking current and maximum sanity, determining whether the player is sane/insane/enlightened, and computing real-time sanity changes (delta) based on dapperness, moisture, lighting, nearby auras, and ghost presence. It enforces sanity decay thresholds, supports dual modes (Insanity/Lunacy), and synchronizes state changes via the replica system for multiplayer consistency.

## Dependencies & Tags
- **Component Requirements:** `inst.components.health` (via `IsInvincible()` check), `inst.components.moisture` (for moisture-based sanity penalty), `inst.components.inventory` (for dapperness evaluation), `inst.components.rider` (for mounted sanity aura checks), `inst.LightWatcher` (for ambient light level), `TheWorld.state`, `TheWorld.shard.components.shard_players`.
- **Tags Considered:** `sanityaura`, `FX`, `NOCLICK`, `DECOR`, `INLIMBO`, `spawnprotection`.
- **No tags added or removed directly** by this component, but it reads tags from other entities (e.g., `sanityaura`) and player-held items.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `max` | number | 100 | Maximum possible sanity value. |
| `current` | number | `max` | Current sanity value. |
| `mode` | number (`SANITY_MODE_*`) | `SANITY_MODE_INSANITY` | Current sanity mode: 0 for Insanity, 1 for Lunacy. |
| `_lunacy_sources` | SourceModifierList | `new SourceModifierList(inst, false, boolean)` | Tracks active lunacy sources to determine mode. |
| `rate` | number | 0 | Instantaneous sanity change rate (per second). |
| `ratescale` | number (`RATE_SCALE_*`) | `RATE_SCALE.NEUTRAL` | Scale factor applied to rate; updates dynamically based on `rate` magnitude. |
| `rate_modifier` | number | 1 | Multiplier applied to total rate after accumulation. |
| `sane` | boolean | true | Whether the entity *is* sane (not influenced by induced states). |
| `dapperness` | number | 0 | Base dapperness (sanity gain) from equipped items. |
| `dapperness_mult` | number | 1 | Multiplier for dapperness effect. |
| `externalmodifiers` | SourceModifierList | `new SourceModifierList(self.inst, 0, additive)` | External additive modifiers to sanity rate (e.g., per-character buffs). |
| `inducedinsanity` | boolean or nil | nil | Whether induced (by external forces, e.g., Deerclops) — overrides sanity status in Insanity mode. |
| `inducedinsanity_sources` | table or nil | nil | Set of sources currently inducing insanity. |
| `inducedlunacy` | boolean or nil | nil | Whether induced (by external forces) — overrides sanity status in Lunacy mode. |
| `inducedlunacy_sources` | table or nil | nil | Set of sources currently inducing lunacy. |
| `night_drain_mult` | number | 1 | Multiplier for night-time sanity drain. |
| `neg_aura_mult` | number | 1 | Deprecated; use `neg_aura_modifiers`. |
| `neg_aura_modifiers` | SourceModifierList | `new SourceModifierList(self.inst)` | Additive modifiers for negative aura magnitude. |
| `neg_aura_absorb` | number | 0 | Amount of negative aura strength absorbed (reducing its drain). |
| `neg_aura_immune_sources` | SourceModifierList | `new SourceModifierList(inst, false, boolean)` | Tracks immunity to negative auras. |
| `penalty` | number | 0 | Max-sanity reduction due to penalties (e.g., Equine). |
| `sanity_penalties` | table | {} | Key-value store for custom penalty modifiers. |
| `ghost_drain_mult` | number | 0 | Effective multiplier for ghost-player sanity drain. |
| `custom_rate_fn` | function or nil | nil | Optional per-frame callback returning additional rate (e.g., Wormwood). |
| `sanity_aura_immune_sources` | SourceModifierList | `new SourceModifierList(inst, false, boolean)` | Tracks immunity to *all* sanity auras. |
| `sanity_aura_immunities` | table or nil | nil | Per-tag immunity lists for specific auras (e.g., Wendy’s ghost aura tolerance). |
| `player_ghost_immune_sources` | SourceModifierList | `new SourceModifierList(inst, false, boolean)` | Immunity to ghost-player sanity drain. |
| `light_drain_immune_sources` | SourceModifierList | `new SourceModifierList(inst, false, boolean)` | Immunity to light-based sanity drain. |

## Main Functions

### `IsSane()`
* **Description:** Returns `true` if the entity is currently considered *sane* (Insanity mode) or *enlightened* (Lunacy mode), respecting `inducedinsanity` and `inducedlunacy`. This is the canonical check for "sanity state".
* **Parameters:** None.

### `IsInsane()`
* **Description:** Returns `true` if in **Insanity mode** *and* not sane *and* not induced lunacy.
* **Parameters:** None.

### `IsEnlightened()`
* **Description:** Returns `true` if in **Lunacy mode** *and* not sane *and* not induced insanity.
* **Parameters:** None.

### `UpdateMode_Internal()`
* **Description:** Checks `_lunacy_sources` to determine the current mode (Insanity vs. Lunacy), updates `self.mode`, and fires `sanitymodechanged` event if mode changes.
* **Parameters:** None.

### `EnableLunacy(enable, source)`
* **Description:** Adds/removes a lunacy source, which may trigger mode switch to Lunacy.
* **Parameters:**
  - `enable` (boolean): Whether to activate the lunacy source.
  - `source` (any): Identifier for the source.

### `AddSanityPenalty(key, mod)`
* **Description:** Applies a sanity penalty (reduces max sanity), stored under `key`. Triggers recalculation of the `penalty` value.
* **Parameters:**
  - `key` (any): Unique identifier for the penalty source.
  - `mod` (number): Penalty magnitude (capped so max sanity doesn’t drop below 5).

### `RemoveSanityPenalty(key)`
* **Description:** Removes the penalty source identified by `key`. Triggers recalculation of `penalty`.
* **Parameters:**
  - `key` (any): Key used during `AddSanityPenalty`.

### `RecalculatePenalty()`
* **Description:** Sums all `sanity_penalties`, caps total at `1 - (5 / self.max)`, updates `self.penalty`, and triggers sanity recalculation via `DoDelta(0)`.
* **Parameters:** None.

### `SetFullAuraImmunity(immunity, source)`
* **Description:** Grants or removes immunity to *all* sanity auras (both positive and negative) for a given source.
* **Parameters:**
  - `immunity` (boolean): Enable/disable immunity.
  - `source` (any): Source identifier.

### `SetNegativeAuraImmunity(immunity, source)`
* **Description:** Grants or removes immunity specifically to *negative* auras.
* **Parameters:**
  - `immunity` (boolean): Enable/disable immunity.
  - `source` (any): Source identifier.

### `SetPlayerGhostImmunity(immunity, source)`
* **Description:** Grants or removes immunity to sanity drain caused by nearby ghosts (non-player or player ghosts).
* **Parameters:**
  - `immunity` (boolean): Enable/disable immunity.
  - `source` (any): Source identifier.

### `SetLightDrainImmune(immunity, source)`
* **Description:** Grants or removes immunity to light-level-based sanity drain (e.g., bright daylight or dark).
* **Parameters:**
  - `immunity` (boolean): Enable/disable immunity.
  - `source` (any): Source identifier.

### `SetInducedInsanity(src, val)`
* **Description:** Sets or clears an *induced insanity* condition (overrides sanity status in Insanity mode). Updates replica and fires `inducedinsanity` event.
* **Parameters:**
  - `src` (any): Source of the induced state.
  - `val` (boolean): `true` to induce, `false` to remove.

### `SetInducedLunacy(src, val)`
* **Description:** Sets or clears an *induced lunacy* condition (overrides sanity status in Lunacy mode). Updates replica and fires `inducedlunacy` event.
* **Parameters:**
  - `src` (any): Source of the induced state.
  - `val` (boolean): `true` to induce, `false` to remove.

### `DoDelta(delta, overtime)`
* **Description:** Applies a sanity delta, clamping `current` within `[0, max - penalty * max]`. Checks sanity thresholds to toggle `sane`, fires `sanitydelta`/`gosane`/`goinsane`/`goenlightened` events, and updates `onSane`/`onInsane`/`onEnlightened` callbacks if set.
* **Parameters:**
  - `delta` (number): Raw sanity change to apply.
  - `overtime` (boolean): Whether this change is smoothed over time.

### `Recalc(dt)`
* **Description:** Computes and updates `self.rate` by summing contributions from:
  - Dapperness (gear, equipped items),
  - Moisture,
  - Ambient light level (day/night),
  - Nearby sanity auras (with tag/tag-based immunity support),
  - Mount-specific auras,
  - Ghost-player drain,
  - `externalmodifiers`,
  - `custom_rate_fn`.
  Applies `rate * dt` via `DoDelta`.
* **Parameters:**
  - `dt` (number): Time delta in seconds.

### `GetPercent()`
* **Description:** Returns current sanity as a fraction of `max`, *adjusted for `inducedinsanity` (0) or `inducedlunacy` (1 - penalty)*.
* **Parameters:** None.

### `GetPercentWithPenalty()`
* **Description:** Returns current sanity as a fraction of *effective max* (`max * (1 - penalty)`), used for UI gauges. Returns `0` if induced insomnia; `1` if induced lunacy.
* **Parameters:** None.

### `SetPercent(per, overtime)`
* **Description:** Sets `current` to `per * max` and applies the delta via `DoDelta`.
* **Parameters:**
  - `per` (number): Target fraction (0.0–1.0).
  - `overtime` (boolean): Whether to treat delta as smooth.

### `SetMax(amount)`
* **Description:** Sets `max` and `current` to `amount`, then forces a no-op delta update (`DoDelta(0)`).
* **Parameters:**
  - `amount` (number): New maximum sanity.

### `GetRateScale()`
* **Description:** Returns current `ratescale` (e.g., `RATE_SCALE.DECREASE_HIGH`). Updated during `Recalc`.
* **Parameters:** None.

### `RecalcGhostDrain()`
* **Description:** Updates `ghost_drain_mult` based on server ghost/alive player counts, or sets to 0 if immune. Called on `OnUpdate` and `Recalc`.
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** Main update loop. Calls `Recalc(dt)` unless invincible, sleeping, in limbo, or tagged for immunity; otherwise just refreshes `ghost_drain_mult` and resets rate to 0.
* **Parameters:**
  - `dt` (number): Time delta.

### `OnSave()`
* **Description:** Returns serializable state (`current`, `sane`, `mode`).
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Loads `current`, `sane`, and `mode` from saved data and triggers post-load recalculation.
* **Parameters:**
  - `data` (table): Saved component state.

## Events & Listeners
- **Events this component listens to (via `inst:ListenForEvent`):**  
  *None explicitly listed in the provided code.*

- **Events this component pushes/triggers (`inst:PushEvent`):**
  - `sanitydelta` — sanity change with old/new percent and mode.
  - `sanitymodechanged` — triggered when mode switches (Insanity ↔ Lunacy).
  - `inducedinsanity` — fired when `inducedinsanity` changes.
  - `inducedlunacy` — fired when `inducedlunacy` changes.
  - `gosane` — fired when transitioning to a *sane* state.
  - `goinsane` — fired when transitioning to an *insane* state (Insanity mode only).
  - `goenlightened` — fired when transitioning to an *enlightened* state (Lunacy mode only).
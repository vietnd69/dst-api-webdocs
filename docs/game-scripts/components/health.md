---
id: health
title: Health
description: Manages entity health state, including damage, healing, regeneration, penalties, and fire damage handling.
tags: [combat, entity, network, damage]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: e984e3b6
system_scope: entity
---

# Health

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Health` is the core component for managing an entity's life state in DST. It tracks current and maximum health, handles damage and healing operations (including fire damage and regeneration), supports health penalties (e.g., for player death), and synchronizes state with clients via network replicas. It integrates with `combat`, `burnable`, and `repairable` components, and uses `SourceModifierList` for modular damage absorption and reduction modifiers.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("health")
inst.components.health:SetMaxHealth(200)
inst.components.health:DoDelta(-50, nil, "damage_source") -- deal 50 damage
if inst.components.health:IsDead() then
    -- handle death
end
```

## Dependencies & tags
**Components used:** `combat`, `burnable`, `repairable`  
**Tags:** Adds `invincible` (cheat mode only), `NOCLICK` (during fade-out), and manages `NOCLICK` removal via logic; events may trigger `death`, `healthdelta`, `firedamage`, `startlunarburn`, `stoplunarburn`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `maxhealth` | number | `100` | Maximum allowed health (modified by penalty). |
| `minhealth` | number | `0` | Minimum health floor before forcing death events. |
| `currenthealth` | number | `maxhealth` | Current health value. |
| `invincible` | boolean | `false` | Whether the entity is currently invincible. |
| `takingfiredamage` | boolean | `false` | Whether the entity is currently burning. |
| `takingfiredamagelow` | boolean? | `nil` | Whether the entity is taking low-intensity fire damage. |
| `fire_damage_scale` | number | `1` | Base multiplier for fire damage. |
| `externalfiredamagemultipliers` | SourceModifierList | instance | Modifiers applied to fire damage scale. |
| `penalty` | number | `0` | Health penalty fraction (0 to 0.75). |
| `disable_penalty` | boolean | `not TUNING.HEALTH_PENALTY_ENABLED` | Whether health penalties are disabled. |
| `externalabsorbmodifiers` | SourceModifierList | instance | Damage absorption modifiers. |
| `externalreductionmodifiers` | SourceModifierList | instance | Damage reduction modifiers. |
| `canmurder` | boolean | `true` | Whether the entity can be the source of a "murder" event. |
| `canheal` | boolean | `true` | Whether the entity can be healed. |
| `nonlethal_temperature` | boolean | `TUNING.NONLETHAL_TEMPERATURE` | Whether temperature damage is non-lethal. |
| `nonlethal_hunger` | boolean | `TUNING.NONLETHAL_HUNGER` | Whether hunger damage is non-lethal. |
| `nonlethal_pct` | number | `TUNING.NONLETHAL_PERCENT` | Damage threshold below which non-lethal causes have no effect. |

## Main functions
### `SetMaxHealth(amount)`
* **Description:** Sets the entity's maximum health and resets current health to the new maximum. Triggers HUD updates.
* **Parameters:** `amount` (number) - new maximum health value.
* **Returns:** Nothing.

### `SetCurrentHealth(amount)`
* **Description:** Directly sets current health without triggering damage/healing logic or events.
* **Parameters:** `amount` (number) - new current health value.
* **Returns:** Nothing.

### `SetVal(amount, cause, afflicter)`
* **Description:** Safely sets health to `amount`, clamping between min/max and handling death events. Used internally by `DoDelta`.
* **Parameters:**  
  - `amount` (number) – target health value  
  - `cause` (string?) – cause of change (e.g., `"damage"`, `"heal"`)  
  - `afflicter` (GEntity?) – entity responsible for change (optional)
* **Returns:** Nothing.

### `DoDelta(amount, overtime, cause, ignore_invincible, afflicter, ignore_absorb)`
* **Description:** Applies health change `amount` (positive = heal, negative = damage), considering invincibility, absorption, modifiers, and fire/temperature rules.
* **Parameters:**  
  - `amount` (number) – amount to change health by  
  - `overtime` (boolean?) – whether change occurs over time  
  - `cause` (string?) – source of damage/healing (e.g., `"fire"`, `"regen"`)  
  - `ignore_invincible` (boolean?) – bypass invincibility check  
  - `afflicter` (GEntity?) – entity causing change  
  - `ignore_absorb` (boolean?) – skip absorption modifiers
* **Returns:** `number` – actual applied damage (may be reduced due to modifiers/clamping).
* **Error states:** Returns `0` if non-lethal causes apply (`nonlethal_temperature`/`nonlethal_hunger`/`nonlethal_pct`), or if `ignore_invincible` is false and entity is invincible/teleporting.

### `IsDead()`
* **Description:** Checks whether the entity is dead (health ≤ 0).
* **Parameters:** None.
* **Returns:** `boolean` – `true` if dead.

### `GetPercent()`
* **Description:** Returns current health as a fraction of maximum health (`currenthealth / maxhealth`).
* **Parameters:** None.
* **Returns:** `number` – health percentage (0.0 to 1.0).

### `GetPercentWithPenalty()`
* **Description:** Returns current health as a fraction of maximum *penalized* health (`currenthealth / maxwithpenalty`).
* **Parameters:** None.
* **Returns:** `number` – health percentage accounting for penalty.

### `SetPenalty(penalty)`
* **Description:** Sets a health penalty (e.g., after player death), capped between 0 and `TUNING.MAXIMUM_HEALTH_PENALTY`.
* **Parameters:** `penalty` (number) – penalty fraction (0.0 = no penalty, 1.0 = 100% health penalty).
* **Returns:** Nothing.

### `DeltaPenalty(delta)`
* **Description:** Adjusts penalty by `delta`, clamps the result, and forces HUD update.
* **Parameters:** `delta` (number) – change in penalty.
* **Returns:** Nothing.

### `Kill()`
* **Description:** Kills the entity by setting health to 0 (respects invincibility).
* **Parameters:** None.
* **Returns:** Nothing.

### `ForceKill()`
* **Description:** Kills the entity by setting health to 0, bypassing invincibility.
* **Parameters:** None.
* **Returns:** Nothing.

### `StartRegen(amount, period, interruptcurrentregen)`
* **Description:** Starts a simple regen loop adding `amount` health every `period` seconds.
* **Parameters:**  
  - `amount` (number) – health to add per tick  
  - `period` (number) – interval in seconds between ticks  
  - `interruptcurrentregen` (boolean?) – if `false`, does not cancel existing regen task
* **Returns:** Nothing.

### `AddRegenSource(source, amount, period, key)`
* **Description:** Adds a regen source (e.g., a consumable or status effect) that regenerates health at a fixed rate. Supports multiple named sources (`key`) per source entity.
* **Parameters:**  
  - `source` (GEntity?) – entity/object representing the regen source (can be `nil` for non-associative regen)  
  - `amount` (number) – health to add per tick  
  - `period` (number) – interval in seconds  
  - `key` (string) – unique identifier for this regen effect (used to add/remove specific effects)
* **Returns:** Nothing.

### `RemoveRegenSource(source, key)`
* **Description:** Removes a specific regen effect (`key`) or all regen effects associated with `source`.
* **Parameters:**  
  - `source` (GEntity?) – source entity to remove  
  - `key` (string?) – specific key to remove; if `nil`, removes all regen from `source`
* **Returns:** Nothing.

### `StopRegen()`
* **Description:** Stops the primary (`StartRegen`) regen loop and clears associated task.
* **Parameters:** None.
* **Returns:** Nothing.

### `DoFireDamage(amount, doer, instant)`
* **Description:** Applies fire damage, handling burn state, low-intensity fire, and fire damage limits per second.
* **Parameters:**  
  - `amount` (number) – base fire damage amount  
  - `doer` (GEntity?) – entity causing fire damage  
  - `instant` (boolean) – whether damage is immediate or ongoing (e.g., from burning state)
* **Returns:** Nothing.

### `GetFireDamageScale()`
* **Description:** Computes effective fire damage multiplier based on fire scale, external modifiers, and controlled burn (if any).
* **Parameters:** None.
* **Returns:** `number` – combined fire damage multiplier.

### `SetInvincible(val)`
* **Description:** Enables or disables invincibility and pushes `invincibletoggle` event.
* **Parameters:** `val` (boolean) – new invincibility state.
* **Returns:** Nothing.

### `IsInvincible()`
* **Description:** Checks if invincible via `invincible` flag or state graph `"temp_invincible"` tag.
* **Parameters:** None.
* **Returns:** `boolean`.

### `GetMaxWithPenalty()`
* **Description:** Returns effective maximum health after penalty is applied.
* **Parameters:** None.
* **Returns:** `number` – `maxhealth * (1 - penalty)`.

### `IsHurt()`
* **Description:** Checks if current health is below effective maximum (considering penalty).
* **Parameters:** None.
* **Returns:** `boolean` – `true` if health < `maxwithpenalty`.

### `SetPercent(percent, overtime, cause)`
* **Description:** Sets health to `percent` of max health (e.g., `0.5` = 50% health).
* **Parameters:**  
  - `percent` (number) – fraction of max health  
  - `overtime` (boolean) – whether change is gradual  
  - `cause` (string?) – cause string
* **Returns:** Nothing.

### `ForceUpdateHUD(overtime)`
* **Description:** Forces HUD update by applying a no-op damage delta.
* **Parameters:** `overtime` (boolean) – passed to `DoDelta`.
* **Returns:** Nothing.

### `SetAbsorptionAmount(amount)`
* **Description:** Sets legacy global absorption amount (deprecated; prefer `externalabsorbmodifiers`).
* **Parameters:** `amount` (number) – absorption value (0 to 1).
* **Returns:** Nothing.

### `SetAbsorptionAmountFromPlayer(amount)`
* **Description:** Sets legacy player-specific absorption (deprecated).
* **Parameters:** `amount` (number) – absorption value.
* **Returns:** Nothing.

### `TransferComponent(newinst)`
* **Description:** Copies fire damage state and current health percentage to a new entity’s health component.
* **Parameters:** `newinst` (GEntity) – destination entity.
* **Returns:** Nothing.

### `RegisterLunarBurnSource(source, flags)`
* **Description:** Registers a lunar burn source and its flags (bitmask); updates `lunarburnflags` and fires `startlunarburn` event.
* **Parameters:**  
  - `source` (GEntity?) – source entity  
  - `flags` (number) – bitmask of lunar burn flags
* **Returns:** Nothing.

### `UnregisterLunarBurnSource(source)`
* **Description:** Removes a lunar burn source and recalculates/updates flags.
* **Parameters:** `source` (GEntity?) – source to remove.
* **Returns:** Nothing.

### `GetLunarBurnFlags()`
* **Description:** Returns current combined lunar burn flags.
* **Parameters:** None.
* **Returns:** `number` – flags bitmask.

### `CalcLunarBurnFlags()`
* **Description:** Recalculates combined flags from `lunarburns` table.
* **Parameters:** None.
* **Returns:** `number` – combined flags.

### `GetDebugString()`
* **Description:** Returns a debug string showing current/penalized max health and regen info.
* **Parameters:** None.
* **Returns:** `string` – e.g., `"100.00 / 100.00, regen 1.00 every 1.00s"`.

## Events & listeners
- **Listens to:**  
  - `onremove` (on lunar burn source entities) – for cleanup  
- **Pushes:**  
  - `pre_health_setval` – before health value is set  
  - `minhealth` – when health reaches minimum  
  - `death` / `entity_death` – when entity dies  
  - `healthdelta` – after any health change  
  - `startfiredamage`, `changefiredamage`, `stopfiredamage` – fire damage state changes  
  - `startlunarburn`, `stoplunarburn` – lunar burn state changes  
  - `invincibletoggle` – when invincibility changes

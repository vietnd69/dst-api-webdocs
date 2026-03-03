---
id: battleborn
title: Battleborn
description: Manages the "Battleborn" mechanic—accumulating a resource when attacking enemies and consuming it to heal, repair equipment, or restore sanity when a threshold is reached.
tags: [combat, buff, resource]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: b0893973
system_scope: entity
---

# Battleborn

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Battleborn` tracks damage dealt by an entity and converts it into a resource (`battleborn`) that accumulates over time. When enough is stored—exceeding `battleborn_trigger_threshold`—the component consumes it to restore health (healing or equipment repair) and/or sanity, depending on enabled flags. It supports dynamic tuning of thresholds, decay rates, bonuses, and validation logic, and integrates with the `health`, `sanity`, `inventory`, `armor`, `combat`, and `weapon` components.

The component automatically clears accumulated `battleborn` on death and applies decay logic if stored value exceeds the store window (`battleborn_store_time`) before triggering.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("battleborn")

-- Configure behavior
inst.components.battleborn:SetTriggerThreshold(10)
inst.components.battleborn:SetDecayTime(5)
inst.components.battleborn:SetStoreTime(10)
inst.components.battleborn:SetBattlebornBonus(1.5)
inst.components.battleborn:SetHealthEnabled(true)
inst.components.battleborn:SetSanityEnabled(true)

-- Optional: custom validation or trigger logic
inst.components.battleborn:SetValidVictimFn(function(victim) return victim:HasTag("monster") end)
inst.components.battleborn:SetOnTriggerFn(function(inst, amount)
    inst:PushEvent("battleborn_triggered", { amount = amount })
end)
```

## Dependencies & tags
**Components used:**  
- `health` (`DoDelta`, `GetMaxWithPenalty`, `IsDead`, `IsHurt`)  
- `sanity` (`DoDelta`)  
- `inventory` (`ForEachEquipment`)  
- `armor` (`Repair`, `IsDamaged`)  
- `combat` (`defaultdamage`)  
- `weapon` (`GetDamage`)  

**Tags:**  
- No tags added or checked directly by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `battleborn` | number | `0` | Current accumulated Battleborn resource. |
| `battleborn_time` | number | `0` | Timestamp of last accumulation (used for decay calculation). |
| `battleborn_trigger_threshold` | number | `TUNING.BATTLEBORN_TRIGGER_THRESHOLD` | Threshold at which accumulated resource triggers healing/recovery. |
| `battleborn_decay_time` | number | `TUNING.BATTLEBORN_DECAY_TIME` | Time window (in seconds) over which stored resource decays once out of the store window. |
| `battleborn_store_time` | number | `TUNING.BATTLEBORN_STORE_TIME` | Time window (in seconds) after last hit during which resource is *not* decayed. |
| `battleborn_bonus` | number | `0` | Multiplier applied to damage-to-resource conversion. |
| `clamp_min` | number | `0.33` | Minimum per-hit delta for accumulated resource. |
| `clamp_max` | number | `2.0` | Maximum per-hit delta for accumulated resource. |
| `allow_zero` | boolean | `true` | Whether damage `<= 0` should still contribute (minimal) resource. |
| `validvictimfn` | function or `nil` | `nil` | Optional predicate function to validate a target before processing. |
| `ontriggerfn` | function or `nil` | `nil` | Optional callback fired when resource is fully consumed. |
| `health_enabled` | boolean | `true` | Whether health/sanity healing is allowed. |
| `sanity_enabled` | boolean | `true` | Whether sanity restoration is allowed. |
| `RepairEquipment` | function | `RepairEquipment` | Reference to local repair function (exposed for mod override). |

## Main functions
### `SetTriggerThreshold(threshold)`
*   **Description:** Sets the amount of accumulated Battleborn required to trigger healing/repair/sanity restoration.
*   **Parameters:** `threshold` (number) – target threshold value.
*   **Returns:** Nothing.

### `SetDecayTime(time)`
*   **Description:** Configures how long (in seconds) it takes for stored Battleborn to decay to zero *after* the store window has expired.
*   **Parameters:** `time` (number) – decay duration in seconds.
*   **Returns:** Nothing.

### `SetStoreTime(time)`
*   **Description:** Sets the window (in seconds) *after* an attack during which stored Battleborn is preserved (no decay occurs).
*   **Parameters:** `time` (number) – store window duration in seconds.
*   **Returns:** Nothing.

### `SetOnTriggerFn(ontriggerfn)`
*   **Description:** Assigns a callback function to be invoked when Battleborn resource is fully consumed.
*   **Parameters:** `ontriggerfn` (function) – function signature: `fn(inst, amount)` where `amount` is the consumed resource value.
*   **Returns:** Nothing.

### `SetBattlebornBonus(bonus)`
*   **Description:** Sets a multiplier applied to the damage-based resource calculation. Higher values increase resource gain per hit.
*   **Parameters:** `bonus` (number) – multiplicative factor (e.g., `1.5` gives 150% base gain).
*   **Returns:** Nothing.

### `SetSanityEnabled(enabled)`
*   **Description:** Enables or disables sanity restoration when triggering.
*   **Parameters:** `enabled` (boolean) – if `true`, sanity is restored on trigger.
*   **Returns:** Nothing.

### `SetHealthEnabled(enabled)`
*   **Description:** Enables or disables health restoration (healing + equipment repair) when triggering.
*   **Parameters:** `enabled` (boolean) – if `true`, health/equipment is restored on trigger.
*   **Returns:** Nothing.

### `SetClampMin(min)`
*   **Description:** Sets the minimum per-hit contribution to Battleborn.
*   **Parameters:** `min` (number) – lower bound for delta (e.g., `0.33`).
*   **Returns:** Nothing.

### `SetClampMax(max)`
*   **Description:** Sets the maximum per-hit contribution to Battleborn.
*   **Parameters:** `max` (number) – upper bound for delta (e.g., `2.0`).
*   **Returns:** Nothing.

### `SetValidVictimFn(fn)`
*   **Description:** Assigns a validation function that determines whether an attacked entity counts toward Battleborn accumulation.
*   **Parameters:** `fn` (function) – predicate: `fn(victim)` returns `true`/`false`. If `nil`, all non-dead victims are valid.
*   **Returns:** Nothing.

### `OnAttack(data)`
*   **Description:** Internal handler called on `onattackother` event. Processes an attack to accumulate Battleborn and triggers consumption if threshold is met.
*   **Parameters:** `data` (table) – event payload containing `target`, `weapon`, and damage information.
*   **Returns:** Nothing.
*   **Error states:** No effect if the inst is dead, or if the victim is invalid per `validvictimfn`. Delta is clamped to `[clamp_min, clamp_max]`.

### `OnDeath()`
*   **Description:** Resets accumulated Battleborn to zero upon entity death.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onattackother` – triggers `OnAttack(data)` to compute and store Battleborn.  
  - `death` – triggers `OnDeath()` to clear accumulated Battleborn.  
- **Pushes:**  
  - None directly. However, upon triggering:  
    - `healthdelta` event is fired by `Health:DoDelta`.  
    - `sanitydelta` event is fired by `Sanity:DoDelta`.  
    - Custom `ontriggerfn` may push arbitrary events (mod-defined).

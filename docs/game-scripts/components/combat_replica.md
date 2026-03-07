---
id: combat_replica
title: Combat Replica
description: Provides a network-replicated interface for combat-related operations, synchronizing combat state (target, panic, range) and attack logic between client and server in Don't Starve Together.
tags: [combat, network, ai]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 49280ca8
system_scope: network
---

# Combat Replica

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Combat Replica` is a client-side component that mirrors and exposes key combat functionality from the server-side `combat` component. It synchronizes state like target, panic mode, attack range, and attack cooldown across the network using net variables (`net_entity`, `net_bool`, `net_float`). It is primarily used on the client to evaluate combat decisions (e.g., target validity, attack readiness) in a prediction-safe manner, especially for player entities, while deferring authoritative logic to the server via the corresponding `combat` component when present.

It integrates closely with the `combat`, `follower`, `inventory`, `rider`, and `sanity` components, and relies on replicated data (`replica.*`) to reason about world state without direct server queries.

## Usage example
```lua
-- Typically added automatically to player entities; manual usage is rare.
local inst = ThePlayer
if inst.replica.combat ~= nil then
    -- Set and retrieve target
    inst.replica.combat:SetTarget(target)
    local target = inst.replica.combat:GetTarget()

    -- Check attack readiness
    if inst.replica.combat:CanAttack(target) then
        inst.replica.combat:StartAttack()
    end

    -- Get effective attack range, accounting for weapon
    local range = inst.replica.combat:GetAttackRangeWithWeapon()
end
```

## Dependencies & tags
**Components used:** `combat`, `follower`, `inventory`, `rider`, `sanity`, `inventoryitem`  
**Tags:** Checks `INLIMBO`, `notarget`, `debugnoattack`, `invisible`, `noattack`, `noplayertarget`, `playerghost`, `flight`, `shadowcreature`, `nightmarecreature`, `spawner`, `domesticated`, `companion`, `peacefulmount`, `crazy`, `propweapon`, `extinguisher`, `rangedlighter`, `canlight`, `fire`, `smolder`, `burnt`, `canlight`, `spawnprotection`, `player`, `playerghost`. No tags are added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_target` | `net_entity` | `nil` | Network-replicated current combat target. |
| `_ispanic` | `net_bool` | `false` | Whether the entity is in panic mode. |
| `_attackrange` | `net_float` | `0` | Base attack range (server-authoritative). |
| `_laststartattacktime` | number or `nil` | `nil` | Timestamp of last attack start (client-side, for cooldown estimation). |
| `classified` | `PlayerClassified` or `nil` | `nil` | Server-side combat classification data, attached via `AttachClassified`. |

## Main functions
### `SetTarget(target)`
* **Description:** Sets the network-replicated current combat target.  
* **Parameters:** `target` (Entity or `nil`) — the entity to target.  
* **Returns:** Nothing.  
* **Error states:** None. Unsafe if used without server consensus (should only be called via server-authoritative `combat` component on the server, but this replica ensures sync).

### `GetTarget()`
* **Description:** Returns the network-replicated current combat target.  
* **Parameters:** None.  
* **Returns:** Entity or `nil`.

### `SetLastTarget(target)`
* **Description:** Sets the last combat target on the `PlayerClassified` (for recent-target tracking).  
* **Parameters:** `target` (Entity or `nil`) — the last entity targeted.  
* **Returns:** Nothing.

### `IsRecentTarget(target)`
* **Description:** Determines if `target` is the current target or the last target (within memory window). Used for AI behavior consistency.  
* **Parameters:** `target` (Entity or `nil`) — entity to check.  
* **Returns:** `boolean` — `true` if `target` is recent.  
* **Error states:** If no `combat` component exists, falls back to `classified.lastcombattarget` or `_target`.

### `SetIsPanic(ispanic)`
* **Description:** Updates the network-replicated panic state.  
* **Parameters:** `ispanic` (boolean) — whether the entity is panicked.  
* **Returns:** Nothing.

### `SetAttackRange(attackrange)`
* **Description:** Updates the network-replicated base attack range.  
* **Parameters:** `attackrange` (number) — new attack range value.  
* **Returns:** Nothing.

### `GetAttackRangeWithWeapon()`
* **Description:** Returns the current effective attack range, including the weapon's range (if any), client-side.  
* **Parameters:** None.  
* **Returns:** number — effective range, clamped to `>= 0`.  
* **Error states:** Falls back to client-side weapon lookup if `combat` component is absent.

### `GetWeaponAttackRange()`
* **Description:** Returns the range of the currently equipped weapon only (0 if none or invalid).  
* **Parameters:** None.  
* **Returns:** number — weapon range, or `0`.

### `GetWeapon()`
* **Description:** Returns the current equipped weapon on the client (replica-based).  
* **Parameters:** None.  
* **Returns:** `ReplicaInventoryItem` or `nil` — the weapon replica, or `nil` if none qualifies.  
* **Error states:** Skips weapons if mounted (unless ranged). Checks `weapon`, `projectile`, `rangedweapon`, and `complexprojectile` tags.

### `SetMinAttackPeriod(minattackperiod)`
* **Description:** Sets the minimum attack period on the `PlayerClassified`.  
* **Parameters:** `minattackperiod` (number) — attack cooldown in seconds.  
* **Returns:** Nothing.

### `MinAttackPeriod()`
* **Description:** Returns the minimum attack period (server if available, otherwise client-side estimate).  
* **Parameters:** None.  
* **Returns:** number — attack period, or `0` if unavailable.

### `SetCanAttack(canattack)`
* **Description:** Updates the `canattack` flag on `PlayerClassified`.  
* **Parameters:** `canattack` (boolean) — whether the entity can currently attack.  
* **Returns:** Nothing.

### `StartAttack()`
* **Description:** Initiates an attack, updating server or client-side cooldown timestamp.  
* **Parameters:** None.  
* **Returns:** Nothing.  
* **Error states:** If `combat` component is present, defers to server-side logic; otherwise, sets `_laststartattacktime` to current time.

### `CancelAttack()`
* **Description:** Cancels an ongoing attack attempt, clearing the client cooldown timestamp.  
* **Parameters:** None.  
* **Returns:** Nothing.  
* **Error states:** Delegates to `combat` if present; otherwise, sets `_laststartattacktime` to `nil`.

### `InCooldown()`
* **Description:** Checks if the entity is in the attack cooldown window.  
* **Parameters:** None.  
* **Returns:** `boolean` — `true` if cooldown is active.  
* **Error states:** Falls back to `combat` or client-side timestamp and `minattackperiod`.

### `CanAttack(target)`
* **Description:** Evaluates if the entity can attack `target`, considering range, target validity, panic, busy state, and cooldown. Used client-side for prediction.  
* **Parameters:** `target` (Entity or `nil`) — target to evaluate.  
* **Returns:** `boolean, boolean` — first return is `true` if attack is possible, second is `true` if target is invalid (for AI rethinking).  
* **Error states:** Range check uses prediction-aware tolerance (`-.5` units). Does not check `"hit"` state tag on client.

### `LocomotorCanAttack(reached_dest, target)`
* **Description:** Determines if the entity can initiate an attack *after moving*, factoring in path completion, target validity, and weapon type (e.g., melee vs. ranged). Used by AI movement logic.  
* **Parameters:**  
  - `reached_dest` (boolean or `nil`) — whether movement goal has been reached.  
  - `target` (Entity or `nil`) — target to evaluate.  
* **Returns:** `boolean, boolean, boolean` — `(reached_dest, can_not_attack, in_cooldown)`.  
* **Error states:** Adjusts `reached_dest` for ground validity in melee attacks for players. Only checks `"hit"` state tag; `"busy"` alone may not block.

### `CanExtinguishTarget(target, weapon)`
* **Description:** Checks if `target` can be extinguished with the given or equipped weapon.  
* **Parameters:**  
  - `target` (Entity) — target entity.  
  - `weapon` (`ReplicaInventoryItem` or `nil`) — weapon to use.  
* **Returns:** `boolean` — `true` if target is `smolder`/`fire` and weapon has `extinguisher` tag or entity has `extinguisher`.  
* **Error states:** Does not delegate to server `combat` component in this branch; implements simplified client-side logic.

### `CanLightTarget(target, weapon)`
* **Description:** Checks if `target` can be lit on fire with the given or equipped weapon.  
* **Parameters:**  
  - `target` (Entity) — target entity.  
  - `weapon` (`ReplicaInventoryItem` or `nil`) — weapon to use.  
* **Returns:** `boolean` — `true` if target is `canlight`, not `fire`/`burnt`, and weapon has `rangedlighter`.  
* **Error states:** Does not delegate to server `combat` component in this branch; implements simplified client-side logic.

### `CanHitTarget(target)`
* **Description:** Determines if `target` is within range to be hit, considering valid action type (attack/ light/exinguish).  
* **Parameters:** `target` (Entity or `nil`) — target to check.  
* **Returns:** `boolean` — `true` if within range and type-allowed.  
* **Error states:** Uses prediction-aware tolerance (`0.5` units). Excludes `INLIMBO` targets.

### `IsValidTarget(target)`
* **Description:** Performs a comprehensive validity check for a combat target, including entity visibility, distance, tags, and PVP rules.  
* **Parameters:** `target` (Entity or `nil`) — target to validate.  
* **Returns:** `boolean` — `true` if target is valid.  
* **Error states:** Enforces `shadowcreature`/`nightmarecreature` restrictions and `noplayertarget` rules. Validates PVP and follower targeting logic.

### `CanTarget(target)`
* **Description:** Combines `IsValidTarget` with additional situational checks (panic, flags like `notarget`, riding constraints).  
* **Parameters:** `target` (Entity) — target to validate.  
* **Returns:** `boolean` — `true` if target is usable.  
* **Error states:** Enforces rider mount restrictions (e.g., peaceful mounts block melee). Ignores `invisible` targets unless flagged for tracking.

### `CanBeAlly(guy)`
* **Description:** Determines if `guy` can be considered an ally (friend or neutral), based on leadership and group membership.  
* **Parameters:** `guy` (Entity) — entity to evaluate.  
* **Returns:** `boolean` — `true` if alliance is possible.  
* **Error states:** Enforces `alwayshostile`, self-check, leader/follower relationships, and `companion` status for players.

### `IsAlly(guy)`
* **Description:** Determines if `guy` is currently *not* an enemy, assuming they could be an ally.  
* **Parameters:** `guy` (Entity) — entity to evaluate.  
* **Returns:** `boolean` — `true` if not attacking the entity.  
* **Error states:** Depends on `guy.replica.combat:GetTarget()`.

### `TargetHasFriendlyLeader(target)`
* **Description:** Checks if `target` is protected due to having a leader that the entity respects (e.g., same leader, friendly player leader, or domesticated).  
* **Parameters:** `target` (Entity) — target to evaluate.  
* **Returns:** `boolean` — `true` if target is protected.  
* **Error states:** Accounts for followers and leaders via `follower` replica.

### `CanBeAttacked(attacker)`
* **Description:** Determines if *this entity* can be attacked by `attacker`, considering state tags, sanity, PVP, and shadow creature logic.  
* **Parameters:** `attacker` (Entity or `nil`) — potential attacker.  
* **Returns:** `boolean` — `true` if attack is allowed.  
* **Error states:** Returns `false` for `noattack`, `invisible`, `playerghost`, `flight`. Enforces PVP rules and follower targeting restrictions. Applies shadow creature visibility rules strictly.

## Events & listeners
- **Listens to:** `onremove` — triggered on `classified` to detach (via `ondetachclassified`).  
- **Pushes:** None directly. Does not fire events.

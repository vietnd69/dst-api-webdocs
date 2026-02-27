---
id: rabbitkingmanager
title: Rabbitkingmanager
description: Manages the lifecycle, state transitions, and gameplay mechanics of the Rabbit King entity in response to player actions and world conditions.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: cd4e5137
---

# Rabbitkingmanager

## Overview
This component acts as the central controller for Rabbit King behavior in *Don't Starve Together*. It manages spawning, leash tracking, state changes (Passive → Aggressive → Lucky), and cleanup of the Rabbit King entity in response to player interactions (feeding carrots, committing naughtiness, attacking), and world state. It operates exclusively on the master simulation and handles persistence, timers, sound triggers, and debug functionality.

## Dependencies & Tags
- Requires `TheWorld.ismastersim` (asserted on construction).
- Listens for and responds to the following events:
  - `attacked` (on Rabbit King)
  - `onremove` (on Rabbit King, player, and old players)
  - `death` (on player and old players)
  - `killed` (on players, to track naughtiness-generating kills)
  - `ms_playerjoined`, `ms_playerleft` (to manage per-player event subscriptions)
- Relies on components: `combat`, `inventoryitem`, `knownlocations`, `homeseeker`, `talker`, `soundemitter` (used conditionally).
- Tags involved: `"player"`, `"rabbit"`, `"manrabbit"`, `"shadowthrall_parasite_hosted"`, `"shadowthrall_parasited"` (used for naughtiness detection).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `PERIODIC_TICK_TIME` | number | `1` | Interval (in seconds) for housekeeping logic in `OnUpdate`. |
| `STATES` | table | `{ PASSIVE = 0, AGGRESSIVE = 1, LUCKY = 2 }` | State constants for Rabbit King behavior. |
| `ANNOUNCE_STRINGS` | table | Mapping of states to announcement string keys (e.g., `"ANNOUNCE_RABBITKING_AGGRESSIVE"`) | Localization keys used when the Rabbit King appears or attacks. |
| `SPAWN_PREFABS` | table | Mapping of states to Rabbit King prefab names (e.g., `"rabbitking_aggressive"`) | Prefab to spawn for each state. |
| `rabbitkingdata` | table? | `nil` | Stores current Rabbit King instance, associated player, old players list, accumulator, and intro task. Set only when active. |
| `carrots_fed` | number | `0` | Carrots fed to trigger Rabbit King (resets on spawn). |
| `carrots_fed_max` | number | `TUNING.RABBITKING_CARROTS_NEEDED + random variance` | Target carrot count needed to spawn Rabbit King passively. |
| `naughtiness` | number | `0` | Cumulative naughtiness score (resets on spawn). |
| `naughtiness_max` | number | `TUNING.RABBITKING_NAUGHTINESS_NEEDED + random variance` | Naughtiness threshold triggering aggressive Rabbit King spawn. |
| `cooldown` | number? | `nil` | Post-removal cooldown (seconds) before allowing next spawn. |

## Main Functions

### `ResetCounters()`
* **Description:** Initializes or resets the carrot and naughtiness counters based on tuning values plus randomness.
* **Parameters:** None (method on `self`).

### `TrackRabbitKingForPlayer(rabbitking, player)`
* **Description:** Registers a Rabbit King instance, sets up event listeners, establishes player leash, starts periodic housekeeping updates, and configures sleep behavior.
* **Parameters:**
  * `rabbitking` (Entity): The spawned Rabbit King.
  * `player` (Entity): The player to whom the Rabbit King will be leashed.

### `UnTrackRabbitKing()`
* **Description:** Cleans up all event callbacks and references for the current Rabbit King, sets cooldown if needed, and clears `rabbitkingdata`.
* **Parameters:** None.

### `CreateRabbitKingForPlayer(player, pt_override, forcedstate_string, params)`
* **Description:** Spawns a Rabbit King for the specified player, optionally forcing a state or skipping presentation. Returns success status and reason code.
* **Parameters:**
  * `player` (Entity): The target player.
  * `pt_override` (Vector3? or nil): Optional spawn position.
  * `forcedstate_string` (string? or nil): `"passive"`, `"aggressive"`, or `"lucky"` to override default state.
  * `params` (table? or nil): Options like `jumpfrominventory`, `nopresentation`, or `home`.

### `RemoveRabbitKing(rabbitking)`
* **Description:** Handles Rabbit King removal—silently if intro incomplete or sleeping, or via `burrowaway` animation otherwise.
* **Parameters:**
  * `rabbitking` (Entity? or nil): Entity to remove; defaults to `self.rabbitkingdata.rabbitking`.

### `LeashToPlayer(player)`
* **Description:** Assigns a new leash target for the Rabbit King, updating references and event subscriptions.
* **Parameters:**
  * `player` (Entity): New target player.

### `ChangeRabbitKingLeash(player)`
* **Description:** Replaces the current player leash with a new one, cleaning up old event subscriptions first.
* **Parameters:**
  * `player` (Entity): New leash target.

### `BecomeAggressive(rabbitking, player)`
* **Description:** Replaces a passive Rabbit King with an aggressive variant via `ReplacePrefab`, updates tracking, and pushes `"becameaggressive"` event.
* **Parameters:**
  * `rabbitking` (Entity): Current Rabbit King entity.
  * `player` (Entity): Player that triggered the aggression (attacker).
* **Returns:** The new aggressive Rabbit King entity.

### `TryToBecomeAggressive(rabbitking, player)`
* **Description:** Checks nearby players for meat in inventory; if found, triggers aggression via `BecomeAggressive`.
* **Parameters:**
  * `rabbitking` (Entity): Current Rabbit King entity.
  * `player` (Entity): Not used directly; players within range are tested.
* **Returns:** The (possibly changed) Rabbit King entity, or `nil` if no aggression trigger.

### `TryToTeleportRabbitKingToLeash(rabbitking, player)`
* **Description:** If Rabbit King is too far from the leashed player (> `RABBITKING_TELEPORT_DISTANCE_SQ`), initiates teleport/burrow behavior.
* **Parameters:**
  * `rabbitking` (Entity): Rabbit King entity.
  * `player` (Entity): Target player.

### `DoHouseCleaning(rabbitking, player)`
* **Description:** Checks whether Rabbit King should become aggressive and, if already aggressive, attempts teleporting to player.
* **Parameters:**
  * `rabbitking` (Entity): Current Rabbit King entity.
  * `player` (Entity): Leashed player.

### `AddCarrotFromPlayer(player, receiver)`
* **Description:** Increments carrot count; spawns Rabbit King if threshold reached. Triggers sound feedback.
* **Parameters:**
  * `player` (Entity): Feeding player.
  * `receiver` (Entity): Entity to receive sound feedback.

### `AddNaughtinessFromPlayer(player, naughtiness)`
* **Description:** Increments naughtiness score; spawns aggressive Rabbit King if threshold reached.
* **Parameters:**
  * `player` (Entity): Player who committed the naughtiness.
  * `naughtiness` (number): Amount to add (typically per kill).

### `GetStateByItemCountsForPlayer(player)`
* **Description:** Determines Rabbit King spawn state based on player inventory meat presence.
* **Parameters:**
  * `player` (Entity): Player to inspect.
* **Returns:** State constant (`STATES.PASSIVE` or `STATES.AGGRESSIVE`).

### `DoWarningSpeechFor(player, rabbitking_kind)`
* **Description:** Triggers a talker announcement for the Rabbit King's arrival state (e.g., aggressive, lucky).
* **Parameters:**
  * `player` (Entity): Player to address.
  * `rabbitking_kind` (string): `"passive"`, `"aggressive"`, or `"lucky"`.

### `OnUpdate(dt)`
* **Description:** Handles housekeeping: updates accumulator for periodic tasks (e.g., aggressive teleport checks), manages cooldown decrement, and stops updates when cooldown ends.
* **Parameters:**
  * `dt` (number): Delta time since last frame.

### `OnSave()`, `OnLoad(data)`
* **Description:** Persists state (carrots/naughtiness counters, cooldown) on save and restores on load.
* **Parameters:** (See methods above)

### `LoadPostPass(newents, savedata)`
* **Description:** Completes post-load Rabbit King setup after entities are resolved (e.g., reattaching to player, home location, expiration timeout).
* **Parameters:** (See method definitions)

## Events & Listeners
- Listens for:
  - `"attacked"` on Rabbit King → triggers `OnAttacked`
  - `"onremove"` on Rabbit King, player, and old_players entries → cleanup callbacks
  - `"death"` on player and old_players entries → cleanup callbacks
  - `"killed"` on players → triggers `OnPlayerKilledOther`
  - `"ms_playerjoined"`, `"ms_playerleft"` → dynamic player event subscription management
- Pushes:
  - `"becameaggressive"` on Rabbit King
  - `"dropkickarrive"` (optional, via params)
  - `"burrowto"` or manual teleport (`Physics:Teleport`) + `"burrowarrive"` for teleporting
  - `"burrowaway"` before removal (unless silent)
  - `"onremove"` is not triggered, but cleanup callbacks are removed manually.
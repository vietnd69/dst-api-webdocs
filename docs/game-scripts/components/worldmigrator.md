---
id: worldmigrator
title: Worldmigrator
description: Manages portal-based world migration logic, including status validation, item migration rules, and event triggering for players and items.
tags: [world, migration, network, inventory, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: e466bec9
system_scope: world
---

# Worldmigrator

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Worldmigrator` is a component responsible for managing the state and behavior of migration portals in the world. It determines whether a portal is available, full, or inactive based on the destination world's status and external restrictions (e.g., disabled sources). It handles player and item migration triggers, enforces item migration rules (e.g., irreplaceable items or pet-owning items are not migrated), and coordinates serialization for saves. It integrates with `migrationpetowner`, `inventory`, and `container` components during migration.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("worldmigrator")
inst.components.worldmigrator:SetID(1)
inst.components.worldmigrator:SetDestinationWorld("forest", false)
inst.components.worldmigrator:ValidateAndPushEvents()
```

## Dependencies & tags
**Components used:** `inventory`, `container`, `migrationpetowner`, `inventoryitem`
**Tags:** Adds/Removes `migrator` based on active status.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `auto` | boolean | `true` | Whether migration is automatic (`true`) or manual (`false`). |
| `enabled` | boolean | `true` | Whether this portal is enabled. |
| `disabledsources` | `SourceModifierList` | — | Tracks reasons this portal is disabled (e.g., `MISSINGSHARD`). |
| `_status` | number | `-1` | Internal status: `0 = ACTIVE`, `1 = INACTIVE`, `2 = FULL`. |
| `id` | number or `nil` | `nil` | Unique portal identifier. |
| `linkedWorld` | string or `nil` | `nil` | Destination world name (e.g., `"caves"`, `"forest"`). |
| `receivedPortal` | number or `nil` | `nil` | Portal ID on the destination side (used for linking). |
| `FX_OVERRIDES` | table | `{"oceanwhirlbigportal" = "spawn_fx_ocean_static"}` | Portal-specific FX override mappings. |

## Main functions
### `SetHideActions(hidden)`
* **Description:** Sets whether the portal is in a "hidden action" state (e.g., during cutscenes). Affects the presence of the `migrator` tag.
* **Parameters:** `hidden` (boolean) — if `true`, disables the migrator tag.
* **Returns:** Nothing.

### `SetDestinationWorld(world, permanent)`
* **Description:** Sets the destination world for this portal and configures auto/manual mode.
* **Parameters:**  
  `world` (string or `nil`) — name of the destination world.  
  `permanent` (boolean or `nil`) — if `true`, sets `auto` to `false`; otherwise sets `auto` to `true`.
* **Returns:** Nothing.

### `SetDisabledWithReason(reason)`
* **Description:** Disables the portal for a given reason (stored in `disabledsources`).
* **Parameters:** `reason` (string) — e.g., `"MISSINGSHARD"`.
* **Returns:** Nothing.

### `ClearDisabledWithReason(reason)`
* **Description:** Removes a disable reason, potentially re-enabling the portal.
* **Parameters:** `reason` (string).
* **Returns:** Nothing.

### `SetEnabled(enabled)`
* **Description:** Enables or disables the portal (affects `enabled` flag and triggers validation).
* **Parameters:** `enabled` (boolean).
* **Returns:** Nothing.

### `SetReceivedPortal(fromworld, fromportal)`
* **Description:** Records the source of a bi-directional portal link. Should ideally be coordinated between worlds (currently uses an `assert` for safety).
* **Parameters:**  
  `fromworld` (string) — origin world name.  
  `fromportal` (number) — origin portal ID.
* **Returns:** Nothing.

### `GetStatusString()`
* **Description:** Returns a lowercase string representation of the current status (`"active"`, `"inactive"`, `"full"`).
* **Parameters:** None.
* **Returns:** (string) status name.

### `ValidateAndPushEvents()`
* **Description:** Evaluates current conditions (enabled, world availability, world fullness) and updates `_status`. Fires appropriate events (`migration_available`, `migration_unavailable`, `migration_full`) and logs to console if in-game.
* **Parameters:** None.
* **Returns:** Nothing.

### `IsBound()`
* **Description:** Checks if the portal has all required linking data (`id`, `linkedWorld`, `receivedPortal`).
* **Parameters:** None.
* **Returns:** (boolean) `true` if fully bound.

### `SetID(id)`
* **Description:** Sets the portal’s unique ID. Ensures uniqueness against existing portals in `ShardPortals`. Temporarily auto-assigns `receivedPortal = id`.
* **Parameters:** `id` (number).
* **Returns:** Nothing.

### `IsDestinationForPortal(otherWorld, otherPortal)`
* **Description:** Determines if this portal points to a given world and portal ID.
* **Parameters:**  
  `otherWorld` (string) — destination world.  
  `otherPortal` (number) — destination portal ID.
* **Returns:** (boolean) `true` if this portal’s `linkedWorld` and `receivedPortal` match.

### `IsAvailableForLinking()`
* **Description:** Returns `true` if this portal is not yet fully linked.
* **Parameters:** None.
* **Returns:** (boolean) `true` if `not IsLinked()`.

### `IsLinked()`
* **Description:** Checks if `linkedWorld` and `receivedPortal` are both non-`nil`.
* **Parameters:** None.
* **Returns:** (boolean).

### `IsActive()`
* **Description:** Checks if the portal is enabled *and* currently in `ACTIVE` status.
* **Parameters:** None.
* **Returns:** (boolean).

### `IsFull()`
* **Description:** Checks if the destination world is full (`_status == FULL`).
* **Parameters:** None.
* **Returns:** (boolean).

### `CanInventoryItemMigrate(item)`
* **Description:** Determines if an item is allowed to migrate. Blocks irreplaceable items or items with active pets (`migrationpetowner`).
* **Parameters:** `item` (entity instance) — the item to test.
* **Returns:** (boolean) `true` if allowed.

### `TryToMakeItemMigrateable(item)`
* **Description:** Attempts to make an item migratable by calling `OnStopUsing()` on it (e.g., to unpair a beef_bell).
* **Parameters:** `item` (entity instance).
* **Returns:** Nothing.

### `DropThingsThatShouldNotMigrate(doer)`
* **Description:** For a given entity (player or item), drops items that are not migratable (using `inventory:DropEverythingByFilter` or `container:DropEverythingByFilter`).
* **Parameters:** `doer` (entity instance) — typically a player entity.
* **Returns:** Nothing.

### `Activate(doer)`
* **Description:** Initiates migration for the given `doer`. For players, triggers `ms_playerdespawnandmigrate`. For items, initiates a `Shard_CreateTransaction_TransferInventoryItem`. Checks migration eligibility and drops ineligible items first.
* **Parameters:** `doer` (entity instance).
* **Returns:**  
  `(true)` — success.  
  `(false, "NODESTINATION")` — if no destination is set or migration was skipped.  
  *(For players only)* If `doer._despawning` is `true`, returns `(true)` with no action.

### `ActivatedByOther()`
* **Description:** Fires `migration_activate_other` event to notify listeners that a portal was activated remotely (e.g., from the destination side).
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Returns a serializable table of key state fields for persistence.
* **Parameters:** None.
* **Returns:** (table) `{id, linkedWorld, receivedPortal, auto}`.

### `OnLoad(data)`
* **Description:** Restores state from `OnSave()` output. Includes backward compatibility for typo `"recievedPortal"`.
* **Parameters:** `data` (table).
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string summarizing portal state.
* **Parameters:** None.
* **Returns:** (string) formatted debug info.

## Events & listeners
- **Listens to:**  
  `"migration_unavailable"` (internal event triggered on `ValidateAndPushEvents` when disabled).  
  `"migration_available"` (internal event triggered when portal becomes active and world is available).  
  `"migration_full"` (internal event triggered when destination world is full).  
  `"migration_activate"` (internal event fired during `Activate`, includes `{doer = ...}`).
- **Pushes:**  
  `"ms_registermigrationportal"` (via `init` in constructor).  
  `"migration_unavailable"`, `"migration_available"`, `"migration_full"` (via `ValidateAndPushEvents`).  
  `"migration_activate"` (during `Activate`), `"migration_activate_other"` (via `ActivatedByOther`).

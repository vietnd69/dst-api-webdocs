---
id: worldmigrator
title: Worldmigrator
description: Manages portal-based world migration logic, including status tracking, linking, and entity movement between worlds.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: e466bec9
---

# Worldmigrator

## Overview
The `WorldMigrator` component handles the logic and state management for migration portals in DST. It tracks portal status (inactive, active, full), manages cross-world linking, validates migration availability, and initiates player/item migrations between shards. It integrates with the world/shard system to coordinate cross-server migration events.

## Dependencies & Tags
- **Component Tags Added/Removed:**  
  - Adds the `"migrator"` tag when status is `STATUS.ACTIVE` and `hiddenaction` is false.  
  - Removes `"migrator"` tag otherwise.
- **Events Pushed:**  
  - `"ms_registermigrationportal"` (during initialization)  
  - `"migration_available"`, `"migration_full"`, `"migration_unavailable"`, `"migration_activate"`, `"migration_activate_other"`  
  - `"ms_playerdespawnandmigrate"` (via `TheWorld`)
- **No other components are directly added**; relies on external systems (`ShardPortals`, `TheShard`, `Shard_IsWorldAvailable`, `Shard_IsWorldFull`, `Shard_CreateTransaction_TransferInventoryItem`, `SourceModifierList`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity the component is attached to. |
| `auto` | `boolean` | `true` | Whether linking is automatic (`true`) or manual (`false`). |
| `enabled` | `boolean` | `true` | User-controlled enabled state (not a dependency). |
| `disabledsources` | `SourceModifierList` | — | Tracks modifiers disabling migration (e.g., `"MISSINGSHARD"`). |
| `_status` | `number` | `-1` | Internal status: `STATUS.ACTIVE=0`, `STATUS.INACTIVE=1`, `STATUS.FULL=2`. |
| `id` | `number?` | `nil` | Unique portal ID (nil until set). |
| `linkedWorld` | `string?` | `nil` | Target world/shard ID (e.g., `"cave"`). |
| `receivedPortal` | `number?` | `nil` | Portal ID of the remote end (used for bidirectional validation). |
| `FX_OVERRIDES` | `table` | `{"oceanwhirlbigportal" = "spawn_fx_ocean_static"}` | Maps portal ID to custom FX string. |
| `hiddenaction` | `boolean?` | `nil` | If true, suppresses `"migrator"` tag even when active. |

## Main Functions

### `SetHideActions(hidden)`
* **Description:** Sets whether migration actions should be hidden. Affects tagging and visibility logic.
* **Parameters:**  
  `hidden` (`boolean`) — If `true`, hides actions; otherwise, shows them.

### `SetDestinationWorld(world, permanent)`
* **Description:** Sets the target world for migration and determines whether linking is manual or automatic.
* **Parameters:**  
  `world` (`string`) — Target world/shard ID.  
  `permanent` (`boolean?`) — If `true`, sets `auto = false`; otherwise, `auto = true`.

### `SetDisabledWithReason(reason)`
* **Description:** Marks migration as disabled for a specific reason (e.g., `"MISSINGSHARD"`).
* **Parameters:**  
  `reason` (`string`) — Key used to track the disablement source.

### `ClearDisabledWithReason(reason)`
* **Description:** Clears a previous disablement reason, potentially re-enabling migration.
* **Parameters:**  
  `reason` (`string`) — The reason key to remove.

### `SetEnabled(enabled)`
* **Description:** Sets the user-visible enabled state and triggers status revalidation.
* **Parameters:**  
  `enabled` (`boolean`) — Whether migration should be enabled.

### `SetReceivedPortal(fromworld, fromportal)`
* **Description:** Records the source world and portal ID that initiated the link (used for manual linking).
* **Parameters:**  
  `fromworld` (`string`) — Source world ID.  
  `fromportal` (`number`) — Source portal ID.

### `GetStatusString()`
* **Description:** Returns lowercase string representation of current status (`"active"`, `"inactive"`, `"full"`).
* **Parameters:** None.

### `ValidateAndPushEvents()`
* **Description:** Computes and updates migration availability based on `enabled`, `disabledsources`, and world state. Pushes appropriate events and updates `_status`.
* **Parameters:** None.

### `IsBound()`
* **Description:** Checks if the portal is fully bound (has ID, linkedWorld, and receivedPortal).
* **Parameters:** None.
* **Returns:** `boolean`.

### `SetID(id)`
* **Description:** Assigns the portal ID and updates the global `nextPortalID` counter. Temporarily auto-populates `receivedPortal`.
* **Parameters:**  
  `id` (`number`) — Unique portal identifier.

### `IsDestinationForPortal(otherWorld, otherPortal)`
* **Description:** Checks if this portal is the destination for a given remote portal.
* **Parameters:**  
  `otherWorld` (`string`) — Remote world ID.  
  `otherPortal` (`number`) — Remote portal ID.
* **Returns:** `boolean`.

### `IsLinked()`
* **Description:** Checks if a link exists (both `linkedWorld` and `receivedPortal` are non-nil).
* **Parameters:** None.
* **Returns:** `boolean`.

### `IsAvailableForLinking()`
* **Description:** Checks if the portal is unbound and thus available for new links.
* **Parameters:** None.
* **Returns:** `boolean`.

### `IsActive()`
* **Description:** Checks if migration is currently active (enabled, not disabled, and status is `ACTIVE`).
* **Parameters:** None.
* **Returns:** `boolean`.

### `IsFull()`
* **Description:** Checks if the target world is full (`_status == FULL`).
* **Parameters:** None.
* **Returns:** `boolean`.

### `CanInventoryItemMigrate(item)`
* **Description:** Determines whether an inventory item is allowed to migrate.
* **Parameters:**  
  `item` (`Entity`) — The item to check.
* **Returns:** `boolean`.

### `TryToMakeItemMigrateable(item)`
* **Description:** Attempts to unpair migration pets or prepare an item for migration.
* **Parameters:**  
  `item` (`Entity`) — The item to process.

### `DropThingsThatShouldNotMigrate(doer)`
* **Description:** Drops all items in the doer's inventory or container that cannot migrate.
* **Parameters:**  
  `doer` (`Entity`) — The player/entity whose items to filter.

### `Activate(doer)`
* **Description:** Initiates migration for the given entity (player or item). Returns success status and optional error string.
* **Parameters:**  
  `doer` (`Entity`) — The entity migrating.
* **Returns:**  
  `success` (`boolean`), `reason` (`string?`) — e.g., `"NODESTINATION"`.

### `ActivatedByOther()`
* **Description:** Indicates that the portal was activated remotely (not by local player). Triggers `"migration_activate_other"`.
* **Parameters:** None.

### `OnSave()`
* **Description:** Returns serializable state for persistence.
* **Parameters:** None.
* **Returns:** `table` — `{id, linkedWorld, receivedPortal, auto}`.

### `OnLoad(data)`
* **Description:** Restores state from saved data. Supports legacy `recievedPortal` typo.
* **Parameters:**  
  `data` (`table`) — Saved state from `OnSave`.

### `GetDebugString()`
* **Description:** Returns a formatted debug string with current state.
* **Parameters:** None.
* **Returns:** `string`.

## Events & Listeners
- Listens to **none** (no `inst:ListenForEvent` calls).
- Pushes/triggers the following events:
  - `"ms_registermigrationportal"` → When initialized.
  - `"migration_available"` → When portal becomes active.
  - `"migration_full"` → When target world is full.
  - `"migration_unavailable"` → When portal is disabled or destination unavailable.
  - `"migration_activate"` → When local entity activates the portal.
  - `"migration_activate_other"` → When remote entity activates the portal.
  - `"ms_playerdespawnandmigrate"` (via `TheWorld`) → For player migration.
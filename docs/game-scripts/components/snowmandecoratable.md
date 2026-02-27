---
id: snowmandecoratable
title: Snowmandecoratable
description: This component manages the decoration, stacking, and hat equipment of snowman entities in Don't Starve Together, including client-server synchronization and persistence.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 60d56b8e
---

# Snowmandecoratable

## Overview
The `snowmandecoratable` component enables snowmen (or snowballs used as snowman bases) to be decorated with items (e.g., vegetables, bones, feathers), stacked upon each other to increase height, and fitted with hats. It handles visual representation, validation of placement, inventory consumption, and network synchronization between client and server. The component operates only on snowman-related entities and requires master simulation (`ismastersim`) for authoritative actions.

## Dependencies & Tags
- **Tags added internally:** `FX` (for decor/FX entities created via `CreateDecor`)
- **Networked properties (via `net_*` functions):**
  - `decordata`: stores encoded decoration configuration
  - `basesize`: base snowball size ID (`small`, `med`, `large`)
  - `stacks`: array of stack layer size IDs
  - `stackoffsets`: random rotation offsets per stack layer
- **Event listeners (server-side):** `equipped`, `unequipped`, `enterlimbo`
- **Event listeners (client-side):** `decordatadirty`, `stacksdirty`
- **Component usage assumptions:** Requires `Transform`, `AnimState`, `Follower`, and `inventory` components on parent/child entities for visuals and item handling.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed to constructor) | The entity the component is attached to (typically a snowman or large snowball). |
| `ismastersim` | `boolean` | `TheWorld.ismastersim` | Indicates if this instance is running in master simulation (server). |
| `isdedicated` | `boolean` | `TheNet:IsDedicated()` | True if running on a dedicated server (no visual FX or decor entities). |
| `decordata` | `net_string` | `""` | Networked string storing encoded decoration data (item hash, rotation, flip, position). |
| `basesize` | `net_tinybyte` | `STACK_IDS.large` | Networked ID indicating the base stack size (`small`, `med`, `large`). |
| `stacks` | `net_smallbytearray` | `{}` | Networked array of stack layer IDs. |
| `stackoffsets` | `net_smallbytearray` | `{}` | Networked array of random rotation offsets for each stack. |
| `decors` | `array< Entity >` | `{}` (client only) | Local array of decor FX entities (not persisted or synced). |
| `swapinst` | `Entity or nil` | `nil` (server only) | Reference to the "snowmandecorating_swap_fx" preview entity while decorating. |
| `hatinst` | `Entity or nil` | `nil` (server only) | Reference to the `snowmanhat_fx` entity showing equipped hat. |
| `hatrnd` | `number or nil` | `nil` (server only) | Frame index for hat animation (random rotation). |
| `doer` | `Entity or nil` | `nil` (server only) | The player currently decorating this snowman. |
| `range` | `number` | `3` | Max distance for auto-closing the decorating UI. |
| `onclosesnowman` | `function` | (internal) | Callback for when the decorating popup closes, handling validation & item consumption. |
| `melting` | `boolean or nil` | `nil` | Tracks if the snowman is currently melting. |

## Main Functions

### `SnowmanDecoratable:OnRemoveFromEntity()`
* **Description:** Cleans up the component on entity removal: ends active decorating sessions, removes listeners, destroys decor/FX entities, and removes the swap hat FX. Also aliased as `OnRemoveEntity`.
* **Parameters:** None.

### `SnowmanDecoratable:CanBeginDecorating(doer)`
* **Description:** Checks if the given player (`doer`) can start decorating this snowman. Enforces exclusivity (one decorator at a time), prevents use while the player is busy/heavy-lifting/pushing, or if the snowman is melting.
* **Parameters:**
  - `doer` (Entity): The player attempting to begin decorating.

### `SnowmanDecoratable:BeginDecorating(doer, obj)`
* **Description:** Starts the decorating session for `doer`, spawning a state graph `"snowmandecorating"` and registering cleanup events. Updates state and listening. Returns `true` on success.
* **Parameters:**
  - `doer` (Entity): The player initiating the decorating.
  - `obj` (Entity or nil): The inventory item used to open the decorating UI.

### `SnowmanDecoratable:EndDecorating(doer)`
* **Description:** Ends an active decorating session. Cleans up listeners, notifies the client via `ms_endsnowmandecorating`, and stops component update loop. Accepts `nil doer` to forcibly end any session.
* **Parameters:**
  - `doer` (Entity or nil): The player who completed the session, or `nil` for forced termination.

### `SnowmanDecoratable:ValidateAndAppendDecorData(doer, olddecordata, newdecordata, basesize, stacks, invobj)`
* **Description:** (Internal, exposed as static function `_ValidateAndAppendDecorData`) Validates new decoration data against inventory, enforces per-size/max-layer decoration limits, consumes items, and returns encoded (valid) decoration data. Handles prioritized consumption from `invobj` first.
* **Parameters:** (Passed as locals; not a method)
  - `doer`: Player performing validation.
  - `olddecordata`: Existing encoded decoration string.
  - `newdecordata`: User-submitted decoration data (decoded table).
  - `basesize`: Base size ID.
  - `stacks`: Current stack IDs.
  - `invobj`: Optional item used to open the UI (consumed first).

### `SnowmanDecoratable:ApplyDecor(decordata, decors, basesize, stacks, stackoffsets, owner, swapsymbol, swapframe, offsetx, offsety)`
* **Description:** Applies the given decoration data (decoded table) by spawning FX entities (`CreateDecor`) and attaching them to the `owner` entity. Clears previous decor. Returns `true` if valid decor data was processed.
* **Parameters:**
  - `decordata` (string): Encoded decoration data (from `decordata:value()`).
  - `decors` (array): Local array to store/replace decor FX entities.
  - `basesize`, `stacks`, `stackoffsets`: Current snowman stack geometry.
  - `owner`: Entity to parent decor to.
  - `swapsymbol`, `swapframe`, `offsetx`, `offsety`: Animation/sprite offsets.

### `SnowmanDecoratable:CanStack(doer, obj)`
* **Description:** Checks if `obj` (another snowman/snowball) can be stacked on top of this one. Enforces height limit (max 6), checks for existing hat, or if already in use. Returns `true` or `false, reason`.
* **Parameters:**
  - `doer` (Entity): Player attempting to stack.
  - `obj` (Entity): The snowman/snowball to stack.

### `SnowmanDecoratable:Stack(doer, obj)`
* **Description:** Stacks `obj` on top of this snowman by consuming it and updating the `stacks`/`stackoffsets` arrays. Does *not* preserve decorations on the substack.
* **Parameters:**
  - `doer` (Entity): Player initiating the stack.
  - `obj` (Entity): The snowman/snowball to remove and integrate as a stack layer.

### `SnowmanDecoratable:Unstack(isdestroyed)`
* **Description:** Removes all stacked layers and drops them as items or snowman entities (if `isdestroyed`, spawns destroyed snowmen instead of pick-up items). Drops the base if it’s a `small` snowball (otherwise resets to small size). Requires master sim.
* **Parameters:**
  - `isdestroyed` (boolean): Whether to destroy and return unstacked pieces as destroyed snowmen.

### `SnowmanDecoratable:EquipHat(hat)`
* **Description:** Public wrapper for `EquipHat_Internal`; equips a hat on the snowman via FX attachment. Only accepts valid head-slot hats not already equipped.
* **Parameters:**
  - `hat` (Entity): The hat item to equip.

### `SnowmanDecoratable:EquipHat_Internal(hat, overridernd)`
* **Description:** Internal function that spawns `snowmanhat_fx` and positions it correctly at the snowman’s top. Sets random animation frame (via `overridernd`) and attaches the hat to inventory.
* **Parameters:**
  - `hat` (Entity): The hat item.
  - `overridernd` (number or nil): Optional frame index override (for loaded data).

### `SnowmanDecoratable:UnequipHat()`
* **Description:** Drops all items from the hat FX and removes it. Resets hat state. Requires master sim.
* **Parameters:** None.

### `SnowmanDecoratable:DropAllDecor()`
* **Description:** Drops all currently applied decorative items as individual entities. Items are grouped into stacks where possible, and `decordata` is cleared. Requires master sim.
* **Parameters:** None.

### `SnowmanDecoratable:DoRefreshDecorData()`
* **Description:** Reads the current `decordata` and rebuilds all decor FX entities. Used after loading or updating decoration. Only creates visual entities on non-dedicated clients.
* **Parameters:** None.

### `SnowmanDecoratable:DoDropItem(prefab, x, z, size)`
* **Description:** Helper to spawn, size, and drop an item with physics and wetness inheritance from the snowman.
* **Parameters:**
  - `prefab` (string): Prefab name to spawn.
  - `x`, `z` (number): Drop coordinates.
  - `size` (string or nil): Optional size (e.g., `"small"`, `"med"`).

### `SnowmanDecoratable:OnSave()`
* **Description:** Serializes the component’s state: decoration data, stack layers, hat and its frame. Returns `{ decor?, stacks?, stackoffsets?, hat?, hatrnd? }` and optional entity references.
* **Parameters:** None.

### `SnowmanDecoratable:OnLoad(data, newents)`
* **Description:** Loads saved state from `data`—restores stacks, decorations, and hat. Requires `newents` for save-record reconstruction.
* **Parameters:**
  - `data` (table): Saved data from `OnSave`.
  - `newents` (table): New entity table (for `SpawnSaveRecord`).

### `SnowmanDecoratable:OnUpdate(dt)`
* **Description:** Auto-closes the decorating session if the decorator moves too far or cannot see the snowman. Monitors `doer` position and line-of-sight.
* **Parameters:**
  - `dt` (number): Delta time.

## Events & Listeners
- **Listens:**
  - `decordatadirty` (client): Triggers `DoRefreshDecorData()`.
  - `stacksdirty` (client): Triggers `OnStacksChanged("clientsync")`.
  - `equipped` (server): Spawns `snowmandecorating_swap_fx` preview for server-side players.
  - `unequipped` (server): Removes swap FX.
  - `enterlimbo` (server): Forces end of decorating session.
  - `onremove` (client/server): Triggers `onclosesnowman` on decorator’s entity removal.
  - `ms_closepopup` (server): Triggers `onclosepopup` when decorating UI closes.

- **Pushes:**
  - `ms_endsnowmandecorating`: Sent to client to notify end of decorating session.
  - Networked changes on `decordata`, `basesize`, `stacks`, `stackoffsets`.
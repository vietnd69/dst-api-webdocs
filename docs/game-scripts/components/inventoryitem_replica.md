---
id: inventoryitem_replica
title: Inventoryitem Replica
description: This component replicates inventory item state and behavior from the server to clients, providing a networked interface for properties like pickup restrictions, deployment settings, weapon stats, and usage progress.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: ac239c51
---

# Inventoryitem Replica

## Overview
The `InventoryItem` replica component serves as the client-side mirror of the server-side `inventoryitem` component. It synchronizes and exposes key inventory-related properties and states over the network—including pick-up restrictions, moisture level, deployment mode, weapon range, equip restrictions, and usage metrics (e.g., durability, perish, recharge)—to ensure consistent client-side rendering and interaction logic. It manages a nested `inventoryitem_classified` object for storing and syncing transient runtime data, such as pickup position or usage percentages.

## Dependencies & Tags
- `net_bool`, `net_hash`: Internal networking utilities for boolean and hash property replication.
- `SpawnPrefab("inventoryitem_classified")`: Creates a lightweight classified object for server-side replication of dynamic attributes.
- `TheWorld.ismastersim`: Used to distinguish server/mastersim logic from client behavior.
- **Tags**: Does not add or remove tags directly. Relies on existing entity tags (e.g., `"spider"`, `"spiderwhisperer"`, `"complexprojectile"`, `"boatbuilder"`) to inform permission and behavior logic.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity the component is attached to. |
| `_cannotbepickedup` | `net_bool` | `nil` (networked) | Networked flag indicating if the item cannot be picked up (inverted logic: `true` means *cannot* be picked up). |
| `_iswet` | `net_bool` | `nil` (networked, `"iswetdirty"`) | Networked boolean indicating whether the item is wet. |
| `_isacidsizzling` | `net_bool` | `nil` (networked, `"isacidsizzlingdirty"`) | Networked boolean indicating whether acid is sizzling on the item. |
| `_grabbableoverridetag` | `net_hash` | `nil` (networked) | Networked hash tag allowing specific entities to override the grab restriction. |
| `classified` | `Component` (or `nil`) | `nil` | Optional `inventoryitem_classified` object used for syncing transient data like position, moisture, and usage progress. Created only on the server. |

## Main Functions

### `SetCanBePickedUp(canbepickedup)`
* **Description:** Sets whether the item can be picked up, by toggling the internal `_cannotbepickedup` flag.  
* **Parameters:**  
  - `canbepickedup` (`boolean`): If `true`, the item becomes pick-up-able; if `false`, it becomes unpick-up-able.

### `CanBePickedUp(doer)`
* **Description:** Determines if the item can be picked up by a given entity (`doer`), accounting for overrides and special conditions (e.g., spiders not being pick-up-able by non-spiderwhisperers).  
* **Parameters:**  
  - `doer` (`Entity?`): The entity attempting to pick up the item. May be `nil`.

### `SetCanGoInContainer(cangoincontainer)`
* **Description:** Updates the `cangoincontainer` flag in the `classified` object, controlling whether the item can be stored in containers.  
* **Parameters:**  
  - `cangoincontainer` (`boolean`): Whether the item can go into containers.

### `CanGoInContainer()`
* **Description:** Returns the `cangoincontainer` flag from the `classified` object.  
* **Returns:** `boolean` — Whether the item can go into containers.

### `SetCanOnlyGoInPocket(canonlygoinpocket)`
* **Description:** Sets whether the item can only be stored in pockets (e.g., backpack slots), based on the `canonlygoinpocket` flag in `classified`.  
* **Parameters:**  
  - `canonlygoinpocket` (`boolean`).

### `SetCanOnlyGoInPocketOrPocketContainers(canonlygoinpocketorpocketcontainers)`
* **Description:** Sets whether the item can only be stored in pockets *or* pocket-only containers.  
* **Parameters:**  
  - `canonlygoinpocketorpocketcontainers` (`boolean`).

### `CanOnlyGoInPocket()`, `CanOnlyGoInPocketOrPocketContainers()`
* **Description:** Return the respective restricted-packing flags from `classified`.  
* **Returns:** `boolean`.

### `SetImage(imagename)`, `GetImage()`
* **Description:** `SetImage` networkingly sets the item’s inventory image (`.tex` file) via `classified.image`. `GetImage` resolves the effective image, prioritizing client-side overrides, then `classified`, then default.  
* **Parameters (SetImage):**  
  - `imagename` (`string?`): Base name without extension.

### `OverrideImage(imagename)` *(Local only)*
* **Description:** Sets a *non-networked*, client-local image override (e.g., for temporary state changes). Triggers `"imagechange"` event.  
* **Parameters:**  
  - `imagename` (`string?`).

### `SetAtlas(atlasname)`, `GetAtlas()`
* **Description:** `SetAtlas` sets the image atlas for the inventory item; `GetAtlas` resolves the effective atlas, accounting for local overrides.  
* **Parameters (SetAtlas):**  
  - `atlasname` (`string?`).

### `SetOwner(owner)`
* **Description:** Configures network classified targeting based on container open count. Sets `classified`’s `Network` target to enable seamless sync during container open/close cycles.  
* **Parameters:**  
  - `owner` (`Entity?`): The container owner entity.

### `IsHeld()`, `IsHeldBy(guy)`, `IsGrandOwner(guy)`
* **Description:** Determine whether the item is currently held, held by a specific player, or grand-owned (i.e., directly equipped by the player or in their hands after stacking). Behavior forks depending on presence of server-side `inventoryitem` component.  
* **Parameters:**  
  - `guy` (`Entity?`): Player entity to check.

### `SetPickupPos(pos)`, `GetPickupPos()`
* **Description:** Sets/retrieves a sync'd world position (`Vector3` projected to XZ) from which the item will be picked up—useful for physics or animation alignment.  
* **Parameters (SetPickupPos):**  
  - `pos` (`Vector3?`): World position (X, Z), or `nil` to clear.

### `SerializeUsage()`, `DeserializeUsage()`
* **Description:** `SerializeUsage` pushes current usage state (percent used, perish %, recharge %/time) from server-side components to the `classified` object. `DeserializeUsage` pulls this state for client-side updates.  
* **Parameters:** None.

### `SetChargeTime(t)`
* **Description:** Updates and broadcasts the recharge time on the `classified` object and triggers `"rechargetimechange"` event.  
* **Parameters:**  
  - `t` (`number?`): Time in seconds until full charge.

### `SetDeployMode(deploymode)`
* **Description:** Syncs the deployment mode (e.g., `DEPLOYMODE.TURF`, `WATER`, `ANYWHERE`) to `classified`.  
* **Parameters:**  
  - `deploymode` (`string`): One of `DEPLOYMODE.*` constants.

### `GetDeployMode()`
* **Description:** Returns the effective deploy mode, preferring the server-side `deployable` component if present.  
* **Returns:** `string` — Deploy mode constant.

### `IsDeployable(deployer)`
* **Description:** Determines if the item can be deployed by a given entity, respecting restrictions and entity states (e.g., rider, floater).  
* **Parameters:**  
  - `deployer` (`Entity?`): Entity attempting to deploy.

### `DeploySpacingRadius()`
* **Description:** Returns the radius (in tiles) for placement spacing rules, resolved from `deployable` or fallback to `classified`.  
* **Returns:** `number`.

### `CanDeploy(pt, mouseover, deployer, rot)`
* **Description:** Validates whether the item can be deployed at a given world point, using deployment mode rules (e.g., water depth, turf, plants). Delegates to `deployable` component if present.  
* **Parameters:**  
  - `pt` (`Vector3` or similar): Target placement point.  
  - `mouseover` (`Entity?`): Entity under cursor (if any).  
  - `deployer` (`Entity?`): Deploying entity.  
  - `rot` (`number?`): Rotation angle (radians).  

### `SetAttackRange(attackrange)`
* **Description:** Syncs the weapon’s attack range to `classified.attackrange`.  
* **Parameters:**  
  - `attackrange` (`number?`): Attack radius in tiles.

### `AttackRange()`, `IsWeapon()`
* **Description:** Return effective attack range or whether the item functions as a weapon.  
* **Returns:** `number` (range), `boolean` (weapon flag).

### `SetWalkSpeedMult(walkspeedmult)`
* **Description:** Sets the walk speed multiplier (encoded as integer in centi-units, e.g., `1.05` → `105`) into `classified.walkspeedmult`, with strict range and precision checks.  
* **Parameters:**  
  - `walkspeedmult` (`number?`): Speed multiplier (0.01 precision, range 0–2.55).

### `GetWalkSpeedMult()`, `SetEquipRestrictedTag(restrictedtag)`, `GetEquipRestrictedTag()`
* **Description:** Get/set the equip speed multiplier and tag restrictions for equipping items. Respects `equippable` component precedence.  
* **Parameters (SetEquipRestrictedTag):**  
  - `restrictedtag` (`string?`): Tag required to equip.

### `SetMoistureLevel(moisture)`, `GetMoisture()`, `GetMoisturePercent()`
* **Description:** Set or retrieve moisture level (absolute or normalized 0–1). Falls back to `classified` or `inventoryitemmoisture` component.  
* **Parameters (SetMoistureLevel):**  
  - `moisture` (`number`): Absolute moisture value.

### `SetIsWet(iswet)`, `IsWet()`, `SetIsAcidSizzling(isacidsizzling)`, `IsAcidSizzling()`
* **Description:** Set/get boolean flags for wetness and acid sizzling state. `SetIsWet`/`SetIsAcidSizzling` emit `"wetnesschange"`/`"acidsizzlingchange"` events only on state change.  
* **Parameters:**  
  - `iswet` (`boolean`), `isacidsizzling` (`boolean`).

### `SetGrabbableOverrideTag(tag)`
* **Description:** Sets the `grabbableoverridetag`, allowing a specific entity tag to bypass standard grab restrictions.  
* **Parameters:**  
  - `tag` (`string?`): Tag name.

## Events & Listeners
- **Listens to events:**
  - `"percentusedchange"` → `classified:SerializePercentUsed(data.percent)`
  - `"perishchange"` → `classified:SerializePerish(data.percent)`
  - `"forceperishchange"` → `classified:ForcePerishDirty()`
  - `"rechargechange"` → `classified:SerializeRecharge(data.percent, data.overtime)`
  - `"onremove"` (on classified entity) → triggers `DetachClassified()`
- **Triggers events:**
  - `"imagechange"` (in `OverrideImage`)
  - `"wetnesschange"` (in `SetIsWet`)
  - `"acidsizzlingchange"` (in `SetIsAcidSizzling`)
  - `"rechargetimechange"` (in `SetChargeTime`, with `{ t = t }`)
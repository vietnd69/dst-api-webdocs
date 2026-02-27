---
id: inventory_replica
title: Inventory Replica
description: This component acts as a networked replica interface for inventory state, synchronizing player inventory data and actions between server and clients via a classified proxy object.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: 8a1a6310
---

# Inventory Replica

## Overview
The `Inventory` replica component serves as a network-transparent layer that manages inventory interactions for players (and other entities with inventory support) in Don't Starve Together. It coordinates between the local `inventory` component (on the server) and a remote `inventory_classified` prototype (the classified proxy), enabling clients to display and manipulate inventory state without direct access to the authoritative component. It handles opening/closing the inventory UI, equipping items, managing overflow containers, and synchronizing specialized states such as heavy lifting and floating (e.g., for Werebeaver/Woodie transitions).

## Dependencies & Tags
- **Component dependency:** Requires `inst.components.inventory` (server-only) and/or `inst.inventory_classified` (networked classified proxy).
- **Tag dependency (server side):** Uses `player` to determine initialization path; `corpse` to conditionally hide inventory when revived.
- **Tags used:** None added or removed by this component itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *None* (injected) | Reference to the entity the inventory belongs to. |
| `opentask` | `Tasks` or `nil` | `nil` | Delayed task used to open the inventory UI; cancellable to prevent race conditions. |
| `classified` | `Component` (`inventory_classified` proxy) or `nil` | `nil` | Reference to the networked classified proxy object used to replicate inventory state to clients. |
| `ondetachclassified` | `function` or `nil` | `nil` | Callback function registered to handle entity removal of the classified object. |

## Main Functions

### `Inventory:OnOpen()`
* **Description:** Triggers server-side to open the inventory UI for the entity. Sets the classified proxy’s visibility to true and designates this entity as the target.
* **Parameters:** None.

### `Inventory:OnClose()`
* **Description:** Closes the inventory UI by hiding it. Cancels any pending open task and sets classified visibility to false.
* **Parameters:** None.

### `Inventory:OnShow()`
* **Description:** Makes the inventory UI visible without opening (e.g., for hotkey toggles or state transitions).
* **Parameters:** None.

### `Inventory:OnHide()`
* **Description:** Hides the inventory UI if already open/visible.
* **Parameters:** None.

### `Inventory:SetHeavyLifting(heavylifting)`
* **Description:** Updates the `heavylifting` state on the classified proxy and refreshes relevant action filters (e.g., forWerebeaver carry behavior).
* **Parameters:**
  * `heavylifting` (`boolean`) — Whether the entity is currently engaged in heavy lifting.

### `Inventory:SetFloaterHeld(floaterheld)`
* **Description:** Updates the `floaterheld` state (e.g., for Woodie’s floating behavior) and adjusts state machine events + action filters accordingly.
* **Parameters:**
  * `floaterheld` (`boolean`) — Whether the entity is holding a floater (e.g., boat/raft).

### `Inventory:AttachClassified(classified)`
* **Description:** Associates a classified proxy object (typically received from the server) with this replica. Registers event listeners and initializes UI重建.
* **Parameters:**
  * `classified` (`Component`) — The `inventory_classified` proxy to attach.

### `Inventory:DetachClassified()`
* **Description:** Detaches the classified proxy, clears listeners, and resets UI visibility and active item state on client.
* **Parameters:** None.

### `Inventory:GetNumSlots()`
* **Description:** Returns the number of inventory slots available. Falls back to default max slots if `inventory` component is absent.
* **Parameters:** None.

### `Inventory:GetItemInSlot(slot)`
* **Description:** Returns the item stored in the specified inventory slot. Delegates to `inventory` or `classified` depending on context.
* **Parameters:**
  * `slot` (`number`) — Zero-based slot index.

### `Inventory:EquipActiveItem()`, `Inventory:EquipActionItem(item)`, `Inventory:SwapEquipWithActiveItem()`, etc.
* **Description:** A family of functions for common inventory interactions: equipping active item, equipping a specified item, swapping with equipment slot, etc. All delegate to either the local `inventory` component or the `classified` proxy, ensuring same behavior across authoritative and replicated contexts.
* **Parameters:** Vary per function (e.g., `item`, `slot`, `eslot`, `container`).

### `Inventory:Has(prefab, amount, checkallcontainers)`, `Inventory:HasItemWithTag(tag, amount)`
* **Description:** Queries item existence with optional count and container-scanning. Falls back to `classified` implementation when `inventory` component is unavailable.
* **Parameters:**
  * `prefab`/`tag` — Query target.
  * `amount` (`number`) — Minimum required count.
  * `checkallcontainers` (`boolean`, optional) — Whether to include nested containers.

### `Inventory:GetOpenContainers()`, `Inventory:GetOverflowContainer()`
* **Description:** Returns tables of currently open containers and the overflow container (e.g., backpack), respectively. Handles both authoritative (`inventory`) and replicated (`HUD.controls.containers`, `classified`) sources.
* **Parameters:** None.

### `Inventory:IsHeavyLifting()`, `Inventory:IsFloaterHeld()`, `Inventory:IsVisible()`, `Inventory:IsOpenedBy(guy)`
* **Description:** Read-only queries for current inventory state. Each uses local `inventory` component if present, otherwise falls back to `classified` proxy values.
* **Parameters:** Vary per function (e.g., `guy` for `IsOpenedBy`).

### `Inventory:Open()` (via `self.opentask` hook)
* **Description:** Internal helper used in delayed task (`DoStaticTaskInTime`) to open the inventory and optionally hide it if the entity is a corpse.
* **Parameters:** None (defined as `local function OpenInventory`).

## Events & Listeners
- **Listens to `inst:ListenForEvent("newactiveitem", ...)`** — Syncs active item from inventory to classified proxy (server → client).
- **Listens to `inst:ListenForEvent("itemget", ...)`** — Syncs slot content changes (server → client).
- **Listens to `inst:ListenForEvent("itemlose", ...)`** — Handles item removal from slots (server → client).
- **Listens to `inst:ListenForEvent("equip", ...)`** — Syncs equipment slot updates (server → client).
- **Listens to `inst:ListenForEvent("unequip", ...)`** — Syncs unequip events (server → client).
- **Listens to `classified` events:**
  - `visibledirty` → Toggles crafting/inventory UI visibility.
  - `heavyliftingdirty` → Updates action filters (heavy lifting) and context.
  - `floaterhelddirty` → Updates action filters and state machine events (floating).
- **Listens to `"onremove"` on `classified`** — Triggers detachment logic when classified proxy is destroyed.

- **Triggers `inst:PushEvent("newactiveitem", {})`** — Clears active item reference when UI is closed.
- **Triggers `inst:PushEvent("inventoryclosed")`** — Notifies systems that the inventory is closed.
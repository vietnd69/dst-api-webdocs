---
id: inventory
title: Inventory
description: Manages the storage, equipping, and inventory interactions for player entities, including slot-based item management, equipment handling, and container integration.
tags: [player, inventory, equipment, container]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: b981734d
system_scope: inventory
---

# Inventory

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Inventory` component handles item storage for player entities in Don't Starve Together. It manages inventory slots, equipment slots, active items, and overflow containers (e.g., backpacks), while supporting stacking,Crafting, and equipment-specific behaviors such as absorption, insulation, and set bonuses. It integrates with components like `container`, `equippable`, `stackable`, `armor`, and `moisture`, and synchronizes state across client and server via `replica.inventory`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("player")
inst:AddComponent("inventory")

-- Add a slot-filling item
local item = SpawnPrefab("stick")
inst.components.inventory:GiveItem(item)

-- Equip an item in the hands slot
local sword = SpawnPrefab("sword")
inst.components.inventory:Equip(sword)

-- Check inventory state
local hasstick = inst.components.inventory:Has("stick", 1)
local activeitem = inst.components.inventory:GetActiveItem()
```

## Dependencies & tags
**Components used:** `armor`, `container`, `container_proxy`, `damagetyperesist`, `equippable`, `inventoryitem`, `locomotor`, `migrationpetowner`, `moisture`, `named`, `petleash`, `playeractionpicker`, `playercontroller`, `playerfloater`, `resistance`, `setbonus`, `spellbook`, `stackable`, `waterproofer`  
**Tags:** Adds `"heavy"` and `"keep_equip_toss"` via item checks; listens to `"death"` and `"player_despawn"` events.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `itemslots` | table | `{}` | Map of slot indices to held items. |
| `equipslots` | table | `{}` | Map of equipment slot names (e.g., `"HANDS"`, `"BODY"`) to equipped items. |
| `activeitem` | `Entity` or `nil` | `nil` | The currently active item (typically in hand). |
| `maxslots` | number | `GetMaxItemSlots(TheNet:GetServerGameMode())` | Maximum number of inventory slots. |
| `heavylifting` | boolean | `false` | Whether a heavy item (e.g., heavy jacket) is equipped in the BODY slot. |
| `floaterheld` | boolean or `nil` | `nil` | Whether a floater item is held in the HANDS slot. |
| `acceptsstacks` | boolean | `true` | Whether the inventory accepts stacking items. |
| `ignorescangoincontainer` | boolean | `false` | Whether to bypass `cangoincontainer` checks when giving items. |
| `ignoreoverflow` | boolean | `false` | Internal flag to skip overflow containers during slot searches. |
| `ignorefull` | boolean | `false` | Internal flag to suppress "inventory full" behavior. |
| `silentfull` | boolean | `false` | Internal flag to suppress "inventory full" warnings. |
| `ignoresound` | boolean | `false` | Internal flag to suppress item-get sounds. |
| `opencontainers` | table | `{}` | Map of opened container entities. |
| `opencontainerproxies` | table | `{}` | Map of opened container proxy entities. |
| `dropondeath` | boolean | `true` | Whether items drop on player death. |
| `isopen` | boolean | `false` | Whether the inventory UI is open. |
| `isvisible` | boolean | `false` | Whether the inventory UI is visible. |
| `isloading` | boolean or `nil` | `nil` | Set during savegame loading to skip side effects. |
| `noheavylifting` | boolean or `nil` | `nil` | If set, prevents heavy-lifting behavior. |

## Main functions
### `EnableDropOnDeath()`
*   **Description:** Enables dropping all inventory items on player death.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DisableDropOnDeath()`
*   **Description:** Disables dropping items on player death. Removes the `"death"` event listener.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `TransferInventory(receiver)`
*   **Description:** Transfers all persisent items and equipment from this inventory to the receiver's inventory. Does not transfer non-persistent items.
*   **Parameters:** `receiver` (`Entity`) - Target entity with an `inventory` component.
*   **Returns:** Nothing.

### `SwapEquipment(other, equipslot_to_swap)`
*   **Description:** Swaps equipment between this inventory and another player's inventory. If `equipslot_to_swap` is `nil`, swaps all equipment slots.
*   **Parameters:**  
  `other` (`Entity`) - Target entity with an `inventory` component.  
  `equipslot_to_swap` (`string` or `nil`) - Specific equipment slot to swap (`EQUIPSLOTS` value) or `nil` for all.
*   **Returns:** `true` on success.

### `OnSave()`
*   **Description:** Serializes inventory contents for saving. Includes items, equipment, and active item (if not equipped).
*   **Parameters:** None.
*   **Returns:** `data` (`table`), `references` (`table`) — Save record and entity references.

### `OnLoad(data, newents)`
*   **Description:** Loads inventory contents from saved data.
*   **Parameters:**  
  `data` (`table`) - Save record from `OnSave()`.  
  `newents` (`table`) - Map of saved references to live entities.
*   **Returns:** Nothing.

### `CanTakeItemInSlot(item, slot)`
*   **Description:** Checks if an item can be placed in a specific slot.
*   **Parameters:**  
  `item` (`Entity`) - The item to check.  
  `slot` (`number` or `nil`) - Target slot index (`1..maxslots`).
*   **Returns:** `boolean` — Whether the item can be placed.

### `GiveItem(inst, slot, src_pos)`
*   **Description:** Attempts to add an item to the inventory. Handles stacking, overflow containers, active item fallback, and "inventory full" behavior.
*   **Parameters:**  
  `inst` (`Entity`) - The item to give.  
  `slot` (`number` or `nil`) - Suggested slot index.  
  `src_pos` (`Vector3` or `nil`) - Source position for stacking moisture/temperature dilution.
*   **Returns:** `number` (slot index), `true`, or `false`.

### `Unequip(equipslot, slip, force)`
*   **Description:** Unequips an item from an equipment slot. If `force` is `false`, respects `preventunequipping`.
*   **Parameters:**  
  `equipslot` (`string`) - Equipment slot name.  
  `slip` (`boolean` or `nil`) - Flag for UI animations.  
  `force` (`boolean`) - Whether to bypass unequip restrictions.
*   **Returns:** `Entity` (unequipped item) or `nil`.

### `Equip(item, old_to_active, no_animation, force_ui_anim)`
*   **Description:** Equips an item into its designated equipment slot.
*   **Parameters:**  
  `item` (`Entity`) - Item to equip.  
  `old_to_active` (`boolean`) - Whether to move the previous equipped item to the active slot.  
  `no_animation` (`boolean`) - Skip animation.  
  `force_ui_anim` (`boolean`) - Force UI animation.
*   **Returns:** `true` if successful.

### `GetNextAvailableSlot(item)`
*   **Description:** Finds the first available slot for an item, considering stacking, overflow containers, and priority rules.
*   **Parameters:** `item` (`Entity`) - The item to find a slot for.
*   **Returns:** `slot` (`number` or `nil`), `container_table` (`table` or `nil`) — Slot index and the container table (`itemslots`, `equipslots`, or overflow container).

### `IsFull()`
*   **Description:** Checks if all inventory slots are occupied.
*   **Parameters:** None.
*   **Returns:** `boolean` — Whether the inventory is full.

### `DropItem(item, wholestack, randomdir, pos, keepoverstacked)`
*   **Description:** Drops an item from the inventory to the world.
*   **Parameters:**  
  `item` (`Entity`) - Item to drop.  
  `wholestack` (`boolean`) - Drop full stack.  
  `randomdir` (`boolean`) - Use random drop direction.  
  `pos` (`Vector3` or `nil`) - Override drop position.  
  `keepoverstacked` (`boolean`) - Allow overstacked items.
*   **Returns:** `Entity` (dropped item).

### `RemoveItem(item, wholestack, checkallcontainers, keepoverstacked)`
*   **Description:** Removes an item from any slot without dropping it (e.g., for crafting or destruction).
*   **Parameters:**  
  `item` (`Entity`) - Item to remove.  
  `wholestack` (`boolean`) - Remove full stack.  
  `checkallcontainers` (`boolean`) - Also check open containers.  
  `keepoverstacked` (`boolean`) - Allow overstacked items.
*   **Returns:** `Entity` (removed item) or original `item`.

### `Has(item, amount, checkallcontainers)`
*   **Description:** Checks if the inventory contains at least `amount` of an item by `prefab`.
*   **Parameters:**  
  `item` (`string`) - Item prefab name.  
  `amount` (`number`) - Minimum required count.  
  `checkallcontainers` (`boolean`) - Include open containers.
*   **Returns:** `boolean` (whether count ≥ `amount`), `number` (actual count).

### `ConsumeByName(item, amount)`
*   **Description:** Consumes items by `prefab`, removing them entirely from the inventory.
*   **Parameters:**  
  `item` (`string`) - Item prefab name.  
  `amount` (`number`) - Number of items to consume.
*   **Returns:** Nothing.

### `DropEverything(ondeath, keepequip)`
*   **Description:** Drops all items from inventory (and optionally unequips them). Respects `keepondeath` and `"cursed"` items.
*   **Parameters:**  
  `ondeath` (`boolean`) - Called during player death.  
  `keepequip` (`boolean`) - Keep equipped items.
*   **Returns:** Nothing.

### `Open()`, `Close(keepactiveitem)`, `Show()`, `Hide()`
*   **Description:** Manages UI visibility and state for the inventory and open containers (e.g., backpacks).
*   **Parameters:**  
  `keepactiveitem` (`boolean` for `Close`) — Keep active item in hand.
*   **Returns:** Nothing.

### `GetWaterproofness(slot)`
*   **Description:** Calculates total waterproofing from equipment or a specific slot.
*   **Parameters:** `slot` (`number` or `nil`) — Slot index or `nil` for all.
*   **Returns:** `number` — Waterproofness rating (≥1 is fully waterproof).

### `ApplyDamage(damage, attacker, weapon, spdamage)`
*   **Description:** Applies incoming damage to the inventory, accounting for armor absorption, resistance, and special damage defense. Reduces armor durability.
*   **Parameters:**  
  `damage` (`number`) — Base damage amount.  
  `attacker` (`Entity` or `nil`) — Attacker entity.  
  `weapon` (`Entity` or `nil`) — Weapon entity.  
  `spdamage` (`table` or `nil`) — Special damage map (type → damage).
*   **Returns:** `number` (leftover damage), `table` (unabsorbed special damage) or `nil`.

## Events & listeners
- **Listens to:**  
  `"death"` — Triggers `OnDeath` to drop all items (unless `dropondeath` is disabled).  
  `"player_despawn"` — Triggers `OnOwnerDespawned` to notify items and equipment of player despawn.  
- **Pushes:**  
  `"itemget"`, `"itemlose"`, `"equip"`, `"unequip"`, `"newactiveitem"`, `"gotnewitem"`, `"inventoryfull"`, `"dropitem"`, `"setoverflow"`, `"ondropped"`, `"onownerdropped"`, `"onownerputininventory"`.

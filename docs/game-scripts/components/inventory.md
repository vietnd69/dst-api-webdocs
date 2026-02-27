---
id: inventory
title: Inventory
description: Manages item storage, equipment, active items, and inventory interactions for entities in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: inventory
source_hash: b981734d
---

# Inventory

## Overview
This component handles item management for an entity, including storing items in slots, equipping items, tracking the active item, and supporting stacking, overflow containers (like backpacks), and inventory operations such as giving, dropping, removing, and transferring items. It is primarily used for player characters and other entities capable of holding items, and it integrates closely with the Entity Component System (ECS), persistence (save/load), UI interactions, and event-driven behavior.

## Dependencies & Tags
- **Components:**
  - Relies on `inventoryitem` (on items), `equippable` (on equipment), `armor`, `stackable`, `container`, `petleash`, `migrationpetowner`, `resistance`, `damagetyperesist`, `setbonus`, `waterproofer`, `playerfloater`, `inspectable`, `spellbook`.
- **Events listened to:**
  - `"death"` → triggers `OnDeath`, which drops all items.
  - `"player_despawn"` → triggers `OnOwnerDespawned`, which sends `"player_despawn"` to active items and equipped items.
- **Tags:**
  - It does not directly add or remove entity tags.
  - Reads entity tags (`"heavy"`, `"backpack"`, `"nocrafting"`, `"pocketdimension_container"`) on items and the owner.
- **Special behaviors:**
  - Registers owner listen-for-event hooks for death/despawn.
  - Uses `replica.inventory` (network replica) to sync state like `SetHeavyLifting`, `SetFloaterHeld`, `OnOpen`, `OnClose`, etc.
  - Uses `SourceModifierList(boolean)` for `isexternallyinsulated`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity the inventory belongs to. Set in constructor. |
| `isopen` | `boolean` | `false` | Whether the inventory UI is currently open. |
| `isvisible` | `boolean` | `false` | Whether the inventory UI is visible. |
| `ignoreoverflow` | `boolean` | `false` | Flag to bypass overflow container behavior (used during transfers). |
| `ignorefull` | `boolean` | `false` | Flag to bypass "inventory full" logic (used during container moves). |
| `silentfull` | `boolean` | `false` | Suppresses `"inventoryfull"` events. |
| `ignoresound` | `boolean` | `false` | Suppresses `"gotnewitem"` events. |
| `itemslots` | `table` | `{}` | Map of slot indices (1-based integer) to non-equipped items. |
| `maxslots` | `number` | `GetMaxItemSlots(TheNet:GetServerGameMode())` | Max number of inventory slots. Becomes read-only in classified mode. |
| `equipslots` | `table` | `{}` | Map of equipment slot names (`EQUIPSLOTS.*`) to equipped items. |
| `heavylifting` | `boolean` | `false` | Set to true when a "heavy" BODY slot item (e.g., Beefalo Hat) is equipped. |
| `floaterheld` | `boolean` or `nil` | `nil` | Set to true when a floater item is held in HANDS. |
| `activeitem` | `Entity` or `nil` | `nil` | The item currently in hand. |
| `acceptsstacks` | `boolean` | `true` | Whether this inventory can accept stackable items (read-only in classified mode). |
| `ignorescangoincontainer` | `boolean` | `false` | Bypasses `inventoryitem.cangoincontainer` checks. Read-only in classified mode. |
| `opencontainers` | `table` | `{}` | Set of containers currently open by the owner. |
| `opencontainerproxies` | `table` | `{}` | Set of container proxy instances. |
| `dropondeath` | `boolean` | `true` | Whether the inventory drops all items on death. |
| `isexternallyinsulated` | `SourceModifierList(boolean)` | `SourceModifierList(inst, false, SourceModifierList.boolean)` | Tracks if the entity is externally insulated (e.g., via external sources). |

## Main Functions

### `Inventory:NumItems()`
* **Description:** Returns the number of distinct items stored in `itemslots`.
* **Parameters:** None.

### `Inventory:NumStackedItems()`
* **Description:** Returns the total number of items accounting for stack sizes in `itemslots` (active item and equipped items are excluded).
* **Parameters:** None.

### `Inventory:TransferInventory(receiver)`
* **Description:** Moves all persistent items and equipped items from this inventory to `receiver`'s inventory. Handles equippable restrictions and persistence flags.
* **Parameters:** `receiver` (Entity with `inventory` component).

### `Inventory:SwapEquipment(other, equipslot_to_swap)`
* **Description:** Swaps equipped items between `self` and `other` on specified or all equipment slots. Respects equippable restrictions and attempts to equip if possible; otherwise, gives as item.
* **Parameters:** `other` (Entity), `equipslot_to_swap` (optional slot name). Returns `true` if `other` has a valid inventory.

### `Inventory:OnSave()`
* **Description:** Returns save data and item references for persistence. Includes items, equipment, and the active item (if not equipped). Skips non-persistent items.
* **Parameters:** None.
* **Returns:** `data` (table), `references` (array of entity references).

### `Inventory:OnLoad(data, newents)`
* **Description:** Loads inventory contents from saved data, including migration of pets and containers. Flags `isloading` temporarily.
* **Parameters:** `data` (table with `items`, `equip`, `activeitem`), `newents` (table of new entities for spawn).

### `Inventory:DropActiveItem()`
* **Description:** Drops the active item, sets active item to `nil`.
* **Parameters:** None.
* **Returns:** Dropped item (or `nil`).

### `Inventory:ReturnActiveActionItem(item, instant)`
* **Description:** Returns an item back to inventory or active item if it matches `self.activeitem` and buffered action conditions match; bypasses fullness checks using internal flags.
* **Parameters:** `item` (Entity), `instant` (boolean).

### `Inventory:HasAnyEquipment()`
* **Description:** Returns `true` if any equipment is equipped.
* **Parameters:** None.

### `Inventory:IsWearingArmor()`
* **Description:** Returns `true` if any item has the `armor` component equipped.
* **Parameters:** None.

### `Inventory:ArmorHasTag(tag)`
* **Description:** Returns `true` if any armor-equipped item has `tag`.
* **Parameters:** `tag` (string).

### `Inventory:EquipHasTag(tag)`
* **Description:** Returns `true` if any equipped item has `tag`.
* **Parameters:** `tag` (string).

### `Inventory:EquipHasSpDefenseForType(sptype)`
* **Description:** Returns `true` if any equipped item provides special defense for `sptype`.
* **Parameters:** `sptype` (string, special damage type).

### `Inventory:IsHeavyLifting()`
* **Description:** Returns `true` if currently heavy-lifting (i.e., "heavy" BODY slot item equipped).
* **Parameters:** None.

### `Inventory:IsFloaterHeld()`
* **Description:** Returns whether a floater is currently held in HANDS slot.
* **Parameters:** None.

### `Inventory:ApplyDamage(damage, attacker, weapon, spdamage)`
* **Description:** Applies damage to the entity, absorbing through armor and resistances. Handles special damage (e.g., fire, freeze) and durability loss.
* **Parameters:**
  - `damage` (number): Base damage amount.
  - `attacker` (Entity or `nil`).
  - `weapon` (Entity or `nil`).
  - `spdamage` (table of special damage types to amounts, optional).
* **Returns:** `leftover_damage` (number), `spdamage` (table or `nil`).

### `Inventory:GetActiveItem()`
* **Description:** Returns the current active item.
* **Parameters:** None.

### `Inventory:IsItemEquipped(item)`
* **Description:** Returns the equipment slot name if `item` is equipped; otherwise `nil`.
* **Parameters:** `item` (Entity).

### `Inventory:SelectActiveItemFromEquipSlot(slot)`
* **Description:** Unequips an item from `slot` and makes it active. If no space, gives it back to inventory.
* **Parameters:** `slot` (string, equipment slot name).
* **Returns:** New active item.

### `Inventory:CombineActiveStackWithSlot(slot, stack_mod)`
* **Description:** Attempts to merge the active item stack into an item at `slot` (same prefab/skin, stackable). Increases/decreases stack sizes.
* **Parameters:** `slot` (number/string), `stack_mod` (boolean, optional).

### `Inventory:SelectActiveItemFromSlot(slot)`
* **Description:** Moves item from `slot` to active item, removing it from inventory slot.
* **Parameters:** `slot` (number, inventory slot index).

### `Inventory:ReturnActiveItem(slot, stack_mod)`
* **Description:** Returns active item to specified slot or drops it if full. Respects `stack_mod` to split stack.
* **Parameters:** `slot` (optional number), `stack_mod` (boolean).

### `Inventory:GetNumSlots()`
* **Description:** Returns `maxslots`.
* **Parameters:** None.

### `Inventory:GetItemSlot(item)`
* **Description:** Returns inventory slot key where `item` is stored (or `nil`).
* **Parameters:** `item` (Entity).

### `Inventory:IsHolding(item, checkcontainer)`
* **Description:** Checks if `item` is active, equipped, or stored in inventory (optionally in open containers).
* **Parameters:** `item` (Entity), `checkcontainer` (boolean or `nil`).

### `Inventory:FindItem(fn)`
* **Description:** Returns first item matching `fn(item)` in inventory, equipment, active item, or overflow.
* **Parameters:** `fn` (function).

### `Inventory:FindItems(fn)`
* **Description:** Returns all items matching `fn(item)` across inventory slots, equipment, active item, and overflow.
* **Parameters:** `fn` (function).

### `Inventory:ForEachItem(fn, ...)`
* **Description:** Runs `fn(item, ...)` on all inventory items, equipped items, and active item (including overflow).
* **Parameters:** `fn` (function), `...` (arguments passed to `fn`).

### `Inventory:ForEachWetableItem(fn, ...)`
* **Description:** Runs `fn(item, ...)` on inventory, equipment, and active items (does not recurse into containers).
* **Parameters:** `fn` (function), `...` (arguments).

### `Inventory:ForEachEquipment(fn, ...)`
* **Description:** Runs `fn(item, ...)` on equipped items.
* **Parameters:** `fn` (function), `...` (arguments).

### `Inventory:ForEachItemSlot(fn, ...)`
* **Description:** Runs `fn(item, ...)` on items in `itemslots`.
* **Parameters:** `fn` (function), `...` (arguments).

### `Inventory:RemoveItemBySlot(slot, keepoverstacked)`
* **Description:** Removes and returns item from `slot`, if present.
* **Parameters:** `slot` (number/string), `keepoverstacked` (optional boolean).

### `Inventory:DropItem(item, wholestack, randomdir, pos, keepoverstacked)`
* **Description:** Drops item in the world. Updates position, triggers `"dropitem"`, and cleans up ownership.
* **Parameters:** `item` (Entity), `wholestack` (boolean), `randomdir` (boolean), `pos` (Vector3, optional), `keepoverstacked` (boolean).

### `Inventory:IsInsulated()`
* **Description:** Returns `true` if any equipment is insulated (electrically) or if externally insulated.
* **Parameters:** None.

### `Inventory:GetEquippedItem(eslot)`
* **Description:** Returns item in equipment slot `eslot`.
* **Parameters:** `eslot` (string, e.g., `"HANDS"`).

### `Inventory:GetItemInSlot(slot)`
* **Description:** Returns item in inventory slot `slot`.
* **Parameters:** `slot` (number).

### `Inventory:GetFirstItemInAnySlot()`
* **Description:** Returns first non-nil item in `itemslots` (ordered 1..`maxslots`).
* **Parameters:** None.

### `Inventory:IsFull()`
* **Description:** Returns `true` if all inventory slots are occupied.
* **Parameters:** None.

### `Inventory:GetNextAvailableSlot(item)`
* **Description:** Finds next available slot for `item`, considering stacks, overflow, and prioritize container logic. Returns `slot, container_table`.
* **Parameters:** `item` (Entity).

### `Inventory:CanAcceptCount(item, maxcount)`
* **Description:** Computes how many of `item` (up to `maxcount`) can be accepted, including stacks and overflow.
* **Parameters:** `item` (Entity), `maxcount` (number, optional).
* **Returns:** Acceptable count.

### `Inventory:GiveActiveItem(inst)`
* **Description:** Sets `inst` as the active item. Ensures item is not already held or equipped, calls pickup hooks, and pushes `"itemget"`.
* **Parameters:** `inst` (Entity with `inventoryitem`).

### `Inventory:GiveItem(inst, slot, src_pos)`
* **Description:** Attempts to give item to inventory. Handles stacking, overflow, active item fallback, and fullness logic. Returns slot (or `true`) if successful.
* **Parameters:** `inst` (Entity), `slot` (optional number), `src_pos` (Vector3, optional).

### `Inventory:Unequip(equipslot, slip, force)`
* **Description:** Unequips item from `equipslot`. Updates `heavylifting`/`floaterheld`. Triggers `"unequip"` and set bonus updates.
* **Parameters:** `equipslot` (string), `slip` (boolean, optional), `force` (boolean, optional).

### `Inventory:SetActiveItem(item)`
* **Description:** Sets `item` as active. If item cannot be held in container, drops it. Triggers `"newactiveitem"`.
* **Parameters:** `item` (Entity or `nil`).

### `Inventory:Equip(item, old_to_active, no_animation, force_ui_anim)`
* **Description:** Equips item to its defined slot. Handles conflicts (unequips old item, moves to overflow/active item), updates state flags (`heavylifting`, `floaterheld`), triggers `"equip"`, and updates set bonuses.
* **Parameters:** `item` (Entity), `old_to_active` (boolean), `no_animation` (boolean), `force_ui_anim` (boolean).

### `Inventory:RemoveItem(item, wholestack, checkallcontainers, keepoverstacked)`
* **Description:** Removes `item` from inventory, equipment, active item, or overflow (and optionally `opencontainers`). Returns removed item or `nil`.
* **Parameters:** `item` (Entity), `wholestack` (boolean), `checkallcontainers` (boolean), `keepoverstacked` (boolean).

### `Inventory:GetOverflowContainer()`
* **Description:** Returns the container used as overflow (e.g., backpack in `BODY` slot) or `nil`.
* **Parameters:** None.

### `Inventory:Has(item, amount, checkallcontainers)`
* **Description:** Counts how many items matching `item.prefab` are present. Supports `checkallcontainers`.
* **Parameters:** `item` (prefab string), `amount` (number), `checkallcontainers` (boolean).
* **Returns:** `found >= amount`, `total_found`.

### `Inventory:HasItemThatMatches(fn, amount)`
* **Description:** Counts items satisfying custom predicate `fn(item)`. Supports overflow and containers.
* **Parameters:** `fn` (function), `amount` (number).
* **Returns:** `found >= amount`, `total_found`.

### `Inventory:HasItemWithTag(tag, amount)`
* **Description:** Counts items with `tag` in inventory, active, equipment, and overflow.
* **Parameters:** `tag` (string), `amount` (number).
* **Returns:** `found >= amount`, `total_found`.

### `Inventory:GetItemsWithTag(tag)`
* **Description:** Returns list of all items with `tag` in inventory, active, equipment, and overflow.
* **Parameters:** `tag` (string).

### `Inventory:GetItemByName(item, amount, checkallcontainers)`
* **Description:** Returns table `{item_entity => count}` of up to `amount` items matching `item` (prefab) across inventory, active, overflow, and containers.
* **Parameters:** `item` (prefab string), `amount` (number), `checkallcontainers` (boolean).

### `Inventory:GetCraftingIngredient(item, amount)`
* **Description:** Returns `{item_entity => count}` of ingredients suitable for crafting, excluding `"nocrafting"` items. Prioritizes smaller stacks and considers crafting containers.
* **Parameters:** `item` (prefab string), `amount` (number).

### `Inventory:ConsumeByName(item, amount)`
* **Description:** Destroys up to `amount` items matching `item` from inventory and overflow.
* **Parameters:** `item` (prefab string), `amount` (number).

### `Inventory:DropEverything(ondeath, keepequip)`
* **Description:** Drops all items, respecting `keepondeath`, `curseditem`, and `ondeath` flags. Optionally keeps equipped items.
* **Parameters:** `ondeath` (boolean), `keepequip` (boolean).

### `Inventory:DropEquipped(keepBackpack, keepPreventUnequipping)`
* **Description:** Drops all equipped items unless filtered by flags.
* **Parameters:** `keepBackpack` (boolean), `keepPreventUnequipping` (boolean).

### `Inventory:DestroyContents(onpredestroyitemcallbackfn)`
* **Description:** Recursively destroys all items (including containers), optionally calling callback per item.
* **Parameters:** `onpredestroyitemcallbackfn` (function, optional).

### `Inventory:Show()`, `Inventory:Open()`, `Inventory:Hide()`, `Inventory:Close(keepactiveitem)`
* **Description:** Manage inventory UI visibility and open state. `Open`/`Close` handle overflow container states and HUD updates.
* **Parameters:** None, except `keepactiveitem` in `Close`.

### `Inventory:CloseAllChestContainers()`
* **Description:** Closes all chest-type containers in `opencontainers`.

### Inventory UI Action Handlers (e.g., `PutOneOfActiveItemInSlot`, `SwapActiveItemWithSlot`, `TakeActiveItemFromEquipSlot`, `MoveItemFromAllOfSlot`, etc.)
* **Description:** Handle UI interactions (clicks, drags) for manipulating items within inventory slots and between inventory and containers. Many use internal flags (`ignoresound`, `silentfull`) and honor constraints like stackability and `canonlygoinpocket`.

### `Inventory:CanAccessItem(item)`
* **Description:** Checks if item is currently accessible (inventory visible, item owned or in an open non-readonly container).
* **Parameters:** `item` (Entity).

### `Inventory:UseItemFromInvTile(...)`, `Inventory:ControllerUseItemOnItemFromInvTile(...)`, `Inventory:ControllerUseItemOnSelfFromInvTile(...)`, `Inventory:ControllerUseItemOnSceneFromInvTile(...)`
* **Description:** Handle remote/remote-predicted actions initiated from inventory UI tiles. Creates and pushes `BufferedAction`s via `playeractionpicker` or `playercontroller`.

### `Inventory:InspectItemFromInvTile(item)`
* **Description:** Initiates `"LOOKAT"` action on `item` via locomotor.
* **Parameters:** `item` (Entity).

### `Inventory:DropItemFromInvTile(item, single)`
* **Description:** Initiates `"DROP"` action with options `wholestack` and `instant`.
* **Parameters:** `item` (Entity), `single` (boolean).

### `Inventory:CastSpellBookFromInv(item, spell_id)`
* **Description:** Initiates `"CAST_SPELLBOOK"` action for `item` spellbook, optionally selecting `spell_id`.
* **Parameters:** `item` (Entity), `spell_id` (optional number).

### `Inventory:EquipActiveItem()`, `Inventory:EquipActionItem(item)`, `Inventory:SwapEquipWithActiveItem()`, `Inventory:TakeActiveItemFromEquipSlot(eslot)`
* **Description:** Convenience wrappers for common equipment swaps and transitions from active item ↔ equipment.

### `Inventory:MoveItemFromAllOfSlot(slot, container)`, `MoveItemFromHalfOfSlot(...)`, `MoveItemFromCountOfSlot(...)`
* **Description:** Transfer items from inventory slots to an open container (e.g., crafting), respecting container state and slot mapping.

### `Inventory:GetEquippedMoistureRate(slot)`
* **Description:** Returns total `moisture, max` moisture rate from equipment (or specific `slot`).
* **Parameters:** `slot` (optional string).

### `Inventory:GetWaterproofness(slot)`
* **Description:** Returns total waterproof rating (0+) from equipment or specific slot.
* **Parameters:** `slot` (optional string).

### `Inventory:IsWaterproof()`
* **Description:** Returns `true` if total waterproof rating ≥ 1.
* **Parameters:** None.

### `Inventory:TransferComponent(newinst)`
* **Description:** Transfers inventory contents to another entity (e.g., after rebirth) using `EmptyBeard` then `TransferInventory`.
* **Parameters:** `newinst` (Entity).

### `Inventory:GetOpenContainerProxyFor(master)`
* **Description:** Returns the container proxy instance associated with `master` container.
* **Parameters:** `master` (Entity).

## Events & Listeners

- Listens for `"death"` on owner → calls `OnDeath`, which triggers `DropEverything(true)`.
- Listens for `"player_despawn"` on owner → calls `OnOwnerDespawned`, sending `"player_despawn"` to all items in `itemslots`, `equipslots`, and `activeitem`.
- Pushes the following events:
  - `"dropitem"` (after dropping).
  - `"gotnewitem"` (after giving new item).
  - `"itemget"` (after item placed in inventory slot).
  - `"itemlose"` (after item removed from inventory slot or active item).
  - `"unequip"` (after unequipping).
  - `"equip"` (after equipping).
  - `"newactiveitem"` (after setting active item).
  - `"inventoryfull"` (when item cannot be given and triggers a message).
  - `"setoverflow"` (after equipping an overflow container in `BODY` slot).
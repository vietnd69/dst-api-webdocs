---
id: container_replica
title: Container Replica
description: This component manages the client-side representation and interaction logic for a container, synchronizing its state with the server and handling UI updates.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: inventory
source_hash: f4d6c03f
---

# Container Replica

## Overview
The `Container` replica component (often referred to as `container_replica` in client-side code) is responsible for managing the client's perception and interaction with container entities in Don't Starve Together. It works in conjunction with the server's `container` component, utilizing network synchronization through a `container_classified` prefab to reflect the server's container state locally. This component handles UI presentation, player input for item manipulation (e.g., picking up, putting down, splitting stacks), and triggers visual and auditory feedback for container interactions, ensuring a responsive and accurate client-side experience for inventory management.

## Dependencies & Tags
*   **Dependencies:**
    *   `containers` (Lua module): Used for common container widget setup logic.
    *   `container_classified` (Prefab): A classified network entity spawned by the server and managed by this component for synchronizing container slot states to clients.
    *   `container_opener` (Prefab): A classified network entity spawned by the server and managed by this component to grant individual players access to container data.
    *   `inventoryitem` (Component): Referenced on items to determine if they can be placed into the container.
    *   `equippable` (Component): Referenced on items to determine if they are equipped items that might not be allowed in the container under certain game mode properties.
    *   `ThePlayer`: Global reference to the local player entity, used for UI interactions.
    *   `TheWorld`: Global reference for checking `ismastersim`.
    *   `TheFocalPoint`: Global reference for playing sounds.
*   **Tags:** None identified.

## Properties
| Property                 | Type      | Default Value | Description                                                                                             |
| :----------------------- | :-------- | :------------ | :------------------------------------------------------------------------------------------------------ |
| `_cannotbeopened`        | `net_bool`| `false`       | Networked boolean indicating if the container cannot be opened.                                         |
| `_skipopensnd`           | `net_bool`| `false`       | Networked boolean indicating if the container should skip playing its open sound.                       |
| `_skipclosesnd`          | `net_bool`| `false`       | Networked boolean indicating if the container should skip playing its close sound.                      |
| `_isopen`                | `boolean` | `false`       | Local boolean indicating if the container's UI is currently open on the client.                         |
| `_numslots`              | `number`  | `0`           | The number of inventory slots this container has.                                                       |
| `acceptsstacks`          | `boolean` | `true`        | Determines if the container accepts stackable items.                                                    |
| `usespecificslotsforitems`| `boolean` | `false`       | Determines if items should try to go into specific slots based on `itemtestfn`.                         |
| `issidewidget`           | `boolean` | `false`       | Indicates if the container's UI widget should be displayed as a side widget (e.g., backpack).           |
| `type`                   | `nil`     | `nil`         | A descriptor for the type of container (e.g., "backpack", "chest"). Typically set during prefab setup.  |
| `widget`                 | `table`   | `nil`         | Reference to the UI widget associated with this container.                                              |
| `itemtestfn`             | `function`| `nil`         | An optional function used to determine if a specific item can go into a specific slot.                  |
| `priorityfn`             | `function`| `nil`         | An optional function used to determine if the container should be prioritized for an item.              |
| `opentask`               | `Task`    | `nil`         | A task handle for a delayed open operation.                                                             |
| `openers`                | `table`   | `{}`          | A table storing `container_opener` instances, mapped by the player entity that opened them (server-side). |
| `opener`                 | `Entity`  | `nil`         | Reference to the `container_opener` prefab that grants access to this container for the local player (client-side). |
| `classified`             | `Entity`  | `nil`         | Reference to the `container_classified` prefab used for network synchronization.                        |

## Main Functions
### `OnRemoveEntity()`
*   **Description:** Handles cleanup when the entity owning this component is removed. On the master sim, it removes the classified data and all individual player openers. On client, it detaches the opener.
*   **Parameters:** None.

### `AttachClassified(classified)`
*   **Description:** Attaches a `container_classified` entity to this replica, initializing its slots and setting up an `onremove` listener to detach it if the classified entity is removed. This is primarily a client-side function.
*   **Parameters:**
    *   `classified` (`Entity`): The `container_classified` entity to attach.

### `DetachClassified()`
*   **Description:** Detaches the currently attached `container_classified` entity, removing its `onremove` listener and nullifying the reference. This is primarily a client-side function.
*   **Parameters:** None.

### `AttachOpener(opener)`
*   **Description:** Attaches a `container_opener` entity to this replica. It sets up an `onremove` listener for the opener and schedules a task to open the container's UI on the client shortly after attachment. It also starts listening for `itemget` and `itemlose` events to refresh crafting UI. This is a client-side function.
*   **Parameters:**
    *   `opener` (`Entity`): The `container_opener` entity to attach.

### `DetachOpener()`
*   **Description:** Detaches the currently attached `container_opener` entity. It cancels any pending open tasks, removes listeners, closes the container UI, and refreshes crafting UI. This is a client-side function.
*   **Parameters:** None.

### `AddOpener(opener)`
*   **Description:** Registers a player as an opener of this container. It manages the `container_classified` target (switching to `nil` if multiple openers) and spawns a `container_opener` for the specific player. This is a server-side function.
*   **Parameters:**
    *   `opener` (`Entity`): The player entity who is opening the container.

### `RemoveOpener(opener)`
*   **Description:** Deregisters a player as an opener of this container. It updates the `container_classified` target based on remaining openers and removes the specific `container_opener` associated with the player. This is a server-side function.
*   **Parameters:**
    *   `opener` (`Entity`): The player entity who is closing the container.

### `WidgetSetup(prefab, data)`
*   **Description:** Initializes the container's widget and sets up event listeners related to item movement in and out of the container on the server-side, primarily for refreshing crafting.
*   **Parameters:**
    *   `prefab` (`string`): The prefab name of the container.
    *   `data` (`table`): Additional data for widget setup.

### `EnableInfiniteStackSize(enable)`
*   **Description:** Sets whether the container's items should display as having infinite stack size in the UI. This is a networked property.
*   **Parameters:**
    *   `enable` (`boolean`): `true` to enable infinite stack size, `false` otherwise.

### `IsInfiniteStackSize()`
*   **Description:** Returns whether the container's items are currently set to display as having infinite stack size.
*   **Parameters:** None.
*   **Returns:** (`boolean`) `true` if infinite stack size is enabled, `false` otherwise.

### `EnableReadOnlyContainer(enable)`
*   **Description:** Sets whether the container is read-only, preventing items from being added or removed. This is a networked property and triggers a UI refresh for players with the container open.
*   **Parameters:**
    *   `enable` (`boolean`): `true` to make the container read-only, `false` otherwise.

### `IsReadOnlyContainer()`
*   **Description:** Returns whether the container is currently read-only.
*   **Parameters:** None.
*   **Returns:** (`boolean`) `true` if the container is read-only, `false` otherwise.

### `CanTakeItemInSlot(item, slot)`
*   **Description:** Determines if a given item can be placed into a specified slot in this container, considering various conditions like `inventoryitem` component properties, read-only status, and the `itemtestfn`.
*   **Parameters:**
    *   `item` (`Entity`): The item to test.
    *   `slot` (`number`): The target slot index.
*   **Returns:** (`boolean`) `true` if the item can be taken, `false` otherwise.

### `GetSpecificSlotForItem(item)`
*   **Description:** If `usespecificslotsforitems` is enabled, this function iterates through slots and returns the first slot index where the `itemtestfn` allows the item to be placed.
*   **Parameters:**
    *   `item` (`Entity`): The item to find a specific slot for.
*   **Returns:** (`number` or `nil`) The specific slot index, or `nil` if no suitable slot is found or specific slots are not used.

### `ShouldPrioritizeContainer(item)`
*   **Description:** Determines if this container should be prioritized for placing a given item, based on `priorityfn` and other item placement rules.
*   **Parameters:**
    *   `item` (`Entity`): The item to evaluate.
*   **Returns:** (`boolean`) `true` if the container should be prioritized, `false` otherwise.

### `Open(doer)`
*   **Description:** Opens the container's UI for the specified player (`doer`). On the client, if `doer` is `ThePlayer`, it invokes `ThePlayer.HUD:OpenContainer` and plays an open sound. On the master, it defers to the `container` component.
*   **Parameters:**
    *   `doer` (`Entity`): The entity attempting to open the container (typically `ThePlayer` on client, or a player entity on master).

### `Close()`
*   **Description:** Closes the container's UI. On the client, if `ThePlayer`'s HUD is active and the container is open, it invokes `ThePlayer.HUD:CloseContainer` and plays a close sound. On the master, it defers to the `container` component.
*   **Parameters:** None.

### `IsBusy()`
*   **Description:** Checks if the container replica is currently busy (e.g., waiting for classified data or the classified replica itself is busy). This is primarily for the client-side to manage UI state.
*   **Parameters:** None.
*   **Returns:** (`boolean`) `true` if busy, `false` otherwise.

### Item Manipulation Functions (e.g., `PutOneOfActiveItemInSlot`, `TakeActiveItemFromAllOfSlot`, `SwapActiveItemWithSlot`, `MoveItemFromAllOfSlot`)
*   **Description:** These functions are client-side handlers for player inventory actions. They typically forward the request to the underlying `container` component (if on master) or to the `container_classified` replica (if on client) to perform the actual item manipulation in a specific slot, involving `ThePlayer` as the implicit doer.
*   **Parameters:**
    *   `slot` (`number`): The inventory slot index.
    *   `container` (`Entity`, optional): For move operations, the target container.
    *   `count` (`number`, optional): For count-based take/move operations.

## Events & Listeners
*   **Listens to:**
    *   `inst:ListenForEvent("itemget", self._onitemget)` (Master, in `_ctor`)
    *   `inst:ListenForEvent("itemlose", self._onitemlose)` (Master, in `_ctor`)
    *   `inst:ListenForEvent("onremove", self.ondetachclassified, classified)` (Client, in `AttachClassified`)
    *   `inst:ListenForEvent("onremove", self.ondetachopener, opener)` (Client, in `AttachOpener`)
    *   `inst:ListenForEvent("itemget", OnRefreshCrafting)` (Client, in `AttachOpener`)
    *   `inst:ListenForEvent("itemlose", OnRefreshCrafting)` (Client, in `AttachOpener`)
    *   `inst:ListenForEvent("onputininventory", self._onputininventory)` (Master, in `WidgetSetup`)
    *   `inst:ListenForEvent("ondropped", self._ondropped)` (Master, in `WidgetSetup`)
*   **Triggers/Pushes:**
    *   `inst.components.inventoryitem.owner:PushEvent("refreshcrafting")` (Master, in `_onitemget`, `_onitemlose`, `_onputininventory`, `_ondropped`)
    *   `ThePlayer:PushEvent("refreshcrafting")` (Client, in `OpenContainer`, `DetachOpener`, `OnRefreshCrafting` utility function, `RefreshLocalPlayerUI`)
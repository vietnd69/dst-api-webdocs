---
id: cookbookupdater
title: Cookbookupdater
description: This component manages a player's learned recipes and food stats, synchronizing them across the network.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: player
source_hash: 3c14278a
---

# Cookbookupdater

## Overview
The `CookbookUpdater` component is responsible for tracking and managing the recipes and food statistics a player has learned within the game. It acts as an intermediary, adding new recipe information to an internal `CookbookData` instance and facilitating the synchronization of this data from server to client through Remote Procedure Calls (RPCs). For the client-controlled player, it also ensures the component's cookbook instance directly references the global `TheCookbook` to enable saving.

## Dependencies & Tags
None identified for other components. However, this component heavily relies on global game services and modules such as `TheNet` (for network operations), `ThePlayer` (for client-side player specific logic), `TheWorld` (for master simulation checks), `CLIENT_RPC` (for client synchronization), and the `cookbookdata` module (to manage recipe information). No specific tags are added or removed by this component.

## Properties
| Property   | Type                          | Default Value             | Description                                                                                                                                                                                                         |
| :--------- | :---------------------------- | :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `inst`     | `Entity`                      | The component's owner `inst` | A reference to the entity this component is attached to.                                                                                                                                                            |
| `cookbook` | `table` (CookbookData instance) | A new `CookbookData` instance | An instance of `CookbookData` which stores all learned recipes and food statistics. For the local client's player, this reference is replaced with the global `TheCookbook` instance upon `playeractivated` event. |

## Main Functions
### `LearnRecipe(product, ingredients)`
*   **Description:** Adds a new recipe to the player's cookbook. If the recipe is new and the call originates from a server (either dedicated or master sim) for a player with a `userid`, it will trigger an RPC to send the new recipe information to the respective client.
*   **Parameters:**
    *   `product`: (`string`) The string identifier for the crafted item (e.g., "meatballs").
    *   `ingredients`: (`table`) A table containing string identifiers for the ingredients required for the recipe.

### `LearnFoodStats(product)`
*   **Description:** Records a food item's statistics in the player's cookbook. Similar to `LearnRecipe`, if this is new information and originates from a server for a player with a `userid`, it will trigger an RPC to send the new food stats to the respective client.
*   **Parameters:**
    *   `product`: (`string`) The string identifier for the food item whose stats are being learned (e.g., "meatballs").

## Events & Listeners
*   `inst:ListenForEvent("playeractivated", onplayeractivated)`:
    *   **Description:** When the `playeractivated` event is triggered on the owning entity (`inst`), if the game is not a dedicated server and the entity is `ThePlayer`, the component's `cookbook` property is updated to reference the global `TheCookbook` instance, and saving is enabled for it.
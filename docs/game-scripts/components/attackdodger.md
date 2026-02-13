---
id: attackdodger
title: Attackdodger
description: Enables an entity to perform a dodge action in response to an attack, with configurable conditions and a cooldown period.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: combat
---

# Attackdodger

## Overview
The Attackdodger component provides a framework for an entity to evade incoming attacks. It allows for custom logic to determine if a dodge is possible and what action occurs during the dodge. It also manages a cooldown to prevent the entity from dodging too frequently. This component is typically used in conjunction with a `combat` component, which would call `CanDodge` and `Dodge` when the entity is targeted.

## Dependencies & Tags
None identified.

## Properties

| Property      | Type     | Default Value | Description                                                              |
|---------------|----------|---------------|--------------------------------------------------------------------------|
| `ondodgefn`     | function | `nil`         | A callback function that is executed when the entity performs a dodge.   |
| `candodgefn`    | function | `nil`         | A callback function that determines if the entity is allowed to dodge.   |
| `cooldowntime`  | number   | `nil`         | The duration in seconds that the entity must wait before dodging again.  |
| `oncooldown`    | boolean  | `false`       | A flag indicating if the dodge ability is currently on cooldown.         |
| `cooldowntask`  | task     | `nil`         | A reference to the scheduled task that will end the cooldown.            |

## Main Functions
### `SetOnDodgeFn(fn)`
* **Description:** Sets the callback function to be executed when the entity successfully dodges an attack.
* **Parameters:**
    * `fn` (function): The function to call on a dodge. It receives the entity instance (`inst`) and the `attacker` as arguments.

### `SetCanDodgeFn(fn)`
* **Description:** Sets the callback function that determines if the entity is currently capable of dodging. This function is checked before a dodge is attempted.
* **Parameters:**
    * `fn` (function): The function to call to check for dodge eligibility. It receives the entity instance (`inst`) and the `attacker` as arguments and should return `true` or `false`.

### `SetCooldownTime(n)`
* **Description:** Sets the cooldown period for the dodge ability. After a dodge, the entity will be unable to dodge again until this time has passed.
* **Parameters:**
    * `n` (number): The cooldown duration in seconds.

### `CanDodge(attacker)`
* **Description:** Checks if the entity is able to perform a dodge. It evaluates both the custom `candodgefn` (if set) and the current cooldown status (if a `cooldowntime` is set). If both are configured, both must pass. If only one is configured, only that condition is checked.
* **Parameters:**
    * `attacker` (Entity): The entity that is initiating the attack.

### `Dodge(attacker)`
* **Description:** Executes the dodge action. This calls the `ondodgefn` and, if a cooldown is configured, puts the ability on cooldown.
* **Parameters:**
    * `attacker` (Entity): The entity that is initiating the attack.
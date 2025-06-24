---
id: util
title: Utility Functions
description: Collection of utility functions for table manipulation, string processing, math calculations, and data structures
sidebar_position: 123
slug: api-vanilla/core-systems/util
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Utility Functions

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The **Utility Functions** module provides a comprehensive collection of helper functions for common programming tasks in Don't Starve Together. It includes table manipulation, string processing, mathematical calculations, data structures, debugging tools, and specialized game utilities.

## Usage Example

```lua
-- Table utilities
local items = {"apple", "banana", "cherry"}
local random_item = GetRandomItem(items)

-- String utilities
local parts = "hello,world,lua":split(",")
-- parts = {"hello", "world", "lua"}

-- Math utilities
local distance_sq = distsq(pos1, pos2)
local random_val = GetRandomWithVariance(10, 2) -- 8-12 range

-- Data structures
local buffer = RingBuffer(5)
buffer:Add("first")
buffer:Add("second")
```

## Table Utilities

### Basic Table Functions

#### table.contains(table, element) {#table-contains}

**Status:** `stable`

**Description:**
Checks if a table contains a specific element (value).

**Parameters:**
- `table` (table): Table to search in
- `element` (any): Element to search for

**Returns:**
- (boolean): True if element is found

**Example:**
```lua
local fruits = {"apple", "banana", "cherry"}
local has_apple = table.contains(fruits, "apple") -- true
local has_orange = table.contains(fruits, "orange") -- false
```

#### table.containskey(table, key) {#table-containskey}

**Status:** `stable`

**Description:**
Checks if a table contains a specific key.

**Parameters:**
- `table` (table): Table to search in
- `key` (any): Key to search for

**Returns:**
- (boolean): True if key exists

#### table.getkeys(t) {#table-getkeys}

**Status:** `stable`

**Description:**
Returns an array of all keys in a table.

**Parameters:**
- `t` (table): Input table

**Returns:**
- (table): Array of keys

**Example:**
```lua
local data = {name = "Wilson", health = 150, hunger = 100}
local keys = table.getkeys(data) -- {"name", "health", "hunger"}
```

#### table.reverse(tab) {#table-reverse}

**Status:** `stable`

**Description:**
Returns a reversed copy of an indexed table.

**Parameters:**
- `tab` (table): Indexed table to reverse

**Returns:**
- (table): New reversed table

#### table.reverse_inplace(t) {#table-reverse-inplace}

**Status:** `stable`

**Description:**
Reverses an indexed table in place for better performance.

**Parameters:**
- `t` (table): Indexed table to reverse

**Returns:**
- (table): The same table (for chaining)

### Advanced Table Operations

#### table.invert(t) {#table-invert}

**Status:** `stable`

**Description:**
Creates a new table with keys and values swapped.

**Parameters:**
- `t` (table): Table to invert

**Returns:**
- (table): Inverted table

**Example:**
```lua
local original = {a = 1, b = 2, c = 3}
local inverted = table.invert(original) -- {[1] = "a", [2] = "b", [3] = "c"}
```

#### table.removearrayvalue(t, lookup_value) {#table-removearrayvalue}

**Status:** `stable`

**Description:**
Removes the first occurrence of a value from an indexed table.

**Parameters:**
- `t` (table): Indexed table
- `lookup_value` (any): Value to remove

**Returns:**
- (any): Removed value or nil

#### table.reverselookup(t, lookup_value) {#table-reverselookup}

**Status:** `stable`

**Description:**
Finds the first key that maps to a specific value.

**Parameters:**
- `t` (table): Table to search
- `lookup_value` (any): Value to find key for

**Returns:**
- (any): Key that maps to the value, or nil

### Table Size and Iteration

#### GetTableSize(table) {#get-table-size}

**Status:** `stable`

**Description:**
Counts the number of key-value pairs in a table. Like `#t` for map-type tables.

**Parameters:**
- `table` (table): Table to count

**Returns:**
- (number): Number of key-value pairs

#### ipairs_reverse(t) {#ipairs-reverse}

**Status:** `stable`

**Description:**
Iterator for indexed tables in reverse order.

**Parameters:**
- `t` (table): Indexed table

**Returns:**
- (function): Iterator function for use in for loops

**Example:**
```lua
local items = {"first", "second", "third"}
for i, v in ipairs_reverse(items) do
    print(i, v) -- 3 third, 2 second, 1 first
end
```

## Random Selection Functions

### GetRandomItem(choices) {#get-random-item}

**Status:** `stable`

**Description:**
Selects a random value from a table.

**Parameters:**
- `choices` (table): Table of choices

**Returns:**
- (any): Random value from table

### GetRandomItemWithIndex(choices) {#get-random-item-with-index}

**Status:** `stable`

**Description:**
Selects a random key-value pair from a table.

**Parameters:**
- `choices` (table): Table of choices

**Returns:**
- (any, any): Random key and value

### PickSome(num, choices) {#pick-some}

**Status:** `stable`

**Description:**
Randomly selects multiple items from an array without replacement.

**Parameters:**
- `num` (number): Number of items to pick
- `choices` (table): Array of choices (modified during operation)

**Returns:**
- (table): Array of selected items

**Example:**
```lua
local deck = {"A", "K", "Q", "J", "10", "9", "8", "7"}
local hand = PickSome(5, deck) -- Selects 5 random cards
-- Note: deck is modified (cards removed)
```

### PickSomeWithDups(num, choices) {#pick-some-with-dups}

**Status:** `stable`

**Description:**
Randomly selects multiple items from an array with replacement.

**Parameters:**
- `num` (number): Number of items to pick
- `choices` (table): Array of choices

**Returns:**
- (table): Array of selected items

## Array Operations

### JoinArrays(...) {#join-arrays}

**Status:** `stable`

**Description:**
Concatenates multiple indexed tables into a new table.

**Parameters:**
- `...` (tables): Arrays to concatenate

**Returns:**
- (table): New combined array

**Example:**
```lua
local fruits = {"apple", "banana"}
local vegetables = {"carrot", "broccoli"}
local food = JoinArrays(fruits, vegetables)
-- {"apple", "banana", "carrot", "broccoli"}
```

### ArrayUnion(...) {#array-union}

**Status:** `stable`

**Description:**
Merges multiple arrays, ensuring each value appears only once.

**Parameters:**
- `...` (tables): Arrays to merge

**Returns:**
- (table): Array with unique values

### ArrayIntersection(...) {#array-intersection}

**Status:** `stable`

**Description:**
Returns values that exist in all provided arrays.

**Parameters:**
- `...` (tables): Arrays to intersect

**Returns:**
- (table): Array of common values

### RemoveByValue(t, value) {#remove-by-value}

**Status:** `stable`

**Description:**
Removes all instances of a value from an indexed table.

**Parameters:**
- `t` (table): Array to modify
- `value` (any): Value to remove

## String Utilities

### string:split(sep) {#string-split}

**Status:** `stable`

**Description:**
Splits a string into an array using a separator.

**Parameters:**
- `sep` (string): Separator character (default: ":")

**Returns:**
- (table): Array of string parts

**Example:**
```lua
local parts = "apple,banana,cherry":split(",")
-- {"apple", "banana", "cherry"}
```

### string.findall(s, pattern, init, plain) {#string-findall}

**Status:** `stable`

**Description:**
Finds all matches of a pattern in a string.

**Parameters:**
- `s` (string): String to search
- `pattern` (string): Pattern to find
- `init` (number): Starting position (optional)
- `plain` (boolean): Plain text search (optional)

**Returns:**
- (table): Array of {first, last} position pairs

### string.rfind(s, pattern, init, plain) {#string-rfind}

**Status:** `stable`

**Description:**
Finds the last occurrence of a pattern in a string.

**Parameters:**
- `s` (string): String to search
- `pattern` (string): Pattern to find
- `init` (number): Starting position (optional)
- `plain` (boolean): Plain text search (optional)

**Returns:**
- (number, number): Start and end positions, or nil

### String Generation

#### string.random(Length, CharSet) {#string-random}

**Status:** `stable`

**Description:**
Generates a random string of specified length and character set.

**Parameters:**
- `Length` (number): Desired length
- `CharSet` (string): Character set pattern (optional, default: all chars)

**Returns:**
- (string): Random string

**Example:**
```lua
local random_id = string.random(8, "%l%d") -- 8 chars, lowercase + digits
local random_hex = string.random(16, "0123456789ABCDEF")
```

## Mathematical Utilities

### Distance Functions

#### distsq(v1, v2, v3, v4) {#distsq}

**Status:** `stable`

**Description:**
Calculates squared distance between two points. Supports both Vector3 objects and separate x,y,z parameters.

**Parameters:**
- `v1, v2` (Vector3): Two vector positions, OR
- `v1, v2, v3, v4` (number): x1, y1, x2, y2 for 2D distance

**Returns:**
- (number): Squared distance

**Example:**
```lua
-- Vector3 usage
local dist_sq = distsq(pos1, pos2)

-- 2D coordinate usage  
local dist_sq = distsq(x1, y1, x2, y2)
```

### Random Number Generation

#### GetRandomWithVariance(baseval, randomval) {#get-random-with-variance}

**Status:** `stable`

**Description:**
Returns a random number within a variance range around a base value.

**Parameters:**
- `baseval` (number): Center value
- `randomval` (number): Maximum variance

**Returns:**
- (number): Random value in range [baseval-randomval, baseval+randomval]

#### GetRandomMinMax(min, max) {#get-random-min-max}

**Status:** `stable`

**Description:**
Returns a random number between min and max values.

**Parameters:**
- `min` (number): Minimum value
- `max` (number): Maximum value

**Returns:**
- (number): Random value in range [min, max]

### Weighted Random Selection

#### weighted_random_choice(choices) {#weighted-random-choice}

**Status:** `stable`

**Description:**
Selects a random choice based on weighted probabilities.

**Parameters:**
- `choices` (table): Table mapping choices to weights

**Returns:**
- (any): Selected choice

**Example:**
```lua
local loot_table = {
    common_item = 70,    -- 70% chance
    rare_item = 25,      -- 25% chance  
    legendary_item = 5   -- 5% chance
}
local selected = weighted_random_choice(loot_table)
```

## Data Structures

### RingBuffer Class

#### RingBuffer(maxlen) {#ringbuffer}

**Status:** `stable`

**Description:**
Circular buffer data structure with fixed maximum size.

**Constructor Parameters:**
- `maxlen` (number): Maximum buffer size (default: 10)

**Methods:**

##### RingBuffer:Add(entry) {#ringbuffer-add}

Adds an element to the buffer, overwriting oldest if full.

##### RingBuffer:Get(index) {#ringbuffer-get}

Gets element at index (1-based from start of buffer).

##### RingBuffer:Clear() {#ringbuffer-clear}

Empties the buffer.

**Example:**
```lua
local buffer = RingBuffer(3)
buffer:Add("first")
buffer:Add("second") 
buffer:Add("third")
buffer:Add("fourth") -- Overwrites "first"

local first = buffer:Get(1) -- "second"
```

### LinkedList Class

#### LinkedList() {#linkedlist}

**Status:** `stable`

**Description:**
Doubly-linked list data structure for efficient insertion/removal.

**Methods:**

##### LinkedList:Append(v) {#linkedlist-append}

Adds element to end of list.

##### LinkedList:Remove(v) {#linkedlist-remove}

Removes first occurrence of value from list.

##### LinkedList:Iterator() {#linkedlist-iterator}

Returns iterator for traversing the list.

**Example:**
```lua
local list = LinkedList()
list:Append("item1")
list:Append("item2")

local it = list:Iterator()
while it:Next() ~= nil do
    print(it:Current())
end
```

### DynamicPosition Class

#### DynamicPosition(pt, walkable_platform) {#dynamicposition}

**Status:** `stable`

**Description:**
Position that automatically follows moving walkable platforms (boats).

**Constructor Parameters:**
- `pt` (Vector3): World position
- `walkable_platform` (entity): Platform entity (optional, auto-detected)

**Methods:**

##### DynamicPosition:GetPosition() {#dynamicposition-getposition}

Returns current world position, accounting for platform movement.

**Example:**
```lua
-- Position on a boat
local boat_pos = DynamicPosition(Vector3(100, 0, 200), boat_entity)

-- Later, get updated position
local current_pos = boat_pos:GetPosition()
```

## File System Utilities

### resolvefilepath(filepath, force_path_search, search_first_path) {#resolvefilepath}

**Status:** `stable`

**Description:**
Resolves a relative file path to an absolute path by searching mod and data directories.

**Parameters:**
- `filepath` (string): Relative file path
- `force_path_search` (boolean): Force path search on console (optional)
- `search_first_path` (string): Preferred search path (optional)

**Returns:**
- (string): Absolute file path

**Example:**
```lua
local texture_path = resolvefilepath("images/inventoryimages/axe.tex")
```

### softresolvefilepath(filepath, force_path_search, search_first_path) {#softresolvefilepath}

**Status:** `stable`

**Description:**
Like resolvefilepath but returns nil instead of asserting if file not found.

## Debug and Memory Utilities

### Debugging Functions

#### PrintTable(tab) {#print-table}

**Status:** `stable`

**Description:**
Returns a formatted string representation of a table structure.

**Parameters:**
- `tab` (table): Table to print

**Returns:**
- (string): Formatted table representation

#### mem_report() {#mem-report}

**Status:** `stable`

**Description:**
Prints a memory usage report showing object counts by type.

#### DumpTableXML(t, name) {#dump-table-xml}

**Status:** `stable`

**Description:**
Converts a table to XML format for debugging.

**Parameters:**
- `t` (table): Table to convert
- `name` (string): Root element name (optional)

**Returns:**
- (string): XML representation

### Sandbox Execution

#### RunInSandbox(untrusted_code) {#run-in-sandbox}

**Status:** `stable`

**Description:**
Executes Lua code in a restricted environment for security.

**Parameters:**
- `untrusted_code` (string): Lua code to execute

**Returns:**
- (any): Execution result or error message

#### RunInSandboxSafe(untrusted_code, error_handler) {#run-in-sandbox-safe}

**Status:** `stable`

**Description:**
Safe sandbox execution with custom error handling.

## Game-Specific Utilities

### Spawn and Position Utilities

#### DebugSpawn(prefab) {#debug-spawn}

**Status:** `stable`

**Description:**
Spawns a prefab at the console cursor position for debugging.

**Parameters:**
- `prefab` (string): Prefab name to spawn

**Returns:**
- (entity): Spawned entity or nil

#### SpawnAt(prefab, loc, scale, offset) {#spawn-at}

**Status:** `stable`

**Description:**
Spawns a prefab at a specific location with optional scaling and offset.

**Parameters:**
- `prefab` (string): Prefab name
- `loc` (Vector3|entity): Position or entity to spawn at
- `scale` (Vector3|number): Scale factor (optional)
- `offset` (Vector3): Position offset (optional)

**Returns:**
- (entity): Spawned entity

#### GetClosest(target, entities) {#get-closest}

**Status:** `stable`

**Description:**
Finds the closest entity to a target from a list of entities.

**Parameters:**
- `target` (entity): Target entity
- `entities` (table): Array of entities to search

**Returns:**
- (entity): Closest entity

### Angle and Geometry

#### IsWithinAngle(position, forward, width, testPos) {#is-within-angle}

**Status:** `stable`

**Description:**
Tests if a position is within an angular cone from a source position.

**Parameters:**
- `position` (Vector3): Source position
- `forward` (Vector3): Forward direction vector
- `width` (number): Cone width in radians
- `testPos` (Vector3): Position to test

**Returns:**
- (boolean): True if position is within cone

#### GetAngleFromBoat(boat, x, z) {#get-angle-from-boat}

**Status:** `stable`

**Description:**
Calculates the angle from a boat's position to coordinates.

**Parameters:**
- `boat` (entity): Boat entity
- `x` (number): Target x coordinate
- `z` (number): Target z coordinate

**Returns:**
- (number): Angle in radians

### Boat-Specific Utilities

#### SnapToBoatEdge(inst, boat, override_pt) {#snap-to-boat-edge}

**Status:** `stable`

**Description:**
Snaps an entity to the edge of a boat's ring platform.

**Parameters:**
- `inst` (entity): Entity to snap
- `boat` (entity): Boat entity
- `override_pt` (Vector3): Override position (optional)

## Color Utilities

### HexToRGB(hex) {#hex-to-rgb}

**Status:** `stable`

**Description:**
Converts hex color code to RGB values (0-255).

**Parameters:**
- `hex` (string): Hex color code (e.g., "#FF0000")

**Returns:**
- (number, number, number): Red, green, blue values

### RGBToPercentColor(r, g, b) {#rgb-to-percent-color}

**Status:** `stable`

**Description:**
Converts RGB values to normalized 0.0-1.0 range.

**Parameters:**
- `r, g, b` (number): RGB values (0-255)

**Returns:**
- (number, number, number): Normalized RGB values

### HexToPercentColor(hex) {#hex-to-percent-color}

**Status:** `stable`

**Description:**
Converts hex color directly to normalized RGB.

**Example:**
```lua
local r, g, b = HexToPercentColor("#FF8000") -- Orange color
```

## Advanced Iteration

### orderedPairs(t) {#ordered-pairs}

**Status:** `stable`

**Description:**
Iterator that traverses table keys in alphabetical order.

**Parameters:**
- `t` (table): Table to iterate

**Returns:**
- (function): Iterator for use in for loops

**Example:**
```lua
local data = {zebra = 1, apple = 2, banana = 3}
for k, v in orderedPairs(data) do
    print(k, v) -- apple 2, banana 3, zebra 1
end
```

### sorted_pairs(t, fn) {#sorted-pairs}

**Status:** `stable`

**Description:**
Iterator with custom sorting function for keys.

**Parameters:**
- `t` (table): Table to iterate
- `fn` (function): Comparison function (optional)

**Returns:**
- (function): Iterator for use in for loops

## Controller Support Utilities

### ControllerReticle_Blink_GetPosition(player, validwalkablefn) {#controller-reticle-blink-getposition}

**Status:** `stable`

**Description:**
Calculates optimal blink target position for controller players.

**Parameters:**
- `player` (entity): Player entity
- `validwalkablefn` (function): Function to validate walkable positions

**Returns:**
- (Vector3): Target position for blink

### ControllerPlacer_Boat_SpotFinder(inst) {#controller-placer-boat-spotfinder}

**Status:** `stable`

**Description:**
Configures a placer to automatically find valid boat placement spots for controllers.

**Parameters:**
- `inst` (entity): Placer entity to configure

## Utility Constants and Helpers

### Bit Operations

#### checkbit(x, b) {#checkbit}

Tests if a bit is set in a number.

#### setbit(x, b) {#setbit}

Sets a bit in a number.

#### clearbit(x, b) {#clearbit}

Clears a bit in a number.

### Number Validation

#### isnan(x) {#isnan}

Checks if a number is NaN (Not a Number).

#### isinf(x) {#isinf}

Checks if a number is infinite.

#### isbadnumber(x) {#isbadnumber}

Checks if a number is NaN or infinite.

## Performance Considerations

### Memory Management

- Use `shallowcopy` instead of `deepcopy` when possible
- `RingBuffer` has fixed memory usage regardless of data flow
- `LinkedList` allows efficient insertion/removal without array shifting

### Function Optimization

- `distsq` avoids expensive square root calculation
- Table lookup functions use hash tables for O(1) access
- File path resolution includes memoization for repeated lookups

### Best Practices

```lua
-- Efficient random selection
local item = GetRandomItem(choices) -- O(n) but simple

-- Efficient distance comparison
if distsq(pos1, pos2) < range_sq then -- Avoid sqrt
    -- Do something
end

-- Efficient table operations
local keys = table.getkeys(data) -- Single pass
```

## Related Systems

- [**Class**](./class.md): Object-oriented programming utilities
- [**EntityScript**](./entityscript.md): Entity management functions
- [**Main Functions**](./mainfunctions.md): Core game initialization
- [**Debug Tools**](./debugtools.md): Development and debugging utilities

## Migration Notes

When updating code that uses utility functions:

- Check for deprecated table manipulation patterns
- Verify file path resolution works with new mod structures  
- Test sandbox execution with updated security policies
- Validate data structure performance with larger datasets

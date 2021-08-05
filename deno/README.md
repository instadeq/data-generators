# Deno Data Generators

## Sales

### Usage

```sh
# Arguments
deno run ./sales.js <format> [<count> [<url>]]

# Generate 10 JSON values and print them to standard output
deno run ./sales.js json

# Generate 42 JSON values and print them to standard output
deno run ./sales.js json 42

# Generate 42 JSON values and send them to $URL
deno run ./sales.js json 42 $URL
```

### Valid Form Arguments

- csv
- json (equivalent to json-table-array-of-objects)
- json-table (equivalent to json-table-object-keys)
- json-table-array-of-objects
- json-table-object-keys
- json-table-object-cols
- json-table-array
- json-table-array-no-headers
- json-table-array-of-pairs

### JSON Table Formats

```sh
deno run ./sales.js json-table-array-of-objects 2
deno run ./sales.js json-table-object-keys 2
deno run ./sales.js json-table-object-cols 2
deno run ./sales.js json-table-array 2
deno run ./sales.js json-table-array-no-headers 2
deno run ./sales.js json-table-array-of-pairs 2
```

### Sending Generated Data to a WebHook Using Curl

[curl](https://curl.se/) is a command line tool to do HTTP requests

```sh
export GEN_COUNT=100
export HOOK_URL=CHANGE_ME_TO_A_HOOK_URL
deno run ./sales.js json-table-array-of-objects $GEN_COUNT | curl $HOOK_URL --data-binary @-
deno run ./sales.js json-table-object-keys $GEN_COUNT | curl $HOOK_URL --data-binary @-
deno run ./sales.js json-table-object-cols $GEN_COUNT | curl $HOOK_URL --data-binary @-
deno run ./sales.js json-table-array $GEN_COUNT | curl $HOOK_URL --data-binary @-
deno run ./sales.js json-table-array-no-headers $GEN_COUNT | curl $HOOK_URL --data-binary @-
deno run ./sales.js json-table-array-of-pairs $GEN_COUNT | curl $HOOK_URL --data-binary @-
```

### Sending Generated Data to a WebHook Using Fetch

```sh
export GEN_COUNT=100
export HOOK_URL=CHANGE_ME_TO_A_HOOK_URL
deno run --allow-net ./sales.js json-table-array-of-objects $GEN_COUNT $HOOK_URL
deno run --allow-net ./sales.js json-table-object-keys $GEN_COUNT $HOOK_URL
deno run --allow-net ./sales.js json-table-object-cols $GEN_COUNT $HOOK_URL
deno run --allow-net ./sales.js json-table-array $GEN_COUNT $HOOK_URL
deno run --allow-net ./sales.js json-table-array-no-headers $GEN_COUNT $HOOK_URL
deno run --allow-net ./sales.js json-table-array-of-pairs $GEN_COUNT $HOOK_URL
```


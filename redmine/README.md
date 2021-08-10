# Redmine Issue Fetcher

Fetches issues from a Redmine instance using the JSON REST API.

## Usage

```sh
./redmine_issue_fetcher.py --help
```

```
usage: redmine_issue_fetcher.py [-h] [-l LIMIT] [-m MAX_ISSUES] [-o PATH] [-p] URL

Fetch Redmine Issues

positional arguments:
  URL                   Base url, for example https://www.redmine.org/ or
                        https://www.redmine.org/projects/redmine/

optional arguments:
  -h, --help            show this help message and exit
  -l LIMIT, --limit LIMIT
                        Issues to fetch per request, check instance maximum, default: 100
  -m MAX_ISSUES, --max-issues MAX_ISSUES
                        Max number of total issues to fetch, fetch all if not set
  -o PATH, --output PATH
                        Path to write output too, prints to stdout if not set
  -p, --pretty          Pretty JSON output if set
```

## Examples


```sh
# Fetch last 100 issues from myredmine.org in batches of 25, store the result in last_100_issues.json
./redmine_issue_fetcher.py -l 25 -m 100 -o last_100_issues.json https://www.myredmine.org/

# Fetch all issues from myredmine.org in batches of 100, store the result in all_issues.json
./redmine_issue_fetcher.py -o all_issues.json https://www.myredmine.org/

# Fetch all issues from myredmine.org in batches of 100, print the result to stdout
./redmine_issue_fetcher.py https://www.myredmine.org/
```

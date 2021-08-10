#!/usr/bin/env python3
"""Fetches issues from a Redmine instance using the JSON REST API"""

import sys
import math
import json
import argparse
import urllib.request

def http_get_json_and_status(url):
    """HTTP GET url, return status and parsed body if possible, None otherwise"""
    resp = urllib.request.urlopen(url)
    status = resp.status
    if status == 200:
        raw_body = resp.read()
        try:
            body = json.loads(raw_body)
            return (True, status, body)
        except json.decoder.JSONDecodeError:
            return (False, status, None)
    else:
        return (False, status, None)

URL_HELP = 'Base url, for example https://www.redmine.org/ or ' \
    'https://www.redmine.org/projects/redmine/'

def parse_cli_args(raw_args):
    """parse CLI args from raw_args"""
    parser = argparse.ArgumentParser(description='Fetch Redmine Issues')
    parser.add_argument('url', metavar='URL', help=URL_HELP)
    parser.add_argument('-l', '--limit', metavar='LIMIT', type=int, default=100,
                        help='Issues to fetch per request, check instance maximum, default: 100')
    parser.add_argument('-m', '--max-issues', metavar='MAX_ISSUES', type=int, default=math.inf,
			help='Max number of total issues to fetch, fetch all if not set')

    parser.add_argument('-o', '--output', metavar='PATH', default=None,
                        help='Path to write output too, prints to stdout if not set')

    parser.add_argument('-p', '--pretty', action='store_true', help='Pretty JSON output if set')

    return parser.parse_args(raw_args)

def maybe_add_slash_suffix(value):
    """add slash at the end if not already there"""
    return value if value.endswith('/') else value + '/'

def format_redmine_issue_url(url, limit=100, page=1):
    """create Redmine REST URL to fetch issues with limit and pagination"""
    return f"{maybe_add_slash_suffix(url)}issues.json?limit={limit}&page={page}"

def fetch_issues(base_url, limit=100, max_issues=math.inf):
    """fetch issues *limit* at a time until *max_issues* or empty result"""
    issues = []
    finished = False
    page = 1

    while not finished:
        page_url = format_redmine_issue_url(base_url, limit, page)
        (is_ok, status, body) = http_get_json_and_status(page_url)
        print(is_ok, status, page_url)

        if is_ok:
            cur_issues = body.get('issues', [])
            if cur_issues:
                issues.extend(cur_issues)

                if len(issues) >= max_issues:
                    finished = True
            else:
                finished = True
        else:
            finished = True

        page += 1

    return issues

def write_issues_to(issues, path, is_pretty):
    """write issue list as JSON to path (stdout if no path), indent if is_pretty is True"""
    indent = 2 if is_pretty else None
    # uses same format
    content = json.dumps({"issues": issues, "total_count": len(issues)}, indent=indent)
    if path:
        with open(path, 'wb') as handle:
            handle.write(content.encode('utf-8'))
    else:
        print(content)

def main(raw_args):
    """CLI entry point"""
    args = parse_cli_args(raw_args)
    issues = fetch_issues(args.url, args.limit, args.max_issues)
    write_issues_to(issues, args.output, args.pretty)

if __name__ == "__main__":
    main(sys.argv[1:])

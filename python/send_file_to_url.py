#!/usr/bin/env python3
"""script to send data from a file to an HTTP server with a POST request"""

import sys
import urllib.request

def send(url, body):
    "HTTP POST url body"
    req = urllib.request.Request(url, data=body)
    return urllib.request.urlopen(req)

def main(args):
    """
        CLI entry point
        Usage: send_file_to_url.py url [data]
    """
    if len(args) < 1:
        print("Usage: send_file_to_url.py url [data]")
        print("\t if data is not specified it will read from stdin")
    else:
        url = args[0]
        if len(args) == 1:
            data = sys.stdin.read()
        else:
            file_path = args[1]
            with open(file_path, "rb") as handle:
                data = handle.read()

        response = send(url, data)
        print(response.status)
        print(response.read())

if __name__ == "__main__":
    main(sys.argv[1:])

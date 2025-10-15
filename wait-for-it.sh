#!/usr/bin/env bash
# wait-for-it.sh — wait for a host:port to become available

host="$1"
shift
cmd="$@"

until nc -z "$host" 3306; do
  echo "Waiting for MySQL at $host:3306..."
  sleep 2
done

echo "MySQL is up! Starting app..."
exec $cmd

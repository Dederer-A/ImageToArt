# Nginx Configuration for Update Service

This guide covers configuring Nginx to support the ImageToArt application update check (`UpdateService.ts`), ensuring correct MIME types, structured logging of version parameters, and log analysis approaches.

---

## 1. Correct JSON Content-Type and Caching

To ensure all `.json` files are served with `application/json` and `utf-8` charset, and configured with cache control headers to prevent stale version checks:

```nginx
location ~* \.json$ {
    default_type application/json;
    charset utf-8;
    add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate";
}
```

---

## 2. Dedicated Structured JSON Logging for `latest_version.json`

To log all requests to `latest_version.json` into a separate log file in structured JSON format (capturing client IP, timestamp, user agent, and parsed query parameter `?version`), define a custom log format in the `http` context of your `nginx.conf`:

```nginx
http {
    # Define JSON log format including $arg_version
    log_format version_check_json escape=json
      '{"time":"$time_iso8601",'
      '"client_ip":"$remote_addr",'
      '"x_forwarded_for":"$http_x_forwarded_for",'
      '"request_method":"$request_method",'
      '"uri":"$uri",'
      '"app_version":"$arg_version",'
      '"status":$status,'
      '"body_bytes_sent":$body_bytes_sent,'
      '"request_time":$request_time,'
      '"user_agent":"$http_user_agent",'
      '"referer":"$http_referer"}';

    # ... other http configurations ...
}
```

---

## 3. Complete Nginx Server Block Example

```nginx
server {
    listen 443 ssl;
    server_name imagetoart.example.com;

    root /var/www/imagetoart;
    index index.html;

    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    # General rule for all .json files
    location ~* \.json$ {
        default_type application/json;
        charset utf-8;
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate";
    }

    # Dedicated block for latest_version.json with custom separate access log
    # Note: In Nginx, defining 'access_log' inside a location block overrides 
    # the server-level access log for this location. Therefore, requests to 
    # /latest_version.json go ONLY to latest_version_access.log and will NOT 
    # be duplicated in the main domain access log.
    location = /latest_version.json {
        default_type application/json;
        charset utf-8;
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate";
        
        access_log /var/log/nginx/latest_version_access.log version_check_json;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 4. Log Analysis & Statistics

### Option A: Python Analysis Script
Since logs are stored in JSON format, a lightweight Python script can easily parse requests, analyze app version distribution, and count unique active clients per day.

```python
import json
from collections import Counter, defaultdict

log_file = "/var/log/nginx/latest_version_access.log"

version_counts = Counter()
daily_checks = defaultdict(set)

with open(log_file, "r") as f:
    for line in f:
        try:
            data = json.loads(line.strip())
            app_version = data.get("app_version", "unknown")
            client_ip = data.get("client_ip")
            date = data.get("time", "")[:10]  # YYYY-MM-DD

            version_counts[app_version] += 1
            if client_ip:
                daily_checks[date].add(client_ip)
        except json.JSONDecodeError:
            continue

print("Requests by App Version:", dict(version_counts))
print(
    "Unique Users per Day:",
    {date: len(ips) for date, ips in daily_checks.items()},
)
```

### Option B: GoAccess
[GoAccess](https://goaccess.io/) can be used for real-time console or HTML reports from web server logs.

# Browsers storage options

Possibilities and limitations of different storage options used by major browsers.

Any described limitations, persistency and access restrictions can wary based on browser, user settings and environment.

## Local storage

Local key-value store used to store small data. Is accessible from scripts under same 
domain. Data persists between sessions and browser exits.

<table>
    <tr><td>Structure</td><td>Key (string) - Value (string) store</td></tr>
    <tr><td>Persistency</td><td>Persistent</td></tr>
    <tr><td>Limitations</td><td><ul>
        <li>5 MiB total</li>
        <li>Synchronous (blocks main thread)</li>
    </ul></td></tr>
    <tr><td>Access</td><td>Scripts from any page under the same domain</td></tr>
    <tr><td>Security</td><td>None</td></tr>
</table>

## Session storage

Local key-value store used to store small data. Is accessible from scripts under same domain. Data persists between same session until all windows are closed or browser exits.

<table>
    <tr><td>Structure</td><td>Key (string) - Value (string) store</td></tr>
    <tr><td>Persistency</td><td>Current session</td></tr>
    <tr><td>Limitations</td><td><ul>
        <li>5 MiB total</li>
        <li>Synchronous (blocks main thread)</li>
    </ul></td></tr>
    <tr><td>Access</td><td>Scripts from any page under the same domain</td></tr>
    <tr><td>Security</td><td>None</td></tr>
</table>

## Cookies

Local key-value store used to store tokens and settings, that are sent to server with each request (based on path). They can be accessed from scripts under same domain, or locked only for server. They are persistent between sessions and browser exits.

<table>
    <tr><td>Structure</td><td>Key (string) - Value (string) store</td></tr>
    <tr><td>Persistency</td><td>Persistent</td></tr>
    <tr><td>Limitations</td><td><ul>
        <li>4 KiB per cookie</li>
        <li>20 cookies per site</li>
        <li>Synchronous (blocks main thread)</li>
    </ul></td></tr>
    <tr><td>Access</td><td><ul>
        <li>Scripts from any page under the same domain (unless HttpOnly)</li>
        <li>Server from request</li>
    </ul></td></tr>
    <tr><td>Security</td><td><ul>
        <li>Varies based on cookie options</li>
        <li>Encrypted (cookies are stored encrypted in file system)</li>
    </ul></td></tr>
</table>

## IndexedDB

Local key-value store used to store large data. Is accessible from scripts under same domain. Data can be persistent or for session only.

<table>
    <tr><td>Structure</td><td>Database (string) > Store (string) > Index (string) > Key (object) - Value (object) store</td></tr>
    <tr><td>Persistency</td><td>Current session (default) or Persistent</td></tr>
    <tr><td>Limitations</td><td><ul>
        <li>2 GiB total (theroretical)</li>
        <li>Asynchronous</li>
    </ul></td></tr>
    <tr><td>Access</td><td>Scripts from any page under the same domain</td></tr>
    <tr><td>Security</td><td>None</td></tr>
</table>

## Web SQL

SQLite like database implementation, that can be used from browser. Is accessible from scripts under same domain. Data can be persistent or for session only.

**No longer developed by W3C.**

<table>
    <tr><td>Structure</td><td>Database (string) > Table (string) > Items (rows and columns)</td></tr>
    <tr><td>Persistency</td><td>Current session (default) or Persistent</td></tr>
    <tr><td>Limitations</td><td><ul>
        <li>5 MiB, more requires user confirmation</li>
        <li>Asynchronous</li>
    </ul></td></tr>
    <tr><td>Access</td><td>Scripts from any page under the same domain</td></tr>
    <tr><td>Security</td><td>None</td></tr>
</table>

## Web worker

Script that runs in background. Can also be used as in-memory store or proxy to server, that stores data.
Can be accessed from scripts using messaging. Based on configuration can either be limited to caller script or for multiple on same domain.

<table>
    <tr><td>Structure</td><td>Any</td></tr>
    <tr><td>Persistency</td><td>Current session, can use IndexedDB or other method to persist data</td></tr>
    <tr><td>Limitations</td><td><ul>
        <li>V8 limits</li>
        <li>Asynchronous</li>
    </ul></td></tr>
    <tr><td>Access</td><td>Scripts using messaging under the same domain</td></tr>
    <tr><td>Security</td><td>Depends on worker implementation</td></tr>
</table>

## Url

Local string used to navigate between pages and store filter data. Is accessible from anywhere. Url data are persistent as long as same url is used.

<table>
    <tr><td>Structure</td><td>scheme://authority/path?query#fragment (<a href="https://datatracker.ietf.org/doc/html/rfc3986" target="_blank">rfc3986</a>)</td></tr>
    <tr><td>Persistency</td><td>Current url</td></tr>
    <tr><td>Limitations</td><td>4 KiB (longer urls are not recommended)</td></tr>
    <tr><td>Access</td><td>Yes</td></tr>
    <tr><td>Security</td><td>None</td></tr>
</table>
Management Console Web Application
==================================

The web-server, located under `Server_Code`, requires a relatively recent version of Node.js installed, as well as the packages listed in `Server_Code/package.json`.

Use a version of Node.js either built from source, EG
```bash
git clone git://github.com/joyent/node.git
cd node
./configure
make
sudo make install
```

or else download a packaged version from http://nodejs.org/

*IMPORTANT* The version of Node.js currently shipping from the Ubuntu package repositories (and likely other Debian repositories) is fairly out of date and fails to run server.js. Additionally, Ubuntu gives `node` a nonstandard name which causes some other problems. If you're using a Debian-based distribution, absolutely do not install Node.js from a package repository!

Once Node.js is installed on your system, install the packages required by the webserver like so:
```bash
cd Server_Code
npm install
```

Finally, the web-server can be started up like so:
```bash
cd Server_Code
node server.js
```

And to test the website, by default, you can open `http://0.0.0.0:8081` in your favourite web-browser. **However**, for some reason Opera does not figure out that the server is bound to 0.0.0.0, but does seem to accept `http://localhost:8081` instead.

---

###Authors
- Caitlin Potter <snowball@defpixel.com>
- Name / Email (Git commit IDs) -- Maybe this list should only include people who have put work into the web server -- Add names as work goes into it
- Same here
- Same here
- Same here

---

###License
This would be a good thing to write a note of here... But we can worry about that later.

The web application might not have exactly the same license terms as the project as a whole, are my thoughts here.

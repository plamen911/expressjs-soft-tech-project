# Express.js Development - октомври 2016

    Architecture and Authentication Exercises

[Express.js Development - Architecture and Authentication - октомври 2016](https://youtu.be/Pe3oDDghcic)

### Problem 1. Start the blog system from scratch

Start the blog system from scratch by building the architecture following the presentation slides.

###Problem 2. Add Article routes

Add article model (title, description, etc.) and add these routes:

- `/article/add` – creates new article – should be for authenticated users only
- `/article/list` – lists all articles – for all users, add paging and sorting using query string
- `/article/details/:id` – shows article details – only for authenticated users
- `/article/edit/:id` – allows editing of the article – only for the article creator

###Problem 3. Add Administration

Add full CRUD on the articles only for administrators, articles should be able to be listed, created, edited, and deleted without any restrictions.

###Problem 4. Sky is the limit

Add functionality to the blog as you see fit – you may add statistics, image uploads, comments, nice design, etc. If you want you can even change the system – instead of articles, use something else – cats, for example!

###Other

- http://blog.joeandrieu.com/2013/10/16/how-to-conditionally-display-variables-with-ejs/
- `sudo n latest` - update to the latest Node.js version on a Mac
- `sudo n 6.2.2` - downgrade Node.js version to v.6.2.2
- `nvm install 6.2.2`- managing Node.js versions with nvm
- `nvm ls` - check out what versions of Node.js are installed
- `nvm uninstall 0.10` - 
- `npm install mongodb --save --save-exact`
- `node -v`
- `nvm install 6.2.0`
- `nvm ls`
- `nvm ls-remote`
- `nvm use 6.2`
- `nvm alias default=6.2`

`mkdir ~/.nvm`

Add the following to `~/.bash_profile` or your desired shell
configuration file:

`export NVM_DIR="$HOME/.nvm"`
`. "/usr/local/opt/nvm/nvm.sh"`

You can set `$NVM_DIR` to any location, but leaving it unchanged from
`/usr/local/Cellar/nvm/0.32.1` will destroy any nvm-installed Node installations
upon upgrade/reinstall.

#### Deployment on heroku

- `heroku login`
- `heroku create plamen911rentalapp`
- `heroku config:set NODE_ENV=production`
- `git push heroku master`
- `heroku open`
- `heroku logs --tail` - your logs


https://plamen911rentalapp.herokuapp.com/ | https://git.heroku.com/plamen911rentalapp.git

#### Deployment on DigitalOcean

- `sudo nano /etc/nginx/sites-available/default`
- `systemctl restart nginx`
- `vi /etc/nginx/nginx.conf`
- `pm2 list`
- `http://138.68.111.47/user/login`
- `sudo apt-get install imagemagick`

https://www.digitalocean.com/community/tutorials/how-to-install-node-js-with-nvm-node-version-manager-on-a-vps#installation

https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04#install-nodejs

https://www.cyberciti.biz/faq/linux-unix-bsd-nginx-413-request-entity-too-large/



#### Resources
- https://www.sitepoint.com/how-to-create-a-node-js-cluster-for-speeding-up-your-apps/
- https://github.com/expressjs/node-multiparty
- https://nodejs.org/dist/latest-v6.x/docs/api/zlib.html#zlib_compressing_http_requests_and_responses
- https://gtmetrix.com/
- https://www.heroku.com/
- http://toolkit.herokuapp.com/
- https://github.com/vanng822/pagination






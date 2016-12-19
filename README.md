# Practical Project Assignment for the Software Technologies Course @ SoftUni

Design and implement a simple Web-based application, e.g. blog / forum / photo album / listings site / other.

Project live URL: http://138.68.111.47

### Technologies by Choice

Use are free to choose the technology stack for your project development, e.g.

- JavaScript + Express.js + MongoDB
- PHP + Symfony + MySQL
- C# + ASP.NET MVC + Entity Framework + SQL Server
- Java + Spring MVC + Hibernate + MySQL

You are allowed to use in addition other technologies like Bootstrap, SASS, LESS, MongoDB, Node.js, etc. You are allowed to use frameworks like AngularJS, ReactJS, Laravel, Symfony, Nancy, Spark, Play, JSF, etc. You are allowed to use development tools, libraries and resources like Web design templates, code generators, code libraries, JavaScript libraries, PHP composer packages, .NET NuGet packages, Java Maven artefacts and others.

### Team by Choice

You are allowed to work in a team by choice or to work individually.

Requirements for the team projects:
- All team members should be part of the “Software Technologies” course at SoftUni.
- Onsite and online students can work together (mixed teams).
- Teams can have up to 6 members.
- All team members should use source control repository (like GitHub).
- Larger teams should develop larger projects (see below).

Requirements for individual projects:
- Students are allowed to work alone without a team.
- Individuals should use source control repository (like GitHub).

Everyone should use a source control system.
- Use Git or other source control system for your project development.
- Use GitHub, Bitbucket, CodePlex or other team collaboration platform.
- Your source code should be open-source and public in Internet.

### Project Scope

Your project should implement at least the following functionality:
- User registration, login and logout.
- View some content (e.g. blog articles, listings, photos, issues, publications).
- Create new content (e.g. post new blog article, post new listing, upload new photo, create new issue).

Your project should keep its data in a database or in a backend service:
- Use at least 2 tables (collections) with a relationship, e.g. users and blog posts.
- Use a database (like MySQL or MongoDB) or cloud-based backend (like Kinvey, MongoLab or RedisLab).

Your project should implement at least 4 pages (views).
You are allowed to create a project which is very similar to the “Blog System” developed during the course. You are allowed even to take the Blog System source code and modify it for your needs.

### Requirements for the Individual Projects

Individual projects can be small, like the “Blog System” developed during the course.
- Minimum 4 pages (views) and 2 database tables.
- Implement user registration, login, view content, create content.
- Optionally implement more functionality.

### Requirements for the Team Projects

Larger teams should develop larger projects. The minimum number of application pages and database tables required for the project depend on the count of team members.
- Minimum (3 + team_members_count) pages (views).
- Minimum team_members_count database tables (or data collections / entities).
- Implement user registration, login, view content, create content.
- Implement more functionality by choice. Larger teams should implement more functionality.

### Forbidden Techniques and Tools

- Your project should be created mainly by you and your team.
- You are not allowed to copy a project from Internet and present it as your development.
- You can use external libraries, frameworks and tools, but not to clone a project and present it as yours.

### Commit Logs

- Each team member should have at least 5 commits (changes) in the project repository.
- Please commit every day during the project development to demonstrate your work progress.
- More commits (especially in more than the last 1-2 days) are better during the project assessment.

### Deliverables

Submit the URL of your project source code as deliverable, e.g. `https://github.com/nakov/TurtleGraphics.NET`. Each team member submits the same source code URL. Put the following assets in the project repository:
- The complete source code of your project (PHP, Java, C#, JS, HTML, CSS, images, scripts and other files).
- Any other project assets (optionally): documentation, design, database sample data scripts, tests, etc.
- Don’t commit the libraries that can be automatically downloaded by the package manager (npm packages, composer packages, NuGet packages, maven packages).

### Public Project Defense

Each team will have to deliver a public defense of its work in front of the SoftUni trainers.
The teams will have only ~15 minutes for the following:
- Demonstrate the application’s functionality (very shortly).
- Show the source code and explain briefly how it works.

At least one team member should come at the defense.
Hints for better presentation:
- Be well prepared for presenting maximum of your work for minimum time.
- Open all project assets beforehand to save time: open your site in the browser, login and open the user / admin panel in another browser, open your GitHub project page to show the commit logs, etc.
- Test how to connect your laptop with the multimedia projector before the defense to save time.

### Assessment Criteria

Functionality – 0...70
- What is implemented? Does it work correctly? Does it have intuitive UI?
- How much effort you have put in this project?
- Is the functionality enough for the team size (larger teams should deliver more)?
- What portion of the work is own code written by your team and what is ready-to-use framework?

Teamwork – 0...30
- Individual projects show the commit logs in the source control repository.
- Team projects show the commit logs and explain the role of each team member.

Bonus – 0...30
- Bonus point are given for implementing more than expected.

### Deadline

All projects should be submitted not later than 22-December-2016.

### Other

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
- `pm2 start app.js --name SimpleRentalApp`
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






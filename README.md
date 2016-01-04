Super Mario Maker Client
========================

A client for fetching and bookmarking Super Mario Maker courses.

Description
-----------

Super Mario Maker Client will fetch course data from the Super Mario Maker
bookmark portal site.  (https://supermariomakerbookmark.nintendo.net)  It will
also allow you to use your Nintendo Network ID and password to log in and
bookmark courses to play immediately in game on your Wii U console.

Future planned features for Super Mario Maker Client include searching for
courses, viewing rankings, and anything else you can do from the Super Mario
Maker bookmark portal site.

Note: The Super Mario Maker bookmark portal site does not provide a convenient
data API for retrieving this data so Super Mario Maker Client must consume the
same HTML that is presented to web browsers.  Super Mario Maker Client's
functionality could break if and when Nintendo makes changes to the Super Mario
Maker bookmark portal site.

Fetching Course Data
--------------------

If all you want is course data, begin by importing the `fetchCourse` function:

```js
import {
    fetchCourse
} from 'super-mario-maker-client';
```

The `fetchCourse` function accepts two arguments:
* `courseId`: A 16-digit course id including hyphens
* `callbackFunction`: A function that accepts two arguments:
    * `error`: Either an `Error` instance or `null`
    * `course`: Either a course object or `undefined` if an error occurred

```js
fetchCourse(courseId, (error, course) => {
    if (error) {
        // handle error
        return;
    }

    // consume course data
});
```

The course object will contain all of the data that could be found in the HTML.
It may contain any or all of the following properties:
* `attempts`: The number of attempts that have been made on this course
* `cleardBy`: An array of players that have cleared this course
* `cleared`: This will be `true` if the logged in user has cleared this course
* `clearRate`: The clear rate as a number from `0` to `100`
* `clears`: The number of clears on this course
* `courseId`: The course id
* `createdAt`: A string indicating when the course was created.  It may be a
    date like `11/29/2015` or a relative time like `7 days ago`.
* `creator`: The player that created this course
* `csrfToken`: This is an authentication token that is required to bookmark the
    course.  It will be different every time.
* `difficulty`: The difficulty of this course.  It will be one of `easy`,
    `normal`, `expert`, or `superExpert`.
* `firstClearBy`: The player who first cleared this course
* `gameStyle`: The game style used by this course.  It will be one of
    `superMarioBros`, `superMarioBros3`, `superMarioWorld`, or
    `newSuperMarioBrosU`.
* `imageUrl`: The URL of this course's image
* `miiversePostUrl`: The URL of this course's Miiverse post
* `players`: The number of players who have played this course
* `recentPlayers`: An array of players who have played this course
* `starredBy`: An array of players who have starred this course
* `stars`: The number of stars on this course
* `tag`: This course's tag
* `thumbnailUrl`: The URL of this course's thumbnail
* `title`: The title of this course
* `tweets`: The number of times this course has been shared on Twitter
* `uploadDate`: A `Date` object for when this course was uploaded.  If
    `createdAt` is a date string, that date will be used and the time will be
    set to midnight in your local timezone.  If `createdAt` is a relative time,
    that amount of time will be subtracted from now.
* `yourBestTime`: The fastest time that the logged in user cleared this course.
    This is measured in milliseconds.
* `worldRecord`: The world record for this course.

Each player object may contain any or all of the following properties:
* `country`: Abbreviation of the player's country
* `medals`: The number of medals the player has been awarded.  This is usually
    only set for the course creator.
* `miiIconUrl`: The URL of this player's mii icon
* `miiName`: The name of this player's mii

The worldRecord object may contain any or all of the following properties:
* `player`: The player who holds the world record for this course.
* `time`: The world record time.  This is measured in milliseconds.

Logging In
----------

In order to access all the features of Super Mario Maker Client, you will need
to log in with your Nintendo Network ID and password.  Begin by importing the
`logIn` function:

```js
import {
    logIn
} from 'super-mario-maker-client';
```

The `logIn` function accepts two arguments:
* `config`: A configuration object with the following properties:
    * `password`: Your Nintendo Network password
    * `username`: Your Nintendo Network ID
* `callbackFunction`: A function that accepts two arguments:
    * `error`: Either an `Error` instance or `null`
    * `superMarioMakerClient`: Either a Super Mario Maker Client instance or
        `undefined` if an error occurred

Once you have an instance of Super Mario Maker Client, you may call methods such
as `fetchCourse`, `bookmarkCourse`, or `logOut`.

The `fetchCourse` method works exactly the same as the `fetchCourse` function
described above.

The `bookmarkCourse` method accepts two arguments:
* `config`: A configuration object with the following properties:
    * `courseId`: The course id to bookmark
    * `csrfToken`: The CSRF token assigned to the course
* `callbackFunction`: A function that accepts one argument:
    * `error`: Either an `Error` instance or `null`

The `logOut` method immediately destroys the client's session state.  The
session may remain active on the server for some time.  There are no arguments.

```js
logIn({
    password: 'nintendoNetworkPassword',
    username: 'nintendoNetworkId'
}, (error, superMarioMakerClient) => {
    if (error) {
        // handle error
        return;
    }

    superMarioMakerClient.fetchCourse(courseId, (error, course) => {
        if (error) {
            // handle error
            return;
        }

        superMarioMakerClient.bookmarkCourse(course, error => {
            if (error) {
                // handle error
                return;
            }

            superMarioMakerClient.logOut();
        });
    });
});
```

Note: Super Mario Maker Client is restricted to sending one request at a time.
Calling the `bookmarkCourse`, `fetchCourse`, or `logIn` methods many times at
once will cause the requests to be queued up.

Advanced Usage
--------------

If needed, you can create an instance of Super Mario Maker Client directly.
Begin by importing `SuperMarioMakerClient`:

```js
import SuperMarioMakerClient from 'super-mario-maker-client';
```

It will work the same either way if `SuperMarioMakerClient` is called as a
constructor function with the new keyword or as a factory function without the
new keyword.  The function accepts on optional configuration object as the only
argument with the following optional properties:
* `csrfTokenHeaderName`: Defaults to `X-CSRF-Token`
* `gameStyles`: Defaults to `{
    sb: 'superMarioBros',
    sb3: 'superMarioBros3',
    sbu: 'newSuperMarioBrosU',
    sw: 'superMarioWorld'
}`
* `lang`: Defaults to `en-US`
* `sessionCookieName`: Defaults to `_supermariomakerbookmark_session`
* `superMarioMakerAuthUrl`: Defaults to
    `https://supermariomakerbookmark.nintendo.net/users/auth/nintendo`
* `superMarioMakerBookmarkUrl`: Defaults to
    `https://supermariomakerbookmark.nintendo.net`

Note: Changing these configurations is not recommended.

Once an instance is created, the `bookmarkCourse`, `fetchCourse`, `logIn`, and
`logOut` methods will work as described above with one exception: The `logIn`
method will not return the instance to the callback function.  There is also a
read-only Boolean property `isLoggedIn`.

Development
-----------

https://github.com/solmsted/super-mario-maker-client

The `master` branch will always point to the current stable release.  Every
release will be tagged by version.  The `develop` branch will contain all new
commits between releases.  Pull requests should be based from and sent to the
`develop` branch.

Note: Due to an npm issue (https://github.com/npm/npm/issues/10074), the
`in-publish` module is required to prevent npm from doing unnecessary work when
running `npm install` locally for this package.  This causes npm to always log
errors and return a failure status when running `npm install` locally, even
though the install process probably completed without error.

Several extra npm scripts are set up for convenience:
* `npm run build`: generate the lib directory
* `npm run doc`: generate the doc directory
* `npm run lint`: run eslint on the source code and tests

Running unit tests requires three environment variables to be set:

    COURSE_ID=0000-0000-0000-0000 PASSWORD=nintendoNetworkPassword USERNAME=nintendoNetworkId npm test --coverage

License
-------

Copyright (c) 2015 Steven Olmsted <steven.olm@gmail.com>

This software is provided "as is", without any express or implied warranties,
including but not limited to the implied warranties of merchantability and
fitness for a particular purpose.  In no event will the authors or contributors
be held liable for any direct, indirect, incidental, special, exemplary, or
consequential damages however caused and on any theory of liability, whether in
contract, strict liability, or tort (including negligence or otherwise), arising
in any way out of the use of this software, even if advised of the possibility
of such damage.

Permission is granted to anyone to use this software for any purpose, including
commercial applications, and to alter and distribute it freely in any form,
provided that the following conditions are met:

1. The origin of this software must not be misrepresented; you must not claim
   that you wrote the original software.  If you use this software in a product,
   an acknowledgment in the product documentation would be appreciated but is
   not required.

2. Altered source versions may not be misrepresented as being the original
   software, and neither the name of Steven Olmsted nor the names of authors or
   contributors may be used to endorse or promote products derived from this
   software without specific prior written permission.

3. This notice must be included, unaltered, with any source distribution.

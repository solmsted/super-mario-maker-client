/**
@module super-mario-maker-client
@author Steven Olmsted <steven.olm@gmail.com>
*/

/**
@callback CourseCallback
@arg {Error} error
@arg {Object} course
*/

/**
@callback ErrorCallback
@arg {Error} error
*/

/**
@callback IncomingMessageCallback
@arg {Error} error
@arg {IncomingMessage} response
*/

/**
@callback SuperMarioMakerClientCallback
@arg {Error} error
@arg {SuperMarioMakerClient} superMarioMakerClient
*/

import {
    Parser as _HttpParser
} from 'htmlparser2';

import {
    parse as _parseUrl
} from 'url';

import {
    request as _request
} from 'https';

import {
    stringify as _stringifyQuery
} from 'querystring';

/**
@class SuperMarioMakerClient
@arg {Object} [config]
@arg {String} [config.csrfTokenHeaderName='X-CSRF-Token']
@arg {Object} [config.gameStyles={sb: 'superMarioBros',sb3: 'superMarioBros3',sbu: 'newSuperMarioBrosU',sw: 'superMarioWorld'}]
@arg {String} [config.lang='en-US']
@arg {String} [config.sessionCookieName='_supermariomakerbookmark_session']
@arg {String} [config.superMarioMakerAuthUrl='https://supermariomakerbookmark.nintendo.net/users/auth/nintendo']
@arg {String} [config.superMarioMakerBookmarkUrl='https://supermariomakerbookmark.nintendo.net']
*/
const _SuperMarioMakerClient = function () {
        return this ? typeof this._init === 'function' ? Reflect.apply(this._init, this, arguments) : this : new _SuperMarioMakerClient();
    },

    /**
    @function fetchCourse
    @arg {String} courseId
    @arg {CourseCallback} callbackFunction
    */
    _fetchCourse = function () {
        Reflect.apply(_SuperMarioMakerClient.prototype.fetchCourse, _SuperMarioMakerClient(), arguments);
    },

    /**
    @function logIn
    @arg {Object} config
    @arg {String} config.password
    @arg {String} config.username
    @arg {SuperMarioMakerClientCallback} callbackFunction
    */
    _logIn = function (config, callbackFunction) {
        const superMarioMakerClient = _SuperMarioMakerClient().logIn(config, error => {
            if (error) {
                callbackFunction(error);
            } else {
                callbackFunction(null, superMarioMakerClient);
            }
        });
    },

    _prototype = {
        /**
        @method module:super-mario-maker-client~SuperMarioMakerClient#bookmarkCourse
        @arg {Object} config
        @arg {String} config.courseId
        @arg {String} config.csrfToken
        @arg {ErrorCallback} callbackFunction
        @instance
        @returns {this}
        */
        bookmarkCourse ({
            courseId,
            csrfToken
        }, callbackFunction) {
            if (!this._isLoggedIn) {
                setImmediate(callbackFunction, new Error('Not logged in.'));
                return this;
            }

            return this._request({
                options: {
                    headers: {
                        [this._csrfTokenHeaderName]: csrfToken
                    },
                    method: 'POST'
                },
                url: this._getCourseBookmarkUrl(courseId)
            }, (error, response) => {
                if (error) {
                    callbackFunction(error);
                } else if (response.statusCode === 200) {
                    callbackFunction();
                } else {
                    callbackFunction(new Error('Failed to bookmark course.'));
                }
            });
        },
        /**
        @method module:super-mario-maker-client~SuperMarioMakerClient#fetchCourse
        @arg {String} courseId
        @arg {CourseCallback} callbackFunction
        @returns {this}
        */
        fetchCourse (courseId, callbackFunction) {
            return this._request({
                url: this._getCourseUrl(courseId)
            }, (error, response) => {
                if (error) {
                    callbackFunction(error);
                    return;
                }

                if (response.statusCode !== 200) {
                    callbackFunction(new Error('Course request failed.'));
                    return;
                }

                let complete,
                    currentNode = {
                        attributes: {},
                        children: [],
                        name: 'root',
                        text: []
                    };

                const completeFunction = (error, course) => {
                        if (complete) {
                            return;
                        }

                        complete = true;
                        callbackFunction(error, course);
                    },
                    course = {
                        courseId
                    },
                    gameStyles = this._gameStyles;

                response.pipe(new _HttpParser({
                    onclosetag (name) {
                        if (currentNode.name !== name) {
                            completeFunction(new Error(`Closing ${name} tag had no matching open tag.`));

                            // TODO: stop the parser
                            return;
                        }

                        const className = currentNode.attributes.class,
                            closedNode = currentNode;

                        currentNode = currentNode.parent;

                        if (!className) {
                            return;
                        }

                        if (/(?:^| )clear-rate(?: |$)/.test(className)) {
                            let digits = '';

                            closedNode.children.forEach(childNode => {
                                const className = childNode.attributes.class,
                                    match = className && className.match(/(?:^| )typography-(\d|second)(?: |$)/);

                                if (!match) {
                                    return;
                                }

                                if (match[1] === 'second') {
                                    digits += '.';
                                } else {
                                    digits += match[1];
                                }
                            });

                            if (digits) {
                                course.clearRate = +digits;
                            }
                        } else if (/(?:^| )clear-time(?: |$)/.test(className)) {
                            let digits = '',
                                minutes,
                                seconds;

                            closedNode.children.forEach(childNode => {
                                const className = childNode.attributes.class,
                                    match = className && className.match(/(?:^| )typography-(\d|minute|second)(?: |$)/);

                                if (!match) {
                                    return;
                                }

                                if (match[1] === 'minute') {
                                    if (digits) {
                                        minutes = +digits;
                                        digits = '';
                                    }
                                } else if (match[1] === 'second') {
                                    if (digits) {
                                        seconds = +digits;
                                        digits = '';
                                    }
                                } else {
                                    digits += match[1];
                                }
                            });

                            if (digits || minutes || seconds) {
                                let distance = 0,
                                    node = closedNode.parent,
                                    worldRecord;

                                const time = (minutes || 0) * 60000 + (seconds || 0) * 1000 + (+digits || 0);

                                while (node && distance < 3) {
                                    const className = node.attributes.class;

                                    if (className && /(?:^| )fastest-user(?: |$)/.test(className)) {
                                        worldRecord = true;
                                    }

                                    node = node.parent;
                                    distance += 1;
                                }

                                if (worldRecord) {
                                    worldRecord = course.worldRecord;

                                    if (!worldRecord) {
                                        worldRecord = {};
                                        course.worldRecord = worldRecord;
                                    }

                                    worldRecord.time = time;
                                } else {
                                    course.yourBestTime = time;
                                }
                            }
                        } else if (/(?:^| )course-detail-wrapper(?: |$)/.test(className)) {
                            closedNode.children.forEach(childNode => {
                                const className = childNode.attributes.class;

                                if (!className) {
                                    return;
                                }

                                if (/(?:^| )creator(?: |$)/.test(className)) {
                                    const findImgSrc = childNode => {
                                            if (childNode.name === 'img' && childNode.attributes.src) {
                                                return childNode.attributes.src;
                                            }

                                            let imgSrc;

                                            childNode.children.some(childNode => {
                                                imgSrc = findImgSrc(childNode);

                                                if (imgSrc) {
                                                    return true;
                                                }
                                            });

                                            return imgSrc;
                                        },
                                        imgSrc = findImgSrc(childNode);

                                    if (!imgSrc) {
                                        return;
                                    }

                                    let creator = course.creator;

                                    if (!creator) {
                                        creator = {};
                                        course.creator = creator;
                                    }

                                    creator.miiIconUrl = imgSrc;
                                } else if (/(?:^| )creator-info(?: |$)/.test(className)) {
                                    let creator = course.creator;

                                    if (!creator) {
                                        creator = {};
                                        course.creator = creator;
                                    }

                                    childNode.children.forEach(childNode => {
                                        const className = childNode.attributes.class;

                                        if (!className) {
                                            return;
                                        }

                                        if (/(?:^| )flag(?: |$)/.test(className)) {
                                            const country = className.split(' ').filter(className => className !== 'flag')[0];

                                            if (country) {
                                                creator.country = country;
                                            }
                                        } else if (/(?:^| )medals(?: |$)/.test(className)) {
                                            let match = className.match(/(?:^| )common_icon_coin(\d+)(?: |$)/);

                                            match = match && match[1];

                                            if (match) {
                                                creator.medals = +match;
                                            }
                                        } else if (/(?:^| )name(?: |$)/.test(className)) {
                                            const text = childNode.text[0];

                                            if (text) {
                                                creator.miiName = text;
                                            }
                                        }
                                    });
                                }
                            });
                        } else if (/(?:^| )course-header(?: |$)/.test(className) && closedNode.text.length) {
                            const difficulty = closedNode.text.join('');

                            course.difficulty = difficulty.charAt(0).toLowerCase() + difficulty.substr(1).replace(/ /g, '');
                        } else if (/(?:^| )course-tag(?: |$)/.test(className) && closedNode.text.length) {
                            const tag = closedNode.text.join('');

                            if (tag && tag !== '---') {
                                course.tag = tag;
                            }
                        } else if (/(?:^| )course-title(?: |$)/.test(className) && closedNode.text.length) {
                            course.title = closedNode.text.join('');
                        } else if (/(?:^| )created_at(?: |$)/.test(className) && closedNode.text.length) {
                            const createdAt = closedNode.text.join(''),
                                match = createdAt.match(/^(\d+) (day|hour)s? ago$/);

                            course.createdAt = createdAt;

                            if (match) {
                                let millisecondsAgo;

                                switch (match[2]) {
                                    case 'day':
                                        millisecondsAgo = 86400000;
                                        break;
                                    case 'hour':
                                        millisecondsAgo = 3600000;
                                        break;
                                    default:
                                        return;
                                }

                                course.uploadDate = new Date(new Date().getTime() - match[1] * millisecondsAgo);
                            } else {
                                const uploadDate = new Date(createdAt);

                                if (!Number.isNaN(uploadDate.getTime())) {
                                    course.uploadDate = uploadDate;
                                }
                            }
                        } else if (/(?:^| )liked-count(?: |$)/.test(className)) {
                            let digits = '';

                            closedNode.children.forEach(childNode => {
                                const className = childNode.attributes.class,
                                    match = className && className.match(/(?:^| )typography-(\d)(?: |$)/);

                                if (match) {
                                    digits += match[1];
                                }
                            });

                            if (digits) {
                                course.stars = +digits;
                            }
                        } else if (/(?:^| )played-count(?: |$)/.test(className)) {
                            let digits = '';

                            closedNode.children.forEach(childNode => {
                                const className = childNode.attributes.class,
                                    match = className && className.match(/(?:^| )typography-(\d)(?: |$)/);

                                if (match) {
                                    digits += match[1];
                                }
                            });

                            if (digits) {
                                course.players = +digits;
                            }
                        } else if (/(?:^| )shared-count(?: |$)/.test(className)) {
                            let digits = '';

                            closedNode.children.forEach(childNode => {
                                const className = childNode.attributes.class,
                                    match = className && className.match(/(?:^| )typography-(\d)(?: |$)/);

                                if (match) {
                                    digits += match[1];
                                }
                            });

                            if (digits) {
                                course.tweets = +digits;
                            }
                        } else if (/(?:^| )tried-count(?: |$)/.test(className)) {
                            let digits = '';

                            closedNode.children.forEach(childNode => {
                                const className = childNode.attributes.class,
                                    match = className && className.match(/(?:^| )typography-(\d|slash)(?: |$)/);

                                if (!match) {
                                    return;
                                }

                                if (match[1] === 'slash') {
                                    if (digits) {
                                        course.clears = +digits;
                                        digits = '';
                                    }
                                } else {
                                    digits += match[1];
                                }
                            });

                            if (digits) {
                                course.attempts = +digits;
                            }
                        } else if (/(?:^| )user-wrapper(?: |$)/.test(className)) {
                            const player = {};

                            closedNode.children.forEach(childNode => {
                                const className = childNode.attributes.class;

                                if (!className) {
                                    return;
                                }

                                if (/(?:^| )mii-wrapper(?: |$)/.test(className)) {
                                    const findImgSrc = childNode => {
                                            if (childNode.name === 'img' && childNode.attributes.src) {
                                                return childNode.attributes.src;
                                            }

                                            let imgSrc;

                                            childNode.children.some(childNode => {
                                                imgSrc = findImgSrc(childNode);

                                                if (imgSrc) {
                                                    return true;
                                                }
                                            });

                                            return imgSrc;
                                        },
                                        imgSrc = findImgSrc(childNode);

                                    if (imgSrc) {
                                        player.miiIconUrl = imgSrc;
                                    }
                                } else if (/(?:^| )user-info(?: |$)/.test(className)) {
                                    childNode.children.forEach(childNode => {
                                        const className = childNode.attributes.class;

                                        if (!className) {
                                            return;
                                        }

                                        if (/(?:^| )flag(?: |$)/.test(className)) {
                                            const country = className.split(' ').filter(className => className !== 'flag')[0];

                                            if (country) {
                                                player.country = country;
                                            }
                                        } else if (/(?:^| )name(?: |$)/.test(className)) {
                                            const text = childNode.text[0];

                                            if (text) {
                                                player.miiName = text;
                                            }
                                        }
                                    });
                                }
                            });

                            if (!Object.keys(player).length) {
                                return;
                            }

                            let distance = 0,
                                node = closedNode.parent;

                            while (node && distance < 3) {
                                const className = node.attributes.class;

                                if (className) {
                                    if (/(?:^| )cleared-body(?: |$)/.test(className)) {
                                        let clearedBy = course.clearedBy;

                                        if (!clearedBy) {
                                            clearedBy = [];
                                            course.clearedBy = clearedBy;
                                        }

                                        clearedBy.push(player);
                                        return;
                                    }

                                    if (/(?:^| )fastest-user(?: |$)/.test(className)) {
                                        let worldRecord = course.worldRecord;

                                        if (!worldRecord) {
                                            worldRecord = {};
                                            course.worldRecord = worldRecord;
                                        }

                                        worldRecord.player = player;
                                        return;
                                    }

                                    if (/(?:^| )first-user(?: |$)/.test(className)) {
                                        course.firstClearBy = player;
                                        return;
                                    }

                                    if (/(?:^| )liked-body(?: |$)/.test(className)) {
                                        let starredBy = course.starredBy;

                                        if (!starredBy) {
                                            starredBy = [];
                                            course.starredBy = starredBy;
                                        }

                                        starredBy.push(player);
                                        return;
                                    }

                                    if (/(?:^| )played-body(?: |$)/.test(className)) {
                                        let recentPlayers = course.recentPlayers;

                                        if (!recentPlayers) {
                                            recentPlayers = [];
                                            course.recentPlayers = recentPlayers;
                                        }

                                        recentPlayers.push(player);
                                        return;
                                    }
                                }

                                node = node.parent;
                                distance += 1;
                            }
                        }
                    },
                    onend () {
                        completeFunction(null, course);
                    },
                    onerror (error) {
                        completeFunction(error);
                    },
                    onopentag (name, attributes) {
                        const className = attributes.class,
                            node = {
                                attributes,
                                children: [],
                                name,
                                parent: currentNode,
                                text: []
                            };

                        currentNode.children.push(node);
                        currentNode = node;

                        if (attributes.name === 'csrf-token' && attributes.content) {
                            course.csrfToken = attributes.content;
                        }

                        if (!className) {
                            return;
                        }

                        if (/(?:^| )course-clear-flag-wrapper(?: |$)/.test(className)) {
                            course.cleared = true;
                        } else if (name === 'img' && attributes.src && /(?:^| )course-image(?: |$)/.test(className)) {
                            course.thumbnailUrl = attributes.src;
                        } else if (name === 'img' && attributes.src && /(?:^| )course-image-full(?: |$)/.test(className)) {
                            course.imageUrl = attributes.src;
                        } else if (/(?:^| )gameskin(?: |$)/.test(className)) {
                            let match = className.match(/(?:^| )common_gs_([A-Za-z0-9]+)(?: |$)/);

                            match = match && gameStyles[match[1]] || match;

                            if (match) {
                                course.gameStyle = match;
                            }
                        } else if (/(?:^| )miiverse(?: |$)/.test(className) && attributes.href) {
                            course.miiversePostUrl = attributes.href;
                        }
                    },
                    ontext (text) {
                        currentNode.text.push(text);
                    }
                }, {
                    decodeEntities: true,
                    lowerCaseTags: false,
                    recognizeSelfClosing: true
                }));
            });
        },
        /**
        @member {Boolean} module:super-mario-maker-client~SuperMarioMakerClient#isLoggedIn
        @readonly
        */
        get isLoggedIn () {
            return this._isLoggedIn;
        },
        /**
        @method module:super-mario-maker-client~SuperMarioMakerClient#logIn
        @arg {Object} config
        @arg {String} config.password
        @arg {String} config.username
        @arg {ErrorCallback} callbackFunction
        @returns {this}
        */
        logIn ({
            password,
            username
        }, callbackFunction) {
            if (this._isLoggedIn && this._session) {
                setImmediate(callbackFunction);
                return this;
            }

            return this._request({
                updateSession: true,
                url: this._superMarioMakerAuthUrl
            }, (error, authResponse) => {
                if (error) {
                    callbackFunction(error);
                    return;
                }

                if (authResponse.statusCode !== 302 || typeof authResponse.headers.location !== 'string') {
                    callbackFunction(new Error('Super Mario Maker auth request failed.'));
                    return;
                }

                const location = _parseUrl(authResponse.headers.location, true),
                    query = location.query;

                if (!location.hostname || !location.pathname || !query || !query.client_id || !query.redirect_uri || !query.response_type || !query.state) {
                    callbackFunction(new Error('Super Mario Maker auth request failed.'));
                    return;
                }

                this._request({
                    body: _stringifyQuery(Object.assign(query, {
                        lang: this._lang,
                        nintendo_authenticate: '', // eslint-disable-line camelcase
                        nintendo_authorize: '', // eslint-disable-line camelcase
                        password,
                        scope: '',
                        username
                    })),
                    options: {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            Referer: authResponse.headers.location
                        },
                        hostname: location.hostname,
                        method: 'POST',
                        path: location.pathname
                    },
                    sendSession: false,
                    updateSession: false
                }, (error, logInResponse) => {
                    if (error) {
                        callbackFunction(error);
                        return;
                    }

                    if (logInResponse.statusCode !== 303 || typeof logInResponse.headers.location !== 'string') {
                        callbackFunction(new Error('Super Mario Maker log in failed.'));
                        return;
                    }

                    this._request({
                        options: {
                            headers: {
                                Referer: authResponse.headers.location
                            }
                        },
                        sendSession: true,
                        updateSession: true,
                        url: logInResponse.headers.location
                    }, error => {
                        if (error) {
                            callbackFunction(error);
                            return;
                        }

                        this._isLoggedIn = true;

                        callbackFunction();
                    });
                });
            });
        },
        /**
        @method module:super-mario-maker-client~SuperMarioMakerClient#logOut
        @returns {this}
        */
        logOut () {
            this._isLoggedIn = false;
            this._session = '';
            return this;
        },
        /**
        @method module:super-mario-maker-client~SuperMarioMakerClient#_getCourseBookmarkUrl
        @arg {String} courseId
        @protected
        @returns {String}
        */
        _getCourseBookmarkUrl (courseId) {
            return `${this._getCourseUrl(courseId)}/play_at_later`;
        },
        /**
        @method module:super-mario-maker-client~SuperMarioMakerClient#_getCourseUrl
        @arg {String} courseId
        @protected
        @returns {String}
        */
        _getCourseUrl (courseId) {
            return `${this._superMarioMakerBookmarkUrl}/courses/${courseId}`;
        },
        /**
        @method module:super-mario-maker-client~SuperMarioMakerClient#_init
        @arg {Object} config
        @protected
        @returns {this}
        */
        _init ({
            csrfTokenHeaderName = 'X-CSRF-Token',
            gameStyles = {
                sb: 'superMarioBros',
                sb3: 'superMarioBros3',
                sbu: 'newSuperMarioBrosU',
                sw: 'superMarioWorld'
            },
            lang = 'en-US',
            sessionCookieName = '_supermariomakerbookmark_session',
            superMarioMakerAuthUrl = 'https://supermariomakerbookmark.nintendo.net/users/auth/nintendo',
            superMarioMakerBookmarkUrl = 'https://supermariomakerbookmark.nintendo.net'
        } = {}) {
            this._csrfTokenHeaderName = csrfTokenHeaderName;
            this._gameStyles = gameStyles;
            this._isLoggedIn = false;
            this._lang = lang;
            this._requestInProgress = false;
            this._requestQueue = [];
            this._session = '';
            this._sessionCookieName = sessionCookieName;
            this._superMarioMakerAuthUrl = superMarioMakerAuthUrl;
            this._superMarioMakerBookmarkUrl = superMarioMakerBookmarkUrl;
            return this;
        },
        /**
        @method module:super-mario-maker-client~SuperMarioMakerClient#_request
        @arg {Object} config
        @arg {String} [config.body]
        @arg {Object} [config.options={}]
        @arg {Boolean} [config.sendSession]
        @arg {Boolean} [config.updateSession]
        @arg {String} [config.url]
        @arg {IncomingMessageCallback} callbackFunction
        @protected
        @returns {this}
        */
        _request ({
            body,
            options = {},
            sendSession,
            updateSession,
            url
        }, callbackFunction) {
            if (this._requestInProgress) {
                this._requestQueue.push({
                    callbackFunction,
                    options,
                    url
                });

                return this;
            }

            this._requestInProgress = true;

            let complete;

            if (typeof sendSession === 'undefined') {
                sendSession = this._isLoggedIn;
            }

            if (typeof updateSession === 'undefined') {
                updateSession = this._isLoggedIn;
            }

            if (sendSession) {
                let headers = options.headers;

                if (!headers) {
                    headers = {};
                    options.headers = headers;
                }

                if (headers.Cookie) {
                    if (new RegExp(`${this._sessionCookieName}=.*?(?:;|$)`).test(headers.Cookie)) {
                        headers.Cookie = headers.Cookie.replace(new RegExp(`${this._sessionCookieName}=.*?(;|$)`), `${this._sessionCookieName}=${this._session}$1`);
                    } else {
                        headers.Cookie += `; ${this._sessionCookieName}=${this._session}`;
                    }
                } else {
                    headers.Cookie = `${this._sessionCookieName}=${this._session}`;
                }
            }

            const completeFunction = (error, response) => {
                    if (complete) {
                        return;
                    }

                    this._requestInProgress = false;
                    complete = true;
                    callbackFunction(error, response);

                    const next = this._requestQueue.shift();

                    if (next) {
                        this._request(next, next.callbackFunction);
                    }
                },
                request = _request(url ? Object.assign(_parseUrl(url), options) : options, response => {
                    if (!updateSession || Array.isArray(response.headers['set-cookie']) && response.headers['set-cookie'].some(cookie => {
                        const match = cookie.match(new RegExp(`${this._sessionCookieName}=(.*?);`));

                        if (match) {
                            this._session = match[1];
                            return true;
                        }
                    })) {
                        completeFunction(null, response);
                    } else {
                        completeFunction(new Error('Failed to update session.'));
                    }
                });

            request.on('error', error => {
                completeFunction(error);
            });

            request.end(body);

            return this;
        }
    };

Reflect.ownKeys(_prototype).forEach(propertyName => Reflect.defineProperty(_SuperMarioMakerClient.prototype, propertyName, Reflect.getOwnPropertyDescriptor(_prototype, propertyName)));

export {
    _fetchCourse as fetchCourse,
    _logIn as logIn,
    _SuperMarioMakerClient as default
};

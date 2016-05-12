import {
    after,
    afterEach,
    before,
    describe,
    it
} from 'mocha';

import SuperMarioMakerClient, {
    fetchCourse,
    logIn
} from '../js/super-mario-maker-client.js';

import booYall from './js/boo-yall.js';

import {
    escape
} from 'querystring';

import {
    expect
} from 'chai';

import expectCourse from './js/expect-course.js';

import {
    join
} from 'path';

import nock from 'nock';

/* eslint-disable no-process-env */
const courseId = process.env.COURSE_ID,
    password = process.env.PASSWORD,
    username = process.env.USERNAME;
/* eslint-enable no-process-env */

describe('SuperMarioMakerClient', function () {
    this.timeout(28657);

    it('should be a constructor function', () => {
        expect(SuperMarioMakerClient).to.be.a('function');

        const superMarioMakerClient = new SuperMarioMakerClient();

        expect(superMarioMakerClient).to.be.an('object');
        expect(superMarioMakerClient).to.be.an.instanceOf(SuperMarioMakerClient);
        expect(superMarioMakerClient).to.have.property('isLoggedIn', false);
    });

    it('should be a factory function', () => {
        expect(SuperMarioMakerClient).to.be.a('function');

        const superMarioMakerClient = SuperMarioMakerClient(); // eslint-disable-line new-cap

        expect(superMarioMakerClient).to.be.an('object');
        expect(superMarioMakerClient).to.be.an.instanceOf(SuperMarioMakerClient);
        expect(superMarioMakerClient).to.have.property('isLoggedIn', false);
    });

    describe('mocked requests', () => {
        after(() => {
            nock.enableNetConnect();
        });

        afterEach(() => {
            nock.cleanAll();
        });

        before(() => {
            nock.disableNetConnect();
        });

        it('should fetch a course without logging in', callbackFunction => {
            const mockedFetchRequest = nock('https://supermariomakerbookmark.nintendo.net')
            .get('/courses/DA56-0000-014A-DA36')
            .replyWithFile(200, join(__dirname, 'responses/boo-yall.html'));

            fetchCourse('DA56-0000-014A-DA36', (error, course) => {
                if (error) {
                    callbackFunction(error);
                    return;
                }

                expectCourse(course, booYall);

                mockedFetchRequest.done();

                callbackFunction();
            });
        });

        it('should log in, fetch a course, bookmark a course, and log out', callbackFunction => {
            const authorizedSessionId0 = '0123abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.repeat(6),
                authorizedSessionId1 = '1234abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.repeat(6),
                authorizedSessionId2 = '2345abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.repeat(6),
                authorizedSessionId3 = '2345abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.repeat(6),
                clientId = 'abcdefghijklmnopqrstuvwxyz012345',
                code = 'abcdefghijklmnopqrstuvwxyz0123456789abcd',
                password = 'testnintendonetworkpassword',
                state = 'abcdefghijklmnopqrstuvwxyz0123456789abcdefghijkl',
                unauthorizedSessionId = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123'.repeat(6),
                username = 'testnintendonetworkid',

                callbackUrl = 'https://supermariomakerbookmark.nintendo.net/users/auth/nintendo/callback',
                logInUrl = `https://id.nintendo.net/oauth/authorize?client_id=${clientId}&redirect_uri=${escape(callbackUrl)}&response_type=code&state=${state}`,

                mockedLogInRequests = [
                    nock('https://supermariomakerbookmark.nintendo.net')
                    .get('/users/auth/nintendo')
                    .reply(302, `Redirecting to ${logInUrl}...`, {
                        location: logInUrl,
                        'set-cookie': [
                            `_supermariomakerbookmark_session=${unauthorizedSessionId}; path=/; secure; HttpOnly`
                        ]
                    }),
                    nock('https://id.nintendo.net')
                    .post('/oauth/authorize', `client_id=${clientId}&redirect_uri=${escape(callbackUrl)}&response_type=code&state=${state}&lang=en-US&nintendo_authenticate=&nintendo_authorize=&password=${password}&scope=&username=${username}`)
                    .reply(303, '', {
                        location: `${callbackUrl}?code=${code}&state=${state}`
                    }),
                    nock('https://supermariomakerbookmark.nintendo.net')
                    .matchHeader('Cookie', cookie => typeof cookie === 'string' && cookie.includes(`_supermariomakerbookmark_session=${unauthorizedSessionId}`))
                    .get('/users/auth/nintendo/callback')
                    .query({
                        code,
                        state
                    })
                    .reply(200, '', {
                        'set-cookie': [
                            `_supermariomakerbookmark_session=${authorizedSessionId0}; path=/; secure; HttpOnly`
                        ]
                    })
                ];

            logIn({
                username,
                password
            }, (error, superMarioMakerClient) => {
                if (error) {
                    callbackFunction(error);
                    return;
                }

                expect(superMarioMakerClient).to.have.property('isLoggedIn', true);

                mockedLogInRequests.forEach(mockedLogInRequest => {
                    mockedLogInRequest.done();
                });

                const mockedFetchRequest = nock('https://supermariomakerbookmark.nintendo.net')
                .matchHeader('Cookie', cookie => typeof cookie === 'string' && cookie.includes(`_supermariomakerbookmark_session=${authorizedSessionId0}`))
                .get('/courses/DA56-0000-014A-DA36')
                .replyWithFile(200, join(__dirname, 'responses/boo-yall.html'), {
                    'set-cookie': [
                        `_supermariomakerbookmark_session=${authorizedSessionId1}; path=/; secure; HttpOnly`
                    ]
                });

                superMarioMakerClient.fetchCourse('DA56-0000-014A-DA36', (error, course) => {
                    if (error) {
                        callbackFunction(error);
                        return;
                    }

                    expectCourse(course, booYall);

                    mockedFetchRequest.done();

                    const mockedBookmarkRequest = nock('https://supermariomakerbookmark.nintendo.net')
                    .matchHeader('Cookie', cookie => typeof cookie === 'string' && cookie.includes(`_supermariomakerbookmark_session=${authorizedSessionId1}`))
                    .matchHeader('X-CSRF-Token', course.csrfToken)
                    .post('/courses/DA56-0000-014A-DA36/play_at_later')
                    .reply(200, '', {
                        'set-cookie': [
                            `_supermariomakerbookmark_session=${authorizedSessionId2}; path=/; secure; HttpOnly`
                        ]
                    });

                    superMarioMakerClient.bookmarkCourse(course, error => {
                        if (error) {
                            callbackFunction(error);
                            return;
                        }

                        mockedBookmarkRequest.done();

                        const mockedUnbookmarkRequest = nock('https://supermariomakerbookmark.nintendo.net')
                        .matchHeader('Cookie', cookie => typeof cookie === 'string' && cookie.includes(`_supermariomakerbookmark_session=${authorizedSessionId2}`))
                        .matchHeader('X-CSRF-Token', course.csrfToken)
                        .delete('/bookmarks/DA56-0000-014A-DA36')
                        .reply(200, '', {
                            'set-cookie': [
                                `_supermariomakerbookmark_session=${authorizedSessionId3}; path=/; secure; HttpOnly`
                            ]
                        });

                        superMarioMakerClient.unbookmarkCourse(course, error => {
                            if (error) {
                                callbackFunction(error);
                                return;
                            }

                            mockedUnbookmarkRequest.done();

                            superMarioMakerClient.logOut();

                            expect(superMarioMakerClient).to.have.property('isLoggedIn', false);

                            callbackFunction();
                        });
                    });
                });
            });
        });
    });

    describe('live requests', () => {
        it('should fetch a course without logging in', callbackFunction => {
            if (!courseId) {
                setImmediate(callbackFunction, new Error('Please set COURSE_ID before running tests.'));
                return;
            }

            fetchCourse(courseId, (error, course) => {
                if (error) {
                    callbackFunction(error);
                    return;
                }

                expectCourse(course, {
                    courseId
                });

                callbackFunction();
            });
        });

        it('should log in, fetch a course, bookmark a course, unbookmark a course, and log out', callbackFunction => {
            if (!courseId) {
                setImmediate(callbackFunction, new Error('Please set COURSE_ID before running tests.'));
                return;
            }

            if (!password) {
                setImmediate(callbackFunction, new Error('Please set PASSWORD before running tests.'));
                return;
            }

            if (!username) {
                setImmediate(callbackFunction, new Error('Please set USERNAME before running tests.'));
                return;
            }

            logIn({
                username,
                password
            }, (error, superMarioMakerClient) => {
                if (error) {
                    callbackFunction(error);
                    return;
                }

                expect(superMarioMakerClient).to.have.property('isLoggedIn', true);

                superMarioMakerClient.fetchCourse(courseId, (error, course) => {
                    if (error) {
                        callbackFunction(error);
                        return;
                    }

                    expectCourse(course, {
                        courseId
                    });

                    superMarioMakerClient.bookmarkCourse(course, error => {
                        if (error) {
                            callbackFunction(error);
                            return;
                        }

                        superMarioMakerClient.unbookmarkCourse(course, error => {
                            if (error) {
                                callbackFunction(error);
                                return;
                            }

                            superMarioMakerClient.logOut();

                            expect(superMarioMakerClient).to.have.property('isLoggedIn', false);

                            callbackFunction();
                        });
                    });
                });
            });
        });
    });
});

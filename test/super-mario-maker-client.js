import {
    expect
} from 'chai';

import {
    after,
    afterEach,
    before,
    describe,
    it
} from 'mocha';

import nock from 'nock';

import {
    join
} from 'path';

import booYall from './js/boo-yall.js';

import expectCourse from './js/expect-course.js';

import SuperMarioMakerClient, {
    fetchCourse,
    logIn
} from '../js/super-mario-maker-client.js';

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
    });

    it('should be a factory function', () => {
        expect(SuperMarioMakerClient).to.be.a('function');

        const superMarioMakerClient = SuperMarioMakerClient(); // eslint-disable-line new-cap

        expect(superMarioMakerClient).to.be.an('object');
        expect(superMarioMakerClient).to.be.an.instanceOf(SuperMarioMakerClient);
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
            const mockedRequests = nock('https://supermariomakerbookmark.nintendo.net').get('/courses/DA56-0000-014A-DA36').replyWithFile(200, join(__dirname, 'responses/boo-yall.html'));

            fetchCourse('DA56-0000-014A-DA36', (error, course) => {
                if (error) {
                    callbackFunction(error);
                    return;
                }

                expectCourse(course, booYall);

                mockedRequests.done();

                callbackFunction();
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

        it('should log in, fetch a course, bookmark a course, and log out', callbackFunction => {
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

                        superMarioMakerClient.logOut();

                        expect(superMarioMakerClient).to.have.property('isLoggedIn', false);

                        callbackFunction();
                    });
                });
            });
        });
    });
});

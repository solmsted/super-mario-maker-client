import {
    expect
} from 'chai';

import {
    describe,
    it
} from 'mocha';

import expectCourse from './js/expect-course.js';

import SuperMarioMakerClient, {
    fetchCourse,
    logIn
} from '../js/super-mario-maker-client.js';

const courseId = process.env.COURSE_ID,
    password = process.env.PASSWORD,
    username = process.env.USERNAME;

describe('SuperMarioMakerClient', function () {
    this.timeout(28657);

    it('should be a constructor function', function () {
        expect(SuperMarioMakerClient).to.be.a('function');

        const superMarioMakerClient = new SuperMarioMakerClient();

        expect(superMarioMakerClient).to.be.an('object');
        expect(superMarioMakerClient).to.be.an.instanceOf(SuperMarioMakerClient);
    });

    it('should be a factory function', function () {
        expect(SuperMarioMakerClient).to.be.a('function');

        const superMarioMakerClient = SuperMarioMakerClient();

        expect(superMarioMakerClient).to.be.an('object');
        expect(superMarioMakerClient).to.be.an.instanceOf(SuperMarioMakerClient);
    });

    it('should fetch a course without logging in', function (callbackFunction) {
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

    it('should log in, fetch a course, bookmark a course, and log out', function (callbackFunction) {
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

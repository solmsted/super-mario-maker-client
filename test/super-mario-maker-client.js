import {
    expect
} from 'chai';

import {
    describe,
    it
} from 'mocha';

import {
    default as SuperMarioMakerClient,
    fetchCourse,
    logIn
} from '../js/super-mario-maker-client.js';

const courseId = process.env.COURSE_ID,
    password = process.env.PASSWORD,
    username = process.env.USERNAME,

    testCourse = course => {
        expect(course).to.be.an('object');
        expect(course).to.have.property('attempts').that.is.a('number');
        if (course.cleared) {
            expect(course).to.have.property('cleared', true);
        }
        if (course.clearedBy) {
            expect(course).to.have.property('clearedBy').that.is.an.instanceOf(Array);
            course.clearedBy.forEach(player => {
                expect(player).to.be.an('object');
                expect(player).to.have.property('country').that.is.a('string');
                expect(player).to.have.property('miiIconUrl').that.is.a('string');
                expect(player).to.have.property('miiName').that.is.a('string');
            });
        }
        expect(course).to.have.property('clearRate').that.is.a('number');
        expect(course).to.have.property('clears').that.is.a('number');
        expect(course).to.have.property('courseId', courseId);
        expect(course).to.have.property('creator').that.is.an('object');
        expect(course.creator).to.have.property('country').that.is.a('string');
        expect(course.creator).to.have.property('medals').that.is.a('number');
        expect(course.creator).to.have.property('miiIconUrl').that.is.a('string');
        expect(course.creator).to.have.property('miiName').that.is.a('string');
        expect(course).to.have.property('csrfToken').that.is.a('string');
        expect(course).to.have.property('difficulty').that.is.a('string');
        if (course.firstClearBy) {
            expect(course).to.have.property('firstClearBy').that.is.an('object');
            expect(course.firstClearBy).to.have.property('country').that.is.a('string');
            expect(course.firstClearBy).to.have.property('miiIconUrl').that.is.a('string');
            expect(course.firstClearBy).to.have.property('miiName').that.is.a('string');
        }
        expect(course).to.have.property('gameStyle').that.is.a('string');
        expect(course).to.have.property('imageUrl').that.is.a('string');
        expect(course).to.have.property('miiversePostUrl').that.is.a('string');
        expect(course).to.have.property('players').that.is.a('number');
        if (course.recentPlayers) {
            expect(course).to.have.property('recentPlayers').that.is.an.instanceOf(Array);
            course.recentPlayers.forEach(player => {
                expect(player).to.be.an('object');
                expect(player).to.have.property('country').that.is.a('string');
                expect(player).to.have.property('miiIconUrl').that.is.a('string');
                expect(player).to.have.property('miiName').that.is.a('string');
            });
        }
        if (course.starredBy) {
            expect(course).to.have.property('starredBy').that.is.an.instanceOf(Array);
            course.starredBy.forEach(player => {
                expect(player).to.be.an('object');
                expect(player).to.have.property('country').that.is.a('string');
                expect(player).to.have.property('miiIconUrl').that.is.a('string');
                expect(player).to.have.property('miiName').that.is.a('string');
            });
        }
        expect(course).to.have.property('stars').that.is.a('number');
        if (course.tag) {
            expect(course).to.have.property('tag').that.is.a('string');
        }
        expect(course).to.have.property('thumbnailUrl').that.is.a('string');
        expect(course).to.have.property('title').that.is.a('string');
        expect(course).to.have.property('tweets').that.is.a('number');
        expect(course).to.have.property('uploadDate').that.is.an.instanceOf(Date);
        if (course.yourBestTime) {
            expect(course).to.have.property('yourBestTime').that.is.a('number');
        }
        if (course.worldRecord) {
            expect(course).to.have.property('worldRecord').that.is.an('object');
            expect(course.worldRecord).to.have.property('player').that.is.an('object');
            expect(course.worldRecord.player).to.have.property('country').that.is.a('string');
            expect(course.worldRecord.player).to.have.property('miiIconUrl').that.is.a('string');
            expect(course.worldRecord.player).to.have.property('miiName').that.is.a('string');
            expect(course.worldRecord).to.have.property('time').that.is.a('number');
        }
    };

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

            testCourse(course);

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

                testCourse(course);

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

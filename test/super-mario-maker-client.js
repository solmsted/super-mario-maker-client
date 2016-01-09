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

                expectCourse(course, {
                    attempts: 34,
                    clearedBy: [{
                        country: 'US',
                        miiIconUrl: 'http://mii-images.cdn.nintendo.net/pvvu3jjpnnd_normal_face.png',
                        miiName: 'Jay'
                    }, {
                        country: 'US',
                        miiIconUrl: 'http://mii-images.cdn.nintendo.net/2lt69vsve0ct7_normal_face.png',
                        miiName: 'Gilbes'
                    }],
                    clearRate: 5.88,
                    clears: 2,
                    courseId: 'DA56-0000-014A-DA36',
                    createdAt: '7 days ago',
                    creator: {
                        country: 'US',
                        medals: 2,
                        miiIconUrl: 'http://mii-images.cdn.nintendo.net/3bz2qs0l93czd_normal_face.png',
                        miiName: 'Steven'
                    },
                    csrfToken: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
                    difficulty: 'expert',
                    firstClearBy: {
                        country: 'US',
                        miiIconUrl: 'http://mii-images.cdn.nintendo.net/2lt69vsve0ct7_normal_face.png',
                        miiName: 'Gilbes'
                    },
                    gameStyle: 'superMarioBros3',
                    imageUrl: 'https://dypqnhofrd2x2.cloudfront.net/DA56-0000-014A-DA36_full.jpg',
                    miiversePostUrl: 'https://miiverse.nintendo.net/posts/AYMHAAACAAADVHkvlkvobA',
                    players: 12,
                    recentPlayers: [{
                        country: 'JP',
                        miiIconUrl: 'http://mii-images.cdn.nintendo.net/wcqya9850e6y_normal_face.png',
                        miiName: 'いっしー'
                    }, {
                        country: 'US',
                        miiIconUrl: 'http://mii-images.cdn.nintendo.net/3ablfalo6lahl_normal_face.png',
                        miiName: 'RJ'
                    }, {
                        country: 'CA',
                        miiIconUrl: 'http://mii-images.cdn.nintendo.net/32mb4xqiqnz29_normal_face.png',
                        miiName: 'Chris'
                    }, {
                        country: 'JP',
                        miiIconUrl: 'http://mii-images.cdn.nintendo.net/1hnuppn53vbay_normal_face.png',
                        miiName: 'ゆうな'
                    }, {
                        country: 'JP',
                        miiIconUrl: 'http://mii-images.cdn.nintendo.net/1s36j4j6a49s3_normal_face.png',
                        miiName: 'みいー'
                    }, {
                        country: 'FR',
                        miiIconUrl: 'http://mii-images.cdn.nintendo.net/19cae4ogyt99u_normal_face.png',
                        miiName: 'Jonathan'
                    }, {
                        country: 'CA',
                        miiIconUrl: 'http://mii-images.cdn.nintendo.net/5romhgvhjog2_normal_face.png',
                        miiName: 'devon'
                    }, {
                        country: 'US',
                        miiIconUrl: 'http://mii-images.cdn.nintendo.net/pvvu3jjpnnd_normal_face.png',
                        miiName: 'Jay'
                    }, {
                        country: 'DE',
                        miiIconUrl: 'http://mii-images.cdn.nintendo.net/y0kt3vkt3sz1_normal_face.png',
                        miiName: 'Marlon'
                    }, {
                        country: 'US',
                        miiIconUrl: 'http://mii-images.cdn.nintendo.net/2lt69vsve0ct7_normal_face.png',
                        miiName: 'Gilbes'
                    }, {
                        country: 'US',
                        miiIconUrl: 'http://mii-images.cdn.nintendo.net/3s10roz55c3kt_normal_face.png',
                        miiName: 'Dεεst'
                    }, {
                        country: 'US',
                        miiIconUrl: 'http://mii-images.cdn.nintendo.net/3inwjii9bud94_normal_face.png',
                        miiName: 'Dylan M'
                    }],
                    starredBy: [{
                        country: 'US',
                        miiIconUrl: 'http://mii-images.cdn.nintendo.net/pvvu3jjpnnd_normal_face.png',
                        miiName: 'Jay'
                    }, {
                        country: 'US',
                        miiIconUrl: 'http://mii-images.cdn.nintendo.net/2lt69vsve0ct7_normal_face.png',
                        miiName: 'Gilbes'
                    }],
                    stars: 2,
                    thumbnailUrl: 'https://dypqnhofrd2x2.cloudfront.net/DA56-0000-014A-DA36.jpg',
                    title: 'Boo Y\'all v2',
                    tweets: 0,
                    worldRecord: {
                        player: {
                            country: 'US',
                            miiIconUrl: 'http://mii-images.cdn.nintendo.net/2lt69vsve0ct7_normal_face.png',
                            miiName: 'Gilbes'
                        },
                        time: 705900
                    }
                });

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

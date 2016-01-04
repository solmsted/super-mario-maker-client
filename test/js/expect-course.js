import chai, {
    expect
} from 'chai';

import chaiDatetime from 'chai-datetime';

chai.use(chaiDatetime);

export default (actual, expected = {}) => {
    expect(actual).to.be.an('object');

    if (typeof expected.attempts === 'number') {
        expect(actual).to.have.property('attempts', expected.attempts);
    } else {
        expect(actual).to.have.property('attempts').that.is.a('number');
    }

    if (typeof expected.cleared === 'boolean') {
        expect(actual).to.have.property('cleared', expected.cleared);
    } else if (actual.cleared) {
        expect(actual).to.have.property('cleared', true);
    }

    if (Array.isArray(expected.clearedBy)) {
        expect(actual).to.have.property('clearedBy').that.deep.equals(expected.clearedBy);
    } else if (actual.clearedBy) {
        expect(actual).to.have.property('clearedBy').that.is.an('array');
        actual.clearedBy.forEach(player => {
            expect(player).to.be.an('object');
            expect(player).to.have.property('country').that.is.a('string');
            expect(player).to.have.property('miiIconUrl').that.is.a('string');
            expect(player).to.have.property('miiName').that.is.a('string');
        });
    }

    if (typeof expected.clearRate === 'number') {
        expect(actual).to.have.property('clearRate', expected.clearRate);
    } else {
        expect(actual).to.have.property('clearRate').that.is.a('number');
    }

    if (typeof expected.clears === 'number') {
        expect(actual).to.have.property('clears', expected.clears);
    } else {
        expect(actual).to.have.property('clears').that.is.a('number');
    }

    if (typeof expected.courseId === 'string') {
        expect(actual).to.have.property('courseId', expected.courseId);
    } else {
        expect(actual).to.have.property('courseId').that.is.a('string');
    }

    if (typeof expected.createdAt === 'string') {
        expect(actual).to.have.property('createdAt', expected.createdAt);
    } else {
        expect(actual).to.have.property('createdAt').that.is.a('string');
    }

    if (typeof expected.creator === 'object') {
        expect(actual).to.have.property('creator').that.deep.equals(expected.creator);
    } else {
        expect(actual).to.have.property('creator').that.is.an('object');
        expect(actual.creator).to.have.property('country').that.is.a('string');
        expect(actual.creator).to.have.property('medals').that.is.a('number');
        expect(actual.creator).to.have.property('miiIconUrl').that.is.a('string');
        expect(actual.creator).to.have.property('miiName').that.is.a('string');
    }

    if (typeof expected.csrfToken === 'string') {
        expect(actual).to.have.property('csrfToken', expected.csrfToken);
    } else {
        expect(actual).to.have.property('csrfToken').that.is.a('string');
    }

    if (typeof expected.difficulty === 'string') {
        expect(actual).to.have.property('difficulty', expected.difficulty);
    } else {
        expect(actual).to.have.property('difficulty').that.is.a('string');
    }

    if (typeof expected.firstClearBy === 'object') {
        expect(actual).to.have.property('firstClearBy').that.deep.equals(expected.firstClearBy);
    } else if (actual.firstClearBy) {
        expect(actual).to.have.property('firstClearBy').that.is.an('object');
        expect(actual.firstClearBy).to.have.property('country').that.is.a('string');
        expect(actual.firstClearBy).to.have.property('miiIconUrl').that.is.a('string');
        expect(actual.firstClearBy).to.have.property('miiName').that.is.a('string');
    }

    if (typeof expected.gameStyle === 'string') {
        expect(actual).to.have.property('gameStyle', expected.gameStyle);
    } else {
        expect(actual).to.have.property('gameStyle').that.is.a('string');
    }

    if (typeof expected.imageUrl === 'string') {
        expect(actual).to.have.property('imageUrl', expected.imageUrl);
    } else {
        expect(actual).to.have.property('imageUrl').that.is.a('string');
    }

    if (typeof expected.miiversePostUrl === 'string') {
        expect(actual).to.have.property('miiversePostUrl', expected.miiversePostUrl);
    } else {
        expect(actual).to.have.property('miiversePostUrl').that.is.a('string');
    }

    if (typeof expected.players === 'number') {
        expect(actual).to.have.property('players', expected.players);
    } else {
        expect(actual).to.have.property('players').that.is.a('number');
    }

    if (Array.isArray(expected.recentPlayers)) {
        expect(actual).to.have.property('recentPlayers').that.deep.equals(expected.recentPlayers);
    } else if (actual.recentPlayers) {
        expect(actual).to.have.property('recentPlayers').that.is.an('array');
        actual.recentPlayers.forEach(player => {
            expect(player).to.be.an('object');
            expect(player).to.have.property('country').that.is.a('string');
            expect(player).to.have.property('miiIconUrl').that.is.a('string');
            expect(player).to.have.property('miiName').that.is.a('string');
        });
    }

    if (Array.isArray(expected.starredBy)) {
        expect(actual).to.have.property('starredBy').that.deep.equals(expected.starredBy);
    } else if (actual.starredBy) {
        expect(actual).to.have.property('starredBy').that.is.an('array');
        actual.starredBy.forEach(player => {
            expect(player).to.be.an('object');
            expect(player).to.have.property('country').that.is.a('string');
            expect(player).to.have.property('miiIconUrl').that.is.a('string');
            expect(player).to.have.property('miiName').that.is.a('string');
        });
    }

    if (typeof expected.stars === 'number') {
        expect(actual).to.have.property('stars', expected.stars);
    } else {
        expect(actual).to.have.property('stars').that.is.a('number');
    }

    if (typeof expected.tag === 'string') {
        expect(actual).to.have.property('tag', expected.tag);
    } else if (actual.tag) {
        expect(actual).to.have.property('tag').that.is.a('string');
    }

    if (typeof expected.thumbnailUrl === 'string') {
        expect(actual).to.have.property('thumbnailUrl', expected.thumbnailUrl);
    } else {
        expect(actual).to.have.property('thumbnailUrl').that.is.a('string');
    }

    if (typeof expected.title === 'string') {
        expect(actual).to.have.property('title', expected.title);
    } else {
        expect(actual).to.have.property('title').that.is.a('string');
    }

    if (typeof expected.tweets === 'number') {
        expect(actual).to.have.property('tweets', expected.tweets);
    } else {
        expect(actual).to.have.property('tweets').that.is.a('number');
    }

    if (expected.uploadDate instanceof Date) {
        expect(actual).to.have.property('uploadDate').equalTime(expected.uploadDate);
    } else {
        expect(actual).to.have.property('uploadDate').that.is.an.instanceOf(Date);
    }

    if (typeof expected.yourBestTime === 'number') {
        expect(actual).to.have.property('yourBestTime', expected.yourBestTime);
    } else if (actual.yourBestTime) {
        expect(actual).to.have.property('yourBestTime').that.is.a('number');
    }

    if (typeof expected.worldRecord === 'object') {
        expect(actual).to.have.property('worldRecord').that.deep.equals(expected.worldRecord);
    } else if (actual.worldRecord) {
        expect(actual).to.have.property('worldRecord').that.is.an('object');
        expect(actual.worldRecord).to.have.property('player').that.is.an('object');
        expect(actual.worldRecord.player).to.have.property('country').that.is.a('string');
        expect(actual.worldRecord.player).to.have.property('miiIconUrl').that.is.a('string');
        expect(actual.worldRecord.player).to.have.property('miiName').that.is.a('string');
        expect(actual.worldRecord).to.have.property('time').that.is.a('number');
    }
};

import chai, {
    expect
} from 'chai';

import chaiDatetime from 'chai-datetime';

chai.use(chaiDatetime);

export default (actual, expected = {}) => {
    expect(actual).to.be.an('object');

    if (expected.hasOwnProperty('attempts')) {
        expect(actual).to.have.property('attempts', expected.attempts);
    } else {
        expect(actual).to.have.property('attempts').that.is.a('number');
    }

    if (expected.hasOwnProperty('cleared')) {
        expect(actual).to.have.property('cleared', expected.cleared);
    } else if (actual.hasOwnProperty('cleared')) {
        expect(actual).to.have.property('cleared').that.is.a('boolean');
    }

    if (expected.hasOwnProperty('clearedBy')) {
        expect(actual).to.have.property('clearedBy').that.deep.equals(expected.clearedBy);
    } else if (actual.hasOwnProperty('clearedBy')) {
        expect(actual).to.have.property('clearedBy').that.is.an('array');
        actual.clearedBy.forEach(player => {
            expect(player).to.be.an('object');
            expect(player).to.have.property('country').that.is.a('string');
            expect(player).to.have.property('miiIconUrl').that.is.a('string');
            expect(player).to.have.property('miiName').that.is.a('string');
        });
    }

    if (expected.hasOwnProperty('clearRate')) {
        expect(actual).to.have.property('clearRate', expected.clearRate);
    } else if (actual.hasOwnProperty('clearRate')) {
        expect(actual).to.have.property('clearRate').that.is.a('number');
    }

    if (expected.hasOwnProperty('clears')) {
        expect(actual).to.have.property('clears', expected.clears);
    } else {
        expect(actual).to.have.property('clears').that.is.a('number');
    }

    if (expected.hasOwnProperty('courseId')) {
        expect(actual).to.have.property('courseId', expected.courseId);
    } else {
        expect(actual).to.have.property('courseId').that.is.a('string');
    }

    if (expected.hasOwnProperty('createdAt')) {
        expect(actual).to.have.property('createdAt', expected.createdAt);
    } else {
        expect(actual).to.have.property('createdAt').that.is.a('string');
    }

    if (expected.hasOwnProperty('creator')) {
        expect(actual).to.have.property('creator').that.deep.equals(expected.creator);
    } else {
        expect(actual).to.have.property('creator').that.is.an('object');
        expect(actual.creator).to.have.property('country').that.is.a('string');
        expect(actual.creator).to.have.property('medals').that.is.a('number');
        expect(actual.creator).to.have.property('miiIconUrl').that.is.a('string');
        expect(actual.creator).to.have.property('miiName').that.is.a('string');
    }

    if (expected.hasOwnProperty('csrfToken')) {
        expect(actual).to.have.property('csrfToken', expected.csrfToken);
    } else {
        expect(actual).to.have.property('csrfToken').that.is.a('string');
    }

    if (expected.hasOwnProperty('difficulty')) {
        expect(actual).to.have.property('difficulty', expected.difficulty);
    } else if (actual.hasOwnProperty('difficulty')) {
        expect(actual).to.have.property('difficulty').that.is.a('string');
    }

    if (expected.hasOwnProperty('firstClearBy')) {
        expect(actual).to.have.property('firstClearBy').that.deep.equals(expected.firstClearBy);
    } else if (actual.hasOwnProperty('firstClearBy')) {
        expect(actual).to.have.property('firstClearBy').that.is.an('object');
        expect(actual.firstClearBy).to.have.property('country').that.is.a('string');
        expect(actual.firstClearBy).to.have.property('miiIconUrl').that.is.a('string');
        expect(actual.firstClearBy).to.have.property('miiName').that.is.a('string');
    }

    if (expected.hasOwnProperty('gameStyle')) {
        expect(actual).to.have.property('gameStyle', expected.gameStyle);
    } else {
        expect(actual).to.have.property('gameStyle').that.is.a('string');
    }

    if (expected.hasOwnProperty('imageUrl')) {
        expect(actual).to.have.property('imageUrl', expected.imageUrl);
    } else {
        expect(actual).to.have.property('imageUrl').that.is.a('string');
    }

    if (expected.hasOwnProperty('miiversePostUrl')) {
        expect(actual).to.have.property('miiversePostUrl', expected.miiversePostUrl);
    } else {
        expect(actual).to.have.property('miiversePostUrl').that.is.a('string');
    }

    if (expected.hasOwnProperty('players')) {
        expect(actual).to.have.property('players', expected.players);
    } else {
        expect(actual).to.have.property('players').that.is.a('number');
    }

    if (expected.hasOwnProperty('recentPlayers')) {
        expect(actual).to.have.property('recentPlayers').that.deep.equals(expected.recentPlayers);
    } else if (actual.hasOwnProperty('recentPlayers')) {
        expect(actual).to.have.property('recentPlayers').that.is.an('array');
        actual.recentPlayers.forEach(player => {
            expect(player).to.be.an('object');
            expect(player).to.have.property('country').that.is.a('string');
            expect(player).to.have.property('miiIconUrl').that.is.a('string');
            expect(player).to.have.property('miiName').that.is.a('string');
        });
    }

    if (expected.hasOwnProperty('starredBy')) {
        expect(actual).to.have.property('starredBy').that.deep.equals(expected.starredBy);
    } else if (actual.hasOwnProperty('starredBy')) {
        expect(actual).to.have.property('starredBy').that.is.an('array');
        actual.starredBy.forEach(player => {
            expect(player).to.be.an('object');
            expect(player).to.have.property('country').that.is.a('string');
            expect(player).to.have.property('miiIconUrl').that.is.a('string');
            expect(player).to.have.property('miiName').that.is.a('string');
        });
    }

    if (expected.hasOwnProperty('stars')) {
        expect(actual).to.have.property('stars', expected.stars);
    } else {
        expect(actual).to.have.property('stars').that.is.a('number');
    }

    if (expected.hasOwnProperty('tag')) {
        expect(actual).to.have.property('tag', expected.tag);
    } else if (actual.hasOwnProperty('tag')) {
        expect(actual).to.have.property('tag').that.is.a('string');
    }

    if (expected.hasOwnProperty('thumbnailUrl')) {
        expect(actual).to.have.property('thumbnailUrl', expected.thumbnailUrl);
    } else {
        expect(actual).to.have.property('thumbnailUrl').that.is.a('string');
    }

    if (expected.hasOwnProperty('title')) {
        expect(actual).to.have.property('title', expected.title);
    } else {
        expect(actual).to.have.property('title').that.is.a('string');
    }

    if (expected.hasOwnProperty('tweets')) {
        expect(actual).to.have.property('tweets', expected.tweets);
    } else {
        expect(actual).to.have.property('tweets').that.is.a('number');
    }

    if (expected.hasOwnProperty('uploadDate')) {
        expect(actual).to.have.property('uploadDate').equalTime(expected.uploadDate);
    } else if (actual.hasOwnProperty('uploadDate')) {
        expect(actual).to.have.property('uploadDate').that.is.an.instanceOf(Date);
    }

    if (expected.hasOwnProperty('yourBestTime')) {
        expect(actual).to.have.property('yourBestTime', expected.yourBestTime);
    } else if (actual.hasOwnProperty('yourBestTime')) {
        expect(actual).to.have.property('yourBestTime').that.is.a('number');
    }

    if (expected.hasOwnProperty('worldRecord')) {
        expect(actual).to.have.property('worldRecord').that.deep.equals(expected.worldRecord);
    } else if (actual.hasOwnProperty('worldRecord')) {
        expect(actual).to.have.property('worldRecord').that.is.an('object');
        expect(actual.worldRecord).to.have.property('player').that.is.an('object');
        expect(actual.worldRecord.player).to.have.property('country').that.is.a('string');
        expect(actual.worldRecord.player).to.have.property('miiIconUrl').that.is.a('string');
        expect(actual.worldRecord.player).to.have.property('miiName').that.is.a('string');
        expect(actual.worldRecord).to.have.property('time').that.is.a('number');
    }
};

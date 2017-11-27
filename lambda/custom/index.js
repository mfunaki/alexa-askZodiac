'use strict';
const Alexa = require('alexa-sdk');
const APP_ID = 'amzn1.ask.skill.295afaaa-53f0-4d25-ad87-625a9e3c1384'; // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
    'ja-JP': {
        translation: {
            SKILL_NAME: '���ƃX�L��',
            WELCOME_MESSAGE: '%s�ւ悤�����B���܂�N�������Ă���������΁A�Ȃɂǂ��������ׂ��܂��B',
            WELCOME_REPROMPT: '�ڂ����g������m�肽�����́A�w���v�Ƃ���������ĉ������B',
            HELP_MESSAGE: '���܂�N�𐼗�⏺�a�A�����ł���������Ă��������B',
            HELP_REPROMPT: '�I���ۂɂ͏I���Ƃ���������Ă��������B',
            STOP_MESSAGE: '�܂����ڂɂ�����܂��傤�I',
        },
    },
};

const handlers = {
    'NewSession': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'LaunchRequest': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'StartOverIntent': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AskZodiacByADIntent': function () {
        var birthADYear = Number(this.event.request.intent.slots.BirthADYear.value);
        if (birthADYear < 100) {
            if (birthADYear <= 17) {
                birthADYear += 2000;
            } else {
                birthADYear += 1900;
            }
        }
        var output = composeOutput(birthADYear);
        this.response.speak(output);
        this.emit(':responseReady');
    },
    
    'AskZodiacByShowaIntent': function () {
        var birthShowaYear = Number(this.event.request.intent.slots.BirthShowaYear.value);
        
        var output = composeOutput(birthShowaYear + 1925);
        this.response.speak(output);
        this.emit(':responseReady');
    },
    'AskZodiacByHeiseiIntent': function () {
        var birthHeiseiYear = Number(this.event.request.intent.slots.BirthShowaYear.value);

        var output = composeOutput(birthHeiseiYear + 1988);
        this.response.speak(output);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'Unhandled': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
};

const zodiacTable = new Array('����', '�Ƃ�', '����', '���̂���',
        '�˂���', '����', '�Ƃ�', '������', '����', '�ւ�', '����', '�Ђ�');

function composeOutput(year) {
    var output = '����' + year + '�N�A';
    if (year < 1989) {
        output = output + '���a' + (year - 1925) + '�N';
    } else {
        output = output + '����' + (year - 1988) + '�N';
    }
    output = output + '���܂�̂��Ȃ��́A';
    output = output + zodiacTable[year % 12] + '�N�ł��B';
    
    return output;
}

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

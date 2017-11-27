'use strict';
const Alexa = require('alexa-sdk');
const APP_ID = 'amzn1.ask.skill.295afaaa-53f0-4d25-ad87-625a9e3c1384'; // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
    'ja-JP': {
        translation: {
            SKILL_NAME: 'えとスキル',
            WELCOME_MESSAGE: '%sへようこそ。生まれ年を言っていただければ、なにどしかお調べします。',
            WELCOME_REPROMPT: '詳しい使い方を知りたい時は、ヘルプとおっしゃって下さい。',
            HELP_MESSAGE: '生まれ年を西暦や昭和、平成でおっしゃってください。',
            HELP_REPROMPT: '終わる際には終了とおっしゃってください。',
            STOP_MESSAGE: 'またお目にかかりましょう！',
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

const zodiacTable = new Array('さる', 'とり', 'いぬ', 'いのしし',
        'ねずみ', 'うし', 'とら', 'うさぎ', 'たつ', 'へび', 'うま', 'ひつじ');

function composeOutput(year) {
    var output = '西暦' + year + '年、';
    if (year < 1989) {
        output = output + '昭和' + (year - 1925) + '年';
    } else {
        output = output + '平成' + (year - 1988) + '年';
    }
    output = output + '生まれのあなたは、';
    output = output + zodiacTable[year % 12] + '年です。';
    
    return output;
}

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

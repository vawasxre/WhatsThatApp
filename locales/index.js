import i18n from "ex-react-native-i18n";
import * as Localization from 'expo-localization';

import test from './test.json';  


i18n.translations = {
    test
}

export function getLanguage(){
    try{
        const choice = Localization.locale;
        console.log("Choice: " + choice);
        i18n.locale = choice.substr(0,2);
        i18n.initAsync()

    } catch (err){
        console.log("Error:" + err);
    }

}

export function translate(name){
    return i18n.translate(name);
}
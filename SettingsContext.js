// SettingsContext.js
import React, { createContext, useState } from 'react';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        Language: {
            translation: false,
            transliteration: false,
            language: 'en'
        },
        System: {
            textSize: '4xl',
            darkMode: false
        },
        About: {
            author: 'Mohammed Ahmed',
            version: 'v0.0.1'
        }
    });

    /* Toggle settings method 
    * @param | section: <any> field in $settings [e.g,. 'Language', 'System']
    * @param | key: <any> field to be toggled [e.g., 'translation', 'version']
    * 
    * @function | toggleSetting 
      * updater function which copies ...previoussettings 
      * section set key for setting to be updated (i.e., about: {about, version})
      * ...prevSetting[section] copies that sections state 
      * negate current value of key
    */
    const toggleSetting = (section, key) => {
        setSettings(prevSettings => ({
            ...prevSettings,
            [section]: {
                ...prevSettings[section],
                [key]: !prevSettings[section][key]
            }
        }));
    };

    return (
        // {children}: special prop supposed to repsented the wrapped content inside
        <SettingsContext.Provider value={{ settings, toggleSetting }}>
            {children}
        </SettingsContext.Provider>
    );
};
import React, { createContext, useState } from 'react';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        Language: {
            translation: false,
            transliteration: false,
            language: '',
            version: ''
        },
        System: {
            textSize: '4xl',
            darkMode: false
        },
        About: {
            author: 'Mohammed Ahmed',
            version: 'v0.0.2'
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

    /* function changes setting section[key] to key */
    const changeSetting = (section, key, value) => {
        setSettings(prevSettings => ({
            ...prevSettings,
            [section]: {
                ...prevSettings[section],
                [key]: value
            }
        }));
    };

    return (
        <SettingsContext.Provider value={{ settings, toggleSetting, changeSetting }}>
            {children}
        </SettingsContext.Provider>
    );
};


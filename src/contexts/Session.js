import { createContext, useState, useEffect } from 'react';
import { cloneDeep } from "../components/util";
import { firestore } from "../database/Firebase";
import { collection, getDocs, getDoc,  collectionGroup, doc,  where, query } from "firebase/firestore";
import defaultTranslations from './defaultTranslations.json';

const context_init = {
    project_id : "",
    splash_viewed : false,
    in_walk : false,
    signed_in : false,
    project_info : {}
};

export const SessionContext = createContext({
    data : {},
    setData : () => {}
});

export const SessionContextProvider = ({children}) => {
    const clean_obj         = cloneDeep(context_init);
    const [data, setData]                   = useState(clean_obj);
    const [slideOpen, setSlideOpen]         = useState(false);

    const [previewWalk, setPreviewWalk]         = useState(null);
    const [previewPhoto, setPreviewPhoto]       = useState(null);
    const [previewWalkID, setPreviewWalkID]     = useState(null);
    const [previewProjID, setPreviewProjID]     = useState(null);

    const [lastUploadsUpdated, setLastUploadsUpdated]   = useState(Date.now());

    const [selectedLanguage, setSelectedLanguage]       = useState('en');
    const [translations, setTranslations]               = useState(defaultTranslations);

    useEffect(() => {
        const fetchTranslations = async () => {
            const ovMetaRef     = collection(firestore, "ov_meta");
            const appDataRef    = doc(ovMetaRef, "app_data");

            try {
                const appDataSnapshot = await getDoc(appDataRef);
                if (appDataSnapshot.exists()) {
                    const appTextData = appDataSnapshot.get('app_text');
                    console.log("App Text Document:", appTextData);

                    // console.log("lets try this");
                    // console.log(appTextData["good_or_bad"]["ch"]);
                    setTranslations({ ...defaultTranslations, ...appTextData });

                    // refresh the defaultTranslations.json once in a while with this

                    // const englishTranslations   = Object.entries(appTextData).reduce((acc, [key, value]) => {
                    //     acc[key] = { "en": value.en };
                    //     return acc;
                    // }, {});

                    // let ordered = {};
                    // Object.keys(englishTranslations).sort().forEach(function(key) {
                    //     ordered[key] = englishTranslations[key];
                    // });

                    // console.log(JSON.stringify(ordered, null, 2));
                }
            } catch (error) {
                console.error("Error getting documents: ", error);
            }
        };

        fetchTranslations();
    }, []);

    const handleLanguageChange = (language) => {
        setSelectedLanguage(language);
        console.log("new preferred langauge", language);
    };

    // This function can be called to update lastUpdated
    const updateLastUploadsUpdated = () => {
        setLastUploadsUpdated(Date.now());
    };

    const resetData = () => {
        const clean_obj     = cloneDeep(context_init);
        setData(clean_obj);
        setSlideOpen(false);

        setPreviewWalk(null);
        setPreviewPhoto(null);
        setPreviewProjID(null);
        setPreviewWalkID(null);
    }

    const getTranslation = (key) => {
        if (!translations[key]) return '';
        return translations[key][selectedLanguage] || translations[key]['en'] || '';
    };

    return (
        <SessionContext.Provider value={{data, setData,selectedLanguage,handleLanguageChange, translations, getTranslation, resetData, slideOpen, setSlideOpen, previewPhoto, setPreviewPhoto, previewWalk, setPreviewWalk, previewWalkID, setPreviewWalkID, previewProjID, setPreviewProjID, lastUploadsUpdated, updateLastUploadsUpdated}}>
            {children}
        </SessionContext.Provider>
    );
}
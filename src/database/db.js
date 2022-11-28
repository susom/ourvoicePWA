//Dexie is a wrapper library for indexDB
import Dexie from 'dexie';

//Our Voice APP uses 3 separate data
export const db_walks = new Dexie('ov_walks');
db_walks.version(1).stores({
    walks :  '++id, device, photos, geotags, project_id, lang, timestamp'
});

export const db_project = new Dexie('ov_project');
db_project.version(1).stores({
    active_project  : 'project_id, expire_date, name, languages, audio_comments, text_comments, thumbs, custom_take_photo_text, show_project_tags, tags, ov_meta, timestamp'
});

export const db_logs = new Dexie('ov_logs');
db_logs.version(1).stores({
    logs :  '++id, project_id, walk_id, type, message'
});
import { useState, useEffect } from 'react';
import type { Folder } from '../types/folder';
import { memberFolderTemplates, accountFolderTemplates } from '../data/folderTemplates';

export function useFolderTemplates(entityType: 'member' | 'account', entityId: string | null) {
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    if (!entityId) {
      setFolders([]);
      return;
    }

    // Convert templates to folders
    const templates = entityType === 'member' ? memberFolderTemplates : accountFolderTemplates;
    const convertedFolders: Folder[] = [];

    const convertTemplate = (template: typeof templates[0], parentId: string | null = null) => {
      const folder: Folder = {
        id: `${template.id}_${entityId}`,
        name: template.name,
        isOptional: template.isOptional,
        parentId,
        entityType
      };
      convertedFolders.push(folder);

      template.subfolders?.forEach(subfolder => {
        convertTemplate(subfolder, folder.id);
      });
    };

    templates.forEach(template => convertTemplate(template));
    setFolders(convertedFolders);
  }, [entityType, entityId]);

  return folders;
}
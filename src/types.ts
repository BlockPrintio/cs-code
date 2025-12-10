export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  extension?: string;
  content?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  language: string;
  lastEdited: string;
  branch: string;
  status: 'active' | 'archived' | 'building';
  files: FileNode[];
}

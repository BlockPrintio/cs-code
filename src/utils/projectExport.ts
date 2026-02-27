import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { FileNode, Project } from '../types';

interface FlatFile {
  path: string;
  content: string;
}

const slugify = (value: string) => {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/(^-|-$)+/g, '') || 'project';
};

const flattenFiles = (nodes: FileNode[], basePath: string = ''): FlatFile[] => {
  const files: FlatFile[] = [];
  nodes.forEach(node => {
    if (node.type === 'folder' && node.children) {
      files.push(...flattenFiles(node.children, `${basePath}${node.name}/`));
    }
    if (node.type === 'file') {
      files.push({
        path: `${basePath}${node.name}`,
        content: node.content || ''
      });
    }
  });
  return files;
};

export async function downloadProjectZip(project: Project) {
  const zip = new JSZip();
  const files = flattenFiles(project.files);
  files.forEach(file => {
    zip.file(file.path, file.content);
  });
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${slugify(project.title)}.zip`);
}

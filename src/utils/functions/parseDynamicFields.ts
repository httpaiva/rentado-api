type Node = Record<string, unknown>;

export function parseDynamicFields(input: string): string {
  const parsedInput: Node[] = JSON.parse(input);

  function transformNodes(nodes: Node[]): Node[] {
    return nodes.map((node) => {
      if (node.type === 'dynamicField') {
        // Transform dynamicField to paragraph
        return { text: node.value ? `{{${node.value}}}` : '' };
      }

      // Recursively transform children if present
      if (node.children && Array.isArray(node.children)) {
        return {
          ...node,
          children: transformNodes(node.children),
        };
      }

      return node;
    });
  }

  return JSON.stringify(transformNodes(parsedInput));
}

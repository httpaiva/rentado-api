type Node = {
  type: string;
  children: Array<{ text: string } | Node>;
  name?: string;
  value?: string;
  fieldName?: string;
};

export function parseDynamicFields(input: string): string {
  const parsedInput: Node[] = JSON.parse(input);

  function transformNodes(nodes: Node[]): Node[] {
    return nodes.map((node) => {
      if (node.type === 'dynamicField') {
        // Transform dynamicField to paragraph
        return {
          type: 'paragraph',
          children: [{ text: node.value ? `{{${node.value}}}` : '' }],
        };
      }

      // Recursively transform children if present
      if (node.children && Array.isArray(node.children)) {
        return {
          ...node,
          //@ts-expect-error - TS can't infer the type of the children array
          children: transformNodes(node.children),
        };
      }

      return node;
    });
  }

  return JSON.stringify(transformNodes(parsedInput));
}

// Keep Markdown tables semantic while allowing keyboard and touch scrolling.
export default function responsiveTables() {
  return (tree) => {
    function visit(node) {
      if (!node.children) return;
      node.children = node.children.map(child => {
        if (child.type === 'element' && child.tagName === 'table') {
          return { type: 'element', tagName: 'div', properties: { className: ['table-scroll'], tabIndex: 0, role: 'region', ariaLabel: 'Scrollable comparison table' }, children: [child] };
        }
        visit(child); return child;
      });
    }
    visit(tree);
  };
}
